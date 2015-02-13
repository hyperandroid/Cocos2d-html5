/**
 * License: see license.txt file.
 */


/// <reference path="../math/Point.ts"/>
/// <reference path="../math/path/Segment.ts"/>
/// <reference path="../math/path/SegmentBezier.ts"/>
/// <reference path="../math/Path.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="../node/sprite/Animation.ts"/>
/// <reference path="../action/Action.ts"/>
/// <reference path="../action/MoveAction.ts"/>
/// <reference path="../action/RotateAction.ts"/>
/// <reference path="../action/ScaleAction.ts"/>
/// <reference path="../action/PropertyAction.ts"/>
/// <reference path="../action/SequenceAction.ts"/>
/// <reference path="../action/TintAction.ts"/>
/// <reference path="../action/AlphaAction.ts"/>
/// <reference path="../action/AnimateAction.ts"/>
/// <reference path="../action/PathAction.ts"/>
/// <reference path="../action/JumpAction.ts"/>
/// <reference path="../action/TimeInterpolator.ts"/>

module cc {
    "use strict";

    export var __BACKWARDS_COMPATIBILITY__ = true;

    import Vector = cc.math.Vector;
    import Point = cc.math.Point;

    import Node= cc.node.Node;
    import NodeDirtyFlags= cc.node.NodeDirtyFlags;
    import Action = cc.action.Action;
    import MoveAction = cc.action.MoveAction;
    import RotateAction = cc.action.RotateAction;
    import PropertyAction = cc.action.PropertyAction;
    import SequenceAction = cc.action.SequenceAction;
    import TintAction = cc.action.TintAction;
    import AlphaAction = cc.action.AlphaAction;
    import ScaleAction = cc.action.ScaleAction;
    import AnimateAction = cc.action.AnimateAction;
    import PathAction = cc.action.PathAction;
    import JumpAction = cc.action.JumpAction;
    import SegmentBezier = cc.math.path.SegmentBezier;
    import Path = cc.math.Path;

    import TimeInterpolator = cc.action.TimeInterpolator;
    import Interpolator = cc.action.Interpolator;

    import Animation= cc.node.sprite.Animation;

    /**
     * Create a Animate like <code>AnimateAction</code> action.
     * @method cc.animate
     * @param animation {cc.node.sprite.Animation}
     * @returns {Action}
     */
    export function animate( animation : Animation ) : Action {
        return new AnimateAction( animation );
    }

    export function callFunc( fn:any, _this?:any, data? : any ) : Action {
        return new Action().
            onEnd( function( action:Action, target:Node ) : void {
                if ( typeof _this!=="undefined" ) {
                    fn.call( _this, target, data );
                } else {
                    fn( target, data );
                }
            } );
    }

    export function show( ) : Action {
        return new Action().
            onEnd( function( action:Action, target:Node ) : void {
                target.setVisible( !action._reversed );
            });
    }

    export function toggleVisibility( ) : Action {
        return new Action().
            onEnd( function( action:Action, target:Node ) : void {
                target.setVisible( !target.__isFlagSet(NodeDirtyFlags.VISIBLE) );
            });
    }

    export function hide( ) : Action {
        return new Action().
            onEnd( function( action:Action, target:Node ) : void {
                target.setVisible( action._reversed );
            });
    }

    export function place( v:Point ) : Action {
        return new Action().
            onEnd( function( action:Action, target:Node ) : void {
                target.setPosition(v.x,v.y);
            });
    }

    export function blink( timeInSecs:number, blinks:number ) {

        var originalVisibility:boolean= true;

        var action:Action= new Action().
            timeInfo(0,timeInSecs).
            onStart( function(action:Action, node:Node) {
                originalVisibility= node.__isFlagSet(NodeDirtyFlags.VISIBLE);
            }).
            onEnd( function(action:Action, node:Node) {
                node.setVisible(originalVisibility);
            });

        action.update= function(delta:number, node:Node) : any {
            delta%= 1/blinks;
            node.setVisible( delta>=1/blinks/2 );
        };

        return action;
    }

