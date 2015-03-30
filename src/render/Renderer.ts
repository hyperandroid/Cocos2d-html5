/**
 * License: see license.txt file.
 */


/// <reference path="../math/Dimension.ts"/>
/// <reference path="../math/Color.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="./RenderingContext.ts"/>
/// <reference path="./ScaleManager.ts"/>
/// <reference path="./Texture2D.ts"/>
/// <reference path="./DecoratedWebGLRenderingContext.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="../node/sprite/SpriteFrame.ts"/>
/// <reference path="../plugin/asset/AssetManager.ts"/>

module cc.render {

    export type RendererResizedCallback= (uw:number, uh:number, puw:number, puh:number, w:number, h:number, sceneHint:cc.render.ScaleContentSceneHint)=>any;

    "use strict";

    export var ORIGIN_BOTTOM = 1;
    export var ORIGIN_TOP = 0;

    /**
     * This flag sets renderer's y axis origin to be on top or bottom (y axis increases up or downwards.
     * <p>
     * Bottom is default's open/webgl while top is canvas' default.
     * <li>The default for CocosJS engine is bottom
     * <li>Setting this flag will affect both renderer types.
     * <li>This flag must be set BEFORE creating a renderer object.
     * <p>
     *     Performance considerations.
     * <p>
     *     While changing this flag for a WebGL renderer has no impact in performance, this is not the case for Canvas.
     *     If (as it is by default) bottom is specified for the renderer origin, there's an important performance penalty.
     *     This is mainly due to the fact that for each node, its coordinate system must be inverted, and thus an extra
     *     call to concatenate the current transformation matrix with the inversion matrix must be performed.
     *     In my MBA (core i7 dual core 2Ghz), with 3000 sprites in canvas the difference can be up to 8 fps. <br>
     *     There could be some solutions to avoid this extra transformation call though:
     *     <li>Invert all your images at compile time. Images are already flipped vertically before loading.
     *     <li>Invert all your images at load time. Extra memory, and extra bootstrapping time.
     *     <li>Change the y axis orientation to cc.render.ORIGIN_BOTTOM, and avoid the extra call. This will work for both canvas and
     *         webgl rendering.
     * <p>
     *     In either case, right now, the system DOES apply the extra transformation, and the performance penalty is
     *     there.
     * <p>
     *     It is also important to note that the local coordinate system y-axis will for each node be positioned as well
     *     either at the top or the bottom of the node itself.
     *
     * @member cc.render.RENDER_ORIGIN
     * @type {number}
     */
    export var RENDER_ORIGIN:number=cc.render.ORIGIN_BOTTOM;

