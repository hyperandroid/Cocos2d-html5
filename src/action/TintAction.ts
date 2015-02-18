/**
 * License: see license.txt file.
 */



/// <reference path="../node/Node.ts"/>
/// <reference path="../math/Point.ts"/>
/// <reference path="./Action.ts"/>

module cc.action {

    "use strict";

    import        RGBAColor = cc.math.RGBAColor;
    import        Color = cc.math.Color;

    import        Node = cc.node.Node;
    import        Action = cc.action.Action;

    var __updateRGB : RGBAColor = { r : 1, g: 1,  b: 1};

    /**
     * @class cc.action.TintActionInitializer
     * @interface
     * @classdesc
     *
     * TintAction initializer object.
     *
     */
    export interface TintActionInitializer extends ActionInitializer {

        from? : RGBAColor;
        to : RGBAColor;
    }

    /**
     * @class cc.action.TintAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a Node's color.
     * The tint color is not the actual node's color, it is a multiplicative value for color or texture.
     * Tint components are values between 0 and 1.
     */
    export class TintAction extends Action {

        /**
         * Node's original color.
         * @member cc.action.TintAction#_originalColor
         * @type {cc.math.RGBAColor}
         * @private
         */
        _originalColor : RGBAColor = { r : 1, g: 1, b: 1 };

        /**
         * Action start color.
         * @member cc.action.TintAction#_startColor
         * @type {cc.math.RGBAColor}
         */
        _startColor: RGBAColor = { r : 1, g: 1, b: 1 };

        /**
         * Action end color.
         * @member cc.action.TintAction#_endColor
         * @type {cc.math.RGBAColor}
         */
        _endColor: RGBAColor = { r : 1, g: 1, b: 1 };

        /**
         * Build a new TintAction.
         * @method cc.action.TintAction#constructor
         * @param data {cc.action.TintActionInitializer=}
         */
        constructor( data? : TintActionInitializer )  {
            super();

            if ( data ) {
                this.__createFromInitializer(data);
            }
        }

        __createFromInitializer(initializer?:TintActionInitializer ) {
            super.__createFromInitializer(initializer);
        }

        /**
         * Update target Node's tint color.
         * {@link cc.action.Action#update}
         * @method cc.action.TintAction#update
         * @override
         * @returns {cc.math.RGBAColor} new node's tint values.
         */
        update(delta:number, node:Node):any {

            var r:number = this._startColor.r + delta * (this._endColor.r - this._startColor.r);
            var g:number = this._startColor.g + delta * (this._endColor.g - this._startColor.g);
            var b:number = this._startColor.b + delta * (this._endColor.b - this._startColor.b);

            if (this._relativeAction) {
                r += this._originalColor.r;
                g += this._originalColor.g;
                b += this._originalColor.b;
                if ( this._reversed ) {
                    r-= this._endColor.r;
                    g-= this._endColor.g;
                    b-= this._endColor.b;
                }
            }

            node.setColor(r,g,b);

            // update returned value only if someone is interested on it.
            if ( this._onApply ) {
                __updateRGB.r = r;
                __updateRGB.g = g;
                __updateRGB.b = b;
            }

            return __updateRGB;
        }

        /**
         * Capture before-application Node's tint color.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.TintAction#solveInitialValues
         * @override
         */
        solveInitialValues(node:Node) {
            if (this._relativeAction && !this._fromValuesSet) {
                this._startColor.r= 0;
                this._startColor.g= 0;
                this._startColor.b= 0;
            } else {
                var color= node._color._color;
                this._startColor.r = color[0];
                this._startColor.g = color[1];
                this._startColor.b = color[2];
            }
        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.TintAction#initWithTarget
         * @override
         */
        initWithTarget(node:Node) {
            var color= node._color._color;
            this._originalColor.r = color[0];
            this._originalColor.g = color[1];
            this._originalColor.b = color[2];

            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#from}
         * @method cc.action.TintAction#from
         * @override
         */
        from(color:RGBAColor):Action {
            super.from(color);
            this._startColor = {r : color.r, g : color.g, b : color.b};;
            return this;
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.TintAction#to
         * @override
         */
        to(color:RGBAColor):Action {
            this._endColor = {r : color.r, g : color.g, b : color.b};
            return this;
        }

        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.TintAction#__cloneImpl
         * @override
         */
        __cloneImpl():Action {

            var copy : TintAction = new TintAction();
            copy.to({r : this._endColor.r, g : this._endColor.g, b : this._endColor.b});

            if (this._fromValuesSet) {
                copy.from( {r : this._startColor.r, g : this._startColor.g, b : this._startColor.b} );
            }

            this.__genericCloneProperties(copy);

            return copy;
        }


        getInitializer() : TintActionInitializer {
            var init:TintActionInitializer= <TintActionInitializer>super.getInitializer();

            if ( this._fromValuesSet ) {
                init.from = { r: this._startColor.r, g: this._startColor.g, b: this._startColor.b };
            }
            init.to= { r: this._endColor.r, g: this._endColor.g, b: this._endColor.b };
            init.type="TintAction";

            return init;
        }
    }

}
