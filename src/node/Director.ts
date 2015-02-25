/**
 * License: see license.txt file.
 */


/// <reference path="./Node.ts"/>
/// <reference path="./Scene.ts"/>
/// <reference path="../math/Dimension.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../transition/Transition.ts"/>
/// <reference path="../action/ActionManager.ts"/>
/// <reference path="../action/SchedulerQueue.ts"/>
/// <reference path="../locale/Locale.ts"/>
/// <reference path="../util/Debug.ts"/>
/// <reference path="../render/RenderingContext.ts"/>
/// <reference path="../render/Renderer.ts"/>
/// <reference path="../render/ScaleManager.ts"/>
/// <reference path="../input/InputManager.ts"/>
/// <reference path="../input/MouseInputManager.ts"/>
/// <reference path="../render/ScaleManager.ts"/>

module cc.node {

    "use strict";

    import Node= cc.node.Node;
    import Scene= cc.node.Scene;
    import Debug= cc.Debug;
    import Locale= cc.locale;
    import ActionManager= cc.action.ActionManager;
    import RenderingContext = cc.render.RenderingContext;
    import Renderer= cc.render.Renderer;
    import Dimension = cc.math.Dimension;

    /**
     * Enumeration of Director status.
     *
     * @tsenum cc.node.DirectorStatus
     */
    export enum DirectorStatus {
        CREATED = 0,
        RUNNING = 1,
        PAUSED = 2,
        STOPPED = 3
    }

    var __window:any = window;

    /**
     * @class cc.node.Director
     * @extends cc.node.Node
     * @classdesc
     *
     * A Director object is the root node of a game.
     * <li>As the primary component, it is a glue which puts together platform features such as Input routing or Texture
     * and image caching, and Scenes and game logic.
     * <li>Each Director has a renderer, which acts on its own Canvas Object. Since V4, Cocos2D HTML5 allows for multiple
     * <li>Director instances and each one can have a different renderer type.
     *
     * <li>Every Director present in a Document, will share a common Texture and Image cache for better resource management.
     *
     * <li>A Director object runs Scenes. The process of switching scenes is handled using a <code>Transition</code> object.
     * <li>The preferred way of building scenes is by calling <code>director.createScene() -> Scene</code>
     *
     * @see{cc.node.Scene}
     * @see{cc.node.Transition}
     *
     */
    export class Director extends Node {

        /**
         * Director status
         * @member cc.node.Director#_status
         * @type {number}
         * @private
         */
        _status:cc.node.DirectorStatus = cc.node.DirectorStatus.CREATED;

        /**
         * Director's renderer.
         * @member cc.node.Director#_renderer
         * @type {cc.render.RenderingContext}
         * @private
         */
        _renderer:Renderer = null;

        /**
         * Scenes available in this Director.
         * @member cc.node.Director#_scenes
         * @type {Array}
         * @private
         */
        _scenes:Array<cc.node.Scene> = [];

        /**
         * requestAnimationFrame shim id.
         * @member cc.node.Director#_animFrame
         * @type {number}
         * @private
         */
        _animFrame:number = null;

        /**
         * Ideal milliseconds between two frames.
         * @member cc.node.Director#_animationInterval
         * @type {number}
         * @private
         */
        _animationInterval:number = 1000 / 60;

        /**
         * Currently running Scene.
         * @member cc.node.Director#_currentScene
         * @type {cc.node.Scene}
         * @private
         */
        _currentScene:Scene = null;

        /**
         * If <code>runAction</code> is called with a Transition, _exitingScene will be the currently moving out scene.
         * For internal usage only.
         * @member cc.node.Director#_exitingScene
         * @type {cc.node.Scene}
         * @private
         */
        _exitingScene:Scene = null;

        /**
         * Scenes action manager that manages Transition objects.
         * @member cc.node.Director#_scenesActionManager
         * @type {cc.action.ActionManager}
         * @private
         * @see {cc.transition.Transition}
         */
        _scenesActionManager:ActionManager = null;

        /**
         * Timer management. This value is the previous time the director run at.
         * @member cc.node.Director#_prevPerf
         * @type {number}
         * @private
         */
        _prevPerf:number = 0;

        /**
         * General input management system
         * @member cc.node.Director#_inputManager
         * @type {cc.input.InputManager}
         * @private
         */
        _inputManager : cc.input.InputManager = null;

