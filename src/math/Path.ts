/**
 * License: see license.txt file.
 */

/// <reference path="./path/Segment.ts"/>
/// <reference path="./path/ContainerSegment.ts"/>
/// <reference path="./path/SubPath.ts"/>
/// <reference path="./Point.ts"/>
/// <reference path="./Matrix3.ts"/>
/// <reference path="../util/Debug.ts"/>

module cc.math {

    import Segment = cc.math.path.Segment;
    import SubPath = cc.math.path.SubPath;
    import ContainerSegment = cc.math.path.ContainerSegment;
    import Vector = cc.math.Vector;
    import Matrix3 = cc.math.Matrix3;

    var __v0 : Vector = new Vector();
    var __v1 : Vector = new Vector();
    var __v2 : Vector = new Vector();
    var __v3 : Vector = new Vector();

    var __m0 : Float32Array = new Float32Array([1.0,0,0, 0,1.0,0, 0,0,1.0]);
    var __m1 : Float32Array = new Float32Array([1.0,0,0, 0,1.0,0, 0,0,1.0]);

    /**
     * 
     * @class cc.math.Path
     * @extends cc.math.path.ContainerSegment
     * @classdesc
     *
     * This class represents a Path Object.
     * By definition a Path is a collection of Segment objects. These segments are SubPath objects or other Paths.
     * Polimorphically a Path is a Segment itself, so complete paths can be added to another SubPath or Path as a Segment.
     *
     * A path has tracing capabilities. It differentiates from a SubPath in a few aspects:
     *  + a Path may have a cache of the stroke it represents.
     *  + a Path may have a cache of the fill it represents.
     *  + when tracing a Path, the Segments added are transformed by a transformation matrix.
     *  + a path represents an aggregation of Subpaths (contours)
     */
    export class Path extends ContainerSegment {

        /**
         * Path current sub path to add segments to. Initially, the current sub-path is the path itself.
         * As new sub-paths are created, _currentSubPath will point to that last sub-path.
         * @member cc.math.Path#_currentSubPath
         * @type {null}
         * @private
         */
        _currentSubPath : SubPath = null;

        /**
         * Build a new Path instance.
         * @method cc.math.Path#constructor
         */
        constructor() {
            super();
        }

        /**
         * Get the Path's number of SubPaths.
         * @returns {number}
         */
        numSubPaths() : number {
            return this._segments.length;
        }

        __newSubPath() : void {
            var subpath : SubPath = new SubPath();
            this._segments.push( subpath );
            subpath._parent= this;
            this._currentSubPath = subpath;
        }

        /**
         * Test whether this Path is empty, ie has no sub paths.
         * @returns {boolean}
         */
        isEmpty() : boolean {
            return this._segments.length===0;
        }

        /**
         *
         * Make sure the path has a valid sub-path to trace segments on.
         *
         * If the Path has no current sub-path,
         *   a new sub-path is created and its tracer initialized to 0,0.
         * else
         *   if the current sub-path is closed
         *     a new sub-path is created and its tracer initialized to the current sub-path tracer position
         *   endif
         * endif
         *
         * @param x {number=}
         * @param y {number=}
         * @private
         */
        __ensureSubPath( x:number= 0, y:number= 0 ) : void {
            
            if ( this.isEmpty() ) {
                this.__newSubPath();
                this._currentSubPath.moveTo( x,y );
            }

        }

        __chainSubPathIfCurrentIsClosed() : void {

            if ( this._currentSubPath.isClosed() ) {
                var pt= this._currentSubPath._currentPoint;
                this.__newSubPath();
                this._currentSubPath.moveTo( pt.x, pt.y );
            }

        }

        /**
         * Get the Path current position for tracing.
         * This point corresponds to the tracing position of the current SubPath.
         * @returns {cc.math.Point}
         */
        getCurrentTracePosition() : Point {
            if ( this._currentSubPath===null ) {
                cc.Debug.warn( locale.WARN_TRACER_EMPTY, "getCurrentTracePosition" );
                return { x:0, y:0 }
            }

            return this._currentSubPath._currentPoint;
        }

