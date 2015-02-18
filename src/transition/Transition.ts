/**
 * License: see license.txt file.
 */


/// <reference path="../node/Node.ts"/>
/// <reference path="../node/Scene.ts"/>
/// <reference path="../node/Director.ts"/>
/// <reference path="../action/Action.ts"/>
/// <reference path="../action/MoveAction.ts"/>
/// <reference path="../action/TimeInterpolator.ts"/>

module cc.transition {

    import Node = cc.node.Node;
    import NodeDirtyFlags= cc.node.NodeDirtyFlags;
    import Scene = cc.node.Scene;
    import Director = cc.node.Director;
    import Action = cc.action.Action;
    import MoveAction = cc.action.MoveAction;
    import Interpolator = cc.action.Interpolator;
    import TimeInterpolator = cc.action.TimeInterpolator;

    /**
     * Callback definition for transition end events.
     * @memberOf cc.transition
     * @callback CallbackTransitionEnd
     * @param transition {cc.transition.Transition} Transition triggering end events.
     */
    export interface CallbackTransitionEnd {
        (transition:Transition) : void;
    }

    /**
     * @class cc.transition.Transition
     * @classdesc
     *
     * Transitions are special action groups that move in and out Scenes.
     * <br>
     * As such, only Scenes have Transtions applied, while regulars Nodes have Actions.
     * This is the preferred way for a Director to switch between scenes by calling
     * <code>director.runScene( scene, transition )</code>.
     */
    export class Transition {

        /**
         * Director callback for transition end events.
         * @member cc.transition.Transition#_transitionCallback
         * @type {cc.transition.CallbackTransitionEnd}
         * @private
         */
        _transitionCallback:CallbackTransitionEnd = null;

        /**
         * User defined callback for transition end events.
         * @member cc.transition.Transition#_userTransitionCallback
         * @type {cc.transition.CallbackTransitionEnd}
         * @private
         */
        _userTransitionCallback:CallbackTransitionEnd = null;

        /**
         * Transition duration in milliseconds.
         * @member cc.transition.Transition#_duration
         * @type {number}
         * @private
         */
        _duration:number = 0;

        /**
         * Transition interpolator.
         * <br>
         * {@link cc.action.TimeInterpolator}
         * @member cc.transition.Transition#_interpolator
         * @type {cc.action.TimeInterpolator}
         * @private
         */
        _interpolator:TimeInterpolator = Interpolator.Linear(false, false);

        /**
         * Scene to get in. This is a V3 backwards compatibility need.
         * In v3, Transition extends Scene.
         * In v4, Transition does NOT extend Scene.
         * To keep the director.runAction( Scene|Transition ) method signature, the transition must
         * be built with a target Scene in.
         * @member cc.transition.Transition#_sceneIn
         * @type {cc.node.Scene}
         * @private
         */
        _sceneIn:Scene= null;

        /**
         * Create a new Transition
         * @method cc.transition.Transition#constructor
         * @param duration {number} transition duration in milliseconds.
         */
        constructor(duration:number, scene?:Scene) {
            this._duration = duration;
            this._sceneIn= scene;
        }

        /**
         * Initialize the transition.
         * @method cc.transition.Transition#initialize
         * @param sceneIn {cc.node.Scene} entering scene.
         * @param sceneOut {cc.node.Scene} exiting scene
         * @returns {cc.transition.Transition} the initialized transition
         */
        initialize(sceneIn:Scene, sceneOut:Scene):Transition {
            return this;
        }

        /**
         * Register director callback for transition end events.
         * @method cc.transition.Transition#onDirectorTransitionEnd
         * @param callback {cc.transition.CallbackTransitionEnd}
         * @returns {cc.transition.Transition}
         */
        onDirectorTransitionEnd(callback:CallbackTransitionEnd):Transition {
            this._transitionCallback = callback;
            return this;
        }

        /**
         * Register user callback for transition end events.
         * @method cc.transition.Transition#onTransitionEnd
         * @param callback {cc.transition.CallbackTransitionEnd}
         * @returns {cc.transition.Transition}
         */
        onTransitionEnd(callback:CallbackTransitionEnd):Transition {
            this._userTransitionCallback = callback;
            return this;
        }

        /**
         * Set the transition interpolator.
         * @method cc.transition.Transition#setInterpolator
         * @param i {cc.action.TimeInterpolator}
         * @returns {cc.transition.Transition}
         */
        setInterpolator(i:TimeInterpolator):Transition {
            this._interpolator = i;
            return this;
        }

        /**
         * Prepare the Transition Actions callbacks.
         * In a transition, only the entering scene is mandatory. For example, when the director starts and only one
         * scene slides in.
         * @method cc.transition.Transition#__setupActionCallbacks
         * @param actionIn {cc.node.Scene} enter scene.
         * @param actionOut {cc.node.Scene=} exit scene.
         * @private
         */
        __setupActionCallbacks(actionIn:Action, actionOut?:Action):void {

            actionIn.onStart((action:Action, target:Node) => {
                (<Scene>target).callOnEnter();
            });
            actionIn.onEnd((action:Action, target:Node) => {
                if (this._transitionCallback) {
                    this._transitionCallback(this);
                }
                if (this._userTransitionCallback) {
                    this._userTransitionCallback(this);
                }

                (<Scene>target).callOnEnterTransitionDidFinish();
            });

            if (actionOut) {

                actionOut.onStart((action:Action, target:Node) => {
                    (<Scene>target).callOnExitTransitionDidStart();
                });
                actionOut.onEnd((action:Action, target:Node) => {
                    (<Scene>target).callOnExit();
                    (<Scene>target).__clearFlag(NodeDirtyFlags.VISIBLE)
                });
            }
        }

    }

