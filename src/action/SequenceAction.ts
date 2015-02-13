/**
 * License: see license.txt file.
 */


/// <reference path="../node/Node.ts"/>
/// <reference path="./Action.ts"/>
/// <reference path="./MoveAction.ts"/>
/// <reference path="./RotateAction.ts"/>
/// <reference path="./ScaleAction.ts"/>
/// <reference path="./PropertyAction.ts"/>
/// <reference path="./AlphaAction.ts"/>
/// <reference path="./TintAction.ts"/>


module cc.action {

    "use strict";

    import Node= cc.node.Node;
    import Action = cc.action.Action;
    import MoveAction = cc.action.MoveAction;
    import RotateAction = cc.action.RotateAction;
    import ScaleAction = cc.action.ScaleAction;
    import PropertyAction = cc.action.PropertyAction;
    import AlphaAction = cc.action.AlphaAction;
    import TintAction = cc.action.TintAction;

    /**
     * @class cc.action.SequenceActionInitializer
     * @interface
     * @classdesc
     *
     * Sequence action initializer object.
     */
    export interface SequenceActionInitializer {

        /**
         * Is this Action Sequence or Spawn ?
         * @member cc.action.SequenceActionInitializer#sequential
         * @type {boolean}
         */
        sequential : boolean;
    }

    /**
     * @class cc.action.SequenceAction
     * @extends cc.action.Action
     * @classdesc
     *
     * SequenceAction is a collection of either parallel or sequential actions.
     * It is useful for grouping actions in a more convenient way.
     * <br>
     * This action maps to previous API versions' Sequence and Spawn, but internally works in a complete different way.
     * <br>
     * A Sequence, constraints its contained Actions to its own duration. That means that if the Sequence Actions are not
     * well setup relatively to the Sequence timing, Actions could not end playing, or callbacks could not be notified
     * appropriately.
     *
     * <li>Internally, a Sequence does not modify a Node's properties. It just choreographs the time for its children
     *  Actions. Hece there's no need to call <code>from</code> or <code>to</code> methods. This means that setting
     *  a Sequence as relative has no impact.
     * <li>A Sequence can contain other Sequences to the desired nesting level.
     * <li>A repeating ActionSequence will repeat its contained actions.
     * <li>A Sequence, if is sequential=true, will sequentialize contained actions, making one start when the previous one
     * ends. If it is sequential=false, Actions will happen at the same time.
     * <li>By default a Sequence Action will conform its duration to the one resulting of the contained Actions. It will
     * have special heuristics for sequential and not sequential behaviors.
     */
    export class SequenceAction extends Action {

        /**
         * Collection of Sequenced actions.
         * @member cc.action.SequenceAction#_actions
         * @type {Array<cc.action.Action>}
         * @private
         */
        _actions:Array<Action> = [];

        /**
         * Configures this action as Sequence or Spawn.
         * @member cc.action.SequenceAction#_sequential
         * @type {boolean}
         */
        _sequential:boolean = true;

        _prevOnRepeat : ActionCallbackRepeatCallback= null;

        /**
         * Build a new Sequence action.
         * @method cc.action.SequenceAction#constructor
         * @param data {cc.action.SequenceActionInitializer=}
         */
        constructor( data? : SequenceActionInitializer ) {
            super();

            if (typeof data!=="undefined") {
                this._sequential = data.sequential;
            }

            this._onRepeat= function(action:Action, target:Node, repetitionCount:number) {
                var seq : SequenceAction= <SequenceAction>action;
                seq.recursivelySetCreatedStatus(target);
                if ( seq._prevOnRepeat ) {
                    seq._prevOnRepeat( action, target, repetitionCount );
                }
            };
        }

        onRepeat( callback : ActionCallbackRepeatCallback ) : Action {
            this._prevOnRepeat= callback;
            return this;
        }

        recursivelySetCreatedStatus(target:Node) {
            for( var i=0; i<this._actions.length; i++ ) {
                this._actions[i].__recursivelySetCreatedStatus(target);
            }
        }

        __recursivelySetCreatedStatus(target:Node) {
            // first my children actions. !!!
            for( var i=0; i<this._actions.length; i++ ) {
                this._actions[i].__recursivelySetCreatedStatus(target);
            }
            super.__recursivelySetCreatedStatus(target);
        }

        /**
         * When an action is added, or has its duration, start time, or delay modified, the Sequence duration will be
         * recalculated.
         * @method cc.action.SequenceAction#__updateDuration
         * @override
         * @private
         */
        __updateDuration() {
            var duration= 0;

            this.__sequentializeStartAndDuration();

            for( var i=0; i<this._actions.length; i++ ) {
                var nd= this._actions[i]._startTime + this._actions[i].getDuration();

                if ( nd>duration ) {
                    duration= nd;
                }
            }

            this._duration = duration;

            super.__updateDuration();
        }

        /**
         * If this sequence has sequential behavior, this method will sequentialize in time all the Actions.
         * @method cc.action.SequenceAction#__sequentializeStartAndDuration
         * @private
         */
        __sequentializeStartAndDuration() {
            var actions= this._actions;
            if ( this._sequential ) {
                for( var i=0; i<actions.length; i++ ) {
                    var curr= actions[ i ];

                    if ( i>0 ) {
                        var prev= actions[ i-1 ];
                        curr._startTime= prev.getDuration() + prev._startTime;
                    } else {
                        curr._startTime= 0;
                    }
                }
            }

        }

