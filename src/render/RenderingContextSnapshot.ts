/**
 * License: see license.txt file.
 */

/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../math/Color.ts"/>
/// <reference path="./RenderingContext.ts"/>

module cc.render {

    import Matrix3 = cc.math.Matrix3;
    import Color = cc.math.Color;

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

        _currentFillStyleType : cc.render.FillStyleType= cc.render.FillStyleType.COLOR;

        /**
         * Current fill style.
         * @member cc.render.RenderingContextSnapshot#_fillStyle
         * @type {any}
         * @private
         */
        _fillStyleColor : Float32Array= new Float32Array([0.0, 0.0, 0.0, 1.0]);

        _fillStylePattern : cc.render.Pattern= null;

        /**
         * Current tint color. Only makes sense in webgl renderers.
         * @member cc.render.RenderingContextSnapshot#_tintColor
         * @type {Float32Array}
         * @private
         */
        _tintColor : Float32Array = new Float32Array([0.0, 0.0, 0.0, 1.0]);

        /**
         * Current stroke line width.
         * @member cc.render.RenderingContextSnapshot#_lineWidth
         * @type {number}
         * @private
         */
        _lineWidth : number = 1.0;

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
            Matrix3.copy( rcs._currentMatrix, this._currentMatrix );
            rcs._fillStyleColor= this._fillStyleColor;
            rcs._fillStylePattern= this._fillStylePattern;
            rcs._currentFillStyleType= this._currentFillStyleType;
            rcs._tintColor= this._tintColor;
            rcs._lineWidth= this._lineWidth;
            rcs._miterLimit= this._miterLimit;
            rcs._fontDefinition= this._fontDefinition;
            rcs._textBaseline= this._textBaseline;
            rcs._textAlign= this._textAlign;

            //rcs._currentPath = this._currentPath.clone();
            rcs._clippingStack = this._clippingStack;

            return rcs;
        }
    }

}