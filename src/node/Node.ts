/**
 * License: see license.txt file.
 */


/// <reference path="../math/Point.ts"/>
/// <reference path="../math/Rectangle.ts"/>
/// <reference path="../math/Dimension.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../math/Color.ts"/>
/// <reference path="../render/RenderingContext.ts"/>
/// <reference path="../util/util.ts"/>
/// <reference path="../util/Debug.ts"/>
/// <reference path="../locale/Locale.ts"/>
/// <reference path="../action/SchedulerQueue.ts"/>
/// <reference path="../action/ActionChainContext.ts"/>
/// <reference path="./Scene.ts"/>

module cc.node {

    export var DEFAULT_ANCHOR_POSITION= new cc.math.Vector(0,0);
    export var DEFAULT_ANCHOR_TRANSFORMATION= new cc.math.Vector(0.5,0.5);

    "use strict";

    import Vector=                  cc.math.Vector;
    import Point=                   cc.math.Point;
    import Rectangle=               cc.math.Rectangle;
    import Dimension=               cc.math.Dimension;
    import Matrix3=                 cc.math.Matrix3;
    import Color=                   cc.math.Color;
    import Action=                  cc.action.Action;
    import Scene=                   cc.node.Scene;
    import RenderingContext=        cc.render.RenderingContext;
    import SchedulerQueue=          cc.action.SchedulerQueue;
    import SchedulerQueueTask=      cc.action.SchedulerQueueTask;
    import SchedulerTaskCallback=   cc.action.SchedulerTaskCallback;

    var RADIANS= Math.PI/180;

    /**
     * Node flag values.
     * Instead of managing several boolean properties they are grouped in a number value.
     * @tsenum cc.node.NodeDirtyFlags
     */
    export enum NodeDirtyFlags {

        NONE =                      0x0000,
        CHILDREN_SORT =             0x0001,
        TRANSFORMATION_DIRTY=       0x0002,
        REQUEST_TRANSFORM=          0x0004,
        VISIBLE=                    0x0008,
        INVERSE_MATRIX=             0x0010,
        PAUSED=                     0x0020,
        EVENTS_ENABLED=             0x0040,
        EVENTS_PRIORITY_ENABLED=    0x0080,
        COMPOSITE_ON=               0x0100,
        GLOBAL_ALPHA=               0x0200,
        AABB_DIRTY=                 0x0400
    }

    /**
     * Callback interface for node's that math an enumeration pattern.
     * @memberOf cc.node
     * @callback EnumerateCallback
     * @param node {Node} This callback will be called for each Node that matches the pattern.
     * @see {cc.node.Node#enumerateChildren}
     */
    export interface EnumerateCallback {
        (node:Node):void;
    }

    /**
     * Index sequence variable for node's OrderOfArrival.
     * @type {number}
     * @private
     */
    var _OrderOfArrival : number = 0;

    var DEFAULT_COLOR:Color= new Color(1,1,1,1);

    var __p0= new cc.math.Vector();

    /**
     * @class cc.node.Node
     * @classdesc
     *
     * Node is the base class for all Cocos2d HTML5 elements that are screen entities.
     *
     * A Node is composed by a dimension, and some properties like position, rotation and scale, and a collection of
     * children.
     * Children are divided into two groups: children that are behind the node (z-index<0) and children that are
     * in front of the node (z-index>=0).
     * These transformation properties are hierarchically applied to its children, meaning that if a node is rotated,
     * all its children will show rotated as well.
     * A node can have input routed to it, has drawing capabilities, and can have a collection of actions predefined
     * to be applied to it.
     *
     */
    export class Node {

        /**
         * Hierarchy dependent nodes.
         * @member cc.node.Node#_children
         * @type {Array<cc.node.Node>}
         * @private
         */
        _children:Array<Node> = [];

        /**
         * This node's parent node.
         * <br>
         * Don't set directly.
         * @member cc.node.Node#_parent
         * @type {cc.node.Node}
         * @private
         */
        _parent:Node = null;

        /**
         * This node's position.
         * @member cc.node.Node#_position
         * @type {cc.math.Vector}
         * @private
         */
        _position:Vector = new Vector();

        /**
         * Node's position anchor.
         * The anchor is normalized, meaning 1 to be node's width or height.
         * @member cc.node.Node#_positionAnchor
         * @type {cc.math.Vector}
         * @private
         */
        _positionAnchor:Vector = DEFAULT_ANCHOR_POSITION.clone();

        /**
         * Node's rotation angles for x and y.
         * @member cc.node.Node#_rotation
         * @type {cc.math.Vector}
         * @private
         */
        _rotation:Vector = new Vector(0.0, 0.0);

        /**
         * Node's scale coeficients.
         * @member cc.node.Node#_scale
         * @type {cc.math.Vector}
         * @private
         */
        _scale:Vector = new Vector(0.0, 0.0);

        /**
         * Node's skew values.
         * @member cc.node.Node#_skew
         * @type {cc.math.Vector}
         * @private
         */
        //_skew:Vector = new Vector(0, 0);

        /**
         * Node's transformation anchor. Scale and rotation will be around this anchor value.
         * @member cc.node.Node#_transformationAnchor
         * @type {cc.math.Vector}
         * @private
         */
        _transformationAnchor:Vector = DEFAULT_ANCHOR_TRANSFORMATION.clone();

        /**
         * Node's local transformation matrix.
         * @member cc.node.Node#_modelViewMatrix
         * @type {Float32Array}
         * @private
         */
        _modelViewMatrix:Float32Array = Matrix3.create();

        /**
         * Node's global transformation matrix.
         * @member cc.node.Node#_worldModelViewMatrix
         * @type {Float32Array}
         * @private
         */
        _worldModelViewMatrix:Float32Array = Matrix3.create();

        /**
         * Node's inverse global transformation matrix.
         * @member cc.node.Node#_worldModelViewMatrixI
         * @type {Float32Array}
         * @private
         */
        _worldModelViewMatrixI:Float32Array = Matrix3.create();

        /**
         * Node's color. This color, when drawing images, will be set as tint color.
         * Tinting will only be enabled in webgl renderers though.
         * @member cc.node.Node#_color
         * @type {cc.math.Color}
         * @private
         */
        _color:Color = DEFAULT_COLOR;

        /**
         * opacity value. full opaque by default. opacity values go from 0 full transparent to 1 full opaque.
         * @member cc.node.Node#_alpha
         * @type {number}
         * @private
         */
        _alpha:number = 1;

        /**
         * Compound parent cascade alpha value.
         * @member cc.node.Node#_frameAlpha
         * @type {number}
         * @private
         */
        _frameAlpha:number = 1;

        /**
         * Node's dimension.
         * @member cc.node.Node#_contentSize
         * @type {cc.math.Vector}
         * @private
         */
        _contentSize:Dimension = new Dimension();

        /**
         * Node's z-index values.
         * Nodes with a less than zero z-index will be drawn first, then its parent, and then nodes with a greater or
         * equal than zero z-index value.
         * @member cc.node.Node#_localZOrder
         * @type {number}
         * @private
         */
        _localZOrder:number = 0;

        /**
         * Node's order of arrival to the parent node.
         * When sorting a node's children, first, the z-index is taken into account. But nodes with the same z-index
         * will then be sorted by the order of arrival.
         * The order of arrival is by default set incrementally, but the developer has the option to modify it anytime.
         * @member cc.node.Node#_orderOfArrival
         * @type {number}
         * @private
         */
        _orderOfArrival : number = 0;

