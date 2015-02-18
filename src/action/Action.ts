/**
 * License: see license.txt file.
 */


/// <reference path="../node/Node.ts"/>
/// <reference path="./TimeInterpolator.ts"/>
/// <reference path="./ActionManager.ts"/>
/// <reference path="./ActionChainContext.ts"/>


module cc.action {

    /**
     * This value is a time unit divisor constant.
     * CocosJS expects all time units to be in seconds, hence the default value of 1000.
     * But you could easily change time unit values to milliseconds, changing this value to 1, and setting all
     * actions/scheduler time units in millis.
     *
     * @member cc.action.TIMEUNITS
     * @type {number}
     */
    export var TIMEUNITS:number= 1000;

    var SECONDS:number= 1000;
    var MILLISECONDS:number= 1;

    export function setTimeReferenceInSeconds() { cc.action.TIMEUNITS= SECONDS; }
    export function setTimeReferenceInMillis() { cc.action.TIMEUNITS=  MILLISECONDS; }

    "use strict";


    /**
     * Callback definition for Action Apply event.
     * @memberOf cc.action
     * @callback ActionCallbackApplicationCallback
     * @param action {cc.action.Action} Executed Action.
     * @param target: {cc.node.Node} Node the Action applied to.
     * @param value: {Object} Current Node property value set.
     */

    /**
     * Callback definition for Action Start, End, Pause and Resume events.
     * @memberOf cc.action
     * @callback ActionCallbackStartOrEndOrPauseOrResumeCallback
     * @param action {cc.action.Action} Executed Action.
     * @param target: {cc.node.Node} Node the Action applied to.
     */

    /**
     * Callback definition for Action Repeat event.
     * @memberOf cc.action
     * @callback ActionCallbackRepeatCallback
     * @param action {cc.action.Action} Executed Action.
     * @param target: {cc.node.Node} Node the Action applied to.
     * @param repetitionCount {number} Current repetition count.
     */

    import Node= cc.node.Node;
    import TimeInterpolator= cc.action.TimeInterpolator;
    import ActionInfo= cc.action.ActionInfo;

    /**
     * Action internal states.
     * <br>
     * Status diagram is:
     *
     * <pre>
     *
     * CREATED ---> RUNNING ---> PAUSED <---> RESUMED
     *    ^          |  ^                           |
     *    |          |  |                           |
     *    |          |  +---------------------------+
     *    |          v
     *    +------> ENDED
     *
     * </pre>
     *
     * @tsenum cc.action.ActionStates
     */
    export enum ActionStates {
        PAUSED = 1,
        RUNNING = 2,
        CREATED = 3,
        ENDED = 4,
        RESUMED = 5
    }

    export interface ActionCallbackStartOrEndOrPauseOrResumeCallback {
        (action:Action, target:Node) : void;
    }

    export interface ActionCallbackRepeatCallback {
        (action:Action, target:Node, repetitionCount:number) : void;
    }

    export interface ActionCallbackApplicationCallback {
        (action:Action, target:Node, value:any) : void;
    }

    /**
     * @class cc.action.RepeatTimesOptions
     * @interface
     * @classdesc
     * Callback definition for Action application repetition events.
     */
    export interface RepeatTimesOptions {

        /**
         * Optional Action after application delay time.
         * @member cc.action.RepeatTimesOptions#withDelay
         * @type {number}
         */
        withDelay? : number;
    }

    /**
     * @class cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * This object describes a base Action initializer object.
     */
    export interface ActionInitializer {

        /**
         * Action type. A cc.action constructor function name.
         * Type is necessary when deserializing Actions.
         * @member cc.action.ActionInitializer#type
         * @type {string=}
         */
        type? : string;

        /**
         * Action duration. The value must be in the correct Time units.
         * @member cc.action.ActionInitializer#duration
         * @type {number}
         */
        duration? : number;

        /**
         * Action before-application delay. The value must be in the correct Time units.
         * @member cc.action.ActionInitializer#delayBefore
         * @type {number}
         */
        delayBefore? : number;

        /**
         * Action after-application delay. The value must be in the correct Time units.
         * @member cc.action.ActionInitializer#delayAfter
         * @type {number}
         */
        delayAfter? : number;

        /**
         * Start alpha value.
         * @member cc.action.ActionInitializer#interpolator
         * @type {cc.action.InterpolatorInitializer=}
         */
        interpolator? : InterpolatorInitializer;

        /**
         * Start alpha value.
         * @member cc.action.ActionInitializer#from
         * @type {any=}
         */
        from? : any;

