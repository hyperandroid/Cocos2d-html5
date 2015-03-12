/**
 * License: see license.txt file.
 */


/// <reference path="../math/Color.ts"/>
/// <reference path="../math/Rectangle.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../node/Sprite.ts"/>
/// <reference path="../node/sprite/SpriteFrame.ts"/>
/// <reference path="./RenderingContext.ts"/>
/// <reference path="./RenderingContextSnapshot.ts"/>
/// <reference path="./WebGLState.ts"/>
/// <reference path="./Texture2D.ts"/>
/// <reference path="./GeometryBatcher.ts"/>
/// <reference path="./shader/AbstractShader.ts"/>
/// <reference path="./shader/SolidColorShader.ts"/>
/// <reference path="./shader/TextureShader.ts"/>
/// <reference path="./shader/FastTextureShader.ts"/>
/// <reference path="./shader/TexturePatternShader.ts"/>
/// <reference path="./shader/Uniform.ts"/>

module cc.render {

    "use strict";

    import Color = cc.math.Color;
    import Rectangle = cc.math.Rectangle;
    import Sprite = cc.node.Sprite;
    import RenderingContext = cc.render.RenderingContext;
    import RenderingContextSnapshot = cc.render.RenderingContextSnapshot;
    import GeometryBatcher = cc.render.GeometryBatcher;
    import AbstractShader = cc.render.shader.AbstractShader;
    import SolidColorShader = cc.render.shader.SolidColorShader;
    import TextureShader = cc.render.shader.TextureShader;
    import TexturePatternShader = cc.render.shader.TexturePatternShader;
    import FastTextureShader = cc.render.shader.FastTextureShader;
    import Matrix3= cc.math.Matrix3;
    import WebGLState= cc.render.WebGLState;
    import SpriteFrame = cc.node.sprite.SpriteFrame;

    /**
     * Decorated WebGL Rendering Context fill style types.
     * @tsenum cc.render.FillStyleType
     */
    export enum FillStyleType {
        COLOR = 0,
        IMAGE = 1,
        IMAGEFAST = 2,
        PATTERN_REPEAT= 3,
        MESH = 4
    }

    /**
     * Shader types
     * @tsenum cc.render.ShaderType
     */
    export enum ShaderType {
        COLOR = 0,
        IMAGE = 1,
        IMAGEFAST = 2,
        PATTERN_REPEAT= 3,
        MESH = 4
    }

    /**
     * BIT Flag for WebGL enabled/disabled flags.
     * @tsenum cc.render.WEBGL_FLAGS
     */
    export enum WEBGL_FLAGS {
        BLEND = 1,
        DEPTH_TEST = 2,
        CULL_FACE = 4
    }

    var __mat3 : Float32Array = new Float32Array([1.0,0,0, 0,1.0,0, 0,0,1.0]);
    var __mat4 : Float32Array= new Float32Array( [
        1.0, 0, 0, 0,
        0, 1.0, 0, 0,
        0, 0, 1.0, 0,
        0, 0, 0, 1.0 ] );


    /**
     * @class cc.render.DecoratedWebGLRenderingContext
     * @classdesc
     *
     * This object wraps a 3D canvas context (webgl) and exposes a canvas like 2d rendering API.
     * The implementation should be extremely efficient by:
     *   <li>lazily set every property.
     *   <li>batch all drawing operations as much as possible.
     *   <li>ping pong between buffers
     *
     * <br>
     * All this would be transparent for the developer and happen automatically. For example, is a value is set to
     * <code>globalCompositeOperation</code> (set a blend mode), a gl call is not immediately executed, which prevents
     * consecutive calls to <code>globalCompositeOperation</code> to make explicit gl calls. Instead, the gl call
     * is deferred until the moment when some geometry will happen, for example, a fillRect call.
     * <br>
     * This mechanism is set for every potential flushing operation like changing fillStyle, compisite, textures, etc.
     */
    export class DecoratedWebGLRenderingContext implements RenderingContext {

        /**
         * Enable UNPACK_PREMULTIPLY_ALPHA_WEBGL for textures. False by default.
         * @member cc.render.DecoratedWebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL
         * @type {boolean}
         */
        static UNPACK_PREMULTIPLY_ALPHA_WEBGL : boolean = false;

        /**
         * Enable antialias. False by default
         * @member cc.render.DecoratedWebGLRenderingContext.ANTIALIAS
         * @type {boolean}
         */
        static ANTIALIAS : boolean = false;

