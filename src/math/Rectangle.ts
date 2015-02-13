/**
 * License: see license.txt file.
 */

/// <reference path="./Point.ts"/>

module cc.math {

    import Point = cc.math.Point;

    "use strict";

    /**
     * @class cc.math.Rectangle
     * @classdesc
     *
     * Rectangle Object.
     */
    export class Rectangle {

        /**
         * 'right' corner x coord.
         * @member cc.math.Rectangle#x1
         * @type {number}
         */
        x1 : number = 0;

        /**
         * 'right' corner y coord.
         * @member cc.math.Rectangle#y1
         * @type {number}
         */
        y1 : number = 0;

        /**
         * Left-top x coordinate
         * @member cc.math.Rectangle#x
         * @type {number}
         */

        /**
         * Left-top y coordinate
         * @member cc.math.Rectangle#y
         * @type {number}
         */

        /**
         * Rectangle width
         * @member cc.math.Rectangle#w
         * @type {number}
         */

        /**
         * Rectangle height
         * @member cc.math.Rectangle#h
         * @type {number}
         */

        /**
         * Build a new Rectangle instance.
         * @method cc.math.Rectangle#constructor
         * @param x {number=} 'left' corner x coordinate.
         * @param y {number=} 'left' corner y coordinate.
         * @param w {number=} rectangle width.
         * @param h {number=} rectangle height.
         */
        constructor(public x:number=0, public y:number=0, public w:number=0, public h:number=0) {
            this.set(x,y,w,h);
        }

        /**
         * Overwrite the rectangle's coordinates with new values.
         * @method cc.math.Rectangle#set
         * @param x {number} rectangle position x coordinate
         * @param y {number} rectangle position y coordinate
         * @param w {number} rectangle width
         * @param h {number} rectangle height
         * @returns {cc.math.Rectangle} the rectangle instance.
         */
        set( x : number, y : number, w : number, h : number ) : Rectangle {
            this.x= x;
            this.y= y;
            this.w= w;
            this.h= h;
            this.x1= x+w;
            this.y1= y+h;

            return this;
        }

        /**
         * Get whether a Rectangle intersects with this rectangle.
         * @method cc.math.Rectangle#intersects
         * @param r {cc.math.Rectangle}
         * @returns {*}
         */
        intersectsWith( r:Rectangle ) : boolean {
            return this.intersects(r.x,r.y,r.w,r.h);
        }

        /**
         * Gets whether a rectangle of given dimension is inside the rectangle.
         * @method cc.math.Rectangle#intersects
         * @param x {number|Rectangle}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @returns {boolean}
         */
        intersects( x:number, y:number, w:number, h:number ) : boolean {

            if ( this.x1 < x ) {
                return false;
            }
            if ( this.y1 < y ) {
                return false;
            }
            if ( this.x >=x+w ) {
                return false;
            }
            if ( this.y >=y+h ) {
                return false;
            }

            return true;
        }

        /**
         * Normalize the rectangle's dimension with the given width and height.
         * @param w {number}
         * @param h {number}
         * @returns {cc.math.Rectangle} reference to this.
         */
        normalizeBy( w : number, h : number ) : Rectangle {
            this.x/=w;
            this.y/=h;
            this.x1/=w;
            this.y1/=h;
            this.w/=w;
            this.h/=h;

            return this;
        }

        /**
         * Set the Rectangle with zero size.
         * @method cc.math.Rectangle#setEmpty
         */
        setEmpty() : void {
            this.x=0;
            this.y=0;
            this.x1=0;
            this.y1=0;
            this.w=0;
            this.h=0;
        }

        translate( x:number, y:number ) : Rectangle {
            this.x+=x;
            this.y+=y;
            this.x1+=x;
            this.y1+=y;

            return this;
        }

        /**
         * Test whether the Rectangle is empty, eg either its width or height is zero.
         * @method cc.math.Rectangle#isEmpty
         * @returns {boolean}
         */
        isEmpty() : boolean {
            return this.w===0 || this.h===0;
        }

        /**
         * Intersect this rectangle with the parameter Rectangle.
         * @param r {cc.math.Rectangle}
         * @return {cc.math.Rectangle} reference to this.
         */
        intersectWith( r : Rectangle ) : Rectangle {

            if ( this.intersectsWith(r) ) {


                if (this.x < r.x) {
                    this.w -= r.x - this.x;
                    this.x = r.x;
                }
                if (this.y < r.y) {
                    this.h -= r.y - this.y;
                    this.y = r.y;
                }

                if (this.w > r.w) {
                    this.w = r.w;
                }
                if (this.h > r.h) {
                    this.h = r.h;
                }

                this.x1 = this.x + this.w;
                this.y1 = this.y + this.h;
            } else {

                this.setEmpty();
            }

            return this;
        }

        contains( x:number, y:number ) : boolean;
        contains( x:Point ) : boolean;
        contains( x:any, y?:number ) : boolean {

            var tx : number;
            var ty : number;

            if ( typeof x !== "number" ) {
                var v : Point = <Point>x;
                tx= v.x;
                ty= v.y;
            } else {
                tx= x;
                ty= y;
            }

            return tx>=this.x && ty>=this.y && tx<this.x1 && ty<this.y1;
        }

        get width() : number {
            return this.w;
        }

        get height() : number {
            return this.h;
        }

        set width( w:number ) {
            this.w= w;
        }

        set height( h:number ) {
            this.h= h;
        }
    }
}