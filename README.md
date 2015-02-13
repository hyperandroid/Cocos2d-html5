CocosJS V4 pre-alpha
--------------------

This version of CocosJS is a total rewrite of the Cocos2D HTML5 V3.
Currently is a pre alpha version and it is based in the following premises:

* Enforce modularity.
* Offer an strong code contract were types are checked at compile time.
* High backwards compatibility with API v3.
* Offer a plain Class hierarchy, enforcing encapsulation avoiding extension where possible.
* Eliminate global state (singletons for everything) to local state, which allows for reusability, for example, have
  different Director objects running at the same time.
* Remove the asynchronous nature of Cocos2D initialization in favor of a more structured resource loading mechanism.
* Leave the developer more freedom by not making assumptions and decissions on behalf of the developer.

This release has the following features:

* Backward compatible Core nodes: Node, Scene, Director.
  These nodes have improved functionality compared to the V3 ones.
  For example, Node can redefine is draw method to augment its capabilities and transform a Node into a LayerColor,
  or LayerGradient. Layer will be deprecated. These Nodes are backwards compatible with its V3 counterparts.
  Still cc.Node, cc.Scene, etc. can be used.
* Actions system.
  Actions have been redesigned from the ground up.
  They offer a comprehensive lifecycle notification mechanism and have a new chaining syntax.
  This new Actions subsytem is backwards compatible with V3 and V2 Actions API. There’s an V3/V2 Actions test which
  showcases and guarantees the compatibility.
* Easing system.
  Compatible with V2/V3 easing system. There’s an V2/V3 easing compatibility test.
  In the new implementation, the Easing Action has been promoted to an Action attribute instead of an Action. The V3
  concept of Actions applying indistinctly to Nodes or Actions was not clear.
* Scheduler.
  The scheduler has been integrated into the Actions system.
  It is fully compatible with V3 scheduler system. There's an V3/V2 Scheduler test which showcases and guarantees the
  compatibility.
* Atlas.
  We have a more advanced Atlas system than V3 has.
  It supports Atlas deep-nesting operations (atlas containing other atlases).
  It is the foundation for Sprite animations as well as SpriteFonts.
  Atlas objects can be loaded from a TexturePacker tool JSON or Cocos2D output.
  It is also able to read a Glypth Designer tool output to build a sprite font.
  Atlas elements will automatically be available as SpriteFrame objects.
* Rebuilt SpriteFrame object.
  Now there’s no need to extract rotated frames into independent images. This was a costly operation that ruined
  batching system.
  SpriteFrames can create new Frames on-the-fly from their own extends.
* Texture packing.
  The engine offers the possibility of building sprite packs on-the-fly from loaded images.
  This will dramatically improve rendering capabilities.
  Currently the packer is not dynamic, you can’t add/remove images at runtime, but it is expected it will.
  It is optional to use, but very convenient nonetheless.
  The packer is able to pack complete Atlas objects
* Modular Loader objects.
  The Loader has a extension-to-resourceType loader hierarchy.
  New types of resources can be registered by supplying a new factory setting.
  Currently there’re loaders for: image, text, json and plist.