        _scheduler : cc.action.SchedulerQueue= null;

        /**
         * Create a new Director instance.
         * @method cc.node.Director#constructor
         */
        constructor() {
            super();

            this._scenesActionManager = new ActionManager();
            this._scheduler= this._scenesActionManager.getScheduler();
            this._inputManager= new cc.input.InputManager();

            // BUGBUG deprecated
            (<any>cc).director= this;
        }

        /**
         * Get the current renderer.
         * @method cc.node.Director#getRenderer
         * @returns {Renderer}
         */
        getRenderer():Renderer {
            return this._renderer;
        }

        /**
         * Set the Director's renderer.
         * It will also enable input on the renderer surface.
         * @method cc.node.Director#setRenderingContext
         * @param renderer {cc.render.Renderer}
         * @returns {cc.node.Director}
         */
        setRenderer(renderer:Renderer):Director {
            this._renderer = renderer;
            this._contentSize.set(renderer.getContentSize());

            this._modelViewMatrix= this._renderer.getScaleContentMatrix();
            this._worldModelViewMatrix= this._renderer.getScaleContentMatrix();

            this._inputManager.enable( renderer._surface );

            var me= this;
            renderer.onContentScaled( function(
                unitsWidth:number, unitsHeight:number,
                preferredUnitsWidth:number, preferredUnitsHeight:number,
                canvasWidth:number, canvasHeight:number,
                sceneHint:cc.render.ScaleContentSceneHint ) {

                me.setContentSize( canvasWidth, canvasHeight );

                if ( sceneHint&cc.render.ScaleContentSceneHint.CENTER ) {
                    me._currentScene.setContentSize(unitsWidth, unitsHeight);
                    me._currentScene.setPosition((preferredUnitsWidth - unitsWidth) / 2, (preferredUnitsHeight - unitsHeight) / 2);
                } else if ( sceneHint&cc.render.ScaleContentSceneHint.STRETCH ) {
                    me._currentScene.setContentSize(preferredUnitsWidth, preferredUnitsHeight);
                    me._currentScene.setPosition(0,0);
                } else {

                    var x=0;
                    var y=0;

                    if ( sceneHint&cc.render.ScaleContentSceneHint.RIGHT ) {
                        x= preferredUnitsWidth-unitsWidth;
                    }

                    if ( (cc.render.RENDER_ORIGIN===cc.render.ORIGIN_TOP && sceneHint&cc.render.ScaleContentSceneHint.BOTTOM) ||
                         (cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM && sceneHint&cc.render.ScaleContentSceneHint.TOP) ) {

                        y= preferredUnitsHeight-unitsHeight;
                    }

                    me._currentScene.setContentSize(unitsWidth, unitsHeight);
                    me._currentScene.setPosition(x,y);
                }
            });

            return this;
        }

        __setTransform():Node {
            return this;
        }

        __setLocalTransform() {

        }

        __setWorldTransform() {

        }

        /**
         * Get the system input manager object.
         * @method cc.node.Director#getInputManager
         * @returns {cc.input.InputManager}
         */
        getInputManager() : cc.input.InputManager {
            return this._inputManager;
        }

        /**
         * Pause the Director.
         * The animation loop is stopped.
         * @method cc.node.Director#pause
         */
        pause():void {
            if (this._status === cc.node.DirectorStatus.PAUSED) {
                return;
            }

            this.stopAnimation();

            this._status = cc.node.DirectorStatus.PAUSED;
        }

        /**
         * Resume a paused director.
         * The animation loop restarts.
         * @method cc.node.Director#resume
         */
        resume():void {
            if (this._status !== cc.node.DirectorStatus.PAUSED) {
                return;
            }

            this.startAnimation();
        }

        /**
         * Make the renderer visible in the document.
         * @method cc.node.Director#addToDOM
         */
        addToDOM() {
            this._renderer.addToDOM();
        }

        __sceneExitedDirector( scene:Scene ) {
            if (scene) {
                scene.callOnExit();
                scene.cleanup();
                scene._parent= null;
            }
        }

