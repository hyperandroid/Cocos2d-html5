/**
 * License: see license.txt file
 */

module cc.render {


    /**
     * @namespace WebGLState
     * @memberOf cc.render
     *
     * @classdesc
     * This object keeps global webGL state. It has two main purposes.
     *  + Avoid duplicate webgl calls.
     *  + Share internal renderer state with external shaders or renderers so that WebGL state can be consistent when
     *    getting back to the renderer.
     *
     */
    export class WebGLState {

        /**
         * Current program
         * @member cc.render.WebGLState#_currentProgram
         * @type {WebGLProgram}
         */
        _currentProgram : WebGLProgram = null;

        /**
         * Current texture
         * @member cc.render.WebGLState#_currentTexture
         * @type {WebGLTexture}
         */
        _currentTexture : WebGLTexture = null;

        /**
         * blendFunc source blending value.
         * @member cc.render.WebGLState#_blendSource
         * @type {number}
         * @private
         */
        _blendSource : number = -1;

        /**
         * blendFunc destination blending value.
         * @member cc.render.WebGLState#_blendDestination
         * @type {number}
         * @private
         */
        _blendDestination : number = -1;

        /**
         * Object to hold gl flags values, particularly, all calls to gl.enable
         * @member cc.render.WebGLState#_flags
         * @type {{flag:number, enabled:boolean}}
         * @private
         */
        _flags : any = {};

        /**
         * current gl.clearColor value.
         * @member cc.render.WebGLState#_clearColor
         * @type {Array<number>}
         * @private
         */
        _clearColor : number[] = [-1,-1,-1,-1];

        /**
         * current gl.viewport value.
         * @member cc.render.WebGLState#_viewport
         * @type {Array<number>}
         * @private
         */
        _viewport : number[] = [-1,-1,-1,-1];

        /**
         * gl.TEXTURE<XX> values.
         * @member cc.render.WebGLState#_texture
         * @type {{ texture:number, enabled:boolean }}
         * @private
         */
        _texture : any = {};

        /**
         * WebGLUniformLocation dictionary.
         * @member cc.render.WebGLState#_uniformLocation
         * @type {{uniform:WebGLUniformLocation, value:any}}
         * @private
         */
        _uniformLocation : any = {};

        /**
         * vertex attrib array enabled values.
         * @member cc.render.WebGLState#_attribArray
         * @type {Map<number,boolean>}
         * @private
         */
        _attribArray : any = {
            0 : false,
            1 : false,
            2 : false,
            3 : false,
            4 : false,
            5 : false,
            6 : false,
            7 : false,
            8 : false,
            9 : false,
            10: false
        };

        _attribPointers : any = {};

        constructor( public _gl:WebGLRenderingContext) {

            // create TEXTURE<X> entries.
            for( var i=0; i<16; i++ ) {
                this._texture[ _gl["TEXTURE"+i] ]= false;
            }

        }

        useProgram( program:WebGLProgram ) {
            if ( program!==this._currentProgram ) {
                this._currentProgram= program;
                this._gl.useProgram( program );
            }
        }

        /**
         *
         * @param i {number} gl.TEXTURE<X> value.
         */
        activeTexture( i : number ) {
            if ( !this._texture[i] ) {
                this._texture[i]= true;
                this._gl.activeTexture( i );
            }
        }

        bindTexture( type:number, t:WebGLTexture ) {
            if ( t!==this._currentTexture ) {
                this._gl.bindTexture(type, t);
                this._currentTexture= t;
            }
        }

        enable( flag : number ) {

            if ( !this._flags.hasOwnProperty(flag) ) {
                this._flags[flag]= false;
                this._gl.enable( flag );
                return;
            }

            if ( this._flags[flag] ) {
                return;
            }

            this._flags[flag]= true;
            this._gl.enable( flag );
        }

        flagEnabled( flag ) : boolean {
            return this._flags[flag];
        }

        disable( flag : number ) {

            if ( !this._flags.hasOwnProperty(flag) ) {
                this._flags[flag]= false;
                this._gl.disable( flag );
                return;
            }

            if ( !this._flags[flag] ) {
                return;
            }

            this._flags[flag]= false;
            this._gl.disable( flag );
        }

        clear( flags ) {
            this._gl.clear( flags );
        }

