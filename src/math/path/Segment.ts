/**
 * Created by ibon on 11/20/14.
 */

/// <reference path="../Point.ts"/>
/// <reference path="../Matrix3.ts"/>
/// <reference path="../../render/RenderingContext.ts"/>
/// <reference path="../../util/Debug.ts"/>
/// <reference path="../../locale/Locale.ts"/>
/// <reference path="./ContainerSegment.ts"/>

module cc.math.path {

    import Vector= cc.math.Vector;
    import Matrix3= cc.math.Matrix3;

    export var DEFAULT_TRACE_LENGTH : number = 50;

    var __v0 = new Vector();
    var __v1 = new Vector();

    /**
     * Calculate a vector based on a distance and a matrix.
     * @param distance
     * @param matrix
     * @returns {Vector}
     */
    export function getDistanceVector( distance:number, matrix:Float32Array ) : Vector {
        __v0.set(0,0);
        __v1.set(distance,0);
        if ( matrix ) {
            Matrix3.transformPoint(matrix,__v0);
            Matrix3.transformPoint(matrix,__v1);
        }

        return __v1.sub(__v0);
    }

    import Point = cc.math.Point;
    import RenderingContext = cc.render.RenderingContext;

    /**
     * @class cc.math.path.Segment
     * @interface
     * @classdesc
     *
     * Base interface for every path Segment.
     * <br>
     *
     * Segments can be of any type. Simple segments like SegmentLine or SegmentBezier, or compound segments like Path @see {cc.math.Path}.
     *
     * <br>
     * A Segment instance is defined by the following basic capabilities:
     *
     *  + it has a length.
     *  + can be sampled, and a collections of points on the Segment will be returned.
     *  + can get a Point on the Segment represented by a normalized value. The method <code>getValueAt</code> does
     *    all the magic. This happens for any kind of segment, even complex Paths built of SubPaths.
     *  + can identify its starting point.
     *  + can identify its ending point.
     *  + can be cloned. A Segment of any type will create a fresh copy of itself.
     *
     */
    export interface Segment {

        _length : number;

        /**
         * Get the segment parent Segment.
         * @returns {cc.math.path.Segment}
         */
        getParent() : cc.math.path.ContainerSegment;

        /**
         * Set the segment parent Segment.
         */
        setParent( s:cc.math.path.ContainerSegment ) : void;

        /**
         * Get the segment's length. The length is a relative value obtained from adding a sample trace over the
         * segment equation.
         * @method cc.math.path.Segment#getLength
         * @returns {number} Segment's length
         */
        getLength() : number;

        /**
         * Trace the segment and get a collection of points on it.
         * @method cc.math.path.Segment#trace
         * @param numPoints {number=} number of points to sample on the segment. If not set, 30 points will be sampled.
         * @param dstArray {Array<Vector>=} destination array of points. if not set, a new array will be created.
         * @returns {Array<cc.math.Vector>} an array of points on the segment.
         */
        trace( dstArray? : Array<Vector>, numPoints? : number ) : Vector[];

        /**
         * Get a point on the segment. Assuming the Segment will be of size 1, being 0 the origin segment point, and
         * 1 the final segment point, the normalizedPos parameter represents a point on this segment proportional to its
         * value.
         * <br>
         * For segments like beziers, the returned point will be result of solving the curve for the parameter, and not
         * necessarily the point at the proportional curve length position.
         * @method cc.math.path.Segment#getValueAt
         * @param normalizedPos {number} a value in the range 0..1
         * @param out {cc.math.Vector=} an optional point to set the result in.
         * @returns {cc.math.Vector} a point in the path.
         */
        getValueAt( normalizedPos : number, out? : Vector ) : Vector;

        /**
         * Get the first point in the Segment.
         *  + For a SubPath will be its first Segment's starting point.
         *  + For a Path will be its first SubPath's starting point.
         * @method cc.math.path.Segment#getStartingPoint
         * @returns {cc.math.Vector}
         */
        getStartingPoint() : Vector;

        /**
         * Get the last point in the Segment.
         *  + For a SubPath will be its last Segment's end point.
         *  + For a Path will be its last SubPath's end point.
         * @method cc.math.path.Segment#getStartingPoint
         * @returns {cc.math.Vector}
         */
        getEndingPoint() : Vector;

        /**
         * Build a copy of this segment, either a complete path or a line.
         * @method cc.math.path.Segment#clone
         * @returns {cc.math.path.Segment} a copy of the segment.
         */
        clone() : Segment;

        /**
         * Add the Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.Segment#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints( arr? : Array<Point> ) : Array<Point>;

        /**
         * Mark a Segment and all its SubSegments are dirty whatever it means.
         * @methodcc.math.path.Segment#setDirty
         */
        setDirty( d:boolean );

        canvasStroke( ctx:RenderingContext );
        canvasFill( ctx:RenderingContext );
    }

}