        /**
         * internal flag that indicates if the node is rotated (false) or not (true).
         * @member cc.node.Node#_isAA
         * @type {boolean}
         * @private
         */
        _isAA:boolean = false;

        /**
         * Axis aligned bounding box.
         * @member cc.node.Node#_AABB
         * @type {cc.math.Rectangle}
         * @private
         */
        _AABB:Rectangle = new Rectangle();

        /**
         * Bounding Box. May overlap _AABB
         * @member cc.node.Node#_BBVertices
         * @type {Array<cc.math.Vector>}
         * @private
         */
        _BBVertices:Array<Point> = [ {x:0.0,y:0.0},{x:0.0,y:0.0},{x:0.0,y:0.0},{x:0.0,y:0.0} ];

        /**
         * Node tag. Only for backwards compatibility.
         * @member cc.node.Node#_tag
         * @type {any}
         * @private
         * @deprecated
         */
        _tag:any = null;

        /**
         * Node name.
         * @member cc.node.Node#_name
         * @type {string}
         * @private
         */
        _name : string = "";

        /**
         * Internal integer value with some flags that affect a node.
         * Values for this flags variable are defined in cc.node.NodeDirtyFlags.
         * Never set this value manually.
         * @member cc.node.Node#_flags
         * @type {number}
         * @private
         */
        _flags : number = 0;

        /**
         * Scene this node is running in.
         * @member cc.node.Node#_scene
         * @type {cc.node.Scene}
         * @private
         */
        _scene : Scene = null;

        /**
         * When no scene is yet set, this array holds Node's actions.
         * @member cc.node.Node#_actionsToSchedule
         * @type {Array<cc.node.Action>}
         * @private
         */
        _actionsToSchedule : Array<Action> = [];

        /**
         * When no scene is yet set, this array holds Node's scheduled tasks.
         * @member cc.node.Node#_tasksToSchedule
         * @type {Array<cc.node.Action>}
         * @private
         */
        _tasksToSchedule : Array<SchedulerQueueTask> = [];

        /**
         * Node x position.
         * @member cc.node.Node#x
         * @type {number}
         */
        x : number = 0.0;

        /**
         * Node y position.
         * @member cc.node.Node#y
         * @type {number}
         */
        y : number = 0.0;

        /**
         * Node scale X.
         * @member cc.node.Node#scaleX
         * @type {number}
         */
        scaleX : number = 1.0;

        /**
         * Node scale Y.
         * @member cc.node.Node#scaleY
         * @type {number}
         */
        scaleY : number = 1.0;

        /**
         * Node rotation angle in degrees.
         * @member cc.node.Node#rotationAngle
         * @type {number}
         */
        rotationAngle : number = 0.0;

        _compositeOperation : cc.render.CompositeOperation = cc.render.CompositeOperation.source_over;

        _inputEvents : any= {};

        /**
         * Create a new Node object.
         * @method cc.node.Node#constructor
         */
        constructor() {
            this._flags= NodeDirtyFlags.REQUEST_TRANSFORM |
            NodeDirtyFlags.VISIBLE |
            NodeDirtyFlags.AABB_DIRTY;

            // for backwards compatibility, nodes with zero dimension are shown. Not in v4, where everything must have
            // dimension.
            if ( cc.__BACKWARDS_COMPATIBILITY__ ) {
                this._contentSize.set(1, 1);
            }
        }

        /**
         * Internal flag check for sorting children nodes.
         * @method cc.node.Node#__childrenMustSort
         * @returns {boolean}
         * @private
         */
        __childrenMustSort() : boolean {
            return this._children.length>1 && (this._flags&NodeDirtyFlags.CHILDREN_SORT)!==0;
        }

        /**
         * Clear a flag. To avoid managing several different boolean members we pack all of them in a number value.
         * Flag values are {@link cc.node.NodeDirtyFlags}
         * @method cc.node.Node#__clearFlag
         * @param f {number} a flag value.
         * @private
         */
        __clearFlag( f : number ) : void {
            this._flags &= ~f;
        }

        /**
         * Set a flag. To avoid managing several different boolean members we pack all of them in a number value.
         * Flag values are {@link cc.node.NodeDirtyFlags}
         * @method cc.node.Node#__clearFlag
         * @param f {number} a flag value.
         * @private
         */
        __setFlag( f : number ) : void {
            this._flags |= f;
        }

        /**
         * Return whether a flag is set.
         * @method cc.node.Node#__isFlagSet
         * @param f {number}
         * @returns {boolean}
         * @private
         */
        __isFlagSet( f : number ) : boolean{
            return (this._flags&f)!==0;
        }

        /**
         * Enable or disable a flag.
         * @method cc.node.Node#__setFlagValue
         * @param f {number}
         * @param enable {boolean} true to enable, false to disable.
         * @private
         */
        __setFlagValue( f:number, enable:boolean ) {
            if (enable) {
                this._flags|=f;
            } else {
                this._flags &= ~f;
            }
        }

        isGlobalAlpha() : boolean {
            return this.__isFlagSet( NodeDirtyFlags.GLOBAL_ALPHA );
        }

        setGlobalAlpha( b:boolean ) {
            this.__setFlagValue( NodeDirtyFlags.GLOBAL_ALPHA, b );
        }

        /**
         * Set the node composite operation (or blending mode).
         * blending modes available are defined in the cc.render.CompositeOperation enumeration.
         * Pass null to disable custom blending mode, and apply the currently set one.
         * @method cc.node.Node.setCompositeOperation
         * @param o {cc.render.CompositeOperation}
         */
        setCompositeOperation( o:cc.render.CompositeOperation ) {
            if ( o!==null ) {
                this._compositeOperation= o;
                this.__setFlag( cc.node.NodeDirtyFlags.COMPOSITE_ON );
            } else {
                this.__clearFlag( cc.node.NodeDirtyFlags.COMPOSITE_ON );
            }
        }

        /**
         * Set this node position in parent's coordinate space.
         * @method cc.node.Node#setPosition
         * @param x {number} x position.
         * @param y {number} y position.
         * @returns {cc.node.Node}
         */
        setPosition(x:number, y:number) : Node {

            this.x=x;
            this.y=y;
            return this;
        }

        /**
         * Set this node's rotation angle
         * @method cc.node.Node#setRotation
         * @param x {number} rotation angle in degrees.
         * @returns {cc.node.Node}
         */
        setRotation(x:number):Node {

            this.rotationAngle= x;
            return this;
        }

        /**
         * Set this node's scale.
         * If y parameter is not set, the scale will be the same for both axis.
         * @method cc.node.Node#setScale
         * @param x {number} scale for x axis
         * @param y {number=} optional scale for y axis. If not set, x scale will be set for y axis.
         * @returns {cc.node.Node}
         */
        setScale(x:number, y?:number):Node {

            this.scaleX= x;
            this.scaleY= y;

            return this;
        }

        /**
         * Set the Node X axis scale value.
         * @param s {number} default scale is 1.
         * @returns {cc.node.Node}
         */
        setScaleX( s : number ) : Node {
            this.scaleX= s;
            return this;
        }

        /**
         * Set the Node Y axis scale value.
         * @param s {number} default scale is 1.
         * @returns {cc.node.Node}
         */
        setScaleY( s : number ) : Node {
            this.scaleY= s;
            return this;
        }

