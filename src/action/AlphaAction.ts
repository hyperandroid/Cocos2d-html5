/**
 * License: see license.txt file.
 */



/// <reference path="../node/Node.ts"/>
/// <reference path="./Action.ts"/>
"use strict";

module cc.action {

    import        Node = cc.node.Node;
    import        Action = cc.action.Action;

    /**
     * @class cc.action.AlphaActionInitializer
     * @interface
     * @classdesc
     *
     * AlphaAction initializer object.
     *
     */
    export interface AlphaActionInitializer extends ActionInitializer {

        /**
         * Start alpha value.
         * @member cc.action.AlphaActionInitializer#start
         * @type {number}
         */
        from? : number;

        /**
         * End alpha value.
         * @member cc.action.AlphaActionInitializer#end
         * @type {number}
         */
        to? : number;

    }

    /**
     * @class cc.action.AlphaAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's transparency.
     * <br>
     * Transparency values are defined by a number between 0 (fully transparent) and 1 (fully opaque).
     */
    export class AlphaAction extends Action {


        /**
         * When the action is initialized with a target, this value is the original transparency value.
         * @member cc.action.AlphaAction#_originalAlpha
         * @type {number}
         * @private
         */
        _originalAlpha:number = 0;

        /**
         * Action start alpha.
         * @member cc.action.AlphaAction#_startAlpha
         * @type {number}
         * @private
         */
        _startAlpha:number = 0;

        /**
         * Action end alpha.
         * @member cc.action.AlphaAction#_endAlpha
         * @type {number}
         * @private
         */
        _endAlpha:number = 0;

        /**
         * AlphaAction constructor.
         * @method cc.action.AlphaAction#constructor
         * @param data {cc.action.AlphaActionInitializer=}
         */
        constructor( data? : AlphaActionInitializer ) {
            super();
            if (data) {
                this.__createFromInitializer(data);
            }
        }

        __createFromInitializer(data?:AlphaActionInitializer ) {
            super.__createFromInitializer( data );
            if ( typeof data!=="undefined" ) {
                this._startAlpha = data.to;
                this._endAlpha = data.from;
            }
        }

        /**
         * Update target Node's transparency.
         * {@link cc.action.Action#update}
         * @method cc.action.AlphaAction#update
         * @override
         * @return {number} Applied transparency value.
         */
        update(delta:number, node:Node):any {

            var r:number = this._startAlpha + delta * (this._endAlpha - this._startAlpha);

            if (this._relativeAction) {
                r += this._originalAlpha;
                if ( this._reversed ) {
                    r-= this._endAlpha;
                }
            }

            node._alpha= r;

            return r;
        }

        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.AlphaAction#solveInitialValues
         * @override
         */
        solveInitialValues(node:Node) {
            if (this._relativeAction && !this._fromValuesSet) {
                this._startAlpha = 0;
            } else if (!this._fromValuesSet ) {
                this._startAlpha = node._alpha;
            }

        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.AlphaAction#initWithTarget
         * @override
         */
        initWithTarget(node:Node):void {
            this._originalAlpha = node._alpha;
            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#from}
         * @method cc.action.AlphaAction#from
         * @override
         */
        from(alpha:number):Action {
            super.from(alpha);
            this._startAlpha = alpha;
            return this;
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.AlphaAction#to
         * @override
         */
        to(alpha:number):Action {
            this._endAlpha = alpha;
            return this;
        }

        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.AlphaAction#__cloneImpl
         * @override
         */
        __cloneImpl():Action {

            var copy : AlphaAction = new AlphaAction();
            copy.to(this._endAlpha);

            if (this._fromValuesSet) {
                copy.from(this._startAlpha);
            }

            copy._originalAlpha= this._originalAlpha;

            this.__genericCloneProperties(copy);

            return copy;
        }

        getInitializer() : AlphaActionInitializer {
            var init:AlphaActionInitializer= <AlphaActionInitializer>super.getInitializer();
            if ( this._fromValuesSet ) {
                init.from = this._startAlpha;
            }
            init.to= this._endAlpha;
            init.type="AlphaAction";

            return init;
        }
    }

}
