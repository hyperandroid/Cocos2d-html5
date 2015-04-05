/**
 *
 * License: see license.txt file.
 *
 * (c) 2014-2015 @hyperandroid
 *
 */

/// <reference path="../../Point.ts"/>
/// <reference path="../../../render/RenderingContext.ts"/>

module cc.math.path.geometry {

    var EPSILON= 0.0001;
    var signedAreaModifier= 1;

    export interface StrokeGeometryAttributes {
        width? : number;        // 1 if not defined
        cap? : cc.render.LineCap;          // butt, round, square
        join?: cc.render.LineJoin;          // bevel, round, miter
        miterLimit? : number   // for join miter, the maximum angle value to use the miter
    }

    /**
     * Get Stroke geometry for an array of Point objects.
     * The array could be the result of calling 'trace' for a Path object, or an arbitrary cloud of points.
     *
     *
     * @param points {Array.<cc.math.Vector>} contour of the points to trace.
     * @param attrs {cc.math.path.StrokeGeometryAttributes} this object defines stroke attributes like line cap,
     *      line join, line width and miter limit.
     *
     * @returns {Array<number> | Float32Array} Array with pairs of numbers (x,y)
     *
     * @method cc.math.path.geometry.getStrokeGeometry
     */
    export function getStrokeGeometry(points:cc.math.Point[], attrs:StrokeGeometryAttributes) : Float32Array {

        // trivial reject
        if (points.length < 2) {
            return new Float32Array([]);
        }

        var cap:cc.render.LineCap =     attrs.cap || cc.render.LineCap.BUTT;
        var join:cc.render.LineJoin=    attrs.join || cc.render.LineJoin.BEVEL;
        var lineWidth:number =          (attrs.width || 1) / 2;
        var miterLimit:number =         attrs.miterLimit || 10;
        var vertices:Array<number> =    [];
        var middlePoints:Point[] =      [];  // middle points per each line segment.
        var closed:boolean =            false;

        signedAreaModifier= cc.render.RENDER_ORIGIN===cc.render.ORIGIN_TOP ? 1 : -1;

        if (points.length === 2) {
            join = cc.render.LineJoin.BEVEL;
            createTriangles(points[0], cc.math.Vector.middlePoint(points[0], points[1]), points[1], vertices, lineWidth, join, miterLimit);

        } else {

            if (points[0] === points[points.length - 1] ||
                 (  points[0].x === points[points.length - 1].x &&
                    points[0].y === points[points.length - 1].y )   ) {

                var p0 = points.shift();
                p0 = cc.math.Vector.middlePoint(p0, points[0]);
                points.unshift(p0);
                points.push(p0);
                closed = true;
            }

            var i;
            for (i = 0; i < points.length - 1; i++) {
                if (i === 0) {
                    middlePoints.push(points[0]);
                } else if (i === points.length - 2) {
                    middlePoints.push(points[points.length - 1])
                } else {
                    middlePoints.push(cc.math.Vector.middlePoint(points[i], points[i + 1]));
                }
            }

            for (i = 1; i < middlePoints.length; i++) {
                createTriangles(middlePoints[i - 1], points[i], middlePoints[i], vertices, lineWidth, join, miterLimit);
            }
        }

        if ( !closed ) {

            if (cap === cc.render.LineCap.ROUND) {

                var p00 = new cc.math.Vector(vertices[0],vertices[1]);
                var p01 = new cc.math.Vector(vertices[2],vertices[3]);
                var p02 = points[1];
                var p10 = new cc.math.Vector( vertices[vertices.length - 2], vertices[vertices.length - 1] );
                var p11 = new cc.math.Vector( vertices[vertices.length - 6], vertices[vertices.length - 5] );
                var p12 = points[points.length - 2];

                createRoundCap(points[0], p00, p01, p02, vertices);
                createRoundCap(points[points.length - 1], p10, p11, p12, vertices);

            } else if (cap === cc.render.LineCap.SQUARE ) {

                var p00 = new cc.math.Vector( vertices[vertices.length - 2], vertices[vertices.length - 1]);
                var p01 = new cc.math.Vector( vertices[vertices.length - 6], vertices[vertices.length - 5]);

                createSquareCap(
                        new cc.math.Vector(vertices[0],vertices[1]),
                        new cc.math.Vector(vertices[2],vertices[3]),
                        cc.math.Vector.sub(points[0], points[1]).normalize().mult(
                            cc.math.Vector.sub(points[0], new cc.math.Vector(vertices[0],vertices[1])).length() ),
                        vertices);
                createSquareCap(
                        p00,
                        p01,
                        cc.math.Vector.sub(points[points.length - 1], points[points.length - 2]).normalize().mult(
                            cc.math.Vector.sub(p01, points[points.length - 1]).length()),
                        vertices);
            }
        }

        return new Float32Array(vertices);
    }

