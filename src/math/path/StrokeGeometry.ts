/**
 *
 * License: see license.txt file.
 *
 */

module cc.math.path {

    var EPSILON= 0.0001;

    export interface StrokeGeometryAttributes {
        width? : number;        // 1 if not defined
        cap? : string;          // butt, round, square
        join?: string;          // bevel, round, miter
        mitterLimit? : number   // for join miter, the maximum angle value to use the miter
    }

        /**
         * Get Stroke geometry for an array of Vector objects.
         * The array is the result of calling 'trace' for a Path object.
         *
         * @param points {Array.<cc.math.Vector>} contour of the points to trace.
         * @param attributes {cc.math.path.StrokeGeometryAttributes}
         *
         * @returns {Array}
         */
        export function getStrokeGeometry(points:Vector[], attrs:StrokeGeometryAttributes) {

            // trivial reject
            if (points.length < 2) {
                return;
            }

            var cap = attrs.cap || "butt";
            var join = attrs.join || "bevel";
            var lineWidth = (attrs.width || 1) / 2;
            var miterLimit = attrs.mitterLimit || 10;
            var anchors = [];
            var mids = [];  // middle points per each line segment.


            if (points.length === 2) {
                join = "bevel";
                createAnchor(points[0], cc.math.Vector.middlePoint(points[0], points[1]), points[1], lineWidth, anchors, join, cap);
            } else {

                // no need for storing mid points.
                for (var i = 0; i < points.length - 1; i++) {
                    mids.push(
                        i === 0 ? points[0] :
                        i === points.length - 2 ? points[points.length - 1] :
                            cc.math.Vector.middlePoint(points[i], points[i + 1]));
                }

                for (i = 1; i < mids.length; i++) {
                    createAnchor(mids[i - 1], points[i], mids[i], lineWidth, anchors, join, cap, miterLimit);
                }
            }

/*
            if (cap === "round") {

                var p00 = anchors[0];
                var p01 = anchors[1];
                var p02 = points[1];
                createRoundCap(points[0], p00, p01, p02, anchors);

                var p10 = anchors[anchors.length - 1];
                var p11 = anchors[anchors.length - 3];
                var p12 = points[points.length - 2];
                createRoundCap(points[points.length - 1], p10, p11, p12, anchors);

            } else if (cap === "square") {

                var p00 = anchors[anchors.length - 1];
                var p01 = anchors[anchors.length - 3];

                createSquareCap(points[0], anchors[0], anchors[1], anchors);
                createSquareCap(points[points.length - 1], p00, p01, anchors);

            }
*/
            return anchors;
        }

        createSquareCap : function( center, p0, p1, verts ) {

            var dir= GS.Point.Sub( p0, center );
            dir.perpendicular();

            verts.push( p0 );
            verts.push( GS.Point.Add( p0, dir ) );
            verts.push( GS.Point.Add( p1, dir ) );

            verts.push( p1 );
            verts.push( GS.Point.Add( p1, dir ) );
            verts.push( p0 );


        },

        createRoundCap: function( center, _p0, _p1, nextPointInLine, verts ) {

            var radius= GS.Point.Sub(center,_p0).module() ;

            var angle0 = Math.atan2( (_p1.y-center.y),(_p1.x-center.x) );
            var angle1 = Math.atan2( (_p0.y-center.y),(_p0.x-center.x) );

            var angleDiff= Math.atan2(Math.sin(angle1-angle0), Math.cos(angle1-angle0));

            /**
             * muy lol. estamos en indefinicion, donde el angulo es cercano a pi o -pi.
             * en este caso, cualquiera de los dos angulos es el menor.
             * necesitamos direccionalidad para saber que semi plano del circulo usar.
             * lo decide la direccion del segmento entre dos puntos adyacentes del path.
             * hay que corregir el semiplano izquierdo.
             */
            if ( Math.abs(angleDiff)>=Math.PI-EPSILON && Math.abs(angleDiff)<=Math.PI+EPSILON ) {
                var r1= GS.Point.Sub( center, nextPointInLine);
                angleDiff *= r1.x>0 ? 1 : -1;
            }

            var nsegments= (Math.abs(angleDiff * radius)/7)>>0;
            nsegments++;

            var angleInc= angleDiff/nsegments;

            for( var i=0; i< nsegments; i++ ) {
                verts.push( new GS.Point(center.x, center.y) );
                verts.push( new GS.Point(
                    center.x + radius * Math.cos( angle0 + angleInc*i ),
                    center.y + radius * Math.sin( angle0 + angleInc*i )
                ) );
                verts.push( new GS.Point(
                    center.x + radius * Math.cos( +angle0 + angleInc*(1+i) ),
                    center.y + radius * Math.sin( +angle0 + angleInc*(1+i) )
                ) );
            }
        },

