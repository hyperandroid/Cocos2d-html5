/**
 * License: see license.txt file
 *
 * See licenses/libgdx - license.txt
 */

/// <reference path="../../Point.ts"/>

module cc.math.path.geometry {

    var CONCAVE = 1;
    var CONVEX = -1;

    class EarCut {

        mConcaveVertexCount : number = 0;

        constructor() {

        }

        computeTriangles(pVertices:cc.math.Point[], preserveInputPoints:boolean ) : cc.math.Point[] {

            var triangles = [];
            var vertices;

            if ( preserveInputPoints ) {
                vertices = [];
                vertices = vertices.concat(pVertices);
            } else {
                vertices= pVertices;
            }

            if ( vertices[0].x!==vertices[ vertices.length-1 ].x &&
                 vertices[0].y!==vertices[ vertices.length-1 ].y  ) {
                vertices.push( vertices[0].clone() );
            }

            if (pVertices.length < 3) {
                return triangles;
            }

            if (vertices.length === 3) {
                triangles = triangles.concat(vertices);
                return triangles;
            }

            while (vertices.length >= 3) {

                var vertexTypes = this.classifyVertices(vertices);
                var foundEarTip = false;

                for (var index = 0, vertexCount = vertices.length; index != vertexCount; index++) {
                    if (this.isEarTip(vertices, index, vertexTypes)) {
                        this.cutEarTip(vertices, index, triangles);
                        foundEarTip = true;
                        break;
                    }
                }

                if (!foundEarTip) {
                    // polygon is not concave
                    break;
                }
            }

            return triangles;
        }


        areVerticesClockwise(pVertices : cc.math.Point[] ) : boolean {

            var area = 0;
            for (var i = 0, vertexCount = pVertices.length; i != vertexCount; i++) {
                var p1 = pVertices[i];
                var p2 = pVertices[this.computeNextIndex(pVertices, i)];
                area += p1.x * p2.y - p2.x * p1.y;
            }

            return area < 0;
        }

        classifyVertices(pVertices) {

            var vertexCount = pVertices.length;

            var vertexTypes = [];
            for (var i = 0; i < vertexCount; i++) {
                vertexTypes.push(0)
            }

            this.mConcaveVertexCount = 0;

            /* Ensure vertices are in clockwise order. */
            if (!this.areVerticesClockwise(pVertices)) {
                pVertices.reverse();
            }

            for (var index = 0; index != vertexCount; index++) {
                var previousIndex = this.computePreviousIndex(pVertices, index);
                var nextIndex = this.computeNextIndex(pVertices, index);

                var previousVertex = pVertices[previousIndex];
                var currentVertex = pVertices[index];
                var nextVertex = pVertices[nextIndex];

                if (this.isTriangleConvex(previousVertex.x, previousVertex.y, currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y)) {
                    vertexTypes[index] = CONVEX;
                } else {
                    vertexTypes[index] = CONCAVE;
                    this.mConcaveVertexCount++;
                }
            }

            return vertexTypes;
        }

        isTriangleConvex(pX1, pY1, pX2, pY2, pX3, pY3) {
            return this.computeSpannedAreaSign(pX1, pY1, pX2, pY2, pX3, pY3) >= 0;
        }

        computeSpannedAreaSign(pX1, pY1, pX2, pY2, pX3, pY3) {
            var area = 0;

            area += pX1 * (pY3 - pY2);
            area += pX2 * (pY1 - pY3);
            area += pX3 * (pY2 - pY1);

            return area > 0 ? 1 :
                area < 0 ? -1 :
                    0;
        }

        isAnyVertexInTriangle(pVertices, pVertexTypes, pX1, pY1, pX2, pY2, pX3, pY3) {
            var i = 0;

            var vertexCount = pVertices.length;
            while (i < vertexCount - 1) {
                if ((pVertexTypes[i] === CONCAVE)) {
                    var currentVertex = pVertices[i];

                    var currentVertexX = currentVertex.x;
                    var currentVertexY = currentVertex.y;

                    /* TODO The following condition fails for perpendicular, axis aligned triangles!
                     * Removing it doesn't seem to cause problems.
                     * Maybe it was an optimization?
                     * Maybe it tried to handle collinear pieces ? */
                    //                              if(((currentVertexX != pX1) && (currentVertexY != pY1)) || ((currentVertexX != pX2) && (currentVertexY != pY2)) || ((currentVertexX != pX3) && (currentVertexY != pY3))) {
                    var areaSign1 = this.computeSpannedAreaSign(pX1, pY1, pX2, pY2, currentVertexX, currentVertexY);
                    var areaSign2 = this.computeSpannedAreaSign(pX2, pY2, pX3, pY3, currentVertexX, currentVertexY);
                    var areaSign3 = this.computeSpannedAreaSign(pX3, pY3, pX1, pY1, currentVertexX, currentVertexY);

                    if (areaSign1 > 0 && areaSign2 > 0 && areaSign3 > 0) {
                        return true;
                    } else if (areaSign1 <= 0 && areaSign2 <= 0 && areaSign3 <= 0) {
                        return true;
                    }
                    //                              }
                }
                i++;
            }
            return false;
        }