        /**
         * End alpha value.
         * @member cc.action.ActionInitializer#to
         * @type {any}
         */
        to? : any;

        /**
         * Make the action relative.
         * @member cc.action.ActionInitializer#relative
         * @type {boolean=}
         */
        relative? : boolean;

        /**
         * Set repetition count.
         * @member cc.action.ActionInitializer#repeatTimes
         * @type {number=}
         */
        repeatTimes? : number;

        /**
         * Set reversed action.
         * @member cc.action.ActionInitializer#reversed
         * @type {boolean=}
         */
        reversed? : boolean;
    }


    /**
     *
     *  @class cc.action.Action
     *  @classdesc
     *
     * Actions are scheduled objects that modify a node's internal state.
     * For example, schedule a rotation from 0 to 360 degrees, scale from to twice a node's size, or a combination of
     * both.
     * <br>
     * cc.action.Action is an abstract class, and won't affect any target. This Class type must be subclassed.
     * <br>
     *
     * Actions are defined by the following elements:
     *
     *  <li>duration. How long the action will take to end.
     *  <li>delay before application. How long the action will take to start applying.
     *  <li>delay after application. How long the action will take to end after it ended modifying node's properties.
     *  <li>lifecycle. An action has callback functions for: start, pause, resume, end and repeat.
     *  <li>speed. An action has speed modifiers. if an action has speed 2, will take twice the time to execute.
     *  <li>interpolators. An action can have modifiers for time application, like easing functions or curve segments.
     *  <li>relativity. An action can be applied relative to a value, instead of absolutely. For example, rotate by an
     *     angle instead of rotate to.
     *  <li>From. Start values for action application.
     *  <li>To. End values for action application.
     *  <li>Reversability: an action can be set to be played backwards. This is accomplished not by modifying the action
     *      but by modifiying the Interpolator that transforms time into property values.
     *
     * Predefined actions exist for the following node's properties:
     *
     *  <li>AlphaAction. Modifies a node's transparency values.
     *  <li>MoveAction. Modifies a node's position by traversing a straight line.
     *  <li>PathAction. Modifies a node's position by traversing a complex path.
     *  <li>RotateAction. Modifies a node's rotation angle.
     *  <li>ScaleAction. Modifies a node's scale.
     *  <li>TintAction. Modifies a node's color. This action will only have a visible result when the node is rendered
     *      using WebGL.
     *  <li>SequenceAction. Allows for action sequencing and parallelization.
     *  <li>PropertyAction. Allows for modification of a node's arbitrary property.
     *
     * There are other type of actions that affect or create a mix of different node properties modification like:
     *
     *  <li>BlinkAction
     *  <li>JumpAction
     *
     *  The current V4 action subsystem is a complete rebuild from the ground up. Although backwards compatible with
     *  Cocos2d HTML5's V2 and V3 action system, this new implementation offers the following features:
     *
     *  <li>Consistent Action naming: easeExponentialIn vs easeQuinticActionIn .
     *  <li>Simplification of cc namespace. From 150+ action objects to a few.
     *  <li>Reduced code complexity.
     *  <li>Offer a new more js-ish code convention via chaining of method calls.
     *  <li>Change concept of easing action. Easing is a property of an Action's time.
     *  <li>Reduce overly class-extension hierarchy from version 2 and 3
     *  <li>Full action lifecycle: START, END, PAUSE, RESUME, REPEAT.
     *
     */
    export class Action {

        /**
         * Default tag value.
         * @member cc.action.Action#DEFAULT_TAG
         * @type {string}
         * @static
         */
        static DEFAULT_TAG:string = "";

        /**
         * Delay to start applying the Action.
         * @member cc.action.Action#_startTime
         * @type {number}
         * @private
         */
        _startTime:number = 0;

        /**
         * Action duration (in seconds). For how long the Action takes to get to the final application result.
         * @member cc.action.Action#_duration
         * @type {number}
         * @private
         */
        _duration:number = 0;

        /**
         * Currently elapsed time.
         * @member cc.action.Action#_currentTime
         * @type {number}
         * @private
         */
        _currentTime:number = 0;

        /**
         * Number of repeat times. 1 by default.
         * @member cc.action.Action#_repeatTimes
         * @type {number}
         * @private
         */
        _repeatTimes:number = 1;

        /**
         * Current repetition count.
         * @member cc.action.Action#_currentRepeatCount
         * @type {number}
         * @private
         */
        _currentRepeatCount:number = 0;

