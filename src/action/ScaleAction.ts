/**
 * License: see license.txt file.
 */


/// <reference path="./Action.ts"/>
/// <reference path="../math/Point.ts"/>
/// <reference path="../node/Node.ts"/>

module cc.action {

    "use strict";

    import Point = cc.math.Point;
    import Vector= cc.math.Vector;

    import Node = cc.node.Node;
    import Action = cc.action.Action;

    var __scaleActionUpdateValue = new Vector();

    /**
     * @class cc.action.ScaleActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * Scale action initializer object.
     *
     */
    export interface ScaleActionInitializer extends ActionInitializer {

        /**
         * Start scale value. The scale is for x and y axis.
         * @member cc.action.ScaleActionInitializer#from
         * @type {cc.math.Point=}
         */
        from? : cc.math.Point;

        /**
         * End scale value. The scale is for x and y axis.
         * @member cc.action.ScaleActionInitializer#to
         * @type {cc.math.Point}
         */
        to : cc.math.Point;
    }

    /**
     * @class cc.action.ScaleAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a Node's scale values.
     */
    export class ScaleAction extends Action {

        /**
         * Node's original x axis scale.
         * @member cc.action.ScaleAction#_originalScaleX
         * @type {number}
         * @private
         */
        _originalScaleX:number = 1;

        /**
         * Node's original y axis scale.
         * @member cc.action.ScaleAction#_originalScaleY
         * @type {number}
         * @private
         */
        _originalScaleY:number = 1;

        /**
         * Action start x axis Scale.
         * @member cc.action.ScaleAction#_scaleX0
         * @type {number}
         */
        _scaleX0:number = 1;

        /**
         * Action start y axis Scale.
         * @member cc.action.ScaleAction#_scaleY0
         * @type {number}
         */
        _scaleY0:number = 1;

        /**
         * Action end x axis Scale.
         * @member cc.action.ScaleAction#_scaleX1
         * @type {number}
         */
        _scaleX1:number = 1;

        /**
         * Action end y axis Scale.
         * @member cc.action.ScaleAction#_scaleY1
         * @type {number}
         */
        _scaleY1:number = 1;

        /**
         * Build a new ScaleAction instance.
         * @param data {cc.action.ScaleActionInitializer=}
         */
        constructor( data? : ScaleActionInitializer ) {
            super();

            if ( data ) {
                this.__createFromInitializer(data);
            }
        }

        /**
         * Initialize the action with an initializer object.
         * @method cc.action.ScaleAction#__createFromInitializer
         * @param data {cc.action.ScaleActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?:ScaleActionInitializer ) {
            super.__createFromInitializer(initializer);
        }

        /**
         * Update target Node's scale.
         * {@link cc.action.Action#update}
         * @method cc.action.ScaleAction#update
         * @override
         * @returns {cc.math.Vector} new node's scale values.
         */
        update(delta:number, node:Node):any {

            var x = this._scaleX0 + delta * (this._scaleX1 - this._scaleX0);
            var y = this._scaleY0 + delta * (this._scaleY1 - this._scaleY0);

            if (this._relativeAction) {
                x += this._originalScaleX;
                y += this._originalScaleY;
                if ( this._reversed ) {
                    x-= this._scaleX1;
                    y-= this._scaleY1;
                }
            }

            node.setScale(x, y);

            return __scaleActionUpdateValue.set(x, y);
        }

        /**
         * Capture before-application Node's scale for both axis x and y.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.ScaleAction#solveInitialValues
         * @override
         */
        solveInitialValues(node:Node) {

            if (this._relativeAction && !this._fromValuesSet) {
                this._scaleX0 = 0;
                this._scaleY0 = 0;
            } else if (!this._fromValuesSet) {
                this._scaleX0 = node.scaleX;
                this._scaleY0 = node.scaleY;
            }
        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.ScaleAction#initWithTarget
         * @override
         */
        initWithTarget(node:Node) {
            this._originalScaleX = node.scaleX;
            this._originalScaleY = node.scaleY;

            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#from}
         * @method cc.action.ScaleAction#from
         * @override
         */
        from(point:Point):Action {
            super.from(point);
            this._scaleX0 = point.x;
            this._scaleY0 = point.y;

            return this;
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.ScaleAction#to
         * @override
         */
        to(point:Point):Action {
            this._scaleX1 = point.x;
            this._scaleY1 = point.y;
            return this;
        }

        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.ScaleAction#__cloneImpl
         * @override
         */
        __cloneImpl():Action {

            var copy = new ScaleAction().
                to({ x: this._scaleX1, y: this._scaleY1});

            if (this._fromValuesSet) {
                copy.from({ x: this._scaleX0, y: this._scaleY0 });
            }

            this.__genericCloneProperties(copy);

            return copy;
        }

        /**
         * Serialize the action current definition.
         * @method cc.action.ScaleAction#getInitializer
         * @returns {cc.action.ScaleActionInitializer}
         */
        getInitializer() : ScaleActionInitializer {
            var init:ScaleActionInitializer= <ScaleActionInitializer>super.getInitializer();

            if ( this._fromValuesSet ) {
                init.from = { x: this._scaleX0, y: this._scaleY0 };
            }
            init.to= { x: this._scaleX1, y: this._scaleY1 };
            init.type="ScaleAction";

            return init;
        }
    }

}