        /**
         * Gets node's parent. The parent is another Node. Some specialized node types like <code>Scene</code> and
         * <code>Director</code> don't have a parent.
         * @method cc.node.Node#getParent
         * @returns {Node} value will be null if no parent, and a Node instance otherwise.
         */
        getParent():Node {
            return this._parent;
        }

        /**
         * Sets node's parent.
         * <br>
         * Never call directly.
         * @method cc.node.Node#__setParent
         * @param node {cc.node.Node}
         * @returns {cc.node.Node}
         * @private
         */
        __setParent(node:Node):Node {
            this._parent = node;
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
            return this;
        }

        /**
         * Set node's positional anchor.
         * <li>By default the node will be position anchored at 0,0.
         * <li>The position anchor is a normalized value. This means it must be set with values between 0 and 1.
         * <li>Calling this method with 0,0 will means the node will be positioned relative to top-left corner.
         * <li>Calling with 0.5, 0.5, means the node will be positioned relative to its center regardless of its size.
         * @method cc.node.Node#setPositionAnchor
         * @param x {number}
         * @param y {number}
         * @returns {cc.node.Node}
         */
        setPositionAnchor(x:number, y:number):Node {
            this._positionAnchor.set(x, y);
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
            return this;
        }

        /**
         * Set node's positional and transformational anchors.
         * <li>By default the node will be position anchored at 0,0.
         * <li>The anchor is a normalized value. This means it must be set with values between 0 and 1.
         * <li>Calling this method with 0,0 will means the node will be positioned relative to top-left corner.
         * <li>Calling with 0.5, 0.5, means the node will be positioned relative to its center regardless of its size.
         * <li>This method is deprecated in favor of setTransformationAnchor and setPositionAnchor.
         * @method cc.node.Node#setAnchorPoint
         * @param x {number}
         * @param y {number}
         * @returns {cc.node.Node}
         * @deprecated
         */
        setAnchorPoint(x:number, y:number):Node {
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
            this.setTransformationAnchor(x,y);
            return this.setPositionAnchor(x,y);
        }

        /**
         * Set node's transformation anchor.
         * By default the node will be transformed (scale/rotate) by the node's center.
         * @method cc.node.Node#setTransformationAnchor
         * @param x {number}
         * @param y {number}
         * @returns {cc.node.Node}
         */
        setTransformationAnchor(x:number, y:number):Node {
            this._transformationAnchor.set(x, y);
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
            return this;
        }

        /**
         * Set this node's tag.
         * @method cc.node.Node#setTag
         * @param t {object}
         * @returns {cc.node.Node}
         */
        setTag(t:any):Node {
            this._tag = t;
            return this;
        }

        /**
         * Set Node opacity. Opacity is alpha value.
         * backwards compatible method. use setAlpha or alpha get/set.
         * @param v {number} value in the range 0..255
         * @deprecated
         * @returns {cc.node.Node}
         */
        setOpacity( v : number ) : Node {
            this.setAlpha( v/255.0 );
            return this;
        }

        /**
         * Setter for node's alpha (transparency) value.
         * Alpha values are from 0 to 1.
         * @name cc.node.Node#set:alpha
         * @param a {number}
         */
        set alpha(a:number) {
            this.setAlpha(a);
        }

        /**
         * Get node's transparency value.
         * Transparency values are from 0 to 1.
         * @name cc.node.Node#get:alpha
         * @returns {number}
         */
        get alpha() {
            return this.getAlpha();
        }

        /**
         * Setter for node's alpha (transparency) value.
         * Alpha values are from 0 to 1.
         * @name cc.node.Node#set:opacity
         * @param a {number}
         */
        set opacity(a:number) {
            this.setOpacity(a);
        }

        /**
         * Get node's transparency value.
         * Transparency values are from 0 to 1.
         * @name cc.node.Node#get:opacity
         * @returns {number}
         */
        get opacity() {
            return (this.getAlpha()*255.0)|0;
        }

        /**
         * Set node's transparency  value.
         * @method cc.node.Node#setAlpha
         * @param a {number} value from 0 to 1.
         * @returns {cc.node.Node}
         */
        setAlpha(a:number):Node {

            this._alpha= a;
            return this;
        }

        /**
         * Get node's transparency value.
         * Transparency values are from 0 to 1.
         * @method cc.node.Node#getAlpha
         * @returns {number}
         */
        getAlpha():number {
            return this._alpha;
        }

        /**
         * Set node's color.
         * <br>
         * Color components are values between 0 and 1.
         * 0 means no color, 1 means full color component.
         *
         *
         * The color, will be Node's color, but for a Sprite, it will be the image's tint color.
         * Tint colors modify visual appearance of the node paint pixels.
         * The tint result is the pixel color multiplied by the tint color.
         * The final tint color will be: [color.red, color.green, color.blue, node.alpha]
         * The default color is solid white, which leaves pixel values unmodified.
         *
         * Alpha color modification comes by calling the opacity/alpha methods.
         *
         * @method cc.node.Node#setColor
         * @param r {number} value between 0 and 1 or a Color object instance.
         * @param g {number} between 0 and 1
         * @param b {number} between 0 and 1
         * @returns {cc.node.Node}
         */
        setColor(r:number, g:number, b:number):Node {

            if ( this._color===DEFAULT_COLOR ) {
                this._color= new Color(r,g,b);
            } else {
                this._color._color[0]= r;
                this._color._color[1]= g;
                this._color._color[2]= b;
            }

            return this;
        }

        /**
         * Set this node's content size.
         * @method cc.node.Node#setContentSize
         * @param w {number} node width
         * @param h {number} node height
         * @returns {cc.node.Node}
         */
        setContentSize(w:number, h:number):Node {

            this._contentSize.width= w;
            this._contentSize.height= h;
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );

            return this;
        }

        /**
         * Set node's local and global transformation matrices.
         * The matrices may not change.
         * <br>
         * Do not call directly
         * @method cc.node.Node#__setTransform
         * @returns {cc.node.Node}
         * @private
         */
        __setTransform():Node {
            this.__setLocalTransform();
            this.__setWorldTransform();

            if ( this.__isFlagSet( NodeDirtyFlags.TRANSFORMATION_DIRTY ) ) {
                this.__setFlag( NodeDirtyFlags.INVERSE_MATRIX );
                this.__setFlag( NodeDirtyFlags.AABB_DIRTY );
            }

            return this;
        }

        /**
         * Set the Node local transformation matrix as rotation. Slowest method.
         * @method cc.node.Node#__setLocalTransformRotate
         * @private
         */
        __setLocalTransformRotate() {
            Matrix3.setTransformAll(this._modelViewMatrix, this);
            this.__setFlag( NodeDirtyFlags.TRANSFORMATION_DIRTY );
            this._position.x= this.x;
            this._position.y= this.y;
            this._scale.x= this.scaleX;
            this._scale.y= this.scaleY;
            this._rotation.x= this.rotationAngle;
        }

        /**
         * Set the Node local transformation matrix as scale.
         * @method cc.node.Node#__setLocalTransformScale
         * @private
         */
        __setLocalTransformScale() {
            Matrix3.setTransformScale(this._modelViewMatrix, this);
            this.__setFlag( NodeDirtyFlags.TRANSFORMATION_DIRTY );
            this._position.x= this.x;
            this._position.y= this.y;
            this._scale.x= this.scaleX;
            this._scale.y= this.scaleY;
        }

