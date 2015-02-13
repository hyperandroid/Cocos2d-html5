/**
 * License: see license.txt file.
 */


/// <reference path="../action/Action.ts"/>
/// <reference path="../action/SchedulerQueue.ts"/>
/// <reference path="./Node.ts"/>
/// <reference path="../action/ActionManager.ts"/>
/// <reference path="../render/RenderingContext.ts"/>
/// <reference path="../input/InputManager.ts"/>

module cc.node {

    "use strict";

    import Node = cc.node.Node;
    import Action = cc.action.Action;
    import ActionManager = cc.action.ActionManager;
    import RenderingContext = cc.render.RenderingContext;
    import SchedulerQueue= cc.action.SchedulerQueue;
    import SchedulerQueueTask= cc.action.SchedulerQueueTask;
    import SchedulerTaskCallback= cc.action.SchedulerTaskCallback;

    /**
     * Callback invoked when a Transition Enter/Exit/DidFinishExit/DidStartEnter
     * @memberOf cc.node
     * @callback CallbackSceneTransition
     * @param scene {cc.node.Scene} This callback will be called when a transition ends.
     */
    export interface CallbackSceneTransition {
        (scene : Scene) : void;
    }

    /**
     * @class cc.node.Scene
     * @extends cc.node.Node
     * @classdesc
     *
     * Scenes are specialized Nodes useful for separating in-game functional pieces.
     * For example, a Scene can be the game menu, another scene can be the game and another scene the results window.
     *
     * <li>At any given moment, only one scene can be running.
     *
     * <li>A Scene can not contain other Scenes, or any Director instance.
     * <li>The size of the scene will by default be the same as the Director, and hence, equal to the Canvas size.
     *
     * <li>A Scene manages all the Actions of all the Node's it contains.
     * <li>A scene manages chronometers/events independently to any other scene.
     *
     * <li>Every Node that hierarchically belongs to this Scene will have a reference to the Scene. This reference will be
     * set when the <code>Director</code> the Scene is running in calls <code>onEnter</code> on the scene.
     *
     * <li>There´ no limitation on how many Scenes can be in a game.
     *
     * <li>Scenes have no parent Node. This means that a call to <code>enumerateChildren</code> will take a Scene as the
     * root search point.
     * <li>An Scene logical parent is a Director object. Scenes have a Director instance in _parent variable.
     *
     * <p>
     *     Scenes are the source point for input routing to the nodes it contains. It contains two members:
     *     <ul>
     *      <li>_sceneGraphPriorityTree: for nodes sorted in scene graph priority. This priority is the natural
     *       way nodes are organized.
     *      <li>_priorityTree: artificial priority were nodes are sorted by value. lower value means higher priority.
     *     </ul>
     *     Each time a scene is set as running by a director, the InputSystem sets that scene as input target.
     *
     * <p>
     *     One important thing about scenes is that they contain an ActionManager which at the same time, manages a
     *     Scheduler.
     *     Scheduling actions or tasks for a Node is as straighforward as calling <code>runAction</code> or
     *     <code>schedule|scheduleUpdate</code>.
     *     These methods expect a time parameter for scheduling, which by default is in seconds. The engine will internally
     *     treat all time measures in milliseconds (makes sense since the animation loop is scheduled every 16ms approx),
     *     but the developer can instrument to set time measurements in seconds (default) by calling
     *     <code>cc.action.setTimeReferenceInSeconds</code> or milliseconds <code>setTimeReferenceInMillis</code>.
     *     Callback notifications with a time parameter will be in the developer desired time units.
     *
     */
    export class Scene extends Node {

        /**
         * Node's ActionManager.
         * @member cc.node.Scene#_actionManager
         * @type {cc.action.ActionManager}
         * @private
         */
        _actionManager : ActionManager = new ActionManager();