        clearColor( r:number, g:number, b:number, a:number ) {
            if (r!==this._clearColor[0] ||
                g!==this._clearColor[1] ||
                b!==this._clearColor[2] ||
                a!==this._clearColor[3] ) {

                this._clearColor[0]=r;
                this._clearColor[1]=g;
                this._clearColor[2]=b;
                this._clearColor[3]=a;

                this._gl.clearColor(r,g,b,a);
            }
        }

        viewport( x:number, y:number, w:number, h:number ) {
            if (x!==this._viewport[0] ||
                y!==this._viewport[1] ||
                w!==this._viewport[2] ||
                h!==this._viewport[3] ) {

                this._viewport[0]= x;
                this._viewport[1]= y;
                this._viewport[2]= w;
                this._viewport[3]= h;

                this._gl.viewport(x,y,w,h);
            }
        }

        blendFunc( blendSource:number, blendDestination:number ) {
            if ( this._blendSource!==blendSource || this._blendDestination!==blendDestination ) {

                this._blendSource= blendSource;
                this._blendDestination= blendDestination;

                this._gl.blendFunc(blendSource, blendDestination);
            }
        }

        __uniform1Scalar( location:any, value:any ) {

            // pending remove hasOwnProperty with prior initialization
            if ( !this._uniformLocation.hasOwnProperty(location._id) ) {
                this._uniformLocation[location._id]= null;
            }

            if ( this._uniformLocation[location._id]!==value ) {
                this._gl.uniform1i( location, value );
                this._uniformLocation[location._id]= value;
            }
        }

        uniform1i( location:any, value:any ) {
            this.__uniform1Scalar( location, value );
        }

        uniform1f( location:any, value:any ) {
            this.__uniform1Scalar( location, value );
        }

        uniformMatrix4fv( location:any, transpose:boolean, value:Float32Array ) {

            // pending remove hasOwnProperty with prior initialization
            if ( !this._uniformLocation.hasOwnProperty(location._id) ) {
                this._uniformLocation[location._id]= [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
            }

            var v0= this._uniformLocation[location._id];

            if ( v0[0] !==value[0]  || v0[1] !==value[1]  || v0[2] !==value[2]  || v0[3] !==value[3]  ||
                 v0[4] !==value[4]  || v0[5] !==value[5]  || v0[6] !==value[6]  || v0[7] !==value[7]  ||
                 v0[8] !==value[8]  || v0[9] !==value[9]  || v0[10]!==value[10] || v0[11]!==value[11] ||
                 v0[12]!==value[12] || v0[13]!==value[13] || v0[14]!==value[14] || v0[15]!==value[15]    ) {

                this._gl.uniformMatrix4fv(location, transpose, value);
                this._uniformLocation[location._id] = value;
            }
        }

        vertexAttribPointer( locationIndex : number, size : number, type : number, normalized : boolean, stride : number, offset : number ) {
/*
            if (!this._attribPointers.hasOwnProperty(locationIndex)) {
                this._attribPointers[locationIndex]= {
                    size : -1,
                    type : -1,
                    normalized : false,
                    stride : -1,
                    offset : -1
                };
            }

            var v= this._attribPointers[locationIndex];
            if ( v.size!==size || v.type!==type || v.normalized!==normalized || v.stride!==stride || v.offset!==offset) {

                v.size= size;
                v.type= type;
                v.normalized= normalized;
                v.stride= stride;
                v.offset= offset;

            }
*/
            this._gl.vertexAttribPointer(locationIndex, size, type, normalized, stride, offset);

        }

        enableVertexAttribArray( locationIndex:number ) {
            if ( !this._attribArray.hasOwnProperty(locationIndex) ) {
                this._attribArray[locationIndex]= false;
            }

            if ( this._attribArray[locationIndex] ) {
                return;
            }

            this._attribArray[locationIndex]= true;
            this._gl.enableVertexAttribArray(locationIndex);
        }

        disableVertexAttribArray( locationIndex:number ) {
            if ( !this._attribArray.hasOwnProperty(locationIndex) ) {
                this._attribArray[locationIndex]= false;
            }

            if ( !this._attribArray[locationIndex] ) {
                return;
            }

            this._attribArray[locationIndex]= false;
            this._gl.disableVertexAttribArray(locationIndex);
        }

        setTexture( textureIndex:number, textureId:WebGLTexture ) {

            if ( textureId!==this._currentTexture ) {
                this.activeTexture(this._gl.TEXTURE0);
                this.bindTexture(this._gl.TEXTURE_2D, textureId);
                this._currentTexture= textureId;
            }

        }
    }
}