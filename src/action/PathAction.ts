/**
 * License: see license.txt file
 */

/// <reference path="../math/Point.ts"/>
/// <reference path="../math/path/Segment.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="./Action.ts"/>

module cc.action {

    "use strict";

    import Point = cc.math.Point;
    import Vector= cc.math.Vector;
    import Segment= cc.math.path.Segment;

    import Node = cc.node.Node;
    import Action = cc.action.Action;

    var __PathActionUpdateValue : cc.math.Point= { x : 0, y : 0 };

    /**
     * @class cc.action.PathActionInitializer
     * @interface
     * @classdesc
     *
     * PathAction initializer object.
     */
    export interface PathActionInitializer extends ActionInitializer {

        /**
         * Start x position
         * @member cc.action.PathActionInitializer#segment
         * @type {cc.math.path.Segment}
         *
         * pending: SegmentInitializer
         *
         */
        segment : Segment;

        /**
         * Is action relative ?
         * @member cc.action.PathActionInitializer#relative
         * @type {boolean}
         */
        relative? : boolean;
    }

    /**
     * @class cc.action.PathAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's position.
     * The action will traverse a Segment path which can be a simple line or a complex path built out of a collection
     * of Segments and Paths. When traversing through out a simple linear path, prefer MoveAction in favor of this one.
     *
     * <p>
     *     Warning
     * <p>
     * The behavior for relative PathAction (equivalent for example to BezierBy in CocosJS V3 API) is intuitive: the
     * node will add the resulting traversal path to the Node position.
     * For non relative PathActions (for example, the older V3 BezierTo action) is not that clear:
     * + upon a call to <code>initWithNode</code> the Path points will have substracted the current node position and
     *   the first path point will be 0,0 (like in relative actions).
     * + upon a call to <code>update</code> the Path will be solved, and then will have added the node's position
     *   captured during the call to <code>initWithNode</code>.
     *
     * This means, the absolute PathAction will be treated as a relative action, with a modified path.
     *
     * @see cc.action.MoveAction
     */
    export class PathAction extends Action {

        /**
         * Node's original x position.
         * @member cc.action.PathAction#_originalX
         * @type {number}
         * @private
         */
        _originalX : number = 0;

        /**
         * Node's original y position.
         * @member cc.action.PathAction#_originalX
         * @type {number}
         * @private
         */
        _originalY : number = 0;

        /**
         * Segment to traverse.
         * @member cc.action.PathAction#_segment
         * @type {cc.math.path.Segment}
         * @private
         */
        _segment : Segment = null;

        /**
         * Has the path been adjusted.
         * @member cc.action.PathAction#_pathAdjusted
         * @type {boolean}
         * @private
         */
        _pathAdjusted : boolean = false;

        /**
         * Is the target node tangentially rotated while traversing the path ?
         * @member cc.action.PathAction#_adjustTangentialRotation
         * @type {boolean}
         * @private
         */
        _adjustTangentialRotation : boolean = false;

        /**
         * If the target node is tangentially rotated, will rotation angles be -PI..PI or constrained to always show
         * the target vertically not flipped ?
         * @member cc.action.PathAction#_tangentialRotationFullAngle
         * @type {boolean}
         * @private
         */
        _tangentialRotationFullAngle : boolean = false;

        /**
         * Tangential rotation must know whether the animation sprite frames are left-to-right drawn or right-to-left.
         * By default left-to-right is assumed, but in case it is not, this variable must be set to false.
         * @member cc.action.PathAction#_spriteOrientationLR
         * @type {boolean}
         * @private
         */
        _spriteOrientationLR:boolean= true;

        /**
         * Build a new PathAction
         * @method cc.action.PathAction#constructor
         * @param data {cc.action.PathActionInitializer=}
         */
        constructor( data? : PathActionInitializer ) {
            super();

            if (typeof data !== "undefined") {
                this.__createFromInitializer(data);
            }
        }

        __createFromInitializer(data?:PathActionInitializer ) {
            super.__createFromInitializer( data );

            // BUGBUG initializer must have serializable data.
            console.log("Path initializer not yet implemented.");
            this._segment= data.segment;

        }

