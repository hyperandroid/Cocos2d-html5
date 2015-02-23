/**
 * License: see license.txt file.
 */

/// <reference path="../node/Node.ts"/>
/// <reference path="../locale/Locale.ts"/>
/// <reference path="../util/Debug.ts"/>
/// <reference path="./KeyboardInputManager.ts"/>

module cc.input {

    import Node= cc.node.Node;
    import KeyboardInputManager= cc.input.KeyboardInputManager;

    /**
     * @class cc.input.InputManagerEvent
     * @classdesc
     *
     * This is the base type for all CocosJS input events.
     */
    export class InputManagerEvent {

        /**
         * Target is the object for which the event happened.
         * For example, for MouseInputManagerEvents, _target is the node in which the event happened.
         * @member cc.input.InputManagerEvent#_target
         * @type {Object}
         * @private
         */
        _target : any = null;

        /**
         * Input event type.
         * Identifies the emitted event type for each addEventListener event call.
         * @member cc.input.InputManagerEvent#_type
         * @type {string}
         * @private
         */
        _type : string = null;

        /**
         * Build a new InputManagerEvent object.
         * Does nothing.
         * @method cc.input.InputManagerEvent#constructor
         */
        constructor() {
        }

        /**
         * Get this event's target. The target can be any type.
         * @method cc.input.InputManagerEvent#get:target
         * @returns {any}
         */
        get target() : any {
            return this._target;
        }

        /**
         * Get the event target.
         * @method cc.input.InputManagerEvent#getCurrentTarget
         * @returns {cc.node.Node}
         */
        getCurrentTarget() : cc.node.Node {
            return this._target;
        }

        /**
         * Get this event's type.
         * @method cc.input.InputManagerEvent#get:type
         * @returns {string}
         */
        get type() : string {
            return this._type;
        }

        /**
         * Must override and honor.
         * @method cc.input.InputManagerEvent#initializeEventForTarget
         * @param target {Object} a target object.
         * @param type {string} an event type.
         *
         */
        initializeEventForTarget( target:any, type:string ) {
            this._target= target;
            this._type= type;
        }
    }

    /**
     * @class cc.input.InputManager
     * @classdesc
     *
     * General input manager object.
     *
     */
    export class InputManager {

        _keyboardManager: KeyboardInputManager = null;

        constructor() {

            this._keyboardManager= new cc.input.KeyboardInputManager();
        }

        enable( element:HTMLCanvasElement) : InputManager {
            this._keyboardManager.enable();
            cc.input.MouseInputManager.enable(element);
            return this;
        }

        disable() : InputManager {
            this._keyboardManager.disable();
            cc.input.MouseInputManager.disable();
            return this;
        }

        addEventListener(event, callback, params) {
            if (event==="keydown") {
                this._keyboardManager.onDown(params, callback)
            } else if (event==="keyup") {
                this._keyboardManager.onUp(params, callback)
            }
        }

        registerCursor( kd:cc.input.CursorInitializer, callback:(key:string, down:boolean)=>any ) : number {
            return this._keyboardManager.registerCursor( kd, callback );
        }

        unregisterCursor( id:number ) {
            this._keyboardManager.unregisterCursor(id);
        }
    }

    /**
     * @class cc.input.PriorityInputNode
     * @classdesc
     *
     * This class encapsulated a descriptor for priority input routing. Basically keeps track of a target Node and
     * a priority value.
     * These descriptors are sorted in priority value, meaning lower values will be evaluated for input first.
     */
    export class PriorityInputNode {

        /**
         * Input target.
         * @member cc.input.PriorityInputNode#node
         * @type {cc.node.Node}
         */

        /**
         * Priority value.
         * @member cc.input.PriorityInputNode#priority
         * @type {number}
         */

        /**
         * @method cc.input.PriorityInputNode#constructor
         * @param node {cc.node.Node}
         * @param priority {number}
         */
        constructor( public node:Node, public priority:number ) {

        }
    }

    /**
     *
     * @class cc.input.SceneGraphInputTreeNode
     * @classdesc
     *
     * Input is routed in two different ways:
     *  + prioritized: where elements are sorted in priority order.
     *  + scene graph: where elements are sorted in scene-graph order, that is, in a parent/child order.
     *
     * Some Input managers will keep a root node of this type, which has inserting/removing capabilities and keeps
     * nodes in SceneGraph order.
     *
     * Preferred way of input routing should be prioritized.
     * SceneGraph, for a large number of nodes, sounds reasonably to maintain an smaller subset of the scene graph
     * to try routing input to. For smaller amounts, sounds like not a good idea to keep a copy, and have to notify
     * each manager about scene-graph mutation operations to rebuild the nodes tree.
     *
     * The input system will traverse this tree in pre-order to test for input.
     *
     * This class will only be used for point-like input systems like mouse or touch.
     */
    export class SceneGraphInputTreeNode {

        /**
         * Target Node.
         * @member cc.input.SceneGraphInputTreeNode#node
         * @type {cc.node.Node}
         */
        node:Node=null;

        /**
         * This node's Scene-Graph priority children nodes.
         * @member cc.input.SceneGraphInputTreeNode#children
         * @type {cc.input.SceneGraphInputTreeNode}
         */
        children:SceneGraphInputTreeNode[]=null;

        /**
         * Is this node enabled ? if not, it won't be tested for input.
         * @member cc.input.SceneGraphInputTreeNode#enabled
         * @type {boolean}
         */
        enabled:boolean=false;