        /**
         * Set node's local transformation matrix.
         * This method is very specific and calls different code based on the transformation type that has
         * been detected.
         * @method cc.node.Node#__setLocalTransform
         * @private
         */
        __setLocalTransform() {

            if ( this._rotation.x!==this.rotationAngle || (this.rotationAngle%360)!==0 || this.__isFlagSet(NodeDirtyFlags.REQUEST_TRANSFORM) ) {
                this.__setLocalTransformRotate();
            } else if ( this.scaleX!==this._scale.x || this._scale.y!==this.scaleY || this._scale.x!==1 || this._scale.y!==1 ) {
                this.__setLocalTransformScale();
            } else if ( this.x!==this._position.x || this.y!==this._position.y ) {

                var mm=this._modelViewMatrix;
                var pa=this._positionAnchor;
                var cs=this._contentSize;
                var x: number = this.x - pa.x * cs.width;
                var y: number = this.y - pa.y * cs.height;
                mm[2] = x;
                mm[5] = y;
                mm[0] = 1.0;
                mm[1] = 0.0;
                mm[3] = 0.0;
                mm[4] = 1.0;
                mm[6] = 0.0;
                mm[7] = 0.0;
                mm[8] = 1.0;

                this._position.x= this.x;
                this._position.y= this.y;
                this.__setFlag( NodeDirtyFlags.TRANSFORMATION_DIRTY );
            }
        }

        /**
         * Set node's global transformation when the node is not axis aligned.
         * @method cc.node.Node#__setWorldTransformNotAA
         * @private
         */
        __setWorldTransformNotAA() {

            var mm:Float32Array;
            var mmm:Float32Array = this._worldModelViewMatrix;
            var pmm:Float32Array = this._parent._worldModelViewMatrix;

            mmm[0] = pmm[0];
            mmm[1] = pmm[1];
            mmm[2] = pmm[2];
            mmm[3] = pmm[3];
            mmm[4] = pmm[4];
            mmm[5] = pmm[5];

            if (this._isAA) {
                mm = this._modelViewMatrix;
                mmm[2] += (mm[2] * mmm[0]);
                mmm[5] += (mm[5] * mmm[4]);
            } else {
                Matrix3.multiply(this._worldModelViewMatrix, this._modelViewMatrix);
            }

        }

        /**
         * Set node's world transformation when the node is Axis Aligned.
         * An axis aligned Node means that the node, and all its ancestors are axis aligned.
         * @method cc.node.Node#__setWorldTransformAA
         * @private
         */
        __setWorldTransformAA( px:number, py:number ) {
            var wmm:Float32Array = this._worldModelViewMatrix;
            var mmm:Float32Array = this._modelViewMatrix;

            wmm[0] = mmm[0];
            wmm[1] = mmm[1];
            wmm[2] = mmm[2] + px;
            wmm[3] = mmm[3];
            wmm[4] = mmm[4];
            wmm[5] = mmm[5] + py;

            this._isAA = (this._rotation.x % 360.0) === 0.0;
        }

        /**
         * Calculate node's global transformation matrix.
         * @method cc.node.Node#__setWorldTransform
         * @private
         */
        __setWorldTransform() {

            var condition = this.__isFlagSet( NodeDirtyFlags.TRANSFORMATION_DIRTY );
            var isAA= (this._rotation.x % 360.0) === 0.0;
            var px= 0;
            var py= 0;
            if (this._parent) {
                condition = condition || this._parent.__isFlagSet( NodeDirtyFlags.TRANSFORMATION_DIRTY );
                isAA= isAA && this._parent._isAA;
            }

            if (condition) {

                this._isAA= isAA;
                if ( this._parent ) {
                    px= this._parent._worldModelViewMatrix[2];
                    py= this._parent._worldModelViewMatrix[5];
                }

                if (isAA) {
                    this.__setWorldTransformAA(px,py);
                } else {
                    this.__setWorldTransformNotAA();
                }

                this.__setFlagValue(NodeDirtyFlags.TRANSFORMATION_DIRTY,condition);

            }

        }

        getInverseWorldModelViewMatrix( ) : Float32Array {

            if ( this.__isFlagSet(NodeDirtyFlags.INVERSE_MATRIX ) ) {
                Matrix3.inverse( this._worldModelViewMatrix, this._worldModelViewMatrixI );
                this.__clearFlag( NodeDirtyFlags.INVERSE_MATRIX );
            }

            return this._worldModelViewMatrixI;
        }

        /**
         * Visit a node.
         * The process of visiting implies several different steps and is only performed for visible nodes:
         *
         * <li>Calculate (if needed) local and global transformation matrices
         * <li>Prune the node if not showing on screen.
         * <li>Perform children sort.
         * <li>Visit children with z-index < 0
         * <li>Draw this node
         * <li>Visit children with z-index >= 0
         * <li>Reset transformation dirtiness
         *
         * @method cc.node.Node#visit
         * @param ctx {cc.render.RenderingContext}
         */
        visit(ctx:RenderingContext) {

            if (!this.isVisible()) {
                return;
            }

            this.__clearFlag( NodeDirtyFlags.TRANSFORMATION_DIRTY );
            this.__setTransform();

            //if (this.__AABBIntersectsScreen(ctx) || true) {

                if (this.__childrenMustSort()) {
                    this.__sortChildren();
                }

                this.__setAlphaImpl();

                var index:number = 0;

                for (index = 0; index < this._children.length; index++) {
                    var child = this._children[index];
                    if (child._localZOrder < 0) {
                        child.visit(ctx);
                    } else {
                        break;
                    }
                }

                this.__draw(ctx);

                for (; index < this._children.length; index++) {
                    var child = this._children[index];
                    child.visit(ctx);
                }
            //}

            this.__clearFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
        }

        __setAlphaImpl() {

            if ( !this._parent ) {
                this._frameAlpha= this._alpha;
            } else {

                this._frameAlpha= this._parent._frameAlpha * this._alpha;
            }
        }

        /**
         * Calculate if a node is in screen bounds.
         * @param ctx {cc.render.RenderingContext}
         * @method cc.node.Node#__AABBIntersectsScreen
         * @returns {boolean} the node is in screen or not.
         * @private
         */
        __AABBIntersectsScreen(ctx:RenderingContext) {

            this.calculateBoundingBox();
            return this._AABB.intersects(0, 0, ctx.getWidth(), ctx.getHeight());
        }

        /**
         * Calculate a node's Bounding box when the node is not axis aligned.
         * @method cc.node.Node#__calculateNAABBVertices
         * @private
         */
        __calculateNAABBVertices() {
            var vv:Array<Point> = this._BBVertices;
            var _w:number = this._contentSize.width;
            var _h:number = this._contentSize.height;

            // way chepaer to work on properties than vv[0].set
            var v= vv[0];
            v.x= 0;
            v.y= 0;
            this.convertToWorldSpace(v);
            v= vv[1];
            v.x= _w;
            v.y= 0;
            this.convertToWorldSpace(v);
            v=vv[2];
            v.x= _w;
            v.y= _h;
            this.convertToWorldSpace(v);
            v= vv[3];
            v.x= 0;
            v.y= _h;
            this.convertToWorldSpace(v);
        }

