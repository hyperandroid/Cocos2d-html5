/**
 * License: see license.txt file.
 */

/// <reference path="../node/Node.ts"/>
/// <reference path="./Action.ts"/>

module cc.action {

    "use strict";

    import Node = cc.node.Node;
    import Action = cc.action.Action;

    /**
     * @class cc.action.RotateActionInitializer
     * @interface
     * @classdesc
     *
     * RotateAction initializer object
     */
    export interface RotateActionInitializer {

        /**
         * Start rotation angle.
         * @member cc.action.RotateActionInitializer#start
         * @type {number}
         */
        start : number;

        /**
         * End rotation angle.
         * @member cc.action.RotateActionInitializer#end
         * @type {number}
         */
        end : number;

        /**
         * Is relative action ?
         * @member cc.action.RotateActionInitializer#relative
         * @type {boolean}
         */
        relative? : boolean;
    }

    /**
     * @class cc.action.RotateAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's rotation angle.
     * The rotation angle is defined in degrees.
     */
    export class RotateAction extends Action {

        /**
         * Node's original rotation angle.
         * @member cc.action.RotateAction#_originalAngle
         * @type {number}
         * @private
         */
        _originalAngle:number = 0;

        /**
         * Action start angle
         * @member cc.action.RotateAction#_startAngle
         * @type {number}
         */
        _startAngle:number = 0;

        /**
         * Action end angle
         * @member cc.action.RotateAction#_endAngle
         * @type {number}
         */
        _endAngle:number = 360;

        /**
         * Build a new RotateAction instance.
         * @method cc.action.RotateAction#constructor
         * @param data {cc.action.RotateActionInitializer=}
         */
        constructor( data? : RotateActionInitializer ) {
            super();

            if ( typeof data !== "undefined" ) {
                this._startAngle = data.start;
                this._endAngle= data.end;
                if ( typeof data.relative!=="undefined" ) {
                    this.setRelative( data.relative );
                }
            }
        }

        /**
         * Update target Node's rotation angle.
         * {@link cc.action.Action#update}
         * @method cc.action.RotateAction#update
         * @override
         * @return {number} new Node rotation angle.
         */
        update(delta:number, node:Node):any {

            var r:number = this._startAngle + delta * (this._endAngle - this._startAngle);

            if (this._relativeAction) {
                r += this._originalAngle;
                if ( this._reversed ) {
                    r-=this._endAngle;
                }
            }

            node.rotationAngle = r;

            return r;
        }

        /**
         * Capture before-application Node's rotation angle.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.RotateAction#solveInitialValues
         * @override
         */
        solveInitialValues(node:Node) {
            if (this._relativeAction && !this._fromValuesSet) {
                this._startAngle = 0;

                if ( this._startAngle === this._endAngle ) {
                    this._startAngle= this._originalAngle;
                    this._originalAngle= 0;
                }

            } else if (!this._fromValuesSet) {
                this._startAngle = node.rotationAngle;
            }
        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.RotateAction#initWithTarget
         * @override
         */
        initWithTarget(node:Node) {
            this._originalAngle = node.rotationAngle;
            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#from}
         * @method cc.action.RotateAction#from
         * @override
         */
        from(angle:number):Action {
            super.from(angle);
            this._startAngle = angle;
            return this;
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.RotateAction#to
         * @override
         */
        to(angle:number):Action {
            this._endAngle = angle;
            return this;
        }


        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.RotateAction#__cloneImpl
         * @override
         */
        __cloneImpl():Action {

            var copy = new RotateAction().
                to(this._endAngle);

            if (this._fromValuesSet) {
                copy.from(this._startAngle);
            }

            this.__genericCloneProperties(copy);

            return copy;
        }

    }

}