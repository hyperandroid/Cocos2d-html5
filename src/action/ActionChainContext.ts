/**
 * License: see license.txt file
 */

/// <reference path="../node/Node.ts"/>
/// <reference path="./MoveAction.ts"/>
/// <reference path="./JumpAction.ts"/>
/// <reference path="./RotateAction.ts"/>
/// <reference path="./PropertyAction.ts"/>
/// <reference path="./AlphaAction.ts"/>
/// <reference path="./TintAction.ts"/>
/// <reference path="./ScaleAction.ts"/>
/// <reference path="./SequenceAction.ts"/>
/// <reference path="./PathAction.ts"/>

module cc.action {

    /**
     * This function parses an Action based on an initializer object.
     * Initializer objects are just JSON objects which could got from a call to action.getInitializer().
     * @name ParseAction
     * @memberOf cc.action
     * @param actionDef {cc.action.ActionInitializer}
     * @returns {cc.action.Action}
     */
    export function ParseAction( actionDef:ActionInitializer ) : Action {

        if ( cc.action[actionDef.type]!=="undefined" ) {
            var action:Action= new cc.action[actionDef.type]( );
            action.__createFromInitializer(actionDef);
            return action;
        }

        console.log("Error, action initializer w/o type.");
        console.log(JSON.stringify(actionDef, null, 2 ) );

        return null;
    }

    /**
     * @class ActionChainContext
     * @classdesc
     *
     * An ActionChainContext is an object whose only purpose is offer a chainable Action construction API.
     * It keeps track of the last created action and its type. It is a fachade to the last created action for a Node
     * so that calling the chain context methods will forward calls to such Action.
     * It is expected to execute in the context of a cc.node.Node object only.
     * For example, this object allows for an api call like this:
     *
     * <code>
     *     actionSequence().
     *        setRepeatForever().
     *        onEnd( function() {
     *            console.log("end");
     *        }).
     *        actionRotate().
     *            to(180).
     *            setRelative(true).
     *            setDuration(1).
     *        actionScale().
     *            to( {x:0, y:1 }).
     *            setRelative(true).
     *            setDuration(1.5).
     *        actionScale().
     *            to( {x:1, y:1}).
     *            setRelative(true).
     *            setDuration(1.5).
     *        actionTint().
     *            to( {r: -.5, g: -.5, b: -.5 } ).
     *            setRelative(true).
     *            setDuration( 2).
     *    endSequence();
     * </code>
     *
     */
    export class ActionChainContext {

        /**
         * When a call to .then() is made, this property keeps track of the previously built action.
         * @member cc.action.ActionChainContext#_chainAction
         * @type {cc.action.Action}
         * @private
         */
        _chainAction : Action = null;

        /**
         * The current action the chain context methods will forward calls to.
         * @member cc.action.ActionChainContext#_currentAction
         * @type {cc.action.Action}
         * @private
         */
        _currentAction: Action = null;

        /**
         * Stack which tracks how many actionSequence calls have been done.
         * @member cc.action.ActionChainContext#_sequenceStack
         * @type {Array<cc.action.SequenceAction>}
         * @private
         */
        _sequenceStack : SequenceAction[] = [];

        /**
         * Last SequenceAction tracked.
         * @member cc.action.ActionChainContext#_currentSequence
         * @type {cc.action.SequenceAction}
         * @private
         */
        _currentSequence : SequenceAction = null;

        /**
         * Node for which the chain actions are being performed.
         * @name _target
         * @memberof cc.action.ActionChainContext
         * @type {cc.node.Node}
         */

        /**
         * Create a new ActionChainContext object instance.
         * @method cc.action.ActionChainContext#constructor
         * @constructor
         * @param _target {cc.node.Node}
         */
        constructor( public _target:cc.node.Node ) {

        }

        /**
         * Create an Action from a constructor function.
         * If a new SequenceAction is to be build, it will be pushed to the SequenceAction stack.
         * The resulting action will be set as the current chain context Action so that all context calls will be forwarded
         * to this action.
         * @method cc.action.ActionChainContext#__action
         * @param ctor {object} a constructor function
         * @returns {cc.action.ActionChainContext}
         * @private
         */
        __action( ctor ) {

            this.action(<Action>new ctor());

            if ( ctor===cc.action.SequenceAction ) {
                this._sequenceStack.push( <SequenceAction>this._currentAction );
                this._currentSequence= <SequenceAction>this._currentAction;
            }

            return this;
        }