        /**
         * Callback reference for onEnter event.
         * @member cc.node.Scene#_onEnter
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onEnter : CallbackSceneTransition = null;

        /**
         * Callback reference for onExit event.
         * @member cc.node.Scene#_onExit
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onExit : CallbackSceneTransition = null;

        /**
         * Callback reference for enter transition end event.
         * @member cc.node.Scene#_onEnterTransitionDidFinish
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onEnterTransitionDidFinish : CallbackSceneTransition = null;

        /**
         * Callback reference for exit transition start event.
         * @member cc.node.Scene#_onExitTransitionDidStart
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onExitTransitionDidStart : CallbackSceneTransition = null;

        _scheduler : SchedulerQueue = null;

        _sceneGraphPriorityTree : cc.input.SceneGraphInputTreeNode = null;
        _priorityTree : cc.input.PriorityInputNode[] = null;

        /**
         * Create a new Scene instance.
         * @method cc.node.Scene#constructor
         */
        constructor() {
            super();

            this._scheduler= new SchedulerQueue();
            this._actionManager.scheduleActionForNode(null, this._scheduler);

            this._sceneGraphPriorityTree= new cc.input.SceneGraphInputTreeNode(this);
            this._priorityTree= [];

            this.setGlobalAlpha(true);

            this.setPositionAnchor(0,0);
        }

        enableEvents( enable:boolean ) : Scene {
            super.enableEvents(enable);
            this.enableEventsForNode(this);
            return this;
        }

        enablePriorityEvents( enable:boolean, priority:number ) : Scene {
            super.enablePriorityEvents(enable,priority);
            this.enableEventsForNode( this );
            return this;
        }

        /**
         * Enable events in scene-graph order for a node.
         * If the node is not attached to this scene, nothing will happen.
         * @method cc.node.Scene#enableEvents
         * @param node {cc.node.Node}
         */
        enableEventsForNode( node:Node ) : Scene {
            this._sceneGraphPriorityTree.insert( node.getPathToRoot() );
            return this;
        }

        /**
         * Enable events in priority order for a node.
         * The priority is something external to the Node,
         * @method cc.node.Scene#enablePriorityEvents
         * @param node {cc.node.Node}
         */
        enablePriorityEventsForNode( node:Node ) : Scene {

            var pin:cc.input.PriorityInputNode;

            var pinIndex= -1;
            // Pending: speed search
            for( var i=0; i<this._priorityTree.length; i++ ) {
                if ( this._priorityTree[i].node === node) {
                    pinIndex= i;
                    break;
                }
            }

            if ( pinIndex!==-1 ) {
                pin= this._priorityTree[ pinIndex ];
                if ( pin.priority===node.getInputPriority() ) {
                    // node added with the same priority
                    return;
                }
            } else {
                // node does not exist. create descriptor, and insert.
                this._priorityTree.push(new cc.input.PriorityInputNode(node, node.getInputPriority() ) );
            }

            this._priorityTree.sort( function( n0:cc.input.PriorityInputNode, n1:cc.input.PriorityInputNode ) : number {

                if ( n0.priority<n1.priority ) {
                    return -1;
                } else if ( n0.priority>n1.priority ) {
                    return 1;
                }

                return 0;
            });

            return this;
        }

        findNodeAtScreenPoint( e:cc.input.MouseInputManagerEvent ) : Node {
            // first, check on priority input
            for( var i=0; i<this._priorityTree.length; i++ ) {
                var node:Node= this._priorityTree[i].node;
                e._localPoint.set( e._screenPoint.x, e._screenPoint.y );
                if ( node.isScreenPointInNode( e._localPoint ) ) {
                    return node;
                }
            }

            // now, for scene-graph priority.
            return this._sceneGraphPriorityTree.findNodeAtScreenPoint( e );
        }

        /**
         * Increment scene's timeline.
         * This time is local to this scene, and independent to other Scene's time.
         * This local time is handled by the Scene's ActionManager, which translate the delta milliseconds into
         * the desired game time measurement unit, which are seconds by default.
         * @method cc.node.Scene#step
         * @param delta {number} elapsed time in milliseconds.
         * @param ctx {cc.render.RenderingContext} where node's will render.
         */
        step( delta : number, ctx : RenderingContext ) : void {

            // allow for this scene's nodes actions to run.
            this._actionManager.step( delta );

            // draw scene and its children.
            this.visit( ctx );
        }