    export function jumpTo( timeInSecs:number, pos:Point, amplitude:number, jumps:number=1 ) {
        return __jump( timeInSecs, pos, amplitude, jumps, false );
    }

    export function jumpBy( timeInSecs:number, pos:Point, amplitude:number, jumps:number=1 ) {
        return __jump( timeInSecs, pos, amplitude, jumps, true );
    }

    function __jump( timeInSecs:number, pos:Point, amplitude:number, jumps:number, relative:boolean ) {
        return new JumpAction({
            position : pos,
            jumps : jumps,
            amplitude : amplitude,
            relative : relative
        }).timeInfo( 0,timeInSecs );
    }

    function __catmull(timeInSecs:number, p:Array<Point>, tension:number, relative:boolean, closed:boolean):Action {

        var segment:Path = new Path().catmullRomTo(p, closed, tension);

        return new PathAction({segment: segment}).
            setRelative(relative).
            timeInfo(0, timeInSecs );

    }

    export function cardinalSplineTo(timeInSecs:number, p:Array<Point>, tension:number, closed:boolean = false):Action {
        return __catmull(timeInSecs, p, tension, false, closed);
    }

    export function cardinalSplineBy(timeInSecs:number, p:Array<Point>, tension:number, closed:boolean = false):Action {
        return __catmull(timeInSecs, p, tension, true, closed);
    }

    export function catmullRomTo(timeInSecs:number, p:Array<Point>, closed:boolean = false):Action {
        return __catmull(timeInSecs, p, 0, false, closed);
    }

    export function catmullRomBy(timeInSecs:number, p:Array<Point>, closed:boolean = false):Action {
        return __catmull(timeInSecs, p, 0, true, closed);
    }

    function __bezier( timeInSecs : number, p : Array<Point>, relative : boolean ) : Action {
        return new PathAction({
            segment : new SegmentBezier({
                    p0 : { x:0, y:0 },
                    p1 : p[0],
                    p2 : p[1],
                    p3 : p[2]
                })
            }).
            setRelative( relative ).
            timeInfo( 0, timeInSecs );

    }

    export function bezierTo( timeInSecs : number, p : Array<Point> ) : Action {
        return __bezier( timeInSecs, p, false );
    }

    export function bezierBy( timeInSecs : number, p : Array<Point> ) : Action {
        return __bezier( timeInSecs, p, true );
    }

    function __move( timeInSecs : number, p : Point, relative : boolean ) : Action {
        return new MoveAction().
            to(p).
            setRelative( relative ).
            timeInfo( 0, timeInSecs );
    }

    /**
     * Create a moveTo like <code>MoveAction</code> action.
     * @method cc.moveTo
     * @param timeInSecs {number}
     * @param p {cc.math.Point}
     * @returns {Action}
     */
    export function moveTo( timeInSecs : number, p : Point ) : Action {
        return __move( timeInSecs, p, false );
    }

    /**
     * Create a moveBy like <code>MoveAction</code> action.
     * @method cc.moveBy
     * @param timeInSecs {number}
     * @param p {cc.math.Point}
     * @returns {Action}
     */
    export function moveBy( timeInSecs : number, p : Point ) : Action {
        return __move( timeInSecs, p, true );
    }

    function __scale( timeInSecs : number, x : number, y : number, relative : boolean ) : Action {
        return new ScaleAction().
            to( { x: x, y : y } ).
            setRelative( relative ).
            timeInfo( 0, timeInSecs );
    }

    /**
     * Create a scaleTo like <code>ScaleAction</code> action.
     * @method cc.scaleTo
     * @param timeInSecs {number}
     * @param x {number}
     * @param y {number}
     * @returns {Action}
     */
    export function scaleTo( timeInSecs : number, x : number, y? : number ) : Action {
        return __scale( timeInSecs, x, typeof y==="undefined" ? x : y, false);
    }

    /**
     * Create a scaleBy like <code>ScaleAction</code> action.
     * @method cc.scaleBy
     * @param timeInSecs {number}
     * @param x {number}
     * @param y {number}
     * @returns {Action}
     */
    export function scaleBy( timeInSecs : number, x : number, y? : number ) : Action {
        return __scale( timeInSecs, x, typeof y==="undefined" ? x : y, true);
    }

