/**
 * License: see license.txt file
 */

module cc.math {

    /**
     * @class cc.math.Dimension
     * @classdesc
     *
     * This Class is for dimension definition.
     */
    export class Dimension {

        /**
         * Dimension width.
         * @member cc.math.Dimension#width
         * @type {number}
         * @public
         */

        /**
         * Dimension height.
         * @member cc.math.Dimension#height
         * @type {number}
         * @public
         */

        /**
         * Build a new Dimension instance.
         * @method cc.math.Dimension#constructor
         * @param width {number}
         * @param height {number}
         */
        constructor( public width:number=0, public height:number=0 ) {

        }

        set( d:Dimension );
        set( w:number, h:number ) : Dimension;

        /**
         * Set the dimension.
         * @param w {any}
         * @param h {number}
         * @returns {cc.math.Dimension}
         */
        set( w:any, h?:number ) : Dimension {

            if ( typeof w==='number' ) {
                this.width= w;
                this.height=h;
            } else {
                var d : Dimension = <Dimension>w;
                this.width= d.width;
                this.height=d.height;
            }

            return this;
        }

        clone() : Dimension {
            return new Dimension( this.width, this.height );
        }
    }
}