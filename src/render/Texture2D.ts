/**
 * Created by ibon on 11/17/14.
 */

/// <reference path="./WebGLState.ts"/>

module cc.render {

    /**
     * @class cc.render.Texture2D
     * @classdesc
     *
     * This Object encapsulated a rendering texture, either for Canvas or WebGL.
     * The texture will handle all the burden of creating a webgl texture when needed.
     * Since renderers have different needs for different types of images a call to Renderer.prepareTexture must be
     * performed. This will automatically happen for every pre-loaded texture in the AssetManager by the time a renderer
     * is being built.
     *
     */
    export class Texture2D {

        _name: string= null;

        _webglState : WebGLState = null;

        _glId : WebGLTexture= null;
        _textureWidth : number = 0;
        _textureHeight : number = 0;

        /**
         * A texture2D, is bound to a given renderer.
         * @member cc.render.Texture2D#_image
         * @type {Image|WebGLTexture}
         * @private
         */
        _image : any = null;

        _hasMipmaps : boolean = false;

        _u0 : number = 0;
        _v0 : number = 0;
        _u1 : number = 0;
        _v1 : number = 0;

        // offset in image.
        _offsetX : number = 0;
        _offsetY : number = 0;

        // when image is set to texture, the original image is dismissed in favor of a new dummy image.
        // from then, calling image.width or image.height will give wrong values.
        _imageWidth : number = 0;
        _imageHeight : number = 0;

        _isLoaded : boolean = false;

        _invertedY : boolean = false;

        constructor( el : any, name : string) {
            if (el) {
                this.initWithElement(el);
                this._name= name;
            }
        }

        initWithElement( el : string );
        initWithElement( el : HTMLCanvasElement );
        initWithElement( el : HTMLImageElement );
        initWithElement( el : any ) {

            if ( typeof el === "string" ) {

                var image= new Image();
                image.onload= (function(me) {
                    return function(e) {
                        me.initWithElement(e.target);
                    }
                })(this);
                image.src= el;

            } else {
                this._image = el;
                this._imageWidth = el.width;
                this._imageHeight = el.height;
                this._image._textureInfo = this;

                this._isLoaded = true;
            }


            function POT( v : number ) {
                var current : number = 1;
                while( current<v ) {
                    current<<=1;
                }
                return current;
            }

            this._textureWidth = POT(this._image.width);
            this._textureHeight = POT(this._image.height);

            this._u1 = this._imageWidth / this._textureWidth;
            this._v1 = this._imageHeight / this._textureHeight;

        }

        get width() {
            return this.getPixelsWide();
        }

        get height() {
            return this.getPixelsHigh();
        }

        getPixelsWide() : number {
            return this._imageWidth;
        }

        getPixelsHigh() : number {
            return this._imageHeight;
        }

        getImage() : any {
            return this._glId ? this._glId : this._image;
        }

        isWebGLEnabled() : boolean {
            return this._glId!==null;
        }

        release() {
            if ( this._glId && this._webglState ) {
                this._webglState._gl.deleteTexture( this._glId );
                this._glId= null;
            }
        }

        /**
         * Turn an Image texture into a WebGL Texture.
         * The Image object reference will be set to null (gc friendly).
         * If the Texture is already a gl texture, nothing will happen.
         * @param webglstate {cc.render.WebGLState}
         * @returns {cc.render.Texture2D}
         * @private
         */
        __setAsGLTexture( webglstate : WebGLState ) : Texture2D {

            // already set as texture, do nothing.
            if ( !webglstate || this.isWebGLEnabled() ) {
                return this;
            }

            var gl= webglstate._gl;

            this._webglState= webglstate;
            this._glId= gl.createTexture();

            webglstate.bindTexture(gl.TEXTURE_2D, this._glId);
            webglstate.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            if (cc.render.RENDER_ORIGIN==="bottom") {
                this._invertedY = true;
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            }
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,this._textureWidth,this._textureHeight,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
            gl.texSubImage2D( gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            this._image= null;

            return this;
        }

        setTexParameters(texParams : number, magFilter : number, wrapS : number, wrapT : number ) : void;
        setTexParameters(texParams : any, magFilter : number, wrapS : number, wrapT : number ) : void {

            if (!this._webglState) {
                return;
            }

            var gl= this._webglState._gl;

            var minFilter : number;

            if ( typeof magFilter === "undefined") {
                magFilter = texParams.magFilter;
                wrapS = texParams.wrapS;
                wrapT = texParams.wrapT;
                minFilter = texParams.minFilter
            } else {
                minFilter = texParams;
            }

            this._webglState.bindTexture(gl.TEXTURE_2D, this._glId);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

        }

        setAntiAliasTexParameters() : void {

            if (!this._webglState) {
                return;
            }
            var gl= this._webglState._gl;

            this._webglState.bindTexture(gl.TEXTURE_2D, this._glId);

            if (!this._hasMipmaps) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }

        setAliasTexParameters() {

            if (!this._webglState) {
                return;
            }
            var gl= this._webglState._gl;

            this._webglState.bindTexture(gl.TEXTURE_2D, this._glId);

            if (!this._hasMipmaps){
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }

        generateMipmap() {

            if (!this._webglState || this._hasMipmaps ) {
                return;
            }
            var gl= this._webglState._gl;

            this._webglState.bindTexture(gl.TEXTURE_2D, this._glId);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);

            this._hasMipmaps = true;
        }

    }
}