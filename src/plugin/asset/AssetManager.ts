/**
 * License: see license.txt file
 */

/// <reference path="../../../lib/webaudio/webaudio.d.ts" />

/// <reference path="../../math/Rectangle.ts"/>
/// <reference path="../../node/sprite/SpriteFrame.ts"/>
/// <reference path="../../node/sprite/Animation.ts"/>
/// <reference path="../../render/Texture2D.ts"/>
/// <reference path="../../render/Renderer.ts"/>
/// <reference path="../../plugin/font/SpriteFont.ts"/>
/// <reference path="../loader/Loader.ts"/>
/// <reference path="../loader/Resource.ts"/>

module cc.plugin.asset {

    import Loader= cc.plugin.loader.Loader;
    import Resource= cc.plugin.loader.Resource;
    import Texture2D= cc.render.Texture2D;
    import SpriteFrame= cc.node.sprite.SpriteFrame;
    import Animation= cc.node.sprite.Animation;
    import SpriteFont= cc.plugin.font.SpriteFont;
    import SystemFontInitializer= cc.plugin.font.SystemFontInitializer;

    /**
     * Stores all image resources.
     * @type {Map<string,cc.render.Texture2D>}
     * @private
     */
    var _textures: { [id:string]:Texture2D; }= {};

    /**
     * Stores all SpriteFrame resources. Loaded Atlases will also add SpriteFrames based on their internal definitions.
     * @type {Map<string,cc.node.sprite.SpriteFrame>}
     * @private
     */
    var _frames: { [id:string]:SpriteFrame; }= {};

    /**
     * Stores Animation objects
     * @type {Map<string,cc.node.sprite.Animation>}
     * @private
     */
    var _animations:{ [id:string]:Animation; }= {};

    /**
     * Stores SpriteFont objects
     * @type {Map<string,cc.plugin.font.SpriteFont>}
     * @private
     */
    var _spriteFonts:{ [id:string]:SpriteFont; }= {};

    var _audioBuffers: {[id:string]:AudioBuffer; }= {};

    export interface ResourcesMap {
        [id:string] : any;
    }

    /**
     * @class cc.plugin.asset.AssetManager
     * @classdesc
     *
     * A AssetManager manager keeps references of in-game resources. The difference with a plain resource is that a
     * resource manages load-and-set operations, but an asset han have some postprocessing, like creating an atlas
     * from an image, etc.
     * This object is the only globally available object and thus, can be shared across different Director objects.
     * The idea is to have a centralized resource mechanism where sounds, sprites, atlases, fonts, etc. can be directly
     * accessed. The resource manager will just store, contents, not handle or load it in anyway.
     * <p>
     *     The AssetManager can be the listener or any Loader objects, thus receiving the independent resources,
     *     and then grouping them in different stores.
     * <p>
     *     The method load, creates a Loader object and registers itself as observer of the loading events.
     */
    export class AssetManager {

        /**
         * For backwards compatibility
         * Map of string,Resource
         */
        static _resources: {[id:string]:any} = {};

        static mergeResources( res:{[id:string]:any} ) {
            for( var i in res ) {
                cc.plugin.asset.AssetManager._resources[i]= res[i];
            }
        }

        /**
         * Load a resource set.
         * Internally, it builds a <code>cc.plugin.loader.Loader</code> object and starts the loading process.
         * @method cc.plugin.loader.AssetManager.load
         * @param data {cc.plugin.loader.LoaderInitializer} resources descriptor.
         * @param onEnd {cc.plugin.loader.LoaderFinishedCallback} callback invoked when all resources end loading.
         *          either the resources loaded ok or wrong, this method will be called.
         * @param onProgress {cc.plugin.loader.LoaderProgressCallback=} callback invoked for each loaded resource
         *          regardless of its loading result.
         * @param onError {cc.plugin.loader.LoaderErrorCallback=} callback invoked for each resource loaded with error.
         */
        static load( data:cc.plugin.loader.LoaderInitializer,
                     onEnd?:cc.plugin.loader.LoaderFinishedCallback,
                     onProgress?:cc.plugin.loader.LoaderProgressCallback,
                     onError?:cc.plugin.loader.LoaderErrorCallback ) {

            new Loader(data).startLoading(

                function end(resources:ResourcesMap) {
                    if (onEnd) {
                        onEnd(resources);
                    }

                },
                function progress( resource:Resource, index:number, total:number, errored:boolean ) {
                    //AssetManager.addResource( resource );
                    if (onProgress) {
                        onProgress( resource, index, total, errored );
                    }
                },
                function error( resource:Resource ) {
                    if (onError) {
                        onError(resource);
                    }
                }
            );
        }

