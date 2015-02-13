/**
 * License: see license.txt file
 */

/// <reference path="../math/Color.ts"/>
/// <reference path="../math/Point.ts"/>
/// <reference path="../node/Scene.ts"/>
/// <reference path="../node/Sprite.ts"/>
/// <reference path="../node/Director.ts"/>
/// <reference path="../node/sprite/Animation.ts"/>
/// <reference path="../util/Class.ts"/>
/// <reference path="../plugin/audio/AudioManager.ts"/>

module cc {

    import Color= cc.math.Color;
    import RGBAColor= cc.math.RGBAColor;
    import Point= cc.math.Point;
    import Vector= cc.math.Vector;

    export function rect( x:number, y:number, w:number, h:number ) : cc.math.Rectangle {
        return new cc.math.Rectangle(x,y,w,h);
    }

    /**
     * Create a new Point/Vector object.
     * @param x {number}
     * @param y {number}
     * @returns {cc.math.Vector}
     * @deprecated call <code>new cc.math.Vector(x,y);</code>
     * @see {cc.math.Vector}
     */
    export function p( x:number, y:number ) {
        return new Vector( x, y );
    }

    export function size(w:number, h:number) {
        return new cc.math.Dimension(w,h);
    }

    /**
     * create a new Color full opaque.
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @returns {cc.math.Color}
     * @deprecated call <code>new cc.math.Color(r,g,b,a?);</code>
     * @see {cc.math.Color}
     */
    export function c3b( r:number, g:number, b:number ) {
        return new cc.math.Color( r/255, g/255, b/255 );
    }

    /**
     * create a new Color with RGBA
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @param a {number}
     * @returns {cc.math.Color}
     * @deprecated call <code>new cc.math.Color(r,g,b,a);</code>
     * @see {cc.math.Color}
     */
    export function c4b( r:number, g:number, b:number, a:number ) {
        return new cc.math.Color( r/255, g/255, b/255, a/255 );
    }

    /**
     *
     * @param r {number|string|{r:number,g:number,b:number,a:number=}}
     * @param g {number} 0..255
     * @param b {number} 0..255
     * @param a {number=} 0..255
     * @returns {*}
     */
    export function color(r:any, g:number, b:number, a?:number) {
        if ( typeof r === 'undefined') {
            return Color.BLACK;
        }
        if (typeof r==='string') {
            return Color.fromStringToColor(<string>r);
        }
        if (typeof r==='object') {
            return Color.createFromRGBA(<RGBAColor>r);
        }

        if (typeof a==="undefined") {
            a= 255;
        }
        return new Color( r/255,g/255,b/255,a/255 );
    }

    /**
     * @name Director
     * @memberOf cc
     * @deprecated
     */
    export module Director {

        var directorInstance : cc.node.Director = null;

        /**
         * Get always the same director instance.
         * @method cc.Director.getInstance
         * @returns {cc.node.Director}
         */
        export function getInstance() {

            if ( directorInstance===null ) {
                directorInstance= new cc.node.Director();
            }

            return directorInstance;
        }
    }

    export var director:cc.node.Director= null;

    export function scene() {
        return new cc.node.Scene( );
    }
    export var Scene= cc.node.Scene;

    export function animation() {
        return new cc.node.sprite.Animation();
    }

    export function sprite(p) {
        return new cc.node.Sprite(p);
    }
    export var Sprite= cc.node.Sprite;
    export var SpriteBatchNode= cc.node.SpriteBatchNode;

    export function layer() {
        return new cc.node.Node( );
    }
    export var Layer= cc.node.Node;

    export var Node= cc.node.Node;

    export var LabelBMFont= cc.widget.Label;
    export var LabelTTF= cc.widget.LabelTTF;

    export function Animation( frames:cc.node.sprite.SpriteFrame[], duration:number ) {
        var animation= new cc.node.sprite.Animation();
        animation.addFrames( frames );
        animation.setDelayPerUnit( duration );
        return animation;
    }

    (<any>Animation).create = cc.animation;

    export var TransitionSlideInL = function( time_in_secs:number, scene?:cc.node.Scene ) {
        return new cc.transition.TransitionSlideInL( time_in_secs*1000, scene );
    };

    export var TransitionSlideInR = function( time_in_secs:number, scene?:cc.node.Scene ) {
        return new cc.transition.TransitionSlideInR( time_in_secs*1000, scene );
    };

    export var TransitionSlideInT = function( time_in_secs:number, scene?:cc.node.Scene ) {
        return new cc.transition.TransitionSlideInT( time_in_secs*1000, scene );
    };

    export var TransitionSlideInB  = function( time_in_secs:number, scene?:cc.node.Scene ) {
        return new cc.transition.TransitionSlideInB( time_in_secs*1000, scene );
    };

    export var TransitionFade = function( time_in_secs:number, scene?:cc.node.Scene ) {
        return new cc.transition.TransitionFade( time_in_secs*1000, scene );
    };

    export var TEXT_ALIGNMENT_LEFT= 0;
    export var TEXT_ALIGNMENT_CENTER= 1;
    export var TEXT_ALIGNMENT_RIGHT= 2;

    export var VERTICAL_TEXT_ALIGNMENT_TOP = 0;
    export var VERTICAL_TEXT_ALIGNMENT_CENTER = 1;
    export var VERTICAL_TEXT_ALIGNMENT_BOTTOM = 2;

    export var pAdd= cc.math.Vector.add;

    export function clampf(value, min_inclusive, max_inclusive) {
        if (min_inclusive > max_inclusive) {
            var temp = min_inclusive;
            min_inclusive = max_inclusive;
            max_inclusive = temp;
        }
        return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
    }

    export function pClamp(p, min_inclusive, max_inclusive) {
        return cc.p(cc.clampf(p.x, min_inclusive.x, max_inclusive.x), cc.clampf(p.y, min_inclusive.y, max_inclusive.y));
    }

    export var audioEngine= (function() {

        var ae:cc.plugin.audio.AudioManager= new cc.plugin.audio.AudioManager();

        return {
            playMusic : function( url ) {
                ae.setMusic(url, true);
            },
            stopMusic : function() {
                ae.stopMusic();
            },
            stopAllEffects : function() {
                ae.stopEffects();
            },
            playEffect : function(name) {

                var r= cc.plugin.asset.AssetManager._resources[name];
                if ( r ) {
                    ae.playEffect(r);
                }
            },
            setMusicVolume : function( vol ) {
                ae.setMusicVolume(vol);
            }
        }

    }) ();

    export function rectIntersectsRect( r0:cc.math.Rectangle, r1:cc.math.Rectangle ) {
        return r0.intersectsWith(r1);
    }

    export var KEY= cc.input.KEYS;

    // blending constants. Use node.setCompositeOperation instead.
    export var ONE = 1;
    export var ZERO = 0;
    export var SRC_ALPHA = 0x0302;
    export var SRC_ALPHA_SATURATE = 0x308;
    export var SRC_COLOR = 0x300;
    export var DST_ALPHA = 0x304;
    export var DST_COLOR = 0x306;
    export var ONE_MINUS_SRC_ALPHA = 0x0303;
    export var ONE_MINUS_SRC_COLOR = 0x301;
    export var ONE_MINUS_DST_ALPHA = 0x305;
    export var ONE_MINUS_DST_COLOR = 0x0307;
    export var ONE_MINUS_CONSTANT_ALPHA	= 0x8004;
    export var ONE_MINUS_CONSTANT_COLOR	= 0x8002;

}