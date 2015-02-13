/**
 * License: see license.txt file.
 */

/// <reference path="./SpriteFrame.ts"/>
/// <reference path="../../render/Texture2D.ts"/>

module cc.node.sprite {

    import Texture2D= cc.render.Texture2D;

    export interface AnimationCacheData {
        [v:string] : Animation;
    }

    /**
     * @class cc.node.sprite.AnimationCache
     */
    export class AnimationCache {

        _animations : AnimationCacheData= {};

        constructor() {
        }

        addAnimation( ) {

        }
    }

    var __index : number= 0;

    /**
     * @class cc.node.sprite.Animation
     * @classdesc
     *
     * An animation is a set of SpriteFrames, playback duration and a loop value. A <code>cc.action.AnimateAction</code>
     * will play the sequence that the animation defines.
     * SpriteFrames roughly define rectangles in images. So if each of these frames is set for a node at a given speed,
     * we get the notion of a sprite animation.
     */
    export class Animation {

        /**
         * A collection of SpriteFrames to define an animation.
         * @type {Array<cc.node.sprite.SpriteFrame>}
         * @member cc.node.sprite.Animation#_frames
         * @private
         */
        _frames:SpriteFrame[] = [];

        /**
         * How many times the sequence will be played.
         * @type {number}
         * @member cc.node.sprite.Animation#_loops
         * @private
         */
        _loops:number = 1;

        /**
         * Set the sprite back to the original frame after the animation ends playing.
         * @type {number}
         * @member cc.node.sprite.Animation#_restoreOriginalFrame
         * @private
         */
        _restoreOriginalFrame:boolean = false;

        /**
         * Time to change to the next frame. Defaults to 0.150 seconds. Value in milliseconds.
         * @member cc.node.sprite.Animation#_delayPerUnit
         * @type {number}
         * @private
         */
        _delayPerUnit:number = 150/cc.action.TIMEUNITS;

        /**
         * Animation name. By default will be "animationXXX" where XXX is an index sequence value.
         * @member cc.node.sprite.Animation#_name
         * @type {string}
         * @private
         */
        _name : string = null;

        /**
         * Create a new Animation instance.
         * @method cc.node.sprite.Animation#constructor
         */
        constructor() {

        }

        /**
         * Add an animation frame.
         * @method cc.node.sprite.Animation#addFrame
         * @param f {cc.node.sprite.SpriteFrame}
         */
        addFrame( f : SpriteFrame ) : Animation {
            this._frames.push( f );
            return this;
        }

        /**
         * Add a collection of animation frames.
         * @method cc.node.sprite.Animation#addFrames
         * @param f {Array<cc.node.sprite.SpriteFrame>}
         */
        addFrames( f : SpriteFrame[] ) : Animation {
            for( var i=0; i<f.length; i++ ) {
                this.addFrame( f[i] );
            }
            return this;
        }

        /**
         * Set the amount of time each frame of the animation will be shown.
         * @method cc.node.sprite.Animation#setDelayPerUnit
         * @param d {number} delay in seconds.
         */
        setDelayPerUnit( d : number ) : Animation {
            this._delayPerUnit= d;
            return this;
        }

        /**
         * Set the number of animation repetitions. If <1, it will be set to 1.
         * @method cc.node.sprite.Animation#setLoops
         * @param l {number} number of loops
         */
        setLoops( l :number ) : Animation {
            if ( l<1 ) {
                l= 1;
            } else {
                l=l|0;
            }
            this._loops= l;

            return this;
        }

        /**
         * Restore the original frame when the animation ends.
         * @method cc.node.sprite.Animation#setRestoreOriginalFrame
         * @param r {boolean}
         */
        setRestoreOriginalFrame( r : boolean ) :Animation{
            this._restoreOriginalFrame= r;
            return this;
        }

        /**
         * Load an image, create a texture, a frame and then add the resulting SpriteFrame to the animation.
         * @method cc.node.sprite.Animation#addSpriteFrameWithFile
         * @deprecated
         * @param f {string} valid url string for an image resource.
         */
        addSpriteFrameWithFile( f : string ) {
            var me= this;
            var img= new Image();
            img.onload= function(e) {
                var t2d : Texture2D= new Texture2D(img, f);
                var sf= new SpriteFrame(t2d);
                me.addFrame(sf);
            };
            img.src= f;
        }

        /**
         * Get the animation duration. It is the number of frames * delayPerUnit
         * @method cc.node.sprite.Animation#getDuration
         * @returns {number} animation duration in seconds.
         */
        getDuration() : number {
            return this._delayPerUnit * this._frames.length;
        }

        /**
         * Get the number of frames in the Animation.
         * @method cc.node.sprite.Animation#getSize
         * @returns {number}
         */
        getSize() : number {
            return this._frames.length;
        }

        /**
         * Get an SpriteFrame from the array at an index.
         * @method cc.node.sprite.Animation#getSpriteFrameAtIndex
         * @param i {number}
         * @returns {cc.node.sprite.SpriteFrame}
         */
        getSpriteFrameAtIndex( i : number ) : SpriteFrame {
            return this._frames[i];
        }

        /**
         * Set this animation to loop forever.
         * @method cc.node.sprite.Animation#setLoopForever
         * @returns {cc.node.sprite.Animation}
         */
        setLoopForever() : Animation {
            this._loops= Number.MAX_VALUE;
            return this;
        }

        /**
         * Create a copy of this Animation.
         * The new Animation name will be the original+<an index sequence value>
         * @method cc.node.sprite.Animation#clone
         * @returns {cc.node.sprite.Animation}
         */
        clone() : Animation {

            var animation : Animation = new Animation();
            animation._frames= Array.prototype.slice.call(this._frames);
            animation._delayPerUnit= this._delayPerUnit;
            animation._loops= this._loops;
            animation._restoreOriginalFrame= this._restoreOriginalFrame;
            animation._name= this._name+__index++;

            return animation;
        }

        /**
         * Reverse this animation. The SpriteFrame collection is reversed.
         * @method cc.node.sprite.Animation#reverse
         * @returns {cc.node.sprite.Animation}
         */
        reverse() : Animation {
            this._frames= this._frames.reverse();
            return this;
        }
    }
}