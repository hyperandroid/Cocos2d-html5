/**
 * License: see license.txt file.
 */

/// <reference path="../WebGLState.ts"/>

module cc.render.shader {

    "use strict";

    import WebGLState= cc.render.WebGLState;

    /**
     * @class cc.render.shader.UniformInitializer
     * @interface
     * @classdesc
     *
     * Uniform initializer object.
     *
     */
    export interface UniformInitializer {

        /**
         * Uniform type.
         * @member cc.render.shader.UniformInitializer#type
         * @type {string}
         */
        type : string;

        /**
         * Uniform initial value.
         * @member cc.render.shader.UniformInitializer#value
         * @type {any}
         */
        value : any;
    }

    var idGenerator= (function() {
        var index=0;
        return function() {
            return index++;
        }
    })();

    /**
     * @class cc.render.shader.Uniform
     * @classdesc
     *
     * Base class for Shader uniforms.
     *
     */
    export class Uniform {

        /**
         * Previously value set in shader's location.
         * @member cc.render.shader.Uniform#_prevValue
         * @type {any}
         * @private
         */
        _prevValue:any = null;  // previous value set.

        /**
         * Shader program location.
         * @member cc.render.shader.Uniform#_location
         * @type {any}
         * @private
         */
        _location:any = null;  // shader program location

        /**
         * Uniform name
         * @member cc.render.shader.Uniform#_name
         * @type {string}
         */

        /**
         * Uniform type
         * @member cc.render.shader.Uniform#_type
         * @type {string}
         */

        /**
         * Uniform initial value.
         * The value is not set in the shader until <code>setValue</code> is called.
         * @member cc.render.shader.Uniform#_value
         * @type {any}
         */

        /**
         * Create a new Uniform instance.
         * @method cc.render.shader.Uniform#constructor
         * @param _name {string}
         * @param _type {string}
         * @param _value {any}
         */
        constructor(public _name:string, public _type:string, public _value:any) {
        }

        /**
         * Set Uniform shader location.
         * @method cc.render.shader.Uniform#setLocation
         * @param l {any} shader location.
         */
        setLocation(l:any) {
            this._location = l;

            // bugbug dynamic property
            this._location._id= idGenerator();
        }

        /**
         * Set shader location value.
         * @method cc.render.shader.Uniform#setValue
         * @param gl {WebGLState}
         */
        updateValue(gl:WebGLState) {
            if (this._value !== this._prevValue) {
                gl._gl[ "uniform" + this._type ](this._location, this._value);
                this._prevValue = this._value;
            }
        }

        setValue( v : any ) {
            this._value= v;
        }

        /**
         * Create a uniform instance based on its type.
         * @method cc.render.shader.Uniform.createUniform
         * @param name {string} uniform name
         * @param type {string} uniform type
         * @param value {any} uniform value.
         * @returns {cc.render.Uniform} A Uniform instance.
         */
        static createUniform(name:string, type:string, value:any) {
            if (type === "t") {
                return new TextureUniform(name, type, value);
            } else if (type === "m4v") {
                return new MatrixUniform(name, type, value);
            } else {
                return new Uniform(name, type, value);
            }
        }
    }

    /**
     * @class cc.render.shader.TextureUniform
     * @classdesc
     *
     * Create a Texture uniform.
     * Texture value is global for every shader that uses a sampler.
     *
     */
    export class TextureUniform extends Uniform {


        /**
         * Create a TextureUniform instance.
         * @method cc.render.shader.TextureUniform#constructor
         * @param name {string}
         * @param type {string}
         * @param value {any}
         */
        constructor(name:string, type:string, value:any) {
            super(name, type, value);
        }

        /**
         * Set shader location value.
         * The current texture Id is compared with an statically stored texture Id.
         * @member cc.render.shader.TextureUniform#setValue
         * @param gl {WebGLRenderingContext}
         */
        updateValue(gl:WebGLState) {

            if (this._value !== this._prevValue ) {
                gl.uniform1i(this._location, this._value);
                this._prevValue= this._value;
            }
        }

    }

    /**
     * @class cc.render.shader.MatrixUniform
     * @classdesc
     *
     * Create a Matrix uniform.
     *
     */
    export class MatrixUniform extends Uniform {

        _dirty:boolean= true;
        _vv:Float32Array= null;

        /**
         * @method cc.render.shader.MatrixUniform#constructor
         * @param name {string}
         * @param type {string}
         * @param value {any}
         */
        constructor(name:string, type:string, value:any) {
            super(name, type, value instanceof Float32Array ? value : new Float32Array(value) );
            //this._prevValue= new Float32Array(16);
            //this._value= new Float32Array(value);
        }

        setValue( v:Float32Array ) {
            //super.setValue(v);
            this._value.set(v);
            this._dirty= true;
        }

        /**
         * Set Shader location value.
         * @method cc.render.shader.MatrixUniform#setValue
         * @param gl {WebGLRenderingContext}
         */
        updateValue(gl:WebGLState) {

            if ( this._dirty ) {

                // PENDING: componentwise matrix comparison
                gl.uniformMatrix4fv(this._location, false, this._value);
                //this._prevValue = this._value;

                this._dirty = false;
            }
        }

    }
}