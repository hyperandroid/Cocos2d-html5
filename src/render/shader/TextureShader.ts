/**
 * Created by ibon on 11/17/14.
 */

/// <reference path="./AbstractShader.ts"/>
/// <reference path="../WebGLState.ts"/>
/// <reference path="../RenderingContextSnapshot.ts"/>

module cc.render.shader {

    import AbstractShader = cc.render.shader.AbstractShader;

    /**
     * @class cc.render.shader.TextureShader
     * @extends AbstractShader
     * @classdesc
     * 
     * This shader fills rects with an image. It is expected to be invoked by calls to drawImage.
     * 
     */
    export class TextureShader extends AbstractShader {

        /**
         * Spare matrix
         * @member cc.render.shader.TextureShader.mat
         * @type {Float32Array}
         */
        static mat:Float32Array = new Float32Array(16);

        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.SolidColorShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform:any = null;

        /**
         * Shader Uniform for texture.
         * @member cc.render.shader.SolidColorShader#_uniformTextureSampler
         * @type {any}
         * @private
         */
        _uniformTextureSampler : any = null;

        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition:any = null;

        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributeTexture
         * @type {any}
         * @private
         */
        _attributeTexture:any = null;

        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.SolidColorShader#_attributeColor
         * @type {any}
         * @private
         */
        _attributeColor:any = null;

        constructor(gl:cc.render.WebGLState) {
            super(gl,
                {
                    vertexShader: "" +
                        "attribute vec2 aPosition; \n" +
                        "attribute vec4 aColor; \n" +
                        "attribute vec2 aTexture; \n" +

                        "uniform mat4 uProjection; \n" +

                        "varying vec2 vTextureCoord; \n" +
                        "varying vec4 vAttrColor; \n" +

                        "void main(void) { \n" +
                        "gl_Position = uProjection * vec4( aPosition.x, aPosition.y, 0.0, 1.0 );\n" +
                        "vTextureCoord = aTexture;\n" +
                        "vAttrColor = aColor;\n" +
                        "}\n",
                    fragmentShader: ""+
                        "precision mediump float; \n" +
                        "varying vec2 vTextureCoord; \n" +
                        "uniform sampler2D uTextureSampler; \n" +
                        "varying vec4 vAttrColor;\n" +

                        "void main(void) { \n" +

                        "  vec4 textureColor= texture2D(uTextureSampler, vec2(vTextureCoord)); \n" +
                        "  gl_FragColor = textureColor * vAttrColor; \n" +

                        "}\n",
                    attributes: [ "aPosition", "aColor", "aTexture" ],
                    uniforms: {
                        "uProjection": {
                            type: "m4v",
                            value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                        },
                        "uTextureSampler": {
                            type: "t",
                            value: null
                        }
                    }
                });

            this._uniformTextureSampler = this.findUniform("uTextureSampler");
            this._uniformProjection = this.findUniform("uProjection");

            this._attributePosition = this.findAttribute("aPosition");
            this._attributeColor = this.findAttribute("aColor");
            this._attributeTexture = this.findAttribute("aTexture");

            TextureShader.mat[ 0] = 1.0;
            TextureShader.mat[ 5] = 1.0;
            TextureShader.mat[10] = 1.0;
            TextureShader.mat[15] = 1.0;
            return this;
        }

        flushBuffersWithContent(rcs:cc.render.RenderingContextSnapshot ) {

            this.__updateUniformValues();

            var gl= this._webglState;

            gl.vertexAttribPointer(this._attributePosition._location, 2, gl._gl.FLOAT, false, 5*4, 0);
            gl.vertexAttribPointer(this._attributeColor._location, 4, gl._gl.UNSIGNED_BYTE, true, 5 * 4, 2 * 4 )
            gl.vertexAttribPointer(this._attributeTexture._location, 2, gl._gl.FLOAT, false, 5*4, 3*4 );

        }
    }



    /**
     * @class cc.render.shader.MeshShader
     * @extends AbstractShader
     * @classdesc
     *
     * This shader fills rects with an image. It is expected to be invoked by calls to drawImage.
     *
     */
    export class MeshShader extends AbstractShader {

        /**
         * Spare matrix
         * @member cc.render.shader.TextureShader.mat
         * @type {Float32Array}
         */
        static mat:Float32Array = new Float32Array(16);

        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.MeshShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform:any = null;

        /**
         * Shader Uniform for texture.
         * @member cc.render.shader.MeshShader#_uniformTextureSampler
         * @type {any}
         * @private
         */
        _uniformTextureSampler : any = null;

        /**
         * Shader geometry attribute.
         * @member cc.render.shader.MeshShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition:any = null;

        /**
         * Shader geometry attribute.
         * @member cc.render.shader.MeshShader#_attributeTexture
         * @type {any}
         * @private
         */
        _attributeTexture:any = null;

        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.MeshShader#_uniformColor
         * @type {any}
         * @private
         */
        _uniformColor:any = null;

        constructor(gl:cc.render.WebGLState) {
            super(gl,
                {
                    vertexShader: "" +
                        "attribute vec2 aPosition; \n" +
                        "attribute vec2 aTexture; \n" +

                        "uniform mat4 uProjection; \n" +
                        "uniform mat4 uTransform; \n" +

                        "varying vec2 vTextureCoord; \n" +

                        "void main(void) { \n" +
                        "gl_Position = uProjection * uTransform * vec4( aPosition.x, aPosition.y, 0.0, 1.0 );\n" +
                        "vTextureCoord = aTexture;\n" +
                        "}\n",
                    fragmentShader: ""+
                        "precision mediump float; \n" +
                        "varying vec2 vTextureCoord; \n" +
                        "uniform sampler2D uTextureSampler; \n" +
                        "uniform vec4 uColor; \n" +

                        "void main(void) { \n" +

                        "  vec4 textureColor= texture2D(uTextureSampler, vec2(vTextureCoord)); \n" +
                        "  gl_FragColor = textureColor * (uColor/255.0); \n" +

                        "}\n",
                    attributes: [ "aPosition", "aTexture" ],
                    uniforms: {
                        "uProjection": {
                            type: "m4v",
                            value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                        },
                        "uTransform": {
                            type: "m4v",
                            value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                        },
                        "uTextureSampler": {
                            type: "t",
                            value: null
                        },
                        "uColor" : {
                            type : "4fv",
                            value: [1.0, 1.0, 1.0, 1.0]
                        }
                    }
                });

            this._uniformTextureSampler = this.findUniform("uTextureSampler");
            this._uniformProjection = this.findUniform("uProjection");
            this._uniformTransform = this.findUniform("uTransform");
            this._uniformColor= this.findUniform("uColor");

            this._attributePosition = this.findAttribute("aPosition");
            this._attributeTexture = this.findAttribute("aTexture");

            TextureShader.mat[ 0] = 1.0;
            TextureShader.mat[ 5] = 1.0;
            TextureShader.mat[10] = 1.0;
            TextureShader.mat[15] = 1.0;
            return this;
        }

        flushBuffersWithContent(rcs:cc.render.RenderingContextSnapshot ) {

            this.__updateUniformValues();

            var gl= this._webglState;

            gl.vertexAttribPointer(this._attributePosition._location, 2, gl._gl.FLOAT, false, 4*4, 0);
            gl.vertexAttribPointer(this._attributeTexture._location, 2, gl._gl.FLOAT, false, 4*4, 2*4 );

        }

        useMeshIndex() : boolean {
            return true;
        }
    }
}