/**
 * Created by ibon on 11/23/14.
 */

/// <reference path="../Point.ts"/>
/// <reference path="./Segment.ts"/>
/// <reference path="./ContainerSegment.ts"/>
/// <reference path="../../render/RenderingContext.ts"/>

module cc.math.path {

    import Vector = cc.math.Vector;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;

    /**
     * @class cc.math.path.SegmentArcInitializer
     * @interface
     * @classdesc
     */
    export interface SegmentArcInitializer {
        x : number;
        y : number;
        radius : number;
        startAngle : number;
        endAngle : number;
        ccw : boolean;
    }

    var __v0 : Vector = new Vector();

    /**
     * @class cc.math.path.SegmentArc
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This Segment represents a circle's arc.
     * The arc is defined by a position, a radius and two angles. It also specified how the angles should be traversed
     * clock or counter clock wisely.
     * The arc will be the minimum angle between the start and end angles.
     *
     */
    export class SegmentArc implements Segment {

        /**
         * Parent Segment. An instance of <code>ContainerSegment</code>
         * @member cc.math.path.SegmentLine
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent : ContainerSegment;

        /**
         * Arc center x position.
         * @member cc.math.path.SegmentArc#_x
         * @type {number}
         * @private
         */
        _x:number;

        /**
         * Arc center y position.
         * @member cc.math.path.SegmentArc#_y
         * @type {number}
         * @private
         */
        _y:number;

        /**
         * Arc radius.
         * @member cc.math.path.SegmentArc#_radius
         * @type {number}
         * @private
         */
        _radius:number;

        /**
         * Arc starting angle.
         * @member cc.math.path.SegmentArc#_startAngle
         * @type {number}
         * @private
         */
        _startAngle:number;

        /**
         * Arc ending angle.
         * @member cc.math.path.SegmentArc#_endAngle
         * @type {number}
         * @private
         */
        _endAngle:number;

        _dirty:boolean=true;

        /**
         * Arc traversal direction. If true counter clockwise, clockwise otherwise.
         * For example, an arc with startAngle=0 and endAngle=Math.PI/3, if ccw is false will be a PI/3 arc, and a
         * 2PI-PI/3 arc if it is true.
         * @member cc.math.path.SegmentArc#_ccw
         * @type {number}
         * @private
         */
        _ccw:boolean;

        /**
         * Cached arc starting point.
         * @member cc.math.path.SegmentArc#_startingPoint
         * @type {cc.math.Vector}
         * @private
         */
        _startingPoint : Vector= null;

        /**
         * Cached arc ending point.
         * @member cc.math.path.SegmentArc#_endingPoint
         * @type {cc.math.Vector}
         * @private
         */
        _endingPoint : Vector= null;

        /**
         * Cached Segment length value.
         * @member cc.math.path.SegmentArc#_length
         * @type {number}
         * @private
         */
        _length : number = 0;


        /**
         * Build a new SegmentArc instance.
         * @method cc.math.path.SegmentArc#constructor
         * @param data {cc.math.path.SegmentArcInitializer=} optional arc initialization data.
         */
        constructor(data?:SegmentArcInitializer) {
            this.initialize(data);
        }

        /**
         * Initialize the Arc Segment with data.
         * @method cc.math.path.SegmentArc#initialize
         * @param data {cc.math.path.SegmentArcInitializer}
         */
        initialize(data:SegmentArcInitializer) {

            this._x = data.x;
            this._y = data.y;
            this._radius = data.radius;
            this._startAngle = data.startAngle;
            this._endAngle = data.endAngle;
            this._ccw = data.ccw;

            if (!this._ccw && this._endAngle <= this._startAngle) {
                this._endAngle += 2 * Math.PI;
            }
            else if (this._ccw && this._startAngle <= this._endAngle) {
                this._startAngle += 2 * Math.PI;
            }

            var s:Vector = this.getValueAt(0);
            this._startingPoint = new Vector();
            this._startingPoint.x = s.x;
            this._startingPoint.y = s.y;
            s = this.getValueAt(1);
            this._endingPoint = new Vector();
            this._endingPoint.x = s.x;
            this._endingPoint.y = s.y;
            this.__calculateLength();
        }

        __calculateLength() {
            this._length= Math.abs( this._radius * (this._endAngle - this._startAngle ) );
            this._dirty= false;
        }

        /**
         * Return the Segment's starting point reference. It is the stored one, not a copy.
         * @method cc.math.path.SegmentArc#getStartingPoint
         * @returns {cc.math.Vector}
         */
        getStartingPoint() : Vector {
            return this._startingPoint;
        }

        /**
         * Return the Segment's ending point reference. It is the stored one, not a copy.
         * @method cc.math.path.SegmentArc#getEndingPoint
         * @returns {cc.math.Vector}
         */
        getEndingPoint() : Vector {
            return this._endingPoint;
        }

        /**
         * Get the Segment's arc length.
         * @method cc.math.path.SegmentArc#getLength
         * @returns {number}
         */
        getLength() : number {
            if ( this._dirty ) {
                this.__calculateLength();
            }
            return this._length;
        }

        /**
         * Get a Point in the Arc.
         * @method cc.math.path.SegmentArc#getValueAt
         * @param v {number} Position in path. 0= startingPoint, 1= endingPoint
         * @param out {cc.math.Vector=} an optional out Point. If not set, an internal spare point will be returned.
         * @returns {cc.math.Vector}
         */
        getValueAt( v : number, out? : Vector ) : Vector  {

            var diffAngle : number = ( this._endAngle - this._startAngle ) * v;

            out= out || new cc.math.Vector();

            out.x= this._x + this._radius * Math.cos(this._startAngle + diffAngle);
            out.y= this._y + this._radius * Math.sin(this._startAngle + diffAngle);

            return out;
        }

        /**
         * Sample some points in the Segment.
         * @method cc.math.path.SegmentArc#trace
         * @param numPoints {number=} Number of points. if not set, cc.math.path.DEFAULT_TRACE_LENGTH points will be traced.
         * @param dstArray {Array<cc.math.Vector>=} optional output array of points. If not set, a new one will be created.
         * @returns {Array<Vector>} An array where the traced points have been added.
         */
        trace( dstArray? : Array<Vector>, numPoints? : number ) : Vector[] {

            numPoints = numPoints || cc.math.path.DEFAULT_TRACE_LENGTH;
            dstArray = dstArray || [];

            if ( this._startAngle===this._endAngle || this._radius===0 ) {
                return dstArray;
            }

            for( var i=0; i<=numPoints; i++ ) {
                dstArray.push( this.getValueAt(i/numPoints, new Vector()) );
            }

            return dstArray;
        }

        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentArc#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent() : ContainerSegment {
            return this._parent;
        }

        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentArc#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent( s : ContainerSegment ) : void {
            this._parent= s;
        }

        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentArc#clone
         * @returns {cc.math.path.Segment}
         */
        clone() : SegmentArc {
            return  new SegmentArc({
                x: this._x,
                y: this._y,
                radius : this._radius,
                startAngle : this._startAngle,
                endAngle : this._endAngle,
                ccw : this._ccw
            });
        }

        /**
         * Add the Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * Arc segments have no control points.
         * @method cc.math.path.SegmentArc#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints( arr? : Array<Point> ) : Array<Point> {
            arr= arr || [];

            return arr;
        }

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


        }

    }
}