/**
 * License: see license.txt file.
 */

/// <reference path="../WebGLState.ts"/>

module cc.render.shader {

    /**
     * @class cc.render.shader.Attribute
     * @classdesc
     *
     * Shader attribute.
     *
     */
    export class Attribute {

        /**
         * Attribute name.
         * @member cc.render.shader.Attribute#_name
         * @type {string}
         */

        /**
         * Attribute location.
         * @member cc.render.shader.Attribute#_location
         * @type {any}
         */

        /**
         * Create a new Attribute instance.
         * @method cc.render.shader.Attribute#constructor
         * @param _name {string}
         * @param _location {any}
         */
        constructor( public _name : string, public _location : any ) {
        }

        /**
         * Enable the shader attribute.
         * @method cc.render.shader.Attribute#enable
         * @param gl {WebGLRenderingContext}
         */
        enable( gl : cc.render.WebGLState) {
            gl.enableVertexAttribArray(this._location);
        }

        /**
         * Disable the shader attribute.
         * @method cc.render.shader.Attribute#disable
         * @param gl {WebGLRenderingContext}
         */
        disable( gl : cc.render.WebGLState ) {
            gl.disableVertexAttribArray(this._location);
        }
    }
}