/**
 * License: see license.txt file
 */

/// <reference path="../math/Dimension.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../locale/Locale.ts"/>
/// <reference path="../util/Debug.ts"/>

module cc.render {

    /**
     * Orientation events callback objects.
     * @name OrientationCallback
     * @memberOf cc.render
     * @callback OrientationCallback
     */

    export type WindowResizeCallback= (w:number, h:number) => any;

    export type OrientationErrorCallback= ()=>any;
    export type OrientationOkCallback= ( o:OrientationStrategy )=>any;

    /**
     * Full screen events callback objects.
     * @memberOf cc.render
     * @callback FullScreenCallback
     */
    export type FullScreenCallback= ()=>any;

    /**
     * When setScaleContent is called on a renderer, this hint will tell how to position scenes in director's area.
     * TOP and BOTTOM values are specified regardless of y-axis rendering origin. TOP will always be TOP of the screen.
     * @tsenum cc.render.ScaleContentSceneHint
     */
    export enum ScaleContentSceneHint {
        TOP= 1,
        LEFT=2,

        BOTTOM=4,
        RIGHT=8,

        CENTER=16,
        STRETCH=32
    }

    /**
     * Values for Scale canvas and Scale content.
     * @tsenum cc.render.ScaleManagerStrategy
     */
    export enum ScaleManagerStrategy {

        NONE =          0,
        SCALE_FIT =     1,
        SCALE_ASPECT =  2,
        SCALE_CONTENT=  128
    }

    /**
     * Values for forcing orientation.
     * @tsenum cc.render.OrientationStrategy
     */
    export enum OrientationStrategy {

        BOTH        = 0,
        PORTRAIT    = 1,
        LANDSCAPE   = 2
    }

    /**
     * Values for canvas positioning inside parent node after setting canvas Scale values.
     * @tsenum cc.render.ScalePosition
     */
    export enum ScalePosition {

        NONE    = 0,
        CENTER  = 1,
        LEFT    = 2,
        RIGHT   = 4
    }