        /**
         * Update target Node's position.
         * {@link cc.action.Action#update}
         * @method cc.action.PathAction#update
         * @override
         * @return {cc.math.Point} new Node position.
         */
        update(delta:number, node : Node ) : any {

            var pos: Point= this._segment.getValueAt(delta);
            var x = pos.x;
            var xx= x;
            var y = pos.y;
            var yy= y;

            x+= this._originalX;
            y+= this._originalY;

            //if ( this._relativeAction ) {
                if ( this._reversed ) {
                    var fp= this._segment.getEndingPoint();
                    x-= fp.x;
                    y-= fp.y;
                }
            //}

            node.setPosition( x, y );

            __PathActionUpdateValue.x= x;
            __PathActionUpdateValue.y= y;

            if ( (<any>node).setFlippedX && this._adjustTangentialRotation ) {
                var delta2= delta-.001;
                if ( delta2>=0 ) {
                    var pos2 = this._segment.getValueAt(delta2);
                    var angle = Math.PI - Math.atan2(pos2.y - yy, pos2.x - xx);

                    node.rotationAngle = this.__getTangentialAngle(node, xx > pos2.x, angle);
                }
            }

            return __PathActionUpdateValue;
        }

        __getTangentialAngle( node:Node, lefttoright:boolean, angle:number ) {

            if ( !this._tangentialRotationFullAngle ) {
                if (this._spriteOrientationLR) {
                    if (lefttoright) {
                        (<any>node).setFlippedX(false);
                    } else {
                        (<any>node).setFlippedX(true);
                        angle += Math.PI;
                    }
                } else {
                    if (lefttoright) {
                        (<any>node).setFlippedX(true);
                        angle -= Math.PI;
                    } else {
                        (<any>node).setFlippedX(false);
                    }
                }
            }

            return angle*180/Math.PI;
        }

        restart() : PathAction {
            super.restart();
            this._pathAdjusted= false;
            return this;
        }

        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.PathAction#solveInitialValues
         * @override
         */
        solveInitialValues(node : Node) {

            if ( !this.isRelative() && !this._pathAdjusted ) {

                this._pathAdjusted= true;

                // older Cocos2D implelentation expects the following:
                // current node position will be the first control point of the Segment.
                // all other segment points will have node's position substracted.
                var points : Array<Point> = this._segment.getControlPoints();
/*
                if ( points.length ) {
                    for (var i = 0; i < points.length; i++) {
                        points[i].x -= node.x;
                        points[i].y -= node.y;
                    }
                }
*/
                this._segment.setDirty();
                this._segment.getLength();

                // if tangential rotation is enabled, calculate initial rotation angle.
                if ( this._adjustTangentialRotation && (<any>node).setFlippedX ) {

                    var pos= this._segment.getValueAt(.001);
                    var xx= pos.x;
                    var yy= pos.y;

                    pos = this._segment.getValueAt(0);
                    var angle = Math.PI - Math.atan2(pos.y - yy, pos.x - xx);

                    node.rotationAngle = this.__getTangentialAngle(node, xx > pos.x, angle);
                }


            }
        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.PathAction#initWithTarget
         * @override
         */
        initWithTarget( node : Node ) {

            if ( this.isRelative() ) {
                this._originalX = node.x;
                this._originalY = node.y;
            } else {
                this._originalX = 0;
                this._originalY = 0;
                var points= this._segment.getControlPoints();
                points[0].x= node.x;
                points[0].y= node.y;
            }

            this.solveInitialValues(node);
        }

        /**
         * {@link cc.action.Action#from}
         * @method cc.action.PathAction#from
         * @override
         */
        from(segment:Segment):Action {
            super.from(segment);
            this._segment= segment;

            return this;
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.PathAction#to
         * @override
         */
        to(point:Point):Action {

            return this;
        }

        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.PathAction#__cloneImpl
         * @override
         */
        __cloneImpl() : Action {

            var copy= new PathAction();
            copy._segment= this._segment.clone();

            this.__genericCloneProperties( copy );

            return copy;
        }

        /**
         * Sets tangential rotation and optionally whether the rotation will be of 360 degrees, or the sprite won't be
         * vertically flipped.
         * @method cc.action.PathAction#adjustRotation
         * @param a {boolean} enable tangential rotation.
         * @param fullAngles {boolean=} allow vertically flipping angles or not.
         * @returns {cc.action.PathAction}
         */
        adjustRotation( a:boolean, fullAngles?:boolean ) : PathAction {
            this._adjustTangentialRotation= a;
            this._tangentialRotationFullAngle= typeof fullAngles!=="undefined" ? fullAngles : false;
            return this;
        }

        /**
         * By default, tangential rotation assumes left-to-right sprites.
         * @method cc.action.PathAction#setSpriteOrientationIsLeftToRight
         * @param v {boolean} left-to-right or not.
         * @returns {cc.action.PathAction}
         */
        setSpriteOrientationIsLeftToRight( v:boolean ) : PathAction {
            this._spriteOrientationLR= v;
            return this;
        }

        getInitializer() : PathActionInitializer {
            var init:PathActionInitializer= <PathActionInitializer>super.getInitializer();

            init.type="PathAction";

            // bugbug pathAction can not serialize path object.

            return init;
        }

    }
}