        /**
         * Action speed. Actual Action duration is: ( (_duration + _delayAfterApplication) * _times) / _speed
         * @type {number}
         * @private
         */
        _speed:number = 1;

        /**
         * An action identifier. Defaults to @see(Action.DEFAULT_TAG).
         * @member cc.action.Action#_tag
         * @type {number}
         * @private
         */
        _tag:string = Action.DEFAULT_TAG;

        /**
         * Action status.
         *
         * Status diagram:
         *
         * <pre>
         *
         * CREATED ---> RUNNING ---> PAUSED <---> RESUMED
         *    ^          |  ^                           |
         *    |          |  |                           |
         *    |          |  +---------------------------+
         *    |          v
         *    +------> ENDED
         *
         * </pre>
         *
         * @member cc.action.Action#_status
         * @type {cc.action.ActionStates}
         * @private
         */
        _status:ActionStates = ActionStates.CREATED;

        /**
         * On start application callback. Called when the Action is first executed.
         * @member cc.action.Action#_onStart
         * @type {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @private
         */
        _onStart:ActionCallbackStartOrEndOrPauseOrResumeCallback = null;

        /**
         * On end application callback. Fired each time the Action ends applying.
         * This callback may not be called if _repeatTimes is set too high or is playing forever.
         * @member cc.action.Action#_onEnd
         * @type {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @private
         */
        _onEnd:ActionCallbackStartOrEndOrPauseOrResumeCallback = null;

        /**
         * On repeat application callback. Fired each time the action is repeated.
         * @member cc.action.Action#_onRepeat
         * @type {cc.action.ActionCallbackRepeatCallback}
         * @private
         */
        _onRepeat:ActionCallbackRepeatCallback = null;

        /**
         * On application callback. Fired each time the action is applied. this callback can be called many times
         * during the action life cycle.
         * @member cc.action.Action#_onApply
         * @type {cc.action.ActionCallbackApplicationCallback}
         * @private
         */
        _onApply:ActionCallbackApplicationCallback = null;

        /**
         * On pause callback. Fired each time the action is paused. this callback can be called many times
         * during the action life cycle.
         * @member cc.action.Action#_onPause
         * @type {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @private
         */
        _onPause:ActionCallbackStartOrEndOrPauseOrResumeCallback = null;

        /**
         * On resume callback. Fired each time the action is resumed. this callback can be called many times
         * during the action life cycle.
         * @member cc.action.Action#_onResume
         * @type { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @private
         */
        _onResume:ActionCallbackStartOrEndOrPauseOrResumeCallback = null;

        /**
         * Interpolation/Ease function application
         * @member cc.action.Action#_interpolator
         * @type {cc.action.TimeInterpolator}
         * @private
         */
        _interpolator:TimeInterpolator = null;

        /**
         * if the from values for an Action have not been set, a call to __setInitialValues with
         * the target as parameter to have them set.
         * @member cc.action.Action#_fromValuesSet
         * @type {boolean}
         * @private
         */
        _fromValuesSet:boolean = false;

        /**
         * Flag for executing onStart callback. Do not use or modify.
         * @member cc.action.Action#_firstExecution
         * @type {boolean}
         * @private
         */
        _firstExecution:boolean = true;

        /**
         * This delay will be applied after each application.
         * @member cc.action.Action#_delayAfterApplication
         * @type {number}
         * @private
         */
        _delayAfterApplication:number = 0;

        /**
         * This delay will be applied before each application.
         * @member cc.action.Action#_delayBeforeApplication
         * @type {number}
         * @private
         */
        _delayBeforeApplication:number = 0;

        /**
         * Action owner ie the ActionManager this Action executes in.
         * @member cc.action.Action#_owner
         * @type {cc.action.ActionManager}
         * @private
         */
        //_owner:ActionManager = null;

        /**
         * Reference for a chained action. Do not use or modify.
         * @member cc.action.Action#_chainAction
         * @type {cc.action.Action}
         * @private
         */
        _chainAction:Action = null;

        /**
         * If true, the actions must be ActionBy variations.
         * @member cc.action.Action#_relativeAction
         * @type {boolean}
         * @private
         */
        _relativeAction:boolean = false;

        /**
         * Is the action reversed ?
         * A reversed action will be applied from end to begin.
         * @member cc.action.Action#_reversedTime
         * @type {boolean}
         * @private
         */
        _reversedTime:boolean = false;

        /**
         * If this Action belongs to a SequenceAction this variable will be its parent sequence.
         * @member cc.action.Action#_parentSequence
         * @type {cc.action.SequenceAction}
         * @private
         */
        _parentSequence:SequenceAction = null;

