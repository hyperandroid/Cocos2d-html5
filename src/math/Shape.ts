/**
 * License: see license.txt file
 */

/// <reference path="./Path.ts"/>
/// <reference path="./Matrix3.ts"/>
/// <reference path="./Color.ts"/>
/// <reference path="./path/geometry/StrokeGeometry.ts"/>
/// <reference path="../render/RenderingContext.ts"/>

module cc.math {

    /**
     * @class cc.math.ShapePathAttributes
     * @classdesc
     *
     * This is a companion class for the Shape object.
     * It represents the information for one of its Path objects, where the path itself and fill/stroke
     * information is kept together.
     *
     * You'll never need to interact with this object directly.
     */
    export class ShapePathAttributes {

        /**
         *
         * @type {null}
         */
        path :          cc.math.Path= null;
        isStroked :     boolean= false;
        isFilled :      boolean= false;
        fillStyle :     any = null;
        strokeStyle :   any = null;

        fillFirst : boolean = false;

        constructor() {
            this.path= new cc.math.Path();
            this.fillStyle= cc.math.Color.BLACK;
            this.strokeStyle= cc.math.Color.BLACK;
        }

        setFilled( ) {
            if (!this.isStroked) {
                this.fillFirst= true;
            }
            this.isFilled= true;
        }

        setStroked() {
            if ( !this.isFilled ) {
                this.fillFirst= false;
            }

            this.isStroked= true;
        }

        draw( ctx:cc.render.RenderingContext ) {

            if ( this.fillFirst ) {

                if ( this.isFilled ) {
                    ctx.setFillStyle( this.fillStyle );
                    ctx.fillPath( this.path );
                }
                if ( this.isStroked ) {
                    ctx.setStrokeStyle( this.strokeStyle );
                    ctx.strokePath( this.path );
                }

            } else {

                if ( this.isStroked ) {
                    ctx.setStrokeStyle( this.strokeStyle );
                    ctx.strokePath( this.path );
                }
                if ( this.isFilled ) {
                    ctx.setFillStyle( this.fillStyle );
                    ctx.fillPath( this.path );
                }
            }
        }
    }

    /**
     * @class cc.math.Shape
     * @classdesc
     *
     * A Shape object is a collection of <code>cc.math.Path</code> objects and a fill/stroke styles associated with each of them.
     * The idea is to keep under an easy-to-handle class the responsibility of stroke/paint a collection of different
     * path objects. For example, this is a good fit complex objects built of vector data since the shape will
     * cache all contour/fill geometry and the renderer will batch calls whenever possible.
     * For example, the following code will create an Arrow Shape:
     *
     * <code>
     * var arrow= new cc.math.Shape().
     *     setStrokeStyle( "#fff" ).
     *     setLineWidth(3).
     *     setLineJoin( cc.render.LineJoin.ROUND).
     *     setLineCap( cc.render.LineJoin.ROUND).
     *     beginPath().
     *         moveTo(3,8).
     *         lineTo(15,8).
     *         lineTo(10,3).
     *     stroke().
     *     beginPath().
     *         moveTo(3,8).
     *         lineTo(15,8).
     *         lineTo(10,13).
     *     stroke();
     * </code>
     *
     * later, you can draw the awwor by calling:
     *
     * <code>arrow.draw( ctx );</code>
     */
    export class Shape {

        /**
         * Shape paths data.
         * @member cc.math.Shape#_pattAttributes
         * @type {cc.math.ShapePathAttributes[]}
         * @private
         */
        _pathAttributes : ShapePathAttributes[]= [];

        /**
         * Current path info.
         * All segment creation or stroke/attribute function calls will affect this path.
         * @member cc.math.Shape#_currentPathAttributes
         * @type {cc.math.ShapePathAttributes}
         * @private
         */
        _currentPathAttributes : ShapePathAttributes = null;

        /**
         * From the current path info, this is the actual traced path.
         * @member cc.math.Shape#_currentPath
         * @type {cc.math.Path}
         * @private
         */
        _currentPath : cc.math.Path = null;