    /**
     * @class cc.render.ScaleManager
     * @classdesc
     *
     *
     * The ScaleManager object has different responsibilities that affect the final visual of the built Canvas object.
     * <p>
     * Its main responsibilities are:
     * <ul>
     *     <li>Up/Down scale the canvas object to fit the screen.
     *     <li>Up/Down scale the game content.
     *     <li>Fix the orientation and notify when it changes.
     * </ul>
     * <p>
     * There are important differences between the first and second responsibility, as well as important performance/visual
     * implications.
     *
     * <h3>Up/Down scale the canvas object.</h3>
     * <p>
     *     This feature affects the canvas object, which is scaled using css attributes. This operation affects the final
     *     game's visual quality. For example, if your game uses a 400x300 pixels canvas object, and the window is 1200x900
     *     pixels, the canvas object could be scaled by 3 in each axe, which will lower the visual quality. There are
     *     ways of overcoming this by up/down scaling the game content though.
     * <p>
     *     These scaling operations are sensitive to the DOM node that contains the canvas object though. Internally, this
     *     API call modifies the canvas size with a CSS style.
     * <p>
     *     There are two different modifiers which will tell how to up/down scale the canvas object:
     *
     *     <h4>Scale strategy (How to scale the canvas)</h4>
     *
     *     <ul>NONE</ul>
     *     <p>
     *         This modifier does not change the canvas in any way. It will be presented on screen with the original size
     *     <ul>SCALE_FIT</ul>
     *     <p>
     *         This modifier will stretch the canvas to fit the DOM parent container object. The stretching can be uneven,
     *         breaking the aspect ratio.
     *     <ul>SCALE_ASPECT</ul>
     *     <p>
     *         This modifier will stretch the canvas preserving its aspect ratio. The final scaled Canvas may not take
     *         over the whole parent node's screen area, and some letterboxing effect may occur. This effect makes some
     *         horizontal or vertical lines appear since the canvas can't cover the whole area. You control how these
     *         lines appear with the ScalePosition modifier.
     *
     *     <h4>Scale position (how to position the canvas relative to the parent's client area.</h4>
     *     <ul>NONE</ul>
     *     <p>
     *         Do nothing special. Follow the natural browser rules to position the canvas in the parent. If the
     *         scale strategy is SCALE_ASPECT, the letter-boxing will be on the right/bottom or left/bottom (depending
     *         if the browser writes text left-to-right or right-to-left respectively).
     *     <ul>LEFT</ul>
     *     <p>
     *         Force the canvas position to be left in the parent Node's client area.
     *     <ul>RIGHT</ul>
     *     <p>
     *         Force the canvas position to be right in the parent Node's client area.
     *     <ul>CENTER</ul>
     *     <p>
     *         Force the canvas position to be centered in the parent Node's client area. When the ccale strategy is
     *         SCALE_ASPECT, this is the best option since the letterbox will be evenly distributed to the sides or
     *         top/down of the canvas.
     *
     * <h3>Up/down scale the canvas content, not the canvas itself.</h3>
     * <p>
     *     This feature affects the Canvas content which has a direct impact in better visual quality (if higher resolution
     *     graphics are used) but has an impact in performance as well (bigger graphics, could mean lower performance).
     * <p>
     *     When you want to build a retina enabled game, this is the feature you need to focus on.
     * <p>
     *     Basically, what we want to achieve is to break the bound between pixels and in-game units. This is what happens
     *     with retina displays, which for example, report a 480x320 viewport size, while the actual screen resolution
     *     is 960x640. The system is breaking the bound between points and pixels.
     * <p>
     *     For our games, we may to achieve the same effect, and it is achieved by setting the ratio between pixels and
     *     game units.
     * <p>
     *     A call in the ScaleManager of the form: <code>setScaleContent( unitsWidth:number, unitsHeight:number )</code>
     *     must be done. This will instrument the CocosJS core to break the bound, and start upscaling content.
     *     CocosJS already makes all internal considerations to draw bigger resources in the same screen area resulting
     *     in an upgraded visual experience at no cost.
     * <p>
     *     Internally this API will build a bigger canvas to conform to all the available space, so don't rely on
     *     canvas.width or canvas.height values at all in your game.
     *
     *
     * <h3>Orientation</h3>
     * <p>
     *     This feature affects mobile device or screen orientation. Events for this events can be fired as well if the
     *     browser window aspect ratio changes.
     * <p>
     *     Even though the screen orientation can't yet be locked in HTML5, this API will allow you to manually switch
     *     to a wrong-orientation mode. The default orientation mode is BOTH, so any orientation will be considered valid.
     * <p>
     *     A call to <code>ScaleManager.forceOrientation( orientation:OrientationStrategy, onOk, onError )</code>
     *     must be done to enable orientation control.
     *
     *
     */
    export class ScaleManager {

        /**
         * A DOM Node, and is the reference node to calculate values for ScaleStrategy's canvas
         * positioning. Null means to use the window as reference.
         * @member cc.render.ScaleManager#_referenceParentNode
         * @type {HTMLElement}
         * @private
         */
        _referenceParentNode:HTMLElement= null;

        /**
         * The Scale strategy for up/down scaling the canvas object. Values are from the enum
         * object ScaleManagerStrategy. By default, no scale on the canvas will be applied.
         * @member cc.render.ScaleManager#_scaleStrategy
         * @type {number}
         * @private
         */
        _scaleStrategy:ScaleManagerStrategy = ScaleManagerStrategy.NONE;

        /**
         * The Canvas position after setting a ScaleStrategy value. By default, no Position will be forced since by default,
         * there's no scale to apply. Values are from the enum object ScalePosition.
         * @member cc.render.ScaleManager#_scalePosition
         * @type {number}
         * @private
         */
        _scalePosition:ScalePosition = ScalePosition.NONE;

        /**
         * The preferred Game orientation. By default, both orientations are suitable. The values are from the enum
         * object OrientationStrategy.
         * @member cc.render.ScaleManager#_forceOrientationStrategy
         * @type {number}
         * @private
         */
        _forceOrientationStrategy:OrientationStrategy = OrientationStrategy.BOTH;

        /**
         * Internal boolean that sets current orientation as valid or not depending on the forced orientation strategy.
         * @member cc.render.ScaleManager#_wrongOrientation
         * @type {boolean}
         * @private
         */
        _wrongOrientation:boolean= false;