        /**
         * Get the Path starting point.
         * It corresponds to the starting point of the first segment it contains, regardless of its type.
         * If there's no current SubPath, an empty Point (0,0) is returned.
         * @returns {*}
         */
        getStartingPoint() : Vector {
            if ( this._currentSubPath===null ) {
                cc.Debug.warn( locale.WARN_TRACER_EMPTY, "getStartingPoint" );
                return __v0.set(0,0);
            }

            return this._currentSubPath.getStartingPoint();
        }

        /**
         * Get the Path ending point.
         * It corresponds to the ending point of the last segment it contains, regardless of its type.
         * If there's no current SubPath, an empty Point (0,0) is returned.
         * @returns {*}
         */
        getEndingPoint() : Vector {

            if ( this._currentSubPath===null ) {
                cc.Debug.warn( locale.WARN_TRACER_EMPTY, "getEndingPoint" );
                return __v0.set(0,0);
            }

            return this._segments[ this._segments.length-1 ].getEndingPoint();
        }

        /**
         * Create a poli-line path from a set of Points.
         * If no points, or an empty array is passed, no Path is built and returns null.
         * @param points {Array<cc.math.Vector>}
         * @returns {cc.math.Path} Newly created path or null if the path can't be created.
         * @static
         */
        static createFromPoints( points : Vector[] ) : Path {

            if ( !points || points.length===0 ) {
                return null;
            }

            var closedPath= points[0].equals( points[points.length-1] );

            var path : Path= new Path();
            path.beginPath();
            path.moveTo( points[0].x, points[0].y );

            for( var i=1; i< (closedPath ? points.length-1 : points.length) ; i++ ) {
                path.lineTo( points[i].x, points[i].y );
            }

            if ( closedPath ) {
                path.closePath();
            }

            return path;
        }

        /**
         * Clear all sub-path data, and revert to the original path object status.
         * Make sure this path is not another's path segment.
         *
         * @method cc.math.Path#beginPath
         */
        beginPath() : Path {
            this._segments= [];
            this._length= 0;
            this._currentSubPath= null;
            this._dirty= true;

            return this;
        }

        quadraticTo( x1:number, y1:number, x2:number, y2:number, matrix?:Float32Array ) : Path {

            __v0.set(x1,y1);
            __v1.set(x2,y2);
            if ( matrix ) {
                Matrix3.transformPoint(matrix,__v0);
                Matrix3.transformPoint(matrix,__v1);
            }

            this.__ensureSubPath();
            this._currentSubPath.quadraticTo( __v0.x, __v0.y, __v1.x, __v1.y );

            return this;
        }

        bezierTo( x0:number, y0:number, x1:number, y1:number, x2:number, y2:number, matrix?:Float32Array ) : Path {

            __v0.set(x0,y0);
            __v1.set(x1,y1);
            __v2.set(x2,y2);
            if ( matrix ) {
                Matrix3.transformPoint(matrix,__v0);
                Matrix3.transformPoint(matrix,__v1);
                Matrix3.transformPoint(matrix,__v2);
            }

            this.__ensureSubPath();
            this._currentSubPath.bezierTo( __v0.x, __v0.y, __v1.x, __v1.y, __v2.x, __v2.y );

            return this;
        }

        catmullRomTo( points:Point[], closed:boolean, tension:number, matrix?:Float32Array ) : Path;
        catmullRomTo( cp0x:number,cp0y:number,cp1x:number,cp1y:number,p1x:number,p1y:number, tension:number, matrix?:Float32Array ): Path;

