/**
 * License: see license.txt file.
 */

/// <reference path="./path/Segment.ts"/>
/// <reference path="./path/ContainerSegment.ts"/>
/// <reference path="./path/SubPath.ts"/>
/// <reference path="./Point.ts"/>
/// <reference path="./Matrix3.ts"/>
/// <reference path="./path/geometry/EarCut.ts"/>
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

    export module path {
        export function ParseSegment(initializer:cc.math.path.SegmentInitializer):cc.math.path.Segment {

            var segment = null;

            if (initializer.type) {

                if (cc.math.path[initializer.type]) {
                    segment = new cc.math.path[initializer.type]();
                } else if (cc.math[initializer.type]) {
                    segment = new cc.math[initializer.type]();
                }

                if (segment) {
                    segment.__createFromInitializer(initializer);
                }
            }

            return segment;
        }
    }

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
         * Cached stroke geometry.
         * @member cc.math.Path#_strokeGeometry
         * @type {Float32Array}
         * @private
         */
        _strokeGeometry : Float32Array = null;

        /**
         * Cached fill geometry.
         * @member cc.math.Path#_fillGeometry
         * @type {Float32Array}
         * @private
         */
        _fillGeometry : Float32Array = null;


        /**
         * Flag for stroke geometry cache invalidation.
         * @member cc.math.Path#_strokeDirty
         * @type {boolean}
         * @private
         */
        _strokeDirty= true;

        /**
         * Flag for fill geometry cache invalidation.
         * @member cc.math.Path#_fillDirty
         * @type {boolean}
         * @private
         */
        _fillDirty= true;

        /**
         * Build a new Path instance.
         * @method cc.math.Path#constructor
         */
        constructor( initializer? : cc.math.path.ContainerSegmentInitializer ) {
            super();
            if ( initializer ) {
                this.__createFromInitializer( initializer );
            }
        }

        __createFromInitializer(initializer : cc.math.path.ContainerSegmentInitializer) {
            super.__createFromInitializer(initializer);
            if ( this._segments.length>0 ) {
                this._currentSubPath = <cc.math.path.SubPath>this._segments[ this._segments.length-1 ];
            }
        }

        /**
         * Get the Path's number of SubPaths.
         * @method cc.math.Path#numSubPaths
         * @returns {number}
         */
        numSubPaths() : number {
            return this._segments.length;
        }

        /**
         * Create a new sub path.
         * @method cc.math.Path#__newSubPath
         * @private
         */
        __newSubPath() : void {
            var subpath : SubPath = new SubPath();
            this._segments.push( subpath );
            subpath._parent= this;
            this._currentSubPath = subpath;
        }

        /**
         * Test whether this Path is empty, ie has no sub paths.
         * @method cc.math.Path#isEmpty
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
         *
         * @method cc.math.Path#__ensureSubPath
         * @private
         */
        __ensureSubPath( x:number= 0, y:number= 0 ) : void {
            
            if ( this.isEmpty() ) {
                this.__newSubPath();
                this._currentSubPath.moveTo( x,y );
            }

        }

        /**
         * Chain two contours (subpath) when one is closed. Necessary for closed arcs.
         * @method cc.math.Path#__chainSubPathIfCurrentIsClosed
         * @private
         */
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
         *
         * @method cc.math.Path#getCurrentTracePosition
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
         *
         * @method cc.math.Path#getStartingPoint
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
         *
         * @method cc.math.Path#getEndingPoint
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
         *
         * @method cc.math.Path.createFromPoints
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
            this.setDirty();

            return this;
        }

        /**
         * Add a quadratic curve to the path.
         * @param x1 {number} control point x position
         * @param y1 {number} control point y position
         * @param x2 {number} second curve point x position
         * @param y2 {number} second curve point y position
         * @param matrix {Float32Array}
         *
         * @method cc.math.Path#quadraticCurveTo
         * @returns {cc.math.Path} the path holding the segment
         */
        quadraticCurveTo( x1:number, y1:number, x2:number, y2:number, matrix?:Float32Array ) : Path {

            __v0.set(x1,y1);
            __v1.set(x2,y2);
            if ( matrix ) {
                Matrix3.transformPoint(matrix,__v0);
                Matrix3.transformPoint(matrix,__v1);
            }

            this.__ensureSubPath();
            this._currentSubPath.quadraticTo( __v0.x, __v0.y, __v1.x, __v1.y );

            this.setDirty();

            return this;
        }

        /**
         * Add a quadratic curve to the path.
         * @param x1 {number} control point x position
         * @param y1 {number} control point y position
         * @param x2 {number} second curve point x position
         * @param y2 {number} second curve point y position
         * @param matrix {Float32Array}
         *
         * @method cc.math.Path#bezierCurveTo
         * @returns {cc.math.Path} the path holding the segment
         */
        bezierCurveTo( x0:number, y0:number, x1:number, y1:number, x2:number, y2:number, matrix?:Float32Array ) : Path {

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

            this.setDirty();

            return this;
        }

        catmullRomTo( points:Point[], closed:boolean, tension:number, matrix?:Float32Array ) : Path;
        catmullRomTo( cp0x:number,cp0y:number,cp1x:number,cp1y:number,p1x:number,p1y:number, tension:number, matrix?:Float32Array ): Path;

        /**
         * Add CatmullRom segments.
         * The segments are defined by an array of numbers, being each two the definition of a Point, or an array of
         * <code>cc.math.Point</code> objects.
         *
         * This method will create in the as much CatmullRom segments as needed based on the number of parameters supplied.
         *
         * @method cc.math.Path#catmullRomTo
         * @param p0
         * @param rest
         * @returns {cc.math.Path}
         */
        catmullRomTo( p0:any, ...rest:Array<any> ): Path {

            if ( typeof p0==="number ") {
                // assume a catmullromTo segment call with 6 numbers and an optional matrix
                if ( arguments.length<6 ) {
                    // not enough arguments
                    return;
                }

                this.__catmullRomTo(
                    p0,             <number>rest[0],
                    <number>rest[1],<number>rest[2],
                    <number>rest[3],<number>rest[4],
                    <number>rest[5],
                    arguments.length>6 ? <Float32Array>rest[6] : null);

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

            this.setDirty();

            return this;
        }

        /**
         * Add a CatmullRom segment implementation.
         *
         * @method cc.math.Path#__catmullRomTo
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

            this.setDirty();
        }

        /**
         * Close the current SubPath.
         *
         * @method cc.math.Path#closePath
         * @returns {cc.math.Path}
         */
        closePath() : Path {
            this._currentSubPath.closePath();
            this.setDirty();
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
            if ( this._currentSubPath.numSegments()>0 ) {
                this.__newSubPath();
            }
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

            this.setDirty();

            return this;
        }

        /**
         * Create a rect as a new SubPath. The rect has 4 segments which conform the rect.
         * It also created a new SubPath movedTo (x,y).
         *
         * @method cc.math.Path#rect
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
            this.setDirty();

            return this;
        }

        arcTo( x1:number, y1:number, x2:number, y2:number, radius:number, matrix?:Float32Array ) {

            if ( matrix ) {
                __v0.set( x1,y1 );
                Matrix3.transformPoint( matrix, __v0 );
                x1= __v0.x;
                y1= __v0.y;

                __v0.set( x2,y2 );
                Matrix3.transformPoint( matrix, __v0 );
                x2= __v0.x;
                y2= __v0.y;

                radius= cc.math.path.getDistanceVector( radius, matrix ).length();
            }

            this.__ensureSubPath( x1, y1 );
            this._currentSubPath.arcTo( x1,y1,x2,y2,radius );
            this.setDirty();
        }

        /**
         * Create an arc segment and add it to the current SubPath.
         * If a SubPath exists, a straight line to (x,y) is added.
         * if the angle difference is > 2PI the angle will be clamped to 2PI. The angle difference will be
         * endAngle - startAngle if anticlockwise is false, and startAngle - endAngle otherwise.
         * In this implementation if the radius is < 0, the radius will be set to 0.
         * If the radius is 0 or the diffangle is 0, no arc is added.
         *
         * @method cc.math.Path#arc
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
            if ( matrix ) {
                __v0.set( x,y );
                Matrix3.transformPoint( matrix, __v0 );
                x= __v0.x;
                y= __v0.y;
            }

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

                Matrix3.copy( matrix, __m0 );
                Matrix3.setRotate( __m1, startAngle );
                Matrix3.multiply(__m0, __m1);

                startAngle= cc.math.path.getDistanceVector(1,__m0).angle();
            }

            this._currentSubPath.arc( x,y,radius,startAngle,startAngle+diffAngle,anticlockwise,addLine );
            this.setDirty();

            return this;
        }

        /**
         * Deep clone this path, contours and segments.
         * @method cc.math.Path#clone
         * @return {cc.math.Path} a cloned path.
         */
        clone() : Path {
            var path= new Path();

            for( var i=0; i<this._segments.length; i++ ) {
                path._segments.push( this._segments[i].clone() );
            }

            path._currentSubPath = <SubPath>path._segments[ path._segments.length - 1 ];
            path._length= this._length;

            return path;
        }

        /**
         * Mark the path as dirty. Also, the cache for stroke and fill are marked as dirty.
         * @method cc.math.Path#setDirty
         */
        setDirty() {
            this._dirty= true;
            this._fillDirty= true;
            this._strokeDirty= true;
        }

        /**
         * If needed, calculate the stroke geometry for a path.
         * The stroke mesh will be traced based of line attributes.
         * On average, you will never interact with this method.
         * @method cc.math.Path#getStrokeGeometry
         * @param attributes {cc.math.path.geometry.StrokeGeometryAttributes}
         * @returns {Float32Array}
         */
        getStrokeGeometry( attributes : cc.math.path.geometry.StrokeGeometryAttributes ) {

            if ( this._dirty || this._strokeDirty ) {

                var size : number = 0;
                var buffers : Float32Array[] = [];

                for( var i=0; i<this._segments.length; i++ ) {

                    var subPath = this._segments[i];
                    var contourPoints = subPath.trace();

                    var buffer:Float32Array = cc.math.path.geometry.getStrokeGeometry( subPath.trace(), attributes );

                    if ( null!==buffer ) {
                        size += buffer.length;
                        buffers.push(buffer);
                    }
                }

                this._strokeGeometry= new Float32Array( size );

                var offset= 0;
                for( var i=0; i<buffers.length; i++ ) {
                    this._strokeGeometry.set( buffers[i], offset );
                    offset+= buffers[i].length;
                }

                this._dirty = false;
                this._strokeDirty= false;
            }

            return this._strokeGeometry;
        }

        /**
         * If needed, tessellate the points of the path and create a mesh.
         * On average, you will never interact with this method.
         * @method cc.math.Path#getFillGeometry
         * @returns {Float32Array}
         */
        getFillGeometry( ) {

            if ( this._dirty || this._fillDirty ) {

                var size : number = 0;
                var buffers : Float32Array[] = [];

                for( var i=0; i<this._segments.length; i++ ) {

                    var subPath = this._segments[i];
                    //var contourPoints = subPath.trace();

                    var contour= subPath.trace();

                    var buffer:Float32Array = cc.math.path.geometry.tessellate( contour );


                    if ( null!==buffer ) {
                        size += buffer.length;
                        buffers.push(buffer);
                    }
                };

                this._fillGeometry= new Float32Array( size );

                var offset= 0;
                for( var i=0; i<buffers.length; i++ ) {
                    this._fillGeometry.set( buffers[i], offset );
                    offset+= buffers[i].length;
                }

                this._dirty = false;
                this._fillDirty= false;
            }

            return this._fillGeometry;
        }

        getInitializer() : cc.math.path.ContainerSegmentInitializer {
            return super.getInitializer( "Path" );
        }
    }
}