        /**
         * Calculate a node's bounding box when the node is axis aligned.
         * @method cc.node.Node#__calculateAABBVertices
         * @private
         */
        __calculateAABBVertices() {
            var vv:Array<Point> = this._BBVertices;
            var x:number, y:number, w:number, h:number;
            var mm = this._worldModelViewMatrix;

            x = mm[2];
            y = mm[5];
            w = this._contentSize.width * mm[0];
            h = this._contentSize.height * mm[4];

            // cheaper than calling set on vectors.
            var v;
            v= vv[0];
            v.x= x;
            v.y= y;
            v= vv[1];
            v.x= x + w;
            v.y= y;
            v= vv[2];
            v.x= x+w;
            v.y= y+h;
            v= vv[3];
            v.x= x;
            v.y= y+h;
        }

        /**
         * Calculate a node's bounding box.
         * @method cc.node.Node#__calculateBoundingBox
         * @returns {cc.node.Node}
         * @private
         */
        calculateBoundingBox() : Rectangle {

            if ( !this.__isFlagSet( NodeDirtyFlags.AABB_DIRTY ) ) {
                return this._AABB;
            }

            var verts:Array<Point> = this._BBVertices;

            if (this._isAA) {
                this.__calculateAABBVertices();
            } else {
                this.__calculateNAABBVertices();
            }

            var xmin : number= Number.MAX_VALUE;
            var ymin : number= Number.MAX_VALUE;
            var xmax : number= -Number.MAX_VALUE;
            var ymax : number= -Number.MAX_VALUE;

            // way faster to do comparison chain than Math.min chain
            var v= verts[0];
            if ( v.x<xmin ) { xmin=v.x; }
            if ( v.x>xmax ) { xmax=v.x; }
            if ( v.y<ymin ) { ymin=v.y; }
            if ( v.y>ymax ) { ymax=v.y; }
            var v= verts[1];
            if ( v.x<xmin ) { xmin=v.x; }
            if ( v.x>xmax ) { xmax=v.x; }
            if ( v.y<ymin ) { ymin=v.y; }
            if ( v.y>ymax ) { ymax=v.y; }
            var v= verts[2];
            if ( v.x<xmin ) { xmin=v.x; }
            if ( v.x>xmax ) { xmax=v.x; }
            if ( v.y<ymin ) { ymin=v.y; }
            if ( v.y>ymax ) { ymax=v.y; }
            var v= verts[3];
            if ( v.x<xmin ) { xmin=v.x; }
            if ( v.x>xmax ) { xmax=v.x; }
            if ( v.y<ymin ) { ymin=v.y; }
            if ( v.y>ymax ) { ymax=v.y; }

            // faster set properties than call.
            var aa= this._AABB;
            aa.x= xmin;
            aa.y= ymin;
            aa.w= xmax-xmin;
            aa.h= ymax-ymin;

            this.__clearFlag( NodeDirtyFlags.AABB_DIRTY );

            return this._AABB;
        }

        /**
         * Convert a coordinate to world (screen) space.
         * @method cc.node.Node#convertToWorldSpace
         * @param p {Vector}
         */
        convertToWorldSpace(p:Point) {
            Matrix3.transformPoint(this._worldModelViewMatrix, p);
        }

        /**
         * Draw a node.
         * @method cc.node.Node#__draw
         * @param ctx {cc.render.RenderingContext}
         * @private
         */
        __draw(ctx:RenderingContext) {

            Matrix3.setRenderingContextTransform(this._worldModelViewMatrix, ctx);

            var compositeSet:boolean= this.__isFlagSet( cc.node.NodeDirtyFlags.COMPOSITE_ON );
            var prevComposite:cc.render.CompositeOperation= ctx.getCompositeOperation();

            compositeSet= compositeSet && this._compositeOperation!==prevComposite;

            if ( compositeSet ) {
                ctx.setCompositeOperation( this._compositeOperation );
            }

            this.draw(ctx);

            if ( compositeSet ) {
                ctx.setCompositeOperation( prevComposite );
            }
        }

        /**
         * Get the node scene reference.
         * Each node belongs to an scene, which is held in this variable. Scenes have scheduling capabilities
         * and director references.
         * @method cc.node.Node#getScene
         * @returns {cc.node.Scene}
         */
        getScene() {
            return this._scene;
        }

        getPathToRoot() : Node[] {
            var node:Node= this;
            var ret: Node[]= [];

            do {
                ret.push(node);
                node= node.getParent();
            } while( node );

            return ret;
        }

        /**
         * Register a callback for an event type.
         * @method cc.node.Node#addEventListener
         * @param event {string} event name: mouseup, mousedown, mousemove, mousedrag, mouseover, mouseout, doubleclick
         * @param callback {function} a callback function that will receive an InputManager.Event object.
         */
        addEventListener( event:string, callback:any ) : Node {
            this._inputEvents[event]= callback;
            return this;
        }

        notifyEvent( e:any ) {
            var callback= this._inputEvents[e.type];
            if ( e.type==="touchstart" ) {
                if (!callback) {
                    callback= this._inputEvents["mousedown"];
                }
            } else if ( e.type==="touchend" ) {
                if (!callback) {
                    callback= this._inputEvents["mouseup"];
                }
            } else if ( e.type==="touchmove" ) {
                if (!callback) {
                    callback= this._inputEvents["mousedrag"];
                }
            } else if ( e.type==="touchover" ) {
                if (!callback) {
                    callback= this._inputEvents["mouseover"];
                }
            } else if ( e.type==="touchout" ) {
                if (!callback) {
                    callback= this._inputEvents["mouseout"];
                }
            }

            if ( callback ) {
                callback(e);
            }
        }

        getScreenPointInLocalSpace( p:Vector ) {
            var matrix = this.getInverseWorldModelViewMatrix();
            cc.math.Matrix3.transformPoint(matrix, p);

        }

        isScreenPointInNode( p:Vector ) : boolean {

            if ( !this.isVisible() ) {
                return false;
            }

            this.getScreenPointInLocalSpace(p);
            return p.x>=0 && p.y>=0 && p.x<this._contentSize.width && p.y<this._contentSize.height;
        }

        /**
         * Add a child node to this node.
         * The Node is added immediately and the array of children nodes is flagged for sort at the next call to
         * the <code>visit</code> method.
         *
         * @method cc.node.Node#addChild
         * @param node {cc.node.Node} a Node to add as child.
         * @param localZOrder {number=} an optional zIndex for the Node. If set, this value will overwrite the Node's
         *   previous localZOrder value.
         *
         * @returns {cc.node.Node}
         *
         * @see {cc.node.Node#visit}
         */
        addChild(node:Node, localZOrder? : number ):Node {

            if ( arguments.length>2 ) {
                this.__legacyAddChild.apply( this, Array.prototype.slice.call(arguments) );
                return this;
            }

            if ( node._parent ) {
                cc.Debug.error(cc.locale.MSG_ERROR_NODE_WITH_PARENT)
            }

            node._orderOfArrival = _OrderOfArrival++;
            node._parent = this;

            if (typeof localZOrder !== "undefined") {
                node._localZOrder = localZOrder;
            }

            // there are some nodes to compare index with
            if ( this._children.length>0 ) {
                // node with smaller zindex than the first child.
                if ( node._localZOrder<this._children[0]._localZOrder ) {
                    // add node from the head.
                    this._children.unshift(node);
                } else if ( node._localZOrder>=this._children[ this._children.length-1 ]._localZOrder ) {
                    // node with same localzorder than the last one. add and no sort since orderofarrival is bigger.
                    this._children.push(node);
                } else {
                    // just add the children and mark for sort
                    this.__setFlag(NodeDirtyFlags.CHILDREN_SORT);
                    this._children.push(node);
                }
            } else {
                // first child, just add.
                this._children.push(node);
            }

            // add scheduled actions and tasks
            if ( this.getScene()!==null ) {
                node.setScene(this.getScene());
            }

            // PENDING: running behavior, onEnter and onEnterTransitionDidFinish

            return this;
        }


