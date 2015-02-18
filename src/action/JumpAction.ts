/**
 * License: see license.txt file
 */

/// <reference path="../math/Point.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="./Action.ts"/>

"use strict";

module cc.action {

    import  Node = cc.node.Node;
    import  Action = cc.action.Action;
    import  Vector= cc.math.Vector;

    var __v0= new Vector();
    /**
     * @class JumpActionInitializer
     * @interface
     * @classdesc
     *
     * JumpAction initialization helper object.
     *
     */
    export interface JumpActionInitializer extends ActionInitializer {

        jumps : number;

        amplitude : number;

        position : cc.math.Point;

    }

    /**
     * @class cc.action.JumpAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's position by bouncing up to a given altitude.
     */
    export class JumpAction extends Action {


        /**
         * Node's original x position.
         * @member cc.action.MoveAction#_originalX
         * @type {number}
         * @private
         */
        _originalX : number = 0;

        /**
         * Node's original y position.
         * @member cc.action.JumpAction#_originalX
         * @type {number}
         * @private
         */
        _originalY : number = 0;

        /**
         * Action jump height.
         * @member cc.action.JumpAction#_amplitude
         * @type {number}
         * @private
         */
        _amplitude:number = 80;

        /**
         * Number of jumps to perform.
         * @member cc.action.JumpAction#_jumps
         * @type {number}
         * @private
         */
        _jumps:number = 1;

        _jumpTo : Vector = null;

        /**
         * JumpAction constructor.
         * @method cc.action.JumpAction#constructor
         * @param data {cc.action.JumpActionInitializer=}
         */
        constructor(data?:JumpActionInitializer) {
            super();

            if (data) {
                this.__createFromInitializer(data);
            }
        }

        __createFromInitializer(data?:JumpActionInitializer ) {
            super.__createFromInitializer( data );

            if (typeof data !== "undefined") {
                this._amplitude = data.amplitude;
                this._jumps= data.jumps;
                this._jumpTo= new Vector( data.position.x, data.position.y );
            }
        }

        /**
         * Update target Node's position.
         * {@link cc.action.Action#update}
         * @method cc.action.JumpAction#update
         * @override
         * @return {number} Applied transparency value.
         */
        update(delta:number, node:Node):any {

            var frac = delta * this._jumps % 1.0;
            var y = this._amplitude* 4 * frac * (1 - frac);
            y += this._jumpTo.y * delta;

            var x = this._jumpTo.x * delta;

            x += this._originalX;
            y += this._originalY;

            if (this._relativeAction) {
                if (this._reversed) {
                    x -= this._jumpTo.x;
                    y -= this._jumpTo.y;
                }
            }

            node.setPosition( x, y );

            return __v0.set(x,y);
        }

        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.JumpAction#solveInitialValues
         * @override
         */
        solveInitialValues(node:Node) {

        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.JumpAction#initWithTarget
         * @override
         */
        initWithTarget(node:Node):void {
            this._originalX = node.x;
            this._originalY = node.y;

            if (!this._relativeAction) {
                this._jumpTo.x-= this._originalX;
                this._jumpTo.y-= this._originalY;
            }

            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.JumpAction#__cloneImpl
         * @override
         */
        __cloneImpl():Action {

            var copy:JumpAction = new JumpAction();

            copy._amplitude= this._amplitude;
            copy._jumps= this._jumps;
            copy._jumpTo= new Vector( this._jumpTo.x, this._jumpTo.y );

            this.__genericCloneProperties(copy);

            return copy;
        }

        getInitializer() : JumpActionInitializer {
            var init:JumpActionInitializer= <JumpActionInitializer>super.getInitializer();
            init.type="JumpAction";

            init.jumps= this._jumps;
            init.amplitude= this._amplitude;
            init.position= {
                x : this._jumpTo.x,
                y : this._jumpTo.y
            };

            return init;
        }

    }

}
