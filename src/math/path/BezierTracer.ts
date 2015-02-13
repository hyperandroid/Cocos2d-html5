/**
 * License: see license.txt file
 */

/// <reference path="../Point.ts"/>

module cc.math.path {

    "use strict";

    import Vector= cc.math.Vector;

    /**
     *
     * Original source:
     * http://www.antigrain.com/research/adaptive_bezier/index.html
     *
     */


    /**
     * Recursion limit to calculate curve.
     * @type {number}
     */
    var curve_recursion_limit:number = 8;

    /**
     * 0.2 when stroking is on lines > 1px in width.
     * You set it in radians. The less this value is the more accurate will be the approximation at sharp turns.
     * But 0 means that we don't consider angle conditions at all.
     * @type {number}
     */
    var m_angle_tolerance:number = 0.2;

    /**
     * should not exceed 10-15 degrees (in radians)
     * @type {number}
     */
    var m_cusp_limit:number = 15 * Math.PI / 180;

    /**
     * worlModelView scale factor. (1 by default)
     * @type {number}
     */
    var m_approximation_scale:number = 1;

    /**
     * colinearity threshold.
     * @type {number}
     */
    var curve_collinearity_epsilon:number = 0.001;

    /**
     *
     * @type {number}
     */
    var curve_angle_tolerance_epsilon:number = 0;

    /**
     * calculated by m_approximation_scale
     * @type {number}
     */
    var m_distance_tolerance:number = 0.0001;