        /**
         * Setup textures for a given renderer. Concretelly, if the renderer is webgl, textures are turned into webgl
         * textures.
         * @method cc.plugin.asset.AssetManager.prepareTextures
         * @param renderer {cc.render.Renderer}
         */
        static prepareTextures( renderer:cc.render.Renderer ) {
            for( var texture in _textures ) {
                if ( _textures.hasOwnProperty(texture) ) {
                    renderer.prepareTexture(_textures[texture]);
                }
            }
        }

        /**
         * Add an Image to the Manager resources.
         * The image will be stored as a cc.render.Texture2D object.
         * A SpriteFrame with the given id and representing the whole image will be added too.
         * @method cc.plugin.asset.AssetManager.addImage
         * @param img {HTMLImageElement|HTMLCanvasElement}
         * @param id {string} The texture and the SpriteFrame representing the texture will have this id.
         */
        static addImage( img:any, id:string ) : cc.render.Texture2D {
            var texture:Texture2D= new cc.render.Texture2D(img, id);
           _textures[ id ]= texture;
           _frames[ id ]= new cc.node.sprite.SpriteFrame( texture );

            return texture;
        }

        /**
         * Add a cc.plugin.loader.Resource instance.
         * Currently only works for images.
         * @method cc.plugin.asset.AssetManager.addResource
         * @param resource {cc.plugin.loader.Resource}
         */
        static addResource( resource:Resource ) {
            if ( resource.isValid() ) {

                switch( resource.type ) {
                    case "image":   // resource loaded as image.
                        AssetManager.addImage( resource.value, resource.id );
                        break;
                    //default:        // resource loaded as WTF ??
                    //    cc.Debug.warn( cc.locale.WARN_RESOURCE_OF_UNKNOWN_TYPE, resource.id );
                }

            }
        }

        /**
         * Add a SpriteFrame to the cache.
         * @method cc.plugin.asset.AssetManager.addSpriteFrame
         * @param frame {cc.node.sprite.SpriteFrame}
         */
        static addSpriteFrame( frame:SpriteFrame ) {
            _frames[ frame._name ]= frame;
        }

        /**
         * Get an SpriteFrame by id.
         * @method cc.plugin.asset.AssetManager.getSpriteFrame
         * @param id {string}
         * @returns {cc.node.sprite.SpriteFrame}
         */
        static getSpriteFrame( id:string ) : SpriteFrame {
            var ret= _frames[id];
            return ret ? ret : null;
        }

        /**
         * Add an array of SpriteFrames to the cache.
         * @method cc.plugin.asset.AssetManager.addSpriteFrames
         * @param frames {Array<cc.node.sprite.SpriteFrame>}
         */
        static addSpriteFrames( frames:SpriteFrame[] ) {
            for( var i=0; i<frames.length; i++ ) {
                this.addSpriteFrame( frames[i] );
            }
        }

        /**
         * Get an array of sprite frames identified by an array of SpriteFrame ids.
         * @method cc.plugin.asset.AssetManager.getSpriteFrames
         * @param ids {Array<string>}
         * @returns {Array<cc.node.sprite.SpriteFrame>}
         */
        static getSpriteFrames( ids:string[] ) : SpriteFrame[] {
            var ret:SpriteFrame[]= [];

            for( var i=0; i<ids.length; i++ ) {
                var sf:SpriteFrame= AssetManager.getSpriteFrame( ids[i] );
                if ( sf ) {
                    ret.push( sf );
                } else {
                    cc.Debug.warn( cc.locale.ASSETMANAGER_WARN_SPRITEFRAME_NOT_FOUND, "getSpriteFrames", ids[i] );
                }
            }

            return ret;
        }

        /**
         * Add a Texture2D to the cache.
         * @method cc.plugin.asset.AssetManager.addTexture
         * @param texture {cc.render.Texture2D}
         */
        static addTexture( texture:Texture2D ) {
            _textures[ texture._name ]= texture;
        }

        /**
         * Get a Texture2D object by string id.
         * @param name {string}
         * @returns {cc.render.Texture2D}
         */
        static getTexture( name:string ) : Texture2D {
            var ret= _textures[name];
            return ret ? ret : null;
        }

        static addAnimation( animation:cc.node.sprite.Animation, name:string ) {
            _animations[ name ]= animation;
        }

        /**
         * Create and store an animation build of the frames identified by the frames array.
         * If there's a prefix set, the frames is assumed to be an array of number, to build the SpriteFrame names:
         *  prefix+frames[0], prefix+frames[1], ..., etc.
         * If no prefix, the frames array is assumed to be the sting identifiers of the frames composing the animation.
         * @param animationName {string}
         * @param frames {Array<number|string>}
         * @param prefix {string=}
         */
        static addAnimationForFrames( animationId:string, frames:any[], prefix?:string ) : Animation {

            var animation= new cc.node.sprite.Animation();
            for( var i=0; i<frames.length; i++ ) {
                var frameName= prefix ? prefix+frames[i] : frames[i];
                var spriteFrame= _frames[ frameName ];
                if ( spriteFrame ) {
                    animation.addFrame( spriteFrame );
                }
            }

            _animations[animationId]= animation;

            return animation;
        }