        __legacyAddChild(child, localZOrder, tag) {
             localZOrder = localZOrder === undefined ? child._localZOrder : localZOrder;
             var name, setTag = false;
             if(typeof tag==="undefined"){
                 tag = undefined;
                 name = child._name;
             } else if(typeof tag==='string'){
                 name = tag;
                 tag = undefined;
             } else if(typeof tag==="number"){
                 setTag = true;
                 name = "";
             }

             if(!this._children)
                 this._children = [];

            this._children.push(child);
            child._localZOrder=localZOrder;

             if(setTag)
                 child.setTag(tag);
             else
                 child.setName(name);

             child._parent=this;
             child._orderOfArrival = _OrderOfArrival++;

            // add scheduled actions and tasks
            if ( this.getScene()!==null ) {
                child.setScene(this.getScene());
            }

            this.__setFlag(NodeDirtyFlags.CHILDREN_SORT);
         }


        /**
         * Change a node's z-index.
         * <br>
         * This will schedule a children sort on next visit call.
         * A call to this method with set orderOfArrival no a new value.
         * @method cc.node.Node#reorderChild
         * @param node {cc.node.Node}
         * @param localZOrder
         */
        reorderChild(node:Node, localZOrder:number ) : void {
            this.__setFlag(NodeDirtyFlags.CHILDREN_SORT);
            node._orderOfArrival= _OrderOfArrival++;
            node._localZOrder= localZOrder;
        }

        /**
         * Sort a node's children.
         * Children are sorted based on zOrder and orderOfArrival.
         * @method cc.node.Node#__sortChildren
         * @private
         */
        __sortChildren() : void {

            this._children.sort( function( n0 : Node, n1 : Node ) : number {
                if ( n0._localZOrder < n1._localZOrder ) {
                    return -1;
                } else if (n0._localZOrder > n1._localZOrder) {
                    return 1;
                }

                return n0._orderOfArrival < n1._orderOfArrival ? -1 : 1;

            });

            this.__clearFlag( NodeDirtyFlags.CHILDREN_SORT );
        }

        /**
         * Remove a child from a node.
         * @method cc.node.Node#removeChild
         * @param node {cc.node.Node} node to remove
         * @param cleanup {boolean=} should clean up ?
         */
        removeChild(node:Node, cleanup?:boolean) : Node {
            var index = this._children.indexOf(node);
            if(index>=0) {
                // PENDING: call onExit() if node is running

                if ( cleanup ) {
                    // do cleanup of actions and/or scheduled callbacks
                    this.stopAllActions();
                    this.unscheduleAllCallbacks();
                }

                this._children.splice(index, 1);
                node._parent = null;
                node._scene = this._scene;
            }

            return this;
        }

        /**
         * Remove the node from its parent.
         * @method cc.node.Node#removeFromParent
         * @param cleanup {boolean} if true, all node's scheduled callbacks will be removed too.
         * @returns {cc.node.Node}
         */
        removeFromParent( cleanup?:boolean ) : Node {
            if ( !this._parent ) {
                cc.Debug.warn( locale.NODE_WARN_REMOVEFROMPARENT_WITH_NO_PARENT );
                return;
            }

            this._parent.removeChild( this, cleanup );

            if ( cleanup ) {
                this.unscheduleAllCallbacks();
            }

            return this;
        }

        /**
         * Remove all Node's child nodes.
         * @method cc.node.Node#removeAllChildren
         * @returns {cc.node.Node}
         */
        removeAllChildren() : Node {
            for( var i=0; i<this._children.length; i++ ) {
                this._children[i]._parent= null;
            }
            this._children= [];
            // PENDING unschedule actions.
            return this;
        }

        /**
         * Get the node's children list.
         * @method cc.node.Node#getChildren
         * @returns {Array<cc.node.Node>}
         */
        getChildren():Array<Node> {
            return this._children;
        }

        /**
         * Get a node's root node.
         * A node's root node normally will be a Scene type node.
         * @method cc.node.Node#getRootNode
         * @returns {cc.node.Node}
         */
        getRootNode() : Node {
            var node : Node = this;
            while( node._parent ) {
                node= node._parent;
            }

            return node;
        }

        /**
         * Enumerate al children of a node that matches a pattern.
         * If a pattern starts with // the search will be recursively performed from the root node. It is only legal
         *  to define // at the beginning of the pattern.
         * If a pattern starts with / the search will be performed from the root node.
         *
         * The pattern accepts the wildcard symbol '*' meaning any value will match.
         * The pattern accepts the symbol '..' meaning it references a node's parent.
         *
         * Example patterns:
         *
         * <li><b>//*</b> . This pattern will get all descendant nodes from a node.
         * <li><b>/child0/grandchild1</b> . This pattern will get all grandchildren of a node with name grandchild1 that have
         * a parent node with name child0.
         * <li><b>/*\/grandchild0</b> . This pattern will get all grandchildren of a node which have the name grandchild0.
         *
         * @method cc.node.Node#enumerateChildren
         * @param patternName {string} a search pattern. Patterns are composed of regular expressions separated by slash / characters.
         * @param callback {EnumerateCallback} a callback function invoked for each node that matches the pattern.
         */
        enumerateChildren(patternName:string, callback:EnumerateCallback):void {

            // no string patternName, nothing to check for.
            if ( typeof patternName!=="string" ) {
                return;
            }

            var node : Node = this;
            var recursive = false;
            if (patternName.indexOf("//") === 0) {
                recursive = true;
                patternName = patternName.substr(2);
                node = this.getRootNode();
            }

            if ( patternName.indexOf("//")!==-1 ) {
                cc.Debug.error( cc.locale.MSG_WRONG_ENUMERATE_PATTERN );
            }

            patternName= cc.util.fromPosixRegularExpression(patternName);

            while ( patternName.indexOf("/")===0 ) {
                node = this.getRootNode();
                patternName = patternName.substr(1);
            }

            var orgPatternData : Array<RegExp>= [];
            var patterns =patternName.split("/");

            for( var i=0; i<patterns.length; i++ ) {
                var pattern= patterns[i];
                if ( pattern==="*" ) {
                    pattern=".*";
                }
                orgPatternData.push( new RegExp( pattern ) );
            }

            node.__enumerateChildrenImpl( orgPatternData, orgPatternData, callback, recursive);
        }

        /**
         * Do the actual enumeration.
         * @method cc.node.Node#__enumerateChildrenImpl
         * @param orgPatternData {Array<RegExp>}
         * @param patternData {Array<RegExp>
         * @param callback {EnumerateCallback} callback function executed for each node that matches the pattern.
         * @param recursive {boolean} is this a recursive enumeration ?
         * @private
         */
        __enumerateChildrenImpl( orgPatternData : Array<RegExp>, patternData : Array<RegExp>, callback : EnumerateCallback, recursive : boolean ) {

            // reached the end of a path
            if ( !patternData.length ) {
                callback(this);
                if (recursive) {
                    this.__enumerateChildrenImpl(orgPatternData, orgPatternData, callback, recursive);
                }
                return;
            } else if ( patternData[0].toString()==="/../" ) {
                if (!this._parent) {
                    cc.Debug.error(cc.locale.MSG_ENUMERATE_UNDERFLOW)
                } else {
                    this._parent.__enumerateChildrenImpl(orgPatternData, patternData.slice(1, patternData.length), callback, recursive);
                }
                return;
            }

            for( var i=0; i<this._children.length; i++ ) {

                var child= this._children[i];


                // the current pattern path is ok.
                if ( patternData[0].test( child._name ) ) {
                    child.__enumerateChildrenImpl( orgPatternData, patternData.slice(1,patternData.length), callback, recursive );
                } else {
                    // current path is not ok, but if recursive, apply whole pattern path from this node.
                    if ( recursive ) {
                        child.__enumerateChildrenImpl( orgPatternData, orgPatternData, callback, recursive );
                    }
                }
            }
        }