    function __recursive_bezier(points:Vector[], x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number, level:number) {

        if (level > curve_recursion_limit) {
            return;
        }

        // Calculate all the mid-points of the line segments
        //----------------------
        var x12 = (x1 + x2) / 2;
        var y12 = (y1 + y2) / 2;
        var x23 = (x2 + x3) / 2;
        var y23 = (y2 + y3) / 2;
        var x34 = (x3 + x4) / 2;
        var y34 = (y3 + y4) / 2;
        var x123 = (x12 + x23) / 2;
        var y123 = (y12 + y23) / 2;
        var x234 = (x23 + x34) / 2;
        var y234 = (y23 + y34) / 2;
        var x1234 = (x123 + x234) / 2;
        var y1234 = (y123 + y234) / 2;

        if (level > 0) { // Enforce subdivision first time

            // Try to approximate the full cubic curve by a single straight line
            //------------------
            var dx = x4 - x1;
            var dy = y4 - y1;

            var d2 = Math.abs(((x2 - x4) * dy - (y2 - y4) * dx));
            var d3 = Math.abs(((x3 - x4) * dy - (y3 - y4) * dx));

            var da1, da2;

            if (d2 > curve_collinearity_epsilon && d3 > curve_collinearity_epsilon) {
                // Regular care
                //-----------------
                if ((d2 + d3) * (d2 + d3) <= m_distance_tolerance * (dx * dx + dy * dy)) {
                    // If the curvature doesn't exceed the distance_tolerance value
                    // we tend to finish subdivisions.
                    //----------------------
                    if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
                        points.push(new Vector(x1234, y1234));
                        return;
                    }

                    // Angle & Cusp Condition
                    //----------------------
                    var a23 = Math.atan2(y3 - y2, x3 - x2);
                    da1 = Math.abs(a23 - Math.atan2(y2 - y1, x2 - x1));
                    da2 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - a23);
                    if (da1 >= Math.PI) da1 = 2 * Math.PI - da1;
                    if (da2 >= Math.PI) da2 = 2 * Math.PI - da2;

                    if (da1 + da2 < m_angle_tolerance) {
                        // Finally we can stop the recursion
                        //----------------------
                        points.push( new Vector(x1234, y1234) );
                        return;
                    }

                    if (m_cusp_limit !== 0.0) {
                        if (da1 > m_cusp_limit) {
                            points.push(new Vector(x2, y2));
                            return;
                        }

                        if (da2 > m_cusp_limit) {
                            points.push(new Vector(x3, y3));
                            return;
                        }
                    }
                }
            }
            else {
                if (d2 > curve_collinearity_epsilon) {
                    // p1,p3,p4 are collinear, p2 is considerable
                    //----------------------
                    if (d2 * d2 <= m_distance_tolerance * (dx * dx + dy * dy)) {
                        if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push(new Vector(x1234, y1234));
                            return;
                        }

                        // Angle Condition
                        //----------------------
                        da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
                        if (da1 >= Math.PI) da1 = 2 * Math.PI - da1;

                        if (da1 < m_angle_tolerance) {
                            points.push(new Vector(x2, y2));
                            points.push(new Vector(x3, y3));
                            return;
                        }

                        if (m_cusp_limit !== 0.0) {
                            if (da1 > m_cusp_limit) {
                                points.push(new Vector(x2, y2));
                                return;
                            }
                        }
                    }
                }
                else if (d3 > curve_collinearity_epsilon) {
                    // p1,p2,p4 are collinear, p3 is considerable
                    //----------------------
                    if (d3 * d3 <= m_distance_tolerance * (dx * dx + dy * dy)) {
                        if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push(new Vector(x1234, y1234));
                            return;
                        }

                        // Angle Condition
                        //----------------------
                        da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2));
                        if (da1 >= Math.PI) da1 = 2 * Math.PI - da1;

                        if (da1 < m_angle_tolerance) {
                            points.push(new Vector(x2, y2));
                            points.push(new Vector(x3, y3));
                            return;
                        }

                        if (m_cusp_limit !== 0.0) {
                            if (da1 > m_cusp_limit) {
                                points.push(new Vector(x3, y3));
                                return;
                            }
                        }
                    }
                }
                else {
                    // Collinear case
                    //-----------------
                    dx = x1234 - (x1 + x4) / 2;
                    dy = y1234 - (y1 + y4) / 2;
                    if (dx * dx + dy * dy <= m_distance_tolerance) {
                        points.push(new Vector(x1234, y1234));
                        return;
                    }
                }
            }
        }

        // Continue subdivision
        //----------------------
        __recursive_bezier(points, x1, y1, x12, y12, x123, y123, x1234, y1234, level + 1);
        __recursive_bezier(points, x1234, y1234, x234, y234, x34, y34, x4, y4, level + 1);
    }

    /**
     *
     * @param p0 {cc.math.Vector}
     * @param cp0 {cc.math.Vector}
     * @param cp1 {cc.math.Vector}
     * @param p1 {cc.math.Vector}
     * @param points {Array<cc.math.Vector>=}
     *
     * @static
     */
    export function traceBezier(p0:Vector,cp0:Vector,cp1:Vector,p1:Vector, m_points?:Vector[]) {

        var x1:number = p0.x;
        var y1:number = p0.y;
        var x2:number = cp0.x;
        var y2:number = cp0.y;
        var x3:number = cp1.x;
        var y3:number = cp1.y;
        var x4:number = p1.x;
        var y4:number = p1.y;

        var m_points = m_points || [];
        m_distance_tolerance = 0.5 / m_approximation_scale;
        m_distance_tolerance *= m_distance_tolerance;
        m_points.push(new Vector(x1,y1));
        __recursive_bezier(m_points, x1, y1, x2, y2, x3, y3, x4, y4, 0);
        m_points.push(new Vector(x4, y4));
        return m_points;
    }

    /**
     *
     * @param p0 {cc.math.Vector}
     * @param cp0 {cc.math.Vector}
     * @param p1 {cc.math.Vector}
     * @param m_points {Array<cc.math.Vector>=}
     * @static
     */
    export function traceQuadratic(p0:Vector,cp0:Vector,p1:Vector, m_points?:Vector[]) {

        var x1:number = p0.x;
        var y1:number = p0.y;
        var x2:number = cp0.x;
        var y2:number = cp0.y;
        var x3:number = p1.x;
        var y3:number = p1.y;

        m_points = m_points || [];
        m_distance_tolerance = 0.5 / m_approximation_scale;
        m_distance_tolerance *= m_distance_tolerance;

        m_points.push(new Vector(x1,y1));
        __recursive_quadratic(m_points, x1, y1, x2, y2, x3, y3, 0);
        m_points.push(new Vector(x3, y3));
        return m_points;
    }

    /**
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param level {number}
     * @private
     * @static
     */
    function __recursive_quadratic(points:Vector[], x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, level:number) {

        if (level > curve_recursion_limit) {
            return;
        }

        // Calculate all the mid-points of the line segments
        //----------------------
        var x12 = (x1 + x2) / 2;
        var y12 = (y1 + y2) / 2;
        var x23 = (x2 + x3) / 2;
        var y23 = (y2 + y3) / 2;
        var x123 = (x12 + x23) / 2;
        var y123 = (y12 + y23) / 2;

        var dx = x3 - x1;
        var dy = y3 - y1;
        var d = Math.abs(((x2 - x3) * dy - (y2 - y3) * dx));

        if (d > curve_collinearity_epsilon) {
            // Regular care
            //-----------------
            if (d * d <= m_distance_tolerance * (dx * dx + dy * dy)) {
                // If the curvature doesn't exceed the distance_tolerance value
                // we tend to finish subdivisions.
                //----------------------
                if (m_angle_tolerance < curve_angle_tolerance_epsilon) {
                    points.push(new Vector(x123, y123));
                    return;
                }

                // Angle & Cusp Condition
                //----------------------
                var da = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
                if (da >= Math.PI) da = 2 * Math.PI - da;

                if (da < m_angle_tolerance) {
                    // Finally we can stop the recursion
                    //----------------------
                    points.push(new Vector(x123, y123));
                    return;
                }
            }
        }
        else {
            // Collinear case
            //-----------------
            dx = x123 - (x1 + x3) / 2;
            dy = y123 - (y1 + y3) / 2;
            if (dx * dx + dy * dy <= m_distance_tolerance) {
                points.push(new Vector(x123, y123));
                return;
            }
        }

        // Continue subdivision
        //----------------------
        __recursive_quadratic(points, x1, y1, x12, y12, x123, y123, level + 1);
        __recursive_quadratic(points, x123, y123, x23, y23, x3, y3, level + 1);
    }
}