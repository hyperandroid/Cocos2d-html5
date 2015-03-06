/**
 * License: see license.txt file.
 */

/// <reference path="./AbstractShader.ts"/>
/// <reference path="../webGLState.ts"/>
/// <reference path="../../util/util.ts"/>
/// <reference path="../RenderingContextSnapshot.ts"/>

module cc.render.shader {


    function __getPatternFragmentShader() : string[] {
        return  [
            "precision mediump float;",

            "uniform vec4 uPatternImageBounds;",
            "uniform sampler2D uSampler;",

            "varying vec2 v_texCoord;",
            "varying vec4 vColor;",

            "void main() {",
            "    gl_FragColor = texture2D(uSampler, mod(v_texCoord,(uPatternImageBounds.zw-uPatternImageBounds.xy))+ uPatternImageBounds.xy ) * vColor;",
            "}"
        ];
    }

    export class TexturePatternShader extends AbstractShader {

        static mat:Float32Array = new Float32Array(16);

        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.TexturePatternShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform: cc.render.shader.Uniform = null;
        _uniformPatternTransform : cc.render.shader.Uniform = null;

        _uniformPatternImageBounds : cc.render.shader.Uniform = null;
        _uniformPatternBounds : cc.render.shader.Uniform = null;

        /**
         * Shader geometry attribute.
         * @member cc.render.shader.TexturePatternShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition:any = null;

        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.TexturePatternShader#_attributeColor
         * @type {any}
         * @private
         */
        _attributeColor:any = null;


        constructor(gl:cc.render.WebGLState) {

            super(gl, {

                    vertexShader: [
                        "precision mediump float;",             // medium precission

                        "attribute vec2 aPosition;",            // position attribute
                        "attribute vec4 aColor;",               // color attribute

                        "uniform vec4 uPatternImageBounds;",    // sprite frame info: (u0,v0), (u1-u1,v1-v0)
                        "uniform vec2 uPatternBounds;",         // pattern screen size
                        "uniform mat4 uProjection;",                 // projection matrix
                        "uniform mat4 uTransform;",             // geometry model view transform
                        "uniform mat4 uPatternTransform;",      // pattern transform (composed of proj+current)

                        "varying vec2 v_texCoord;",
                        "varying vec4 vColor;",

                        "void main(void) {",
                            "vec4 avp= vec4( aPosition, 0, 1);",
                            "gl_Position = uProjection * uTransform * avp;",
                            "v_texCoord = (uPatternTransform * avp).xy / uPatternBounds * (uPatternImageBounds.zw-uPatternImageBounds.xy);",
                            "vColor= aColor;",
                        "}"
                    ],

                    fragmentShader: __getPatternFragmentShader(),

                    uniforms: {
                        "uPatternImageBounds": {
                            type: "4fv",
                            value: [0, 0, 0, 0]
                        },
                        "uPatternBounds": {
                            type: "2fv",
                            value: [0, 0]
                        },
                        "uProjection": {
                            type: "m4v",
                            value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                        },
                        "uTransform": {
                            type: "m4v",
                            value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                        },
                        "uPatternTransform": {
                            type: "m4v",
                            value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                        },
                        "uSampler": {
                            type: "t",
                            value: null
                        }
                    },

                    attributes: ["aPosition", "aColor"]
                });


            this._uniformProjection = this.findUniform("uProjection");
            this._uniformTransform = this.findUniform("uTransform");
            this._uniformPatternTransform= this.findUniform("uTransform");

            this._uniformPatternImageBounds= this.findUniform("uPatternImageBounds");
            this._uniformPatternBounds= this.findUniform("uPatternBounds");

            this._attributePosition = this.findAttribute("aPosition");
            this._attributeColor = this.findAttribute("aColor");

            TexturePatternShader.mat.set([1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]);
        }

        flushBuffersWithContent( rcs:cc.render.RenderingContextSnapshot ) {

            this.__updateUniformValues();

            var gl = this._webglState;

            gl.vertexAttribPointer(this._attributePosition._location, 2, gl._gl.FLOAT, false, 3*4, 0);
            gl.vertexAttribPointer(this._attributeColor._location, 4, gl._gl.FLOAT, false, 3*4, 2*4);

        }
    }

}