        /**
         * Shape line join type. All paths will get this value until changed.
         * @member cc.math.Shape#lineJoin
         * @type {cc.render.LineJoin}
         */
        lineJoin : cc.render.LineJoin = cc.render.LineJoin.MITER;

        /**
         * Shape line cap type. All paths will get this value until changed.
         * @member cc.math.Shape#lineCap
         * @type {cc.render.LineCap}
         */
        lineCap  : cc.render.LineCap = cc.render.LineCap.BUTT;

        /**
         * Shape miter limit. All paths will get this value until changed.
         * @member cc.math.Shape#miterLimit
         * @type {number}
         */
        miterLimit : number = 10;

        /**
         * Shape lineWidth. All paths will get this value until changed.
         * @member cc.math.Shape#lineWidth
         * @type {number}
         */
        lineWidth : number = 1;

        /**
         * Build a new Shape instance.
         * @method cc.math.Shape#constructor
         */
        constructor() {

        }

        /**
         * Create a new Path and chain it to all the other Shape's paths.
         * @method cc.math.Shape#beginPath
         * @returns {cc.math.Shape}
         */
        beginPath() {

            var ppa= this._currentPathAttributes;

            var spa= new ShapePathAttributes();
            this._pathAttributes.push( spa );
            this._currentPathAttributes= spa;
            this._currentPath= spa.path;

            if ( ppa ) {
                spa.fillStyle = ppa.fillStyle;
                spa.strokeStyle = ppa.strokeStyle;
            }

            return this;
        }

        /**
         * This method ensures there's a path in case after creating the Shape,
         * no call to `beginPath()` is made.
         * @method cc.math.Shape#__ensureCurrentPathAttributes
         * @private
         */
        __ensureCurrentPathAttributes() {
            if ( null===this._currentPathAttributes ) {
                this.beginPath();
            }
        }

        /**
         * Set the line width for the current and future Shape paths.
         * @method cc.math.Shape#setLineWidth
         * @param w {number}
         * @returns {cc.math.Shape}
         */
        setLineWidth( w:number ) {
            this.lineWidth= w;
            return this;
        }

        /**
         * Set the miter limit for the current and future Shape paths.
         * @method cc.math.Shape#setMiterLimit
         * @param w {number}
         * @returns {cc.math.Shape}
         */
        setMiterLimit( w:number ) {
            this.miterLimit= w;
            return this;
        }

        /**
         * Set the line cap for the current and future Shape paths.
         * @method cc.math.Shape#setLineCap
         * @param w {cc.render.LineCap}
         * @returns {cc.math.Shape}
         */
        setLineCap( w:cc.render.LineCap ) {
            this.lineCap= w;
            return this;
        }

        /**
         * Set the line join for the current and future Shape paths.
         * @method cc.math.Shape#setLineJoin
         * @param w {cc.render.LineJoin}
         * @returns {cc.math.Shape}
         */
        setLineJoin( w:cc.render.LineJoin ) {
            this.lineJoin= w;
            return this;
        }

        /**
         * Move the current path's cursor position. This may imply creating a SubPath.
         * @method cc.math.Shape#moveTo
         * @param x {number}
         * @param y {number}
         * @param matrix {Float32Array=}
         * @returns {cc.math.Shape}
         */
        moveTo( x:number, y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.moveTo(x,y,matrix);
            return this;
        }

        /**
         * Add a line segment to the current path.
         * @method cc.math.Shape#lineTo
         * @param x {number}
         * @param y {number}
         * @param matrix {Float32Array=}
         * @returns {cc.math.Shape}
         */
        lineTo( x:number, y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.lineTo(x,y,matrix);
            return this;
        }

        /**
         * Add a bezier curve to the current path.
         * @method cc.math.Shape#bezierCurveTo
         * @param cp0x {number}
         * @param cp0y {number}
         * @param cp1x {number}
         * @param cp1y {number}
         * @param p2x {number}
         * @param p2y {number}
         * @param matrix {Float32Array=}
         * @returns {cc.math.Shape}
         */
        bezierCurveTo( cp0x:number, cp0y:number, cp1x:number, cp1y:number, p2x:number, p2y:number, matrix?:Float32Array  ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.bezierCurveTo( cp0x, cp0y, cp1x, cp1y, p2x, p2y, matrix );
            return this;
        }