        /**
         * Chain a complete action or an action built form an ActionInitializer object.
         * @method cc.action.ActionChainContext#action
         * @param _currentAction {cc.action.Action|cc.action.ActionInitializer}
         * @returns {cc.action.ActionChainContext}
         */
        action( _currentAction:Action|ActionInitializer ) : ActionChainContext {

            var currentAction:Action;

            if ( _currentAction instanceof cc.action.Action ) {
                currentAction= <Action>_currentAction;
            } else {
                currentAction= cc.action.ParseAction( <ActionInitializer>_currentAction );
            }

            if ( this._currentSequence ) {
                this._currentSequence.addAction(currentAction);
            } else {
                this._target.runAction( currentAction );
            }

            if ( this._chainAction ) {
                currentAction._chainAction= this._chainAction;
                this._chainAction= null;
            }

            this._currentAction= currentAction;

            currentAction.__updateDuration();

            return this;
        }

        /**
         * Start chaining for a new PathAction.
         * @method cc.action.ActionChainContext#actionPath
         * @returns {cc.action.ActionChainContext}
         */
        actionPath() : ActionChainContext {
            return this.__action(cc.action.PathAction);
        }

        /**
         * Start chaining for a new MoveAction.
         * @method cc.action.ActionChainContext#actionMove
         * @returns {cc.action.ActionChainContext}
         */
        actionMove() : ActionChainContext {
            return this.__action(cc.action.MoveAction);
        }

        /**
         * Start chaining for a new RotateAction.
         * @method cc.action.ActionChainContext#actionRotate
         * @returns {cc.action.ActionChainContext}
         */
        actionRotate() : ActionChainContext {
            return this.__action(cc.action.RotateAction);
        }

        /**
         * Start chaining for a new PropertyAction.
         * @method cc.action.ActionChainContext#actionProperty
         * @returns {cc.action.ActionChainContext}
         */
        actionProperty() : ActionChainContext {
            return this.__action(cc.action.PropertyAction);
        }

        /**
         * Start chaining for a new AlphaAction.
         * @method cc.action.ActionChainContext#actionAlpha
         * @returns {cc.action.ActionChainContext}
         */
        actionAlpha() : ActionChainContext {
            return this.__action(cc.action.AlphaAction);
        }

        /**
         * Start chaining for a new TintAction.
         * @method cc.action.ActionChainContext#actionTint
         * @returns {cc.action.ActionChainContext}
         */
        actionTint() : ActionChainContext {
            return this.__action(cc.action.TintAction);
        }

        /**
         * Start chaining for a new ScaleAction.
         * @method cc.action.ActionChainContext#actionScale
         * @returns {cc.action.ActionChainContext}
         */
        actionScale() : ActionChainContext {
            return this.__action(cc.action.ScaleAction);
        }

        /**
         * Start chaining for a new SequenceAction.
         * @method cc.action.ActionChainContext#actionSequence
         * @returns {cc.action.ActionChainContext}
         */
        actionSequence() : ActionChainContext {
            return this.__action(cc.action.SequenceAction);
        }


        /**
         * End a Sequence Action context.
         * This will pop the latest Sequence from the stack.
         * If the stack gets empty, actions will be added in the context of the Target node, and not the sequence.
         * @method cc.action.ActionChainContext#endSequence
         * @returns {cc.action.ActionChainContext}
         */
        endSequence() : ActionChainContext {

            if ( this._sequenceStack.length ) {
                this._sequenceStack.pop();
                if ( this._sequenceStack.length ) {
                    this._currentSequence = this._sequenceStack[ this._sequenceStack.length-1 ];
                } else {
                    this._currentSequence = null;
                }

                this._currentAction= this._currentSequence;
            }

            return this;
        }

        /**
         * Set action 'from' value for the current action.
         * @method cc.action.ActionChainContext#from
         * @param obj {object} the value to set for 'from' action property.
         * @returns {cc.action.ActionChainContext}
         */
        from( obj:any ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.from(obj);
            }
            return this;
        }

