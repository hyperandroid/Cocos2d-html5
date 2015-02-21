/**
 * License: see license.txt file.
 */


/// <reference path="../math/Point.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="./Action.ts"/>

module cc.action {

    "use strict";

    import Point = cc.math.Point;
    import Vector= cc.math.Vector;

    import Node = cc.node.Node;
    import Action = cc.action.Action;

    var __moveActionUpdateValue : cc.math.Point= { x : 0, y : 0 };

    /**
     * @class cc.action.MoveActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * MoveAction initializer object.
     */
    export interface MoveActionInitializer extends ActionInitializer {

        /**
         * Move from point.
         * @member cc.action.MoveActionInitializer#from
         * @type {cc.math.Point}
         */
        from? : cc.math.Point;

        /**
         * Move to point.
         * @member cc.action.MoveActionInitializer#to
         * @type {cc.math.Point}
         */
        to : cc.math.Point;

    }

    /**
     * @class cc.action.MoveAction
     * @extends cc.action.Action
     * @classdesc
     * This action applies to a node's position.
     * The action will traverse a line path.
     */
    export class MoveAction extends Action {

        /**
         * Node's original x position.
         * @member cc.action.MoveAction#_originalX
         * @type {number}
         * @private
         */
        _originalX : number = 0;

        /**
         * Node's original y position.
         * @member cc.action.MoveAction#_originalX
         * @type {number}
         * @private
         */
        _originalY : number = 0;

        /**
         * Action initial X
         * @member cc.action.MoveAction#_x0
         * @type {number}
         * @private
         */
        _x0 : number = 0;

        /**
         * Action initial Y
         * @member cc.action.MoveAction#_y0
         * @type {number}
         * @private
         */
        _y0 : number = 0;

        /**
         * Action final X
         * @member cc.action.MoveAction#_x1
         * @type {number}
         * @private
         */
        _x1 : number = 0;

        /**
         * Action final Y
         * @member cc.action.MoveAction#_y1
         * @type {number}
         * @private
         */
        _y1 : number = 0;

        /**
         * Build a new MoveAction
         * @method cc.action.MoveAction#constructor
         * @param data {cc.action.MoveActionInitializer=}
         */
        constructor( data? : MoveActionInitializer ) {
            super();

            if ( data ) {
                this.__createFromInitializer(data);
            }
        }

        /**
         * Initialize the action with an initializer object.
         * @method cc.action.MoveAction#__createFromInitializer
         * @param initializer {cc.action.MoveActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?:MoveActionInitializer ) {
            super.__createFromInitializer(initializer);
        }

        /**
         * Update target Node's position.
         * {@link cc.action.Action#update}
         * @method cc.action.MoveAction#update
         * @override
         * @return {cc.math.Point} new Node position.
         */
        update(delta:number, node : Node ) : any {

            var x = this._x0 + delta * (this._x1 - this._x0);
            var y = this._y0 + delta * (this._y1 - this._y0);

            if ( this._relativeAction ) {
                x+= this._originalX;
                y+= this._originalY;
                if ( this._reversed ) {
                    x-= this._x1;
                    y-= this._y1;
                }
            }

            node.setPosition( x, y );

            __moveActionUpdateValue.x= x;
            __moveActionUpdateValue.y= y;

            return __moveActionUpdateValue;
        }

        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.MoveAction#solveInitialValues
         * @override
         */
        solveInitialValues(node : Node) {

            if (this._relativeAction && !this._fromValuesSet) {
                this._x0=0;
                this._y0=0;
            } else if (!this._fromValuesSet) {
                this._x0 = node.x;
                this._y0 = node.y;
            }
        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.MoveAction#initWithTarget
         * @override
         */
        initWithTarget( node : Node ) {
            this._originalX = node.x;
            this._originalY = node.y;

            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#from}
         * @method cc.action.MoveAction#from
         * @override
         */
        from(point:Point):Action {
            super.from(point);
            this._x0 = point.x;
            this._y0 = point.y;

            return this;
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.MoveAction#to
         * @override
         */
        to(point:Point):Action {
            this._x1 = point.x;
            this._y1 = point.y;
            return this;
        }

        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.MoveAction#__cloneImpl
         * @override
         */
        __cloneImpl() : Action {

            var copy= new MoveAction().
                to({ x: this._x1, y: this._y1});

            if ( this._fromValuesSet ) {
                copy.from( { x: this._x0, y: this._y0 } );
            }

            this.__genericCloneProperties( copy );

            return copy;
        }

        /**
         * Serialize the action current definition.
         * @method cc.action.MoveAction#getInitializer
         * @returns {cc.action.MoveActionInitializer}
         */
        getInitializer() : MoveActionInitializer {
            var init:MoveActionInitializer= <MoveActionInitializer>super.getInitializer();

            if ( this._fromValuesSet ) {
                init.from = { x: this._x0, y:this._y0 };
            }

            init.to= { x: this._x1, y:this._y1 };

            init.type="MoveAction";

            return init;
        }

    }
}