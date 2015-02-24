/**
 * License: see license.txt file.
 */


/// <reference path="../../../lib/jasmine/jasmine.d.ts" />
/// <reference path="../../math/Point.ts" />
/// <reference path="../../node/Node.ts" />
/// <reference path="../../node/NodeV3.ts" />
/// <reference path="../../action/Action.ts" />
/// <reference path="../../action/MoveAction.ts" />
/// <reference path="../../action/RotateAction.ts" />
/// <reference path="../../action/ScaleAction.ts" />
/// <reference path="../../action/PropertyAction.ts" />
/// <reference path="../../action/SequenceAction.ts" />
/// <reference path="../../action/TimeInterpolator.ts" />
/// <reference path="../../action_bc/Action.ts" />
/// <reference path="../../action_bc/ActionV2.ts" />
/// <reference path="../../render/RenderingContext.ts" />

module test.math {

    "use strict";

    import node= cc.node;
    import math= cc.math;
    import action= cc.action;

    import Node= node.Node;
    import Point= math.Point;
    import Vector= math.Vector;
    import Interpolator= action.Interpolator;
    import Action= action.Action;
    import MoveAction= action.MoveAction;
    import RotateAction= action.RotateAction;
    import ScaleAction= action.ScaleAction;
    import PropertyAction= action.PropertyAction;
    import SequenceAction= action.SequenceAction;
    import ActionManager= action.ActionManager;

