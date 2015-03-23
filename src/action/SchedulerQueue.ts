/**
 * License: see license.txt file
 */

/// <reference path="./Action.ts"/>
/// <reference path="../node/Node.ts"/>

module cc.action {

    import Action= cc.action.Action;
    import Node= cc.node.Node;

    /**
     * @name SchedulerQueueTaskStatus
     * @memberof cc.action
     * @enum
     * @tsenum
     */
    export enum SchedulerQueueTaskStatus {
        RUNNING = 0,
        PAUSED = 1,
        ENDED = 2
    }

    /**
     * Callback definition for a scheduler task.
     * @memberOf cc.action
     * @callback SchedulerTaskCallback
     * @param delta {number} elsapsed time since last call
     * @param target {object=} target object for which the callback was invoked
     */
    export interface SchedulerTaskCallback {
        (delta:number, target?:any) : void;
    }

    /**
     * @class cc.action.SchedulerQueueTask
     * @classdesc
     *
     * This object represents a Scheduler task.
     * <p>
     * It holds information for an object and a function on that object, as well as time info such as expected
     * repetitions, delay before time count, and the interval between repetitions.
     * <p>
     * It also holds logic for knowing whether the task should be fired or not.
     * A task is fired by calling a function in the context of a target object ie <code>callback.call(target)</code>.
     * <p>
     *     A task without target, will only invoke the callback function.
     */
    export class SchedulerQueueTask {

        /**
         * Target object.
         * @member cc.action.SchedulerQueueTask#_target
         * @type {object}
         * @private
         */
        _target : any;

        /**
         * Fire this callback whenever the elapsed time mets.
         * @member cc.action.SchedulerQueueTask#_callback
         * @type {cc.action.SchedulerTaskCallback}
         * @private
         */
        _callback : any;

        /**
         * wait this milliseconds before account time.
         * @member cc.action.SchedulerQueueTask#_startTime
         * @type {function}
         * @private
         */
        _startTime : number = 0.0;

        /**
         * Custom interval call for a Task
         * @member cc.action.SchedulerQueueTask#_interval
         * @type {number}
         * @private
         */
        _interval : number= 0.0;

        /**
         * Repetition multishot task. Will repeat until paused or cancelled or shot count ends.
         * @member cc.action.SchedulerQueueTask#_repeat
         * @type {number}
         * @private
         */
        _repeat : number;

        /**
         * Time to wait before counting time.
         * @member cc.action.SchedulerQueueTask#_delay
         * @type {number}
         * @private
         */
        _delay : number = 0.0;

        /**
         * Internal task state
         * @member cc.action.SchedulerQueueTask#_status
         * @see {cc.action.SchedulerQueueTaskStatus}
         * @type {cc.action.SchedulerQueueTaskStatus}
         * @private
         */
        _status : SchedulerQueueTaskStatus = null;

        /**
         * Time when the last task repetition was executed.
         * @member cc.action.SchedulerQueueTask#_prevCallbackNotificationTime
         * @type {number}
         * @private
         */
        _prevCallbackNotificationTime : number = 0.0;

        /**
         * Previous task tick time.
         * @member cc.action.SchedulerQueueTask#_prevTime
         * @type {number}
         * @private
         */
        _prevTime : number = 0.0;

        /**
         * Task priority.
         * Tasks are sorted by this value. First in execution will be negative values.
         * @member cc.action.SchedulerQueueTask#_priority
         * @type {number}
         * @private
         */
        _priority : number = 0;

        /**
         * Build a new SchedulerQueueTask instance.
         * @method cc.action.SchedulerQueueTask#constructor
         */
        constructor() {
        }

        /**
         * Execute a task.
         * The execution takes into account whether the task repeats and the interval repetition.
         * @method cc.action.SchedulerQueueTask#step
         * @param currentTime {number} current scheduler time
         * @returns {boolean} whether the task must de deleted.
         */
        step( currentTime:number ) : void {

            // marked as ended or is paused ?, do not execute and delete.
            if ( this._status===SchedulerQueueTaskStatus.ENDED || this._status===SchedulerQueueTaskStatus.PAUSED ) {
                return;
            }

            if ( currentTime>=this._startTime ) {

                // if repeats and interval is not 0 (fire every frame)
                if ( this._repeat>0 && this._interval!==0.0 ) {
                    this.__stepForRepetition( currentTime );
                } else {

                    // either repeats with 0 interval, or is a single shot task
                    this.__doCallback( currentTime - this._prevCallbackNotificationTime );
                    this._prevCallbackNotificationTime= currentTime;

                    // single shot tasks must be recycled
                    if ( !this._repeat ) {
                        this.end();
                    }
                }

            }
        }