        /**
         * Enable context-document alpha blending. False by default.
         * @member cc.render.DecoratedWebGLRenderingContext.CTX_ALPHA
         * @type {boolean}
         */
        static CTX_ALPHA : boolean = false;

        /**
         * Current rendering context data.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentContextSnapshot
         * @type {cc.render.RenderingContextSnapshot}
         * @private
         */
        _currentContextSnapshot : RenderingContextSnapshot = null;

        /**
         * Each call to save will create a new rendering context snapshot that will be tracked here.
         * @member cc.render.DecoratedWebGLRenderingContext#_contextSnapshots
         * @type {Array<cc.render.RenderingContextSnapshot>}
         * @private
         */
        _contextSnapshots : Array<RenderingContextSnapshot> = [];

        /**
         * if _currentFillStyleType===COLOR, this is the current color.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentFillStyleColor
         * @type {Float32Array}
         * @private
         */
        _currentFillStyleColor : Float32Array = new Float32Array([0.0,0.0,0.0,1.0]);

        _currentFillStylePattern : cc.render.Pattern = null;

        /**
         * Current fill style type. The style type reflects what shader is currently set for rendering.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentFillStyleType
         * @type {cc.render.FillStyleType}
         * @private
         */
        _currentFillStyleType : FillStyleType = FillStyleType.COLOR;

        _currentTintColor : Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);

        /**
         * Last global composite operation set.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentGlobalCompositeOperation
         * @type {string}
         * @private
         */
        _currentGlobalCompositeOperation : cc.render.CompositeOperation = cc.render.CompositeOperation.source_over;

        /**
         * Internal rendering shaders.
         * @member cc.render.DecoratedWebGLRenderingContext#_shaders
         * @type {Array<cc.render.shader.SolidColorShader>}
         * @private
         */
        _shaders : Array<AbstractShader> = [];

        /**
         * Geometry batcher.
         * @member cc.render.DecoratedWebGLRenderingContext#_batcher
         * @type {cc.render.GeometryBatcher}
         * @private
         */
        _batcher : GeometryBatcher = null;

        _webglState : WebGLState = null;

        _width : number = 0;

        _height : number = 0;

        _renderer:Renderer= null;

        /**
         * Rendering surface (canvas object)
         * @member cc.render.DecoratedWebGLRenderingContext#_canvas
         * @type {HTMLCanvasElement}
         * @private
         */
        _canvas:HTMLCanvasElement= null;

        /**
         * Create a new DecoratedWebGLRenderingContext instance.
         * @method cc.render.DecoratedWebGLRenderingContext#constructor
         * @param r {cc.render.Renderer}
         */
        constructor( r:Renderer ) {

            this._renderer= r;
            this._canvas= r._surface;

            this.__initContext();

            this._batcher= new GeometryBatcher( this._webglState );

            this._currentContextSnapshot= new RenderingContextSnapshot();
            this._contextSnapshots.push(this._currentContextSnapshot);

            this.__createRenderingShaders(this._canvas.width, this._canvas.height);

            this.__setGlobalCompositeOperation();
        }

        __initContext() {

            var _canvas= this._canvas;

            function createContext() : WebGLRenderingContext {

                var _gl= null;
                try {
                    var obj = {
                        premultipliedAlpha: DecoratedWebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                        antialias: DecoratedWebGLRenderingContext.ANTIALIAS,
                        alpha: DecoratedWebGLRenderingContext.CTX_ALPHA,
                        stencil: true
                    };

                    _gl = _canvas.getContext("webgl", obj) || _canvas.getContext("experimental-webgl", obj);
                    _gl.pixelStorei(
                        _gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                        DecoratedWebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL ? 1 : 0);
                }
                catch (e) {
                    alert("WebGL context error");
                }

                return _gl;
            }

            function initializeContext(webglState : WebGLState) {

                var _gl= webglState._gl;

                // Set clear color to black, fully transparent
                webglState.clearColor(0,0,0,0);
                // Disable depth testing
                webglState.disable(_gl.DEPTH_TEST);
                // Disable back face culling
                webglState.disable(_gl.CULL_FACE);
                // Clear the color as well as the depth buffer.
                webglState.clear(_gl.COLOR_BUFFER_BIT);

                webglState.viewport(0, 0, _canvas.width, _canvas.height);
            }

            this._width= this._canvas.width;
            this._height= this._canvas.height;

            this._webglState = new WebGLState(createContext());

            initializeContext(this._webglState);
        }