        /**
         * Callback invoked when the device is or enters in a wrong orientation.
         * @member cc.render.ScaleManager#_onOrientationError
         * @type {cc.render.OrientationCallback}
         * @private
         */
        _onOrientationError: OrientationErrorCallback = null;

        /**
         * Callback invoked when the device is or enters in a valid orientation.
         * @member cc.render.ScaleManager#_onOrientationOk
         * @type {cc.render.OrientationCallback}
         * @private
         */
        _onOrientationOk: OrientationOkCallback = null;

        /**
         * Is the game in fullscreen ?
         * @member cc.render.ScaleManager#_fullScreen
         * @type {boolean}
         * @private
         */
        _fullScreen= false;

        /**
         * Is current browser/device/wrapper full screen capable ?
         * @member cc.render.ScaleManager#_fullScreenCapable
         * @type {boolean}
         * @private
         */
        _fullScreenCapable= false;

        /**
         * Canvas object to apply the Scale strategies to.
         * @member cc.render.ScaleManager#_surface
         * @type {HTMLCanvasElement}
         * @private
         */
        _surface:HTMLCanvasElement= null;

        /**
         * Current browser vendor prefix for orientation and full screen operations.
         * @member cc.render.ScaleManager#_prefix
         * @type {string}
         * @private
         */
        _prefix:string= null;

        /**
         * When resizing the window object, the ScaleManager must wait a few milliseconds to fire its internal
         * orientation, and scale tests. This member is the setTimeout generated id.
         * @member cc.render.ScaleManager#_windowResizeTimer
         * @type {number}
         * @private
         */
        _windowResizeTimer:number= null;

        /**
         * Callback invoked when the system exits full screen.
         * @member cc.render.ScaleManager#_onExitFullScreen
         * @type {cc.render.FullScreenCallback}
         * @private
         */
        _onExitFullScreen: FullScreenCallback = null;

        /**
         * Callback invoked when the system enters full screen.
         * @member cc.render.ScaleManager#_onEnterFullScreen
         * @type {cc.render.FullScreenCallback}
         * @private
         */
        _onEnterFullScreen: FullScreenCallback = null;

        /**
         * Cached vendor-dependent enter fullscreen function name.
         * @member cc.render.ScaleManager#_requestFullScreen
         * @type {string}
         * @private
         */
        _requestFullScreen:string= null;

        /**
         * Cached vendor-dependent exit fullscreen function name.
         * @member cc.render.ScaleManager#_exitFullScreen
         * @type {string}
         * @private
         */
        _exitFullScreen:string= null;

        /**
         * When scale content is enabled, this is the internal matrix to achieve the expected result.
         * @member cc.render.ScaleManager#_unitsMatrix
         * @type {Float32Array}
         * @private
         */
        _unitsMatrix:Float32Array= new Float32Array(9);

        /**
         * User defined game units.
         * @member cc.render.ScaleManager#_units
         * @type {cc.math.Dimension}
         * @private
         */
        _units:cc.math.Dimension;

        /**
         * If scale content is enabled, this is the scale ratio to convert units to pixels.
         * @member cc.render.ScaleManager#_unitsFactor
         * @type {number}
         * @private
         */
        _unitsFactor:number= 1;

        /**
         * Has setContentScale been called ?
         * @member cc.render.ScaleManager#_contentScaled
         * @type {boolean}
         * @private
         */
        _contentScaled:boolean = false;

        // bugbug refactor this.
        _renderer : Renderer = null;

        _onWindowResized : WindowResizeCallback= null;

        /**
         * Create a new ScaleManager object instance.
         * @method cc.render.ScaleManager#constructor
         */
        constructor( renderer:Renderer ) {
            this._renderer= renderer;
            this._units= new cc.math.Dimension();
            cc.math.Matrix3.identity( this._unitsMatrix );
            this._unitsFactor= 1;

            this.__initialize();

            this.setScaleSurface( renderer._surface );

            //this.setScaleContent( renderer._surface.width, renderer._surface.height );
            this.__setScaleContentMatrix();
        }