        _reversed : boolean = false;

        _chainContext : cc.action.ActionChainContext = null;

        /**
         * Build an Action instance.
         * This type of objects must augmented.
         * @constructor
         * @method cc.action.Action#constructor
         */
        constructor( initializer?:ActionInitializer ) {
            if ( initializer ) {
                this.__createFromInitializer( initializer );
            }
        }

        __createFromInitializer(initializer?:ActionInitializer ) {
            if ( typeof initializer!=="undefined" ) {
                if ( typeof initializer.relative!=='undefined' ) {
                    this.setRelative( initializer.relative );
                }
                if ( typeof initializer.duration!=='undefined' ) {
                    this.setDuration( initializer.duration );
                }
                if ( typeof initializer.delayBefore!=='undefined' ) {
                    this.setDelay( initializer.delayBefore );
                }
                if ( typeof initializer.delayAfter!=='undefined' ) {
                    this.setDelayAfterApplication( initializer.delayAfter );
                }
                if ( typeof initializer.interpolator!=="undefined" ) {
                    this.setInterpolator( cc.action.ParseInterpolator( initializer.interpolator ) );
                }
                if ( typeof initializer.from!=="undefined" ) {
                    if ( this.from ) {
                        this.from( initializer.from );
                    }
                }
                if ( typeof initializer.to!=="undefined" ) {
                    if ( this.to ) {
                        this.to( initializer.to );
                    }
                }
                if ( typeof initializer.repeatTimes!=="undefined" ) {
                    this.setRepeatTimes(initializer.repeatTimes);
                }
                if ( typeof initializer.reversed!=="undefined" ) {
                    this._reversed= initializer.reversed;
                }
            }
        }

        /**
         * Set an arbitrary tag for an Action.
         * @method cc.action.Action#setTag
         * @param tag {string} a string composed only of [A-Za-z0-9_-]
         * @returns {cc.action.Action}
         */
        setTag(tag:string):Action {
            this._tag = tag;
            return this;
        }

        /**
         * Update an Action's target node.
         * This function must be overriden by Action subclass Objects.
         * @method cc.action.Action#update
         * @param normalizedTime {number} value between 0 and 1.
         * @param target {cc.node.Node} node instance the action will be applied for.
         *
         * @returns {Object} a value descriptive for the action type. For example, ScaleAction will return an object with
         * the scale applied, and MoveAction a <code>cc.math.Vector</code> with node's set position.
         */
        update(normalizedTime:number, target:Node):any {

        }

        /**
         * Set an Action's duration. Duration is in milliseconds.
         * @method cc.action.Action#setDuration
         * @param duration {number}
         */
        setDuration(duration:number):Action {
            this._duration = duration*TIMEUNITS;
            this.__updateDuration();
            return this;
        }

        /**
         * Set an action's pre application delay.
         * An action will take this milliseconds to start applying values in a node.
         * @method cc.action.Action#setDelay
         * @param d {number} milliseconds.
         * @returns {cc.action.Action}
         */
        setDelay(d:number):Action {
            this._delayBeforeApplication = d*TIMEUNITS;
            this.__updateDuration();
            return this;
        }

        /**
         * Update this Action's duration.
         * This must be done when a sub Action is updated or when delay times or duration itself have changed.
         * @method cc.action.Action#__updateDuration
         * @private
         */
        __updateDuration() {

            this._startTime = this._delayBeforeApplication + (this._chainAction ? this._chainAction._startTime + this._chainAction.getDuration() : 0);
            if (this._parentSequence) {
                this._parentSequence.__updateDuration();
            }
        }

        /**
         * Restart an action's application.
         * Status gets back to CREATED.
         * First execution set to true.
         * Application times count set to 0.
         * @method cc.action.Action#restart
         * @returns {cc.action.Action}
         */
        restart():Action {
            this._firstExecution = true;
            this._currentRepeatCount = 0;
            this._status = ActionStates.CREATED;
            this._currentTime= 0;
            return this;
        }

        /**
         * Get an action's current State.
         * @method cc.action.Action#getStatus
         * @returns {cc.action.ActionStates}
         */
        getStatus():ActionStates {
            return this._status;
        }

        /**
         * Get an action's application speed.
         * Speed values modify an action duration.
         * A speed value of 2 will make the action to take twice the time to execute.
         * @method cc.action.Action#getSpeed
         * @returns {number}
         */
        getSpeed():number {
            return this._speed;
        }