        clear() {
            var gl= this._webglState;

            var flags= gl._gl.COLOR_BUFFER_BIT;
            if (gl.flagEnabled( gl._gl.STENCIL_TEST) ) {
                flags |= gl._gl.STENCIL_BUFFER_BIT;
            }
            gl.clear(flags);
        }

        getWidth() : number {
            return this._width;
        }

        getHeight() : number {
            return this._height;
        }

        __createProjection( w:number, h:number ) : Float32Array[] {
            /**
             * Make an orthographics projection matrix.
             * @param left {number}
             * @param right {number}
             * @param bottom {number}
             * @param top {number}
             * @param znear {number}
             * @param zfar {number}
             *
             * @returns {Float32Array}
             */
            function createOrthographicProjectionMatrix(left, right, bottom, top, znear, zfar) {
                var tx = -(right + left) / (right - left);
                var ty = -(top + bottom) / (top - bottom);
                var tz = -(zfar + znear) / (zfar - znear);

                return new Float32Array(
                    [ 2 / (right - left), 0, 0, 0,
                      0, 2 / (top - bottom), 0, 0,
                      0, 0, -2 / (zfar - znear), 0,
                        tx,ty,tz,1 ]

                );
            }

            var opm : Float32Array[]= [];
            opm.push (createOrthographicProjectionMatrix(0, w, h, 0, -1, 1));
            opm.push(createOrthographicProjectionMatrix(0, w, 0, h, -1, 1));

            return opm;
        }

        /**
         * Create internal rendering shaders.
         * Do not call directly.
         * @method cc.render.DecoratedWebGLRenderingContext#__createRenderingShaders
         * @param w {number}
         * @param h {number}
         * @private
         */
        __createRenderingShaders(w:number, h:number) : void {

            /**
             * Never change the order the shaders are pushed.
             * BUGBUG change the _shader array in favor of an associative collection.
             */
            this._shaders.push( new SolidColorShader( this._webglState ) );
            this._shaders.push( new TextureShader( this._webglState ) );
            this._shaders.push( new FastTextureShader( this._webglState ) );
            this._shaders.push( new TexturePatternShader( this._webglState ) );
            this._shaders.push( new cc.render.shader.MeshShader( this._webglState ) );

            this.__setShadersProjection(w,h);

            this._shaders[0].useProgram();
        }

        __setShadersProjection(w:number, h:number) {
            var opms:Float32Array[]= this.__createProjection( w, h );
            var opm= opms[0];
            var opm_inverse= opms[1];

            for( var i=0; i<this._shaders.length; i++ ) {
                if ( i!==2 ) {

                    this._shaders[i]._uniformProjection.setValue(opm);
                } else {

                    /**
                     * FastShader needs different projection matrices because quad coordinates are calculated in the shader,
                     * and not in the client. Thus it is mandatory to send the correct projection matrix based on the
                     * y-axis rendering origin.
                     */
                    this._shaders[2]._uniformProjection.setValue( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_TOP ? opm : opm_inverse );
                }
            }
        }

        /**
         * Get the rendering surface object (canvas).
         * @method cc.render.DecoratedWebGLRenderingContext#get:canvas
         * @returns {HTMLCanvasElement}
         */
        get canvas() {
            return this._canvas;
        }

        /**
         * Set the current rendering tint color. Tint color is an array of 4 components for rgba. Values 0..1
         * @method cc.render.DecoratedWebGLRenderingContext#set:tintColor
         * @param color {cc.math.Color}
         */
        setTintColor( color : Color ) {
            this._currentTintColor= color._color;
        }

        set tintColor( color:Color ) {
            this._currentTintColor= color._color;
        }

        setGlobalAlpha( v : number ) {
            this._currentContextSnapshot._globalAlpha= v;
        }

        getGlobalAlpha() : number {
            return this._currentContextSnapshot._globalAlpha;
        }

        /**
         * Set the current rendering composite operation (blend mode).
         * The value is any of:
         *
         * "source-over", "source-out", "source-in", "source-atop", "destination-over", "destination-in",
         * "destination-out", "destination-atop", "multiply", "screen", "copy", "lighter", "darker", "xor", "add"
         *
         * @method cc.render.DecoratedWebGLRenderingContext#set:globalCompositeOperation
         * @param gco {cc.render.CompositeOperation}
         */
        setCompositeOperation( gco : cc.render.CompositeOperation ) {
            this._currentGlobalCompositeOperation= gco;
        }

        getCompositeOperation() : cc.render.CompositeOperation {
            return this._currentGlobalCompositeOperation;
        }