    describe("cc.action", function () {

        beforeEach(function () {
            jasmine.addMatchers({
                toEqual: function (util, customEqualityTesters) {

                    return {
                        compare: function (actual, expected) {

                            var result:any = {
                                pass: false,
                                message: ""
                            };

                            if (actual instanceof Vector || (typeof actual.x!=="undefined" && typeof actual.y!=="undefined") ) {

                                result.pass = actual.x === expected.x && actual.y === expected.y;
                            } else {

                                result.pass = util.equals(actual, expected, customEqualityTesters);
                            }

                            if (result.pass) {
                                result.message = "ok.";
                            } else {
                                result.message = "error. " + jasmine.pp(actual) + " expected " + jasmine.pp(expected);
                            }

                            return result;
                        }
                    }

                }
            });
        });


        it("test basic action capabilities: time 0, action positions node at 'from' position", function () {

            var node = new Node();

            var ma = new MoveAction().
                from({ x: 20, y: 30}).
                to({ x: 100, y: 120}).
                timeInfo(0, 1000).
                setInterpolator(cc.action.Interpolator.Linear());
            ma.initWithTarget(node);

            // initial time
            ma.step(0, node);
            expect(node.x).toEqual(20);
            expect(node.y).toEqual(30);
        });

        it("test basic action capabilities: action over time and so is on Ended status", function () {
            var node = new Node();

            var ma = new MoveAction().
                from({ x: 20, y: 30}).
                to({ x: 100, y: 120}).
                timeInfo(0, 1000).
                setInterpolator(cc.action.Interpolator.Linear());
            ma.initWithTarget(node);

            // the actions is supposed to last for 1 sec. Firing the action 2 secs later.
            ma.step(2000, node);
            expect(node.x).toEqual(100);
            expect(node.y).toEqual(120);

            // now the action is ENDED
            //expect(ma.getStatus()).toEqual(cc.action.ActionStates.ENDED);
        });

        it("test basic action capabilities: action over time and won't be reapplied bc is ended.", function () {
            var node = new Node();

            var ma = new MoveAction().
                from({ x: 20, y: 30}).
                to({ x: 100, y: 120}).
                timeInfo(0, 1000).
                setInterpolator(cc.action.Interpolator.Linear());
            ma.initWithTarget(node);

            // the actions is supposed to last for 1 sec. Firing the action 2 secs later.
            ma.step(2000, node);

            // won't apply any new values, it is ENDED.
            ma.step(200,node);
            expect(node.x).toEqual(100);
            expect(node.y).toEqual(120);

        });

        it("test basic ActionManager chaining.", function() {

            var scene= new cc.node.Scene();
            var node= new cc.node.Node();
            scene.addChild(node);

            node.startActionChain().
                actionMove().
                    from({x:10, y:30}).
                    to({x:110, y:130}).
                    timeInfo(0,2).
                    setRepeatTimes(2).
                then().
                actionMove().
                    to({x:220, y:200}).
                    timeInfo(0,2);

            expect(scene._actionManager._actionInfos.length).toBe(3);
            scene._actionManager.step( 1 );
            expect(node.x===60 && node.y===80).toBe(true);
            scene._actionManager.step( 1 );
            scene._actionManager.step( 1.999 );
            scene._actionManager.step( 6 );
            expect(node.x===220 && node.y===200).toBe(true);
        });

        it("test basic ActionManager complex chaining.", function() {

            var scene= new cc.node.Scene();
            var node= new cc.node.Node();
            scene.addChild(node);

            node.startActionChain().
                actionMove().
                    from({x:10, y:30}).
                    to({x:110, y:130}).
                    timeInfo(0,2000).
                    setRepeatTimes(2).
                then().
                actionRotate().
                    to(180).
                    timeInfo(0,2000).
                then().
                actionMove().
                    to({x:50, y:430}).
                    timeInfo(0,2000);

            scene._actionManager.step( 1000 );
            expect(node.x===60 && node.y===80).toBe(true);
            scene._actionManager.step( 3000 );
            expect(node.x===110 && node.y===130).toBe(true);
        });

        it("test lifecycle.", function() {

            var scene= new cc.node.Scene();
            var node= new cc.node.Node();
            scene.addChild(node);

            var reps= 4;
            var duration= 1;

            var start : boolean= false;
            var repeat : boolean= false;
            var repeatCount : number= 0;
            var end : boolean= false;

            var application : boolean= false;
            var applicationCount : number = 0;

            node.startActionChain().
                actionMove().
                    from({x:10, y:30}).
                    to({x:110, y:50}).
                    timeInfo(0,duration).
                    setRepeatTimes(4).
                    onStart( function() {
                        start= true;
                    }).
                    onEnd( function() {
                        end= true;
                    }).
                    onRepeat( function( action, node, times ) {
                        repeat= true;
                        repeatCount= times;
                    }).
                actionRotate().
                    from(0).
                    to(180).
                    timeInfo(0,1).
                    onApply( (action:Action, target:Node, value:any )  => {
                        application= true;
                        applicationCount++;
                    }).
                then().
                actionMove().
                    to({x:220, y:200}).
                    timeInfo(0,2);

            scene._actionManager.step(.5);
            expect(start).toEqual(true);
            scene._actionManager.step(1.500);
            expect(repeat).toEqual(true);

            expect(application).toEqual(true);

            // an action that ends, also calls apply callback on end. So the value must be 2: 1 from the application at
            // 500 ms, and another one on end.
            expect(applicationCount).toEqual(2);
            expect(node.rotationAngle).toEqual(180);

            scene._actionManager.step(6);
            expect(end).toEqual(true);
            expect(repeatCount).toEqual(reps);

        });

        it("test relative action (ActionBy)", function() {
            var node= new Node();
            node.setPosition(200,200);

            var ma= new MoveAction().
                from({ x: 20, y : 30}).
                to({ x:100, y: 120}).
                setRelative(true).
                timeInfo(0,1000).
                setInterpolator( cc.action.Interpolator.Linear());
            ma.initWithTarget(node);

            ma.step(0,node);
            expect(node.x===220 && node.y===230).toBe(true);

            node.setRotation(20);
            var ra= new RotateAction().
                from(10).
                to(180).
                timeInfo(0,1000).
                setRelative(true).
                setInterpolator( cc.action.Interpolator.Linear());
            ra.initWithTarget(node);

            // an Action that steps above its action time, will execute all callbacks in a row:
            // START -> APPLY -> REPEAT -> END
            ra.step(1000,node);
            expect(node.rotationAngle).toEqual(200);

        });

        it("test backward action compatibility", function() {

            var actionTo : Action = cc.moveTo(2, cc.p( 400, 400));
            var actionBy : Action = cc.moveBy(1, cc.p(80, 80));
            var actionByReverse : Action = actionBy.reverse();

            var node= new Node();
            node.setPosition(200,200);


            var am= new ActionManager();

            am.scheduleActionForNode( node, actionTo.clone() );
            am.step(0);
            expect(node.x===200 && node.y===200).toBe(true);
            am.step(1);
            expect(node.x===300 && node.y===300).toBe(true);

            node.setPosition(300,300);
            am= new ActionManager();
            am.scheduleActionForNode(node, actionBy.clone());
            am.step(1);
            expect(node.x===380 && node.y===380).toBe(true);

            // create a 3 sec. action composed of 2 actions.
            var seq= cc.sequence( actionBy.clone(), actionByReverse.clone() );
            expect( seq.getNumActions() ).toEqual(2);
            expect( seq.getDuration() ).toEqual(2000);

            node.setPosition(300,300);
            // remove preivous action manager
            am= new ActionManager();
            am.scheduleActionForNode(node, seq.clone());

            am.step( 0.500 );
            am.step( 0.500 );
            expect(node.x===380 && node.y===380).toBe(true);

            am.step( 1 );
            expect(node.x===300 && node.y===300).toBe(true);

            // nothing will happen
            var noMoreApplication= true;
            seq.onApply( function() {
                noMoreApplication= false;
            });
            am.step( 1 );
            expect(noMoreApplication).toEqual(true);

        });

        it("test backward action compatibility 2", function() {
            var actionTo = cc.scaleTo(2, 0.5);
            var actionBy = cc.scaleBy(2, 2);
            var actionBy2 = cc.scaleBy(2, 0.25, 4.5);
            var seq= cc.sequence(actionBy2, cc.delayTime(1), actionBy2.reverse());

            var am= new ActionManager();

            var node= new Node();

            am.scheduleActionForNode( node, seq );

//            seq.step( 500, node );
//            seq.step( 500, node );
//            seq.step( 500, node );
//            seq.step( 500, node );
            am.step( 2.500 );
            expect( node.scaleX===1.25 && node.scaleY===5.5 ).toBe( true );
            am.step( 5.000 );
            expect( node.scaleX===1 && node.scaleY===1 ).toBe(true);
        });

        it("test backward action compatibility 3", function() {

            var actionTo = cc.scaleTo(2, 0.5);
            var actionBy = cc.scaleBy(2, 2);
            var actionBy2 = cc.scaleBy(2, 0.25, 4.5);
            var seq= cc.sequence(actionBy2, cc.delayTime(1), actionBy2.reverse());

            var scene= new cc.node.Scene();
            var node= new Node();
            scene.addChild( node );

            // schedule a sequence
            node.runAction( seq );

            scene._actionManager.step( 2.500 );
            expect( node.scaleX===1.25 && node.scaleY===5.5 ).toBe( true );
            scene._actionManager.step( 5.000 );
            expect( node.scaleX===1 && node.scaleY===1 ).toBe(true);

            // manually build a sequence. This is what the system does internally with cc.sequence objects.
            var node2= new Node();
            scene.addChild( node2 );
            node2.startActionChain().
                action( actionBy2.clone() ).
                then().
                action( cc.delayTime(1) ).
                then().
                action( actionBy2.clone().reverse() );
            scene._actionManager.step( 2.500 );
            expect( node2.scaleX===1.25 && node2.scaleY===5.5 ).toBe( true );
            scene._actionManager.step( 5.000 );
            expect( node2.scaleX===1 && node2.scaleY===1 ).toBe(true);
        });

        it("Sequencing times V4", function() {


            var node: Node = new Node();
            var scene= new cc.node.Scene();
            scene.addChild(node);

            node.startActionChain().
                actionSequence().
                    actionRotate().
                        from(0).
                        to(360).
                        setRelative(true).
                        setDuration(1).
                    actionSequence().
                        actionScale().
                            to( { x:.5, y:.5 } ).
                            setRelative(true).
                            setDuration(1.500).
                        actionRotate().
                            to(0).
                            setDuration(1.500).
                            setRelative(true).
                    endSequence().
                    actionMove().
                        to( { x : 300, y : 300} ).
                        setDuration(2).
                        setRelative(true).
                endSequence();

            var seq : cc.action.SequenceAction= <cc.action.SequenceAction>scene._actionManager._actionInfos[1]._action;

            expect(seq._actions[0]._startTime).toBe(0);
            expect(seq._actions[1]._startTime).toBe(1000);
            expect(seq._actions[1]._duration).toBe(3000);

            expect(seq._actions[2]._startTime).toBe(4000);

            expect(seq._duration).toBe(6000);

        });

        it("Sequencing times V3", function() {
            var seq= cc.sequence(
                        cc.rotateBy(1, 360),
                        cc.sequence(
                                cc.scaleBy(1.5,.5,.5),
                                cc.rotateBy(1.5,0)
                        ),
                        cc.moveBy(2, new cc.math.Vector(100,100))
                    );

            var node= new Node();

            var am : ActionManager= new cc.action.ActionManager();
            am.scheduleActionForNode(node,seq);

            // _actionInfos[0] is the scheduler always.
            var seq : cc.action.SequenceAction= <cc.action.SequenceAction>am._actionInfos[1]._action;

            expect(seq._actions[0]._startTime).toBe(0);
            expect(seq._actions[1]._startTime).toBe(1000);
            expect(seq._actions[1]._duration).toBe(3000);

            expect(seq._actions[2]._startTime).toBe(4000);

            expect(am._actionInfos[1]._action._duration).toBe(6000);

        });

        describe("Instant actions", function() {

            var fired = [false,false,false,false,false];
            var order = [];
            var cf0 : Action;
            var cf1 : Action;
            var cf2 : Action;

            beforeEach( function() {
                fired = [false,false,false,false,false];
                order = [];

                cf0= cc.CallFunc.create( function(target) {
                    fired[0]= true;
                    order.push(1);
                } );
                cf1= cc.callFunc( function(target) {
                    fired[1]= true;
                    order.push(2);
                } );
                cf2= cc.callFunc( function(target) {
                    fired[2]= true;
                    order.push(3);
                } );
            });

            it("fires callbacks", function() {

                var action= new Action().timeInfo(0, 1);
                var seq= cc.sequence( cf0,action,cf1,action.reverse(),cf2);
                seq.step(4, null);

                expect( fired[0]&&fired[1]&&fired[2] ).toBe(true);
                expect( order[0]===1 && order[1]===2 && order[2]===3 ).toBe(true);

            });

            it("fires callbacks reverse", function() {

                var action= new Action().timeInfo(0, 1);
                var seq= cc.sequence( cf0,action,cf1,action.reverse(),cf2).reverse();
                seq.step(4, null);

                expect( fired[0]&&fired[1]&&fired[2] ).toBe(true);

                // callbacks have been called inversely too !!
                expect( order[0]===3 && order[1]===2 && order[2]===1 ).toBe(true);

            });

        });

        describe("sequence bug", function() {

            it("sequence repeat and reverse is original values", function() {
                var node = new Node();

                var r = cc.repeat(cc.rotateBy(2, 180), 1);
                var s00 = cc.scaleBy(1.5, 0, 1);
                var s01 = cc.scaleBy(1.5, 1, 1);
                var seq0 = cc.sequence(r, s00, s01, cc.tintBy(2, -128, -128, -128));
                var seq1 = seq0.reverse();
                var seq:Action = cc.repeatForever(cc.sequence(seq0, seq1));

                var time = 0;
                while (time < 13952) {
                    seq.step(0.016, node);
                    time += 16;
                }

                seq.step(0.060, node);

                expect(node.rotationAngle ).toEqual( 0 );
                expect(node.scaleX === 1 && node.scaleY === 1).toBe(true);
            });

            it("sequence repeat and reverse is original values (2)", function() {
                var node = new Node();
                node.setPosition(50,100);

                var jump1 = cc.JumpBy.create(4, cc.p(-800 + 80, 0), 100, 4);
                var jump2 = jump1.reverse();
                var rot1 = cc.RotateBy.create(4, 360 * 2);
                var rot2 = rot1.reverse();

                var seq3_1 = cc.Sequence.create(jump2, jump1);
                var seq3_2 = cc.Sequence.create(rot1, rot2);
                var spawn = cc.Spawn.create(seq3_1, seq3_2);

                var seq= cc.Speed.create(cc.RepeatForever.create(spawn), 1.0);

                var time = 0;
                while (time < 7990) {
                    seq.step(0.017, node);
                    time += 17;
                }

                seq.step(0.010, node);

                expect(node.x).toEqual(50);
                expect(node.y).toEqual(100);

            });
        });

        describe("Property Action", function() {

            it("Basic usage, 1 property", function() {
                var pa0:cc.action.PropertyAction = new PropertyAction({
                    duration: 2,
                    from: {
                        x: 5
                    },
                    to: {
                        x: 10
                    }
                });

                var obj = {
                    x: 0
                };

                pa0.step(2, obj);

                expect(obj.x).toEqual(10);
            });

            it("Usage 2, 'from' value inferred from target object", function() {
                var pa0:cc.action.PropertyAction = new PropertyAction({
                    duration: 2,
                    to: {
                        x: 10
                    }
                });

                var obj = {
                    x: 1
                };

                pa0.initWithTarget(obj);

                pa0.step(0, obj);
                expect(obj.x).toEqual(1);

                pa0.step(2, obj);
                expect(obj.x).toEqual(10);
            });

            it("Usage 3, lazy 'to' value inferred from target", function() {
                var pa0:cc.action.PropertyAction = new PropertyAction({
                    duration: 2,
                    from: {
                        x: 3
                    }
                });

                var obj = {
                    x: 10
                };

                pa0.initWithTarget(obj);

                pa0.step(0, obj);
                expect(obj.x).toEqual(3);
                pa0.step(2, obj);
                expect(obj.x).toEqual(10);
            });

            it("Usage 4, multiproperties with lazy values", function() {

                var pa0:cc.action.PropertyAction = new PropertyAction({
                    duration: 2,
                    from : {
                        y:7
                    },
                    to: {
                        x: 10
                    }
                });

                var obj = {
                    x: 100,
                    y: 200
                };

                pa0.initWithTarget(obj);

                pa0.step(2, obj);
                expect(obj.x).toEqual(10);
                expect(obj.y).toEqual(200);
            });

            it("Usage 5, nested props", function() {

                var pa0:cc.action.PropertyAction = new PropertyAction({
                    duration: 2,
                    from : {
                        "p0.y":7
                    },
                    to: {
                        "p1.x": 10
                    }
                });

                var obj = {
                    p0 : {
                        x: 100,
                        y: 0
                    },
                    p1 : {
                        x: 0,
                        y: 200
                    }
                };


                pa0.initWithTarget(obj);

                pa0.step(2, obj);
                expect(obj.p1.x).toEqual(10);
                expect(obj.p0.y).toEqual(0);
            });
        });
    });
}