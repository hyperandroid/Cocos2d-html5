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
    export interface SegmentCardinalSplineInitializer {


        /**
         * First curve point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p0
         * @type {cc.math.Point}
         */
        p0 : Point;

        /**
         * First Curve control point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p1
         * @type {cc.math.Point}
         */
        cp0 : Point;

        /**
         * Second Curve control point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p2
         * @type {cc.math.Point}
         */
        cp1 : Point;

        /**
         * last curve point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p2
         * @type {cc.math.Point}
         */
        p1 : Point;

        /**
         * curve tension.
         * @member cc.math.path.SegmentCardinalSplineInitializer#tension
         */
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
         * Whether the Quadratic is internally treated as a polyline.
         * @member cc.math.path.SegmentCardinalSpline#_flattened
         * @type {boolean}
         * @private
         */
        _flattened:boolean = false;

        /**
         * A cache of points on the curve. This is approximation with which the length is calculated.
         * @member cc.math.path.SegmentCardinalSpline#_cachedContourPoints
         * @type {Array<cc.math.Vector>}
         * @private
         */
        _cachedContourPoints:Vector[] = null;

        /**
         * Create a new Quadratic Segment instance.
         * @param data {cc.math.path.SegmentCardinalSplineInitializer=}
         */
        constructor(data?:SegmentCardinalSplineInitializer) {
            if (data) {
                this.initialize(data.p0,data.cp0,data.cp1,data.p1, data.tension);
            }
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

            this.__update();
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
                this.setDirty();
            }
        }

        /**
         * Flatten this Segment and consider it a polyline with equidistant points.
         * @param numPoints {number=} Number of points (meaning numPoints-1 line segments). If not set, the number of
         *        points will be a default value. (you are good by not supplying a value).
         * @returns {cc.math.path.SegmentCardinalSpline}
         */
        flatten(numPoints?:number):SegmentCardinalSpline {

            // already flattened and with the same amount of points ? do nothing dude.
            if (!this._dirty && this._flattened && numPoints === this._cachedContourPoints.length) {
                return;
            }

            numPoints = numPoints || cc.math.path.DEFAULT_TRACE_LENGTH;

            // trace this quadratic segment
            var points:Vector[] = this.__trace(null, numPoints);

            // build a polyline of the specified number of points, or as much as twice the traced contour.
            // twice, since after all, we are approximating a curve to lines. and this is just preprocess, won't hurt
            // the long term.
            numPoints = numPoints || points.length * 2;

            // now path is a polyline which is not proportionally sampled.
            var path:Path = cc.math.Path.createFromPoints(points);

            // sample the path and get another polyline with each point at a regular distance.
            points = [];
            path.trace(numPoints, points);

            // signal flattened data
            this._flattened = true;

            // save data for later usage
            this._cachedContourPoints = points;

            // update segment length
            this.__calculateLength();

            // not dirty, caches and length are freshly calculated
            this._dirty = false;

            return this;
        }

        __trace( points:Vector[], numPoints:number ) : Vector[] {
            points= points || [];
            for (var i = 0; i <= numPoints; i++) {
                points.push(this.getValueAt(i / numPoints, new Vector()));
            }

            return points;
        }

        /**
         * Update the Quadratic Segment info.
         * @param numPoints {number=}
         * @private
         */
        __update(numPoints?:number):void {

            this._dirty = false;

            numPoints = numPoints || (this._cachedContourPoints && this._cachedContourPoints.length) || cc.math.path.DEFAULT_TRACE_LENGTH;

            // and was flattened
            if (this._flattened) {
                // recalculate polyline of equally distributed points
                this.flatten();
            } else {
                // was not flattened
                this._cachedContourPoints = [];
                this.__trace( this._cachedContourPoints, numPoints );
            }


            this.__calculateLength();
        }

        __calculateLength():void {
            var points = this._cachedContourPoints;
            // calculate distance
            this._length = 0;
            for (var i = 0; i < points.length - 1; i++) {
                this._length += points[i].distance(points[i + 1]);
            }

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
            if (this._dirty) {
                this.__update();
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
        trace(numPoints?:number, dstArray?:Array<Vector>):Vector[] {

            if (this._dirty && this._flattened) {
                this.__update(numPoints);
            }

            dstArray = dstArray || [];

            // copy flattened polyline to dst array.
            if (this._cachedContourPoints !== dstArray) {
                for (var i = 0; i < this._cachedContourPoints.length; i++) {
                    dstArray.push(this._cachedContourPoints[i]);
                }
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

            // if dirty, update curve info
            if (this._dirty) {
                this.__update();
            }

            // no out point, use a spare internal one. WARNING, will be continuously reused.
            out = out || __v0;

            // fix normalization values, just in case.
            if (normalizedPos > 1 || normalizedPos < -1) {
                normalizedPos %= 1;
            }
            if (normalizedPos < 0) {
                normalizedPos += 1;
            }

            if (this._flattened) {

                var fp = this._cachedContourPoints;
                var segment = ( normalizedPos * fp.length - 1 );
                normalizedPos = (segment - (segment | 0)) / (1 / (fp.length - 1));
                segment |= 0;

                out.x = fp[segment].x + (fp[segment + 1].x - fp[segment].x) * normalizedPos;
                out.y = fp[segment].y + (fp[segment + 1].y - fp[segment].y) * normalizedPos;

            } else {

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

                    var s = (1 - this._tension) / 2;

                    var b1 = s * ((-t3 + (2 * t2)) - t);                      // s(-t3 + 2 t2 - t)P1
                    var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);          // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
                    var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2);      // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
                    var b4 = s * (t3 - t2);                                   // s(t3 - t2)P4

                    out.x = this._p0.x * b1 + this._cp0.x * b2 + this._cp1.x * b3 + this._p1.x * b4;
                    out.y = this._p0.y * b1 + this._cp0.y * b2 + this._cp1.y * b3 + this._p1.y * b4;

                }
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
                p0 : this._p0,
                cp0: this._cp0,
                cp1: this._cp1,
                p1 : this._p1,
                tension: this._tension
            });

            if (this._flattened) {
                segment.flatten(this._cachedContourPoints.length);
            }

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
        setDirty() {
            this._dirty= true;
            var p : ContainerSegment= this._parent;
            while(p) {
                p.setDirty();
                p=p._parent;
            }
        }

        paint( ctx:cc.render.RenderingContext ) {

            ctx.beginPath();
            ctx.moveTo(this._cachedContourPoints[0].x, this._cachedContourPoints[0].y );
            for( var i=1 ; i<this._cachedContourPoints.length; i++ ) {
                ctx.lineTo( this._cachedContourPoints[i].x, this._cachedContourPoints[i].y );
            }
            ctx.stroke();
        }

    }
}