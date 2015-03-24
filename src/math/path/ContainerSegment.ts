/**
 * Created by ibon on 11/22/14.
 */

/// <reference path="./Segment.ts"/>
/// <reference path="../../render/RenderingContext.ts"/>

module cc.math.path {
    
    import Segment = cc.math.path.Segment;

    var __v0 : Vector = new Vector();

    /**
     * @class cc.math.path.ContainerSegment
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This object is the base for all Container segments. Container Segments are Path and SubPath, that is, Segments
     * that are build of a collection of Segment objects.
     *
     */
    export class ContainerSegment implements Segment {

        /**
         * Parent Segment. An instance of <code>ContainerSegment</code>
         * @member cc.math.path.SegmentLine
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent : ContainerSegment = null;

        /**
         * The path length
         * @member cc.math.path.ContainerSegment#_length
         * @type {number}
         * @private
         */
        _length:number = 0;

        /**
         * The path segments. Any of the segments can be another path.
         * @member cc.math.path.ContainerSegment#_segments
         * @type {Array<cc.math.path.ContainerSegment.Segment>}
         * @private
         */
        _segments:Segment[] = [];
        
        /**
         * Mark this ContainerSegment as dirty.
         * Dirty means length must be recalculated.
         * @member cc.math.path.ContainerSegment#_dirty
         * @type {boolean}
         * @private
         */
        _dirty : boolean = true;

        constructor() {
        }

        /**
         * Get ContainerSegment's all segments lengths.
         * @returns {number}
         */
        getLength():number {
            if ( this._dirty ) {
                this.__calculateLength();
            }
            return this._length;
        }

        __calculateLength() : number {

            var length : number= 0;

            for( var i=0; i<this._segments.length; i++ ) {
                length+= this._segments[i].getLength();
            }

            this._dirty= false;
            this._length= length;
            return this._length;
        }

        /**
         * Get a Point on the ContainerSegment at a position proportional to normalizedPos.
         * If there's no Point in the path for the normalized position, the result of calling
         * <code>getStartingPoint</code> or <code>getEndingPoint</code> is returned.
         * This is consistent since a value for normalizedPos of 1 means end
         * of the path and a value of 0 the start of it.
         * @param normalizedPos {number} Normalized value between 0..1
         * @param out {cc.math.Vector=} out point. if not set, an internal spare point value will be used.
         * @returns {cc.math.Vector}
         */
        getValueAt(normalizedPos:number, out? : Vector ): Vector {

            if (this._dirty) {
                this.__calculateLength();
                this._dirty= false;
            }

            out= out || new cc.math.Vector();

            // BUGBUG change for binary search

            var pos = normalizedPos * this._length;
            var search = 0;


                for (var i = 0; i < this._segments.length; i++) {
                    if (pos >= search && pos < search + this._segments[i].getLength()) {
                        search = pos - search;
                        search /= this._segments[i].getLength();

                        return this._segments[i].getValueAt( search, out);
                    } else {
                        search += this._segments[i].getLength();
                    }
                }


            var ep= this.getEndingPoint();
            return out.set( ep.x, ep.y );
            //cc.Debug.error( locale.ERR_PATH_GETVALUEAT_HAS_NO_VALUE );
        }

        /**
         * Get sample points on the ContainerSegment.
         * @param numPoints {number=} number of points to sample. If not set, ContainerSegment.DEFAULT_TRACE will be used.
         * @param dstArray {Array<cc.math.Vector>=}
         * @returns {Array<cc.math.Vector>} the supplied array or a newly created one with the traced points .
         */
        trace(dstArray?:Array<Vector>, numPoints?:number):Vector[] {

            dstArray= dstArray || [];

            numPoints = numPoints || cc.math.path.DEFAULT_TRACE_LENGTH;


            this.getLength();
            dstArray.push( this.getStartingPoint() );
            for( var i=0; i<this._segments.length; i++) {
                this._segments[i].trace( dstArray, numPoints );
            }

            return dstArray;
        }

        /**
         * @see {cc.math.path.Segment#getStartingPoint}
         * @returns {cc.math.Vector}
         */
        getStartingPoint() : Vector {
            return null;
        }

        /**
         * @see {cc.math.path.Segment#getEndingPoint}
         * @returns {cc.math.Vector}
         */
        getEndingPoint() : Vector {
            return null;
        }

        /**
         * Get the Segment's parent Segment.
         * @returns {cc.math.path.Segment}
         */
        getParent() : ContainerSegment {
            return this._parent;
        }

        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.ContainerSegment#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent( s : ContainerSegment ) : void {
            this._parent= s;
        }

        /**
         * Make a clone of the segment. It will clone all contained segments.
         * ContainerSegments are not allowed to exist by themselves except in the form of Path or SubPath, so cloning
         * one of them will throw an error.
         * @method cc.math.path.ContainerSegment#clone
         * @returns {cc.math.path.Segment}
         */
        clone() : ContainerSegment {
            throw "ContainerSegments can't clone.";
        }

        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.ContainerSegment#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints( arr? : Array<Point> ) : Array<Point> {
            arr= arr || [];

            for( var i=0; i<this._segments.length; i++) {
                this._segments[i].getControlPoints( <Array<Point>>arr );
            }

            return arr;
        }

        /**
         * Mark a Segment and all its SubSegments are dirty whatever that means.
         * @methodcc.math.path.ContainerSegment#setDirty
         */

        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(b:boolean) {
            this._dirty= b;
            var p : ContainerSegment= <ContainerSegment>this._parent;
            while(p) {
                p.setDirty(b);
                p=p._parent;
            }
        }

        paint( ctx:cc.render.RenderingContext ) {
        }
    }
}