    function __pushVert( v:Array<number>, x:number, y:number ) {
        v.push(x);
        v.push(y);
    }

    function createSquareCap(p0:cc.math.Point, p1:cc.math.Point, dir:cc.math.Point, verts:Array<number>) {

        //p0
        __pushVert(verts, p0.x, p0.y);

        //Point.Add(p0, dir);
        __pushVert(verts, p0.x+dir.x, p0.y+dir.y);

        //Point.Add(p1, dir);
        __pushVert(verts, p1.x+dir.x, p1.y+dir.y);

        //p1;
        __pushVert( verts, p1.x, p1.y );

        //Point.Add(p1, dir);
        __pushVert(verts, p1.x+dir.x, p1.y+dir.y);

        //p0
        __pushVert(verts, p0.x, p0.y);
    }


    function createRoundCap(center:cc.math.Point, _p0:cc.math.Point, _p1:cc.math.Point, nextPointInLine:cc.math.Point, verts:Array<number>) {

        var radius = cc.math.Vector.sub(center, _p0).length();

        var angle0 = Math.atan2((_p1.y - center.y), (_p1.x - center.x));
        var angle1 = Math.atan2((_p0.y - center.y), (_p0.x - center.x));

        var orgAngle0= angle0;

        // make the round caps point in the right direction.

        // calculate minimum angle between two given angles.
        // for example: -Math.PI, Math.PI = 0, -Math.PI/2, Math.PI= Math.PI/2, etc.
        if ( angle1 > angle0) {
       		while ( angle1-angle0>=Math.PI-EPSILON) {
       			angle1=angle1-2*Math.PI;
       		}
       	}
       	else {
       		while ( angle0-angle1>=Math.PI-EPSILON) {
       			angle0=angle0-2*Math.PI;
       		}
       	}

        var angleDiff = angle1-angle0;

        // for angles equal Math.PI, make the round point in the right direction.
        if (Math.abs(angleDiff) >= Math.PI - EPSILON && Math.abs(angleDiff) <= Math.PI + EPSILON) {
            var r1:Vector = cc.math.Vector.sub(center, nextPointInLine);
            if ( r1.x===0 ) {
                if (r1.y>0) {
                    angleDiff= -angleDiff;
                }
            } else if ( r1.x>=-EPSILON ) {
                angleDiff= -angleDiff;
            }
        }

        // calculate points, and make the cap.
        var nsegments = (Math.abs(angleDiff * radius) / 7) >> 0;
        nsegments++;
        nsegments= Math.max( nsegments, 8 );

        var angleInc = angleDiff / nsegments;

        for (var i = 0; i < nsegments; i++) {
            __pushVert( verts, center.x, center.y );

            __pushVert(
                verts,
                center.x + radius * Math.cos(orgAngle0 + angleInc * i),
                center.y + radius * Math.sin(orgAngle0 + angleInc * i) );

            __pushVert(
                verts,
                center.x + radius * Math.cos(orgAngle0 + angleInc * (1 + i)),
                center.y + radius * Math.sin(orgAngle0 + angleInc * (1 + i)) );
        }
    }

    /**
     * Get the signed area of a triangle.
     *
     * @method cc.math.path.geometry.signedArea
     *
     * @param p0x {number}
     * @param p0y {number}
     * @param p1x {number}
     * @param p1y {number}
     * @param p2x {number}
     * @param p2y {number}
     * @returns {number}
     */
    export function signedArea(p0x:number, p0y:number, p1x:number, p1y:number, p2x:number, p2y:number ) : number {
        return (p1x - p0x) * (p2y - p0y) - (p2x - p0x) * (p1y - p0y);
    }