        __stepForRepetition( currentTime:number ) {

            // identify whether the task has fired in another interval boundary time
            var shotIndex:number= ((currentTime-this._startTime)/this._interval)|0;
            var prevshotIndex:number= ((this._prevTime-this._startTime)/this._interval)|0;
            if ( shotIndex>prevshotIndex && shotIndex>0 ) {
                //this._prevShotIndex= shotIndex;
                this.__doCallback( currentTime-this._prevCallbackNotificationTime );
                this._prevCallbackNotificationTime= currentTime;
            }
            this._prevTime= currentTime;

            // so the task is expired ?
            if ( currentTime>=this._startTime + this._interval * this._repeat ) {
                // end the task
                this.end();
            }
        }

        /**
         * Invoke the callback.
         * If target is specified for the task<br>
         *    the callback is invoked like: callback.call( target, elapsedTime, target )<br>
         * else<br>
         *    the callback is invoked like: callback(elapsedTime, target);
         *
         * @method cc.action.SchedulerQueueTask#__doCallback
         * @param elapsedTime {number} time between two consecutive task fires.
         * @private
         */
        __doCallback( elapsedTime : number ) {

            if ( null===this._target ) {
                this._callback(elapsedTime, this._target);
            } else {
                this.__doCallCallback(elapsedTime);
            }
        }

        __doCallCallback(elapsedTime:number) {
            this._callback.call( this._target, elapsedTime/cc.action.TIMEUNITS, this._target );
        }

        /**
         * Pause the task. If in this state, the task is not fired.
         * @method cc.action.SchedulerQueueTask#pause
         */
        pause() {
            this._status= SchedulerQueueTaskStatus.PAUSED;
        }

        /**
         * Resume the current task.
         * @method cc.action.SchedulerQueueTask#resume
         */
        resume() {
            this._status= SchedulerQueueTaskStatus.RUNNING;
        }

        /**
         * End the task. Ending turns the task to be elligible for unscheduling and recycling.
         * @method cc.action.SchedulerQueueTask#end
         */
        end() {
            this._status= SchedulerQueueTaskStatus.ENDED;
        }

        /**
         * Whether the task is ended.
         * @method cc.action.SchedulerQueueTask#isEnded
         * @returns {boolean}
         */
        isEnded() : boolean {
            return this._status===SchedulerQueueTaskStatus.ENDED;
        }

        /**
         * Adjust the task time with the Queue time the task is running in.
         * @method cc.action.SchedulerQueueTask#adjustTime
         * @param time {number}
         */
        adjustTime( time:number ) {
            this._startTime= time+ (this._delay||0);
            this._prevCallbackNotificationTime= this._startTime;
        }

    }

    /**
     * @class cc.action.SchedulerQueueUpdateTask
     * @classdesc
     * @extends SchedulerQueueTask
     *
     * This object represents a scheduler task which calls the update method for a given Object, does not have to be
     * a <code>cc.node.Node</code> object.
     *
     * This task type extends a <code>cc.action.SchedulerQueueTask</code> object and only calls the update method,
     * that is, there must be a target object (mandatory at construction) and the callback parameter is omitted.
     * <p>
     * This object makes calling <code>cc.node.Node#scheduleUpdate</code> and then changing the update method safe.
     *
     */
    export class SchedulerQueueUpdateTask extends SchedulerQueueTask {

        constructor() {
            super();
        }

        __doCallCallback(elapsedTime:number) {
            this._target.update.call(this._target, elapsedTime/cc.action.TIMEUNITS, this._target );
        }
    }

    /**
     * @class cc.action.SchedulerQueue
     * @extends cc.action.Action
     * @classdesc
     *
     * <p>
     * A scheduler queue manages a collection of Tasks. The tasks are scheduled for single or multi shot execution and
     * are guaranteed to execute at the closest schedule interval time. Internally, a SchedulerQueue is an Action.
     * <p>
     * A task is composed of a target, a function (which is a function the target object has) and some time data.
     * The scheduler will take no action to control whether the supplied function exists for the target object.
     * <p>
     * If a task already exists with the data supplied to the <code>schedule</code> function the task interval will be
     * updated with the new data supplied.
     * <p>
     * Unscheduled actions are removed in the next tick of execution, but actions that are ended are not executed
     * nonetheless.
     * <p>
     * Tasks scheduled from other task execution, are added and executed in the next tick of execution.
     * <p>
     *     Tasks are kept sorted in ascending priority order. A new task added to the scheduler with a priority
     *     equals to any other task will be added after the existing one.
     *
     * @see {cc.action.Action}
     */
    export class SchedulerQueue extends Action {

        /**
         * The collection of scheduled tasks.
         * @type {Array<cc.action.SchedulerQueueTask>}
         * @member cc.action.SchedulerQueue#_tasks
         * @private
         */
        _tasks : SchedulerQueueTask[] = [];

