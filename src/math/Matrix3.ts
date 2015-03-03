/**
 * License: see license.txt file.
 */


/// <reference path="../node/Node.ts"/>
/// <reference path="../render/RenderingContext.ts"/>

module cc.math {

    "use strict";

    import Node= cc.node.Node;
    import RenderingContext= cc.render.RenderingContext;

    var __m0 : Float32Array= new Float32Array([1,0,0, 0,1,0, 0,0,1]);

    /**
     * @class cc.math.Matrix3
     *
     * @classdesc
     *
     * Affine transformation matrix Object.
     * <br>
     * The Matrix3 <strong>IS NOT</strong> a general purpose matrix calculation package. Do not use for anything else than affine
     * transformation purposes inside the Cocos2D HTML5 engine.
     */
    export class Matrix3 {


        /**
         * Build a new Matrix3 object.
         * @method cc.math.Matrix3#constructor
         */
        static create() : Float32Array {
            var matrix= new Float32Array(9);
            Matrix3.identity(matrix);

            return matrix;
        }

        /**
         * Turn the matrix to identity.
         * @method cc.math.Matrix3.identity
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @returns {cc.math.Matrix3}
         */
        static identity(matrix:Float32Array)  {
            matrix[0]= 1.0;
            matrix[1]= 0.0;
            matrix[2]= 0.0;

            matrix[3]= 0.0;
            matrix[4]= 1.0;
            matrix[5]= 0.0;

            matrix[6]= 0.0;
            matrix[7]= 0.0;
            matrix[8]= 1.0;

        }

        static translateBy( matrix:Float32Array, dtx:number, dty:number ) {
            var a= matrix[0];
            var b= matrix[1];
            var c= matrix[3];
            var d= matrix[4];
            var tx= matrix[2];
            var ty= matrix[5];

            matrix[2]= a*dtx + b*dty + tx;
            matrix[5]= c*dtx + d*dty + ty;
        }

        static scaleBy(  matrix:Float32Array, sx:number, sy:number ) {

            matrix[0]*= sx;
            matrix[1]*= sy;

            matrix[3]*= sx;
            matrix[4]*= sy;
        }

        static rotateBy( matrix:Float32Array, angle:number ) {
            cc.math.Matrix3.setRotate( __m0, angle );
            cc.math.Matrix3.multiply( matrix, __m0 );
        }

        /**
         * Copy a source to a destination matrix
         * @method cc.math.Matrix#copy
         * @param source {Float32Array} matrix coefficients. horizontal vectors.
         * @param destination {Float32Array} matrix coefficients. horizontal vectors.
         */
        static copy( source:Float32Array, destination:Float32Array ) : void {
            destination.set( source );
        }

        static set( m:Float32Array, a:number, b:number, c:number, d:number, tx:number, ty:number ) {
            m[0]= a;
            m[1]= b;
            m[2]= tx;
            m[3]= c;
            m[4]= d;
            m[5]= ty;
            m[6]= 0;
            m[7]= 0;
            m[8]= 1;

        }

        /**
         * Given a node, calculate a resulting matrix for position, scale and rotate.
         * @method cc.math.Matrix3.setTransformAll
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param node {cc.node.Node} a cc.node.Node instance
         */
        static setTransformAll( mm:Float32Array, node : Node ) {

            var c : number, s: number, _m00: number, _m01: number, _m10: number, _m11: number;
            var m00: number, m01: number, m02: number, m10: number, m11: number, m12: number;

            m00 = 1.0;
            m01 = 0.0;
            m10 = 0.0;
            m11 = 1.0;

            var cs= node._contentSize;

            m02 = node.x - node._positionAnchor.x * cs.width;
            m12 = node.y - node._positionAnchor.y * cs.height;

            var rx: number = node._transformationAnchor.x * cs.width;
            var ry: number = node._transformationAnchor.y * cs.height;

            m02 += m00 * rx + m01 * ry;
            m12 += m10 * rx + m11 * ry;

            var angle: number= -node.rotationAngle * Math.PI / 180.0;

            c = Math.cos(angle);
            s = Math.sin(angle);
            _m00 = m00;
            _m01 = m01;
            _m10 = m10;
            _m11 = m11;
            m00 = _m00 * c + _m01 * s;
            m01 = -_m00 * s + _m01 * c;
            m10 = _m10 * c + _m11 * s;
            m11 = -_m10 * s + _m11 * c;

            m00 = m00 * node.scaleX;
            m01 = m01 * node.scaleY;
            m10 = m10 * node.scaleX;
            m11 = m11 * node.scaleY;

            m02 += -m00 * rx - m01 * ry;
            m12 += -m10 * rx - m11 * ry;

            mm[0] = m00;
            mm[1] = m01;
            mm[3] = m10;
            mm[4] = m11;
            mm[2] = m02;
            mm[5] = m12;
        }