    /**
     * Enumeration for TransitionMove directions.
     *
     * @tsenum cc.transition.TransitionMoveDirection
     */
    export enum TransitionMoveDirection {
        LEFT = 0,
        RIGHT = 1,
        TOP = 2,
        BOTTOM = 3
    }

    /**
     * @class cc.transition.TransitionFade
     * @classdesc
     */
    export class TransitionFade extends Transition {

        /**
         *
         * @param duration
         */
        constructor(duration:number, scene?:Scene) {
            super(duration, scene);
        }

        initialize(sceneIn:Scene, sceneOut?:Scene):Transition {

            var actionIn:Action = null;
            var actionOut:Action = null;
            var director:Director = null;

            sceneIn.resetScene();
            sceneIn.setAlpha(0);

            actionIn = cc.FadeIn.create(this._duration / 1000);
            if (this._interpolator) {
                actionIn.setInterpolator(this._interpolator);
            }

            director = <Director>sceneIn.getParent();
            director._scenesActionManager.scheduleActionForNode(sceneIn, actionIn);

            if (sceneOut) {
                sceneOut.resetScene();
                actionOut = cc.FadeOut.create(this._duration / 1000);
                director._scenesActionManager.scheduleActionForNode(sceneOut, actionOut);
            }

            this.__setupActionCallbacks(actionIn, actionOut);

            return this;
        }
    }

    /**
     * @class cc.transition.TransitionMove
     * @classdesc
     *
     * Base Transition for Slide Transitions.
     */
    export class TransitionMove extends Transition {

        /**
         * Transition Slide direction.
         * @member cc.transition.TransitionMove#direction
         * @type {cc.transition.TransitionMoveDirection}
         */

        /**
         * @method cc.transition.TransitionMove#constructor
         * @param duration {number} transition duration in milliseconds.
         * @param direction {cc.transition.TransitionMoveDirection}
         * @param scene {cc.node.Scene}
         */
        constructor(duration:number, public direction:TransitionMoveDirection = TransitionMoveDirection.LEFT, scene?:Scene) {
            super(duration, scene);
        }

        /**
         * Initialize the transition.
         * @method cc.transition.TransitionMove#initialize
         * @override
         * @param sceneIn {cc.node.Scene} scene in.
         * @param sceneOut {cc.node.Scene} scene out.
         * @returns {cc.transition.TransitionMove}
         */
        initialize(sceneIn:Scene, sceneOut?:Scene):Transition {

            var actionIn:Action = null;
            var actionOut:Action = null;
            var director:Director = null;

            var _inX = 0;
            var _inY = 0;

            switch (this.direction) {
                case TransitionMoveDirection.LEFT:
                    _inX = -sceneIn._contentSize.width;
                    break;
                case TransitionMoveDirection.RIGHT:
                    _inX = sceneIn._contentSize.width;
                    break;
                case TransitionMoveDirection.TOP:
                    _inY = -sceneIn._contentSize.height;
                    break;
                case TransitionMoveDirection.BOTTOM:
                    _inY = sceneIn._contentSize.height;
                    break;
            }

            sceneIn.resetScene().setPosition(_inX, _inY);

            actionIn = new MoveAction({ from : {x: 0, y: 0}, to: {x: -_inX, y: -_inY}, relative: true}).
                setDuration(this._duration);
            if (this._interpolator) {
                actionIn.setInterpolator(this._interpolator);
            }

            director = <Director>sceneIn._parent;
            director._scenesActionManager.scheduleActionForNode(sceneIn, actionIn);

            if (sceneOut) {
                sceneOut.resetScene();

                actionOut = actionIn.clone();

                director._scenesActionManager.scheduleActionForNode(sceneOut, actionOut);
            }

            this.__setupActionCallbacks(actionIn, actionOut);

            return this;
        }
    }

    /**
     * @class cc.transition.TransitionSlideInL
     * @classdesc
     * A Transition that enters from the left. This is just some sugar to build a TransitionMove.
     */
    export class TransitionSlideInL extends TransitionMove {
        constructor(duration:number, scene?:Scene) {
            super(duration, TransitionMoveDirection.LEFT, scene);
        }
    }

    /**
     * @class cc.transition.TransitionSlideInR
     * @classdesc
     * A Transition that enters from the right. This is just some sugar to build a TransitionMove.
     */
    export class TransitionSlideInR extends TransitionMove {
        constructor(duration:number, scene?:Scene) {
            super(duration, TransitionMoveDirection.RIGHT, scene);
        }
    }

    /**
     * @class cc.transition.TransitionSlideInT
     * @classdesc
     * A Transition that enters from the top. This is just some sugar to build a TransitionMove.
     */
    export class TransitionSlideInT extends TransitionMove {
        constructor(duration:number, scene?:Scene) {
            super(duration, TransitionMoveDirection.TOP, scene);
        }
    }

    /**
     * @class cc.transition.TransitionSlideInB
     * @classdesc
     * A Transition that enters from the bottom. This is just some sugar to build a TransitionMove.
     */
    export class TransitionSlideInB extends TransitionMove {
        constructor(duration:number, scene?:Scene) {
            super(duration, TransitionMoveDirection.BOTTOM, scene);
        }
    }
}