        /**
         * Run a Scene.
         * Optionally use a transition for switching between scenes.
         * @method cc.node.Director#runScene
         * @param scene {cc.node.Scene}
         * @param transition {cc.transition.Transition}
         */
        runScene(scene_or_transition: Scene|cc.transition.Transition, transition?:cc.transition.Transition):void {

            var scene:Scene;

            if (scene_or_transition instanceof Scene) {
                scene= <Scene>scene_or_transition;
            } else if (scene_or_transition instanceof cc.transition.Transition) {
                // v3 style call
                transition= <cc.transition.Transition>scene_or_transition;
                scene= transition._sceneIn;

                if (!scene) {
                    throw "director.runAction(transition) has no scene set.";
                }

            } else {
                throw "Director.runScene with wrong object type.";
            }

            // wtf. zero sized containers should have no content.
            // the scene-graph will discard them immediately. This code here for backwards compatibility only.
            if ( scene.width===0 || scene.height===0 ) {
                var pw:Dimension= this.getRenderer()._preferredUnits;
                scene.setContentSize( pw.width, pw.height );
            }

            scene._parent= this;

            // the renderer will check whether it is already added.
            this.addToDOM();

            // if there's a transition, let the transition handle onExit.
            if (typeof transition !== "undefined") {
                this._exitingScene = this._currentScene;
                transition.initialize(scene, this._currentScene).
                    onDirectorTransitionEnd((tr:cc.transition.Transition) => {
                        //if ( this._exitingScene ) {
                        //    this.__sceneExitedDirector(this._exitingScene);
                        //}
                        this._exitingScene = null;
                    });
            } else {
                // if not, and there's a current scene
                if (this._currentScene) {
                    // call onExit.
                    this.__sceneExitedDirector(this._currentScene);
                }

                // scene entered w/o transition.
                scene.callOnEnter();
            }

            this._currentScene = scene;

            cc.input.MouseInputManager.enableInputForScene( scene );

            // check for valid orientation.
            this._renderer.checkOrientation();

            if ( this._status!==cc.node.DirectorStatus.RUNNING ) {
                this.startAnimation();
            }

        }

        /**
         * Push a new running scene on top of the stack.
         * @method cc.node.Director#pushScene
         * @param scene {cc.node.Scene}
         */
        pushScene(scene:Scene):void {

            if (this._scenes.indexOf(scene) !== -1) {
                Debug.error(Locale.ERR_RUNNING_ALREADY_EXISTING_SCENE);
                return;
            }

            this._scenes.push(scene);

            this.runScene(scene);
        }

        /**
         * Pop a scene from the running stack.
         * @method cc.node.Director#popScene
         * @throws cc.locale.Locale.ERR_DIRECTOR_POPSCENE_UDERFLOW if DEBUG_LEVEL is RuntimeDebugLevel.DEBUG.
         */
        popScene():void {

            if (this._scenes.length === 0) {
                Debug.error(Locale.ERR_DIRECTOR_POPSCENE_UNDERFLOW);
                return;
            }

            var exitScene:Scene = this._scenes.pop();
            this.__sceneExitedDirector(exitScene);

            if (this._scenes.length > 0) {
                this._currentScene = this._scenes[this._scenes.length - 1];
                this._currentScene.callOnEnter();
            } else {

                // PENDING end director.
            }

        }

        /**
         * Pop all scenes but one.
         * @method cc.node.Director#popToRootScene
         */
        popToRootScene():void {
            this.popToSceneStackLevel(1);
        }

        /**
         * Remove scenes from the stack until reaching 'level' scenes stack length.
         * @method cc.node.Director#popToSceneStackLevel
         * @param level {number}
         */
        popToSceneStackLevel(level:number):void {

            level = this._scenes.length - level;

            if (level <= 0) {
                Debug.error(Locale.ERR_DIRECTOR_POPSCENE_UNDERFLOW);
                return;
            }

            while (level) {
                this.popScene();
                level--;
            }
        }

        /**
         * Start Director's animation loop.
         * Don't call directly, or only call after manually calling <code>stopAnimation</code>
         * @method cc.node.Director#startAnimation
         */
        startAnimation():void {

            if (this._status === cc.node.DirectorStatus.RUNNING) {
                Debug.warn(Locale.WARN_START_ANIMATION_ON_RUNNING_DIRECTOR);
                return;
            }

            this._status = cc.node.DirectorStatus.RUNNING;

            var fn = this.mainLoop.bind(this);
            var me = this;

            function raf(perf:number) {
                fn(perf);
                me._animFrame = __window.requestAnimFrame(raf);
            }

            this._animFrame = __window.requestAnimFrame(raf);

            if ( this._currentScene ) {
                cc.input.MouseInputManager.enableInputForScene( this._currentScene );
            }
        }