        /**
         * Build a new SchedulerQueue instance.
         * These objects are managed automatically by scenes and should not need to be built manually.
         * @method cc.action.SchedulerQueue#constructor
         */
        constructor() {
            super();
            this._repeatTimes= Number.MAX_VALUE;
            this._duration= 0;
            this._status= ActionStates.RUNNING;
            this._firstExecution= false;
        }

        /**
         * SchedulerQueue repeats forever by default.
         * @method cc.action.SchedulerAction#setRepeatForever
         * @returns {cc.action.SchedulerQueue}
         */
        setRepeatForever() : Action { return this; }

        /**
         * SchedulerQueue repeats forever by default.
         * @method cc.action.SchedulerAction#setRepeatTimes
         * @param n {number}
         * @returns {cc.action.SchedulerQueue}
         */
        setRepeatTimes( n:number ) : Action { return this; }

        /**
         * SchedulerQueue have 0 duration.
         * @method cc.action.SchedulerAction#setDuration
         * @param d {number}
         * @returns {cc.action.SchedulerQueue}
         */
        setDuration( d : number ) : Action { return this; }

        /**
         * SchedulerQueue can't have time info redefined.
         * @method cc.action.SchedulerAction#timeInfo
         * @param delay {number}
         * @param duration {number}
         * @returns {cc.action.SchedulerQueue}
         */
        timeInfo( delay:number, duration:number ) : Action {return this;}

        /**
         * Create a schedulable task.
         *
         * @method cc.action.SchedulerQueue.createSchedulerTask
         *
         * @param target {object} this object will be supplied as context to the callback function.
         * @param callback {cc.action.SchedulerTaskCallback}
         * @param interval {number} interval time to elapse between scheduler calls. Can't be less than 16ms. If the
         *   value is less, it will be fired at every frame anyway.
         * @param repeat {number} multi-shot task. Should this event repeat over time ?
         * @param delay {boolean} schedule the task and wait this time before firing the event.
         */
        static createSchedulerTask( target:any, callback:SchedulerTaskCallback, interval:number, repeat:number, delay:number ) {

            var task : SchedulerQueueTask = new SchedulerQueueTask();
            task._target= target;
            task._delay= (delay || 0) * cc.action.TIMEUNITS;
            task._callback= callback;
            task._interval= (interval || 0) * cc.action.TIMEUNITS;
            task._repeat = typeof repeat!=="undefined" ? repeat : Number.MAX_VALUE;
            task._status = SchedulerQueueTaskStatus.RUNNING;

            return task;
        }

        /**
         * Create a schedulable task to call the update method on a cc.node.Node instance.
         * This special factory method prevents errors when calling scheduleUpdate and then changing the update function.
         *
         * @param target {object} this object will be supplied as context to the callback function.
         * @param interval {number} interval time to elapse between scheduler calls. Can't be less than 16ms. If the
         *   value is less, it will be fired at every frame anyway.
         * @param repeat {number} multi-shot task. Should this event repeat over time ?
         * @param delay {boolean} schedule the task and wait this time before firing the event.
         */
        static createSchedulerUpdateTask( target:any, interval:number, repeat:number, delay:number ) {

            var task : SchedulerQueueUpdateTask = new SchedulerQueueUpdateTask();
            task._target= target;
            task._delay= (delay || 0) * cc.action.TIMEUNITS;
            task._interval= (interval || 0) * cc.action.TIMEUNITS;
            task._repeat = typeof repeat!=="undefined" ? repeat : Number.MAX_VALUE;
            task._status = SchedulerQueueTaskStatus.RUNNING;

            return task;
        }

        /**
         * Schedule a task.
         * @method cc.action.SchedulerQueue#scheduleTask
         * @param target {Object}
         * @param callback {SchedulerTaskCallback}
         * @param interval {number}
         * @param repeat {number}
         * @param delay {number}
         */
        scheduleTask( target:any, callback?:SchedulerTaskCallback, interval?:number, repeat?:number, delay?:number ) {

            var worktask : SchedulerQueueTask = null;
            var task : SchedulerQueueTask = null;

            // large form
            if ( arguments.length>1 ) {
                worktask= SchedulerQueue.createSchedulerTask(target, callback, interval, repeat, delay );
            } else {
                worktask = <SchedulerQueueTask>target;
            }

            task= this.__findTask( worktask._target, worktask._callback );
            if ( null===task ) {
                worktask.adjustTime( this._currentTime );
                this.insertTask( worktask );
            } else {
                task._interval= worktask._interval;
                // in case it is paused.
                task._status =  SchedulerQueueTaskStatus.RUNNING;
            }

        }

