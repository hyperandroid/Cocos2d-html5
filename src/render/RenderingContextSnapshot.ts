/**
 * License: see license.txt file.
 */

/// <reference path="../math/Point.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../math/Color.ts"/>
/// <reference path="../math/Path.ts"/>
/// <reference path="../math/path/geometry/StrokeGeometry.ts"/>
/// <reference path="./RenderingContext.ts"/>

module cc.render {

    /**
     * @class cc.render.RenderingContextSnapshot
     * @classdesc
     *
     * This class has all the necessary information for a canvas rendering context.
     * Whenever a call to <code>save</code> or <code>restore</code> is made, a new Object of this type will be
     * created/destroyed.
     * A developer never interacts with this objects directly, but by calling RenderingContext methods.
     * This class is for internal use of RenderingContext implementations (webgl).
     */
    export class RenderingContextSnapshot {

        /**
         * Composite operation.
         * @member cc.render.RenderingContextSnapshot#_globalCompositeOperation
         * @type {string}
         * @private
         */
        _globalCompositeOperation : cc.render.CompositeOperation = cc.render.CompositeOperation.source_over;

        /**
         * Current transformation matrix.
         * @member cc.render.RenderingContextSnapshot#_currentMatrix
         * @type {cc.math.Matrix3}
         * @private
         */
        _currentMatrix : Float32Array = new Float32Array([1.0,0,0, 0,1.0,0, 0,0,1.0]);

        /**
         * Current global alpha value.
         * @member cc.render.RenderingContextSnapshot#_globalAlpha
         * @type {number}
         * @private
         */
        _globalAlpha : number = 1;

        /**
         * Current miter limit.
         * @member cc.render.RenderingContextSnapshot#_miterLimit
         * @type {number}
         * @private
         */
        _miterLimit : number= 10;

        /**
         * Current fill type info. Needed for shader selection.
         * @member cc.render.RenderingContextSnapshot#_currentFillStyleType
         * @type {cc.render.FillStyleType}
         * @private
         */
        _currentFillStyleType : cc.render.FillStyleType= cc.render.FillStyleType.MESHCOLOR;

        /**
         * Current fill style.
         * @member cc.render.RenderingContextSnapshot#_fillStyle
         * @type {any}
         * @private
         */
        _fillStyleColor : Float32Array= new Float32Array([0.0, 0.0, 0.0, 1.0]);

        /**
         * Current pattern info when <code>_currentFillStyleType</code> is
         * <code>cc.render.FillStyleType.PATTERN_REPEAT</code>
         * @type {cc.render.Pattern}
         * @member cc.render.RenderingContextSnapshot#_fillStylePattern
         * @private
         *
         */
        _fillStylePattern : cc.render.Pattern= null;

        /**
         * Current tint color. Only makes sense in webgl renderers.
         * @member cc.render.RenderingContextSnapshot#_tintColor
         * @type {Float32Array}
         * @private
         */
        _tintColor : Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);

        /**
         * Current stroke line width.
         * @member cc.render.RenderingContextSnapshot#_lineWidth
         * @type {number}
         * @private
         */
        _lineWidth : number = 1.0;

        /**
         * Line cap hint for path stroking.
         * @type {cc.render.LineCap.BUTT}
         * @member cc.render.RenderingContextSnapshot#_lineCap
         * @private
         */
        _lineCap : cc.render.LineCap = cc.render.LineCap.BUTT;

        /**
         * Line join hint for path stroking.
         * @type {cc.render.LineCap.BUTT}
         * @member cc.render.RenderingContextSnapshot#_lineJoin
         * @private
         */
        _lineJoin: cc.render.LineJoin= cc.render.LineJoin.MITER;

        /**
         * Current font data.
         * @member cc.render.RenderingContextSnapshot#_fontDefinition
         * @type {string}
         * @private
         */
        _fontDefinition : string = "10px sans-serif";

        /**
         * Current font baseline.
         * @member cc.render.RenderingContextSnapshot#_textBaseline
         * @type {string}
         * @private
         */
        _textBaseline : string = "alphabetic";

        /**
         * Current text align. Valid values are: left, center, right
         * @member cc.render.RenderingContextSnapshot#_textAlign
         * @type {string}
         * @private
         */
        _textAlign : string = "left";

        /**
         * Current path tracing data.
         * @member cc.render.RenderingContextSnapshot#_currentPath
         * @type {any}
         * @private
         */
        _currentPath : any = null;

        /**
         * Current clipping paths stack
         * @member cc.render.RenderingContextSnapshot#_clippingStack
         * @type {Array}
         * @private
         */
        _clippingStack : Array<any> = [];

        /**
         * Build a new RenderingContextSnapshot instance.
         * @method cc.render.RenderingContextSnapshot#constructor
         */
        constructor() {

            this._currentPath= new cc.math.Path();
        }