        /**
         * Add an Action to the Sequence.
         * <br>
         * Added Actions can be other Sequences.
         * <br>
         * Adding actions triggers upwards recursive duration recalculation.
         * @method cc.action.SequenceAction#addAction
         * @param a {cc.action.Action}
         * @returns {cc.action.SequenceAction}
         */
        addAction(a:Action):Action {
            this._actions.push(a);


            a._owner= this._owner;
            a._parentSequence= this;

            this.__updateDuration();

            return this;
        }


        /**
         * Do Sequence application process.
         * <br>
         * Do not call directly.
         *
         * @param delta {number} elapsed time between frames.
         * @param time {number} absolute Action time.
         * @param node {cc.node.Node} target node.
         * @private
         * @method cc.action.SequenceAction#__stepImpl
         */
        __stepImpl( delta : number, time: number, node : Node ) {


            if ( this._status!==ActionStates.ENDED ) {

                if (this.__isActionApplicable(time)) {


                    // absolute time for this action relative to its start time.
                    var ntime = (time - this._startTime) % this.getOneRepetitionDuration();

                    for (var i = 0; i < this._actions.length; i++) {
                        var caction= this._actions[i];
                        caction._currentTime = (caction._currentTime + caction._speed*delta) % this.getOneRepetitionDuration();
                        caction.__stepImpl(delta, ntime, node);
                    }

                    super.__actionApply(time, node);
                } else {

                    // apply all sub-actions for the final state.
                    if (time >= this._startTime + this.getDuration()) {
                        this._status = ActionStates.ENDED;

                        // set all sub actions to its final state.
                        for (var i = 0; i < this._actions.length; i++) {
                            this._actions[i]._currentTime = (this._actions[i]._currentTime + delta);
                            this._actions[i].__stepImpl(1/cc.action.TIMEUNITS, time, node);
                        }

                        this.__actionApply(time, node);
                        if (this._onEnd) {
                            this._onEnd(this, node);
                        }
                    }
                }
            }
        }

        /**
         * Internal method to apply children actions to a target Node.
         * @method cc.action.SequenceAction#__actionApply
         * @param time {number} Time relative to the Sequence to apply a child Action at.
         * @param node {cc.node.Node} target Node to apply actions to.
         * @private
         */
        __actionApply( time : number, node : Node ) {

        }

        /**
         * Clone the Action and all its children Actions.
         * @method cc.action.SequenceAction#__cloneImpl
         * @override
         * @inheritDoc
         */
        __cloneImpl():Action {
            var action = new SequenceAction( {sequential : this._sequential} );

            this.__genericCloneProperties(action);
            action._prevOnRepeat= this._prevOnRepeat;
            action._duration= 0;

            for (var i = 0; i < this._actions.length; i++) {
                action.addAction(this._actions[i].clone());
            }

            return action;
        }

        /**
         * Get Sequence's number of actions.
         * @method cc.action.SequenceAction#getNumActions
         * @returns {number}
         */
        getNumActions():number {
            return this._actions.length;
        }

        /**
         * Get action at index.
         * @method cc.action.SequenceAction#getAction
         * @param i {number}
         * @returns {cc.action.Action}
         */
        getAction(i:number):Action {
            return this._actions[i];
        }

        /**
         * @override
         * @inheritDoc
         */
        setReversed( ) : Action {

            super.setReversed();

            this._actions= this._actions.reverse();
            for( var i=0; i<this._actions.length; i++ ) {
                this._actions[i].setReversed();
            }

            this.__sequentializeStartAndDuration();

            return this;
        }


        /**
         * @override
         * @inheritDoc
         */
        actionMove():Action {
            var a : Action = new MoveAction();
            this.addAction(a);
            return a;
        }

        /**
         * @override
         * @inheritDoc
         */
        actionRotate():Action {
            var a : Action = new RotateAction();
            this.addAction(a);
            return a;
        }

        /**
         * @override
         * @inheritDoc
         */
        actionScale():Action {
            var a : Action = new ScaleAction();
            this.addAction(a);
            return a;
        }

        /**
         * @override
         * @inheritDoc
         */
        actionAlpha():Action {
            var a : Action = new AlphaAction();
            this.addAction(a);
            return a;
        }

        /**
         * @override
         * @inheritDoc
         */
        actionTint():Action {
            var a : Action = new TintAction();
            this.addAction(a);
            return a;
        }

        /**
         * @override
         * @inheritDoc
         */
        actionProperty():Action {
            var a : Action = new PropertyAction();
            this.addAction(a);
            return a;
        }

        /**
         * @override
         * @inheritDoc
         */
        actionSequence():SequenceAction {
            var a : SequenceAction = new SequenceAction();
            this.addAction(a);
            return a;
        }

        /**
         * @override
         * @inheritDoc
         */
        endSequence(): Action {
            if ( !this._parentSequence ) {
                return this;
            }

            return this._parentSequence;
        }

    }

}