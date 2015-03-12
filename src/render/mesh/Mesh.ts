/**
 * License: see license.txt file
 */

module cc.render {


    /**
     * A mesh is a grid composed of geometry and u,v information.
     */
    export class Mesh {

        geometry : Float32Array = null;
        uv : Float32Array = null;

        Mesh() {

        }

        initialize( geometry: Float32Array|Array<number>, uv: Float32Array|Array<number> ) {

            if ( Object.prototype.toString.call(geometry)==='[object Array]' ) {
                this.geometry= new Float32Array( geometry );
            } else {
                this.geometry= <Float32Array>geometry;
            }

            if ( Object.prototype.toString.call(uv)==='[object Array]' ) {
                this.uv= new Float32Array( uv );
            } else {
                this.uv= <Float32Array>uv;
            }
        }

    }

}