        /**
         * Set an action's application speed.
         * @method cc.action.Action#setSpeed
         * @param speed {number}
         * @returns {cc.action.Action}
         */
        setSpeed(speed:number):Action {
            this._speed = speed;
            return this;
        }

        /**
         * Make this action repeat a finite number of timer.
         * 0 repeatTimes means repeat forerver.
         * @method cc.action.Action#setRepeatTimes
         * @param repeatTimes {number}
         * @param obj {RepeatTimesOptions}
         * @return Action
         */
        setRepeatTimes(repeatTimes:number, obj?:RepeatTimesOptions):Action {
            this._repeatTimes = repeatTimes;
            this._delayAfterApplication = (obj && obj.withDelay*TIMEUNITS) || 0;
            return this;
        }

        /**
         * Set this action to apply forever.
         * @method cc.action.Action#setRepeatForever
         * @param obj {RepeatTimesOptions}
         * @returns {cc.action.Action}
         */
        setRepeatForever(obj?:RepeatTimesOptions):Action {
            return this.setRepeatTimes(Number.MAX_VALUE, obj);
        }

        /**
         *
         * @method cc.action.Action#repeatForever
         * @deprecated
         * @returns {Action}
         */
        repeatForever() {
            return this.setRepeatForever();
        }

        /**
         * Register a callback notification function fired whenever the Action starts applying.
         * @method cc.action.Action#onStart
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @returns {cc.action.Action}
         */
        onStart(callback:ActionCallbackStartOrEndOrPauseOrResumeCallback):Action {
            this._onStart = callback;
            return this;
        }

        /**
         * Register a callback notification function fired whenever the action expires applying.
         * If repeats forever, will never be called.
         * @method cc.action.Action#onEnd
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @return Action
         */
        onEnd(callback:ActionCallbackStartOrEndOrPauseOrResumeCallback):Action {
            this._onEnd = callback;
            return this;
        }

        /**
         * Register a callback notification function fired whenever the action repeats.
         * BUGBUG if setRepeatForever is not fired.
         * @method cc.action.Action#onRepeat
         * @param callback { cc.action.ActionCallbackRepeatCallback }
         * @return Action
         */
        onRepeat(callback:ActionCallbackRepeatCallback):Action {
            this._onRepeat = callback;
            return this;
        }

        /**
         * Register a callback notification function fired whenever the action applies.
         * The action applies once per frame, and allows for getting values that have been set on the node.
         * @method cc.action.Action#onApply
         * @param callback { cc.action.ActionCallbackApplicationCallback }
         * @return Action
         */
        onApply(callback:ActionCallbackApplicationCallback):Action {
            this._onApply = callback;
            return this;
        }

        /**
         * Register a callback notification function fired whenever the action is paused.
         * @method cc.action.Action#onPause
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @return Action
         */
        onPause(callback:ActionCallbackStartOrEndOrPauseOrResumeCallback):Action {
            this._onPause = callback;
            return this;
        }

        /**
         * Register a callback notification function fired whenever the action is resumed, that it, exits the
         * paused state.
         * @method cc.action.Action#onResume
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @return Action
         */
        onResume(callback:ActionCallbackStartOrEndOrPauseOrResumeCallback):Action {
            this._onResume = callback;
            return this;
        }

        /**
         * Pause this action.
         * @method cc.action.Action#pause
         * @param target {Node=}
         * @returns Action
         */
        pause(target?:Node) {
            this._status = ActionStates.PAUSED;
            if (this._onPause) {
                this._onPause(this, target);
            }
            return this;
        }

        /**
         * Resume this action.
         * @method cc.action.Action#resume
         * @returns Action
         */
        resume():Action {
            if (this._status === ActionStates.PAUSED) {
                this._status = ActionStates.RESUMED;
            }
            return this;
        }

        /**
         * Get time to wait after action application to repeat.
         * This time will be spent even if repeat count is 1.
         * @method cc.action.Action#getDelayAfterApplication
         * @returns {number}
         */
        getDelayAfterApplication():number {
            return this._delayAfterApplication;
        }

        /**
         * Set time to wait after action application to repeat.
         * This time will be spent even if repeat count is 1.
         * @method cc.action.Action#setDelayAfterApplication
         * @param d {number} milliseconds to wait after application.
         * @returns {cc.action.Action}
         */
        setDelayAfterApplication(d:number):Action {
            this._delayAfterApplication = d*TIMEUNITS;
            return this;
        }

        /**
         * Get this action's delay time to start applying.
         * @method cc.action.Action#getDelay
         * @returns {number}
         */
        getDelay():number {
            return this._startTime;
        }