        /**
         * Stop Director's animation loop.
         * The Director status will be STOPPED.
         * @method cc.node.Director#stopAnimation
         */
        stopAnimation():void {

            if (this._status !== cc.node.DirectorStatus.RUNNING) {
                return;
            }

            this._status = cc.node.DirectorStatus.STOPPED;
            if (this._animFrame!==null) {
                __window.cancelAnimationFrame(this._animFrame);
                this._animFrame = null;
            }

            if ( this._currentScene ) {
                cc.input.MouseInputManager.disableInputForScene();
            }
        }

        /**
         * Throttle animation loop.
         * This value will be the minimum millis to wait between two frames.
         * Currently does nothing.
         * @method cc.node.Director#setAnimationInterval
         * @param interval {number}
         */
        setAnimationInterval(interval:number):void {
            this._animationInterval = interval;
        }

        /**
         * Main director animation Loop.
         * Don't call directly this method. It is called by startAnimation when the first scene is scheduled in the
         * Director object.
         *
         * PENDING: throttle FPS with _animationInterval value.
         *
         * @method cc.node.Director#mainLoop
         * @param perf {number=} performance time elapsed between two RAF calls.
         */
        mainLoop(perf?:number):void {

            if (this._status !== cc.node.DirectorStatus.RUNNING) {
                return;
            }

            var deltaTime;

            if (typeof perf === "undefined") {
                perf = new Date().getTime();
            }

            deltaTime = perf - this._prevPerf;

            // prevent feeding huge time increments. Useful for debugging.
            if (deltaTime > 250) {
                deltaTime = 250;
            }

            this._prevPerf = perf;

            var ctx = this._renderer.getRenderingContext();
            ctx.clear();

            // do director's paint as a node.
            // A director does not have any action associated, so just paint.
            this.visit(ctx);

            // Step time for active scenes.
            // At any given moment, as much as two scenes can be active.
            // If a transition is in place, two scenes will be active.
            // If not, only one scene is active.
            this._scenesActionManager.step(deltaTime/cc.action.TIMEUNITS);

            // do current scene's visit when
            // transitions end.
            if (this._exitingScene) {
                this._exitingScene.step(deltaTime/cc.action.TIMEUNITS, ctx);
            }
            this._currentScene.step(deltaTime/cc.action.TIMEUNITS, ctx);

            if (this._renderer.flush) {
                this._renderer.flush();
            }
        }

        /**
         * Create an scene object.
         * The created Scene will have the size of this director object and have a reference to the director.
         * @method cc.node.Director#createScene
         * @returns {cc.node.Scene}
         */
        createScene():Scene {
            var scene = new Scene();
            scene.setContentSize(this._contentSize.width, this._contentSize.height);

            return scene;
        }

        /**
         * Get director size as a dimension object.
         * The object is a copy of the internal contentSize variable.
         * This method is for backwards compatibility
         * @method cc.node.Director#getWinSize
         * @returns {cc.math.Dimension}
         */
        getWinSize():Dimension {
            return this._contentSize.clone();
        }


        scheduleTask( task:cc.action.SchedulerQueueTask ) {
            this._scheduler.scheduleTask(task);
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
        schedule(callback_fn:cc.action.SchedulerTaskCallback, interval:number, repeat?:number, delay?:number) {

            var task:cc.action.SchedulerQueueTask= cc.action.SchedulerQueue.createSchedulerTask(
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
        scheduleOnce(callback_fn:cc.action.SchedulerTaskCallback, delay:number) {
            this.schedule(callback_fn, 0.0, 0, delay);
        }

        /**
         * Unschedule a task for the node.
         * @method cc.node.Node#unschedule
         * @param callback_fn {cc.action.SchedulerTaskCallback} callback to unschedule.
         */
        unschedule(callback_fn:cc.action.SchedulerTaskCallback) {

            if (!callback_fn)
                return;

            this._scheduler.unscheduleCallbackForTarget(this, callback_fn);
        }

        /**
         * Unschedule all tasks for the node.
         * @method cc.node.Node#unscheduleAllCallbacks
         */
        unscheduleAllCallbacks(target?:Node) {
            this._scheduler.unscheduleAllCallbacks(target?target:this);
        }

    }
}