    export function autodetectRenderer( w:number, h:number, elem:string ) : cc.render.Renderer {

        w= w || 800;
        h= h || 600;

        // BORROWED from Mr Doob (mrdoob.com)
        var webgl = ( function () {
            var canvas= document.createElement("canvas");
            try {
                return !! (typeof (<any>window).WebGLRenderingContext!=="undefined") && (
                    canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
            } catch( e ) {
                return false;
            }
        })();

        if( webgl ) {
            return new cc.render.WebGLRenderer( w, h, <HTMLCanvasElement>document.getElementById(elem) );
        }

        return new cc.render.CanvasRenderer( w, h, <HTMLCanvasElement>document.getElementById(elem) );
    }

    import RenderingContext = cc.render.RenderingContext;
    import DecoratedWebGLRenderingContext = cc.render.DecoratedWebGLRenderingContext;
    import Node= cc.node.Node;
    import Dimension= cc.math.Dimension;
    import Texture2D= cc.render.Texture2D;

    /**
     * @class cc.render.Renderer
     * @classdesc
     *
     * Interface for any renderer.
     * Must be subclassed to build a canvas or gl renderer.
     *
     */
    export class Renderer {

        /**
         * Surface to render to.
         * @member cc.render.Renderer#_surface
         * @type {HTMLCanvasElement}
         * @private
         */
        _surface : HTMLCanvasElement = null;

        /**
         * Rendering context to render on the surface.
         * @member cc.render.Renderer#_renderingContext
         * @type {cc.render.RenderingContext}
         * @private
         */
        _renderingContext : RenderingContext= null;

        _dimension : Dimension = new Dimension();

        _addedToDOM : boolean = false;

        _scaleManager : cc.render.ScaleManager = null;
        _onContentScaled : RendererResizedCallback= null;

        /**
         * When scale content is enabled, this flag makes the canvas object to take over the whole screen and not
         * only the area that honors aspect ratio.
         * @member cc.render.Renderer#_adjustContentToFullScreen
         * @type {boolean}
         * @private
         */
        _adjustContentToFullScreen : boolean = false;

        _preferredUnits : cc.math.Dimension = null;

        _sceneHint : ScaleContentSceneHint = cc.render.ScaleContentSceneHint.CENTER;

        /**
         * Create a new Renderer instance.
         * @param w {width} surface pixels width
         * @param h {height} surface pixels height
         * @param surface {HTMLCanvasElement=} canvas object. @see {cc.render.Renderer#initialize}
         * @member cc.render.Renderer#constructor
         */
        constructor(w : number, h : number, surface? : HTMLCanvasElement) {

            this._surface= typeof surface!=="undefined" ? surface : document.createElement("canvas");
            this._surface.width= typeof w!=="undefined" ? w : 800;
            this._surface.height= typeof h!=="undefined" ? h : 600;

            this._preferredUnits= new Dimension();
            this._preferredUnits.set( w, h );
            this._dimension.set( w, h );

            var me= this;
            this._scaleManager= new cc.render.ScaleManager(this).
                onWindowResized( function(w:number, h:number) {

                    var uw= me._scaleManager._units.width;
                    var uh= me._scaleManager._units.height;

                    if ( me._adjustContentToFullScreen ) {

                        w= window.innerWidth;
                        h= window.innerHeight;
                    }

                    // preferred dimensions
                    me.setScaleContent( uw, uh, w, h );
                });

            this._addedToDOM= surface?true:false;

        }

        __calcPreferredUnits() : cc.math.Dimension {
            var d:cc.math.Dimension= new cc.math.Dimension();

            var units= this.getScaleManager()._units;

            if ( this.getScaleManager()._contentScaled ) {
                var ratio= Math.min( window.innerWidth/units.width, window.innerHeight/units.height );

                d.width= window.innerWidth/ratio;
                d.height= window.innerHeight/ratio;
            } else {
                d.width= units.width;
                d.height= units.height;
            }

            this._preferredUnits.set( d.width, d.height );

            return d;
        }


        adjustContentToFullScreen( hint:cc.render.ScaleContentSceneHint ) : Renderer {
            this._adjustContentToFullScreen= true;
            this._sceneHint= hint;
            return this;
        }

        onContentScaled( callback:RendererResizedCallback ) : Renderer {

            this._onContentScaled= callback;
            return this;
        }

        isAddedToDOM() : boolean {
            return this._addedToDOM;
        }

        addToDOM() {
            if (!this.isAddedToDOM()) {
                document.body.appendChild(this._surface);
                this._addedToDOM = true;
            }
        }

        /**
         * Get the rendering context. @see {cc.render.Renderer#getRenderingContext}
         * @method cc.render.Renderer#getRenderingContext
         * @returns {cc.render.RenderingContext}
         */
        getRenderingContext() : RenderingContext {
            return this._renderingContext;
        }

        /**
         * Render a node. @see {cc.render.Renderer#render}
         * @method cc.render.Renderer#render
         */
        render( node : Node ) {
            node.visit( this._renderingContext );
        }

        /**
         * Flush this renderer (push remaining content to the scene).
         * @method cc.render.Renderer#flush
         */
        flush() : void {
            this._renderingContext.flush();
        }

        getContentSize() : Dimension {
            return this._dimension.clone();
        }

        prepareTexture(texture:Texture2D) : void {

        }

        getScaleContentMatrix() : Float32Array {
            return this._scaleManager.getScaleContentMatrix();
        }

        /**
         * Return the internal scale management object.
         * This object handles all things relative to Renderer surface scale and on-screen positioning, as well as
         * orientation changes and content scale ratio calculations.
         * @method cc.node.Director#getScaleManager
         * @see cc.game.ScaleManager
         * @returns {cc.render.ScaleManager}
         */
        getScaleManager() : cc.render.ScaleManager {
            return this._scaleManager;
        }

        /**
         * Set renderer surface scale strategy.
         * @method cc.node.Director#setScaleStrategy
         * @param ss {cc.render.ScaleManagerStrategy} how renderer surface should me up/down scaled when the window
         *          changes size.
         * @param sp {cc.render.ScalePosition} how to position the renderer surface on the window object.
         */
        setScaleStrategy( ss:cc.render.ScaleManagerStrategy, sp:cc.render.ScalePosition ) {
            this._scaleManager.setScale(ss,sp);
        }

        /**
         * Set internal ratio to adjust screen pixels to game units.
         * A game, usually makes the assumption that one game unit maps directly to one screen pixel.
         * When we want to build better looking games which honor devicePixelRation, retina, etc. we need to undo
         * this direct assumption in favor of other better mechanisms.
         * This method undoes this mapping.
         * For example, my game is 8 by 5 meters and want to see it in a 960x640 pixels screen.
         * The difference between this method and <code>setScaleStrategy</code> is that this one acts in game content,
         * and setScaleStrategy on the renderer generated image.
         * @method cc.node.Director#setScaleContent
         * @see cc.game.ScaleManager
         * @param w {number} game units width
         * @param h {number} game units height
         * @param cw {number=} canvas width
         * @param ch {number=} canvas height
         * @return {number} the scale factor resulting from the map units-pixels.
         */
        setScaleContent( w:number, h:number, cw?:number, ch?:number ) : number {

            if ( typeof cw!=="undefined" && typeof ch!=="undefined" ) {

                // resize canvas size keeping aspect ratio relative to units size.
                if ( cw/ch > w/h ) {
                    cw= w*ch/h + 1;

                } else {
                    ch= cw*h/w + 1;
                }

                cw= Math.ceil(cw);
                ch= Math.ceil(ch);

                if ( this._adjustContentToFullScreen ) {
                    cw= window.innerWidth;
                    ch=window.innerHeight;
                }

                // resize canvas object
                this.__resize( cw>>0, ch>>0 );

            }

            // make calcs for new unit-pixel ratio (w,h)
            this._scaleManager.setScaleContent(w,h);
            // calculate preferred units for the current canvas size
            this.__calcPreferredUnits();

            var ret:number= this._scaleManager.getUnitsFactor();

            if (this._onContentScaled ) {
                this._onContentScaled( w, h, this._preferredUnits.width, this._preferredUnits.height, cw, ch, this._sceneHint);
            }

            return ret;
        }

        /**
         * When <code>setScaleContent</code> has been called this method gives the scale factor for the units-pixel
         * mapping ratio.
         * @method cc.node.Director#getUnitsFactor
         * @returns {number}
         */
        getUnitsFactor() : number {
            return this._scaleManager.getUnitsFactor();
        }

        /**
         * Set renderer surface orientation strategy. If set to landscape or portrait, when the window changes size
         * will notify about valid or wrong orientation.
         * Default orientation is set to BOTH.
         * @method cc.node.Director#setOrientationStrategy
         * @param os {cc.render.OrientationStrategy} desired orientation.
         * @param onOk {cc.render.OrientationCallback}
         * @param onError {cc.render.OrientationCallback}
         */
        setOrientationStrategy( os:cc.render.OrientationStrategy, onOk?:cc.render.OrientationOkCallback, onError?:cc.render.OrientationErrorCallback ) {
            this._scaleManager.forceOrientation(os,onOk,onError);
        }

        /**
         * Get whether the device has fullScreen capabilities
         * @method cc.node.Director#isFullScreenCapable
         * @returns {boolean}
         */
        isFullScreenCapable() : boolean {
            return this._scaleManager.isFullScreenCapable();
        }

        /**
         * Is currently the system in full screen ?
         * @method cc.node.Director#isFullScreen
         * @returns {boolean}
         */
        isFullScreen() : boolean {
            return this._scaleManager.isFullScreen();
        }

        /**
         * Start full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#startFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        startFullScreen( f?:()=>any ) {
            this._scaleManager.startFullScreen(f);
        }

        /**
         * End full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#endFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        endFullScreen( f?:()=>any ) {
            this._scaleManager.endFullScreen(f);
        }

        forceOrientation( os:OrientationStrategy, onOk?: OrientationOkCallback, onError?: OrientationErrorCallback ) : ScaleManager {
            return this._scaleManager.forceOrientation(os,onOk,onError);
        }

        checkOrientation() {
            return this._scaleManager.checkOrientation();
        }

        __resize( w:number, h:number ) {
            this._surface.width= w;
            this._surface.height= h;
            this._dimension.width= w;
            this._dimension.height= h;
        }

        getType() : number {
            return cc.render.RENDERER_TYPE_CANVAS;
        }
    }

    function dc2d( renderer:Renderer ) : RenderingContext {
        var canvas:HTMLCanvasElement= renderer._surface;
        var c2d:any= canvas.getContext("2d");

        var globalAlpha:number =1;
        var globalCompositeOperation:cc.render.CompositeOperation= cc.render.CompositeOperation.source_over;

        c2d.flush= function() {

        };

        c2d.type= cc.render.RENDERER_TYPE_CANVAS;

        c2d.setStrokeStyleColor= function( color:cc.math.Color ) {
            this.strokeStyle= (<cc.math.Color>color).getFillStyle();
        };

        c2d.setStrokeStyleColorArray= function( colorArray:Float32Array ) {
            this.strokeStyle = new cc.math.Color(colorArray[0], colorArray[1], colorArray[2], colorArray[3]).getFillStyle();
        };

        c2d.setStrokeStylePattern = function( pattern:cc.render.Pattern ) {

        };

        c2d.setFillStyleColor= function( color:cc.math.Color ) {
            this.fillStyle = (<cc.math.Color>color).getFillStyle();
        };

        c2d.setFillStyleColorArray= function( colorArray:Float32Array ) {
            this.fillStyle = new cc.math.Color(colorArray[0], colorArray[1], colorArray[2], colorArray[3]).getFillStyle();
        };

        // BUGBUG canvas can only do fill pattern with whole images.
        c2d.setFillStylePattern = function( pattern:cc.render.Pattern ) {
             var _pattern= this.createPattern( pattern.texture._image, pattern.type );
            this.fillStyle= _pattern;
        };

        c2d.setTintColor= function( color:cc.math.Color ) {
            // useless for canvas.
        };

        c2d.clear= function() {
            this.save();
            this.setTransform(1,0,0,1,0,0);
            this.clearRect(0,0,this.getWidth(), this.getHeight());
            this.restore();
        };

        c2d.getUnitsFactor= function() {
            return renderer.getUnitsFactor();
        };

        c2d.getWidth= function() {
            return this.canvas.width;
        };

        c2d.getHeight= function() {
            return this.canvas.height;
        };

        c2d.setCompositeOperation= function( o:cc.render.CompositeOperation ) {
            if ( o===globalCompositeOperation ) {
                return;
            }
            globalCompositeOperation= o;
            this.globalCompositeOperation= cc.render.CompositeOperationToCanvas[ o ];
        };

        c2d.getCompositeOperation= function( ) : cc.render.CompositeOperation {
            return globalCompositeOperation;
        };

        c2d.setGlobalAlpha= function( alpha:number ) {
            if ( alpha===globalAlpha ) {
                return;
            }

            globalAlpha= alpha;
            this.globalAlpha= alpha;
        };

        c2d.getGlobalAlpha= function() : number {
            return globalAlpha;
        };

        c2d.setFillStyle= function( s:any ) {
            this.fillStyle= s;
        }

        c2d.setStrokeStyle= function( s:any ) {
            this.strokeStyle= s;
        }

        /**
         * this.transform(1,0,0,-1,0,h);
           //this.translate(0, h);
           //this.scale(1, -1);
           this.drawImage(texture._image, sx, sy, sw, sh, dx, 0, dw, dh);
           //this.scale(1, -1);
           //this.translate(0, -h);
           this.transform(1,0,0,-1,0,-h);

         * @param texture
         * @param sx
         * @param sy
         * @param sw
         * @param sh
         * @param dx
         * @param dy
         * @param dw
         * @param dh
         */
        c2d.drawTexture= function(
            texture:cc.render.Texture2D,
            sx:number,  sy:number,  sw?:number, sh?:number,
            dx?:number, dy?:number, dw?:number, dh?:number ) {

            "use strict";

            var h;

            if ( arguments.length===3 ) {
                if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ) {
                    h= texture._image.height+sy;
                    this.transform(1,0,0,-1,0,h);
                    this.drawImage(texture._image, sx, 0);
                    this.transform(1,0,0,-1,0,h);
                } else {
                    this.drawImage(texture._image, sx, sy);
                }
            } else if ( arguments.length===5 ) {
                if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ) {
                    this.transform(1,0,0,-1,0,sh+sy);
                    this.drawImage(texture._image, sx, 0, sw, sh);
                    this.transform(1,0,0,-1,0,sh+sy);
                } else {
                    this.drawImage(texture._image, sx, sy, sw, sh);
                }
            } else {
                if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ) {
                    this.transform(1,0,0,-1,0,dy+dh);
                    this.drawImage(texture._image, sx, sy, sw, sh, dx, 0, dw, dh);
                    this.transform(1,0,0,-1,0,dy+dh);
                } else {

                    this.drawImage(texture._image, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            }
        };

        /**
         * draw a texture, but not preserving transformation homogeneity.
         * For most cases will work, but not for custom drawing nodes.
         * This method is used in Sprite, where you only want to draw the associated SpriteFrame.
         *
         * @param texture
         * @param sx
         * @param sy
         * @param sw
         * @param sh
         * @param dx
         * @param dy
         * @param dw
         * @param dh
         */
        c2d.drawTextureUnsafe= function(
            texture:cc.render.Texture2D,
            sx:number,  sy:number,  sw?:number, sh?:number,
            dx?:number, dy?:number, dw?:number, dh?:number ) {

            "use strict";

            if ( arguments.length===3 ) {
                if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ) {
                    this.transform(1, 0, 0, -1, 0, texture._image.height);
                }
                this.drawImage(texture._image, sx, sy);
            } else if ( arguments.length===5 ) {
                if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ) {
                    this.transform(1, 0, 0, -1, 0, sh);
                }
                this.drawImage(texture._image, sx, sy, sw, sh);
            } else {
                if (cc.render.RENDER_ORIGIN === cc.render.ORIGIN_BOTTOM) {
                    this.transform(1, 0, 0, -1, 0, dh);
                }
                this.drawImage(texture._image, sx, sy, sw, sh, dx, dy, dw, dh);
            }
        };

        c2d.drawMesh= function( geometry:Float32Array, uv:Float32Array, indices:Uint32Array, colorRGBA:number, texture:Texture2D ) {

            var r= (colorRGBA>>24)&0xff;
            var g= (colorRGBA>>16)&0xff;
            var b= (colorRGBA>>8)&0xff;
            var a= colorRGBA&0xff;

            this.strokeStyle= "rgba("+r+","+g+","+b+","+(a/255)+")";

            this.lineWidth= .05;
            for( var i=0; i<indices.length; i+=3 ) {

                var indexVertex0= indices[i+0]*3;
                var indexVertex1= indices[i+1]*3;
                var indexVertex2= indices[i+2]*3;

                this.beginPath();
                this.moveTo( geometry[ indexVertex0 ], geometry[ indexVertex0+1 ] );
                this.lineTo( geometry[ indexVertex1 ], geometry[ indexVertex1+1 ] );
                this.lineTo( geometry[ indexVertex2 ], geometry[ indexVertex2+1 ] );
                this.closePath();
                this.stroke();

            }

        };

        c2d.fillPath= function( path:cc.math.Path ) {
            path.canvasFill( this );
        };

        c2d.strokePath= function( path:cc.math.Path ) {
            path.canvasStroke( this );
        };

        return <RenderingContext>c2d;
    }

    /**
     * @class cc.render.CanvasRenderer
     * @classdesc
     * @extends Renderer
     *
     * Create a Canvas renderer.
     */
    export class CanvasRenderer extends Renderer {

        /**
         * Create a new CanvasRenderer instance
         * @method cc.render.CanvasRenderer#constructor
         * @param w {width} surface pixels width
         * @param h {height} surface pixels height
         * @param surface {HTMLCanvasElement=} canvas object. @see {cc.render.Renderer#initialize}
         */
        constructor(  w : number, h : number, surface? : HTMLCanvasElement ) {
            super( w, h, surface );
            this._renderingContext= dc2d( this );

            cc.plugin.asset.AssetManager.prepareTextures( this );

        }

        /**
         * Get a renderingContext. Has drawing capabilities.
         * @method cc.render.CanvasRenderer#get:renderingContext
         * @returns {RenderingContext}
         */
        get renderingContext() : RenderingContext {
            return this._renderingContext;
        }

        /**
         * Get Canvas context (result from calling <code>canvas.getContext</code>).
         * @method cc.render.CanvasRenderer#get:canvasContext
         * @returns {any}
         */
        get canvasContext() : any {
            return this._renderingContext;
        }


        getCanvasContext() : RenderingContext {
            return this._renderingContext;
        }

        __resize( w:number, h:number ) {
            super.__resize(w,h);
            this._renderingContext= dc2d( this );
        }

        getType() : number {
            return cc.render.RENDERER_TYPE_CANVAS;
        }

    }

    /**
     * @class cc.render.WebGLRenderer
     * @classdesc
     *
     * Create a WebGL Renderer with drawing capabilities like a canvas object.
     */
    export class WebGLRenderer extends Renderer {

        /**
         * The canvas result of calling <code>canvas.getContext("webgl")</code>
         * @member cc.render.WebGLRenderer#_webglState
         * @type {WebGLRenderingContext}
         * @private
         */
        _webglState : WebGLState = null;

        /**
         * Create a new WebGLRenderer instance.
         * @method cc.render.WebGLRenderer#constructor
         * @param w {width} surface pixels width
         * @param h {height} surface pixels height
         * @param surface {HTMLCanvasElement=} canvas object. @see {cc.render.Renderer#initialize}
         */
        constructor( w : number, h : number, surface? : HTMLCanvasElement ) {
            super( w, h, surface );

            var drc : DecoratedWebGLRenderingContext= new cc.render.DecoratedWebGLRenderingContext(this);

            this._webglState= drc._webglState;
            this._renderingContext = drc;


            cc.plugin.asset.AssetManager.prepareTextures( this );

        }

        getCanvasContext() : WebGLState {
            return this._webglState;
        }

        /**
         * Get a renderingContext. Has drawing capabilities like a <code>CanvasRenderingContext2D</code>
         * @method cc.render.WebGLRenderer#get:renderingContext
         * @returns {RenderingContext}
         */
        get renderingContext() : RenderingContext {
            return this._renderingContext;
        }

        /**
         * Get Canvas context (result from calling <code>canvas.getContext</code>). Gets a gl context.
         * @method cc.render.WebGLRenderer#get:canvasContext
         * @returns {WebGLState}
         */
        get canvasContext() : any {
            return this._webglState;
        }

        prepareTexture( texture:cc.render.Texture2D ) : void {
            texture.__setAsGLTexture(this._webglState);
        }

        __resize( w:number, h:number ) {
            super.__resize(w,h);
            this._renderingContext.resize();
            this._webglState= (<DecoratedWebGLRenderingContext>this._renderingContext)._webglState;
        }

        getType() : number {
            return cc.render.RENDERER_TYPE_WEBGL;
        }

    }

    /**
     * @class cc.render.PatchData
     * @interface
     * @classdesc
     *
     * 9Patch scale area definition.
     * The left, right, top, bottom, define the center area.
     * All the others are derived from this. For example, top-left corner (with y growing down) will be:
     *  (0,0)-(left,top)
     */
    export interface PatchData {
        left?:number;
        right?:number;
        top?:number;
        bottom?:number;
    }

    /**
     * @name RendererUtil
     * @memberOf cc.render
     *
     * Various rendering helpers like 9path, etc.
     *
     */
    export var RendererUtil= {

        draw9Patch : function(ctx:RenderingContext,
                                  frameName:string,
                                  x:number, y:number,
                                  w:number, h:number,
                                  patchData? : PatchData
            ) {

            var sf:cc.node.sprite.SpriteFrame = cc.plugin.asset.AssetManager.getSpriteFrame(frameName);
            if (null === sf) {
                return;
            }

            // no patchdata, or destination size just scale the image.
            if (typeof patchData === "undefined") {
                ctx.drawTexture(sf.getTexture(), 0, 0, sf.getWidth(), sf.getHeight(), x, y, w, h);
                return;
            }

            var tx = sf.getX();
            var ty = sf.getY();

            patchData.left = patchData.left || 0;
            patchData.top = patchData.top || 0;
            patchData.right = patchData.right || 0;
            patchData.bottom = patchData.bottom || 0;

            var paddingW = patchData.left + patchData.right;
            var paddingH = patchData.bottom + patchData.top;

            var spriteBottomHeight = patchData.bottom;
            var spriteTopHeight = patchData.top;
            var spriteBottomY = sf.getHeight() - spriteBottomHeight;
            var spriteMiddleHeight = sf.getHeight() - paddingH;
            var spriteMiddleWidth = sf.getWidth() - paddingW;

            var spriteLeftWidth = patchData.left;
            var spriteRightWidth = patchData.right;

            var scaleFactor = ctx.getUnitsFactor();

            var topy = cc.render.RENDER_ORIGIN === cc.render.ORIGIN_TOP ? y :
            y + h - spriteTopHeight / scaleFactor;
            var bottomy = cc.render.RENDER_ORIGIN === cc.render.ORIGIN_TOP ? y + h - spriteBottomHeight / scaleFactor :
                y;
            var middley = cc.render.RENDER_ORIGIN === cc.render.ORIGIN_TOP ? y + spriteTopHeight / scaleFactor :
            y + spriteBottomHeight / scaleFactor;

            if (patchData.left) {

                // top left
                if (patchData.top) {
                    ctx.drawTexture(sf.getTexture(),
                        tx, ty, spriteLeftWidth, spriteTopHeight,
                        x, topy, spriteLeftWidth / scaleFactor, spriteTopHeight / scaleFactor);
                }

                // bottom left
                if (patchData.bottom) {
                    ctx.drawTexture(sf.getTexture(),
                        tx, ty + spriteBottomY, spriteLeftWidth, spriteBottomHeight,
                        x, bottomy, spriteLeftWidth / scaleFactor, spriteBottomHeight / scaleFactor);
                }

                ctx.drawTexture(sf.getTexture(),
                    tx, ty + patchData.top, spriteLeftWidth, spriteMiddleHeight,
                    x, middley, spriteLeftWidth / scaleFactor, h - paddingH / scaleFactor);

            }

            if (patchData.right) {

                // top left
                if (patchData.top) {
                    ctx.drawTexture(sf.getTexture(),
                        tx + sf.getWidth() - patchData.right, ty, spriteRightWidth, spriteTopHeight,
                        x + w - patchData.right / scaleFactor, topy, spriteRightWidth / scaleFactor, spriteTopHeight / scaleFactor);
                }

                // bottom left
                if (patchData.bottom) {
                    ctx.drawTexture(sf.getTexture(),
                        tx + sf.getWidth() - patchData.right, ty + spriteBottomY, spriteRightWidth, spriteBottomHeight,
                        x + w - patchData.right / scaleFactor, bottomy, spriteRightWidth / scaleFactor, spriteBottomHeight / scaleFactor);
                }

                ctx.drawTexture(sf.getTexture(),
                    tx + sf.getWidth() - patchData.right, ty + patchData.top, spriteRightWidth, spriteMiddleHeight,
                    x + w - patchData.right / scaleFactor, middley, spriteRightWidth / scaleFactor, h - paddingH / scaleFactor);

            }


            // top left
            if (patchData.top) {
                ctx.drawTexture(sf.getTexture(),
                    tx + patchData.left, ty, spriteMiddleWidth, spriteTopHeight,
                    x + patchData.left / scaleFactor, topy, w - paddingW / scaleFactor, spriteTopHeight / scaleFactor);
            }

            // bottom left
            if (patchData.bottom) {
                ctx.drawTexture(sf.getTexture(),
                    tx + patchData.left, ty + spriteBottomY, spriteMiddleWidth, spriteBottomHeight,
                    x + patchData.left / scaleFactor, bottomy, w - paddingW / scaleFactor, spriteBottomHeight / scaleFactor);
            }

            ctx.drawTexture(sf.getTexture(),
                tx + patchData.left, ty + patchData.top, spriteMiddleWidth, spriteMiddleHeight,
                x + patchData.left / scaleFactor, middley, w - paddingW / scaleFactor, h - paddingH / scaleFactor);


        }
    }
}