        /**
         * Initialize the ScaleManager, get method cache names, etc.
         * @method cc.render.ScaleManager#__initialize
         * @private
         */
        __initialize() {

            var prefix= ['','moz','ms','webkit'];
            for( var i=0; i<prefix.length; i++ ) {
                if ( document.body[ prefix[i]+ (prefix[i]==='' ? 'requestFullscreen' : 'RequestFullscreen') ] ) {
                    this._prefix= prefix[i];

                    this._requestFullScreen= prefix[i]==='' ? 'requestFullscreen' : prefix[i]+'RequestFullscreen';
                    this._exitFullScreen= prefix[i]==='' ? 'exitFullscreen' : prefix[i]+'ExitFullscreen';

                    if ( prefix[i]==='moz') {
                        this._exitFullScreen= 'mozCancelFullScreen';

                    } else if ( prefix[i]==='ms') {
                        document.addEventListener('MSFullscreenChange', this.__fullScreenChange.bind(this), false);
                        document.addEventListener('MSFullscreenError', this.__fullScreenError.bind(this), false);

                    } else {
                        document.addEventListener(this._prefix + 'fullscreenchange', this.__fullScreenChange.bind(this), false);
                        document.addEventListener(this._prefix + 'fullscreenerror', this.__fullScreenError.bind(this), false);
                    }

                    break;
                }
            }

            this._fullScreenCapable= null!==this._prefix;

            window.addEventListener( 'resize', this.__windowResized.bind(this), false );
        }

        /**
         * Set the canvas to apply the ScaleStrategy to.
         * @method cc.render.ScaleManager#setScaleSurface
         * @param surface {HTMLCanvasElement}
         */
        setScaleSurface( surface:HTMLCanvasElement ) {
            this._surface= surface;
            this._units.width= surface.width;
            this._units.height=surface.height;

            this.checkOrientation();

            var me = this;
            setTimeout(function () {
                me.__setScaleImpl();
            }, 200);

        }

        /**
         * After setting scale content, this value is the ratio to transform in-game units to pixels.
         * @method cc.render.ScaleManager#getUnitsFactor
         * @returns {number}
         */
        getUnitsFactor() : number {
            return this._unitsFactor;
        }

        /**
         * Enable orientation change detection. If not set, landscape and portrait will be valid orientations.
         * @method cc.render.ScaleManager#forceOrientation
         * @param os {cc.render.OrientationStrategy} enum orientation value
         * @param onOk {cc.render.OrientationOkCallback=} callback invoked when the orientation changes and is valid.
         * @param onError {cc.render.OrientationErrorCallback=} callback invoked when the orientation changes and is NOT valid.
         * @returns {cc.render.ScaleManager}
         */
        forceOrientation( os:OrientationStrategy, onOk?: OrientationOkCallback, onError?: OrientationErrorCallback ) : ScaleManager {
            this._forceOrientationStrategy= os;

            // don't use setters to prevent fire reflow events.
            if (onOk) {
                this._onOrientationOk=onOk;
            }
            if (onError) {
                this._onOrientationError=onError;
            }

            this.checkOrientation();
            return this;
        }

        /**
         * Check whether the orientation is valid, and invoke callbacks accordingly.
         * @method cc.render.ScaleManager#checkOrientation
         * @private
         */
        checkOrientation() {

            var currentOrientation:OrientationStrategy= window.innerWidth>window.innerHeight ?
                OrientationStrategy.LANDSCAPE :
                OrientationStrategy.PORTRAIT;

            if ( this._forceOrientationStrategy===OrientationStrategy.BOTH ) {
                if ( this._onOrientationOk ) {
                    this._onOrientationOk(currentOrientation);
                }
            }

            if ( currentOrientation!==this._forceOrientationStrategy ) {
                this._wrongOrientation = true;
                if ( this._onOrientationError ) {
                    this._onOrientationError();
                }
            } else {
                if ( this._wrongOrientation && this._onOrientationOk ) {
                    if ( this._onOrientationOk ) {
                        this._onOrientationOk(currentOrientation);
                    }
                }
                this._wrongOrientation = false;
            }
        }

        /**
         * Get whether the current orientation is valid compared to the expected orientation.
         * @method cc.render.ScaleManager#isWrongOrientation
         * @returns {boolean}
         */
        isWrongOrientation() : boolean {
            return this._wrongOrientation;
        }

