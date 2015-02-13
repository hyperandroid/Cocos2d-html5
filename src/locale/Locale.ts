/**
 * License: see license.txt file.
 */


module cc.locale {

    "use strict";

    //////////// Nodes

    /**
     * Calling removeFromParent and the Node has no parent.
     * @member cc.locale.NODE_WARN_REMOVEFROMPARENT_WITH_NO_PARENT
     * @type {string}
     */
    export var NODE_WARN_REMOVEFROMPARENT_WITH_NO_PARENT: string = "Calling removeFromParent and the Node has no parent.";

    /**
     * Invalid pattern for naming.
     * @member cc.locale.ERR_NODE_NAME_INVALID
     * @type {string}
     */
    export var ERR_NODE_NAME_INVALID : string = "Node name invalid. Must match [A-Za-z0-9_]+";

    /**
     * Invalid pattern for a call to <code>node.enumerateChildren</code>.
     * @member cc.locale.MSG_WRONG_ENUMERATE_PATTERN
     * @type {string}
     */
    export var MSG_WRONG_ENUMERATE_PATTERN : string = "Wrongly defined search pattern path";

    /**
     * A call to <code>node.enumerateChildren</code> goes beyond root node.
     * @member cc.locale.MSG_ENUMERATE_UNDERFLOW
     * @type {string}
     */
    export var MSG_ENUMERATE_UNDERFLOW : string = "Enumerate path underflow. Trying to go above root node.";

    /**
     * Trying to add a node with parent to another node.
     * @member cc.locale.MSG_ERROR_NODE_WITH_PARENT
     * @type {string}
     */
    export var MSG_ERROR_NODE_WITH_PARENT : string = "A node added as child has already a parent.";

    /**
     * A call to <code>director.runScene</code> is made in an already running scene.
     * @member cc.locale.ERR_RUNNING_ALREADY_EXISTING_SCENE
     * @type {string}
     */
    export var ERR_RUNNING_ALREADY_EXISTING_SCENE : string = "runScene trying to run already existing Scene.";

    /**
     * A call to <code>director.popScene</code> to an empty director.
     * @member cc.locale.ERR_DIRECTOR_POPSCENE_UNDERFLOW
     * @type {string}
     */
    export var ERR_DIRECTOR_POPSCENE_UNDERFLOW : string = "Director popScene underflow.";

    /**
     * A call to <code>director.startAnimation</code> to a director in RUNNING state.
     * @member cc.locale.WARN_START_ANIMATION_ON_RUNNING_DIRECTOR
     * @type {string}
     */
    export var WARN_START_ANIMATION_ON_RUNNING_DIRECTOR : string = "Starting animation on a running director.";

    export var WARN_NODE_ATTRIBUTE_DOES_NOT_EXIST: string = "Attribute does not exist in Node object.";

    export var WARN_DEPRECATED_SETBLENDFUNC:string = "Deprecated call. Use setCompositeOperation instead.";

    //////////// Path tracing

    /**
     * A call to an empty path.getCurrentTracePosition.
     * @member cc.locale.ERR_TRACER_EMPTY
     * @type {string}
     */
    export var WARN_TRACER_EMPTY : string = "Path not initialized so no current trace position. Defaulting to (0,0).";

    /**
     * A tracing operation (lineTo, quadraticTo, etc.) is being performed in a closed SubPath.
     * @member cc.locale.WARN_TRACE_ON_CLOSED_SUBPATH
     * @type {string}
     */
    export var WARN_TRACE_ON_CLOSED_SUBPATH : string = "Tracing on a closed SubPath.";

    /**
     * A closePath call is performed on an empty SubPath. No previous tracing happened on it.
     * @member cc.locale.WARN_CLOSE_EMPTY_SUBPATH
     * @type {string}
     */
    export var WARN_CLOSE_EMPTY_SUBPATH : string = "Closing empty SubPath.";

    /**
     * A moveTo call is made to a SubPath with segments.
     * @member cc.locale.WARN_MOVETO_IN_NON_EMPTY_SUBPATH
     * @type {string}
     */
    export var WARN_MOVETO_IN_NON_EMPTY_SUBPATH: string = "MoveTo in non empty SubPath.";

    /**
     * A getStartingPoint call is made to an empty SubPath.
     * @member cc.locale.ERR_SUBPATH_NOT_STARTED
     * @type {string}
     */
    export var ERR_SUBPATH_NOT_STARTED: string = "getStartingPoint called in an empty path.";

    ///////////// Sprites

    /**
     * An operation is made in a SpriteFrame that has no associated texture.
     * @member cc.locale.ERR_SPRITE_FRAME_NO_TEXTURE
     * @type {string}
     */
    export var ERR_SPRITE_FRAME_NO_TEXTURE: string = "SpriteFrame w/o Texture.";

    /**
     * Trying to create a new Sprite with wrong SpriteInitializer data.
     * @member cc.locale.ERR_SPRITE_CONSTRUCTOR_PARAM_ERROR
     * @type {string}
     */
    export var ERR_SPRITE_CONSTRUCTOR_PARAM_ERROR: string = "No suitable SpriteInitializer to Sprite constructor.";

    /**
     * Calling Sprite constructor with V3 signature.
     * @member cc.locale.WARN_SPRITE_CONSTRUCTOR_DEPRECATED_CALL
     * @type {string}
     */
    export var WARN_SPRITE_CONSTRUCTOR_DEPRECATED_CALL: string= "Sprite constructor call deprecated.";

    /**
     * Trying to create a add a SpriteFrame with an existing name in cache.
     * @member cc.locale.WARN_SPRITEFRAME_CREATING_SUBFRAME_WITH_EXISTING_NAME
     * @type {string}
     */
    export var WARN_SPRITEFRAME_CREATING_SUBFRAME_WITH_EXISTING_NAME: string= "Adding a SpriteFrame with existing name in cache.";

    export var SPRITEFRAME_WARN_TEXTURE_NOT_WEBGL_INITIALIZED:string= "Lazily initializing a webgl texture (at draw time).";

    ////////////// Resources

    /**
     * Loaded a resource of unknown type.
     * @member cc.locale.WARN_RESOURCE_OF_UNKNOWN_TYPE
     * @type {string}
     */
    export var WARN_RESOURCE_OF_UNKNOWN_TYPE: string = "Loaded resource of unkown type.";

    export var ASSETMANAGER_WARN_SPRITEFRAME_NOT_FOUND: string= "SpriteFrame with id not found.";

    export var ERR_FONT_GLYPTH_NOT_IN_FRAME: string= "A glitph definition is not in Atlas Spriteframe area.";

    ////////////// Input

    export var INPUT_WARN_WRONG_ROOT_NODE : string= "Adding a path to the wrong root node.";

    ////////////// Loader

    export var LOADER_JSON_PARSE_ERROR:string= "JSON parse error while loading resource.";

    export var WARN_FULLSCREEN_ERROR:string= "Full screen mode error.";

    ////////////// audio

    export var ERR_SOUND_POOL_EMPTY:string= "Can't play, sound pool is empty.";


}