    function __rotate( timeInSecs : number, a : number, relative : boolean ) : Action {
        return new RotateAction().
            to( a ).
            setRelative( relative ).
            timeInfo( 0, timeInSecs );
    }

    /**
     * Create a rotateTo like <code>RotateAction</code> action.
     * @method cc.rotateTo
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    export function rotateTo( timeInSecs : number, a : number ) : Action {
        return __rotate( timeInSecs, a, false);
    }

    /**
     * Create a rotateBy like <code>RotateAction</code> action.
     * @method cc.rotateBy
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    export function rotateBy( timeInSecs : number, a : number ) : Action {
        return __rotate( timeInSecs, a, true);
    }

    /**
     * Create a fadeIn like <code>AlphaAction</code> action.
     * @method cc.fadeIn
     * @param timeInSecs {number}
     * @returns {cc.action.Action}
     */
    export function fadeIn( timeInSecs : number ) : Action {
        return new AlphaAction().
            from(0).
            to( 1 ).
            timeInfo( 0, timeInSecs );
    }

    /**
     * Create a fadeIn like <code>AlphaAction</code> action.
     * @method cc.fadeOut
     * @param timeInSecs {number}
     * @returns {cc.action.Action}
     */
    export function fadeOut( timeInSecs : number ) : Action {
        return new AlphaAction().
            from(1).
            to( 0 ).
            timeInfo( 0, timeInSecs );
    }

    function __fade( timeInSecs : number, a : number, relative : boolean ) : Action {
        return new AlphaAction().
            to( a/255 ).
            setRelative( relative ).
            timeInfo( 0, timeInSecs );
    }

    /**
     * Create a fadeTo like <code>AlphaAction</code> action.
     * @method cc.fadeTo
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    export function fadeTo( timeInSecs : number, a : number ) : Action {
        return __fade( timeInSecs, a, false);
    }

    /**
     * Create a fadeBy like <code>AlphaAction</code> action.
     * @method cc.fadeBy
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    export function fadeBy( timeInSecs : number, a : number ) : Action {
        return __fade( timeInSecs, a, true);
    }

    function __tint( timeInSecs : number, r : number, g : number, b : number, relative : boolean ) : Action {
        return new TintAction().
            to( { r: r/255, g : g/255, b: b/255 } ).
            setRelative( relative ).
            timeInfo( 0, timeInSecs );
    }

    /**
     * Create a tintTo like <code>TintAction</code> action.
     * @method cc.tintTo
     * @param timeInSecs {number}
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @returns {Action}
     */
    export function tintTo( timeInSecs : number, r : number, g : number, b : number ) : Action {
        return __tint( timeInSecs, r, g, b, false);
    }

    /**
     * Create a tintBy like <code>TintAction</code> action.
     * @method cc.tintBy
     * @param timeInSecs {number}
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @returns {Action}
     */
    export function tintBy( timeInSecs : number, r : number, g : number, b : number ) : Action {
        return __tint( timeInSecs, r, g, b, true);
    }

    /**
     * Reverses the target action
     * @method cc.reverseTime
     * @param action {cc.action.Action}
     * @returns {cc.reverseTime}
     */
    export function reverseTime( action : Action ) : Action {
        action.setReversedTime( !action.isReversedTime() );
        return this;
    }

    /**
     * Make an action repeat a number of times.
     * @method cc.repeat
     * @param action {cc.action.Action}
     * @param times {number}
     * @returns {Action}
     */
    export function repeat( action : Action, times : number ) : Action {
        if ( times<1 ) {
            times=1;
        }
        action.setRepeatTimes( times );
        return action;
    }

    /**
     * Make an action repeat forever.
     * @method cc.repeatForever
     * @param action {cc.action.Action}
     * @returns {Action}
     */
    export function repeatForever( action : Action ) : Action {
        action.setRepeatForever();
        return action;
    }

    /**
     * Create an action that waits the given time.
     * @method cc.delayTime
     * @param delayInSecs {number}
     * @returns {cc.action.Action}
     */
    export function delayTime( delayInSecs : number ) : Action {
        return new PropertyAction().
            from({}).
            to({}).
            timeInfo(0,delayInSecs);
    }

