/**
 * Created by ibon on 11/19/14.
 */

module cc.render.shader {

    (function() {
        console.log("Buffers: in bufferData mode with whole buffer.");
    })();

    export class Buffer {

        _buffer : WebGLBuffer = null;
        _prevValue : any = null;

        constructor(public _gl : WebGLRenderingContext, public _type : number, initialValue:any ) {

            this._buffer= _gl.createBuffer();
            if ( initialValue ) {
                this._gl.bindBuffer( _type, this._buffer );
                this._gl.bufferData( _type, initialValue, _gl.STREAM_DRAW );
            }
        }

        /**
         *
         * @param gl {WebGLRenderingContext}
         * @param v {Float32Array|UInt16Array}
         */
        enableWithValue( v : any ) {

            this._gl.bindBuffer( this._type, this._buffer );
            //if ( this._prevValue!==v ) {
                this._gl.bufferData( this._type, v, this._gl.STREAM_DRAW );
                //this._gl.bufferSubData( this._type, 0, v );
                //this._prevValue= v;
            //}
        }

        forceEnableWithValue( v : any ) {

            this._gl.bindBuffer( this._type, this._buffer );
            this._gl.bufferData( this._type, v, this._gl.STREAM_DRAW );
            //this._gl.bufferSubData( this._type, 0, v );
        }

    }

}