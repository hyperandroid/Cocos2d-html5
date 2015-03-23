/**
 * License: see license.txt file.
 */


module cc.math {

    "use strict";

    /**
     * @class cc.math.Point
     * @interface
     * @classdesc
     *
     * A 2d or 3d point interface.
     *
     */
    export interface Point {
        /**
         * Point x coordinate.
         * @member cc.math.Point#x
         * @type {number}
         */
        x : number;
        /**
         * Point y coordinate.
         * @member cc.math.Point#y
         * @type {number}
         */
        y : number;

    }

    /**
     * @class cc.math.Vector
     * @classdesc
     *
     * Object represents a 2D or 3D vector.
     */
    export class Vector implements Point {

        /**
         * Point x coordinate.
         * @member cc.math.Vector#x
         * @type {number}
         */

        /**
         * Point y coordinate.
         * @member cc.math.Vector#y
         * @type {number}
         */

        /**
         * Point z coordinate.
         * @member cc.math.Vector#z
         * @type {number}
         */

        /**
         * @method cc.math.Vector#constructor
         * @param x {number} vector x coordinate
         * @param y {number} vector y coordinate
         * @param z {number} vector z coordinate. if not set zero by default.
         */
        constructor(public x:number= 0, public y:number= 0, public z:number= 0) {

        }

        /**
         * Set a Vector with new values.
         *
         * @method cc.math.Vector#set
         * @param x {number} vector x coordinate
         * @param y {number} vector y coordinate
         * @param z {number=} vector z coordinate. if not set zero by default.
         * @returns {cc.math.Vector}
         */
        set( x : number, y: number ) : Vector {
            this.x= x;
            this.y= y;
            this.z= 0;

            return this;
        }

        /**
         * get the vector length.
         * @returns {number}
         */
        length() : number {
            return Math.sqrt( this.x*this.x + this.y*this.y );
        }

        /**
         * get the vector angle.
         * @returns {number}
         */
        angle() : number {
            return Math.atan2( this.y, this.x );
        }

        normalize() : Vector {
            var l= this.length();
            this.x/= l;
            this.y/= l;

            return this;
        }

        /**
         * Calculate distance from the vector to another vector.
         * @param v {cc.math.Vector}
         * @returns {number}
         */
        distance( v : Vector ) : number {
            return Vector.distance( this, v );
        }

        /**
         * Substract a vector from this vector.
         * @param v {cc.math.Vector}
         */
        sub( v : Vector ) : Vector {
            this.x-= v.x;
            this.y-= v.y;
            return this;
        }

        /**
         * Add a vector from this vector.
         * @param v {cc.math.Vector}
         */
        add( v : Vector ) : Vector {
            this.x+= v.x;
            this.y+= v.y;
            return this;
        }

        /**
         * Multiply the vector by a scalar.
         * @param v {number}
         * @returns {cc.math.Vector}
         */
        mult( v : number ) : Vector {
            this.x*=v;
            this.y*=v;
            this.z*=v;
            return this;
        }

        static add( v0:Point,v1:Point ) : Vector {
            return new Vector( v1.x+v0.x, v1.y+v0.y );
        }

        /**
         * Create a Vector with the substraction of two vectors.
         * @param v0 {cc.math.Vector}
         * @param v1 {cc.math.Vector}
         * @returns {Vector}
         */
        static sub( v1:Point,v0:Point ) : Vector {
            return new Vector( v1.x-v0.x, v1.y-v0.y );
        }

        /**
         * Calculate the distance between two vectors
         * @param v0 {cc.math.Vector}
         * @param v1 {cc.math.Vector}
         * @returns {number} distance between vectors.
         */
        static distance( v0 : Point, v1 : Point ) : number {
            var dx= v1.x - v0.x;
            var dy= v1.y - v0.y;

            return Math.sqrt( dx*dx + dy*dy );
        }

        static angleWith( p0:Point, p1:Point ) : number {
            var x= p1.x - p0.x;
            var y= p1.y - p0.y;
            return Math.atan2(y,x);
        }

        static middlePoint( p0:Point, p1:Point ) {
            var x= (p1.x+p0.x)/2;
            var y= (p1.y+p0.y)/2;
            return new Vector(x,y);
        }

        /**
         * Compare the vector with another vector for equality.
         * @param v {cc.math.Vector}
         * @returns {boolean}
         */
        equals( v : Vector ) {
            return this.x===v.x && this.y===v.y;
        }

        /**
         * Create a new Vetor copy of this vector.
         * @returns {cc.math.Vector}
         */
        clone() : Vector {
            return new Vector( this.x, this.y, this.z );
        }

        perpendicular() {
            var x = this.x;
            this.x = -this.y;
            this.y = x;

            return this;
        }

        invert() {
            this.x = -this.x;
            this.y = -this.y;

            return this;
        }

    }
}