        /**
         * Register Scene onEnter callback.
         * @method cc.node.Scene#onEnter
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onEnter( c : CallbackSceneTransition ) : Scene {
            this._onEnter= c;
            return this;
        }

        /**
         * Register Scene onExit callback.
         * @method cc.node.Scene#onExit
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onExit( c : CallbackSceneTransition ) : Scene {
            this._onExit= c;
            return this;
        }

        /**
         * Register onExitTransitionStart callback. Called when scenes are switched by Transition objects.
         * @method cc.node.Scene#onExitTransitionDidStart
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onExitTransitionDidStart( c : CallbackSceneTransition ) : Scene {
            this._onExitTransitionDidStart= c;
            return this;
        }

        /**
         * Register onEnterTransitionFinish callback. Called when scenes are switched by Transition objects.
         * @method cc.node.Scene#onEnterTransitionDidFinish
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onEnterTransitionDidFinish( c : CallbackSceneTransition ) : Scene {
            this._onEnterTransitionDidFinish= c;
            return this;
        }

        /**
         * Notifiy event registered callback.
         * @method cc.node.Scene#callOnEnterTransitionDidFinish
         */
        callOnEnterTransitionDidFinish() : void {
            if ( this._onEnterTransitionDidFinish ) {
                this._onEnterTransitionDidFinish( this );
            }
        }

        /**
         * Notifiy event registered callback.
         * @method cc.node.Scene#callOnExitTransitionDidStart
         */
        callOnExitTransitionDidStart() : void {

            if ( this._onExitTransitionDidStart) {
                this._onExitTransitionDidStart( this );
            }
        }

        /**
         * Notifiy event registered callback.
         * @method cc.node.Scene#callOnEnter
         */
        callOnEnter() : void {

            var scene : Scene = this;

            // recursively set scene for nodes.
            this.enumerateChildren( "//*", function( node : Node ) {
                node.setScene( scene );
            });

            if ( this._onEnter ) {
                this._onEnter( this );
            }

            this.resetScene();
         }

        //__setTransform():Node {
        //    this.__setLocalTransform();
        //    this.__setWorldTransform();
        //    return this;
        //}

        /**
         * Notify event registered callback.
         * @method cc.node.Scene#callOnExit
         */
        callOnExit() : void {
            if ( this._onExit ) {
                this._onExit( this );
            }
        }

        /**
         * Overriden Node's method for set scene reference.
         * A scene does not need a scene reference.
         * @method cc.node.Scene#setScene
         * @param scene {cc.node.Scene}
         */
        setScene( scene : Scene ) : void {
            // assert scene===this
        }

        /**
         * Overriden Node's method for setting a parent.
         * Scenes have no parent reference so this method does nothing.
         * @method cc.node.Scene#setParent
         * @param node {cc.node.Node}
         * @returns {cc.node.Scene}
         */
        setParent( node : Node ) : Node {
            return this;
        }

        /**
         * Reset this scene's properties.
         * Needed if the scene is managed by a Transition since position/scale/rotate can be changed.
         * @method cc.node.Scene#resetScene
         * @returns {cc.node.Scene}
         */
        resetScene() : Scene {
            this.alpha = 1;
            this.setScale(1,1);
            this.setPositionAnchor(0,0);
            this.setTransformationAnchor(0.5,0.5);
            this.__setFlag( NodeDirtyFlags.VISIBLE );

            return this;
        }

        /**
         * Run an Action for a Node.
         * @method cc.node.Scene#scheduleActionForNode
         * @param node {cc.node.Node}
         * @param action {cc.action.Action}
         * @returns {cc.node.Scene}
         */
        scheduleActionForNode( node : Node, action : Action ) : Scene {
            this._actionManager.scheduleActionForNode( node, action );
            return this;
        }

        /**
         * Clear all this scene contents.
         * + all children are removed.
         */
        clear() : void {
            this.removeAllChildren();
        }

        /**
         * Schedule an action to run.
         * By the time an action is meant to be scheduled for running in a Node, there may not yet be a
         * <code>Director</code> or <code>Scene</code>. This method saves locally the actions which will be
         * scheduled in a scene's <code>ActionManager</code> later.
         * @method cc.node.Node#runAction
         * @param action {cc.action.Action}
         * @returns {cc.node.Node}
         */
        runAction( action : Action ) : Node {
            this.scheduleActionForNode(this, action);
            return this;
        }

        stopNodeActionByTag( node:Node, tag:string ) : Node {
            this._actionManager.stopNodeActionByTag(node,tag);

            return this;
        }

        startChainingActionsForNode( node:Node ) : cc.action.ActionInfo {
            return this._actionManager.startChainingActionsForNode(node);
        }

        stopActionsForNode( node:Node ) {
            this._actionManager.stopActionsForNode(node);
        }

