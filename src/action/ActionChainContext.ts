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

    export class ActionChainContext {

        _chainAction : Action = null;
        _currentAction: Action = null;

        _sequenceStack : SequenceAction[] = [];
        _currentSequence : SequenceAction = null;

        constructor( public _target:cc.node.Node ) {

        }

        __action( ctor ) {

            this.action(<Action>new ctor());

            if ( ctor===cc.action.SequenceAction ) {
                this._sequenceStack.push( <SequenceAction>this._currentAction );
                this._currentSequence= <SequenceAction>this._currentAction;
            }

            return this;
        }

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

        actionPath() : ActionChainContext {
            return this.__action(cc.action.PathAction);
        }

        actionMove() : ActionChainContext {
            return this.__action(cc.action.MoveAction);
        }

        actionRotate() : ActionChainContext {
            return this.__action(cc.action.RotateAction);
        }

        actionProperty() : ActionChainContext {
            return this.__action(cc.action.PropertyAction);
        }

        actionAlpha() : ActionChainContext {
            return this.__action(cc.action.AlphaAction);
        }

        actionTint() : ActionChainContext {
            return this.__action(cc.action.TintAction);
        }

        actionScale() : ActionChainContext {
            return this.__action(cc.action.ScaleAction);
        }

        actionSequence() : ActionChainContext {
            return this.__action(cc.action.SequenceAction);
        }

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

        from( obj:any ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.from(obj);
            }
            return this;
        }

        to( obj:any ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.to(obj);
            }
            return this;
        }

        setInterpolator( i:cc.action.TimeInterpolator ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setInterpolator(i);
            }
            return this;
        }

        setRelative( b:boolean ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setRelative(b);
            }
            return this;
        }

        setDuration( d:number ) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setDuration(d);
            }
            return this;
        }

        setRepeatForever(obj?:cc.action.RepeatTimesOptions) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setRepeatForever(obj);
            }
            return this;
        }

        setRepeatTimes(n:number) : ActionChainContext {
            if ( this._currentAction ) {
                this._currentAction.setRepeatTimes(n);
            }
            return this;
        }

        then() : ActionChainContext {
            this._chainAction= this._currentAction;
            return this;
        }

        timeInfo(delay:number, duration:number, interpolator?:cc.action.TimeInterpolator) : ActionChainContext {
            this._currentAction.timeInfo( delay, duration, interpolator );

            return this;
        }

        onEnd( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onEnd(f);
            }
            return this;
        }

        onStart( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onStart(f);
            }
            return this;
        }

        onRepeat( f:ActionCallbackRepeatCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onRepeat(f);
            }
            return this;
        }

        onPause( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onPause(f);
            }
            return this;
        }

        onResume( f:ActionCallbackStartOrEndOrPauseOrResumeCallback ) {
            if ( this._currentAction ) {
                this._currentAction.onResume(f);
            }
            return this;
        }

        onApply( f:ActionCallbackApplicationCallback) {
            if ( this._currentAction ) {
                this._currentAction.onApply(f);
            }
            return this;
        }

        setSequential( b:boolean ) {
            if ( (<any>this._currentAction).setSequential ) {
                (<any>this._currentAction).setSequential(b);
            }

            return this;
        }
    }

}