        /**
         * Internal blending mode set.
         * This function is called not when the blending mode is set, but when an actual geometry operation is about
         * to happen.
         * @method cc.render.DecoratedWebGLRenderingContext#__setGlobalCompositeOperation
         * @private
         */
        __setGlobalCompositeOperation() {

            var gl = this._webglState._gl;

            this._webglState.enable( gl.BLEND );

            switch (this._currentGlobalCompositeOperation) {
                case cc.render.CompositeOperation.source_over:
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.source_out:
                    gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ZERO);
                    break;
                case cc.render.CompositeOperation.source_in:
                    gl.blendFunc(gl.DST_ALPHA, gl.ZERO);
                    break;
                case cc.render.CompositeOperation.source_atop:
                    gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.destination_over:
                    gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA);
                    break;
                case cc.render.CompositeOperation.destination_in:
                    gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.destination_out:
                    gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.destination_atop:
                    gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.multiply:
                    gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.screen:
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
                    break;
                case cc.render.CompositeOperation.copy:
                    gl.blendFunc(gl.ONE, gl.ZERO);
                    break;
                case cc.render.CompositeOperation.lighter:
                    gl.blendFunc(gl.ONE, gl.ONE);
                    break;
                case cc.render.CompositeOperation.darker:
                    gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.xor:
                    gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case cc.render.CompositeOperation.add:
                    gl.blendFunc( gl.SRC_ALPHA, gl.DST_ALPHA );
                    break;
                default:
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            }

            this._currentContextSnapshot._globalCompositeOperation= this._currentGlobalCompositeOperation;
        }

        /**
         * Set the current transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#setTransform
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        setTransform( a : number, b : number, c : number, d : number, tx : number, ty : number ) : void {
            Matrix3.setTransform( this._currentContextSnapshot._currentMatrix, a,b,c,d,tx,ty );
        }

        /**
         * Concatenate current transformation matrix with the given matrix coeficients.
         * @method cc.render.DecoratedWebGLRenderingContext#transform
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        transform( a : number, b : number, c : number, d : number, tx : number, ty : number ) : void {
            Matrix3.transform( this._currentContextSnapshot._currentMatrix, a,b,c,d,tx,ty );
        }

        /**
         * Fill an area with the current fillStyle.
         * If w or h are <= 0 the call does nothing.
         * @method cc.render.DecoratedWebGLRenderingContext#fillRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        fillRect( x : number, y : number, w : number, h : number ) : void {

            if (w<=0 || h<=0) {
                return;
            }

            this.__flushFillRectIfNeeded();

            if ( this._batcher.batchRect(x, y, w, h, this._currentContextSnapshot) ) {
                this.flush();
            }
        }

        drawTextureUnsafe( texture:Texture2D, sx: number, sy:number, sw?:number, sh?:number, dx?: number, dy?:number, dw?:number, dh?:number  ) : void {

        }

        drawTexture( texture:Texture2D, sx: number, sy:number, sw?:number, sh?:number, dx?: number, dy?:number, dw?:number, dh?:number  ) : void {

            var ti:Texture2D= texture;
            var textureId : WebGLTexture = ti._glId;

            // no texture info, or invalid gl texture id. do nothing.
            if ( textureId===null ) {
                // BUGBUG refactor this
                cc.Debug.warn(" --- lazy image to texture call.  --- deprecated and dangerous.");
                ti.__setAsGLTexture( this._webglState );
                textureId= ti._glId;
            }

            this.__drawImageFlushIfNeeded( textureId );

            var _sx : number;
            var _sy : number;
            var _sw : number;
            var _sh : number;
            var _dx : number;
            var _dy : number;
            var _dw : number;
            var _dh : number;

            if ( arguments.length>=9 ) {


                if ( ti._invertedY ) {
                    sy = ti._imageHeight - (ti._offsetY + sy) - sh;
                }

                _sy = (sy + ti._offsetY) / ti._textureHeight;
                _sx = (sx + ti._offsetX) / ti._textureWidth;
                _sw = (sx + sw + ti._offsetX) / ti._textureWidth;
                _sh = (sy + sh + ti._offsetY) / ti._textureHeight;

                _dx= dx;
                _dy= dy;
                _dw= dw;
                _dh= dh;

            } else if ( arguments.length>=5 ) {

                _dx = sx;
                _dy = sy;
                _dw = sw;
                _dh = sh;

                _sx = ti._u0;
                _sy = ti._v0;
                _sw = ti._u1;
                _sh = ti._v1;

            } else {
                
                _dx = sx;
                _dy = sy;
                _dw= ti._imageWidth;
                _dh= ti._imageHeight;

                _sx = ti._u0;
                _sy = ti._v0;
                _sw = ti._u1;
                _sh = ti._v1;
            }


            if ( this._batcher.batchRectWithTexture(
                _dx,_dy,_dw,_dh,this._currentContextSnapshot,
                _sx,_sy,_sw,_sh ) ) {

                this.flush();

            }
        }

        batchGeometryWithSprite( sprite:cc.node.Sprite, transposed:boolean ) {

            var frame:SpriteFrame = sprite._spriteFrame;
            var rect:Rectangle= frame._normalizedRect;

            var u0= rect.x;
            var v0= rect.y;
            var u1= rect.x1;
            var v1= rect.y1;

            if ( transposed ) {
                // PENDING implement rotation
            }

            if ( sprite.flippedX ) {
                var itmp:number= u0;
                u0= u1;
                u1= itmp;
            }
            if ( sprite.flippedY ) {
                var itmp:number= v0;
                v0= v1;
                v1= itmp;
            }

            this.__drawImageFlushIfNeeded( frame._texture._glId );

            if (this._batcher.batchRectGeometryWithTexture( sprite._BBVertices, u0,v0,u1,v1, this._currentContextSnapshot )) {
                this.flush();
            }
        }

        batchGeometryWithSpriteFast( sprite:cc.node.Sprite ) {

            var frame:SpriteFrame = sprite._spriteFrame;
            var rect:Rectangle= frame._normalizedRect;

            var u0= rect.x;
            var v0= rect.y;
            var u1= rect.x1;
            var v1= rect.y1;

            if ( sprite.flippedX ) {
                var itmp:number= u0;
                u0= u1;
                u1= itmp;
            }
            if ( sprite.flippedY ) {
                var itmp:number= v0;
                v0= v1;
                v1= itmp;
            }

            this.__drawImageFastFlushIfNeeded( frame._texture._glId );

            if (this._batcher.batchRectGeometryWithSpriteFast( sprite, u0,v0,u1,v1, this._currentContextSnapshot )) {
                this.flush();
            }
        }

        /**
         * Translate the current rendering context transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#translate
         * @param x {number}
         * @param y {number}
         */
        translate( x : number, y : number ) : void {
            Matrix3.setTranslate(__mat3, x, y);
            Matrix3.multiply( this._currentContextSnapshot._currentMatrix, __mat3 );
        }

        /**
         * Rotate the current rendering context transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#rotate
         * @param angle {number} angle in radians.
         */
        rotate( angle : number ) : void {
            Matrix3.setRotate(__mat3, angle);
            Matrix3.multiply( this._currentContextSnapshot._currentMatrix, __mat3 );
        }

        /**
         * Scale the current rendering context transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#scale
         * @param x {number} scale x axis.
         * @param y {number} scale y axis.
         */
        scale( x : number, y : number ) : void {
            Matrix3.setScale(__mat3, x, y);
            Matrix3.multiply( this._currentContextSnapshot._currentMatrix, __mat3 );
        }

        /**
         * Flush the content geometry, color and texture to the screen.
         * @member cc.render.DecoratedWebGLRenderingContext#flush
         */
        flush( ) : void {

            this._batcher.flush( this._shaders[ this._currentContextSnapshot._currentFillStyleType ], this._currentContextSnapshot );

//            this._debugInfo._draws++;
        }

        resize( ) {
            this.__initContext();
            this.__setShadersProjection(this._canvas.width, this._canvas.height);
        }

        getUnitsFactor() : number {
            return this._renderer.getUnitsFactor();
        }

        /**
         * Get RenderingContext type.
         * @member cc.render.DecoratedWebGLRenderingContext#get:type
         * @returns {number} cc.render.RENDERER_TYPE_WEBGL or cc.render.RENDERER_TYPE_CANVAS
         */
        type : number= cc.render.RENDERER_TYPE_WEBGL;

        /**
         * @method cc.render.DecoratedWebGLRenderingContext#__drawImageFlushIfNeeded
         * @param textureId {WebGLTexture}
         * @private
         */
        __drawImageFastFlushIfNeeded( textureId : WebGLTexture ) : void {
            this.__drawImageFlushIfNeededImpl( FillStyleType.IMAGEFAST, this._shaders[ ShaderType.IMAGEFAST ], textureId );
        }

        /**
         * @method cc.render.DecoratedWebGLRenderingContext#__drawImageFlushIfNeeded
         * @param textureId {WebGLTexture}
         * @private
         */
        __drawImageFlushIfNeeded( textureId : WebGLTexture ) : void {
            this.__drawImageFlushIfNeededImpl(FillStyleType.IMAGE, this._shaders[ShaderType.IMAGE], textureId);
        }

        __drawImageFlushIfNeededImpl( fillStyleType : FillStyleType, shader:AbstractShader, textureId:WebGLTexture) {

            if ( this._currentContextSnapshot._currentFillStyleType!==fillStyleType ) {

                this.flush();

                this.__setCurrentFillStyleType( fillStyleType );
                this._currentContextSnapshot._tintColor= this._currentTintColor;

                (<any>shader)._uniformTextureSampler.setValue( 0 );
                this._webglState.setTexture( 0, textureId );

            } else {

                // different textures ? flush.
                if ( this._webglState._currentTexture !== textureId ) {
                    this.flush();
                    (<any>shader)._uniformTextureSampler.setValue( 0 );
                    this._webglState.setTexture( 0, textureId );
                }

                this._currentContextSnapshot._tintColor= this._currentTintColor;

                this.__compositeFlushIfNeeded();

            }
        }

        __flushFillRectIfNeeded() {

            if ( this._currentContextSnapshot._currentFillStyleType!==this._currentFillStyleType ) {
                this.flush();

                this.__setCurrentFillStyleType( this._currentFillStyleType );
            }

            this._currentContextSnapshot._fillStyleColor= this._currentFillStyleColor;
            this._currentContextSnapshot._fillStylePattern= this._currentFillStylePattern;
            this._currentContextSnapshot._tintColor= this._currentTintColor;

        }

        __compositeFlushIfNeeded() {
            if ( this._currentGlobalCompositeOperation!==this._currentContextSnapshot._globalCompositeOperation ) {
                this.flush();
                this.__setGlobalCompositeOperation();
            }
        }

        /**
         * @method cc.render.DecoratedWebGLRenderingContext#__setCurrentFillStyleType
         * @param f {cc.render.FillStyleType}
         * @private
         */
        __setCurrentFillStyleType( f : FillStyleType ) : void {
            this._shaders[ this._currentContextSnapshot._currentFillStyleType ].notUseProgram();
            this._shaders[ f ].useProgram();
            this._currentContextSnapshot._currentFillStyleType= f;
            this._currentFillStyleType= f;
        }

        setFillStyleColor( color:Color ) {
            this._currentFillStyleColor= color._color;
            this._currentFillStyleType= cc.render.FillStyleType.COLOR;
        }

        setFillStyleColorArray( colorArray:Float32Array ) {
            this._currentFillStyleColor= colorArray;
            this._currentFillStyleType= cc.render.FillStyleType.COLOR;
        }

        setFillStylePattern( pattern:Pattern ) {
            // BUGBUG change for actual pattern type
            this._currentFillStyleType= cc.render.FillStyleType.PATTERN_REPEAT;
            this._currentFillStylePattern= pattern;
        }

        beginPath() {

        }

        stroke() {

        }

        moveTo(x:number, y:number) {

        }

        lineTo(x:number, y:number) {

        }

        save() {

        }

        restore() {

        }

        drawMesh( geometry:Float32Array, uv:Float32Array, indices:Uint32Array, color:number, texture:Texture2D ) {

            this.__checkMeshFlushConditions( texture._glId, color );
            this._batcher.batchMesh( geometry, uv, indices, color, this._currentContextSnapshot );
            this.flush();
        }

        __checkMeshFlushConditions( textureId:WebGLTexture, color:number ) {

            if ( this._currentContextSnapshot._currentFillStyleType!==FillStyleType.MESH ) {
                this.flush();
                this.__setCurrentFillStyleType( FillStyleType.MESH );
            }

            var shader= this._shaders[ShaderType.MESH];

            shader.mat4_from_mat3( this._currentContextSnapshot._currentMatrix, __mat4 );

            var r= (color>>24)&0xff;
            var g= (color>>16)&0xff;
            var b= (color>>8)&0xff;
            var a= (color)&0xff;

            (<any>shader)._uniformTransform.setValue( __mat4 );
            (<any>shader)._uniformTextureSampler.setValue( 0 );
            (<any>shader)._uniformColor.setValue( [r,g,b,a] );
            this._webglState.setTexture( 0, textureId );

        }
    }
}