    export function __sequence( sequential : boolean, actions : Array<Action> ) : SequenceAction {

        var seq= new SequenceAction( {sequential : sequential} );

        if (!actions.length) {
            return null;
        }

        for( var i=0; i<actions.length; i++ ) {
            seq.addAction( actions[i] );
        }

        return seq;
    }

    /**
     * Set an action speed.
     * @method cc.speed
     * @param action {cc.action.Action}
     * @param speed {number} speed 1 is the default speed. speed 2 will make the action to take twice the time.
     * @returns {Action}
     */
    export function speed( action : Action, speed : number) : Action {
        action.setSpeed( speed );
        return action;
    }

    /**
     * Create a Sequence of Actions.
     * Actions can be other Sequences or Spawns.
     * @method cc.sequence
     * @param actions {Array<cc.action.Action>}
     * @returns {SequenceAction}
     */
    export function sequence( ...actions : Array<Action> ) : SequenceAction {
        return __sequence( true, actions );
    }

    /**
     * Create a Spawn of Actions.
     * Actions can be other Sequences or Spawns.
     * @methos cc.spawn
     * @param actions {Array<cc.action.Action>}
     * @returns {SequenceAction}
     */
    export function spawn( ...actions : Array<Action> ) : SequenceAction {
        return __sequence( false, actions );
    }


    /**
     * Apply easing to an action time.
     * @method cc.easing
     * @param action {cc.action.Action}
     * @param interpolator {cc.action.TimeInterpolator}
     * @returns {Action}
     */
    export function easing( action : Action, interpolator : TimeInterpolator ) : Action {
        return action.easing(interpolator);
    }

    function __interpolator( interpolator:TimeInterpolator, action?:Action ) : any {
        return typeof action!=="undefined" ?
            easing( action, interpolator ) :
            interpolator;
    }

