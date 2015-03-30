/**
 * License: see license.txt file.
 */

/// <reference path="../Point.ts"/>
/// <reference path="./Segment.ts"/>
/// <reference path="./ContainerSegment.ts"/>
/// <reference path="./BezierTracer.ts"/>
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
     * @class cc.math.path.SegmentBezierInitializer
     * @interface
     * @classdesc
     *
     * A Cubic curve is composed of 2 points (initial=p0 and end point=p3) and a two tension control points (p1 and p2).
     *
     */
    export interface SegmentBezierInitializer {

        /**
         * First curve point.
         * @member cc.math.path.SegmentBezierInitializer#p0
         * @type {cc.math.Point}
         */
        p0 : Point;

        /**
         * First Curve control point.
         * @member cc.math.path.SegmentBezierInitializer#p1
         * @type {cc.math.Point}
         */
        p1 : Point;

        /**
         * Second Curve control point.
         * @member cc.math.path.SegmentBezierInitializer#p2
         * @type {cc.math.Point}
         */
        p2 : Point;

        /**
         * last curve point.
         * @member cc.math.path.SegmentBezierInitializer#p2
         * @type {cc.math.Point}
         */
        p3 : Point;
    }

    /**
     * @class cc.math.path.SegmentBezier
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This Object is a Cubic Bezier Segment.
     * <p>
     *     It is composed of two points and a two tension control points. Internally, the Segment can cache its contour.
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
    export class SegmentBezier implements Segment {

        /**
         * Start Cubic curve point.
         * @member cc.math.path.SegmentBezier#_p0
         * @type {cc.math.Vector}
         * @private
         */
        _p0 : Vector = null;

        /**
         * First Cubic curve control point.
         * @member cc.math.path.SegmentBezier#_cp0
         * @type {cc.math.Vector}
         * @private
         */
        _cp0: Vector = null;

        /**
         * Second Cubic curve control point.
         * @member cc.math.path.SegmentBezier#_cp1
         * @type {cc.math.Vector}
         * @private
         */
        _cp1: Vector = null;

        /**
         * End Cubic curve point.
         * @member cc.math.path.SegmentBezier#_p1
         * @type {cc.math.Vector}
         * @private
         */
        _p1 : Vector = null;

        /**
         * Internal flag for cache validity.
         * @member cc.math.path.SegmentBezier#_dirty
         * @type {boolean}
         * @private
         */
        _dirty : boolean = true;

        /**
         * Parent segment.
         * @member cc.math.path.SegmentBezier#_parent
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent : ContainerSegment = null;

        /**
         * Segment length. It is approximately calculated by subdividing the curve.
         * @member cc.math.path.SegmentBezier#_length
         * @type {number}
         * @private
         */
        _length : number = 0;

        /**
         * Create a new Cubic Segment instance.
         * @param data {cc.math.path.SegmentBezierInitializer=}
         */
        constructor( data? : SegmentBezierInitializer ) {
            if ( data ) {
                this.initialize( data.p0, data.p1, data.p2, data.p3 );
            }
        }

        /**
         * Initialize the Segment with the supplied points.
         * @param p0 {cc.math.Point} start curve point.
         * @param p1 {cc.math.Point} first curve control point.
         * @param p2 {cc.math.Point} second curve control point.
         * @param p3 {cc.math.Point} end curve point}
         */
        initialize( p0:Point, p1:Point, p2:Point, p3:Point ) : void {

            this._p0= new Vector( p0.x, p0.y );
            this._cp0= new Vector( p1.x, p1.y );
            this._cp1= new Vector( p2.x, p2.y );
            this._p1= new Vector( p3.x, p3.y );

            this._dirty= false;
            this.__calculateLength();
        }

        __calculateLength() : void {
            var points:Vector[]= this.trace( null, cc.math.path.DEFAULT_TRACE_LENGTH );
            // calculate distance
            this._length=0;
            for( var i=0; i<points.length-1; i++ ) {
                this._length+= points[i].distance( points[i+1] );
            }

            this._dirty= false;
        }

        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentBezier#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent() : ContainerSegment {
            return this._parent;
        }

        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentBezier#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent( s : ContainerSegment ) : void {
            this._parent= s;
        }

        /**
         * Get the Segment length.
         * @override
         * @method cc.math.path.SegmentBezier#getLength
         * @returns {number}
         */
        getLength() : number {
            if ( this._dirty ) {
                this.__calculateLength();
            }
            return this._length;
        }

        /**
         * Sample some points on the segment. It will return either the sampled contour, or the flattened version of it.
         * It returns the points that conform the Segment contour, if they are changed, the contour will be changed as well.
         * @method cc.math.path.SegmentBezier#trace
         * @param numPoints {number=} number of points traced on the segment.
         * @param dstArray {Array<cc.math.Vector>=} array where to add the traced points.
         * @returns {Array<Vector>} returns the supplied array of points, or a new array of points if not set.
         */
        trace( dstArray? : Array<Vector>, numPoints? : number ) : Vector[] {

            dstArray= dstArray || [];

            cc.math.path.traceBezier( this._p0, this._cp0, this._cp1, this._p1, dstArray );

            return dstArray;
        }

        /**
         * Get a point on the Segment at the given proportional position.
         * + If the segment is flattened, the value will be calculated from the internally cached curve contour.
         * + If not, if will be calculated by solving the curve.
         * The first is faster, but could be inaccurate for curves with a los number of flattened cached points.
         * For this kind of segment, the first method is way faster.
         * @param normalizedPos {number} value in the range 0..1
         * @param out {cc.math.Vector=} optional out point. if not set, an internal spare point will be used.
         * @returns {cc.math.Vector} a point on the segment at the given position. This point should be copied,
         * successive calls to getValue will return the same point instance.
         */
        getValueAt( normalizedPos : number, out? : Vector ) : Vector {

            // no out point, use a spare internal one. WARNING, will be continuously reused.
            out = out || new cc.math.Vector();

            // fix normalization values, just in case.
            if ( normalizedPos>1 || normalizedPos<-1 ) {
                normalizedPos %= 1;
            }
            if ( normalizedPos<0 ) {
                normalizedPos+=1;
            }


            if ( normalizedPos===1 ) {
                out.set( this._p1.x, this._p1.y );
            } else if ( normalizedPos===0 ) {
                out.set( this._p0.x, this._p0.y );
            } else {

                var t = normalizedPos;
                var t2 = t * t;
                var t3 = t * t2;

                // solve cubic bezier for nomalized time.
                out.x = SegmentBezier.solve( this._p0.x, this._cp0.x, this._cp1.x, this._p1.x, t, t2, t3 );
                out.y = SegmentBezier.solve( this._p0.y, this._cp0.y, this._cp1.y, this._p1.y, t, t2, t3 );
            }

            return out;
        }

        /**
         * Solve a Bezier for the given t.
         * @method cc.math.path.SegmentBezier.solve
         * @param v0 {number} point 0
         * @param vc0 {number} control point 0
         * @param cv1 {number} control point 1
         * @param v1 {number} point 1
         * @param t {number} normalized 0..1 value.
         * @param t2 {number} square normalized 0..1 value.
         * @param t3 {number} cubic normalized 0..1 value.
         * @returns {number}
         */
        static solve(v0:number, vc0:number, cv1:number, v1:number, t:number, t2:number, t3:number):number {
            return (v0 + t * (-v0 * 3 + t * (3 * v0 - v0 * t))) +
                    t * (3 * vc0 + t * (-6 * vc0 + vc0 * 3 * t)) +
                    t2 * (cv1 * 3 - cv1 * 3 * t) +
                    t3 * v1;
        }

        /**
         * Get the Segment's starting point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getStartingPoint() : Vector {
            return this._p0;
        }

        /**
         * Get the Segment's ending point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getEndingPoint() : Vector {
            return this._p1;
        }

        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentBezier#clone
         * @returns {cc.math.path.Segment}
         */
        clone() : SegmentBezier {
            var segment= new SegmentBezier({
                p0 : {
                    x: this._p0.x,
                    y: this._p0.y
                },
                p1 : {
                    x: this._cp0.x,
                    y: this._cp0.y
                },
                p2 : {
                    x: this._cp1.x,
                    y: this._cp1.y
                },
                p3 : {
                    x: this._p1.x,
                    y: this._p1.y
                }
            });

            segment._length= this._length;

            return segment;
        }

        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.SegmentBezier#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints( arr? : Array<Point> ) : Array<Point> {
            arr= arr || [];

            arr.push( this._p0 );
            arr.push( this._cp0 );
            arr.push( this._cp1 );
            arr.push( this._p1 );

            return arr;
        }

        /**
         * Mark the bezier as dirty. Mark internal polilyne info as invalid.
         * @methodcc.math.path.SegmentBezier#setDirty
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
            ctx.bezierCurveTo( this._cp0.x, this._cp0.y, this._cp1.x, this._cp1.y, this._p1.x, this._p1.y );
        }

    }
}