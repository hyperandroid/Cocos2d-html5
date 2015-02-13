/**
 * License: see license.txt file.
 */

/// <reference path="../node/Node.ts"/>
/// <reference path="../node/Scene.ts"/>
/// <reference path="../node/Director.ts"/>

/// <reference path="../render/ScaleManager.ts"/>
/// <reference path="../plugin/asset/AssetManager.ts"/>
/// <reference path="../plugin/loader/Loader.ts"/>
/// <reference path="../plugin/loader/Resource.ts"/>

module cc.game {

    import Resource= cc.plugin.loader.Resource;
    import ResourcesMap= cc.plugin.asset.ResourcesMap;

    /**
     * @class cc.game.ResolutionInitializer
     * @interface
     * @classdesc
     *
     * ScaleManager resolution, orientation and units initialization info.
     */
    export interface ResolutionInitializer {


        width: number;
        height: number;

        unitsWidth?: number;
        unitsHeight?: number;

        canvasElement?: string;
        scaleStrategy?: string;
        canvasPosition?: string;
        orientation?: string;

        renderer?:string;
    }

    /**
     * @class cc.game.Game
     * @classdesc
     *
     * Helper object to glue all CocosJS components together.
     * The game object builds a default Director, is able to define orientation, scale and content scale, load assets
     * and preload them into the asset manager, etc. etc.
     *
     */
    export class Game {

        _director:cc.node.Director;
        _renderer:cc.render.Renderer;

        constructor() {

            this._director= new cc.node.Director();
        }

        setDesignResolutionSize( ri: ResolutionInitializer ) : cc.game.Game {

            if ( typeof ri==="undefined" ) {
                ri = {
                    width: 800,
                    height: 600
                };
            }
            if ( typeof ri.canvasPosition==="undefined") {
                ri.canvasPosition="center";
            }
            if ( typeof ri.scaleStrategy==="undefined") {
                ri.scaleStrategy="scale_aspect";
            }
            if ( typeof ri.orientation==="undefined") {
                ri.orientation="both";
            }

            var renderer;
            if ( typeof ri.renderer==="string" ) {
                if ( ri.renderer==="canvas" ) {
                    renderer= new cc.render.CanvasRenderer( ri.width, ri.height, <HTMLCanvasElement>document.getElementById(ri.canvasElement) );
                } else if ( ri.renderer==="webgl" ) {
                    renderer= new cc.render.WebGLRenderer( ri.width, ri.height, <HTMLCanvasElement>document.getElementById(ri.canvasElement) );
                } else {
                    // autodetect
                    renderer= cc.render.autodetectRenderer( ri.width, ri.height, ri.canvasElement );
                }
            }

            this._director.setRenderer( renderer );
            this._renderer= renderer;

            ri.scaleStrategy= ri.scaleStrategy.toUpperCase();
            ri.canvasPosition= ri.canvasPosition.toUpperCase();
            ri.orientation= ri.orientation.toUpperCase();

            var st:cc.render.ScaleManagerStrategy= cc.render.ScaleManagerStrategy[ ri.scaleStrategy ] ||
                cc.render.ScaleManagerStrategy.SCALE_FIT;
            var sp:cc.render.ScalePosition= cc.render.ScalePosition[ ri.canvasPosition ] ||
                cc.render.ScalePosition.CENTER;
            var co:cc.render.OrientationStrategy= cc.render.OrientationStrategy[ ri.orientation ] ||
                cc.render.OrientationStrategy.BOTH;

            this._renderer.setScaleStrategy( st, sp );
            this._renderer.setOrientationStrategy( co );

            return this;
        }

        load(   assets:string[],
                _onLoad: (game:cc.game.Game)=>any,
                _onProgress: (resource:Resource, index:number, size:number, errored:boolean)=>any,
                _onError: (resource:Resource)=>any ) {

            var me=this;

            cc.plugin.asset.AssetManager.load(
                {
                    resources:assets
                },
                function onLoad( resources: ResourcesMap ) {

                    if ( cc.__BACKWARDS_COMPATIBILITY__ ) {
                        cc.plugin.asset.AssetManager.mergeResources( resources )
                    }

                    _onLoad( me );
                },
                function onProgress(resource:Resource, index:number, size:number, errored:boolean) {
                    if (typeof _onProgress!=="undefined" ) {
                        _onProgress(resource,index,size,errored);
                    }
                },
                function onError(resource:Resource) {
                    if( typeof _onError!=="undefined" ) {
                        _onError( resource );
                    }
                }
            );

        }

