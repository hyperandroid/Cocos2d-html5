/**
 * License: see license.txt file.
 */

/// <reference path="./Action.ts"/>
/// <reference path="./SequenceAction.ts"/>
/// <reference path="../node/Node.ts"/>

module cc.action {

    "use strict";

    import Node= cc.node.Node;
    import Action = cc.action.Action;
    import SequenceAction = cc.action.SequenceAction;

    var __index = 0;

    /**
     * @class cc.action.ActionInfo
     * @classdesc
     *
     * This class is the information an <code>ActionManager</code> manages and keeps track of an
     * <code>Action</code> and a <code>Node</code>. It is an internal class for ActionManagers.
     *
     * You will have no direct interaction with this class.
     *
     */
    export class ActionInfo {

        _chain:ActionInfo = null;

        constructor(public _actionManager:ActionManager, public _target:Node, public _action?:Action) {

        }

        __action(bh:Action):Action {

            //bh.__setOwner(this._actionManager);
            if (this._chain !== null) {
                bh._chainAction= this._chain._action;
            }
            this._action = bh;
            bh.setTag("tag"+__index++);
            return bh;
        }

        action(action:Action):Action {
            var a : Action= this.__action(action);
            /**
             * When calling this method, there's no explicit action duration set, which solves time chaining whith a previous action.
             * This naive operation, forces chain solve.
             * BUGBUG refactor.
             */
            a.setDelay( a._startTime/cc.action.TIMEUNITS );
            return a;
        }

        step(elapsedTime:number):void {
            this._action.step(elapsedTime, this._target);
        }

        isFinished():boolean {
            return this._action.isFinished();
        }

        pause():void {
            this._action.pause(this._target);
        }

        resume():void {
            this._action.resume();
        }

        setChain(actionInfo:ActionInfo):void {
            this._chain = actionInfo;
        }

        stop() {
            this._action.stop(this._target);
        }
    }

    /**
     * @class cc.action.ActionManager
     * @classdesc
     *
     * An <code>ActionManager</code> object manages and handles Actions ({@link cc.action.Action}).
     * Each <code>Scene</code> has an instance for managing its nodes Actions, and each <code>Director</code> has
     * another instance for handling Scene <code>Transitions</code> ({@link cc.transition.Transition}).
     * <br>
     * The ActionManager has a virtual timeline fed by Directors or Scenes.
     * On average, no direct interaction with this class will happen.
     * <br>
     * This class also offers a new API interface for adding actions to a Node. For example:
     *
     * <pre>
     * am.startChainingActionsForNode(n0).
     *        actionSequence().
     *            setRepeatForever().
     *            actionRotate().
     *                to(360).
     *                setRelative(true).
     *                setDuration(1000).
     *            actionSequence().
     *                actionScale().
     *                    to({ x: .5, y: .5 }).
     *                    setRelative(true).
     *                    setDuration(1500).
     *                actionRotate().
     *                    to(0).
     *                    setRelative(true).
     *                    setDuration(1500).
     *            endSequence().
     * </pre>
     *
     */
    export class ActionManager {

        /**
         * Collection of pairs of Node-Action to execute.
         * @member cc.action.ActionManager#_actionInfos
         * @type {Array<cc.action.ActionInfo>}
         * @private
         */
        _actionInfos:Array<ActionInfo> = [];

        constructor() {
        }

        /**
         * Associate a target with an action.
         * This method is useful when you pretend to reuse predefined behavior objects.
         * @method cc.action.ActionManager#scheduleActionForNode
         * @param target {cc.node.Node}
         * @param action {cc.action.Action}
         * @returns {ActionInfo}
         */
        scheduleActionForNode(target:Node, action:Action):ActionManager {

            var tw = new ActionInfo(this, target);
            tw.action( action );
            this._actionInfos.push(tw);

            return this;
        }

        /**
         * PENDING use binary search.
         * Stop an action for a node with the given tag.
         * @param target {cc.node.Node} node with action.
         * @param tag {string} action tag.
         * @returns {cc.action.ActionManager}
         */
        stopNodeActionByTag( target:Node, tag:string ) : ActionManager {

            for( var i=0; i<this._actionInfos.length; i++ ) {
                if ( this._actionInfos[i]._target===target && this._actionInfos[i]._action._tag===tag ) {
                    this._actionInfos[i].stop();
                }
            }

            return this;
        }

        stopActionsForNode( target:Node ) : ActionManager {

            for( var i=0; i<this._actionInfos.length; i++ ) {
                if ( this._actionInfos[i]._target===target ) {
                    this._actionInfos[i].stop();
                }
            }

            return this;
        }

        /**
         * Start a chaining actions for a Node.
         * @method cc.action.ActionManager#startChainingActionsForNode
         * @param target {cc.node.Node} normally a Node, but could be any other object.
         * @returns {cc.action.ActionInfo}
         */
        startChainingActionsForNode(target:Node):ActionInfo {
            var ai = new ActionInfo(this, target);
            this._actionInfos.push(ai);
            return ai;
        }

        /**
         * Helper method to build a new ActionInfo with basic information.
         * @method cc.action.ActionManager#__newActionInfo
         * @returns {cc.action.ActionInfo}
         * @private
         */
        __newActionInfo() : ActionInfo {
            var ai = new ActionInfo(this, this._actionInfos[ this._actionInfos.length - 1 ]._target);
            this._actionInfos.push(ai);
            return ai;
        }

        /**
         * Execute all scheduled Actions in this ActionManager.
         * The elapsed time is translated into the desired game time units.
         * @see cc.action.TIMEUNITS
         * @method cc.action.ActionManager#step
         * @param elapsedTime {number} milliseconds.
         */
        step(elapsedTime:number):void {

            //elapsedTime/= cc.action.TIMEUNITS;

            var i;
            var someActionsFinished = false;

            // prevent that added actions from callbacks from messing around.
            var len = this._actionInfos.length;

            for (i = 0; i < len; i++) {
                this._actionInfos[i].step(elapsedTime);
                if (this._actionInfos[i].isFinished()) {
                    someActionsFinished = true;
                }
            }

            if (someActionsFinished) {
                var actions = [];
                for (i = 0; i < this._actionInfos.length; i++) {
                    if (!this._actionInfos[i].isFinished()) {
                        actions.push(this._actionInfos[i]);
                    }
                }
                this._actionInfos = actions;
            }
        }

        /**
         * Pause all Actions.
         * @method cc.action.ActionManager#pauseAll
         */
        pauseAll():void {
            for (var i = 0; i < this._actionInfos.length; i++) {
                this._actionInfos[i].pause();
            }
        }

        /**
         * Resume all Paused Actions.
         * @method cc.action.ActionManager#resumeAll
         */
        resumeAll():void {
            for (var i = 0; i < this._actionInfos.length; i++) {
                this._actionInfos[i].resume();
            }
        }

        /**
         * Get the number of scheduled actions (in any state).
         * @method cc.action.ActionManager#getNumActions
         * @returns {number} number of actions.
         */
        getNumActions() : number {
            return this._actionInfos.length;
        }

        /**
         * Get the number of scheduled actions (in any state).
         * @method cc.action.ActionManager#getNumActionsForNode
         * @param node {cc.node.Node} Node to check for actions.
         * @returns {number} number of actions for the Node.
         */
        getNumActionsForNode( node : Node ) : number {

            var count : number = 0;

            for( var i=0; i<this._actionInfos.length; i++ ) {
                if ( this._actionInfos[i]._target===node ) {
                    count++;
                }
            }

            return count;
        }
    }
}