    function lineIntersection(p0:cc.math.Point, p1:cc.math.Point, p2:cc.math.Point, p3:cc.math.Point) {

        var a0 = p1.y - p0.y;
        var b0 = p0.x - p1.x;

        var a1 = p3.y - p2.y;
        var b1 = p2.x - p3.x;

        var det = a0 * b1 - a1 * b0;
        if (det > -EPSILON && det < EPSILON) {
            return null;
        } else {
            var c0 = a0 * p0.x + b0 * p0.y;
            var c1 = a1 * p2.x + b1 * p2.y;

            var x = (b1 * c0 - b0 * c1) / det;
            var y = (a0 * c1 - a1 * c0) / det;
            return new cc.math.Vector(x, y);
        }
    }


    function createTriangles(
        p0:cc.math.Point, p1:cc.math.Point, p2:cc.math.Point,
        verts:Array<number>,
        width:number,
        join:cc.render.LineJoin,
        miterLimit:number) {

        if ( cc.math.Vector.equals(p0,p1) ) {
            p1.x= p0.x + (p2.x-p0.x)/2;
            p1.y= p0.y + (p2.y-p0.y)/2;
        } else if ( cc.math.Vector.equals(p1,p2) ) {
            p2= new cc.math.Vector( p1.x, p1.y );
            p1.x= p0.x + (p2.x-p0.x)/2;
            p1.y= p0.y + (p2.y-p0.y)/2;
        }

        if ( cc.math.Vector.equals(p0,p1) && cc.math.Vector.equals(p1,p2) ) {
            return;
        }

        var t0:cc.math.Vector = cc.math.Vector.sub(p1, p0);
        var t2:cc.math.Vector = cc.math.Vector.sub(p2, p1);

        t0.perpendicular().normalize().mult(width);
        t2.perpendicular().normalize().mult(width);

        // triangle composed by the 3 points if clockwise or couterclockwise.
        // if counterclockwise, we must invert the line threshold points, otherwise the intersection point
        // could be erroneous and lead to odd results.
        if (signedArea(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y) > 0) {
            t0.invert();
            t2.invert();
        }

        var pintersect = lineIntersection(
            cc.math.Vector.add(p0, t0),
            cc.math.Vector.add(p1, t0),
            cc.math.Vector.add(p2, t2),
            cc.math.Vector.add(p1, t2)
        );

        var anchor:cc.math.Vector = null;
        var anchorLength= Number.MAX_VALUE;
        if ( pintersect ) {
            anchor= cc.math.Vector.sub(pintersect, p1);
            anchorLength= anchor.length();
        }

        var dd:number = (anchorLength / width)|0;

        var p0p1:cc.math.Vector= cc.math.Vector.sub( p0,p1 );
        var p0p1Length: number= p0p1.length();

        var p1p2:cc.math.Vector= cc.math.Vector.sub( p1,p2 );
        var p1p2Length:number= p1p2.length();

        /**
         * the cross point exceeds any of the segments dimension.
         * do not use cross point as reference.
         * This case deserves more attention to avoid redraw, currently works by overdrawing large parts.
         */
        if ( anchorLength>p0p1Length || anchorLength>p1p2Length ) {

            __pushVert( verts, p0.x+t0.x, p0.y+t0.y );              // p0+t0
            __pushVert( verts, p0.x-t0.x, p0.y-t0.y );              // p0-t0
            __pushVert( verts, p1.x+t0.x, p1.y+t0.y );              // p1+t0

            __pushVert( verts, p0.x-t0.x, p0.y-t0.y );              // p0-t0
            __pushVert( verts, p1.x+t0.x, p1.y+t0.y );              // p1+t0
            __pushVert( verts, p1.x-t0.x, p1.y-t0.y );              // p1-t0

            if ( join === cc.render.LineJoin.ROUND ) {

                createRoundCap(p1, cc.math.Vector.add(p1,t0), cc.math.Vector.add(p1,t2), p2, verts);

            } else if ( join===cc.render.LineJoin.BEVEL || (join===cc.render.LineJoin.MITER && dd>=miterLimit) ) {

                __pushVert( verts, p1.x, p1.y );                    // p1
                __pushVert( verts, p1.x+t0.x, p1.y+t0.y );          // p1+t0
                __pushVert( verts, p1.x+t2.x, p1.y+t2.y );          // p1+t2

            } else if (join === cc.render.LineJoin.MITER && dd<miterLimit && pintersect) {

                __pushVert( verts, p1.x+t0.x, p1.y+t0.y );          // p1+t0
                __pushVert( verts, p1.x, p1.y );                    // p1
                __pushVert( verts, pintersect.x, pintersect.y );    // pintersect

                __pushVert( verts, p1.x+t2.x, p1.y+t2.y );          // p1+t2
                __pushVert( verts, p1.x, p1.y );                    // p1
                __pushVert( verts, pintersect.x, pintersect.y );    // pintersect
            }

            __pushVert( verts, p2.x+t2.x, p2.y+t2.y );              // p2+t2
            __pushVert( verts, p1.x-t2.x, p1.y-t2.y );              // p1-t2
            __pushVert( verts, p1.x+t2.x, p1.y+t2.y );              // p1+t2

            __pushVert( verts, p2.x+t2.x, p2.y+t2.y );              // p2+t2
            __pushVert( verts, p1.x-t2.x, p1.y-t2.y );              // p1-t2
            __pushVert( verts, p2.x-t2.x, p2.y-t2.y );              // p2-t2

        } else {

            __pushVert( verts, p0.x+t0.x, p0.y+t0.y );              // p0+t0
            __pushVert( verts, p0.x-t0.x, p0.y-t0.y );              // p0-t0
            __pushVert( verts, p1.x-anchor.x, p1.y-anchor.y );      // p1-anchor

            __pushVert( verts, p0.x+t0.x, p0.y+t0.y );              // p0+t0
            __pushVert( verts, p1.x-anchor.x, p1.y-anchor.y );      // p1-anchor
            __pushVert( verts, p1.x+t0.x, p1.y+t0.y );              // p1+t0

            if (join === cc.render.LineJoin.ROUND) {

                var _p0 = cc.math.Vector.add(p1, t0);
                var _p1 = cc.math.Vector.add(p1, t2);
                var _p2 = cc.math.Vector.sub(p1, anchor);

                var center = p1;

                __pushVert( verts, _p0.x, _p0.y );                 // _p0
                __pushVert( verts, center.x, center.y );           // center
                __pushVert( verts, _p2.x, _p2.y );                 // _p2

                createRoundCap(center, _p0, _p1, _p2, verts);

                __pushVert( verts, center.x, center.y );           // center
                __pushVert( verts, _p1.x, _p1.y );                 // _p1
                __pushVert( verts, _p2.x, _p2.y );                 // _p2

            } else {

                if (join === cc.render.LineJoin.BEVEL || (join === cc.render.LineJoin.MITER && dd >= miterLimit)) {

                    __pushVert( verts, p1.x+t0.x, p1.y+t0.y );      // p1+t0
                    __pushVert( verts, p1.x+t2.x, p1.y+t2.y );      // p1+t2
                    __pushVert( verts, p1.x-anchor.x, p1.y-anchor.y ); // p1-anchor
                }

                if (join === cc.render.LineJoin.MITER && dd < miterLimit) {

                    __pushVert( verts, pintersect.x, pintersect.y );// pintersect
                    __pushVert( verts, p1.x+t0.x, p1.y+t0.y );      // p1+t0
                    __pushVert( verts, p1.x+t2.x, p1.y+t2.y );      // p1+t2

                    __pushVert( verts, p1.x-anchor.x, p1.y-anchor.y );      // p1-anchor
                    __pushVert( verts, p1.x+t0.x, p1.y+t0.y );      // p1+t0
                    __pushVert( verts, p1.x+t2.x, p1.y+t2.y );      // p1+t2
                }
            }

            __pushVert( verts, p2.x+t2.x, p2.y+t2.y );              // p2+t2
            __pushVert( verts, p1.x-anchor.x, p1.y-anchor.y );      // p1-anchor
            __pushVert( verts, p1.x+t2.x, p1.y+t2.y );              // p1+t2

            __pushVert( verts, p2.x+t2.x, p2.y+t2.y );              // p2+t2
            __pushVert( verts, p1.x-anchor.x, p1.y-anchor.y );      // p1-anchor
            __pushVert( verts, p2.x-t2.x, p2.y-t2.y );              // p2-t2
        }
    }