        getScheduler() : SchedulerQueue {
            return this._scheduler;
        }

        getScene() {
            return this;
        }

        __setLocalTransform() {
            super.__setLocalTransform();
            //this._modelViewMatrix[4]*= -1;
            //this._modelViewMatrix[5]+= this._contentSize.height;
        }

        /////////////// SCHEDULER METHODS BEGIN ////////////////

        scheduleTask( task:SchedulerQueueTask ) {
            this._scheduler.scheduleTask(task);
        }

        scheduleUpdateWithPriority( priority : number ) {
            var task:SchedulerQueueTask= cc.action.SchedulerQueue.createSchedulerTask(this,this.update,0,Number.MAX_VALUE,0);
            task._priority= priority;
            this._scheduler.scheduleTask(task);
        }

        /**
         * Schedule a task to per frame call update for this node.
         *
         * @method cc.node.Node#scheduleUpdate
         * @deprecated
         */
        scheduleUpdate() {
            var task:SchedulerQueueTask= cc.action.SchedulerQueue.createSchedulerTask(this,this.update,0,Number.MAX_VALUE,0);
            this._scheduler.scheduleTask(task);
        }

        unscheduleUpate() {
            this._scheduler.unscheduleCallbackForTarget(this, this.update);
        }

        /**
         * Schedule a task for the node.
         * This node will be passed as target to the specified callback function.
         * If already exist a task in the scheduler for the same pair of node and callback, the task will be updated
         * with the new data.
         * @method cc.node.Node#schedule
         * @param callback_fn {cc.action.SchedulerTaskCallback} callback to invoke
         * @param interval {number} repeat interval time. the task will be fired every this amount of milliseconds.
         * @param repeat {number=} number of repetitions. if not set, infinite will be used.
         * @param delay {number=} wait this millis before firing the task.
         */
        schedule(callback_fn:SchedulerTaskCallback, interval:number, repeat?:number, delay?:number) {

            var task:SchedulerQueueTask= cc.action.SchedulerQueue.createSchedulerTask(
                                    this,callback_fn,interval,repeat,delay);

            this._scheduler.scheduleTask(task);
        }

        /**
         * Schedule a single shot task. Will fired only once.
         * @method cc.node.Node#scheduleOnce
         * @param callback_fn {cc.action.SchedulerTaskCallback} scheduler callback.
         * @param delay {number} milliseconds to wait before firing the task.
         * @returns {cc.node.Node}
         */
        scheduleOnce(callback_fn:SchedulerTaskCallback, delay:number) {
            this.schedule(callback_fn, 0.0, 0, delay);
        }

        /**
         * Unschedule a task for the node.
         * @method cc.node.Node#unschedule
         * @param callback_fn {cc.action.SchedulerTaskCallback} callback to unschedule.
         */
        unschedule(callback_fn:SchedulerTaskCallback) {

            if (!callback_fn)
                return;

            this._scheduler.unscheduleCallbackForTarget(this, callback_fn);
        }

        unscheduleCallbackForTarget(target:Node, task:SchedulerTaskCallback) {
            this._scheduler.unscheduleCallbackForTarget(target,task);
        }

        /**
         * Unschedule all tasks for the node.
         * @method cc.node.Node#unscheduleAllCallbacks
         */
        unscheduleAllCallbacks(target?:Node) {
            this._scheduler.unscheduleAllCallbacks(target?target:this);
        }

        /**
         * Resumes all scheduled tasks and actions.
         * This method is called internally by onEnter
         * @method cc.node.Node#resume
         */
        resume() {
            this._scheduler.resumeTarget(this);

            // PENDING: implement
            //this.actionManager && this.actionManager.resumeTarget(this);
            //cc.eventManager.resumeTarget(this);
        }

        /**
         * Pauses all scheduled selectors and actions.
         * This method is called internally by onExit.
         * @method cc.node.Node#pause
         *
         */
        pause() {
            this._scheduler.pauseTarget(this);

            // PENDING: implement
            //this.actionManager && this.actionManager.pauseTarget(this);
            //cc.eventManager.pauseTarget(this);
        }

        pauseTarget( target:Node ) {
            this._scheduler.pauseTarget( target );
        }

        resumeTarget( target:Node ) {
            this._scheduler.resumeTarget( target );
        }

        /////////////// SCHEDULER METHODS END ////////////////
    }

}