        /**
         * Given a node, calculate a resulting matrix for position and scale.
         * @method cc.math.Matrix3.setTransformScale
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param node {cc.node.Node} a cc.node.Node instance
         */
        static setTransformScale( mm:Float32Array, node : Node ) {

            var m00: number, m01: number, m02: number, m10: number, m11: number, m12: number;

            m00 = 1.0;
            m01 = 0.0;
            m10 = 0.0;
            m11 = 1.0;

            var cs= node._contentSize;

            m02 = node.x - node._positionAnchor.x * cs.width;
            m12 = node.y - node._positionAnchor.y * cs.height;

            var rx: number = node._transformationAnchor.x * cs.width;
            var ry: number = node._transformationAnchor.y * cs.height;

            m02 += m00 * rx + m01 * ry;
            m12 += m10 * rx + m11 * ry;

            m00 = m00 * node.scaleX;
            m01 = m01 * node.scaleY;
            m10 = m10 * node.scaleX;
            m11 = m11 * node.scaleY;

            m02 += -m00 * rx - m01 * ry;
            m12 += -m10 * rx - m11 * ry;

            mm[0] = m00;
            mm[1] = m01;
            mm[3] = m10;
            mm[4] = m11;
            mm[2] = m02;
            mm[5] = m12;
        }

        /**
         * Given a node, calculate a resulting matrix for position.
         * @method cc.math.Matrix3.setTransformTranslate
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param node {cc.node.Node} a cc.node.Node instance
         */
        static setTransformTranslate( mm:Float32Array, node:Node ) {

            var pa=node._positionAnchor;
            var cs=node._contentSize;
            var x: number = node.x - pa.x * cs.width;
            var y: number = node.y - pa.y * cs.height;
            mm[2] = x;
            mm[5] = y;
            mm[0] = 1.0;
            mm[1] = 0.0;
            mm[3] = 0.0;
            mm[4] = 1.0;
            mm[6] = 0.0;
            mm[7] = 0.0;
            mm[8] = 1.0;
        }

        /**
         * Multiply matrix m0 by matrix m1. modify m0.
         * <br>
         * Both matrices must be Matrix3 instances.
         * @method cc.math.Matrix3.multiply
         * @param m0 {Float32Array} matrix coefficients. horizontal vectors.
         * @param m1 {Float32Array} matrix coefficients. horizontal vectors.
         */
        static multiply(m0:Float32Array, m1:Float32Array ) {

            var mm0 : number = m1[0];
            var mm1 : number = m1[1];
            var mm2 : number = m1[2];
            var mm3 : number = m1[3];
            var mm4 : number = m1[4];
            var mm5 : number = m1[5];

            var tm0 : number = m0[0];
            var tm1 : number = m0[1];
            var tm2 : number = m0[2];

            m0[0] = tm0 * mm0 + tm1 * mm3;
            m0[1] = tm0 * mm1 + tm1 * mm4;
            m0[2] = tm0 * mm2 + tm1 * mm5 + tm2;

            var tm3 : number= m0[3];
            var tm4 : number= m0[4];
            var tm5 : number= m0[5];

            m0[3] = tm3 * mm0 + tm4 * mm3;
            m0[4] = tm3 * mm1 + tm4 * mm4;
            m0[5] = tm3 * mm2 + tm4 * mm5 + tm5;

            m0[6] = 0;
            m0[7] = 0;
            m0[8] = 1;
        }

        static premultiply(m1:Float32Array, m0:Float32Array ) {

            var mm0 : number = m1[0];
            var mm1 : number = m1[1];
            var mm2 : number = m1[2];
            var mm3 : number = m1[3];
            var mm4 : number = m1[4];
            var mm5 : number = m1[5];

            var tm0 : number = m0[0];
            var tm1 : number = m0[1];
            var tm2 : number = m0[2];

            __m0[0] = tm0 * mm0 + tm1 * mm3;
            __m0[1] = tm0 * mm1 + tm1 * mm4;
            __m0[2] = tm0 * mm2 + tm1 * mm5 + tm2;

            var tm3 : number= m0[3];
            var tm4 : number= m0[4];
            var tm5 : number= m0[5];

            __m0[3] = tm3 * mm0 + tm4 * mm3;
            __m0[4] = tm3 * mm1 + tm4 * mm4;
            __m0[5] = tm3 * mm2 + tm4 * mm5 + tm5;

            __m0[6] = 0;
            __m0[7] = 0;
            __m0[8] = 1;

            cc.math.Matrix3.copy( __m0, m1 );
        }