        /**
         * Draw a node.
         * Override this method to draw.
         * Draw like a boss w/o worrying of current affine transformation matrix.
         * @method cc.node.Node#draw
         * @param ctx {cc.render.RenderingContext} a rendering context, either canvas or webgl.
         */
        draw(ctx:RenderingContext) {
            if ( this._color!==DEFAULT_COLOR ) {
                ctx.globalAlpha= this._frameAlpha;
                ctx.setTintColor( cc.math.Color.WHITE );
                ctx.setFillStyleColor( this._color );
                ctx.fillRect(0, 0, this._contentSize.width, this._contentSize.height);
            }
        }

        /**
         * Set this node's name. Suitable for identifying and enumerateChildren.
         * @method cc.node.Node#setName
         * @param name {string} must be composed of [A-Za-z0-9_]+ characters.
         * @returns {cc.node.Node}
         */
        setName( name : string ) : Node {
            if ( ! /[A-Za-z0-9_]+/.test( name ) ) {
                cc.Debug.error( cc.locale.ERR_NODE_NAME_INVALID );
            }

            this._name= name;
            return this;
        }

        startActionChain() : cc.action.ActionChainContext {
            return new cc.action.ActionChainContext( this );
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

            if ( this._scene ) {
                this._scene.scheduleActionForNode( this, action );
            } else {
                this._actionsToSchedule.push(action);
            }

            return this;
        }

        /**
         * Stop a Node action with the given tag.
         * @method cc.node.Node#stopActionByTag
         * @param tag {string} action tag.
         * @returns {cc.node.Node}
         */
        stopActionByTag( tag : string ) : Node {
            if ( this._scene ) {
                this._scene.stopNodeActionByTag( this, tag );
            }
            return this;
        }

        stopAllActions() : Node {
            if ( this._scene ) {
                this._scene.stopActionsForNode(this);
            } else {
                this._actionsToSchedule=[];
            }

            return this;
        }

        /**
         * Set Node's Scene and allow for buffered Actions to be scheduled.
         * This method is called when <code>scene.onEnter</code> is called.
         * @method cc.node.Node#setScene
         * @param scene {cc.node.Scene}
         */
        setScene( scene : Scene ) : void {

            if (!scene) {
                return;
            }

            this._scene= scene;

            for( var i=0; i<this._actionsToSchedule.length; i++ ) {
                scene.scheduleActionForNode( this, this._actionsToSchedule[i] );
            }
            this._actionsToSchedule= [];

            for( var i=0; i<this._tasksToSchedule.length; i++ ) {
                scene.scheduleTask( this._tasksToSchedule[i] );
            }
            this._tasksToSchedule= [];

            if ( this.__isFlagSet( NodeDirtyFlags.EVENTS_ENABLED ) ) {
                this.__clearFlag( NodeDirtyFlags.EVENTS_ENABLED );
                this._scene.enableEventsForNode(this);
            }

            if ( this.__isFlagSet( NodeDirtyFlags.EVENTS_PRIORITY_ENABLED ) ) {
                this.__clearFlag( NodeDirtyFlags.EVENTS_PRIORITY_ENABLED );
                this._scene.enablePriorityEventsForNode(this);
            }

            for( var i=0; i<this._children.length; i++ ) {
                this._children[i].setScene( scene );
            }
        }

        enableEvents( enable:boolean ) : cc.node.Node {
            if ( this._scene ) {
                this._scene.enableEventsForNode(this);
            } else {
                this.__setFlag( NodeDirtyFlags.EVENTS_ENABLED );
            }

            return this;
        }

        enablePriorityEvents( enable:boolean, priority:number ) : cc.node.Node {
            this._inputEvents.priorityEventValue= priority;
            if ( this._scene ) {
                this._scene.enablePriorityEventsForNode(this);
            } else {
                this.__setFlag( NodeDirtyFlags.EVENTS_PRIORITY_ENABLED );
            }

            return this;
        }

        getInputPriority() : number {
            return this._inputEvents.priorityEventValue;
        }

        /**
         * Set the node's visibility.
         * @method cc.node.Node#setVisible
         * @param v {boolean}
         */
        setVisible( v : boolean ) {
            if ( v!==this.__isFlagSet(NodeDirtyFlags.VISIBLE) ) {
                if ( v ) {
                    this.__setFlag(NodeDirtyFlags.VISIBLE);
                } else {
                    this.__clearFlag(NodeDirtyFlags.VISIBLE);
                }
                this.__setFlag( NodeDirtyFlags.TRANSFORMATION_DIRTY );
            }
        }

        isVisible() : boolean {
            return this.__isFlagSet(NodeDirtyFlags.VISIBLE);
        }

        cleanup() {

            this.stopAllActions();
            this.unscheduleAllCallbacks();

            // event
            //cc.eventManager.removeListeners(this);

            for( var i=0; i<this._children.length; i++ ) {
                this._children[i].cleanup();
            }
        }


    /////////////// SCHEDULER METHODS START ////////////////

        /**
         * This method is here for only for backwards compatibility purposes.
         * it exists for historical reasons. Comes from Cocos2d iphone v2.
         * It is called when a call to scheduleUpdate is made.
         * @method cc.node.Node#update
         * @param delta {number}
         * @deprecated
         */
        update( delta:number ) {

        }

        /**
         * Schedule a update call with the given priority. <code>scheduleUpdate</code>,
         * <code>scheduleUpdateWithPriority</code> and <code>unscheduleUpdate</code>
         * methods are just for backwards compatibility.
         * @deprecated
         * @method cc.node.Node#scheduleUpdateWithPriority.
         * @param priority {number}
         */
        scheduleUpdateWithPriority( priority : number ) {
            var task:SchedulerQueueTask= cc.action.SchedulerQueue.createSchedulerTask(this,this.update,0,Number.MAX_VALUE,0);
            task._priority= priority;
            this.__scheduleImpl(task);
        }

        /**
         * Schedule a task to per frame call update for this node.
         * <code>scheduleUpdate</code>,
         * <code>scheduleUpdateWithPriority</code> and <code>unscheduleUpdate</code>
         * methods are just for backwards compatibility.
         * @method cc.node.Node#scheduleUpdate
         * @deprecated
         */
        scheduleUpdate() {
            var task:SchedulerQueueTask= cc.action.SchedulerQueue.createSchedulerTask(this,this.update,0,Number.MAX_VALUE,0);
            this.__scheduleImpl(task);
        }

        __scheduleImpl( task:SchedulerQueueTask ) {

            if ( this._scene ) {
                this._scene.scheduleTask(task);
            } else {
                this._tasksToSchedule.push(task);
            }
        }

