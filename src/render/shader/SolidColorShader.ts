/**
 * License: see license.txt file.
 */

/// <reference path="./AbstractShader.ts"/>
/// <reference path="../webGLState.ts"/>
/// <reference path="../../util/util.ts"/>
/// <reference path="../RenderingContextSnapshot.ts"/>

module cc.render.shader {

    "use strict";

    import AbstractShader = cc.render.shader.AbstractShader;

    /**
     * @class cc.render.shader.SolidColorShader
     * @classdesc
     *
     * This shader fills geometry with a solid color.
     *
     */
    export class SolidColorShader extends AbstractShader {

        /**
         * Spare matrix
         * @member cc.render.shader.SolidColorShader.mat
         * @type {Float32Array}
         */
        static mat : Float32Array = new Float32Array( 16 );

        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.SolidColorShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform:any = null;

        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition:any = null;

        /**
         * Shader texture coords attribute. Not used in this shader.
         * @member cc.render.shader.SolidColorShader#_attributeTexture
         * @type {any}
         * @private
         */
        //_attributeTexture:any = null;

        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.SolidColorShader#_attributeColor
         * @type {any}
         * @private
         */
        _attributeColor:any = null;

        /**
         * Build a new SolidColorShader instance.
         * @method cc.render.shader.SolidColorShader#constructor
         * @param gl {WebGLRenderingContext} gl context
         * @param ortho {Float32Array} projection matrix.
         */
        constructor(gl:cc.render.WebGLState) {
            super(gl, {
                vertexShader: ""+
                    "attribute vec2 aPosition; \n" +
                    "attribute vec4 aColor; \n" +

                    "uniform mat4 uProjection; \n" +
                    "uniform mat4 uTransform; \n" +

                    "varying vec4 vAttrColor; \n" +

                    "void main(void) { \n" +
                    "gl_Position = uProjection * uTransform * vec4( aPosition.x, aPosition.y, 0.0, 1.0 );\n" +
                    "vAttrColor = aColor;\n" +
                    "}\n",

                fragmentShader: "precision mediump float; \n" +
                    "varying vec4 vAttrColor;\n" +

                    "void main(void) { \n" +
                    "  gl_FragColor = vAttrColor; \n" +
                    "}\n",

                uniforms: {
                    "uProjection": {
                        type: "m4v",
                        value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                    },
                    "uTransform": {
                        type: "m4v",
                        value: [1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]
                    }
                },

                attributes: [ "aPosition", "aColor" ]

            });

            this._uniformProjection = this.findUniform("uProjection");
            this._uniformTransform = this.findUniform("uTransform");

            this._attributePosition = this.findAttribute("aPosition");
            this._attributeColor = this.findAttribute("aColor");

            SolidColorShader.mat.set([1.0,0,0,0, 0,1.0,0,0, 0,0,1.0,0, 0,0,0,1.0]);

        }


        flushBuffersWithContent( rcs:cc.render.RenderingContextSnapshot ) {

            this.__updateUniformValues();

            var gl = this._webglState;

            gl.vertexAttribPointer(this._attributePosition._location, 2, gl._gl.FLOAT, false, 12, 0);
            gl.vertexAttribPointer(this._attributeColor._location, 4, gl._gl.UNSIGNED_BYTE, true,  12, 2 * 4 );
            //gl.vertexAttribPointer(this._attributeColor._location, 4, gl._gl.FLOAT, false, 8*4, 2*4);

        }

    }
}