    /**
     * ripped from http://www.blackpawn.com/texts/pointinpoly/default.html ;)
     *
     * Identify whether the <code>cc.math.Point</code> p is inside the triangle defined by the 3 point.
     *
     * @method cc.math.path.geometry.isPointInTriangle
     *
     * @param p {cc.math.Point}
     * @param ax {number}
     * @param ay {number}
     * @param bx {number}
     * @param by {number}
     * @param cx {number}
     * @param cy {number}
     * @returns {boolean}
     */
    export function isPointInTriangle(
        p:cc.math.Point,
        ax:number, ay:number,
        bx:number, by:number,
        cx:number, cy:number ) : boolean {

        var v0x = cx - ax;
        var v0y = cy - ay;
        var v1x = bx - ax;
        var v1y = by - ay;
        var v2x = p.x - ax;
        var v2y = p.y - ay;

        // Compute dot products
        var dot00 = Math.sqrt(v0x*v0x + v0y*v0y);
        var dot01 = Math.sqrt(v0x*v1x + v0y*v1y);
        var dot02 = Math.sqrt(v0x*v2x + v0y*v2y);
        var dot11 = Math.sqrt(v1x*v1x + v1y*v1y);
        var dot12 = Math.sqrt(v1x*v2x + v1y*v2y);

        // Compute barycentric coordinates
        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in triangle
        return (u >= 0) && (v >= 0) && (u + v < 1)

    }