        /**
         * Changes default interpolator to another instance of @link{cc.action.TimeInterpolator}.
         * @method cc.action.Action#setInterpolator
         * @param interpolator {cc.action.TimeInterpolator}
         * @returns Action
         */
        setInterpolator(interpolator:TimeInterpolator):Action {
            this._interpolator = interpolator;
            return this;
        }

        /**
         * Convert time into a normalized value in the range of the application duration.
         * The values will converted, so that 0 will be just after starting each repetition,
         * and 1 will be just the end of the Action, or the end of each repetition.
         * @method cc.action.Action#__normalizeTime
         * @param time {number}
         * @private
         */
        __normalizeTime(time:number):number {

            // still, initial delay time has not elapsed.
            if (time < this._startTime) {
                time = 0;
            } else {

                time = time - this._startTime;

                if (time >= this.getDuration()) {

                    time = 1;
                } else {
                    time %= this.getOneRepetitionDuration();

                    // time is in duration range
                    if (time < this._duration) {
                        time /= this._duration;
                    } else {
                        // time is in _delayAfterApplicationRange
                        time = 1;
                    }
                }
            }

            if (this._reversedTime) {
                time = 1 - time;
            }

            if (!this._interpolator) {
                return time;
            }
            return this._interpolator(time);
        }

        /**
         * Get whole action duration. Takes into account action speed, duration, delayAfterApplication and repetition times.
         * @method cc.action.Action#getDuration
         * @returns {number}
         */
        getDuration():number {
            return this.getOneRepetitionDuration() * this._repeatTimes;
        }

        /**
         * Calculate one repetition duration.
         * @method cc.action.Action#getOneRepetitionDuration
         * @returns {number}
         */
        getOneRepetitionDuration():number {
            return ( this._duration + this._delayAfterApplication );
        }

        /**
         * Chekcs whether the action is applicable.
         * In case it gets out of scene time, and has not been tagged as expired, the action is expired and observers
         * are notified about that fact.
         * @method cc.action.Action#__isActionApplicable
         * @param time {number} the scene time to check the action against.
         * @return {boolean} whether the action is applicable.
         */
        __isActionApplicable(time:number):boolean {

            // not correct status
            if (this._status === ActionStates.PAUSED || this._status === ActionStates.ENDED) {
                return false;
            }

            // still not in time
            return this._repeatTimes===Number.MAX_VALUE ||
                (time >= this._startTime && time < this._startTime + this.getDuration());
        }

        /**
         * This method must no be called directly.
         * The director loop will call this method in order to apply node actions.
         * @method cc.action.Action#step
         * @param delta {number} elapsed time since last application.
         * @param node {cc.node.Node}  node the action is being applied to.
         */
        step(delta:number, node:any):void {

            delta*= cc.action.TIMEUNITS;

            this._currentTime += delta * this._speed;

            this.__stepImpl(delta, this._currentTime, node);
        }

        /**
         * Actual step implementation.
         * @method cc.action.Action#__stepImpl
         * @param delta {number} elapsed time since last application.
         * @param time {number} Action accumulated time.
         * @param node {cc.node.Node} target to apply action to.
         * @private
         */
        __stepImpl(delta:number, time:number, node:any):void {


            // if an action is not ended, it has the chance of updating value
            if ( this._status!==ActionStates.ENDED ) {

                // actions can be paused w/o even been started.
                if (this._status === ActionStates.RESUMED) {
                    if (this._onResume) {
                        this._onResume(this, node);
                    }
                }


                // if the action is not ended, but can be executed due to time
                if (this.__isActionApplicable(time)) {
                    this.__actionApply(time, node);
                } else {

                    // if the action is expired, ie, current time is beyong the start and duration
                    if (time >= this._startTime + this.getDuration()) {

                        // apply for final state anyway
                        this.__actionApply(time, node);
                        // set the action as ENDED
                        this.stop(node);
                    }
                }
            }
        }

        /**
         * When an action is in time, and able to be applied to a target, this method does all the necessary steps.
         * Do not call directly.
         * @method cc.action.Action#__actionApply
         * @param time {number} current action's application time.
         * @param node {cc.node.Node} target node.
         * @private
         */
        __actionApply(time:number, node:any) {


            // manage first execution. it gives the chance to the Action of initializing with the target node
            if (this._firstExecution) {

                // callback for onStart. only once. from now on, the action is not first_execution
                if (this._onStart) {
                    this._onStart(this, node);
                }

                this._firstExecution = false;

                // initialize with the target before updating its values.
                this.initWithTarget(node);
            }

            // current status RUNNING
            this._status = ActionStates.RUNNING;

            // normalize the time, transform current time to a value in the range 0..1 proportionally to the
            // action length, start time, etc. it also applies the easing (if any).
            var ntime = this.__normalizeTime(time);

            // update target
            var v = this.update(ntime, node);

            // application callback. called each time the node has changed properties.
            if (this._onApply) {
                this._onApply(this, node, v);
            }

            this.__checkRepetition( time, node );
        }

