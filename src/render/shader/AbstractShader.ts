/**
 * License: see license.txt file.
 */

/// <reference path="./Uniform.ts"/>
/// <reference path="./Attribute.ts"/>
/// <reference path="../../math/matrix3.ts"/>
/// <reference path="../WebGLState.ts"/>
/// <reference path="../RenderingContextSnapshot.ts"/>

module cc.render.shader {

    import Uniform = cc.render.shader.Uniform;
    import UniformInitializer = cc.render.shader.UniformInitializer;
    import Attribute = cc.render.shader.Attribute;
    import WebGLState = cc.render.WebGLState;

    "use strict";

    export interface MapOfUniformInitializer {
        [name: string]: UniformInitializer;
    }

    /**
     * @class cc.render.shader.AbstractShaderInitializer
     * @interface
     * @classdesc
     *
     * Shader initializer object.
     *
     */
    export interface AbstractShaderInitializer {

        /**
         * Vertex shader string definition
         * @member cc.render.shader.AbstractShaderInitializer#vertexShader
         * @type {string|Array<string>}
         */
        vertexShader    : string|string[];

        /**
         * Fragment shader string definition
         * @member cc.render.shader.AbstractShaderInitializer#fragmentShader
         * @type {string|Array<string>}
         */
        fragmentShader  : string|string[];

        /**
         * Map of uniform initializers.
         * @member cc.render.shader.AbstractShaderInitializer#uniforms
         * @type {Map<string,cc.render.shader.UniformInitializer>}
         */
        uniforms?       : MapOfUniformInitializer;

        /**
         * Array of attribute names.
         * @member cc.render.shader.AbstractShaderInitializer#attributes
         * @type {Array<string>}
         */
        attributes?     : Array<any>;

    }

    /**
     * @class cc.render.shader.AbstractShader
     * @classdesc
     *
     * Base class for all 2D rendering shaders.
     *
     */
    export class AbstractShader {

        /**
         * Collection of the shader uniform objects.
         * @member cc.render.shader.AbstractShader#_uniforms
         * @type {Array<cc.render.shader.Uniform>}
         * @private
         */
        _uniforms       : Array<Uniform> = [];

        /**
         * Collection of the shader attribute objects.
         * @member cc.render.shader.AbstractShader#_attributes
         * @type {Array<cc.render.shader.Uniform>}
         * @private
         */
        _attributes     : Attribute[] = [];

        /**
         * Compiled shader program.
         * @member cc.render.shader.AbstractShader#_shaderProgram
         * @type {any}
         * @private
         */
        _shaderProgram  : WebGLProgram = null;

        /**
         * Shader Uniform projection matrix.
         * @member cc.render.shader.AbstractShader#_uniformProjection
         * @type {any}
         * @private
         */
        _uniformProjection: cc.render.shader.Uniform = null;


        /**
         * WebGLState
         * @member cc.render.shader.AbstractShader#_webglState
         * @type {cc.render.WebGLState}
         */

        /**
         * Build a new AbstractShader instance.
         * @method cc.render.shader.AbstractShader#constructor
         * @param _webglState {WebGLState}
         * @param shaderDefinition {cc.render.shader.AbstractShaderInitializer}
         */
        constructor( public _webglState : WebGLState, shaderDefinition : AbstractShaderInitializer ) {
            this.__initializeFromShaderDefinition(shaderDefinition);
        }

        enableAttributes() : AbstractShader {
            for( var i=0; i<this._attributes.length; i++ ) {
                this._attributes[i].enable(this._webglState);
            }

            return this;
        }

        disableAttributes() : AbstractShader {
            for( var i=0; i<this._attributes.length; i++ ) {
                this._attributes[i].disable(this._webglState);
            }

            return this;
        }

        __getShaderDef( def:string|string[] ) : string {

            if ( Object.prototype.toString.call(def)==="[object Array]" ) {
                return (<string[]>def).join('\n');
            }

            return <string>def;
        }