        catmullRomTo( p0:any, ...rest:Array<any> ): Path {

            if ( typeof p0==="number ") {
                // assume a catmullromTo segment call with 6 numbers and an optional matrix
                if ( arguments.length<6 ) {
                    // not enough arguments
                    return;
                }

                this.__catmullRomTo(
                    p0,rest[0],
                    rest[1],rest[2],
                    rest[3],rest[4],
                    tension,
                    arguments.length>6 ? <Float32Array>rest[5] : null);

            } else if ( Array.isArray(p0) ) {

                var points= <Vector[]>p0;
                var closed= <boolean>rest[0];
                var tension= <number>rest[1];
                var matrix= arguments.length>3 ? <Float32Array>rest[2] : null;

                // create a collection of catmullrom segments.

                // copy array.
                points= points.slice(0);

                if (closed) {
                    points.unshift(points[points.length-1]);
                    points.push(points[1]);
                    points.push(points[2]);
                } else {
                    points.unshift(points[0]);
                    points.push(points[points.length-1]);
                }

                this.moveTo( points[0].x, points[0].y, matrix );
                for( var i=1; i<points.length-2; i++ ) {
                    this.__catmullRomTo(
                        points[ i   ].x,points[ i   ].y,
                        points[ i+1 ].x,points[ i+1 ].y,
                        points[ i+2 ].x,points[ i+2 ].y,
                        tension,
                        matrix );
                }
            } else {
                console.log("invalid signature Path.catmullRomTo");
            }

            return this;
        }

        /**
         * Add a catmull rom (cardinal spline
         * @param cp0x {number}
         * @param cp0y {number}
         * @param cp1x {number}
         * @param cp1y {number}
         * @param p1x {number}
         * @param p1y {number}
         * @param matrix {Float32Array}
         */
        __catmullRomTo(cp0x:number, cp0y:number, cp1x:number, cp1y:number, p1x:number, p1y:number, tension:number, matrix?:Float32Array) {

            __v0.set(cp0x,cp0y);
            __v1.set(cp1x,cp1y);
            __v2.set(p1x,p1y);
            if ( matrix ) {
                Matrix3.transformPoint(matrix,__v0);
                Matrix3.transformPoint(matrix,__v1);
                Matrix3.transformPoint(matrix,__v2);
            }

            this.__ensureSubPath();
            this._currentSubPath.catmullRomTo(__v0.x, __v0.y, __v1.x, __v1.y, __v2.x, __v2.y, tension );
        }

        /**
         * Close the current SubPath.
         *
         * @returns {cc.math.Path}
         */
        closePath() : Path {
            this._currentSubPath.closePath();
            this._dirty= true;
            return this;
        }
        
        /**
         * Move the current path tracer to a position.
         * If the current sub-path is not started,
         *   set this point as the sub-path start point.
         * else
         *   if there are segments,
         *      create a new sub-path
         *   else
         *      set sub-path starting point to the new location
         * endif
         *
         * @method cc.math.Path#moveTo
         * @param x {number}
         * @param y {number}
         * @param matrix {cc.math.Float32Array=}
         */
        moveTo( x: number, y : number, matrix? : Float32Array ) : Path {


            if ( matrix ) {
                __v0.set(x,y);
                Matrix3.transformPoint( matrix, __v0 );
                x= __v0.x;
                y= __v0.y;
            }

            this.__ensureSubPath(x,y);
            this._currentSubPath.moveTo(x,y);

            return this;
        }

        /**
         * Add a line to the current path.
         * If there's no current SubPath, 
         * If the current path is not initialized, in will be initialized from 0,0 and a line added.
         *
         * @method cc.math.Path#lineTo
         * @param x {number}
         * @param y {number}
         * @param matrix {Float32Array=}
         */
        lineTo( x: number, y : number, matrix? : Float32Array ) : Path {

            if (matrix) {
                __v0.set(x, y);
                Matrix3.transformPoint(matrix,__v0);
                x = __v0.x;
                y = __v0.y;
            }

            this.__ensureSubPath(x,y);
            this.__chainSubPathIfCurrentIsClosed();

            this._currentSubPath.lineTo(x, y);

            this._dirty = true;

            return this;
        }