        __checkRepetition( time, node ) {

            // if this is a repeating action
            if (this._repeatTimes !== 1) {

                // calculate current repetition value
                var repeatIndex = ((time - this._startTime) / this.getOneRepetitionDuration()) >> 0;

                // if changed
                if (repeatIndex !== this._currentRepeatCount) {
                    if (repeatIndex > this._repeatTimes) {
                        repeatIndex = this._repeatTimes;
                    }
                    this._currentRepeatCount = repeatIndex;

                    // callback about repetition
                    if (this._onRepeat) {
                        this._onRepeat(this, node, repeatIndex);
                    }
                }
            }

        }

        /**
         * Pass in the target node this action will act on.
         * This method must be overriden by each action type.
         * @method cc.action.Action#initWithTarget
         * @param node {cc.node.Node}
         */
        initWithTarget(node:Node):void {
        }

        /**
         * Solve Action first application values.
         * Must be overriden.
         * @method cc.action.Action#solveInitialValues
         * @param node {cc.node.Node}
         */
        solveInitialValues(node:Node) {
        }

        /**
         * End this action immediately. Will call onEnd callback if set.
         * @method cc.action.Action#stop
         * @param node {cc.node.Node=}
         */
        stop(node:Node) {
            this._status = ActionStates.ENDED;

            if (this._onEnd) {
                this._onEnd(this, node);
            }
        }

        /**
         * Is this action finished ?
         * @method cc.action.Action#isFinished
         * @returns {boolean}
         */
        isFinished():boolean {
            return this._status === ActionStates.ENDED;
        }

        /**
         * Is this action paused ?
         * @method cc.action.Action#isPaused
         * @returns {boolean}
         */
        isPaused():boolean {
            return this._status === ActionStates.PAUSED;
        }

        /**
         * Set origin values for the action.
         * This method MUST be overriden and called from the override function.
         * @method cc.action.Action#from
         * @param obj {Object} any object necessary for the action initialization.
         * @returns {cc.action.Action}
         */
        from(obj:any):Action {
            this._fromValuesSet = true;
            return this;
        }

        /**
         * Set destination values for the action.
         * @method cc.action.Action#to
         * @param obj {Object} any object necessary for the action initialization.
         * @returns {cc.action.Action}
         */
        to(obj:any):Action {
            return this;
        }

        /**
         * Shortcut method for setting an action's duration, delay and easing function.
         * @method cc.action.Action#timeInfo
         * @param delay {number} milliseconds to wait for action start.
         * @param duration {number} milliseconds of this action application.
         * @param interpolator {cc.action.TimeInterpolator} a time interpolator interface object.
         * @returns {cc.action.Action}
         */
        timeInfo(delay:number, duration:number, interpolator?:TimeInterpolator):Action {
            this._duration = duration*TIMEUNITS;
            this.setDelay(delay);
            if (typeof interpolator !== "undefined") {
                this._interpolator = interpolator;
            }
            return this;
        }

        /**
         * This method will make actions to be applied relatively instead of absolutely.
         * For example, moveBy will add the position to the current node's position instead of traversing through the
         * path.
         * @method cc.action.Action#setRelative
         * @param relative {boolean} make this action to behave as moveBy
         * @returns {cc.action.MoveAction}
         */
        setRelative(relative:boolean):Action {
            this._relativeAction = relative;
            return this;
        }

        /**
         * @deprecated This method is deprecated because of its semantics. Use createReversed() instead.
         * @method cc.action.Action#reverse
         * @see {cc.action.Action#createReversed}
         */
        reverse():Action {
            return this.createReversed();
        }

        /**
         * Create a new Action which is the reverse of this one.
         * A reverse Action is expected to be the inverse of what it was. In example, getting back from a path,
         * or rotating in the other direction.
         * In this new implementation, a reverse action is just inverting the TimeInterpolation value.
         * @method cc.action.Action#createReversed
         * @returns {cc.action.Action}
         */
        createReversed():Action {
            var action = this.clone();
            return action.setReversed();
        }