    /**
     * Apply BackIn easing to an action
     * @method cc.easeBackIn
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeBackIn( action?:Action ) : any {
        return __interpolator( Interpolator.EaseBackIn(false,false), action );
    }

    /**
     * Apply easeBackOut easing to an action.
     * @method cc.easeBackOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeBackOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseBackOut(false,false), action);
    }

    /**
     * Apply easeBackInOut easing to an action.
     * @method cc.easeBackInOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeBackInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseBackInOut(false,false), action );
    }

    /**
     * Apply BounceIn easing to an action
     * @method cc.easeBounceIn
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeBounceIn( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseBounceIn(false,false), action );
    }

    /**
     * Apply easeBounceOut easing to an action.
     * @method cc.easeBounceOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeBounceOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseBounceOut(false,false), action );
    }

    /**
     * Apply easeBounceInOut easing to an action.
     * @method cc.easeBounceInOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeBounceInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseBounceInOut(false,false), action );
    }

    /**
     * Apply elasticlIn easing to an action
     * @method cc.easeElasticIn
     * @param action {cc.action.Action|number=}
     * @param period {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeElasticIn( action?:any, period?:number ) : Action {

        var int:TimeInterpolator= Interpolator.EaseElasticIn(
            ( typeof action==="undefined" ) ? <number>action : period,
            false,false);

        return __interpolator( int, action );
    }

    /**
     * Apply elasticOut easing to an action.
     * @method cc.easeElasticOut
     * @param action {cc.action.Action|number=}
     * @param period {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeElasticOut( action:any, period?:number ) : Action {
        var int:TimeInterpolator= Interpolator.EaseElasticOut(
            ( typeof action==="undefined" ) ? <number>action : period,
            false,false);

        return __interpolator( int, action );
    }

    /**
     * Apply elasticInOut easing to an action.
     * @method cc.easeElasticInOut
     * @param action {cc.action.Action|number}
     * @param period {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeElasticInOut( action:any, period?:number ) : Action {
        var int:TimeInterpolator= Interpolator.EaseElasticInOut(
            ( typeof action==="undefined" ) ? <number>action : period,
            false,false);

        return __interpolator( int, action );
    }

    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeIn
     * @param action {cc.action.Action|number}
     * @param exponent {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeIn( action:any, exponent:number ) : Action {
        var int:TimeInterpolator= Interpolator.EaseIn(
            ( typeof action==="undefined" ) ? <number>action : exponent,
            false,false);

        return __interpolator( int, action );
    }

    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeOut
     * @param action {cc.action.Action}
     * @param exponent {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeOut( action:any, exponent?:number ) : Action {
        var int:TimeInterpolator= Interpolator.EaseOut(
            ( typeof action==="undefined" ) ? <number>action : exponent,
            false,false);

        return __interpolator( int, action );
    }

    /**
     * Apply exponentialInOut easing to an action. Exponent 2.
     * @method cc.easeInOut
     * @param action {cc.action.Action}
     * @param exponent {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeInOut( action:any, exponent?:number ) : Action {
        var int:TimeInterpolator= Interpolator.EaseInOut(
            ( typeof action==="undefined" ) ? <number>action : exponent,
            false,false);

        return __interpolator( int, action );
    }

    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeExponentialIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeExponentialIn( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseExponentialIn(false,false), action );

    }

    /**
     * Apply exponentialOut easing to an action. Exponent 2.
     * @method cc.easeExponentialOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeExponentialOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseExponentialOut(false,false), action );
    }

    /**
     * Apply exponentialInOut easing to an action. Exponent 2.
     * @method cc.easeExponentialInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeExponentialInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseExponentialInOut(false,false), action );
    }

    /**
     * Apply sineIn easing to an action. Exponent 2.
     * @method cc.easeSineIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeSineIn( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseSineIn(false,false), action );
    }

    /**
     * Apply sineOut easing to an action. Exponent 2.
     * @method cc.easeSineOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeSineOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseSineOut(false,false), action );
    }

    /**
     * Apply sineInOut easing to an action. Exponent 2.
     * @method cc.easeSineInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeSineInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseSineInOut(false,false), action );
    }

    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeQuadraticActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuadraticActionIn( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseIn(2,false,false), action );
    }

    /**
     * Apply exponentialOut easing to an action. Exponent 2.
     * @method cc.easeQuadraticActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuadraticActionOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseOut(2,false,false), action );
    }

    /**
     * Apply exponentialInOut easing to an action. Exponent 2.
     * @method cc.easeQuadraticActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuadraticActionInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseInOut(2,false,false), action );
    }

    /**
     * Apply exponentialIn easing to an action. Exponent 3.
     * @method cc.easeCubicActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeCubicActionIn( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseIn(3,false,false), action );
    }

    /**
     * Apply exponentialOut easing to an action. Exponent 3.
     * @method cc.easeCubicActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeCubicActionOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseOut(3,false,false), action );
    }

    /**
     * Apply exponentialInOut easing to an action. Exponent 3.
     * @method cc.easeCubicActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeCubicActionInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseInOut(3,false,false), action );
    }

    /**
     * Apply exponentialIn easing to an action. Exponent 4.
     * @method cc.easeQuarticlActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuarticlActionIn( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseIn(4,false,false), action );
    }

    /**
     * Apply exponentialOut easing to an action. Exponent 4.
     * @method cc.easeQuarticActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuarticActionOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseOut(4,false,false), action );
    }

    /**
     * Apply exponentialInOut easing to an action. Exponent 4.
     * @method cc.easeQuarticActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuarticActionInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseInOut(4,false,false), action );
    }

    /**
     * Apply exponentialIn easing to an action. Exponent 5.
     * @method cc.easeQuinticlActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuinticActionIn( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseIn(5,false,false), action );
    }

    /**
     * Apply exponentialOut easing to an action. Exponent 5.
     * @method cc.easeQuinticlActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuinticActionOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseOut(5,false,false), action );
    }

    /**
     * Apply exponentialInOut easing to an action. Exponent 5.
     * @method cc.easeQuinticlActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    export function easeQuinticActionInOut( action?:Action ) : Action {
        return __interpolator( Interpolator.EaseInOut(5,false,false), action );
    }

}