        /**
         * Unschedule all update callbacks for this node.
         * <code>scheduleUpdate</code>,
         * <code>scheduleUpdateWithPriority</code> and <code>unscheduleUpdate</code>
         * methods are just for backwards compatibility.
         * @method cc.node.Node#unscheduleUpate
         */
        unscheduleUpate() {
            if (this._scene) {
                this._scene.unscheduleCallbackForTarget(this, this.update);
            }
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

            if ( this._scene ) {
                this._scene.scheduleTask(task);
            } else {
                this._tasksToSchedule.push(task);
            }
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

            if ( this._scene) {
                this._scene.unscheduleCallbackForTarget(this, callback_fn);
            }
        }

        /**
         * Unschedule all tasks for the node.
         * @method cc.node.Node#unscheduleAllCallbacks
         */
        unscheduleAllCallbacks() {
            if ( this._scene ) {
                this._scene.unscheduleAllCallbacks(this);
            } else {
                this._tasksToSchedule= [];
            }
        }

        /**
         * Resumes all scheduled tasks and actions.
         * This method is called internally by onEnter
         * @method cc.node.Node#resume
         */
        resume() {
            if ( this._scene ) {
                this._scene.resumeTarget(this);
            }

            // PENDING: implement
            //cc.eventManager.resumeTarget(this);
        }

        /**
         * Pauses all scheduled selectors and actions.
         * This method is called internally by onExit.
         * @method cc.node.Node#pause
         *
         */
        pause() {
            if ( this._scene ) {
                this._scene.pauseTarget(this);
            }

            // PENDING: implement
            //cc.eventManager.pauseTarget(this);
        }

        /**
         * V3 compatible method call.
         * The preferred and more powerful way of setting a node's composite operation will be
         * <code>setCompositeOperation</code>.
         *
         * @deprecated
         * @param src_o { number|{src:number, dst:number} } webgl blending source operation or an object with
         *   webgl blending source and destination operations.
         * @param dst {number} webgl blending destination operation.
         *
         * @returns {number} a cc.render.CompositeOperation enumeration value.
         */
        setBlendFunc( src_o: any, dst:number ) {

            cc.Debug.warn( cc.locale.WARN_DEPRECATED_SETBLENDFUNC );

            var src:number;

            if ( typeof dst === "undefined") {
                dst= src_o.dst;
                src= src_o.src;
            } else {
                src= src_o;
            }

            if (( src === cc.SRC_ALPHA && dst === cc.ONE)) {
                this.setCompositeOperation(cc.render.CompositeOperation.lighter);
            } else
            if ( (src === cc.ONE && dst === cc.ONE)) {
                this.setCompositeOperation(cc.render.CompositeOperation.add);
            }
            else if (src === cc.ZERO && dst === cc.SRC_ALPHA) {
                this.setCompositeOperation(cc.render.CompositeOperation.destination_in);
            }
            else if (src === cc.ZERO && dst === cc.ONE_MINUS_SRC_ALPHA) {
                this.setCompositeOperation(cc.render.CompositeOperation.destination_out);
            }
            else {
                this.setCompositeOperation(cc.render.CompositeOperation.source_over);
            }
        }

    /////////////// SCHEDULER METHODS END ////////////////

        /**
         * Set a bunch of properties for the node.
         * If a property does exists in Node, a warning is emitted and nothing will happen.
         * Only for backwards compatibility.
         * @deprecated
         * @method cc.node.Node#attr
         * @param properties {any} Collection of key/value pairs.
         * @returns {cc.node.Node}
         */
        attr( properties : any ) : Node {

            for( var property in properties ) {
                if ( properties.hasOwnProperty(property) ) {
                    var value= properties[ property ];
                        this[property] = value;
                }
            }

            return this;
        }

        /**
         * @deprecated
         * @method cc.node.Node#set:width
         * @param v {number}
         */
        set width( v : number ) {
            this._contentSize.width= v;
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
        }

        get width() : number {
            return this._contentSize.width;
        }

        get height() : number {
            return this._contentSize.height;
        }

        /**
         * @deprecated
         * @method cc.node.Node#set:height
         * @param v {number}
         */
        set height( v : number ) {
            this._contentSize.height= v;
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
        }

        /**
         * @deprecated
         * @method cc.node.Node#set:color
         * @param v {cc.math.Color}
         */
        set color( v : Color ) {
            this.setColor(v._color[0], v._color[1], v._color[2]);
        }

        /**
         * @deprecated
         * @method cc.node.Node#set:rotation
         * @param angle_in_deg {number}
         */
        set rotation( angle_in_deg:number ) {
            this.rotationAngle= angle_in_deg;
        }

        get rotation() {
            return this.rotationAngle;
        }

        /**
         * @deprecated
         * @method cc.node.Node#set:visible
         * @param v {boolean}
         */
        set visible( v: boolean ) {
            this.setVisible(v);
        }

        get visible() : boolean {
            return this.isVisible();
        }

        set anchorX( a:number ) {
            this._positionAnchor.x= a;
            this._transformationAnchor.x= a;
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
        }

        set anchorY( a:number ) {
            this._positionAnchor.y= a;
            this._transformationAnchor.y= a;
            this.__setFlag( NodeDirtyFlags.REQUEST_TRANSFORM );
        }

        set scale( s:number ) {
            this.scaleX= s;
            this.scaleY= s;
        }

        get parent() : Node {
            return this._parent;
        }

        get children() : Node[] {
            return this._children;
        }


/*
            cc.defineGetterSetter(_p, "anchorX", _p._getAnchorX, _p._setAnchorX);
            cc.defineGetterSetter(_p, "anchorY", _p._getAnchorY, _p._setAnchorY);
            cc.defineGetterSetter(_p, "skewX", _p.getSkewX, _p.setSkewX);
            cc.defineGetterSetter(_p, "skewY", _p.getSkewY, _p.setSkewY);
            cc.defineGetterSetter(_p, "zIndex", _p.getLocalZOrder, _p.setLocalZOrder);
            cc.defineGetterSetter(_p, "vertexZ", _p.getVertexZ, _p.setVertexZ);
            cc.defineGetterSetter(_p, "rotationX", _p.getRotationX, _p.setRotationX);
            cc.defineGetterSetter(_p, "rotationY", _p.getRotationY, _p.setRotationY);
            cc.defineGetterSetter(_p, "scale", _p.getScale, _p.setScale);
            cc.defineGetterSetter(_p, "children", _p.getChildren);
            cc.defineGetterSetter(_p, "childrenCount", _p.getChildrenCount);
            cc.defineGetterSetter(_p, "parent", _p.getParent, _p.setParent);
            cc.defineGetterSetter(_p, "running", _p.isRunning);
            cc.defineGetterSetter(_p, "ignoreAnchor", _p.isIgnoreAnchorPointForPosition, _p.ignoreAnchorPointForPosition);
            cc.defineGetterSetter(_p, "actionManager", _p.getActionManager, _p.setActionManager);
            cc.defineGetterSetter(_p, "scheduler", _p.getScheduler, _p.setScheduler);
            cc.defineGetterSetter(_p, "shaderProgram", _p.getShaderProgram, _p.setShaderProgram);
            cc.defineGetterSetter(_p, "opacityModifyRGB", _p.isOpacityModifyRGB);
            cc.defineGetterSetter(_p, "cascadeOpacity", _p.isCascadeOpacityEnabled, _p.setCascadeOpacityEnabled);
            cc.defineGetterSetter(_p, "cascadeColor", _p.isCascadeColorEnabled, _p.setCascadeColorEnabled);
*/
    }
}