        /**
         * Set an action to be its reversed action.
         * This method does not create any new action.
         * @method cc.action.Action#setReversed
         * @returns {cc.action.Action}
         */
        setReversed():Action {

            this._reversed= !this._reversed;
            if (this._interpolator) {
                this._interpolator = this._interpolator.reverse();
            } else {
                this._interpolator = Interpolator.Linear(true,false);
            }
            return this;
        }

        /**
         * Make the actual cloning implementation.
         * This method must be overriden by each action type.
         * @method cc.action.Action#__cloneImpl
         * @returns {cc.action.Action}
         * @private
         */
        __cloneImpl():Action {
            var copy: Action= new Action();
            this.__genericCloneProperties(copy);
            return copy;
        }

        /**
         * Create a copy of an action.
         * @method cc.action.Action#clone
         * @returns {cc.action.Action}
         */
        clone():Action {
            return this.__cloneImpl();
        }

        /**
         * Is action relative.
         * In V2 and V3 language, a relative action corresponds to ActionBy types.
         * Non relative actions are ActionTo types.
         * @method cc.action.Action#isRelative
         * @returns {boolean}
         */
        isRelative():boolean {
            return this._relativeAction;
        }

        /**
         * Copy generic properties when cloning an Action.
         * Action event Callbacks are copied as well.
         * @method cc.action.Action#__genericCloneProperties
         * @param copy {cc.action.Action}
         * @private
         */
        __genericCloneProperties(copy) {
            copy.setInterpolator(this._interpolator).
                setReversedTime(this._reversedTime).
                //__setOwner(this.getOwner()).
                setSpeed(this.getSpeed()).
                setRepeatTimes(this._repeatTimes).
                setRelative(this._relativeAction);

            copy._startTime= this._startTime;
            copy._duration= this._duration;
            copy._delayAfterApplication= this._delayAfterApplication;

            // explictly copy callbacks this way. Sequence overwrites onRepeat.
            copy._onStart= this._onStart;
            copy._onEnd= this._onEnd;
            copy._onApply=this._onApply;
            copy._onRepeat=this._onRepeat;
            copy._onPause=this._onPause;
            copy._onResume=this._onResume;

            copy._reversed = this._reversed;

        }


        /**
         * Backward compatible call.
         * @method cc.action.Action#easing
         * @param i {cc.action.Interpolator} an interpolator/easing function.
         * @returns {cc.action.Action}
         */
        easing(i:TimeInterpolator):Action {
            this.setInterpolator(i);
            return this;
        }

        /**
         * Backward compatible call.
         * @method cc.action.Action#speed
         * @param speed
         * @returns {cc.action.Action}
         * @deprecated Use setSpeed(speed)
         */
        speed(speed:number):Action {
            this._speed *= speed;
            return this;
        }

        /**
         * Is time applied in inverse order ?
         * @method cc.action.Action#isReversedTime
         * @returns {boolean}
         */
        isReversedTime():boolean {
            return this._reversedTime;
        }

        /**
         * Set this action's time to be applied inversely.
         * @method cc.action.Action#setReversedTime
         * @param b {boolean} reverse time ?
         * @returns {cc.action.Action}
         */
        setReversedTime(b:boolean):Action {
            this._reversedTime = b;
            return this;
        }

        __recursivelySetCreatedStatus(target:Node) {
            if ( this._status!==ActionStates.ENDED ) {
                this.update( this._reversed ? 0 : 1,target);
            }
            this._currentTime= 0;
            this._status= ActionStates.CREATED;
            this._firstExecution= true;
        }

        /**
         * Apply this action in a pingpong way.
         * @method cc.action.Action#pingpong
         */
        pingpong() {
            this.setInterpolator( cc.action.Interpolator.Linear( this._reversed, true ) );
        }

        getInitializer() : ActionInitializer {

            var obj:any= {};

            if ( this._delayBeforeApplication ) {
                obj.delayBefore= this._delayBeforeApplication/cc.action.TIMEUNITS;
            }
            if ( this._delayAfterApplication ) {
                obj.delayAfter= this._delayAfterApplication/cc.action.TIMEUNITS;
            }
            obj.duration= this._duration/cc.action.TIMEUNITS;
            obj.relative= this._relativeAction;

            if ( this._repeatTimes!==1 ) {
                obj.repeatTimes = this._repeatTimes;
            }

            if ( this._interpolator ) {
                obj.interpolator= this._interpolator.getInitializer();
            }

            obj.reversed= this._reversed;

            return obj;
        }
    }

}