        isEarTip(pVertices, pEarTipIndex, pVertexTypes) {
            if (this.mConcaveVertexCount != 0) {
                var previousVertex = pVertices[this.computePreviousIndex(pVertices, pEarTipIndex)];
                var currentVertex = pVertices[pEarTipIndex];
                var nextVertex = pVertices[this.computeNextIndex(pVertices, pEarTipIndex)];

                return !this.isAnyVertexInTriangle(pVertices, pVertexTypes, previousVertex.x, previousVertex.y, currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);
            } else {
                return true;
            }
        }

        cutEarTip(pVertices, pEarTipIndex, pTriangles) {
            var previousIndex = this.computePreviousIndex(pVertices, pEarTipIndex);
            var nextIndex = this.computeNextIndex(pVertices, pEarTipIndex);

            if (!this.isCollinear4(pVertices, previousIndex, pEarTipIndex, nextIndex)) {
                pTriangles.push( pVertices[previousIndex].clone() );
                pTriangles.push( pVertices[pEarTipIndex].clone() );
                pTriangles.push( pVertices[nextIndex].clone() );
            }

            //        pVertices.remove(pEarTipIndex);
            pVertices.splice(pEarTipIndex, 1);
            if (pVertices.length >= 3) {
                this.removeCollinearNeighborEarsAfterRemovingEarTip(pVertices, pEarTipIndex);
            }
        }

        removeCollinearNeighborEarsAfterRemovingEarTip(pVertices, pEarTipCutIndex) {
            var collinearityCheckNextIndex = pEarTipCutIndex % pVertices.length;
            var collinearCheckPreviousIndex = this.computePreviousIndex(pVertices, collinearityCheckNextIndex);

            if (this.isCollinear(pVertices, collinearityCheckNextIndex)) {
                //                        pVertices.remove(collinearityCheckNextIndex);
                pVertices.splice(collinearityCheckNextIndex, 1);

                if (pVertices.length > 3) {
                    /* Update */
                    collinearCheckPreviousIndex = this.computePreviousIndex(pVertices, collinearityCheckNextIndex);
                    if (this.isCollinear(pVertices, collinearCheckPreviousIndex)) {
                        //                                        pVertices.remove(collinearCheckPreviousIndex);
                        pVertices.splice(collinearCheckPreviousIndex, 1);
                    }
                }
            } else if (this.isCollinear(pVertices, collinearCheckPreviousIndex)) {
                //                        pVertices.remove(collinearCheckPreviousIndex);
                pVertices.splice(collinearCheckPreviousIndex, 1);
            }
        }

        isCollinear(pVertices, pIndex) {
            var previousIndex = this.computePreviousIndex(pVertices, pIndex);
            var nextIndex = this.computeNextIndex(pVertices, pIndex);

            return this.isCollinear4(pVertices, previousIndex, pIndex, nextIndex);
        }

        isCollinear4(pVertices, pPreviousIndex, pIndex, pNextIndex) {
            var previousVertex = pVertices[pPreviousIndex];
            var vertex = pVertices[pIndex];
            var nextVertex = pVertices[pNextIndex];

            return this.computeSpannedAreaSign(previousVertex.x, previousVertex.y, vertex.x, vertex.y, nextVertex.x, nextVertex.y) == 0;
        }

        computePreviousIndex(pVertices, pIndex) {
            return pIndex === 0 ? pVertices.length - 1 : pIndex - 1;
        }

        computeNextIndex(pVertices, pIndex) {
            return pIndex === pVertices.length - 1 ? 0 : pIndex + 1;
        }
    }

    var earCut= new EarCut();

    export function tessellate( points:cc.math.Point[] ) : Float32Array {

        var triangles:cc.math.Point[]= earCut.computeTriangles( points, false );

        var trianglesData= new Float32Array( triangles.length*2 );
        for( var i=0; i<triangles.length; i++ ) {
            var p:cc.math.Point= triangles[i];
            trianglesData[i*2  ]=p.x;
            trianglesData[i*2+1]=p.y;
        }

        return trianglesData;
    }
}