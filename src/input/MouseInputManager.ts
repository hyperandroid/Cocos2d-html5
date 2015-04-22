/**
 * License: see license.txt file.
 */

/// <reference path="../math/Point.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="../node/Scene.ts"/>
/// <reference path="InputManager.ts"/>

module cc.input {

    import Vector= cc.math.Vector;
    import Point= cc.math.Point;
    import Scene= cc.node.Scene;
    import Node= cc.node.Node;

    import SceneGraphInputTreeNode= cc.input.SceneGraphInputTreeNode;
    import PriorityInputNode= cc.input.PriorityInputNode;
    import InputManagerEvent= cc.input.InputManagerEvent;

    var __p0:Vector= new Vector();

    /**
     * DOM target element. Tipically a Canvas object.
     * Director will call this method when the renderer is set.
     * @type {HTMLElement}
     * @private
     */
    var _target : HTMLCanvasElement = null;

    /**
     * Current event screen-space point.
     * @type {cc.math.Vector}
     * @private
     */
    var _screenPoint : Vector = new Vector();

    /**
     * Previous event screen-space point. When a drag event is detected, the event emitted will contain current and
     * previous screen coordinated which will allow for a proper dragging calculation w/o the client need to store
     * previous coords.
     * @type {cc.math.Vector}
     * @private
     */
    var _prevScreenPoint : Vector = new Vector();

    /**
     * Mouse event in _target space. For a node this will have the _screenPoint transformed to node's local coordinate
     * system (regardless of the compound affine transform it has).
     * @type {cc.math.Vector}
     * @private
     */
    var _targetPoint : Vector = new Vector();

    /**
     * This is director's current scene.
     * It is needed since each scene will have two lists for input: priority and scene-graph order.
     * @type {cc.node.Scene}
     * @private
     */
    var _scene : Scene = null;

    /**
     * Flag indicating whether the mouse/touch is pressed when moving. This allows to differentiate between move and drag.
     * @type {boolean}
     * @private
     */
    var _isMouseDown:boolean= false;

    /**
     * Is dragging internal flag.
     * @type {boolean}
     * @private
     */
    var _isDragging:boolean= false;

    var _isDraggingInCapture:boolean= false;

    /**
     * When the mouse/pointer is down, a target Node is identified as event target.
     * This variable holds a Node reference as capturing Node.
     * @type {cc.node.Node}
     * @private
     */
    var _currentCaptureNode:Node= null;

    /**
     * Internal flag that identifies an IOS user agent.
      * @type {Navigator|string[]}
     */
    var isIOS= navigator && navigator.userAgent.match(/iOS/);


    /**
     * Create a MouseInputManagerEvent.
     * This event contains:
     *   + target for the event. A Node.
     *   + type of event (mouseover, mouseout, mousedown, mouseup, mousemove, mousedrag, mouseclick, doubleclick)
     *   + screen point (canvas space) where the event originated.
     *   + previous screen point (canvas space) where the event originated in the previous event.
     *   + local node point (node space) where the event originated in the previous event.
     *
     * WARNING: all properties of this event must be copied. Don't rely on the point values unless you make a copy
     * of them.
     * WARNING: don't change any of the event properties in the callback functions it is passed to.
     *
     * @param e {MouseEvent} original DOM event
     * @param event {string} the type of event that will be emitted.
     * @param node {cc.node.Node} a target node.
     *
     * @returns {MouseInputManagerEvent}
     */
    function createEvent( e:MouseEvent, event:string, node:Node ) : MouseInputManagerEvent {

        var mie:MouseInputManagerEvent= new MouseInputManagerEvent(e);

        getTargetSpacePoint( __p0, e );

        // original canvas-space position
        mie.setScreenPoint( __p0.x, __p0.y );

        if (null===_prevScreenPoint) {
            _prevScreenPoint= new Vector( __p0.x, __p0.y );
        }

        mie.localPoint.x= mie.screenPoint.x;
        mie.localPoint.y= mie.screenPoint.y;

        mie.prevScreenPoint.x= _prevScreenPoint.x;
        mie.prevScreenPoint.y= _prevScreenPoint.y;

        mie.initializeEventForTarget( node, event );

        return mie;
    }