        /**
         * Insert a task in priority order.
         * It uses binary search to find out the correct position.
         * If already exists a task with the same priority, the new task will be inserted after the existing ones.
         * @param task {cc.node.SchedulerQueueTask}
         */
        insertTask( task : SchedulerQueueTask ) {

            // trivial case: empty queue or task priority >= last task in queue's priority
            if ( this._tasks.length===0 || task._priority>=this._tasks[ this._tasks.length-1 ]._priority ) {
                this._tasks.push( task );
                return;
            }

            // binay insert
            var left=0;
            var right= this._tasks.length-1;

            while( left!==right ) {

                var middle= (right+left)>>1;
                var midtask= this._tasks[middle];

                if ( task._priority > midtask._priority ) {
                    left= middle+1;
                } else if ( task._priority < midtask._priority ) {
                    right= middle-1;
                } else {
                    left+= 1;
                }
            }

            // insert at left position.
            this._tasks.splice( left, 0, task );

        }

        /**
         * Find whether a task composed of a given object and callback already exists.
         * @method cc.action.SchedulerQueue#__findTask
         *
         * @param target {object}
         * @param method {cc.action.SchedulerTaskCallback}
         * @returns {*}
         * @private
         */
        __findTask( target:any, method:SchedulerTaskCallback ) : SchedulerQueueTask {

            for( var i=0; i<this._tasks.length; i++ ) {
                var task= this._tasks[i];
                if ( task._target===target && task._callback===method ) {
                    return task;
                }
            }

            return null;
        }

        /**
         * Pause all tasks for a given target.
         *
         * @method cc.action.SchedulerQueue#pauseTarget
         * @param target {object}
         */
        pauseTarget( target:any ) {

            for( var i=0; i<this._tasks.length; i++ ) {
                var task= this._tasks[i];
                if ( task._target===target ) {
                    task.pause();
                }
            }
        }

        /**
         * Pause a concrete task for a target.
         * @method cc.action.SchedulerQueue#pauseTask
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        pauseTask( target:any, callback:SchedulerTaskCallback ) {

            for( var i=0; i<this._tasks.length; i++ ) {
                var task= this._tasks[i];
                if ( task._target===target && task._callback===callback ) {
                    task.pause();
                    return;
                }
            }
        }

        /**
         * End a task for a target.
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        endTask( target:any, callback:SchedulerTaskCallback ) {

            for( var i=0; i<this._tasks.length; i++ ) {
                var task= this._tasks[i];
                if ( task._target===target && task._callback===callback ) {
                    task.end();
                    return;
                }
            }
        }

        /**
         * Resume a paused task for a target. If it was not paused, nothing happens.
         * @method cc.action.SchedulerQueue#resumeTask
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        resumeTask( target:any, callback:SchedulerTaskCallback ) {

            for( var i=0; i<this._tasks.length; i++ ) {
                var task= this._tasks[i];
                if ( task._target===target && task._callback===callback ) {
                    task.resume();
                    return;
                }
            }
        }

        /**
         * Resume all tasks for a target.
         * @method cc.action.SchedulerQueue#resumeTarget
         * @param target {object}
         */
        resumeTarget( target:any ) {

            for( var i=0; i<this._tasks.length; i++ ) {
                var task= this._tasks[i];
                if ( task._target===target ) {
                    task.resume();
                }
            }
        }

        /**
         * Remove all tasks for a target.
         * @method cc.action.SchedulerQueue#unscheduleAllCallbacks
         * @param target {object}
         */
        unscheduleAllCallbacks(target:any) {

            for( var i=0; i<this._tasks.length; i++ ) {
                var task= this._tasks[i];
                if ( task._target===target ) {
                    task.end();
                }
            }
        }

        /**
         * Unschedule a concrete task for a target.
         * Unschedule means set it as ended, w/o further execution.
         * @method cc.action.SchedulerQueue#unscheduleCallbackForTarget
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        unscheduleCallbackForTarget( target:any, callback:SchedulerTaskCallback ) {
            //this.pauseTask(target,callback);
            this.endTask(target,callback);
        }

        /**
         * Action update.
         * Traverse the task list and execute events.
         * @method cc.action.SchedulerQueue#update
         * @param normalizedTime {number} normalized action time.
         * @param target {cc.node.Node} node object for which the action executes. For Scheduler queues, no target exists.
         */
        update( normalizedTime : number, target : Node ) {

            // prevent that tasks schedules from a firing scheduled task be checked during this tick.
            var len= this._tasks.length;
            for( var i=0; i<len; i++ ) {
                this._tasks[i].step( this._currentTime );
            }

            // we can not make sure that the only marked for deletion tasks will be the ones that have been
            // time expired during this tick.
            // for example, a callback action could request unscheduling for other tasks.
            // so the whole list must be traversed and checked for ENDED (marked for deletion) tasks.
            for( var i=len-1; i>=0; i-=1 ) {
                if ( this._tasks[i].isEnded() ) {
                    this._tasks.splice( i, 1 );
                }
            }
        }
    }
}