        /**
         * Add a quadratic curve to the current path.
         * @method cc.math.Shape#quadraticCurveTo
         * @param cp0x {number}
         * @param cp0y {number}
         * @param p2x {number}
         * @param p2y {number}
         * @param matrix {Float32Array=}
         * @returns {cc.math.Shape}
         */
        quadraticCurveTo( cp0x:number, cp0y:number, p2x:number, p2y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.quadraticCurveTo( cp0x, cp0y, p2x, p2y, matrix );
            return this;
        }

        /**
         * Add a rectangle subpath to the current path
         * @method cc.math.Shape#rect
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         * @param matrix {Float32Array=}
         * @returns {cc.math.Shape}
         */
        rect( x:number, y:number, width:number, height:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.rect( x, y, width, height, matrix );
            return this;
        }

        /**
         * Add an arc to the current path.
         * @method cc.math.Shape#arc
         * @param x {number}
         * @param y {number}
         * @param radius {number}
         * @param startAngle {number}
         * @param endAngle {number}
         * @param counterClockWise {boolean}
         * @param matrix {Float32Array=}
         * @returns {cc.math.Shape}
         */
        arc( x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise:boolean, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.arc( x, y, radius, startAngle, endAngle, counterClockWise, matrix );
            return this;
        }

        /**
         * Add a line segment to close the current path.
         * @method cc.math.Shape#closePath
         * @returns {cc.math.Shape}
         */
        closePath() {
            this.__ensureCurrentPathAttributes();
            this._currentPath.closePath();
            return this;
        }

        /**
         * Stroke (trace contour) the current path.
         * @method cc.math.Shape#stroke
         * @returns {cc.math.Shape}
         */
        stroke( ) {
            this._currentPathAttributes.setStroked();
            this._currentPath.getStrokeGeometry( {
                join        : this.lineJoin,
                cap         : this.lineCap,
                miterLimit  : this.miterLimit,
                width       : this.lineWidth
            });
            return this;
        }

        /**
         * Fill the current path.
         * @method cc.math.Shape#fill
         * @returns {cc.math.Shape}
         */
        fill( ) {
            this._currentPathAttributes.setFilled();
            this._currentPath.getFillGeometry();
            return this;
        }

        /**
         * Set the current and future shape's paths stroke style.
         * @method cc.math.Shape#setStrokeStyle
         * @param ss {object}
         * @returns {cc.math.Shape}
         */
        setStrokeStyle( ss:any ) {
            this.__ensureCurrentPathAttributes();
            this._currentPathAttributes.strokeStyle= ss;
            return this;
        }

        /**
         * Setter for the current and future shape paths stroke style
         * @method cc.math.Shape#set:strokeStyle
         * @param ss
         */
        set strokeStyle( ss:any ) {
            this.setStrokeStyle(ss);
        }

        /**
         * Setter for the current and future shape paths fill style
         * @method cc.math.Shape#set:fillStyle
         * @param ss
         */
        set fillStyle( ss:any ) {
            this.setFillStyle(ss);
        }

        /**
         * Set the current and future shape's paths fill style.
         * @method cc.math.Shape#setFillStyle
         * @param ss {object}
         * @returns {cc.math.Shape}
         */
        setFillStyle( ss:any ) {
            this.__ensureCurrentPathAttributes();
            this._currentPathAttributes.fillStyle= ss;
            return this;
        }

        /**
         * Draw the shape in a `cc.render.RenderingContext`.
         * @method cc.math.Shape#draw
         * @param ctx {cc.render.RenderingContext}
         */
        draw( ctx:cc.render.RenderingContext ) {
            for( var i=0; i<this._pathAttributes.length; i++ ) {
                this._pathAttributes[i].draw( ctx );
            }
        }
    }
}