        /**
         * Clone this snapshot and create a new one.
         * @method cc.render.RenderingContextSnapshot#clone
         * @returns {cc.render.RenderingContextSnapshot}
         */
        clone() : RenderingContextSnapshot {

            var rcs : RenderingContextSnapshot = new RenderingContextSnapshot();

            rcs._globalCompositeOperation = this._globalCompositeOperation;
            rcs._globalAlpha = this._globalAlpha;
            cc.math.Matrix3.copy( rcs._currentMatrix, this._currentMatrix );
            rcs._fillStyleColor= this._fillStyleColor;
            rcs._fillStylePattern= this._fillStylePattern;
            rcs._currentFillStyleType= this._currentFillStyleType;
            rcs._tintColor= this._tintColor;
            rcs._lineWidth= this._lineWidth;
            rcs._miterLimit= this._miterLimit;
            rcs._fontDefinition= this._fontDefinition;
            rcs._textBaseline= this._textBaseline;
            rcs._textAlign= this._textAlign;

            rcs._currentPath = this._currentPath.clone();
            rcs._clippingStack = this._clippingStack;

            return rcs;
        }

        /**
         * begin path in the path tracer.
         * @method cc.render.RenderingContextSnapshot#beginPath
         */
        beginPath() {
            this._currentPath.beginPath();
        }

        /**
         * Close the current contour in the path tracer.
         * A closed contour can't have any other segment added, and successive tracing operations will create a new
         * contour.
         * @method cc.render.RenderingContextSnapshot#closePath
         */
        closePath() {
            this._currentPath.closePath();
        }

        /**
         * Move the current path position based on the current transformation matrix.
         * @param x {number}
         * @param y {number}
         * @method cc.render.RenderingContextSnapshot#moveTo
         */
        moveTo( x:number, y:number ) {
            this._currentPath.moveTo(x,y,this._currentMatrix);
        }

        /**
         * Add a line segment to the current path. Segment info must be transformed by the current transformation matrix.
         * @param x {number}
         * @param y {number}
         * @method cc.render.RenderingContextSnapshot#lineTo
         */
        lineTo( x:number, y:number ) {
            this._currentPath.lineTo(x,y,this._currentMatrix);
        }

        /**
         * Add a bezier segment to the current path. Segment info must be transformed by the current transformation matrix.
         * @param cp0x {number}
         * @param cp0y {number}
         * @param cp1x {number}
         * @param cp1y {number}
         * @param p2x {number}
         * @param p2y {number}
         * @method cc.render.RenderingContextSnapshot#bezierCurveTo
         */
        bezierCurveTo( cp0x:number, cp0y:number, cp1x:number, cp1y:number, p2x:number, p2y:number ) {
            this._currentPath.bezierCurveTo( cp0x, cp0y, cp1x, cp1y, p2x, p2y,this._currentMatrix );
        }

        /**
         * Add a quadratic segment to the current path. Segment info must be transformed by the current transformation matrix.
         * @param cp0x {number}
         * @param cp0y {number}
         * @param p2x {number}
         * @param p2y {number}
         * @method cc.render.RenderingContextSnapshot#quadraticCurveTo
         */
        quadraticCurveTo( cp0x:number, cp0y:number, p2x:number, p2y:number ) {
            this._currentPath.quadraticCurveTo( cp0x, cp0y, p2x, p2y,this._currentMatrix );
        }

        /**
         * Add a rectangle segment to the current path.
         * Segment info must be transformed by the current transformation matrix.
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         * @method cc.render.RenderingContextSnapshot#rect
         */
        rect( x:number, y:number, width:number, height:number ) {
            this._currentPath.rect( x, y, width, height, this._currentMatrix );
        }

        /**
         * Add an arc segment to the current path.
         * Segment info must be transformed by the current transformation matrix.
         * @param x {number}
         * @param y {number}
         * @param radius {number}
         * @param startAngle {number}
         * @param endAngle {number}
         * @param counterClockWise {boolean}
         *
         * @method cc.render.RenderingContextSnapshot#arc
         */
        arc( x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise:boolean ) {
            this._currentPath.arc( x, y, radius, startAngle, endAngle, counterClockWise, this._currentMatrix );
        }

        /**
         * Tell the current path to create geometry for its contour stroke.
         * The stroke will different based on the line width, and contour hints line join/cap.
         *
         * You normally don't have to interact with this method.
         *
         * @param lineWidth {number}
         * @param join {cc.render.LineJoin}
         * @param cap {cc.render.LineCap}
         *
         * @method cc.render.RenderingContextSnapshot#setupStroke
         * @returns {Float32Array}
         */
        setupStroke( lineWidth:number, join:cc.render.LineJoin, cap:cc.render.LineCap, path?:cc.math.Path ) {

            if ( typeof path==="undefined" ) {
                path= this._currentPath;
            }

            if ( path._strokeDirty || this._lineWidth!==lineWidth || this._lineCap!==cap || this._lineJoin!==join ) {

                lineWidth= cc.math.path.getDistanceVector(lineWidth, this._currentMatrix).length();

                this._lineCap= cap;
                this._lineJoin= join;
                this._lineWidth= lineWidth;

                path.getStrokeGeometry({
                    width: lineWidth,
                    cap: this._lineCap,
                    join: this._lineJoin,
                    miterLimit: this._miterLimit
                });

            }

            return path._strokeGeometry;
        }

        /**
         * Tell the current path to create geometry for filling it.
         *
         * You normally don't have to interact with this method.
         *
         * @method cc.render.RenderingContextSnapshot#setupFill
         * @returns {Float32Array}
         */
        setupFill( path?:cc.math.Path ) {

            if ( typeof path==="undefined" ) {
                path= this._currentPath;
            }

            return path.getFillGeometry();
        }

    }

}