    function computeNextIndex(pVertices, pIndex) {
        return pIndex === pVertices.length - 1 ? 0 : pIndex + 1;
    }

    function areVerticesClockwise(pVertices : cc.math.Point[] ) : boolean {

        var area = 0;
        for (var i = 0, vertexCount = pVertices.length; i != vertexCount; i++) {
            var p1 = pVertices[i];
            var p2 = pVertices[computeNextIndex(pVertices, i)];
            area += p1.x * p2.y - p2.x * p1.y;
        }

        return area*signedAreaModifier < 0;
    }


    /**
     * Based from Ivank.polyk: http://polyk.ivank.net/polyk.js
     *
     * Turn a cloud of points to triangles.
     * The result of this operation will be an array of numbers, being each two a point, and each 6 a triangle.
     *
     * @method cc.math.path.geometry.tessellate
     * @param contour {Array<cc.math.Point>}
     * @returns {Float32Array}
     */
    export function tessellateWrong( contour:cc.math.Point[] ) {

        var n = contour.length;

        if (n < 3) {
            return null;;
        }

        signedAreaModifier= cc.render.RENDER_ORIGIN===cc.render.ORIGIN_TOP ? 1 : -1;

        var triangles = [];

        var available = [];
        for (var i = 0; i < n; i++) {
            available.push(i);
        }

        var i = 0;
        var numPointsToTessellate = n;

        if ( areVerticesClockwise(contour) ) {
            contour.reverse();
        }

        while (numPointsToTessellate > 3) {

            var i0:number = available[(i    ) % numPointsToTessellate];
            var i1:number = available[(i + 1) % numPointsToTessellate];
            var i2:number = available[(i + 2) % numPointsToTessellate];

            var ax = contour[i0].x;
            var ay = contour[i0].y;
            var bx = contour[i1].x;
            var by = contour[i1].y;
            var cx = contour[i2].x;
            var cy = contour[i2].y;

            var earFound = false;

            if (signedArea(ax, ay, bx, by, cx, cy)*-1 >= 0) {
                earFound = true;
                for (var j = 0; j < numPointsToTessellate; j++) {
                    var vi = available[j];

                    if (vi === i0 || vi === i1 || vi === i2) {
                        continue;
                    }

                    if (isPointInTriangle(contour[vi], ax, ay, bx, by, cx, cy)) {
                        earFound = false;
                        break;
                    }
                }
            }

            if (earFound) {
                triangles.push(i0, i1, i2);
                available.splice((i + 1) % numPointsToTessellate, 1);
                numPointsToTessellate--;
                i = 0;
            } else if (i++ > 3 * numPointsToTessellate) {
                break;
            }
        }

        triangles.push(available[0], available[1], available[2]);

        var trianglesData= new Float32Array( triangles.length*2 );
        for( var i=0; i<triangles.length; i++ ) {
            var p:cc.math.Point= contour[ triangles[i] ];
            trianglesData[i*2  ]=p.x;
            trianglesData[i*2+1]=p.y;
        }

        return new Float32Array(trianglesData);
    }

}