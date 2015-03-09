/**
 * License: see license.txt file
 */

/// <reference path="../Point.ts"/>
/// <reference path="./Segment.ts"/>
/// <reference path="./ContainerSegment.ts"/>
/// <reference path="../../render/RenderingContext.ts"/>

module cc.math.path {

    import Point = cc.math.Point;
    import Vector = cc.math.Vector;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;

    /**
     * @class cc.math.path.SegmentLineInitializer
     * @interface
     * @classdesc
     *
     * SegmentLine initialization object.
     *
     */
    export interface SegmentLineInitializer {

        /**
         * Line start point.
         * @member cc.math.path.SegmentLineInitializer#start
         * @type {cc.math.Point}
         */
        start : Point;

        /**
         * Line end point.
         * @member cc.math.path.SegmentLineInitializer#end
         * @type {cc.math.Point}
         */
        end : Point;
    }

    var __v : Vector = new Vector();

    /**
     *
     * @class cc.math.path.SegmentLine
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * Objects of this type represent a line segment.
     * Line segments are added to a Path by calling <code>path.lineTo(x,y)</code>.
     *
     */
    export class SegmentLine implements Segment {

        /**
         * Parent Segment. An instance of <code>ContainerSegment</code>
         * @member cc.math.path.SegmentLine
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent:ContainerSegment = null;

        /**
         * The line segment length.
         * @member cc.math.path.SegmentLine#_length
         * @type {number}
         * @private
         */
        _length:number = 0;

        /**
         * The line start point.
         * @member cc.math.path.SegmentLine#_start
         * @type {cc.math.Vector}
         * @private
         */
        _start : Vector;

        /**
         * The line end point.
         * @member cc.math.path.SegmentLine#_end
         * @type {cc.math.Vector}
         * @private
         */
        _end : Vector;

        _dirty : boolean = true;

        /**
         * Build a new SegmentLine instance.
         * @method cc.math.path.SegmentLine#constructor
         * @param data {SegmentLineInitializer=}
         */
        constructor(data?:SegmentLineInitializer) {
            if ( data ) {
                this.initialize(data.start, data.end);
            }
        }

        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentLine#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent() : ContainerSegment {
            return this._parent;
        }

        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentLine#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent( s : ContainerSegment ) : void {
            this._parent= s;
        }

        /**
         * Initialize this segment points.
         * This method takes the supplied point references, does not build new points.
         * @method cc.math.path.SegmentLine#setPoints
         * @param start {cc.math.Point} start line point.
         * @param end {cc.math.Point} end line point.
         */
        initialize(start:Point, end:Point) {

            this._start = new Vector(start.x, start.y);
            this._end = new Vector(end.x, end.y);

            this.__calculateLength();
        }

        __calculateLength() {
            this._length= Math.sqrt(
                (this._start.x-this._end.x)*(this._start.x-this._end.x) +
                (this._start.y-this._end.y)*(this._start.y-this._end.y) );

            this._dirty= false;
        }

        /**
         * Get the line length.
         * @override
         * @method cc.math.path.SegmentLine#getLength
         * @returns {number}
         */
        getLength() : number {
            return this._length;
        }

        /**
         * Sample some points on the line segment.
         * This implementation only samples two points, initial and final.
         * It returns the points that conform the line, if they are changed, the line will be changed as well.
         * @method cc.math.path.SegmentLine#trace
         * @param numPoints {number=} number of points traced on the segment.
         * @param dstArray {Array<cc.math.Vector>=} array where to add the traced points.
         * @returns {Array<Vector>} returns the supplied array of points, or a new array of points if not set.
         */
        trace( dstArray? : Array<Vector>, numPoints? : number ) : Vector[] {

            dstArray= dstArray || [];

            dstArray.push( this._start );
            dstArray.push( this._end );

            return dstArray;
        }

        /**
         * Get a point on the line at the given proportional position.
         * @param normalizedPos {number} value in the range 0..1
         * @param out {cc.math.Vector=} optional out point. if not set, an internal spare point will be used.
         * @returns {cc.math.Vector} a point on the segment at the given position. This point should be copied,
         * successive calls to getValue will return the same point instance.
         */
        getValueAt( normalizedPos : number, out? : Vector ) : Vector {

            out= out || new cc.math.Vector();

            out.x= ( this._end.x - this._start.x )*normalizedPos + this._start.x;
            out.y= ( this._end.y - this._start.y )*normalizedPos + this._start.y;

            return out;
        }

        /**
         * Get the Segment's starting point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getStartingPoint() : Vector {
            return this._start;
        }

        /**
         * Get the Segment's ending point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getEndingPoint() : Vector {
            return this._end;
        }

        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentLine#clone
         * @returns {cc.math.path.Segment}
         */
        clone() : SegmentLine {

            var sl= new SegmentLine({
                start : {
                    x: this._start.x,
                    y: this._start.y
                },
                end : {
                    x: this._end.x,
                    y: this._end.y
                }
            });

            sl._length= this._length;
            return this;
        }

        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.SegmentLine#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints( arr? : Array<Point> ) : Array<Point> {
            arr= arr || [];

            arr.push( this._start );
            arr.push( this._end );

            return arr;
        }

        /**
         * Mark the Segment dirty.
         * No action for lines.
         * @methodcc.math.path.SegmentLine#setDirty
         */

        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(d:boolean) {
            this._dirty= d;
            var p : ContainerSegment= this._parent;
            while(p) {
                p.setDirty(d);
                p=p._parent;
            }
        }

        paint( ctx:cc.render.RenderingContext ) {

            ctx.beginPath();
            ctx.moveTo( this._start.x, this._start.y );
            ctx.lineTo( this._end.x, this._end.y );
            ctx.stroke();
        }

    }
}