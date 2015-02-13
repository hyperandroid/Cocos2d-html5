/**
 * License: see license.txt file.
 */

/// <reference path="./AbstractShader.ts"/>
/// <reference path="../RenderingContextSnapshot.ts"/>

module cc.render.shader {

    export class FastTextureShader extends AbstractShader {
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
        _uniformTextureSampler:any = null;

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

        _attributeAnchorPosition:any= null;
        _attributeRotation:any= null;
        _attributeScale:any= null;

        constructor(gl:cc.render.WebGLState) {
            super(gl,
                {
                    vertexShader: "" +
                        "precision lowp float; \n" +
                        "attribute vec2 aPosition; \n" +
                        "attribute vec4 aColor; \n" +
                        "attribute vec2 aTexture; \n" +
                        "attribute vec2 aAnchorPosition; \n" +
                        "attribute float aRotation; \n" +
                        "attribute vec2 aScale; \n" +

                        "uniform mat4 uProjection; \n" +
                        //"uniform mat4 uTransform; \n" +

                        "varying vec2 vTextureCoord; \n" +
                        "varying vec4 vAttrColor; \n" +

                        "void main(void) { \n" +
                            "vec2 v;\n"+
                            "vec2 sv = aAnchorPosition * aScale; \n"+
                            "float _rotation= aRotation * 0.017453292519943295;\n" +
                            " v.x = sv.x * cos(_rotation) - sv.y * sin(_rotation); \n"+
                            " v.y = sv.x * sin(_rotation) + sv.y * cos(_rotation); \n"+
                            "gl_Position = uProjection * vec4( v + aPosition, 0.0, 1.0 );\n"+
                            "vTextureCoord = aTexture;\n" +
                            "vAttrColor = aColor;\n" +
                        "}\n",

                    fragmentShader: "" +
                        "precision lowp float; \n" +
                        "varying vec2 vTextureCoord; \n" +
                        "uniform sampler2D uTextureSampler; \n" +
                        "varying vec4 vAttrColor;\n" +

                        "void main(void) { \n" +

                        "  gl_FragColor = texture2D(uTextureSampler, vec2(vTextureCoord)) * vAttrColor; \n" +

                        "}\n",
                    attributes: ["aPosition", "aColor", "aTexture", "aAnchorPosition", "aRotation", "aScale"],
                    uniforms: {
                        "uProjection": {
                            type: "m4v",
                            value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                        },
                        //"uTransform": {
                        //    type: "m4v",
                        //    value: [1.0, 0, 0, 0,
                        //            0, 1.0, 0, 0,
                        //            0, 0, 1.0, 0,
                        //            0, 0, 0, 1.0 ]
                        //},
                        "uTextureSampler": {
                            type: "t",
                            value: null
                        }
                    }
                });

            this._uniformTextureSampler = this.findUniform("uTextureSampler");
            this._uniformProjection = this.findUniform("uProjection");
            //this._uniformTransform = this.findUniform("uTransform");

            this._attributePosition = this.findAttribute("aPosition");
            this._attributeColor = this.findAttribute("aColor");
            this._attributeTexture = this.findAttribute("aTexture");
            this._attributeAnchorPosition= this.findAttribute("aAnchorPosition");
            this._attributeRotation= this.findAttribute("aRotation");
            this._attributeScale= this.findAttribute("aScale");

            FastTextureShader.mat[0] = 1.0;
            FastTextureShader.mat[5] = 1.0;
            FastTextureShader.mat[10] = 1.0;
            FastTextureShader.mat[15] = 1.0;

            return this;
        }

        flushBuffersWithContent() {

            this.__updateUniformValues();

            var gl = this._webglState;

            gl.vertexAttribPointer(this._attributePosition._location,       2, gl._gl.FLOAT,        false, 10 * 4, 0     );
            gl.vertexAttribPointer(this._attributeColor._location,          4, gl._gl.UNSIGNED_BYTE, true, 10 * 4, 2 * 4 );
            gl.vertexAttribPointer(this._attributeTexture._location,        2, gl._gl.FLOAT,        false, 10 * 4, 3 * 4 );
            gl.vertexAttribPointer(this._attributeAnchorPosition._location, 2, gl._gl.FLOAT,        false, 10 * 4, 5 * 4 );
            gl.vertexAttribPointer(this._attributeRotation._location,       1, gl._gl.FLOAT,        false, 10 * 4, 7 * 4 );
            gl.vertexAttribPointer(this._attributeScale._location,          2, gl._gl.FLOAT,        false, 10 * 4, 8 * 4 );

        }
    }
}