        /**
         * Get whether the system is able to switch to full screen mode.
         * @method cc.render.ScaleManager#isFullScreenCapable
         * @returns {boolean}
         */
        isFullScreenCapable() : boolean {
            return this._fullScreenCapable;
        }

        /**
         * Start full screen process. If success the optional f callback function will be called.
         * @method cc.render.ScaleManager#startFullScreen
         * @param f {cc.render.FullScreenCallback=} callback invoked when successfully switching to full screen.
         */
        startFullScreen( f?:FullScreenCallback ) {
            if ( this._fullScreenCapable ) {
                if ( typeof f!=="undefined" ) {
                    this.onEnterFullScreen(f);
                }
                this._surface[this._requestFullScreen]();
            }
        }

        /**
         * End full screen process. If success the optional f callback function will be called.
         * @method cc.render.ScaleManager#startFullScreen
         * @param f {cc.render.FullScreenCallback=} callback invoked when successfully exiting from full screen.
         */
        endFullScreen( f?:()=>any ) {
            if ( this._fullScreenCapable ) {
                if ( typeof f!=="undefined" ) {
                    this.onExitFullScreen(f);
                }
                document[this._exitFullScreen]();
            }
        }

        /**
         * Get whether the scale manager is currently in full screen mode.
         * @method cc.render.ScaleManager#isFullScreen
         * @returns {boolean}
         */
        isFullScreen() : boolean {
            return this._fullScreen;
        }

        onWindowResized( callback:WindowResizeCallback ) : ScaleManager {
            this._onWindowResized= callback;
            return this;
        }

        /**
         * Internal operation when the window resizes and scale content/scale strategies are set.
         * @method cc.render.ScaleManager#__windowResized
         * @param e {UIEvent}
         * @private
         */
        __windowResized(e:UIEvent) {
            if ( this._windowResizeTimer!==null ) {
                clearTimeout( this._windowResizeTimer );
            }

            var me= this;
            this._windowResizeTimer= setTimeout( function() {
                clearTimeout( me._windowResizeTimer );
                me._windowResizeTimer= null;

                me.checkOrientation();

                if ( me._contentScaled ) {
                    var w, h;
                    if ( this._referenceParentNode ) {
                        w= this._referenceParentNode.width;
                        h= this._referenceParentNode.height;
                    } else {
                        w= window.innerWidth;
                        h= window.innerHeight;
                    }
                    //me._renderer.setScaleContent( me._units.width,  me._units.height, w, h );
                    me._onWindowResized( w, h );
                }

                if ( !this.__wrongOrientation ) {
                    me.__setScaleImpl();
                }
            }, 1000 );
        }

        /**
         * Internal operation when the system switches to full screen.
         * @method cc.render.ScaleManager#__fullScreenChange
         * @param e {UIEvent}
         * @private
         */
        __fullScreenChange(e) {

            if (this._fullScreen) {

                if ( this._onExitFullScreen ) {
                    this._onExitFullScreen();
                }

                this._fullScreen= false;

            } else {


                if ( this._onEnterFullScreen ) {
                    this._onEnterFullScreen();
                }

                this._fullScreen= true;
            }

            var me= this;
            setTimeout( function() {
                me.__setScaleImpl();
            }, 500 );
        }

        /**
         * Register callback to be notified when the system successfully enters full screen mode.
         * @method cc.render.ScaleManager#onEnterFullScreen
         * @param f {cc.render.FullScreenCallback}
         * @returns {cc.render.ScaleManager}
         */
        onEnterFullScreen( f:FullScreenCallback ) : ScaleManager {
            this._onEnterFullScreen= f;
            return this;
        }

        /**
         * Register callback to be notified when the system successfully exits full screen mode.
         * @method cc.render.ScaleManager#onExitFullScreen
         * @param f {cc.render.FullScreenCallback}
         * @returns {cc.render.ScaleManager}
         */
        onExitFullScreen( f:FullScreenCallback ) : ScaleManager {
            this._onExitFullScreen= f;
            return this;
        }

        /**
         * Register callback to be notified when the system successfully changes orientation.
         * @method cc.render.ScaleManager#onOrientationOk
         * @param f {cc.render.OrientationOkCallback}
         * @returns {cc.render.ScaleManager}
         */
        onOrientationOk( f:OrientationOkCallback ) : ScaleManager {
            this._onOrientationOk= f;
            this.checkOrientation();
            return this;
        }