        /**
         * Create a new Scene-Graph priority node/tree.
         * @method cc.input.SceneGraphInputTreeNode#constructor
         * @param node {cc.node.Node=}
         */
        constructor( node?:Node ) {
            this.children= [];
            if (typeof node!=="undefined" ) {
                this.node= node;
            }
        }

        /**
         * Insert a Path of nodes.
         * A path of nodes is an array of a Node, and all its ancestors.
         * These path will be added to the tree, creating nodes for missing nodes, and modifying existing ones for input
         * route enable as needed.
         * If the path does not have as top most ancestor the tree's root node, nothing will be added, and an error
         * will be sent to the console.
         * @method cc.input.SceneGraphInputTreeNode#insert
         * @param path {Array<cc.node.Node>}
         */
        insert( path:Node[] ) : SceneGraphInputTreeNode {
            var lastNode= path[ path.length - 1 ];
            if ( lastNode===this.node ) {
                return this.__insertImpl( this, path );
            } else {
                cc.Debug.warn(cc.locale.INPUT_WARN_WRONG_ROOT_NODE);
            }

            return null;
        }

        /**
         * Node path insertion implementation.
         * @method cc.input.SceneGraphInputTreeNode#__insertImpl
         * @param inputNode {cc.input.SceneGraphInputTreeNode} a tree node.
         * @param path {Array<cc.node.Node>} node path.
         * @returns {cc.input.SceneGraphInputTreeNode}
         * @private
         */
        __insertImpl( inputNode:SceneGraphInputTreeNode, path:Node[] ) : SceneGraphInputTreeNode {

            var pathNode= path.pop();

            // adding input to the inputNode.
            if ( pathNode!==inputNode.node ) {
                // the node is not of this input tree node.
                // add it as children, and go on.
                inputNode= inputNode.addChildInputNode( pathNode );
            }

            if ( path.length===0 ) {
                inputNode.enabled = true;
            } else {
                return this.__insertImpl( inputNode, path );
            }

            return inputNode;
        }

        /**
         * Add a node as a Scene-Graph priority tree node's child.
         * @method cc.input.SceneGraphInputTreeNode#addChildInputNode
         * @param node {cc.node.Node}
         * @returns {*}
         */
        addChildInputNode( node:Node ) : SceneGraphInputTreeNode {

            // make sure the node does not already exist wrapped into a SceneGraphInputTreeNode
            for( var i=0; i<this.children.length; i++ ) {
                if ( this.children[i].node===node ) {
                    return this.children[i];
                }
            }

            // the node is not as children

            var newInputNode= new SceneGraphInputTreeNode(node);

            this.children.push( newInputNode );
            this.children.sort( function( sn0:SceneGraphInputTreeNode, sn1:SceneGraphInputTreeNode ) : number {

                // nodes for input are sorted inversely, input goes to the top most.

                var n0:Node= sn0.node;
                var n1:Node= sn1.node;

                if ( n0._localZOrder < n1._localZOrder ) {
                    return 1;
                }

                if (n0._localZOrder > n1._localZOrder) {
                    return -1;
                }

                return n0._orderOfArrival < n1._orderOfArrival ? 1 : -1;

            });

            return newInputNode;
        }

        /**
         * Flatten this tree and get an array of pre-order sorted nodes.
         * @method cc.input.SceneGraphInputTreeNode#flatten
         * @returns {Array<cc.node.Node>}
         */
        flatten() : Node[] {
            var ret: Node[]= [];
            this.__flattenImpl( this, ret );

            return ret;
        }

        /**
         * Tree flatten operation implementation.
         * @method cc.input.SceneGraphInputTreeNode#__flattenImpl
         * @param inputNode {cc.input.SceneGraphInputTreeNode} a tree node.
         * @param nodes {Array<cc.node.Node>} an array to push the sorted nodes.
         * @private
         */
        __flattenImpl( inputNode: SceneGraphInputTreeNode, nodes:Node[] ) {

            var i;

            for( i=0;i<inputNode.children.length; i++ ) {
                this.__flattenImpl( inputNode.children[i], nodes );
            }

            // all enabled nodes, must be added to the list of enabled elements.
            if ( inputNode.enabled ) {
                nodes.push( inputNode.node );
            }
        }

        /**
         * For an screen position, get the first node that is at that position and has input enabled.
         * This will be the target of the pointer input operation.
         * @method cc.input.SceneGraphInputTreeNode#findNodeAtScreenPoint
         * @param e {cc.input.MouseInputManager}
         * @returns {cc.node.Node}
         */
        findNodeAtScreenPoint( e:MouseInputManagerEvent ) : Node {
            return this.__findNodeAtScreenPoint( this, e );
        }

        /**
         * findNodeAtScreenPoint's implementation
         * @method cc.input.SceneGraphInputTreeNode#__findNodeAtScreenPoint
         * @param inputNode {cc.input.SceneGraphInputTreeNode}
         * @param e {cc.input.MouseInputManager}
         * @returns {cc.node.Node}
         * @private
         */
        __findNodeAtScreenPoint( inputNode:SceneGraphInputTreeNode, e:MouseInputManagerEvent ) : Node {

            var i;

            for( i=0;i<inputNode.children.length; i++ ) {
                var node:Node= this.__findNodeAtScreenPoint( inputNode.children[i], e );
                if ( node ) {
                    return node;
                }
            }

            // all enabled nodes, must be added to the list of enabled elements.
            if ( inputNode.enabled ) {
                var node:Node= inputNode.node;
                e.localPoint.set( e._screenPoint.x, e._screenPoint.y );
                if ( node.isScreenPointInNode(e.localPoint) ) {
                    return node;
                }
            }

            return null;
        }
    }
}