        /**
         * Create a rect as a new SubPath. The rect has 4 segments which conform the rect.
         * It also created a new SubPath movedTo (x,y).
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @param matrix {Float32Array=} transformation matrix.
         * @returns {cc.math.Path}
         */
        rect( x:number, y:number, w:number, h:number, matrix? : Float32Array ): Path {

            this.__ensureSubPath();

            // may reuse the current subpath ? (nosegments, and not empty)
            if ( this._currentSubPath.numSegments()!==0 ) {
                this.__newSubPath();
            }

            __v0.set( x,   y );
            __v1.set( x+w, y );
            __v2.set( x+w, y+h );
            __v3.set( x,   y+h );

            if ( matrix ) {
                Matrix3.transformPoint( matrix,__v0 );
                Matrix3.transformPoint( matrix,__v1 );
                Matrix3.transformPoint( matrix,__v2 );
                Matrix3.transformPoint( matrix,__v3 );
            }

            this.moveTo( __v0.x, __v0.y );
            this.lineTo( __v1.x, __v1.y );
            this.lineTo( __v2.x, __v2.y );
            this.lineTo( __v3.x, __v3.y );
            this.closePath();

            this.__newSubPath();
            this._currentSubPath.moveTo( __v0.x, __v0.y );
            this._dirty= true;

            return this;
        }

        /**
         * Create an arc segment and add it to the current SubPath.
         * If a SubPath exists, a straight line to (x,y) is added.
         * if the angle difference is > 2PI the angle will be clampled to 2PI. The angle difference will be
         * endAngle - startAngle if anticlockwise is false, and startAngle - endAngle otherwise.
         * In this implementation if the radius is < 0, the radius will be set to 0.
         * If the radius is 0 or the diffangle is 0, no arc is added.
         *
         * @param x {number}
         * @param y {number}
         * @param radius {number}
         * @param startAngle {number}
         * @param endAngle {number}
         * @param anticlockwise {boolean} arc draw direction
         * @param matrix {Float32Array}
         */
        arc( x:number, y:number, radius:number, startAngle:number, endAngle:number, anticlockwise:boolean, matrix?:Float32Array ) : Path {

            var addLine : boolean = false;

            // transform position (center) based on transformation
            __v0.set( x,y );
            if ( matrix ) {
                Matrix3.transformPoint( matrix, __v0 );
            }
            x= __v0.x;
            y= __v0.y;

            // ensure a valid subpath to add the segment to exists.
            this.__ensureSubPath(x,y);

            // flag add a straight line from the last trace point to the start of the arc (if apply)
            if ( this._currentSubPath.numSegments() ) {
                addLine= true;
            }

            // correct angles. always get the smallest angle on the arc.
            var diffAngle= (endAngle - startAngle);
            if (diffAngle>2*Math.PI) {
                diffAngle=2*Math.PI;
            } else if (diffAngle<-2*Math.PI) {
                    diffAngle=-2*Math.PI;
            }

            // if there's no difference between start and end angles, this will be a single point arc.
            if ( (-.0001<diffAngle && diffAngle<.0001) ) {
                // bugbug should i add a line if flag addLine says so ?
                return this;
            }

            this.__chainSubPathIfCurrentIsClosed();


            // calculate radius based on transformation. the new radius is a segment of radius size transformed
            // by the current matrix.
            radius= cc.math.path.getDistanceVector( radius, matrix ).length();

            // if radius < something visible, do nothing
            if ( radius<=0.1 ) {
                this.__ensureSubPath(x,y);
                return this;
            }

            // calculate start angle based on current matrix
            if ( matrix ) {

                Matrix3.copy( __m0, matrix );
                Matrix3.setRotate( __m1, startAngle );
                Matrix3.multiply(__m0, __m1);

                startAngle= cc.math.path.getDistanceVector(1,matrix).angle();
            }

            this._currentSubPath.arc( x,y,radius,startAngle,startAngle+diffAngle,anticlockwise,addLine );
            this._dirty= true;

            return this;
        }

        clone() : Path {
            var path= new Path();

            for( var i=0; i<this._segments.length; i++ ) {
                path._segments.push( this._segments[i].clone() );
            }

            path._currentSubPath = <SubPath>path._segments[ path._segments.length - 1 ];
            path._length= this._length;

            return path;
        }

        paint( ctx:cc.render.RenderingContext ) {
            for( var i=0; i<this._segments.length; i++ ) {
                this._segments[i].paint(ctx);
            }
        }

        getStrokeGeometry() : number[] {


            return [];
        }
    }
}