        /**
         * Get an animation by id.
         * @param animationId {string}
         * @returns {cc.node.sprite.Animation}
         */
        static getAnimationById( animationId:string ) : cc.node.sprite.Animation {
            var anim:Animation = _animations[animationId];
            if ( anim ) {
                return anim.clone();
            }

            return null;
        }

        /**
         * Create SpriteFrames for all the elements in the JSON object.
         * The new SpriteFrame objects will be mapped inside the SpriteFrame identified by the spriteFrameId parameter.
         * @method cc.plugin.asset.AssetManager.addSpriteFramesFromFrameWithJSON
         * @param spriteFrameId {string} a SpriteFrame in the cache.
         * @param json {any}
         * @param prefix {string=} an optional prefix to prepend to all sprite frame names.
         */
        static addSpriteFramesFromFrameWithJSON( spriteFrameId:string, json:any, prefix?:string ) {
            var spriteFrame:SpriteFrame = AssetManager.getSpriteFrame(spriteFrameId);
            if ( spriteFrame ) {
                var frames:SpriteFrame[]= spriteFrame.createSpriteFramesFromJSON(json);
                if ( prefix ) {
                    for( var i=0; i<frames.length; i++ ) {
                        frames[i]._name = prefix + frames[i]._name;
                    }
                }
                AssetManager.addSpriteFrames( frames );
            }
        }

        /**
         * Create a grid of sub SpriteFrames from a given SpriteFrame.
         * @method cc.plugin.asset.AssetManager.addGridSpriteFramesFromFrame
         * @param spriteFrameId {string} a SpriteFrame id from the cache
         * @param rows {number} number or rows of the grid
         * @param cols {number} number or columns of the grid
         */
        static addGridSpriteFramesFromFrame( spriteFrameId:string, rows:number, cols:number ) {

            var spriteFrame:SpriteFrame = AssetManager.getSpriteFrame(spriteFrameId);
            if ( spriteFrame ) {
                var frames:SpriteFrame[]= spriteFrame.createSubSpriteFrames( rows, cols );
                AssetManager.addSpriteFrames( frames );
            }
        }

        /**
         * Create a SpriteFont from the definition of a Glypth Designer file.
         * The font will be stored in the fonts cache.
         * @methoc cc.plugin.asset.AssetManager.createSpriteFontFromGlypthDesigner
         * @param fontName {string} name for storing the font.
         * @param spriteFrameId {string} a SpriteFrame from the cache. The glypths will be mapped in this SpriteFrame.
         * @param glypthDesignerInfo {string} the contents of a Glypth Designer file.
         */
        static createSpriteFontFromGlypthDesigner( fontName:string, spriteFrameId:string, glypthDesignerInfo:string ) {
            var font = new cc.plugin.font.SpriteFont(fontName).
                setAsGlypthDesigner(spriteFrameId, glypthDesignerInfo);
            if (font.isValid()) {
                _spriteFonts[fontName] = font;
            }
        }

        /**
         * Get a SpriteFont from the cache.
         * @methoc cc.plugin.asset.AssetManager.getSpriteFont
         * @param fontName {string} the id of a SpriteFont in the cache.
         * @returns {cc.plugin.font.SpriteFont}
         */
        static getSpriteFont( fontName:string ) : cc.plugin.font.SpriteFont {
            var ret= _spriteFonts[ fontName ];
            return ret ? ret : null;
        }

        /**
         * Create a SpriteFont for a System Font.
         * @param fontName {string} the name to store the font in the cache.
         * @param systemFont {cc.plugin.font.SystemFontInitializer} font definition object.
         */
        static createSystemSpriteFont( fontName:string, systemFont:SystemFontInitializer ) {
            var font= new cc.plugin.font.SpriteFont( fontName ).
                setAsSystemFont( systemFont );
            if (font.isValid()) {
                _spriteFonts[fontName] = font;
            }
        }

        static addSpriteFramesFromFrameWithPLIST( spriteFrameId:string, plist:any ) {
            var spriteFrame:SpriteFrame = AssetManager.getSpriteFrame(spriteFrameId);
            if ( spriteFrame ) {
                var frames:SpriteFrame[]= spriteFrame.createSpriteFramesFromPLIST( plist );
                AssetManager.addSpriteFrames( frames );
            }
        }

        static getAudioBuffer( id:string ) {
            var ret= _audioBuffers[id];
            return ret ? ret : null;
        }

        static addAudioBuffer( buffer:AudioBuffer, id:string ) {
            _audioBuffers[id]= buffer;
        }
    }
}