        /**
         * Initialize a shader from a shader initializer.
         * Do not call directly. Ever.
         * @method cc.render.shader.AbstractShader#__initializeFromShaderDefinition
         * @param shaderDef {cc.render.shader.AbstractShaderInitializer}
         * @private
         */
        __initializeFromShaderDefinition(shaderDef : AbstractShaderInitializer) {

            var gl = this._webglState._gl;

            this._shaderProgram = gl.createProgram();
            gl.attachShader(
                this._shaderProgram,
                this.__getShader(gl, "x-shader/x-vertex", this.__getShaderDef(shaderDef.vertexShader) )
            );

            gl.attachShader(
                this._shaderProgram,
                this.__getShader(gl, "x-shader/x-fragment", this.__getShaderDef(shaderDef.fragmentShader) )
            );

            gl.linkProgram(this._shaderProgram);
            if ( gl.getError() ) {
                console.log( gl.getProgramInfoLog(this._shaderProgram) );
            }

            this._webglState.useProgram(this._shaderProgram);

            if ( shaderDef.uniforms ) {
                for( var uniformName in shaderDef.uniforms ) {
                    var uniformDef : UniformInitializer = shaderDef.uniforms[ uniformName ];
                    var type= uniformDef.type;
                    var value=uniformDef.value;

                    var uniform= Uniform.createUniform( uniformName, type, value );
                    uniform.setLocation( gl.getUniformLocation(this._shaderProgram, uniformName ) );

                    if ( typeof value!=="undefined" && value!==null) {
                        uniform.setValue( value );
                        uniform.updateValue( this._webglState );
                    }

                    this._uniforms.push( uniform );
                }
            }

            if ( shaderDef.attributes ) {
                for (var i=0; i< shaderDef.attributes.length; i++ ) {

                    var attribute= new Attribute(
                        shaderDef.attributes[i],
                        gl.getAttribLocation(this._shaderProgram, shaderDef.attributes[i] ) );

                    this._attributes.push( attribute );
                }
            }

        }

        /**
         * Get a shader of given type.
         * Do not call directly.
         * @member cc.render.shader.AbstractShader#__getShader
         * @param gl {WebGLRenderingContext}
         * @param type {string}
         * @param str {string}
         * @returns {any}
         * @private
         */
        __getShader(gl, type, str) {
            var shader : any;
            if (type === "x-shader/x-fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (type === "x-shader/x-vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, str);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;

        }

        /**
         * Use this program for gpu rendering.
         * @method cc.render.shader.AbstractShader#useProgram
         * @returns {cc.render.shader.AbstractShader}
         */
        useProgram() {
            if ( this._shaderProgram!==this._webglState._currentProgram) {
                this._webglState.useProgram(this._shaderProgram);
                this.enableAttributes();
            }

        }

        notUseProgram() {
            if ( this._shaderProgram===this._webglState._currentProgram) {
                this.disableAttributes();
            }
        }

        /**
         * Flush geometry.
         * Must br overridden.
         * @method cc.render.shader.AbstractShader#flushBuffersWithContent
         * @param rcs {rcs:cc.render.RenderingContextSnapshot}
         */
        flushBuffersWithContent( rcs:cc.render.RenderingContextSnapshot ) {
        }

        __updateUniformValues() {
            for( var i=0;i<this._uniforms.length;i++) {
                this._uniforms[i].updateValue( this._webglState );
            }
        }

        /**
         * Find a uniform by name.
         * @method cc.render.shader.AbstractShader#findUniform
         * @param name {string}
         * @returns {cc.render.shader.Uniform}
         */
        findUniform( name ) : cc.render.shader.Uniform {
            for( var i=0; i< this._uniforms.length; i++ ) {
                if (this._uniforms[i]._name===name ) {
                    return this._uniforms[i];
                }
            }

            return null;
        }

        /**
         * Find an attribute by name.
         * @method cc.render.shader.AbstractShader#findAttribute
         * @param name {string}
         * @returns {cc.render.shader.Attribute}
         */
        findAttribute( name ) {
            for( var i=0; i< this._attributes.length; i++ ) {
                if (this._attributes[i]._name===name ) {
                    return this._attributes[i];
                }
            }

            return null;

        }

        /**
         * Build a shader mat4 from a Matrix3 instance.
         * @method cc.render.shader.AbstractShader#mat4_from_mat3
         * @param mat3 {Float32Array}
         * @param __mat4 {Float32Array}
         * @returns {Float32Array}
         */
        mat4_from_mat3( mat3 : Float32Array, __mat4 : Float32Array ) {

            __mat4[ 0] = mat3[0];
            __mat4[ 4] = mat3[1];
            __mat4[ 1] = mat3[3];
            __mat4[ 5] = mat3[4];
            __mat4[12] = mat3[2];
            __mat4[13] = mat3[5];

            return __mat4;
        }

        useMeshIndex() : boolean {
            return false;
        }
    }

}