        /**
         * Set action 'to' value for the current action.
         * @method cc.action.ActionChainContext#from
         * @param obj {object} the value to set for 'from' action property.
         * @returns {cc.action.ActionChainContext}
         */
        to( obj:any ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.to(obj);
            }
            return this;
        }

        /**
         * Set action interpolator value for the current action.
         * @method cc.action.ActionChainContext#setInterpolator
         * @param i {cc.action.TimeInterpolator} a interpolator (easing function).
         * @returns {cc.action.ActionChainContext}
         */
        setInterpolator( i:cc.action.TimeInterpolator ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setInterpolator(i);
            }
            return this;
        }

        /**
         * Set action as relative.
         * @method cc.action.ActionChainContext#setRelative
         * @param b {boolean}
         * @returns {cc.action.ActionChainContext}
         */
        setRelative( b:boolean ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setRelative(b);
            }
            return this;
        }

        /**
         * Set action duration.
         * @method cc.action.ActionChainContext#setDuration
         * @param d {number}
         * @returns {cc.action.ActionChainContext}
         */
        setDuration( d:number ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setDuration(d);
            }
            return this;
        }

        /**
         * Set action repetition forever.
         * @method cc.action.ActionChainContext#setRepeatForever
         * @param obj {cc.action.RepeatTimesOptions=} some repetition attributes.
         * @returns {cc.action.ActionChainContext}
         */
        setRepeatForever(obj?:cc.action.RepeatTimesOptions) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setRepeatForever(obj);
            }
            return this;
        }

        /**
         * Set action repetition times.
         * @method cc.action.ActionChainContext#setRepeatTimes
         * @param n {number} repetition count
         * @returns {cc.action.ActionChainContext}
         */
        setRepeatTimes(n:number) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setRepeatTimes(n);
            }
            return this;
        }

        /**
         * Chain two actions. After a call to then, any of the actionXXX methods should be called. The newly
         * created action will be chained with the current one. Chain means that will start when the preivous ends.
         * @method cc.action.ActionChainContext#then
         * @returns {cc.action.ActionChainContext}
         */
        then() : ActionChainContext {
            this._chainAction= this._currentAction;
            return this;
        }

        /**
         * Set duration and interpolator into in one call.
         * @method cc.action.ActionChainContext#timeInfo
         * @param delay {number} delay before application
         * @param duration {number} action duration in time units.
         * @param interpolator {cc.action.TimeInterpolator=} optional interpolator
         * @returns {cc.action.ActionChainContext}
         */
        timeInfo(delay:number, duration:number, interpolator?:cc.action.TimeInterpolator) : ActionChainContext {
            this._currentAction.timeInfo( delay, duration, interpolator );

            return this;
        }

        /**
         * Set action onEnd callback.
         * @method cc.action.ActionChainContext#onEnd
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onEnd( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onEnd(f);
            }
            return this;
        }

        /**
         * Set action onStart callback.
         * @method cc.action.ActionChainContext#onStart
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onStart( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onStart(f);
            }
            return this;
        }

        /**
         * Set action onRepeat callback.
         * @method cc.action.ActionChainContext#onRepeat
         * @param f {cc.action.ActionCallbackRepeatCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onRepeat( f:ActionCallbackRepeatCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onRepeat(f);
            }
            return this;
        }

        /**
         * Set action onPause callback.
         * @method cc.action.ActionChainContext#onPause
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onPause( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onPause(f);
            }
            return this;
        }

        /**
         * Set action onResume callback.
         * @method cc.action.ActionChainContext#onResume
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onResume( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onResume(f);
            }
            return this;
        }

        /**
         * Set action onApply callback.
         * @method cc.action.ActionChainContext#onApply
         * @param f {cc.action.ActionCallbackApplicationCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onApply( f:ActionCallbackApplicationCallback) {
            if ( this._currentAction ) {
                this._currentAction.onApply(f);
            }
            return this;
        }

        /**
         * If the current action is a sequence, set the Sequence as sequential or spawn.
         * @method cc.action.ActionChainContext#setSequential
         * @param b {boolean}
         * @returns {cc.action.ActionChainContext}
         */
        setSequential( b:boolean ) {
            if ( (<any>this._currentAction).setSequential ) {
                (<any>this._currentAction).setSequential(b);
            }

            return this;
        }
    }

}