        function signedArea(P1, P2, P3) {
            return (P2.x - P1.x) * (P3.y - P1.y) - (P3.x - P1.x) * (P2.y - P1.y);
        }

        function lineIntersection(p0, p1, p2, p3) {

            var a0 = p1.y - p0.y;
            var b0 = p0.x - p1.x;

            var a1 = p3.y - p2.y;
            var b1 = p2.x - p3.x;

            var det = a0 * b1 - a1 * b0;
            if ( det>-EPSILON && det<EPSILON ) {
                return null;
            } else {
                var c0 = a0 * p0.x + b0 * p0.y;
                var c1 = a1 * p2.x + b1 * p2.y;

                var x = (b1 * c0 - b0 * c1) / det;
                var y = (a0 * c1 - a1 * c0) / det;
                return new GS.Point(x, y);
            }
        },

        createAnchor: function (p0, p1, p2, weight, verts, join, cap, miterLimit) {
            var t0 = GS.Point.Sub(p1, p0);
            var t2 = GS.Point.Sub(p2, p1);

            t0.perpendicular();
            t2.perpendicular();

            if (this.signedArea(p0, p1, p2) > 0) {
                t0.invert();
                t2.invert();
            }

            t0.normalize();
            t2.normalize();
            t0.mult(weight);
            t2.mult(weight);

            var pintersect = this.lineIntersection(GS.Point.Add(t0, p0), GS.Point.Add(t0, p1), GS.Point.Add(t2, p2), GS.Point.Add(t2, p1));

            if (pintersect === null) {
                verts.push(GS.Point.Add(p0, t0));
                verts.push(GS.Point.Sub(p0, t0));
                verts.push(GS.Point.Add(p2, t0));

                verts.push(GS.Point.Sub(p0, t0));
                verts.push(GS.Point.Add(p2, t0));
                verts.push(GS.Point.Sub(p2, t0));

                return;
            }

            var anchor = GS.Point.Sub(pintersect, p1);
            var dd= anchor.module()/weight;

            if ( dd > miterLimit ) {
                verts.push(GS.Point.Add(p0, t0));
                verts.push(GS.Point.Sub(p0, t0));
                verts.push(GS.Point.Add(p1, t0));

                verts.push(GS.Point.Sub(p0, t0));
                verts.push(GS.Point.Add(p1, t0));
                verts.push(GS.Point.Add(p1, t2));

                verts.push(GS.Point.Add(p2, t2));
                verts.push(GS.Point.Sub(p2, t2));
                verts.push(GS.Point.Add(p1, t2));

                verts.push(GS.Point.Sub(p2, t2));
                verts.push(GS.Point.Add(p1, t2));
                verts.push(GS.Point.Add(p1, t0));


            } else {

                verts.push(GS.Point.Add(p0, t0));
                verts.push(GS.Point.Sub(p0, t0));
                verts.push(GS.Point.Sub(p1, anchor));

                verts.push(GS.Point.Add(p0, t0));
                verts.push(GS.Point.Sub(p1, anchor));
                verts.push(GS.Point.Add(p1, t0));


                // mitter - remove for bevel
                if ( join==="round" ) {

                    var _p0= GS.Point.Add(p1,t0);
                    var _p1= GS.Point.Add(p1,t2);
                    var _p2= GS.Point.Sub(p1, anchor);

                    var center= p1;

                    verts.push( _p0 );
                    verts.push( center );
                    verts.push( _p2 );

                    this.createRoundCap(center, _p0, _p1, _p2, verts);

                    verts.push( center );
                    verts.push( _p1 );
                    verts.push( _p2 );

                } else {

                    verts.push(GS.Point.Add(p1, t0));
                    verts.push(GS.Point.Add(p1, t2));
                    verts.push(GS.Point.Sub(p1, anchor));

                    if ( join==='miter' ) {
                        verts.push(pintersect);
                        verts.push(GS.Point.Add(p1, t0));
                        verts.push(GS.Point.Add(p1, t2));
                    }
                }

                verts.push(GS.Point.Add(p2, t2));
                verts.push(GS.Point.Sub(p1, anchor));
                verts.push(GS.Point.Add(p1, t2));

                verts.push(GS.Point.Add(p2, t2));
                verts.push(GS.Point.Sub(p1, anchor));
                verts.push(GS.Point.Sub(p2, t2));
            }

        }


}