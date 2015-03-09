/**
 * Created by ibon on 1/13/15.
 */

/**
cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(480,720,cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    cc.director.setProjection(cc.Director.PROJECTION_2D);

    if (cc.sys.isNative) {
        var searchPaths = jsb.fileUtils.getSearchPaths();
        searchPaths.push('script');
        if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX) {
            searchPaths.push("res");
            searchPaths.push("src");
        }
        jsb.fileUtils.setSearchPaths(searchPaths);
    }
    //load resources
    cc.LoaderScene.preload(g_mainmenu, function () {
        cc.director.runScene(SysMenu.scene());
    }, this);
};

cc.game.run();
 */



window.addEventListener("DOMContentLoaded", function() {



    // get renderer type from url. valid values are: canvas, webgl, auto.
    // for example call like: index.html?renderer=canvas
    var renderer= "auto";
    var search= window.location.search;
    if ( search ) {
        search= search.substr(1);
        var params= search.split("&");
        for( var i=0; i<params.length; i++ ) {
            var pair= params[i].split("=");
            if ( pair[0]==="renderer" ) {
                if ( pair[1]==="canvas" || pair==="webgl" || pair==="auto" ) {
                    renderer= pair[1];
                }
            }
        }
    }

    cc.action.setTimeReferenceInSeconds();
    cc.node.DEFAULT_ANCHOR_POSITION=        new cc.math.Vector(0.5,0.5);
    cc.node.DEFAULT_ANCHOR_TRANSFORMATION=  new cc.math.Vector(0.5,0.5);

    new cc.game.Game().
        // adjustViewport(true).    --> developer decision to add it to the html document. why force ?
        setDesignResolutionSize({
            width: 480,
            height: 720,
            scaleStrategy: "scale_aspect",
            canvasPosition: "center",
            canvasElement: "gameCanvas",
            renderer: renderer
        }).
        //resizeWithBrowserSize(true).  --> implicit yes.
        load(
            g_mainmenu,
            /**
             * Why receive the loaded resources and the game reference.
             * Current CocosV3, makes some [wrong] assumptions:
             *   * it stores webgl texture info as well as the image content per image file.
             *   * it stores every loaded content in a singleton object. normally, loaded resources are read, transformed,
             *     (and some discarded) in the same process. For example, a plist with SpriteFrame definition, should loaded,
             *     transformed and discarded. There's no need in reloading or keeping its content in memory.
             *     This is the current case.
             *   * it assumes one loader instance and loader Scene: cc.LoaderScene
             *   * it assumes one single singleton director object instance.
             *   * it creates a polling mechanism to the DOM until the document element is created and attached. (this is
             *     very wrong). That's why the window.addEventListener("DOMContentLoaded",... is added.
             *   * the plist defining SpriteFrames for an Image MUST be in the same directory.
             *   * treates Image objects as if they were loaded synchronously. they are ALL lazy loaded at reference time.
             *
             * New V4 version, makes some (different) assumptions:
             *
             *   * multiple director instances.
             *   * multiple game instances.
             *   * no constraints in loading/loader scene. In this sense, total freedom of multiple loaders running at the same
             *     time, and thus, loading status callback functions.
             *
             * In the new V4, a game [director, renderer, scalemanager, inputmanager, etc.] is created. In order to avoid
             * boilerplate code for loading resources, a convenience method load is supplied in the game itself.
             * This method receives the list of loaded cc.plugin.resource.Resource objects. This new version does not store
             * the resources, since it is expected to turn the Resources into in-game assets. This is something only the
             * developer knows how to do (we can't make assumption about whether a plist is a list of SpriteFrames or
             * Animations).
             * This is why, the onResourcesLoaded callback receives the game instance (for the shake of chaining, impossible
             * otherwise) and the Resources array [store them or whatever].
             *
             * It is important to allow the developer manipulate resources. For example, what if He want's to texture-pack
             * some resources, build some sprite fonts on-the-fly or use a webgl with mipmap texture.
             *
             * What if I need to load content in stages:
             *   * first resources to show a proper loading progress
             *   * in-game assets after that, etc.
             *
             * Use the AssetManager.load method to load the initial assets. Build a Scene, then call AssetManager.load
             * again to get the new content. Use loaded resouces at will.
             *
             */
            function onEnd(game) {


                // CHANGE ADD
                // delegate on label creation.
                cc.plugin.asset.AssetManager.addImage( cc.plugin.asset.AssetManager._resources[ res.arial_14_png ], res.arial_14_png );
                cc.plugin.asset.AssetManager.createSpriteFontFromGlypthDesigner(
                    res.arial_14_fnt,
                    res.arial_14_png,
                    cc.plugin.asset.AssetManager._resources[ res.arial_14_fnt ] );
                // END ADD

                // prefer this form:
                // game.runScene(SysMenu.scene());
                // to this one:
                cc.director.runScene( SysMenu.scene() );
            });
}, false);