* Detachable renderer.
  The new renderer integrated in CocosJS V4 is completely decoupled from the Nodes' drawing logic.
  It is straightforward to build a new Node type (overwrite the draw method and use the RenderingContext parameter it
  receives).
  It also maintains (if needed) internal webgl state, so it is safe to share the gl context with the external world.
  The renderer is Canvas and WebGL capable and offers consistent rendering capabilities. Both canvas and WebGL renderers
  can be leveraging by exposing the CanvasRenderingContext2D and WebGLContext respectively.
  The renderer allows to define one time rendering vertical axis orientation, either 'bottom' default, where y=0 is
  at the bottom and grows upwards, and 'up' where y=0 is on top and grows vertically (this is canvas' renderer default).
* Path.
  CocosJS V4 has full path capabilities.
  It allows to build complex path objects. Though polymorphically a path is treated as a Segment,
  Internally the Path is a collection of Container Segments.
  Each segment can be a line, bezier, cubic, cardinal spline, arc or rect.
  This allows for complex path traversal using a PathAction, and will be foundation for complex path tracing in the renderer.
* Modular input system.
  Currently there’s support for touch, mouse and keyboard.
  The keyboard recognizes complex keyboard sequences that can be defined by key name.
  The input system has been redefined from the ground up, offering a more natural way of adding input capabilities to
  nodes like the method addEventListener( “<event type>”, callback ): which is widely known.
* Fast WebGL rendering.
  A new Node type, FastSprite, has been added for delivering thousands of sprites to the screen.
  FastSprites are limited version of Sprite. They are not supposed to have children, and are not supposed to have
  input routing capabilities. They are suitable for example for Particles.
* Transitions.
  For managing scenes, there’s also transition support.
  Though (not yet) all the transition types are available in V4, it is fully compatible with V3 Transitions.
* Widgets: only a Button widget is available. Though there’s no Label widget available, a call to drawText in the
  Rendering Content can be performed any time, offering a basic Label component that renders a Font object.
* Centralized AssetManager.
  CocosV4 makes a distinction between Resources (data loaded) and Assets (data produced from assets).
  For example, an Image object is a resource that is eventually turned into a (webgl enabled or not) Texture2D object
  and a SpriteFrame on that texture. Or for example, a '.fnt' file is a text resource that is turned into a SpriteFont
  object by combining a SpriteFrame, a Texture and the .fnt file contents.
  If offers a name based cache system for all in-game resources: textures, sprite frames, animations, fonts, etc.
* Typescript
  The engine is originally written in Typescript, and later transpiled into Javascript.

Most of these core subsystems are implementation and conceptually different to the ones in V3. For example, each Scene
has an ActionManager, and this API version ditches global state. All the singletons like: cc.director, cc.actionManager,
cc.loader, etc. have been removed in favor of local per game/director objects.

There are still missing some other basic Core capabilities like Particles, Audio and more widgets, which are going
to be added for the next iteration.

# From V3 to V4

Though the API expects to be compatible with V3, there are still some issues that either are yet not solved, or will
change from its current state.

## Initialization

The initialization block from V3, polls until the document.body exists. The V4 version expects to start initializing
and creating the Game environment after the DOM is ready, so for example a call to `DOMContentLoaded` is expected

## Bootstrapping

`cc.Boot` is no longer used. An instance to a `cc.game.Game` object instance is needed.

### Example of game startup

This code is from the MoonWarriors example game:

```javascript
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
```

cc.LoaderScene is not present in the V4 implementation.
Also, there's no EGLView object (the static cc.view in V3).
All the code cc.sys.isNative is for JSB, and not browser games.

This code would be in V4:

```javascript
  window.addEventListener(
    "DOMContentLoaded",
    function() {
      new cc.game.Game().
          // adjustViewport(true).    --> developer decision to add viewport to html. why force ?
          setDesignResolutionSize({
              width: 480,                     // canvas width
              height: 720,                    // canvas height
              scaleStrategy: "scale_aspect",  // how to scale the canvas
              canvasPosition: "center",       // after scale, center horizontally the canvas
              canvasElement: "gameCanvas"     // use the document's canvas with this id
          }).
          //resizeWithBrowserSize(true).  --> by default, it resizes with the window viewport
          load(
            g_mainmenu,
            function onEnd(game) {
                cc.director.runScene( SysMenu.scene() );
            }
          );
    },
    false
  );
```


## Loader

The global `cc.loader` object has been removed in favor of `cc.plugin.loader.Loader` object. The Game object has a
`load` method which makes the interaction with this object easier.

## Inheritance

The deep extension mechanism spanned across all Cocos2D HTML V3 has been removed. Now the class hierarchy has been
reduced to the minimum. For example, the Action subsystem is full plain: `cc.action.Action` and from there all other
actions `cc.action.AlphaAction, ...`.
If your code still relies on class extension, a call to `cc.Node.extend` is still valid, though it is encouraged
to use composition. It is also encouraged to make use of the dynamic nature of the language.

There's one limitation to the previous V3 inheritance model, and that is calling a superclass method. Support for
`_super()` calls is not supported. These calls must be changed to, for example `cc.Node.prototype.draw.call(this, ctx);`.

This is the only change you have to do to make the main MoonWarriors scene work:

```javascript
  ctor:function () {
      _super();
      this.init();
  }
```

change the _super call by

```javascript
  ctor:function () {
      cc.Node.prototype.constructor.call(this);
      this.init();
  }
```

All the other code regarding Actions, Sprites, SpriteFrames, Textures, Scheduling, Update, etc. works as is.

# How to build Cocos2D V4

* Install typescrypt 1.4.0+
* Execute setup.sh in project's root folder. If you get some errors about file permissions, either use sudo to execute
  setup.sh or fix your permissions: sudo chown -R $USER /usr/local [http://howtonode.org/introduction-to-npm].
* Now you'll be able to execute 'cocos' located in cmd folder.

# Known issues:

* FastSprite do not honor parent's transformation.
* AnimateAction have a visual glitch by showing a wrong frame when repeating a sequence of the form [seq, seq.inverse]

# Future Roadmap

* Access google spreadsheet files and get changes on-the-fly
* Add dragonbones support