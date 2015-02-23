/**
 * License: see license.txt file
 */

/// <reference path="./Action.ts"/>
/// <reference path="../node/sprite/Animation.ts"/>
/// <reference path="../node/sprite/SpriteFrame.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="../node/Sprite.ts"/>

module cc.action {

    import Action= cc.action.Action;
    import Node= cc.node.Node;
    import Sprite= cc.node.Sprite;
    import SpriteFrame= cc.node.sprite.SpriteFrame;
    import Animation= cc.node.sprite.Animation;

    /**
     * @class cc.action.AnimateActionInitializer
     * @extends ActionInitializer
     * @interface
     * @classdesc
     *
     * AnimateAction initializer object.
     * AnimateAction objects don't have a from and to clauses, but a animation name.
     *
     */
    export interface AnimateActionInitializer extends ActionInitializer {

        /**
         * Animation name.
         * The animation must exist in the AssetManager.
         * @member cc.action.AnimateActionInitializer#animationName
         */
        animationName : string;
    }

    /**
     * @class cc.action.AnimateAction
     * @extends cc.action.Action
     * @classdesc
     * 
     * This action changes Sprite's images in a time basis.
     * <p>
     *     It handles an instance of <code>cc.node.sprite.Animation</code> which is collection of SpriteFrame objects.
     *     Each SpriteFrame references an image and a rect on the image. The action, selects a SpriteFrame on
     *     the Animation based on time keyframing.
     * <p>
     *     Even though an Animation object has control over how many times the animation will be repeated, calling
     *     <code>action.setRepeatTimes(times);</code> or <code>action.setRepeatForever();</code> will override the
     *     Animation value in favor of the newly set one.
     * <p>
     *     Warning. This action expects as its target a @link {cc.node.Sprite} instance and not a @link {cc.node.Node}
     *     like the other actions. The target supplied to this Action must have a <code>setSpriteFrame</code> method
     *     otherwise an undefined error will be thrown.
     *
     *
     * 
     * @see {cc.node.sprite.Animation}
     * 
     */
    export class AnimateAction extends Action {

        /**
         * Original SpriteFrame for the Action target node. 
         * @member cc.action.AnimateAction#_originalSpriteFrame
         * @type {cc.node.sprite.SpriteFrame}
         * @private
         */
        _originalSpriteFrame : SpriteFrame = null;

        /**
         * Animation.
         * @member cc.action.AnimateAction#_animation
         * @type {cc.node.sprite.Animation}
         * @private
         */
        _animation: Animation = null;

        /**
         * Create a new Animate action instance.
         * @method cc.action.AnimateAction#constructor
         * @param data {cc.node.sprite.Animation}
         */
        constructor( data? : AnimateActionInitializer|Animation ) {
            super();

            if(data) {
                if (data instanceof cc.node.sprite.Animation) {
                    this.setAnimation(<Animation>data);
                } else {
                    this.__createFromInitializer(<AnimateActionInitializer>data);
                }
            }
        }

        /**
         * Initialize the action with an initializer Object
         * @method cc.action.AnimateAction#__createFromInitializer
         * @param data {cc.action.AnimateActionInitializer}
         */
        __createFromInitializer(data?:AnimateActionInitializer ) {
            super.__createFromInitializer( data );
            this.setAnimation( cc.plugin.asset.AssetManager.getAnimationById( data.animationName ) );
        }

        /**
         * Set the Animation object instance.
         * @method cc.action.AnimateAction#setAnimation
         * @param data {cc.node.sprite.Animation}
         */
        setAnimation( data : Animation ) : AnimateAction {
            this._animation= data;
            this.setDuration(0);
            this.setRepeatTimes(data._loops);

            return this;
        }

        /**
         * Set the Animate action duration.
         * Will always fallback to set the Animation duration.
         * @method cc.action.AnimateAction##setDuration
         * @param d
         */
        setDuration( d : number ) :AnimateAction {
            if ( this._animation ) {
                super.setDuration( this._animation.getDuration() );
            }

            return this;
        }

        /**
         * Update target Node's SpriteFrame.
         * {@link cc.action.Action#update}
         * @method cc.action.AnimateAction#update
         * @override
         * @return {number} Applied transparency value.
         */
        update(normalizedTime:number, target:Node):any {

            var index:number = ((normalizedTime * this._animation.getSize())|0)%this._animation.getSize();

            if ( index>=0 && index<this._animation.getSize() ) {
                (<Sprite>target).setSpriteFrame(this._animation.getSpriteFrameAtIndex(index));
            }

            return index;
        }

        /**
         * Calculate one repetition duration. Must be explictly set for V3 bacwards compatiblity and
         * a call to Animate with an still loading animation. This is messy and wrong, but must be.
         * @method cc.action.AnimateAction#getOneRepetitionDuration
         * @returns {number}
         */
        getOneRepetitionDuration():number {
            return ( this._animation.getDuration() + this._delayAfterApplication ) * this._speed * cc.action.TIMEUNITS;
        }

        /**
         * This method does nothing.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.AnimateAction#solveInitialValues
         * @override
         */
        solveInitialValues(node:Node) {
        }

        /**
         * Initialize the action with a target node.
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.AnimateAction#initWithTarget
         * @override
         */
        initWithTarget(node:Node):void {
            this._originalSpriteFrame = (<Sprite>node)._spriteFrame;
            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.AnimateAction#to
         * @override
         */
        to(a:Animation):AnimateAction {
            this.setAnimation(a);
            return this;
        }

        /**
         * Specific clone implementation function
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.AnimateAction#__cloneImpl
         * @override
         * @private
         */
        __cloneImpl():AnimateAction {

            var copy : AnimateAction = new AnimateAction();
            copy.to(this._animation.clone());
            copy._originalSpriteFrame= this._originalSpriteFrame;

            this.__genericCloneProperties(copy);

            return copy;
        }

        /**
         * Stop the Action. If at Action initialization time a originalSpriteFrame was set, and the Animation specifies
         * restore original frame, the original SpriteFrame is set.
         * @param node
         */
        stop( node : Node ) {
            super.stop(node);
            if ( this._animation._restoreOriginalFrame ) {
                (<Sprite>node).setSpriteFrame( this._originalSpriteFrame );
            }
        }

        /**
         * Get current action state initializer object.
         * @method cc.action.AnimateAction#getInitializer
         * @returns {cc.action.AnimateActionInitializer}
         */
        getInitializer() : AnimateActionInitializer {
            var init:AnimateActionInitializer= <AnimateActionInitializer>super.getInitializer();
            init.type="AnimateAction";
            init.animationName= this._animation._name;

            return init;
        }

    }

}