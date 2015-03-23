/**
 *
 * License: see license.txt file.
 *
 * (c) 2014-2015 @hyperandroid
 *
 */

/// <reference path="../../Point.ts"/>

module cc.math.path.geometry {

    var EPSILON= 0.0001;

    export interface StrokeGeometryAttributes {
        width? : number;        // 1 if not defined
        cap? : string;          // butt, round, square
        join?: string;          // bevel, round, miter
        miterLimit? : number   // for join miter, the maximum angle value to use the miter
    }

    /**
     * Get Stroke geometry for an array of Vector objects.
     * The array is the result of calling 'trace' for a Path object.
     *
     * @param points {Array.<cc.math.Vector>} contour of the points to trace.
     * @param attrs {cc.math.path.StrokeGeometryAttributes}
     *
     * @returns {Array<number> | Float32Array} Array with pairs of numbers (x,y)
     */
    export function getStrokeGeometry(points:cc.math.Vector[], attrs:StrokeGeometryAttributes) : Float32Array {

        // trivial reject
        if (points.length < 2) {
            return new Float32Array([]);
        }

        var cap:string =                attrs.cap || "butt";
        var join:string =               attrs.join || "bevel";
        var lineWidth:number =          (attrs.width || 1) / 2;
        var miterLimit:number =         attrs.miterLimit || 10;
        var vertices:Array<number> =    [];
        var middlePoints:Vector[] =     [];  // middle points per each line segment.
        var closed:boolean =            false;

        if (points.length === 2) {
            join = "bevel";
            createTriangles(points[0], cc.math.Vector.middlePoint(points[0], points[1]), points[1], vertices, lineWidth, join, miterLimit);

        } else {

             if (points[0] === points[points.length - 1] ||
                 (  points[0].x === points[points.length - 1].x &&
                    points[0].y === points[points.length - 1].y )   ) {

                 var p0 = points.shift();
                 p0 = cc.math.Vector.middlePoint(p0, points[0]);
                 points.unshift(p0);
                 points.push(p0);
                 closed= true;
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

            if (cap === "round") {

                var p00 = new cc.math.Vector(vertices[0],vertices[1]);
                var p01 = new cc.math.Vector(vertices[2],vertices[3]);
                var p02 = points[1];
                var p10 = new cc.math.Vector( vertices[vertices.length - 2], vertices[vertices.length - 1] );
                var p11 = new cc.math.Vector( vertices[vertices.length - 6], vertices[vertices.length - 5] );
                var p12 = points[points.length - 2];

                createRoundCap(points[0], p00, p01, p02, vertices);
                createRoundCap(points[points.length - 1], p10, p11, p12, vertices);

            } else if (cap === "square") {

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


    function signedArea(p0:cc.math.Point, p1:cc.math.Point, p2:cc.math.Point) {
        return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
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
        p0:cc.math.Vector, p1:cc.math.Vector, p2:cc.math.Vector,
        verts:Array<number>,
        width:number, join:string, miterLimit:number) {

        var t0:cc.math.Vector = cc.math.Vector.sub(p1, p0);
        var t2:cc.math.Vector = cc.math.Vector.sub(p2, p1);

        t0.perpendicular().normalize().mult(width);
        t2.perpendicular().normalize().mult(width);

        // triangle composed by the 3 points if clockwise or couterclockwise.
        // if counterclockwise, we must invert the line threshold points, otherwise the intersection point
        // could be erroneous and lead to odd results.
        if (signedArea(p0, p1, p2) > 0) {
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

            if ( join === "round" ) {

                createRoundCap(p1, cc.math.Vector.add(p1,t0), cc.math.Vector.add(p1,t2), p2, verts);

            } else if ( join==="bevel" || (join==="miter" && dd>=miterLimit) ) {

                __pushVert( verts, p1.x, p1.y );                    // p1
                __pushVert( verts, p1.x+t0.x, p1.y+t0.y );          // p1+t0
                __pushVert( verts, p1.x+t2.x, p1.y+t2.y );          // p1+t2

            } else if (join === 'miter' && dd<miterLimit && pintersect) {

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

            if (join === "round") {

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

                if (join === "bevel" || (join === "miter" && dd >= miterLimit)) {

                    __pushVert( verts, p1.x+t0.x, p1.y+t0.y );      // p1+t0
                    __pushVert( verts, p1.x+t2.x, p1.y+t2.y );      // p1+t2
                    __pushVert( verts, p1.x-anchor.x, p1.y-anchor.y ); // p1-anchor
                }

                if (join === 'miter' && dd < miterLimit) {

                    __pushVert( verts, pintersect.x, pintersect.y );// pintersect
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
}