        /**
         * Transform a point by the matrix.
         * <br>
         * The point will be overwritten by the resulting point.
         * @method cc.math.Matrix3.transformPoint
         * @param tm {Float32Array} matrix coefficients. horizontal vectors.
         * @param point {cc.math.Point} Point or Vector to transform.
         */
        static transformPoint( tm:Float32Array, point : Point ) : Point {
            var x  :  number;
            var y  : number;

            x = point.x;
            y = point.y;
            point.x = x * tm[0] + y * tm[1] + tm[2];
            point.y = x * tm[3] + y * tm[4] + tm[5];

            return point;
        }

        /**
         * Set transformation coefficients for a RenderingContext.
         * @method cc.math.Matrix3.setRenderingContextTransform
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param ctx {cc.render.RenderingContext} a rendering context.
         */
        static setRenderingContextTransform( mm:Float32Array, ctx : RenderingContext ) {
            // TODO: set optional clamping capabilities. old mobile browsers.
            ctx.setTransform( mm[0], mm[3], mm[1], mm[4], mm[2], mm[5] );
        }

        /**
         * Set the matrix as follows
         * [ a b x ]
         * | c d y |
         * [ 0 0 1 ]
         * @method cc.math.Matrix3.setTransform
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        static setTransform( matrix:Float32Array, a : number, b:number, c:number, d:number, tx:number, ty:number ) {

            matrix[0] = a;
            matrix[3] = b;
            matrix[1] = c;
            matrix[4] = d;
            matrix[2] = tx;
            matrix[5] = ty;
            matrix[6] = 0;
            matrix[7] = 0;
            matrix[8] = 1;
        }

        /**
         * Concatenate the matrix with another matrix build of the coefficients set as parameters.
         * @method cc.math.Matrix3.transform
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        static transform(matrix:Float32Array, a:number, b:number, c:number, d:number, tx:number, ty:number) {
            Matrix3.setTransform( _workingMatrix, a,b,c,d,tx,ty);
            Matrix3.multiply(matrix, _workingMatrix);
        }

        /**
         * Make the matrix a translation matrix.
         * @method cc.math.Matrix3.setTranslate
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param x {number}
         * @param y {number}
         * @returns {cc.math.Matrix3} the same matrix.
         */
        static setTranslate( matrix:Float32Array, x : number, y : number ) {
            Matrix3.identity(matrix);
            matrix[2] = x;
            matrix[5] = y;
        }

        /**
         * Make the matrix a rotation matrix.
         * @method cc.math.Matrix3.setRotate
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param angle {number} angle in radians.
         * @returns {cc.math.Matrix3} the same matrix.
         */
        static setRotate( matrix:Float32Array, angle:number ) {
            Matrix3.identity(matrix);
            matrix[0] = Math.cos(angle);
            matrix[1] = -Math.sin(angle);
            matrix[3] = Math.sin(angle);
            matrix[4] = Math.cos(angle);
        }

        /**
         * Make the matrix a scale matrix.
         * @method cc.math.Matrix3.setScale
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param x
         * @param y
         * @returns {cc.math.Matrix3}
         */
        static setScale( matrix:Float32Array, x:number, y:number )  {
            Matrix3.identity(matrix);
            matrix[0] = x;
            matrix[4] = y;

        }

        static inverse( matrix:Float32Array, res:Float32Array ) {

            var m00 = matrix[0];
            var m01 = matrix[1];
            var m02 = matrix[2];
            var m10 = matrix[3];
            var m11 = matrix[4];
            var m12 = matrix[5];
            var m20 = matrix[6];
            var m21 = matrix[7];
            var m22 = matrix[8];

            var determinant =   m00 * (m11 * m22 - m21 * m12) -
                                m10 * (m01 * m22 - m21 * m02) +
                                m20 * (m01 * m12 - m11 * m02);

            if (determinant === 0) {
                return Matrix3.identity(Matrix3.IDENTITY);
            }

            determinant = 1 / determinant;

            res[0] = (m11 * m22 - m12 * m21) * determinant;
            res[1] = (m02 * m21 - m01 * m22) * determinant;
            res[2] = (m01 * m12 - m02 * m11) * determinant;
            res[3] = (m12 * m20 - m10 * m22) * determinant;
            res[4] = (m00 * m22 - m02 * m20) * determinant;
            res[5] = (m02 * m10 - m00 * m12) * determinant;
            res[6] = (m10 * m21 - m11 * m20) * determinant;
            res[7] = (m01 * m20 - m00 * m21) * determinant;
            res[8] = (m00 * m11 - m01 * m10) * determinant;
        }

        /**
         * An identity Matrix3 static instance.
         * @member cc.math.Matrix3.IDENTITY
         * @type {cc.math.Matrix3}
         */
        static IDENTITY : Float32Array = Matrix3.create();
    }

    /**
     * Spare working matrix.
     * @member cc.math.Matrix3._workingMatrix
     * @type {cc.math.Matrix3}
     * @private
     */
    var _workingMatrix : Float32Array = cc.math.Matrix3.create();

}