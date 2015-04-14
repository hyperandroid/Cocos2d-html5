/**
 * License: see license.txt file
 */

/// <reference path="../Point.ts"/>
/// <reference path="./Segment.ts"/>
/// <reference path="./ContainerSegment.ts"/>
/// <reference path="../Path.ts"/>
/// <reference path="../../render/RenderingContext.ts"/>

module cc.math.path {

    import Vector= cc.math.Vector;
    import Point= cc.math.Point;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;
    import Path = cc.math.Path;

    var __v0 : Vector = new Vector();

    /**
     * @class cc.math.path.SegmentCardinalSplineInitializer
     * @interface
     * @classdesc
     *
     * A cardinal spline is composed of a collection of points to interpolate and a tension parameter.
     * The curve implementation will duplicate some of the points.
     *
     */
    export interface SegmentCardinalSplineInitializer extends cc.math.path.SegmentInitializer {

        points : cc.math.Point[];
        tension? : number;
    }

    /**
     * @class cc.math.path.SegmentCardinalSpline
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This Object is a Quadratic Bezier Segment.
     * <p>
     *     It is composed of two points and a tension control point. Internally, the Segment can cache its contour.
     * <p>
     *     The contour can be of two different types:
     *     + directly traced over the curve. Leaves points at different distances on the curve.
     *     + equi-distant on the curve. Internally traces the points as in the other type, but then creates a polyline
     *       path with the points, and samples the resulting path at regular intervals. This transforms the curve into
     *       a polyline, which is faster for most calculations, but could not be as smooth as the other type.
     * <p>
     * By default, the curve is calculated with the first type, directly tracing on the curve
     *
     */
    export class SegmentCardinalSpline implements Segment {


        /**
         * Start Cubic curve point.
         * @member cc.math.path.SegmentCardinalSpline#_p0
         * @type {cc.math.Vector}
         * @private
         */
        _p0 : Vector = null;

        /**
         * First Cubic curve control point.
         * @member cc.math.path.SegmentCardinalSpline#_cp0
         * @type {cc.math.Vector}
         * @private
         */
        _cp0: Vector = null;

        /**
         * Second Cubic curve control point.
         * @member cc.math.path.SegmentCardinalSpline#_cp1
         * @type {cc.math.Vector}
         * @private
         */
        _cp1: Vector = null;

        /**
         * End Cubic curve point.
         * @member cc.math.path.SegmentCardinalSpline#_p1
         * @type {cc.math.Vector}
         * @private
         */
        _p1 : Vector = null;

        _tension : number =.5;

        /**
         * Internal flag for cache validity.
         * @member cc.math.path.SegmentCardinalSpline#_dirty
         * @type {boolean}
         * @private
         */
        _dirty:boolean = true;

        /**
         * Parent segment.
         * @member cc.math.path.SegmentCardinalSpline#_parent
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent:ContainerSegment = null;

        /**
         * Segment length. It is approximately calculated by subdividing the curve.
         * @member cc.math.path.SegmentCardinalSpline#_length
         * @type {number}
         * @private
         */
        _length:number = 0;

        /**
         * Create a new Quadratic Segment instance.
         * @param data {cc.math.path.SegmentCardinalSplineInitializer=}
         */
        constructor(data?:SegmentCardinalSplineInitializer) {
            if (data) {
                this.__createFromInitializer(data);
            }
        }

        __createFromInitializer( data:SegmentCardinalSplineInitializer ) {
            this.initialize(data.points[0],data.points[1],data.points[2],data.points[3], data.tension);
        }

        /**
         * Initialize the Segment with the supplied points.
         * @param p0 {cc.math.Point}
         * @param cp0 {cc.math.Point}
         * @param cp1 {cc.math.Point}
         * @param p1 {cc.math.Point}
         * @param tension {number}
         */
        initialize(p0:Point,cp0:Point,cp1:Point,p1:Point, tension:number):void {

            this._tension = typeof tension==="undefined" ? 0.5 : tension;
            this._p0= new Vector( p0.x,p0.y );
            this._cp0= new Vector( cp0.x,cp0.y );
            this._cp1= new Vector( cp1.x,cp1.y );
            this._p1= new Vector( p1.x,p1.y );

            this.__calculateLength();
            this._dirty = false;
        }

        /**
         * Set Segment tension. By default it is 0.5
         * Setting a different tension will mark the segment as dirty, nulling all internal caches.
         * @param t {number}
         */
        setTension( t : number ) {
            if ( t!==this._tension ) {
                this._tension= t;
                this.__calculateLength();
                if ( this._parent ) {
                    this._parent.setDirty(true);
                }
            }
        }