        /**
         * Register callback to be notified when the system unsuccessfully changes orientation.
         * @method cc.render.ScaleManager#onOrientationError
         * @param f {cc.render.OrientationCallback}
         * @returns {cc.render.ScaleManager}
         */
        onOrientationError( f:OrientationErrorCallback ) : ScaleManager {
            this._onOrientationError= f;
            this.checkOrientation();
            return this;
        }

        /**
         * Internal method called at system level when there's no full screen availability.
         * @method cc.render.ScaleManager#__fullScreenError
         * @param e {UIEvent}
         * @private
         */
        __fullScreenError(e) {
            cc.Debug.warn( cc.locale.WARN_FULLSCREEN_ERROR );
        }

        /**
         * When ScaleStrategy is set, this DOM node will be the reference for position calculations.
         * @method cc.render.ScaleManager#setReferenceParentNode
         * @param node {HTMLElement}
         */
        setReferenceParentNode( node:HTMLElement ) {
            this._referenceParentNode= node;
        }

        /**
         * Enable canvas scale capabilities. This will scale the canvas object, not its internal drawing operations.
         * @method cc.render.ScaleManager#setScale
         * @param scale {cc.render.ScaleManagerStrategy} the scale type.
         * @param positionOp {cc.render.ScalePosition=} the positioning when the scale is set.
         * @returns {cc.render.ScaleManager}
         * @see cc.render.ScaleManager#setScaleContent
         */
        setScale( scale:ScaleManagerStrategy, positionOp?:ScalePosition ) : ScaleManager {

            if (this._scaleStrategy === scale) {
                return;
            }

            this._scaleStrategy = scale;
            this._scalePosition = positionOp || ScalePosition.NONE;

            if ( this._surface ) {
                var me = this;
                setTimeout(function () {
                    me.__setScaleImpl();
                }, 200);
            }

            return this;
        }

        /**
         * Enable content scale. Content scale is necessary for retina display honor mechanisms. This method instruments
         * CocosJS core that there's no direct mapping between a pixel and a game unit.
         * @method cc.render.ScaleManager#setScaleContent
         * @param unitsWidth {number}
         * @param unitsHeight {number}
         */
        setScaleContent( unitsWidth:number, unitsHeight:number) : Float32Array {
            this._units.width= unitsWidth;
            this._units.height= unitsHeight;

            this.__setScaleContentMatrix();

            this._contentScaled= true;

            return this._unitsMatrix;
        }

        /**
         * Internal method to calculate the pixel-point mapping operations.
         * @method cc.render.ScaleManager#__setScaleContentMatrix
         * @private
         */
        __setScaleContentMatrix() {

            if (this._surface && this._units.width>0 && this._units.height>0 ) {
                var scale:number = Math.min(
                    this._surface.width / this._units.width,
                    this._surface.height / this._units.height);

                this._unitsFactor= scale;

                cc.math.Matrix3.setScale(this._unitsMatrix, scale, scale);

                if (cc.render.RENDER_ORIGIN === cc.render.ORIGIN_BOTTOM) {
                    // invert viewport
                    var um:Float32Array = this.getScaleContentMatrix();
                    um[1] *= -1;
                    um[4] *= -1;
                    um[5] += this._renderer._dimension.height;

                    //console.log("renderer adjust scale content: \n" + um[0] + "," + um[1] + "," + um[2] + "\n" + um[3] + "," + um[4] + "," + um[5] + "\n" + um[6] + "," + um[7] + "," + um[8]);
                }
            }
        }

        getScaleContentMatrix() : Float32Array {
            return this._unitsMatrix;
        }

        /**
         * Internal method to scale the canvas object using css styles.
         * @method cc.render.ScaleManager#__setScaleImpl
         * @private
         */
        __setScaleImpl() {

            this._surface.style.width= '';
            this._surface.style.height= '';

            var scale = this._scaleStrategy;

            if (scale === ScaleManagerStrategy.NONE) {

                this.__setScaleNone(this._surface);
            } else if (scale === ScaleManagerStrategy.SCALE_FIT) {

                this.__setScaleFit(this._surface);
            } else if (scale === ScaleManagerStrategy.SCALE_ASPECT) {

                this.__setScaleAspect(this._surface);
            }

        }