    function routeEvent( p:Vector, callback?:(node:Node)=>boolean ) : Node {
        if ( _scene) {
            return _scene.findNodeAtScreenPoint( p, callback );
        }

        return null;
    }

    /**
     * Mouse down handler.
     * @param e {MouseEvent}
     */
    function mouseDown(e:MouseEvent) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        __inputDown(createEvent(e, "mousedown", _currentCaptureNode), "mousedown");
    }

    function __inputDown( ee:MouseInputManagerEvent, event ) {
        _isMouseDown = true;

        ee._localPoint.set( ee._screenPoint.x, ee._screenPoint.y );
        routeEvent( ee._localPoint , function(node:Node) : boolean {

            var ret= false;

            if ( node ) {
                ee._type = event;
                ee._target = node;
                ret= node.notifyEvent(ee);
            }

            if (_currentCaptureNode !== node && !ret ) {

                if ( _currentCaptureNode ) {
                    ee._type = event === "mousedown" ? "mouseout" : "touchend";
                    ee._target = _currentCaptureNode;
                    _currentCaptureNode.notifyEvent(ee);
                }
            }

            if (!ret) {
                _currentCaptureNode = node;
            }

            _prevScreenPoint.set(ee.screenPoint.x, ee.screenPoint.y);

            return ret;
        } );
    }

    /**
     * Mouse up handler
     * @param e {MouseEvent}
     */
    function mouseUp(e) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        __inputUp(createEvent(e, "mouseup", _currentCaptureNode), "mouseup");
    }

    function __inputUp( ee:MouseInputManagerEvent, event ) {

        ee._localPoint.set( ee._screenPoint.x, ee._screenPoint.y );
        var node= routeEvent( ee._localPoint );

            var ret= false;

            if (_currentCaptureNode) {
                // up in a different node
                if (_currentCaptureNode !== node) {
                    // send out to the previous one.
                    ee._type = event === "mouseup" ? "mouseout" : "touchend";
                    ee._target = _currentCaptureNode;
                    ee.localPoint.x = ee.screenPoint.x;
                    ee.localPoint.y = ee.screenPoint.y;
                    _currentCaptureNode.isScreenPointInNode(ee.localPoint);
                    _currentCaptureNode.notifyEvent(ee);

                    // eat the out.
                } else {
                    // up in the same captured node

                    // notify mouse up
                    _currentCaptureNode.notifyEvent(ee);

                    // and if not dragging, mouse click
                    if (!_isDragging && event === "mouseup") {
                        ee._type = "mouseclick";
                        ee._target = _currentCaptureNode;
                        _currentCaptureNode.notifyEvent(ee);
                    }
                }
            }

            _currentCaptureNode = null;
            _isMouseDown = false;
            _isDragging = false;
            _isDraggingInCapture = false;

            _prevScreenPoint = null;

    }

    /**
     * Mouse move handler
     * @param e {MouseEvent}
     * @param _event {string} mouseout/mouseover are treated as mouseMove. If set, this variable forces the event type.
     */
    function mouseMove(e, _event?) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        var event = _event ? _event : (_isMouseDown ? "mousedrag" : "mousemove");
        __inputMove(createEvent(e, event, _currentCaptureNode), event);
    }

    function __inputMove( ee:MouseInputManagerEvent, event:string ) {

        if (_isMouseDown) {
            _isDragging = true;
            _isDraggingInCapture = true;
        }

        // drag is sent to the captured node.
        if (!_isDragging) {


            ee._localPoint.set( ee._screenPoint.x, ee._screenPoint.y );
            routeEvent( ee._localPoint, function(node:Node) : boolean {

                var ret= false;

                if ( node ) {
                    ee._type= event;
                    ee._target = node;
                    ret= node.notifyEvent( ee );
                }

                if (node !== _currentCaptureNode && !ret) {
                    // if there's a previous capture node notify mouse-out on it.
                    if (_currentCaptureNode) {
                        ee._type = event === "mousedrag" || event === "mousemove" ? "mouseout" : "touchout";
                        ee._target= _currentCaptureNode;
                        _currentCaptureNode.notifyEvent(ee);
                    }

                    if ( node ) {
                        ee._type= event === "mousedrag" || event === "mousemove" ? "mouseover" : "touchover";
                        ee._target = node;
                        ret= node.notifyEvent( ee );
                    }
                }

                if (!ret) {
                    _currentCaptureNode = node;
                }

                _prevScreenPoint.set( ee.screenPoint.x, ee.screenPoint.y );

                return ret;
            });

        } else {
            // dragging


            // dragging outside the capture node ??
            //routeEvent( ee.screenPoint, function(node:Node) : boolean {

            ee._localPoint.set( ee._screenPoint.x, ee._screenPoint.y );
            var node= routeEvent( ee._localPoint );

                var ret= false;

                if (node !== _currentCaptureNode) {
                    if (_currentCaptureNode) {
                        ee._type = ee._type = event === "mousedrag" || event === "mousemove" ? "mouseout" : "touchout";
                        ee.localPoint.x = ee.screenPoint.x;
                        ee.localPoint.y = ee.screenPoint.y;
                        _currentCaptureNode.getScreenPointInLocalSpace(ee.localPoint);
                        _currentCaptureNode.notifyEvent(ee);
                        _isDraggingInCapture = false;
                    }
                } else {
                    if (!_isDraggingInCapture) {
                        _isDraggingInCapture = true;
                        ee._type = ee._type = event === "mousedrag" || event === "mousemove" ? "mouseover" : "touchover";
                        _currentCaptureNode.notifyEvent(ee);
                    }
                }

                // notify mouse-over to the new capture node
                if (_currentCaptureNode !== null) {
                    ee._type= event;
                    ee._target= _currentCaptureNode;
                    //ret= _currentCaptureNode.notifyEvent( ee );
                    ret= _currentCaptureNode.notifyEvent( ee );
                }

                _prevScreenPoint.set( ee.screenPoint.x, ee.screenPoint.y );

                //return ret;

            //});
        }

    }

    /**
     * double click handler.
     * @param e {MouseEvent}
     */
    function doubleClick(e) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        var ee= createEvent(e, "doubleclick", _currentCaptureNode);
        if (_currentCaptureNode) {
            _currentCaptureNode.notifyEvent( ee);
        } else {
            ee._localPoint.set( ee._screenPoint.x, ee._screenPoint.y );
            routeEvent( ee._localPoint, function(node:Node) : boolean {

                var ret= false;
                if (_currentCaptureNode) {
                    ret= _currentCaptureNode.notifyEvent(ee);
                }

                return ret;
            });
        }

        _prevScreenPoint= null;
    }

    /**
     * Mouse over handler.
     * @param e {MouseEvent}
     */
    function mouseOver(e) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        mouseMove(e, "mouseoever");
    }

    /**
     * Mouse out handler
     * @param e {MouseEvent}
     */
    function mouseOut(e) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        mouseMove(e,"mouseout");

    }

    function touchStart(e) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        __inputDown( createEvent(e.targetTouches[0],"touchstart",_currentCaptureNode), "touchstart" );
    }

    function touchEnd(e) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        __inputUp( createEvent(e.changedTouches[0],"touchend",_currentCaptureNode), "touchend" );

    }

    function touchMove(e) {
        e.preventDefault();
        if (e.stopPropagation) {e.stopPropagation()}

        if (!_scene) { return; }

        __inputMove( createEvent(e.targetTouches[0],"touchmove",_currentCaptureNode), "touchmove" );
    }

    function __accumulateOffset(node:HTMLElement, parentProperty:string, property:string) {

        var left = property + 'Left';
        var top = property + 'Top';
        var x = 0, y = 0, style;

        while (isIOS && node && node.style) {
            if (node.currentStyle) {
                style = node.currentStyle.position;
            } else {
                style = (node.ownerDocument.defaultView || node.ownerDocument.parentWindow).getComputedStyle(node, null);
                style = style ? style.getPropertyValue('position') : null;
            }

            if (!/^(fixed)$/.test(style)) {
                x += node[left];
                y += node[top];
                node = node[parentProperty];
            } else {
                break;
            }
        }

        return {
            x: x,
            y: y,
            style: style
        };
    }

    /**
     * Get a DOM node offset based on its position attribute.
     * @param node {HTMLElement}
     * @returns {cc.math.Point}
     * @private
     */
    function __getOffset(node:HTMLElement) {

        var res = __accumulateOffset(node, 'offsetParent', 'offset');
        if (res.style === 'fixed') {
            var res2 = __accumulateOffset(node, node.parentNode ? 'parentNode' : 'parentElement', 'scroll');
            return {
                x: res.x + res2.x,
                y: res.y + res2.y
            };
        }

        return {
            x: res.x,
            y: res.y
        };
    }

    /**
     * This function tansforms a window-space input coordinate event into a _target-space coordinate.
     * Modern browsers have a getBoundingClientRect for this purpose, but older don't so a more complex mechanism for
     * finding out the coordinate is deployed.
     * This includes logic based on the position style of the canvas, screen scroll, etc., and some other perks.
     *
     * It surely does not cover corner or weird cases !!!.
     *
     * It also stores the _screenPoint value.
     *
     * @param point {cc.math.Point} an output point.
     * @param e {MouseEvent}
     */
    function getTargetSpacePoint(point, e) {

        _screenPoint.x = e.clientX;
        _screenPoint.y = e.clientY;

        var posx = 0;
        var posy = 0;

        if ( (<any>navigator).isCocoonJS) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (typeof e.offsetX !== "undefined" || typeof e.layerX !== "undefined" || typeof e.clientX !== "undefined") {
            var bcr = _target.getBoundingClientRect();

            posx = e.clientX; // || e.offsetX || e.layerX;
            posy = e.clientY; // || e.offsetY || e.layerY;

            posx = (posx - bcr.left) * (_target.width / bcr.width);
            posy = (posy - bcr.top) * (_target.height / bcr.height);

        } else {

            /**
             * older browsers.
             * survival model. try to find things on your own by traversing upwards the DOM tree.
             */
            if (!e) e = window.event;

            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            var offset = __getOffset(this.canvas);

            posx -= offset.x;
            posy -= offset.y;
        }

        _targetPoint.set(posx, posy);
        point.set(posx, posy);

    }

    /**
     * @class cc.input.MouseInputManagerEvent
     * @extends cc.input.InputManagerEvent
     * @classdesc
     *
     * This class represents information for a Mouse-level event and translated into CocosJS needed information.
     *
     */
    export class MouseInputManagerEvent extends InputManagerEvent {

        /**
         * Original DOM level event that triggered this MouseInputManagerEvent
         * @member cc.input.MouseInputManagerEvent#_originalDOMEvent
         * @type {MouseEvent}
         * @private
         */
        _originalDOMEvent : MouseEvent= null;

        /**
         * position in canvas space.
         * @member cc.input.MouseInputManagerEvent#_screenPoint
         * @type {cc.math.Vector}
         * @private
         */
        _screenPoint:Vector= null;

        /**
         * Target Node local coordinate.
         * @member cc.input.MouseInputManagerEvent#_screenPoint
         * @type {cc.math.Vector}
         * @private
         */
        _localPoint:Vector= null;

        /**
         * For a dragging operation, position in canvas space of the previous event.
         * @member cc.input.MouseInputManagerEvent#_screenPoint
         * @type {cc.math.Vector}
         * @private
         */
        _prevScreenPoint:Vector= null;

        /**
         * Create a new MouseInputManagerEvent instance.
         * @method cc.input.MouseInputManagerEvent#constructor
         * @param e {MouseEvent} DOM level original event.
         */
        constructor(e:MouseEvent) {
            super();
            this._originalDOMEvent= e;
            this._screenPoint= new Vector();
            this._localPoint= new Vector();
            this._prevScreenPoint= new Vector();
        }

        getDelta() : cc.math.Point {
            return {
                x: this._screenPoint.x - this._prevScreenPoint.x,
                y: this._screenPoint.y - this._prevScreenPoint.y
            }
        }

        /**
         * Set this event's screen point.
         * @method cc.input.MouseInputManagerEvent#setScreenPoint
         * @param x {number}
         * @param y {number}
         */
        setScreenPoint( x:number, y:number ) {
            this._screenPoint.set(x,y);
        }

        /**
         * Initialize the event for type and target.
         * @method cc.input.MouseInputManagerEvent#initializeEventForTarget
         * @param target {cc.node.Node}
         * @param event {string}
         */
        initializeEventForTarget( target:Node, event:string ) {
            super.initializeEventForTarget(target, event);

            this._localPoint.set(this._screenPoint.x, this._screenPoint.y);
        }

        /**
         * Get target Node's local coordinate where the event originated.
         * @method cc.input.MouseInputManagerEvent#get:localPoint
         * @returns {cc.math.Vector}
         */
        get localPoint() : Vector {
            return this._localPoint;
        }

        /**
         * Get target screen coordinate where the previous event originated.
         * @method cc.input.MouseInputManagerEvent#get:prevScreenPoint
         * @returns {cc.math.Vector}
         */
        get prevScreenPoint() : Vector {
            return this._prevScreenPoint;
        }

        /**
         * Get target screen coordinate where the event originated.
         * @method cc.input.MouseInputManagerEvent#get:screenPoint
         * @returns {cc.math.Vector}
         */
        get screenPoint() : Vector {
            return this._screenPoint;
        }
    }

    function hasTouch() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }


    /**
     * @class cc.input.MouseInputManager
     * @classdesc
     *
     * This object is CocosJS system general mouse/touch input manager.
     * Mouse events are registered at window level. This will prevent from stop receiving input events if the mouse/touch
     * gets out of the canvas area, but on the other hand, it will impose a more complicated local canvas coordinate
     * matching for older browsers.
     *
     * It is a non-instantiable object, and a call to enable/disable, like to any other system-wide input event must
     * be performed before receiving input events.
     *
     * Touch events are mapped as follows:
     *
     *  <li>touch start -> mousedown
     *  <li>touch end   -> mouseup
     *  <li>touch move  -> mousedrag
     *
     * There's no need to register specific listeners for the touch events. If a corresponding mouse event is registered
     * it will be notified on these instead.
     *
     */
    export class MouseInputManager {

        /**
         * Set the scene to route input events to.
         * This happens automatically at director level whenever a call to runAction happens.
         * @method cc.input.MouseInputManager.enableInputForScene
         * @param scene {cc.node.Scene}
         */
        static enableInputForScene( scene:Scene ) {
            _scene= scene;

        }

        static disableInputForScene( ) {
            _scene= null;

        }

        /**
         * Enable the input for mouse and touch.
         * @method cc.input.MouseInputManager.enable
         * @param target {HTMLCanvasElement} canvas target.
         */
        static enable(target:HTMLCanvasElement) {
            if ( _target!==null ) {
                this.disable();
            }
            _target= target;


            if ( hasTouch() ) {
                target.addEventListener("touchstart", touchStart, false);
                target.addEventListener("touchmove", touchMove, false);
                target.addEventListener("touchend", touchEnd, false);
            } else {

                target.addEventListener('mouseup',  mouseUp,    false);
                target.addEventListener('mousedown',mouseDown,  false);
                target.addEventListener('mouseover',mouseOver,  false);
                target.addEventListener('mouseout', mouseOut,   false);
                target.addEventListener('mousemove',mouseMove,  false);
                target.addEventListener('dblclick', doubleClick,false);
            }
        }

        /**
         * Disable the input for mouse and touch.
         * @method cc.input.MouseInputManager.disable
         */
        static disable() {

            if ( _target!==null ) {

                if ( hasTouch() ) {
                    _target.removeEventListener("touchstart", touchStart, false);
                    _target.removeEventListener("touchmove", touchMove, false);
                    _target.removeEventListener("touchend", touchEnd, false);
                } else {

                    window.removeEventListener('mouseup',  mouseUp,     false);
                    window.removeEventListener('mousedown',mouseDown,   false);
                    window.removeEventListener('mouseover',mouseOver,   false);
                    window.removeEventListener('mouseout', mouseOut,    false);
                    window.removeEventListener('mousemove',mouseMove,   false);
                    window.removeEventListener('dblclick', doubleClick, false);
                }

                _target= null;
            }
        }
    }

}