        __calculateLength():void {
            var points = this.trace( null, cc.math.path.DEFAULT_TRACE_LENGTH );
            // calculate distance
            this._length = 0;
            for (var i = 0; i < points.length - 1; i++) {
                this._length += points[i].distance(points[i + 1]);
            }

            this._dirty= false;
        }

        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentCardinalSpline#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent():ContainerSegment {
            return this._parent;
        }

        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentCardinalSpline#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent(s:ContainerSegment):void {
            this._parent = s;
        }

        /**
         * Get the Segment length.
         * @override
         * @method cc.math.path.SegmentCardinalSpline#getLength
         * @returns {number}
         */
        getLength():number {
            if ( this._dirty ) {
                this.__calculateLength();
            }
            return this._length;
        }

        /**
         * Sample some points on the segment. It will return either the sampled contour, or the flattened version of it.
         * It returns the points that conform the Segment contour, if they are changed, the contour will be changed as well.
         * @method cc.math.path.SegmentCardinalSpline#trace
         * @param numPoints {number=} number of points traced on the segment.
         * @param dstArray {Array<cc.math.Vector>=} array where to add the traced points.
         * @returns {Array<Vector>} returns the supplied array of points, or a new array of points if not set.
         */
        trace( dstArray?:Array<Vector>, numPoints?:number ):Vector[] {

            numPoints= numPoints||cc.math.path.DEFAULT_TRACE_LENGTH;

            dstArray = dstArray || [];
            for( var i=0; i<=numPoints; i++ ) {
                dstArray.push( this.getValueAt(i/numPoints) );
            }

            return dstArray;
        }

        /**
         * Get a point on the Segment at the given proportional position.
         * + If the segment is flattened, the value will be calculated from the internally cached curve contour.
         * + If not, if will be calculated by solving the curve.
         * The first is faster, but could be inaccurate for curves with a los number of flattened cached points.
         * @param normalizedPos {number} value in the range 0..1
         * @param out {cc.math.Vector=} optional out point. if not set, an internal spare point will be used.
         * @returns {cc.math.Vector} a point on the segment at the given position. This point should be copied,
         * successive calls to getValue will return the same point instance.
         */
        getValueAt(normalizedPos:number, out?:Vector):Vector {

            // no out point, use a spare internal one. WARNING, will be continuously reused.
            out = out || new cc.math.Vector();

            // fix normalization values, just in case.
            if (normalizedPos > 1 || normalizedPos < -1) {
                normalizedPos %= 1;
            }
            if (normalizedPos < 0) {
                normalizedPos += 1;
            }

            if (normalizedPos === 1) {
                var lp = this.getEndingPoint();
                out.set(lp.x, lp.y);
            } else if (normalizedPos === 0) {

                var fp_ = this.getStartingPoint();
                out.set(fp_.x, fp_.y);
            } else {

                var t= normalizedPos;

                var t2 = t * t;
                var t3 = t2 * t;

                var s = (1.0 - this._tension) / 2.0;

                var b1 = s * ((-t3 + (2.0 * t2)) - t);                      // s(-t3 + 2 t2 - t)P1
                var b2 = s * (-t3 + t2) + (2.0 * t3 - 3.0 * t2 + 1.0);          // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
                var b3 = s * (t3 - 2.0 * t2 + t) + (-2.0 * t3 + 3.0 * t2);      // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
                var b4 = s * (t3 - t2);                                   // s(t3 - t2)P4

                out.x = this._p0.x * b1 + this._cp0.x * b2 + this._cp1.x * b3 + this._p1.x * b4;
                out.y = this._p0.y * b1 + this._cp0.y * b2 + this._cp1.y * b3 + this._p1.y * b4;


            }

            return out;
        }

        /**
         * Get the Segment's starting point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getStartingPoint():Vector {
            return this._cp0;
        }

        /**
         * Get the Segment's ending point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getEndingPoint():Vector {
            return this._cp1;
        }

        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentCardinalSpline#clone
         * @returns {cc.math.path.Segment}
         */
        clone():SegmentCardinalSpline {

            var segment = new SegmentCardinalSpline({
                points : [
                    this._p0.clone(),
                    this._cp0.clone(),
                    this._cp1.clone(),
                    this._p1.clone()
                ],
                tension: this._tension
            });

            segment._length = this._length;

            return segment;
        }

        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.SegmentCardinalSpline#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?:Array<Point>):Array<Point> {
            arr = arr || [];

            arr.push( this._p0 );
            arr.push( this._cp0 );
            arr.push( this._cp1 );
            arr.push( this._p1 );

            return arr;
        }


        /**
         * Mark the quadratic as dirty. Mark internal polilyne info as invalid.
         * @methodcc.math.path.SegmentCardinalSpline#setDirty
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


        canvasStroke( ctx:cc.render.RenderingContext ) {
            this.canvasFill(ctx);
        }

        canvasFill( ctx:cc.render.RenderingContext ) {

            var c= this.trace(null, 50);
            for( var i=1 ; i<c.length; i++ ) {
                ctx.lineTo( c[i].x, c[i].y );
            }
        }

        getInitializer() : SegmentCardinalSplineInitializer {
            return {
                type: "SegmentCardinalSpline",
                tension: this._tension,
                points: [
                    this._p0.clone(),
                    this._cp0.clone(),
                    this._cp1.clone(),
                    this._p1.clone()
                ]
            };
        }

    }
}