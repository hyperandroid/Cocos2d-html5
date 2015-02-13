CocosJS V4 pre-alpha
--------------------

This version of CocosJS is a total rewrite of the Cocos2D HTML5 V3.
Currently is a pre alpha version and it is based in the following premises:

* Enforce modularity.
* Offer an strong code contract were types are checked at compile time. Why Typescript: https://github.com/hyperandroid/Cocos2d-html5/wiki/Typescript.
* High backwards compatibility with API v3.
* Offer a plain Class hierarchy, enforcing encapsulation avoiding extension where possible.
* Eliminate global state (singletons for everything) to local state, which allows for re-usability, for example, have
  different Director objects running at the same time.
* Remove the asynchronous nature of Cocos2D initialization in favor of a more structured resource loading mechanism.
* Leave the developer more freedom by not making assumptions and decisions on behalf of the developer.

In its current state, we must be humble and low demanding so that:

* The Typescript to Javascript compilation scripts have been tested on Mac and Win 8.1 .
  They may not work in other systems.
* Currently only a Javascript bundle with all the library is supplied.
* Examples are limited, not following at all the unique-responsibility principle so they may be overarchitectured.
  New simpler examples will come along soon.
* Some code is not yet documented even at method level (the least), but the project will catch up with
  documentation and tutorials ASAP.

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
* Screen resolution independence
  CocosJS allows to decouple the mapping between a pixel and an in-game measure unit. This is great for retina
  display support and content conformation to every screen-resolution. See demo text/engine/units.html.
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

# How to build Cocos2D V4

* Install typescrypt 1.4.0+
* Execute setup.sh in project's root folder. If you get some errors about file permissions, either use sudo to execute
  setup.sh or fix your permissions: sudo chown -R $USER /usr/local [http://howtonode.org/introduction-to-npm].
* Now you'll be able to execute 'cocos' located in cmd folder.

# Contribution guide

* Make sure you have a GitHub account.
* Fork the repository on GitHub.
* Always contribute to the latest DEV branch. Never to master.
* Check at least Unit tests are not broken.
* Document and LINT your code.
* Always use curly braces {}. Always curly braces to the right, not new line.
* Format your code.
* Make changes to your clone of the repository.
* Submit a pull request.
* If the pull references a bug, issue, or anything identified with an id, include that id in the description.
* Contribute to Javascript or Typescript at your own criteria.

# Known issues:

* FastSprite do not honor parent's transformation.