        runScene( scene:cc.node.Scene ) {
            this._director.runScene( scene );
        }


        /**
         * Return the internal scale management object.
         * This object handles all things relative to Renderer surface scale and on-screen positioning, as well as
         * orientation changes and content scale ratio calculations.
         * @method cc.node.Director#getScaleManager
         * @see cc.game.ScaleManager
         * @returns {cc.game.ScaleManager}
         */
        getScaleManager() : cc.render.ScaleManager {
            return this._renderer.getScaleManager();
        }

        /**
         * Set renderer surface scale strategy.
         * @method cc.node.Director#setScaleStrategy
         * @param ss {cc.render.ScaleManagerStrategy} how renderer surface should me up/down scaled when the window
         *          changes size.
         * @param sp {cc.render.ScalePosition} how to position the renderer surface on the window object.
         */
        setScaleStrategy( ss:cc.render.ScaleManagerStrategy, sp:cc.render.ScalePosition ) {
            this._renderer.setScaleStrategy(ss,sp);
        }

        /**
         * Set internal ratio to adjust screen pixels to game units.
         * A game, usually makes the assumption that one game unit maps directly to one screen pixel.
         * When we want to build better looking games which honor devicePixelRation, retina, etc. we need to undo
         * this direct assumption in favor of other better mechanisms.
         * This method undoes this mapping.
         * For example, my game is 8 by 5 meters and want to see it in a 960x640 pixels screen.
         * The difference between this method and <code>setScaleStrategy</code> is that this one acts in game content,
         * and setScaleStrategy on the renderer generated image.
         * @method cc.node.Director#setScaleContent
         * @see cc.game.ScaleManager
         * @param w {number} game units width
         * @param h {number} game units height
         * @param cw {number=} canvas width
         * @param ch {number=} canvas height
         * @return {number} the scale factor resulting from the map units-pixels.
         */
        setScaleContent( w:number, h:number, cw?:number, ch?:number ) : number {
            this._renderer.setScaleContent(w,h,cw,ch);
            return this._renderer.getUnitsFactor();
        }

        /**
         * When <code>setScaleContent</code> has been called this method gives the scale factor for the units-pixel
         * mapping ratio.
         * @method cc.node.Director#getUnitsFactor
         * @returns {number}
         */
        getUnitsFactor() : number {
            return this._renderer.getUnitsFactor();
        }

        /**
         * Set renderer surface orientation strategy. If set to landscape or portrait, when the window changes size
         * will notify about valid or wrong orientation.
         * Default orientation is set to BOTH.
         * @method cc.node.Director#setOrientationStrategy
         * @param os {cc.render.OrientationStrategy} desired orientation.
         * @param onOk {cc.render.OrientationCallback}
         * @param onError {cc.render.OrientationCallback}
         */
        setOrientationStrategy( os:cc.render.OrientationStrategy, onOk?:cc.render.OrientationOkCallback, onError?:cc.render.OrientationErrorCallback ) {
            this._renderer.forceOrientation(os,onOk,onError);
        }

        /**
         * Get whether the device has fullScreen capabilities
         * @method cc.node.Director#isFullScreenCapable
         * @returns {boolean}
         */
        isFullScreenCapable() : boolean {
            return this._renderer.isFullScreenCapable();
        }

        /**
         * Is currently the system in full screen ?
         * @method cc.node.Director#isFullScreen
         * @returns {boolean}
         */
        isFullScreen() : boolean {
            return this._renderer.isFullScreen();
        }

        /**
         * Start full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#startFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        startFullScreen( f?:()=>any ) {
            this._renderer.startFullScreen(f);
        }

        /**
         * End full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#endFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        endFullScreen( f?:()=>any ) {
            this._renderer.endFullScreen(f);
        }
    }
}