        /**
         * When setting the scale strategy, this method calculates the necessary styles to position the canvas relative to
         * its parent client area. The calculations will be based on the ScalePosition parameter of setScale method call.
         * @method cc.render.ScaleManager#__setScalePosition
         * @param scaleW {number} canvas scale factor. when setScale is called, the canvas can be scaled with different
         *          values. this is the width scale parameter.
         * @private
         */
        __setScalePosition( scaleW:number ) {

            if (this.isFullScreen()) {
                this._surface.style.margin="0";
                return;
            }

            var pw= 0;

            if (this._referenceParentNode === null) {
                pw = window.innerWidth;
            } else {
                pw = this._referenceParentNode.getBoundingClientRect().width;
            }

            switch( this._scalePosition ) {
                case ScalePosition.LEFT:
                    this._surface.style.margin="0";
                    break;

                case ScalePosition.RIGHT:
                    this._surface.style.marginLeft= ((pw-scaleW*this._surface.width)|0)+'px';
                    break;
                case ScalePosition.CENTER:
                    this._surface.style.marginLeft= (((pw-scaleW*this._surface.width)/2)|0)+'px';
                    break;
            }

            this._surface.style.padding="0";
        }

        /**
         * Set the canvas with no scale.
         * @method cc.render.ScaleManager#__setScaleNone
         * @param surface {HTMLCanvasElement}
         * @private
         */
        __setScaleNone( surface:HTMLCanvasElement ) {

            surface.style.width= surface.width+'px';
            surface.style.height= surface.height+'px';

            this.__setScalePosition(1);
        }

        /**
         * Stretch the canvas with css scale attributes to fit exactly in its parent.
         * This can lead to uneven scaling, because of canvas object stretch operations.
         * @method cc.render.ScaleManager#__setScaleFit
         * @param surface {HTMLCanvasElement}
         * @private
         */
        __setScaleFit( surface:HTMLCanvasElement ) {
            // remove element so that document reflows and can get actual parent size.
            surface.style.display = 'none';

            // scale in parent, but keeping aspect ratio. letterbox  warning!!
            var pw, ph;
            var parentBounds:ClientRect;

            if (this._referenceParentNode === null) {
                pw = window.innerWidth;
                ph = window.innerHeight;

            } else {
                parentBounds = this._referenceParentNode.getBoundingClientRect();

                pw = parentBounds.width;
                ph = parentBounds.height;
            }
            var sw = surface.width;
            var sh = surface.height;

            var factorx = pw / sw;
            var factory = ph / sh;

            surface.style.width = (factorx * sw) + 'px';
            surface.style.height = (factory * sh) + 'px';

            surface.style.display = 'block';

            this.__setScalePosition(factorx);
        }

        /**
         * Scale the canvas keeping aspect ratio to fit in its parent node client area.
         * @param surface {HTMLCanvasElement}
         * @method cc.render.ScaleManager#__setScaleAspect
         * @private
         */
        __setScaleAspect( surface:HTMLCanvasElement ) {
            // remove element so that document reflows and can get actual parent size.
            surface.style.display = 'none';

            // scale in parent, but keeping aspect ratio. letterbox  warning!!
            var pw, ph;
            var parentBounds:ClientRect;

            if (this._referenceParentNode === null) {
                pw = window.innerWidth;
                ph = window.innerHeight;

            } else {
                parentBounds = this._referenceParentNode.getBoundingClientRect();

                pw = parentBounds.width;
                ph = parentBounds.height;
            }
            var sw = surface.width;
            var sh = surface.height;
            var factor = Math.min(pw / sw, ph / sh);

            surface.style.width = (factor * sw) + 'px';
            surface.style.height = (factor * sh) + 'px';

            surface.style.display = 'block';

            this.__setScalePosition(factor);
        }

        /**
         * Get the currently applied canvas scale strategy.
         * @method cc.render.ScaleManager#getScaleStrategy
         * @returns {cc.render.ScaleManagerStrategy}
         */
        getScaleStrategy() : ScaleManagerStrategy {
            return this._scaleStrategy;
        }
    }
}