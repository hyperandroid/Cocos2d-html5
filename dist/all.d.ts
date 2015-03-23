/**
 * License: see license.txt file.
 */
/**
 * @name cc
 * @namespace
 */
/**
 * Namespace for Action related objects.
 * @name action
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for math related stuff: vector, matrix, color, etc.
 * @name math
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for path related stuff: Segment, SegmentLine, SegmentBezier, etc.
 * @name path
 * @namespace
 * @memberOf cc.math
 */
/**
 * Namespace for Localization messages and utilities.
 * @name locale
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for Scene transitions.
 * @name transition
 * @namespace
 * @memberOf cc
 */
/**
 * Debug object.
 * @name Debug
 * @memberOf cc
 * @namespace
 */
/**
 * Namespace for nodes.
 * @name node
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for Sprite stuff
 * @name sprite
 * @namespace
 * @memberOf cc.node
 */
/**
 * Namespace for utilities.
 * @name util
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for render related objects.
 * @name render
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for renderer shader related objects.
 * @name shader
 * @namespace
 * @memberOf cc.render
 */
/**
 * Namespace for system plugins. Plugins are optional pieces of code.
 * @name plugin
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for resources management.
 * @name loader
 * @namespace
 * @memberOf cc.plugin
 */
/**
 * Namespace for in-game assets.
 * @name asset
 * @namespace
 * @memberOf cc.plugin
 */
/**
 * Namespace for texture related things like TexturePacker, etc.
 * @name texture
 * @namespace
 * @memberOf cc.plugin
 */
/**
 * Namespace for audio related objects.
 * @name audio
 * @memberOf cc.plugin
 * @namespace
 */
/**
 * Namespace for automatic node layout.
 * @name layout
 * @memberOf cc.plugin
 * @namespace
 */
/**
 * Namespace for input subsytem.
 * @name input
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for game subsytem.
 * @name game
 * @namespace
 * @memberOf cc
 */
/**
 * Namespace for widgets: buttons, labels, etc.
 * @name widget
 * @namespace
 * @memberOf cc
 */
declare module cc {
}
/**
 * License: see license.txt file.
 */
declare module cc.Debug {
    /**
     * Runtime debug level.
     * if DEBUG, a error message will throw an exception.
     * in RELEASE, the exception is not thrown.
     *
     * @tsenum cc.Debug.RuntimeDebugLevel
     */
    enum RuntimeDebugLevel {
        DEBUG = 0,
        RELEASE = 1,
    }
    function EnableConsole(b: boolean): void;
    /**
     * Current Runtime debug level. DEBUG by default.
     * @member cc.Debug.DEBUG_LEVEL
     * @type {RuntimeDebugLevel}
     */
    var DEBUG_LEVEL: RuntimeDebugLevel;
    /**
     * Debug message levels.
     *
     * @tsenum cc.Debug.DebugLevel
     */
    enum DebugLevel {
        Info = 0,
        Warning = 1,
        Error = 2,
    }
    /**
     * Show a message in the console.
     * @method cc.Debug.debug
     * @param level {cc.Debug.RuntimeDebugLevel} debug level criticism
     * @param msg {string} message to show
     * @param rest {Array<any>} other parameters to show in console.
     */
    function debug(level: DebugLevel, msg: string, rest: Array<any>): void;
    /**
     * Show an error message.
     * @method cc.Debug.error
     * @param msg {string} error message.
     * @param rest {Array<any>} other elements to show in console.
     */
    function error(msg: string, ...rest: Array<any>): void;
    /**
     * Show a warning message.
     * @method cc.Debug.warn
     * @param msg {string} error message.
     * @param rest {Array<any>} other elements to show in console.
     */
    function warn(msg: string, ...rest: Array<any>): void;
    /**
     * Show an info message.
     * @method cc.Debug.info
     * @param msg {string} error message.
     * @param rest {Array<any>} other elements to show in console.
     */
    function info(msg: string, ...rest: Array<any>): void;
}
/**
 * License: see license.txt file.
 */
declare module cc.locale {
    /**
     * Calling removeFromParent and the Node has no parent.
     * @member cc.locale.NODE_WARN_REMOVEFROMPARENT_WITH_NO_PARENT
     * @type {string}
     */
    var NODE_WARN_REMOVEFROMPARENT_WITH_NO_PARENT: string;
    /**
     * Invalid pattern for naming.
     * @member cc.locale.ERR_NODE_NAME_INVALID
     * @type {string}
     */
    var ERR_NODE_NAME_INVALID: string;
    /**
     * Invalid pattern for a call to <code>node.enumerateChildren</code>.
     * @member cc.locale.MSG_WRONG_ENUMERATE_PATTERN
     * @type {string}
     */
    var MSG_WRONG_ENUMERATE_PATTERN: string;
    /**
     * A call to <code>node.enumerateChildren</code> goes beyond root node.
     * @member cc.locale.MSG_ENUMERATE_UNDERFLOW
     * @type {string}
     */
    var MSG_ENUMERATE_UNDERFLOW: string;
    /**
     * Trying to add a node with parent to another node.
     * @member cc.locale.MSG_ERROR_NODE_WITH_PARENT
     * @type {string}
     */
    var MSG_ERROR_NODE_WITH_PARENT: string;
    /**
     * A call to <code>director.runScene</code> is made in an already running scene.
     * @member cc.locale.ERR_RUNNING_ALREADY_EXISTING_SCENE
     * @type {string}
     */
    var ERR_RUNNING_ALREADY_EXISTING_SCENE: string;
    /**
     * A call to <code>director.popScene</code> to an empty director.
     * @member cc.locale.ERR_DIRECTOR_POPSCENE_UNDERFLOW
     * @type {string}
     */
    var ERR_DIRECTOR_POPSCENE_UNDERFLOW: string;
    /**
     * A call to <code>director.startAnimation</code> to a director in RUNNING state.
     * @member cc.locale.WARN_START_ANIMATION_ON_RUNNING_DIRECTOR
     * @type {string}
     */
    var WARN_START_ANIMATION_ON_RUNNING_DIRECTOR: string;
    var WARN_NODE_ATTRIBUTE_DOES_NOT_EXIST: string;
    var WARN_DEPRECATED_SETBLENDFUNC: string;
    /**
     * A call to an empty path.getCurrentTracePosition.
     * @member cc.locale.ERR_TRACER_EMPTY
     * @type {string}
     */
    var WARN_TRACER_EMPTY: string;
    /**
     * A tracing operation (lineTo, quadraticTo, etc.) is being performed in a closed SubPath.
     * @member cc.locale.WARN_TRACE_ON_CLOSED_SUBPATH
     * @type {string}
     */
    var WARN_TRACE_ON_CLOSED_SUBPATH: string;
    /**
     * A closePath call is performed on an empty SubPath. No previous tracing happened on it.
     * @member cc.locale.WARN_CLOSE_EMPTY_SUBPATH
     * @type {string}
     */
    var WARN_CLOSE_EMPTY_SUBPATH: string;
    /**
     * A moveTo call is made to a SubPath with segments.
     * @member cc.locale.WARN_MOVETO_IN_NON_EMPTY_SUBPATH
     * @type {string}
     */
    var WARN_MOVETO_IN_NON_EMPTY_SUBPATH: string;
    /**
     * A getStartingPoint call is made to an empty SubPath.
     * @member cc.locale.ERR_SUBPATH_NOT_STARTED
     * @type {string}
     */
    var ERR_SUBPATH_NOT_STARTED: string;
    /**
     * An operation is made in a SpriteFrame that has no associated texture.
     * @member cc.locale.ERR_SPRITE_FRAME_NO_TEXTURE
     * @type {string}
     */
    var ERR_SPRITE_FRAME_NO_TEXTURE: string;
    /**
     * Trying to create a new Sprite with wrong SpriteInitializer data.
     * @member cc.locale.ERR_SPRITE_CONSTRUCTOR_PARAM_ERROR
     * @type {string}
     */
    var ERR_SPRITE_CONSTRUCTOR_PARAM_ERROR: string;
    /**
     * Calling Sprite constructor with V3 signature.
     * @member cc.locale.WARN_SPRITE_CONSTRUCTOR_DEPRECATED_CALL
     * @type {string}
     */
    var WARN_SPRITE_CONSTRUCTOR_DEPRECATED_CALL: string;
    /**
     * Trying to create a add a SpriteFrame with an existing name in cache.
     * @member cc.locale.WARN_SPRITEFRAME_CREATING_SUBFRAME_WITH_EXISTING_NAME
     * @type {string}
     */
    var WARN_SPRITEFRAME_CREATING_SUBFRAME_WITH_EXISTING_NAME: string;
    var SPRITEFRAME_WARN_TEXTURE_NOT_WEBGL_INITIALIZED: string;
    /**
     * Loaded a resource of unknown type.
     * @member cc.locale.WARN_RESOURCE_OF_UNKNOWN_TYPE
     * @type {string}
     */
    var WARN_RESOURCE_OF_UNKNOWN_TYPE: string;
    var ASSETMANAGER_WARN_SPRITEFRAME_NOT_FOUND: string;
    var ERR_FONT_GLYPTH_NOT_IN_FRAME: string;
    var INPUT_WARN_WRONG_ROOT_NODE: string;
    var LOADER_JSON_PARSE_ERROR: string;
    var WARN_FULLSCREEN_ERROR: string;
    var ERR_SOUND_POOL_EMPTY: string;
}
/**
 * License: see license.txt file.
 */
declare module cc.math {
    /**
     * @class cc.math.RGBAColor
     * @interface
     * @classdesc
     *
     * Interface for a RGB color with optional alpha value.
     * <br>
     * It is expected that r,g,b,a color components be normalized values [0..1]
     */
    interface RGBAColor {
        /**
         * Color red component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        r: number;
        /**
         * Color green component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        g: number;
        /**
         * Color blue component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        b: number;
        /**
         * Color alpha component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        a?: number;
    }
    /**
     * @class cc.math.Color
     * @classdesc
     *
     * A color is represented by 4 components: RGBA encapsulated in a Float32Array.
     * <br>
     * Internally, Color components are stored as normalized color values 0..1
     * <br>
     * This object has cache capabilities for internal color string representation so calling repeatedly
     * <code>getFillStyle</code>, <code>getHexRGB</code> and <code>getHexRGBA</code> will always be fast.
     */
    class Color {
        /**
         * Should rebuild canvas string representation cache ?
         * @member cc.math.Color#_dirty
         * @type {boolean}
         * @private
         */
        _dirty: boolean;
        /**
         * Should rebuild hex string representation cache ?
         * @member cc.math.Color#_dirtyHex
         * @type {boolean}
         * @private
         */
        _dirtyHex: boolean;
        /**
         * Color components.
         * @member cc.math.Color#_color
         * @type {Float32Array}
         * @private
         */
        _color: Float32Array;
        /**
         * cached canvas rgba string representation.
         * @member cc.math.Color#_fillStyle
         * @type {string}
         * @private
         */
        _fillStyle: string;
        /**
         * cached hex string representation.
         * @member cc.math.Color#_hexRGB
         * @type {string}
         * @private
         */
        _hexRGB: string;
        /**
         * cached hex rgba string representation.
         * @member cc.math.Color#_hexRGBA
         * @type {string}
         * @private
         */
        _hexRGBA: string;
        /**
         * Instantiate a color.
         * @method cc.math.Color#constructor
         * @param r {number} 0..1
         * @param g {number} 0..1
         * @param b {number} 0..1
         * @param a {number} 0..1
         */
        constructor(r?: number, g?: number, b?: number, a?: number);
        /**
         * Get the color's RGB representation.
         * @method cc.math.Color#getHexRGB
         * @returns {string} "#RRGGBB" color representation
         */
        getHexRGB(): string;
        /**
         * Get the color's RGB representation.
         * @method cc.math.Color#getHexRGBA
         * @returns {string} "#RRGGBBAA" color representation
         */
        getHexRGBA(): string;
        /**
         * Internal helper to calculate hex string color representation.
         * @method cc.math.Color#__calculateHexStyle
         * @private
         */
        __calculateHexStyle(): void;
        /**
         * Internal helper to calculate canvas string color representation.
         * @method cc.math.Color#__calculateFillStyle
         * @private
         */
        __calculateFillStyle(): void;
        /**
         * Get the color's canvas string representation.
         * If color changed, the string will be recalculated.
         * @method cc.math.Color#getFillStyle
         * @returns {string}
         */
        getFillStyle(): string;
        /**
         * Get red color component.
         * @name cc.math.Color#get:r
         * @type {number}
         */
        /**
         * Set red color component.
         * @name cc.math.Color#set:r
         * @param v {number} red component. Should be in the range 0..1
         */
        r: number;
        /**
         * Get green color component.
         * @name cc.math.Color#get:g
         * @type {number}
         */
        /**
         * Set green color component.
         * @name cc.math.Color#set:g
         * @param v {number} green component. Should be in the range 0..1
         */
        g: number;
        /**
         * Get blue color component.
         * @name cc.math.Color#get:b
         * @type {number}
         */
        /**
         * Set blue color component.
         * @name cc.math.Color#set:b
         * @param v {number} blue component. Should be in the range 0..1
         */
        b: number;
        /**
         * Get alpha color component.
         * @name cc.math.Color#get:a
         * @type {number}
         */
        /**
         * Set alpha color component.
         * @name cc.math.Color#set:a
         * @param v {number} alpha component. Should be in the range 0..1
         */
        a: number;
        static createFromRGBA(c: string): Color;
        static createFromRGBA(c: RGBAColor): Color;
        /**
         * Parse a color of the from rgb(rrr,ggg,bbb) or rgba(rrr,ggg,bbb,a)
         * This method assumes the color parameter starts with rgb or rgba
         * @method cc.math.Color.fromRGBStringToColor
         * @param color {string}
         */
        static fromRGBStringToColor(color: string): any;
        /**
         * Parse a CSS color. If the color is not recognizable will return MAGENTA;
         * @method cc.math.Color.fromStringToColor
         * @param hex {string} of the form RGB, RGBA, RRGGBB, RRGGBBAA, #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb(rrr,ggg,bbb), rgba(rrr,ggg,bbb,a)
         * @returns {cc.math.Color}
         */
        static fromStringToColor(hex: string): Color;
        /**
         * Shamelessly ripped from: http://beesbuzz.biz/code/hsv_color_transforms.php
         * Thanks for the awesome code.
         *
         * Convert a color value based on HSV parameters.
         *
         * @param c {cc.math.Color}
         * @param H {number} angle
         * @param S {number}
         * @param V {number}
         * @returns {cc.math.Color} modified color.
         */
        static HSV(c: cc.math.Color, H: number, S: number, V: number): Color;
        /**
         * Transparent black color.
         * @member cc.math.Color.TRANSPARENT_BLACK
         * @type {cc.math.Color}
         */
        static TRANSPARENT_BLACK: Color;
        /**
         * Opaque black color.
         * @member cc.math.Color.BLACK
         * @type {cc.math.Color}
         */
        static BLACK: Color;
        /**
         * Opaque red color.
         * @member cc.math.Color.RED
         * @type {cc.math.Color}
         */
        static RED: Color;
        /**
         * Opaque green color.
         * @member cc.math.Color.GREEN
         * @type {cc.math.Color}
         */
        static GREEN: Color;
        /**
         * Opaque blue color.
         * @member cc.math.Color.BLUE
         * @type {cc.math.Color}
         */
        static BLUE: Color;
        /**
         * Opaque white color.
         * @member cc.math.Color.WHITE
         * @type {cc.math.Color}
         */
        static WHITE: Color;
        /**
         * Opaque magenta color.
         * @member cc.math.Color.MAGENTA
         * @type {cc.math.Color}
         */
        static MAGENTA: Color;
        /**
         * Opaque yellow color.
         * @member cc.math.Color.YELLOW
         * @type {cc.math.Color}
         */
        static YELLOW: Color;
        /**
         * Opaque cyan color.
         * @member cc.math.Color.CYAN
         * @type {cc.math.Color}
         */
        static CYAN: Color;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.math {
    import Node = cc.node.Node;
    import RenderingContext = cc.render.RenderingContext;
    /**
     * @class cc.math.Matrix3
     *
     * @classdesc
     *
     * Affine transformation matrix Object.
     * <br>
     * The Matrix3 <strong>IS NOT</strong> a general purpose matrix calculation package. Do not use for anything else than affine
     * transformation purposes inside the Cocos2D HTML5 engine.
     */
    class Matrix3 {
        /**
         * Build a new Matrix3 object.
         * @method cc.math.Matrix3#constructor
         */
        static create(): Float32Array;
        /**
         * Turn the matrix to identity.
         * @method cc.math.Matrix3.identity
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @returns {cc.math.Matrix3}
         */
        static identity(matrix: Float32Array): void;
        static translateBy(matrix: Float32Array, dtx: number, dty: number): void;
        static scaleBy(matrix: Float32Array, sx: number, sy: number): void;
        static rotateBy(matrix: Float32Array, angle: number): void;
        /**
         * Copy a source to a destination matrix
         * @method cc.math.Matrix#copy
         * @param source {Float32Array} matrix coefficients. horizontal vectors.
         * @param destination {Float32Array} matrix coefficients. horizontal vectors.
         */
        static copy(source: Float32Array, destination: Float32Array): void;
        static set(m: Float32Array, a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        /**
         * Given a node, calculate a resulting matrix for position, scale and rotate.
         * @method cc.math.Matrix3.setTransformAll
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param node {cc.node.Node} a cc.node.Node instance
         */
        static setTransformAll(mm: Float32Array, node: Node): void;
        /**
         * Given a node, calculate a resulting matrix for position and scale.
         * @method cc.math.Matrix3.setTransformScale
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param node {cc.node.Node} a cc.node.Node instance
         */
        static setTransformScale(mm: Float32Array, node: Node): void;
        /**
         * Given a node, calculate a resulting matrix for position.
         * @method cc.math.Matrix3.setTransformTranslate
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param node {cc.node.Node} a cc.node.Node instance
         */
        static setTransformTranslate(mm: Float32Array, node: Node): void;
        /**
         * Multiply matrix m0 by matrix m1. modify m0.
         * <br>
         * Both matrices must be Matrix3 instances.
         * @method cc.math.Matrix3.multiply
         * @param m0 {Float32Array} matrix coefficients. horizontal vectors.
         * @param m1 {Float32Array} matrix coefficients. horizontal vectors.
         */
        static multiply(m0: Float32Array, m1: Float32Array): void;
        static premultiply(m1: Float32Array, m0: Float32Array): void;
        /**
         * Transform a point by the matrix.
         * <br>
         * The point will be overwritten by the resulting point.
         * @method cc.math.Matrix3.transformPoint
         * @param tm {Float32Array} matrix coefficients. horizontal vectors.
         * @param point {cc.math.Point} Point or Vector to transform.
         */
        static transformPoint(tm: Float32Array, point: Point): Point;
        /**
         * Set transformation coefficients for a RenderingContext.
         * @method cc.math.Matrix3.setRenderingContextTransform
         * @param mm {Float32Array} matrix coefficients. horizontal vectors.
         * @param ctx {cc.render.RenderingContext} a rendering context.
         */
        static setRenderingContextTransform(mm: Float32Array, ctx: RenderingContext): void;
        /**
         * Set the matrix as follows
         * [ a b x ]
         * | c d y |
         * [ 0 0 1 ]
         * @method cc.math.Matrix3.setTransform
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        static setTransform(matrix: Float32Array, a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        /**
         * Concatenate the matrix with another matrix build of the coefficients set as parameters.
         * @method cc.math.Matrix3.transform
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        static transform(matrix: Float32Array, a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        /**
         * Make the matrix a translation matrix.
         * @method cc.math.Matrix3.setTranslate
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param x {number}
         * @param y {number}
         * @returns {cc.math.Matrix3} the same matrix.
         */
        static setTranslate(matrix: Float32Array, x: number, y: number): void;
        /**
         * Make the matrix a rotation matrix.
         * @method cc.math.Matrix3.setRotate
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param angle {number} angle in radians.
         * @returns {cc.math.Matrix3} the same matrix.
         */
        static setRotate(matrix: Float32Array, angle: number): void;
        /**
         * Make the matrix a scale matrix.
         * @method cc.math.Matrix3.setScale
         * @param matrix {Float32Array} matrix coefficients. horizontal vectors.
         * @param x
         * @param y
         * @returns {cc.math.Matrix3}
         */
        static setScale(matrix: Float32Array, x: number, y: number): void;
        static inverse(matrix: Float32Array, res: Float32Array): void;
        /**
         * An identity Matrix3 static instance.
         * @member cc.math.Matrix3.IDENTITY
         * @type {cc.math.Matrix3}
         */
        static IDENTITY: Float32Array;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.math {
    class Matrix4 {
        _matrix: Float32Array;
        constructor();
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.math {
    /**
     * @class cc.math.Point
     * @interface
     * @classdesc
     *
     * A 2d or 3d point interface.
     *
     */
    interface Point {
        /**
         * Point x coordinate.
         * @member cc.math.Point#x
         * @type {number}
         */
        x: number;
        /**
         * Point y coordinate.
         * @member cc.math.Point#y
         * @type {number}
         */
        y: number;
    }
    /**
     * @class cc.math.Vector
     * @classdesc
     *
     * Object represents a 2D or 3D vector.
     */
    class Vector implements Point {
        x: number;
        y: number;
        z: number;
        /**
         * Point x coordinate.
         * @member cc.math.Vector#x
         * @type {number}
         */
        /**
         * Point y coordinate.
         * @member cc.math.Vector#y
         * @type {number}
         */
        /**
         * Point z coordinate.
         * @member cc.math.Vector#z
         * @type {number}
         */
        /**
         * @method cc.math.Vector#constructor
         * @param x {number} vector x coordinate
         * @param y {number} vector y coordinate
         * @param z {number} vector z coordinate. if not set zero by default.
         */
        constructor(x?: number, y?: number, z?: number);
        /**
         * Set a Vector with new values.
         *
         * @method cc.math.Vector#set
         * @param x {number} vector x coordinate
         * @param y {number} vector y coordinate
         * @param z {number=} vector z coordinate. if not set zero by default.
         * @returns {cc.math.Vector}
         */
        set(x: number, y: number): Vector;
        /**
         * get the vector length.
         * @returns {number}
         */
        length(): number;
        /**
         * get the vector angle.
         * @returns {number}
         */
        angle(): number;
        normalize(): Vector;
        /**
         * Calculate distance from the vector to another vector.
         * @param v {cc.math.Vector}
         * @returns {number}
         */
        distance(v: Vector): number;
        /**
         * Substract a vector from this vector.
         * @param v {cc.math.Vector}
         */
        sub(v: Vector): Vector;
        /**
         * Add a vector from this vector.
         * @param v {cc.math.Vector}
         */
        add(v: Vector): Vector;
        /**
         * Multiply the vector by a scalar.
         * @param v {number}
         * @returns {cc.math.Vector}
         */
        mult(v: number): Vector;
        static add(v0: Vector, v1: Vector): Vector;
        /**
         * Create a Vector with the substraction of two vectors.
         * @param v0 {cc.math.Vector}
         * @param v1 {cc.math.Vector}
         * @returns {Vector}
         */
        static sub(v0: Vector, v1: Vector): Vector;
        /**
         * Calculate the distance between two vectors
         * @param v0 {cc.math.Vector}
         * @param v1 {cc.math.Vector}
         * @returns {number} distance between vectors.
         */
        static distance(v0: Vector, v1: Vector): number;
        static angleWith(p0: Point, p1: Point): number;
        static middlePoint(p0: Point, p1: Point): Vector;
        /**
         * Compare the vector with another vector for equality.
         * @param v {cc.math.Vector}
         * @returns {boolean}
         */
        equals(v: Vector): boolean;
        /**
         * Create a new Vetor copy of this vector.
         * @returns {cc.math.Vector}
         */
        clone(): Vector;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.math {
    import Point = cc.math.Point;
    /**
     * @class cc.math.Rectangle
     * @classdesc
     *
     * Rectangle Object.
     */
    class Rectangle {
        x: number;
        y: number;
        w: number;
        h: number;
        /**
         * 'right' corner x coord.
         * @member cc.math.Rectangle#x1
         * @type {number}
         */
        x1: number;
        /**
         * 'right' corner y coord.
         * @member cc.math.Rectangle#y1
         * @type {number}
         */
        y1: number;
        /**
         * Left-top x coordinate
         * @member cc.math.Rectangle#x
         * @type {number}
         */
        /**
         * Left-top y coordinate
         * @member cc.math.Rectangle#y
         * @type {number}
         */
        /**
         * Rectangle width
         * @member cc.math.Rectangle#w
         * @type {number}
         */
        /**
         * Rectangle height
         * @member cc.math.Rectangle#h
         * @type {number}
         */
        /**
         * Build a new Rectangle instance.
         * @method cc.math.Rectangle#constructor
         * @param x {number=} 'left' corner x coordinate.
         * @param y {number=} 'left' corner y coordinate.
         * @param w {number=} rectangle width.
         * @param h {number=} rectangle height.
         */
        constructor(x?: number, y?: number, w?: number, h?: number);
        /**
         * Overwrite the rectangle's coordinates with new values.
         * @method cc.math.Rectangle#set
         * @param x {number} rectangle position x coordinate
         * @param y {number} rectangle position y coordinate
         * @param w {number} rectangle width
         * @param h {number} rectangle height
         * @returns {cc.math.Rectangle} the rectangle instance.
         */
        set(x: number, y: number, w: number, h: number): Rectangle;
        /**
         * Get whether a Rectangle intersects with this rectangle.
         * @method cc.math.Rectangle#intersects
         * @param r {cc.math.Rectangle}
         * @returns {*}
         */
        intersectsWith(r: Rectangle): boolean;
        /**
         * Gets whether a rectangle of given dimension is inside the rectangle.
         * @method cc.math.Rectangle#intersects
         * @param x {number|Rectangle}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @returns {boolean}
         */
        intersects(x: number, y: number, w: number, h: number): boolean;
        /**
         * Normalize the rectangle's dimension with the given width and height.
         * @param w {number}
         * @param h {number}
         * @returns {cc.math.Rectangle} reference to this.
         */
        normalizeBy(w: number, h: number): Rectangle;
        /**
         * Set the Rectangle with zero size.
         * @method cc.math.Rectangle#setEmpty
         */
        setEmpty(): void;
        translate(x: number, y: number): Rectangle;
        /**
         * Test whether the Rectangle is empty, eg either its width or height is zero.
         * @method cc.math.Rectangle#isEmpty
         * @returns {boolean}
         */
        isEmpty(): boolean;
        /**
         * Intersect this rectangle with the parameter Rectangle.
         * @param r {cc.math.Rectangle}
         * @return {cc.math.Rectangle} reference to this.
         */
        intersectWith(r: Rectangle): Rectangle;
        contains(x: number, y: number): boolean;
        contains(x: Point): boolean;
        width: number;
        height: number;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.math {
    /**
     * @class cc.math.Dimension
     * @classdesc
     *
     * This Class is for dimension definition.
     */
    class Dimension {
        width: number;
        height: number;
        /**
         * Dimension width.
         * @member cc.math.Dimension#width
         * @type {number}
         * @public
         */
        /**
         * Dimension height.
         * @member cc.math.Dimension#height
         * @type {number}
         * @public
         */
        /**
         * Build a new Dimension instance.
         * @method cc.math.Dimension#constructor
         * @param width {number}
         * @param height {number}
         */
        constructor(width?: number, height?: number);
        set(d: Dimension): any;
        set(w: number, h: number): Dimension;
        clone(): Dimension;
    }
}
/**
 * Created by ibon on 11/20/14.
 */
declare module cc.math.path {
    import Vector = cc.math.Vector;
    var DEFAULT_TRACE_LENGTH: number;
    /**
     * Calculate a vector based on a distance and a matrix.
     * @param distance
     * @param matrix
     * @returns {Vector}
     */
    function getDistanceVector(distance: number, matrix: Float32Array): Vector;
    import Point = cc.math.Point;
    import RenderingContext = cc.render.RenderingContext;
    /**
     * @class cc.math.path.Segment
     * @interface
     * @classdesc
     *
     * Base interface for every path Segment.
     * <br>
     *
     * Segments can be of any type. Simple segments like SegmentLine or SegmentBezier, or compound segments like Path @see {cc.math.Path}.
     *
     * <br>
     * A Segment instance is defined by the following basic capabilities:
     *
     *  + it has a length.
     *  + can be sampled, and a collections of points on the Segment will be returned.
     *  + can get a Point on the Segment represented by a normalized value. The method <code>getValueAt</code> does
     *    all the magic. This happens for any kind of segment, even complex Paths built of SubPaths.
     *  + can identify its starting point.
     *  + can identify its ending point.
     *  + can be cloned. A Segment of any type will create a fresh copy of itself.
     *
     */
    interface Segment {
        _length: number;
        /**
         * Get the segment parent Segment.
         * @returns {cc.math.path.Segment}
         */
        getParent(): cc.math.path.ContainerSegment;
        /**
         * Set the segment parent Segment.
         */
        setParent(s: cc.math.path.ContainerSegment): void;
        /**
         * Get the segment's length. The length is a relative value obtained from adding a sample trace over the
         * segment equation.
         * @method cc.math.path.Segment#getLength
         * @returns {number} Segment's length
         */
        getLength(): number;
        /**
         * Trace the segment and get a collection of points on it.
         * @method cc.math.path.Segment#trace
         * @param numPoints {number=} number of points to sample on the segment. If not set, 30 points will be sampled.
         * @param dstArray {Array<Vector>=} destination array of points. if not set, a new array will be created.
         * @returns {Array<cc.math.Vector>} an array of points on the segment.
         */
        trace(dstArray?: Array<Vector>, numPoints?: number): Vector[];
        /**
         * Get a point on the segment. Assuming the Segment will be of size 1, being 0 the origin segment point, and
         * 1 the final segment point, the normalizedPos parameter represents a point on this segment proportional to its
         * value.
         * <br>
         * For segments like beziers, the returned point will be result of solving the curve for the parameter, and not
         * necessarily the point at the proportional curve length position.
         * @method cc.math.path.Segment#getValueAt
         * @param normalizedPos {number} a value in the range 0..1
         * @param out {cc.math.Vector=} an optional point to set the result in.
         * @returns {cc.math.Vector} a point in the path.
         */
        getValueAt(normalizedPos: number, out?: Vector): Vector;
        /**
         * Get the first point in the Segment.
         *  + For a SubPath will be its first Segment's starting point.
         *  + For a Path will be its first SubPath's starting point.
         * @method cc.math.path.Segment#getStartingPoint
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * Get the last point in the Segment.
         *  + For a SubPath will be its last Segment's end point.
         *  + For a Path will be its last SubPath's end point.
         * @method cc.math.path.Segment#getStartingPoint
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        /**
         * Build a copy of this segment, either a complete path or a line.
         * @method cc.math.path.Segment#clone
         * @returns {cc.math.path.Segment} a copy of the segment.
         */
        clone(): Segment;
        /**
         * Add the Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.Segment#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?: Array<Point>): Array<Point>;
        /**
         * Mark a Segment and all its SubSegments are dirty whatever it means.
         * @methodcc.math.path.Segment#setDirty
         */
        setDirty(d: boolean): any;
        paint(ctx: RenderingContext): any;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.math.path {
    import Point = cc.math.Point;
    import Vector = cc.math.Vector;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;
    /**
     * @class cc.math.path.SegmentLineInitializer
     * @interface
     * @classdesc
     *
     * SegmentLine initialization object.
     *
     */
    interface SegmentLineInitializer {
        /**
         * Line start point.
         * @member cc.math.path.SegmentLineInitializer#start
         * @type {cc.math.Point}
         */
        start: Point;
        /**
         * Line end point.
         * @member cc.math.path.SegmentLineInitializer#end
         * @type {cc.math.Point}
         */
        end: Point;
    }
    /**
     *
     * @class cc.math.path.SegmentLine
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * Objects of this type represent a line segment.
     * Line segments are added to a Path by calling <code>path.lineTo(x,y)</code>.
     *
     */
    class SegmentLine implements Segment {
        /**
         * Parent Segment. An instance of <code>ContainerSegment</code>
         * @member cc.math.path.SegmentLine
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent: ContainerSegment;
        /**
         * The line segment length.
         * @member cc.math.path.SegmentLine#_length
         * @type {number}
         * @private
         */
        _length: number;
        /**
         * The line start point.
         * @member cc.math.path.SegmentLine#_start
         * @type {cc.math.Vector}
         * @private
         */
        _start: Vector;
        /**
         * The line end point.
         * @member cc.math.path.SegmentLine#_end
         * @type {cc.math.Vector}
         * @private
         */
        _end: Vector;
        _dirty: boolean;
        /**
         * Build a new SegmentLine instance.
         * @method cc.math.path.SegmentLine#constructor
         * @param data {SegmentLineInitializer=}
         */
        constructor(data?: SegmentLineInitializer);
        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentLine#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent(): ContainerSegment;
        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentLine#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent(s: ContainerSegment): void;
        /**
         * Initialize this segment points.
         * This method takes the supplied point references, does not build new points.
         * @method cc.math.path.SegmentLine#setPoints
         * @param start {cc.math.Point} start line point.
         * @param end {cc.math.Point} end line point.
         */
        initialize(start: Point, end: Point): void;
        __calculateLength(): void;
        /**
         * Get the line length.
         * @override
         * @method cc.math.path.SegmentLine#getLength
         * @returns {number}
         */
        getLength(): number;
        /**
         * Sample some points on the line segment.
         * This implementation only samples two points, initial and final.
         * It returns the points that conform the line, if they are changed, the line will be changed as well.
         * @method cc.math.path.SegmentLine#trace
         * @param numPoints {number=} number of points traced on the segment.
         * @param dstArray {Array<cc.math.Vector>=} array where to add the traced points.
         * @returns {Array<Vector>} returns the supplied array of points, or a new array of points if not set.
         */
        trace(dstArray?: Array<Vector>, numPoints?: number): Vector[];
        /**
         * Get a point on the line at the given proportional position.
         * @param normalizedPos {number} value in the range 0..1
         * @param out {cc.math.Vector=} optional out point. if not set, an internal spare point will be used.
         * @returns {cc.math.Vector} a point on the segment at the given position. This point should be copied,
         * successive calls to getValue will return the same point instance.
         */
        getValueAt(normalizedPos: number, out?: Vector): Vector;
        /**
         * Get the Segment's starting point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * Get the Segment's ending point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentLine#clone
         * @returns {cc.math.path.Segment}
         */
        clone(): SegmentLine;
        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.SegmentLine#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?: Array<Point>): Array<Point>;
        /**
         * Mark the Segment dirty.
         * No action for lines.
         * @methodcc.math.path.SegmentLine#setDirty
         */
        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(d: boolean): void;
        paint(ctx: cc.render.RenderingContext): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.math.path {
    import Vector = cc.math.Vector;
    /**
     *
     * @param p0 {cc.math.Vector}
     * @param cp0 {cc.math.Vector}
     * @param cp1 {cc.math.Vector}
     * @param p1 {cc.math.Vector}
     * @param points {Array<cc.math.Vector>=}
     *
     * @static
     */
    function traceBezier(p0: Vector, cp0: Vector, cp1: Vector, p1: Vector, m_points?: Vector[]): Vector[];
    /**
     *
     * @param p0 {cc.math.Vector}
     * @param cp0 {cc.math.Vector}
     * @param p1 {cc.math.Vector}
     * @param m_points {Array<cc.math.Vector>=}
     * @static
     */
    function traceQuadratic(p0: Vector, cp0: Vector, p1: Vector, m_points?: Vector[]): Vector[];
}
/**
 * License: see license.txt file.
 */
declare module cc.math.path {
    import Vector = cc.math.Vector;
    import Point = cc.math.Point;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;
    /**
     * @class cc.math.path.SegmentQuadraticInitializer
     * @interface
     * @classdesc
     *
     * A quadratic curve is composed of 2 points (initial=p0 and end point=p2) and a tension control point=p1.
     *
     */
    interface SegmentQuadraticInitializer {
        /**
         * First curve point.
         * @member cc.math.path.SegmentQuadraticInitializer#p0
         * @type {cc.math.Point}
         */
        p0: Point;
        /**
         * Curve control point.
         * @member cc.math.path.SegmentQuadraticInitializer#p1
         * @type {cc.math.Point}
         */
        p1: Point;
        /**
         * last curve point.
         * @member cc.math.path.SegmentQuadraticInitializer#p2
         * @type {cc.math.Point}
         */
        p2: Point;
    }
    /**
     * @class cc.math.path.SegmentQuadratic
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This Object is a Quadratic Bezier Segment.
     * <p>
     *     It is composed of two points and a tension control point. Internally, the Segment can cache its contour.
     * <p>
     *     The contour can be of two different types:
     *     + directly traced over the curve. Leaves points at different distances on the curve.
     *     + equi-distant on the curve. Internally traces the points as in the other type, but then creates a polyline
     *       path with the points, and samples the resulting path at regular intervals. This transforms the curve into
     *       a polyline, which is faster for most calculations, but could not be as smooth as the other type.
     * <p>
     * By default, the curve is calculated with the first type, directly tracing on the curve
     *
     */
    class SegmentQuadratic implements Segment {
        /**
         * Start quadratic curve point.
         * @member cc.math.path.SegmentQuadratic#_p0
         * @type {cc.math.Vector}
         * @private
         */
        _p0: Vector;
        /**
         * Quadratic curve control point.
         * @member cc.math.path.SegmentQuadratic#_cp0
         * @type {cc.math.Vector}
         * @private
         */
        _cp0: Vector;
        /**
         * End quadratic curve point.
         * @member cc.math.path.SegmentQuadratic#_p1
         * @type {cc.math.Vector}
         * @private
         */
        _p1: Vector;
        /**
         * Internal flag for cache validity.
         * @member cc.math.path.SegmentQuadratic#_dirty
         * @type {boolean}
         * @private
         */
        _dirty: boolean;
        /**
         * Parent segment.
         * @member cc.math.path.SegmentQuadratic#_parent
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent: ContainerSegment;
        /**
         * Segment length. It is approximately calculated by subdividing the curve.
         * @member cc.math.path.SegmentQuadratic#_length
         * @type {number}
         * @private
         */
        _length: number;
        /**
         * Create a new Quadratic Segment instance.
         * @param data {cc.math.path.SegmentQuadraticInitializer=}
         */
        constructor(data?: SegmentQuadraticInitializer);
        /**
         * Initialize the Segment with the supplied points.
         * @param p0 {cc.math.Point} start curve point.
         * @param p1 {cc.math.Point} curve control point.
         * @param p2 {cc.math.Point} end curve point}
         */
        initialize(p0: Point, p1: Point, p2: Point): void;
        __calculateLength(): void;
        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentQuadratic#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent(): ContainerSegment;
        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentQuadratic#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent(s: ContainerSegment): void;
        /**
         * Get the Segment length.
         * @override
         * @method cc.math.path.SegmentQuadratic#getLength
         * @returns {number}
         */
        getLength(): number;
        /**
         * Sample some points on the segment. It will return either the sampled contour, or the flattened version of it.
         * It returns the points that conform the Segment contour, if they are changed, the contour will be changed as well.
         * @method cc.math.path.SegmentQuadratic#trace
         * @param numPoints {number=} number of points traced on the segment.
         * @param dstArray {Array<cc.math.Vector>=} array where to add the traced points.
         * @returns {Array<Vector>} returns the supplied array of points, or a new array of points if not set.
         */
        trace(dstArray?: Array<Vector>, numPoints?: number): Vector[];
        /**
         * Get a point on the Segment at the given proportional position.
         * + If the segment is flattened, the value will be calculated from the internally cached curve contour.
         * + If not, if will be calculated by solving the curve.
         * The first is faster, but could be inaccurate for curves with a los number of flattened cached points.
         * @param normalizedPos {number} value in the range 0..1
         * @param out {cc.math.Vector=} optional out point. if not set, an internal spare point will be used.
         * @returns {cc.math.Vector} a point on the segment at the given position. This point should be copied,
         * successive calls to getValue will return the same point instance.
         */
        getValueAt(normalizedPos: number, out?: Vector): Vector;
        static solve(v0: number, cv0: number, v1: number, t: number, t1: number): number;
        /**
         * Get the Segment's starting point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * Get the Segment's ending point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentQuadratic#clone
         * @returns {cc.math.path.Segment}
         */
        clone(): SegmentQuadratic;
        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.SegmentQuadratic#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?: Array<Point>): Array<Point>;
        /**
         * Mark the quadratic as dirty. Mark internal polilyne info as invalid.
         * @methodcc.math.path.SegmentBezier#setDirty
         */
        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(d: boolean): void;
        paint(ctx: cc.render.RenderingContext): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.math.path {
    import Vector = cc.math.Vector;
    import Point = cc.math.Point;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;
    /**
     * @class cc.math.path.SegmentBezierInitializer
     * @interface
     * @classdesc
     *
     * A Cubic curve is composed of 2 points (initial=p0 and end point=p3) and a two tension control points (p1 and p2).
     *
     */
    interface SegmentBezierInitializer {
        /**
         * First curve point.
         * @member cc.math.path.SegmentBezierInitializer#p0
         * @type {cc.math.Point}
         */
        p0: Point;
        /**
         * First Curve control point.
         * @member cc.math.path.SegmentBezierInitializer#p1
         * @type {cc.math.Point}
         */
        p1: Point;
        /**
         * Second Curve control point.
         * @member cc.math.path.SegmentBezierInitializer#p2
         * @type {cc.math.Point}
         */
        p2: Point;
        /**
         * last curve point.
         * @member cc.math.path.SegmentBezierInitializer#p2
         * @type {cc.math.Point}
         */
        p3: Point;
    }
    /**
     * @class cc.math.path.SegmentBezier
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This Object is a Cubic Bezier Segment.
     * <p>
     *     It is composed of two points and a two tension control points. Internally, the Segment can cache its contour.
     * <p>
     *     The contour can be of two different types:
     *     + directly traced over the curve. Leaves points at different distances on the curve.
     *     + equi-distant on the curve. Internally traces the points as in the other type, but then creates a polyline
     *       path with the points, and samples the resulting path at regular intervals. This transforms the curve into
     *       a polyline, which is faster for most calculations, but could not be as smooth as the other type.
     * <p>
     * By default, the curve is calculated with the first type, directly tracing on the curve
     *
     */
    class SegmentBezier implements Segment {
        /**
         * Start Cubic curve point.
         * @member cc.math.path.SegmentBezier#_p0
         * @type {cc.math.Vector}
         * @private
         */
        _p0: Vector;
        /**
         * First Cubic curve control point.
         * @member cc.math.path.SegmentBezier#_cp0
         * @type {cc.math.Vector}
         * @private
         */
        _cp0: Vector;
        /**
         * Second Cubic curve control point.
         * @member cc.math.path.SegmentBezier#_cp1
         * @type {cc.math.Vector}
         * @private
         */
        _cp1: Vector;
        /**
         * End Cubic curve point.
         * @member cc.math.path.SegmentBezier#_p1
         * @type {cc.math.Vector}
         * @private
         */
        _p1: Vector;
        /**
         * Internal flag for cache validity.
         * @member cc.math.path.SegmentBezier#_dirty
         * @type {boolean}
         * @private
         */
        _dirty: boolean;
        /**
         * Parent segment.
         * @member cc.math.path.SegmentBezier#_parent
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent: ContainerSegment;
        /**
         * Segment length. It is approximately calculated by subdividing the curve.
         * @member cc.math.path.SegmentBezier#_length
         * @type {number}
         * @private
         */
        _length: number;
        /**
         * Create a new Cubic Segment instance.
         * @param data {cc.math.path.SegmentBezierInitializer=}
         */
        constructor(data?: SegmentBezierInitializer);
        /**
         * Initialize the Segment with the supplied points.
         * @param p0 {cc.math.Point} start curve point.
         * @param p1 {cc.math.Point} first curve control point.
         * @param p2 {cc.math.Point} second curve control point.
         * @param p3 {cc.math.Point} end curve point}
         */
        initialize(p0: Point, p1: Point, p2: Point, p3: Point): void;
        __calculateLength(): void;
        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentBezier#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent(): ContainerSegment;
        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentBezier#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent(s: ContainerSegment): void;
        /**
         * Get the Segment length.
         * @override
         * @method cc.math.path.SegmentBezier#getLength
         * @returns {number}
         */
        getLength(): number;
        /**
         * Sample some points on the segment. It will return either the sampled contour, or the flattened version of it.
         * It returns the points that conform the Segment contour, if they are changed, the contour will be changed as well.
         * @method cc.math.path.SegmentBezier#trace
         * @param numPoints {number=} number of points traced on the segment.
         * @param dstArray {Array<cc.math.Vector>=} array where to add the traced points.
         * @returns {Array<Vector>} returns the supplied array of points, or a new array of points if not set.
         */
        trace(dstArray?: Array<Vector>, numPoints?: number): Vector[];
        /**
         * Get a point on the Segment at the given proportional position.
         * + If the segment is flattened, the value will be calculated from the internally cached curve contour.
         * + If not, if will be calculated by solving the curve.
         * The first is faster, but could be inaccurate for curves with a los number of flattened cached points.
         * For this kind of segment, the first method is way faster.
         * @param normalizedPos {number} value in the range 0..1
         * @param out {cc.math.Vector=} optional out point. if not set, an internal spare point will be used.
         * @returns {cc.math.Vector} a point on the segment at the given position. This point should be copied,
         * successive calls to getValue will return the same point instance.
         */
        getValueAt(normalizedPos: number, out?: Vector): Vector;
        /**
         * Solve a Bezier for the given t.
         * @method cc.math.path.SegmentBezier.solve
         * @param v0 {number} point 0
         * @param vc0 {number} control point 0
         * @param cv1 {number} control point 1
         * @param v1 {number} point 1
         * @param t {number} normalized 0..1 value.
         * @param t2 {number} square normalized 0..1 value.
         * @param t3 {number} cubic normalized 0..1 value.
         * @returns {number}
         */
        static solve(v0: number, vc0: number, cv1: number, v1: number, t: number, t2: number, t3: number): number;
        /**
         * Get the Segment's starting point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * Get the Segment's ending point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentBezier#clone
         * @returns {cc.math.path.Segment}
         */
        clone(): SegmentBezier;
        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.SegmentBezier#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?: Array<Point>): Array<Point>;
        /**
         * Mark the bezier as dirty. Mark internal polilyne info as invalid.
         * @methodcc.math.path.SegmentBezier#setDirty
         */
        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(d: boolean): void;
        paint(ctx: cc.render.RenderingContext): void;
    }
}
/**
 * Created by ibon on 11/23/14.
 */
declare module cc.math.path {
    import Vector = cc.math.Vector;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;
    /**
     * @class cc.math.path.SegmentArcInitializer
     * @interface
     * @classdesc
     */
    interface SegmentArcInitializer {
        x: number;
        y: number;
        radius: number;
        startAngle: number;
        endAngle: number;
        ccw: boolean;
    }
    /**
     * @class cc.math.path.SegmentArc
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This Segment represents a circle's arc.
     * The arc is defined by a position, a radius and two angles. It also specified how the angles should be traversed
     * clock or counter clock wisely.
     * The arc will be the minimum angle between the start and end angles.
     *
     */
    class SegmentArc implements Segment {
        /**
         * Parent Segment. An instance of <code>ContainerSegment</code>
         * @member cc.math.path.SegmentLine
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent: ContainerSegment;
        /**
         * Arc center x position.
         * @member cc.math.path.SegmentArc#_x
         * @type {number}
         * @private
         */
        _x: number;
        /**
         * Arc center y position.
         * @member cc.math.path.SegmentArc#_y
         * @type {number}
         * @private
         */
        _y: number;
        /**
         * Arc radius.
         * @member cc.math.path.SegmentArc#_radius
         * @type {number}
         * @private
         */
        _radius: number;
        /**
         * Arc starting angle.
         * @member cc.math.path.SegmentArc#_startAngle
         * @type {number}
         * @private
         */
        _startAngle: number;
        /**
         * Arc ending angle.
         * @member cc.math.path.SegmentArc#_endAngle
         * @type {number}
         * @private
         */
        _endAngle: number;
        _dirty: boolean;
        /**
         * Arc traversal direction. If true counter clockwise, clockwise otherwise.
         * For example, an arc with startAngle=0 and endAngle=Math.PI/3, if ccw is false will be a PI/3 arc, and a
         * 2PI-PI/3 arc if it is true.
         * @member cc.math.path.SegmentArc#_ccw
         * @type {number}
         * @private
         */
        _ccw: boolean;
        /**
         * Cached arc starting point.
         * @member cc.math.path.SegmentArc#_startingPoint
         * @type {cc.math.Vector}
         * @private
         */
        _startingPoint: Vector;
        /**
         * Cached arc ending point.
         * @member cc.math.path.SegmentArc#_endingPoint
         * @type {cc.math.Vector}
         * @private
         */
        _endingPoint: Vector;
        /**
         * Cached Segment length value.
         * @member cc.math.path.SegmentArc#_length
         * @type {number}
         * @private
         */
        _length: number;
        /**
         * Build a new SegmentArc instance.
         * @method cc.math.path.SegmentArc#constructor
         * @param data {cc.math.path.SegmentArcInitializer=} optional arc initialization data.
         */
        constructor(data?: SegmentArcInitializer);
        /**
         * Initialize the Arc Segment with data.
         * @method cc.math.path.SegmentArc#initialize
         * @param data {cc.math.path.SegmentArcInitializer}
         */
        initialize(data: SegmentArcInitializer): void;
        __calculateLength(): void;
        /**
         * Return the Segment's starting point reference. It is the stored one, not a copy.
         * @method cc.math.path.SegmentArc#getStartingPoint
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * Return the Segment's ending point reference. It is the stored one, not a copy.
         * @method cc.math.path.SegmentArc#getEndingPoint
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        /**
         * Get the Segment's arc length.
         * @method cc.math.path.SegmentArc#getLength
         * @returns {number}
         */
        getLength(): number;
        /**
         * Get a Point in the Arc.
         * @method cc.math.path.SegmentArc#getValueAt
         * @param v {number} Position in path. 0= startingPoint, 1= endingPoint
         * @param out {cc.math.Vector=} an optional out Point. If not set, an internal spare point will be returned.
         * @returns {cc.math.Vector}
         */
        getValueAt(v: number, out?: Vector): Vector;
        /**
         * Sample some points in the Segment.
         * @method cc.math.path.SegmentArc#trace
         * @param numPoints {number=} Number of points. if not set, cc.math.path.DEFAULT_TRACE_LENGTH points will be traced.
         * @param dstArray {Array<cc.math.Vector>=} optional output array of points. If not set, a new one will be created.
         * @returns {Array<Vector>} An array where the traced points have been added.
         */
        trace(dstArray?: Array<Vector>, numPoints?: number): Vector[];
        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentArc#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent(): ContainerSegment;
        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentArc#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent(s: ContainerSegment): void;
        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentArc#clone
         * @returns {cc.math.path.Segment}
         */
        clone(): SegmentArc;
        /**
         * Add the Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * Arc segments have no control points.
         * @method cc.math.path.SegmentArc#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?: Array<Point>): Array<Point>;
        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(d: boolean): void;
        paint(ctx: cc.render.RenderingContext): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.math.path {
    import Vector = cc.math.Vector;
    import Point = cc.math.Point;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;
    /**
     * @class cc.math.path.SegmentCardinalSplineInitializer
     * @interface
     * @classdesc
     *
     * A cardinal spline is composed of a collection of points to interpolate and a tension parameter.
     * The curve implementation will duplicate some of the points.
     *
     */
    interface SegmentCardinalSplineInitializer {
        /**
         * First curve point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p0
         * @type {cc.math.Point}
         */
        p0: Point;
        /**
         * First Curve control point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p1
         * @type {cc.math.Point}
         */
        cp0: Point;
        /**
         * Second Curve control point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p2
         * @type {cc.math.Point}
         */
        cp1: Point;
        /**
         * last curve point.
         * @member cc.math.path.SegmentCardinalSplineInitializer#p2
         * @type {cc.math.Point}
         */
        p1: Point;
        /**
         * curve tension.
         * @member cc.math.path.SegmentCardinalSplineInitializer#tension
         */
        tension?: number;
    }
    /**
     * @class cc.math.path.SegmentCardinalSpline
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This Object is a Quadratic Bezier Segment.
     * <p>
     *     It is composed of two points and a tension control point. Internally, the Segment can cache its contour.
     * <p>
     *     The contour can be of two different types:
     *     + directly traced over the curve. Leaves points at different distances on the curve.
     *     + equi-distant on the curve. Internally traces the points as in the other type, but then creates a polyline
     *       path with the points, and samples the resulting path at regular intervals. This transforms the curve into
     *       a polyline, which is faster for most calculations, but could not be as smooth as the other type.
     * <p>
     * By default, the curve is calculated with the first type, directly tracing on the curve
     *
     */
    class SegmentCardinalSpline implements Segment {
        /**
         * Start Cubic curve point.
         * @member cc.math.path.SegmentCardinalSpline#_p0
         * @type {cc.math.Vector}
         * @private
         */
        _p0: Vector;
        /**
         * First Cubic curve control point.
         * @member cc.math.path.SegmentCardinalSpline#_cp0
         * @type {cc.math.Vector}
         * @private
         */
        _cp0: Vector;
        /**
         * Second Cubic curve control point.
         * @member cc.math.path.SegmentCardinalSpline#_cp1
         * @type {cc.math.Vector}
         * @private
         */
        _cp1: Vector;
        /**
         * End Cubic curve point.
         * @member cc.math.path.SegmentCardinalSpline#_p1
         * @type {cc.math.Vector}
         * @private
         */
        _p1: Vector;
        _tension: number;
        /**
         * Internal flag for cache validity.
         * @member cc.math.path.SegmentCardinalSpline#_dirty
         * @type {boolean}
         * @private
         */
        _dirty: boolean;
        /**
         * Parent segment.
         * @member cc.math.path.SegmentCardinalSpline#_parent
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent: ContainerSegment;
        /**
         * Segment length. It is approximately calculated by subdividing the curve.
         * @member cc.math.path.SegmentCardinalSpline#_length
         * @type {number}
         * @private
         */
        _length: number;
        /**
         * Whether the Quadratic is internally treated as a polyline.
         * @member cc.math.path.SegmentCardinalSpline#_flattened
         * @type {boolean}
         * @private
         */
        _flattened: boolean;
        /**
         * A cache of points on the curve. This is approximation with which the length is calculated.
         * @member cc.math.path.SegmentCardinalSpline#_cachedContourPoints
         * @type {Array<cc.math.Vector>}
         * @private
         */
        _cachedContourPoints: Vector[];
        /**
         * Create a new Quadratic Segment instance.
         * @param data {cc.math.path.SegmentCardinalSplineInitializer=}
         */
        constructor(data?: SegmentCardinalSplineInitializer);
        /**
         * Initialize the Segment with the supplied points.
         * @param p0 {cc.math.Point}
         * @param cp0 {cc.math.Point}
         * @param cp1 {cc.math.Point}
         * @param p1 {cc.math.Point}
         * @param tension {number}
         */
        initialize(p0: Point, cp0: Point, cp1: Point, p1: Point, tension: number): void;
        /**
         * Set Segment tension. By default it is 0.5
         * Setting a different tension will mark the segment as dirty, nulling all internal caches.
         * @param t {number}
         */
        setTension(t: number): void;
        __calculateLength(): void;
        /**
         * Get the Segment's parent Segment.
         * @method cc.math.path.SegmentCardinalSpline#getParent
         * @returns {cc.math.path.Segment}
         */
        getParent(): ContainerSegment;
        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.SegmentCardinalSpline#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent(s: ContainerSegment): void;
        /**
         * Get the Segment length.
         * @override
         * @method cc.math.path.SegmentCardinalSpline#getLength
         * @returns {number}
         */
        getLength(): number;
        /**
         * Sample some points on the segment. It will return either the sampled contour, or the flattened version of it.
         * It returns the points that conform the Segment contour, if they are changed, the contour will be changed as well.
         * @method cc.math.path.SegmentCardinalSpline#trace
         * @param numPoints {number=} number of points traced on the segment.
         * @param dstArray {Array<cc.math.Vector>=} array where to add the traced points.
         * @returns {Array<Vector>} returns the supplied array of points, or a new array of points if not set.
         */
        trace(dstArray?: Array<Vector>, numPoints?: number): Vector[];
        /**
         * Get a point on the Segment at the given proportional position.
         * + If the segment is flattened, the value will be calculated from the internally cached curve contour.
         * + If not, if will be calculated by solving the curve.
         * The first is faster, but could be inaccurate for curves with a los number of flattened cached points.
         * @param normalizedPos {number} value in the range 0..1
         * @param out {cc.math.Vector=} optional out point. if not set, an internal spare point will be used.
         * @returns {cc.math.Vector} a point on the segment at the given position. This point should be copied,
         * successive calls to getValue will return the same point instance.
         */
        getValueAt(normalizedPos: number, out?: Vector): Vector;
        /**
         * Get the Segment's starting point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * Get the Segment's ending point.
         * It returns the original starting Point reference, not a copy of it.
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        /**
         * Make a clone of the segment.
         * @method cc.math.path.SegmentCardinalSpline#clone
         * @returns {cc.math.path.Segment}
         */
        clone(): SegmentCardinalSpline;
        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.SegmentCardinalSpline#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?: Array<Point>): Array<Point>;
        /**
         * Mark the quadratic as dirty. Mark internal polilyne info as invalid.
         * @methodcc.math.path.SegmentCardinalSpline#setDirty
         */
        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(d: boolean): void;
        paint(ctx: cc.render.RenderingContext): void;
    }
}
/**
 * Created by ibon on 11/22/14.
 */
declare module cc.math.path {
    import Segment = cc.math.path.Segment;
    /**
     * @class cc.math.path.ContainerSegment
     * @implements cc.math.path.Segment
     * @classdesc
     *
     * This object is the base for all Container segments. Container Segments are Path and SubPath, that is, Segments
     * that are build of a collection of Segment objects.
     *
     */
    class ContainerSegment implements Segment {
        /**
         * Parent Segment. An instance of <code>ContainerSegment</code>
         * @member cc.math.path.SegmentLine
         * @type {cc.math.path.Segment}
         * @private
         */
        _parent: ContainerSegment;
        /**
         * The path length
         * @member cc.math.path.ContainerSegment#_length
         * @type {number}
         * @private
         */
        _length: number;
        /**
         * The path segments. Any of the segments can be another path.
         * @member cc.math.path.ContainerSegment#_segments
         * @type {Array<cc.math.path.ContainerSegment.Segment>}
         * @private
         */
        _segments: Segment[];
        /**
         * Mark this ContainerSegment as dirty.
         * Dirty means length must be recalculated.
         * @member cc.math.path.ContainerSegment#_dirty
         * @type {boolean}
         * @private
         */
        _dirty: boolean;
        constructor();
        /**
         * Get ContainerSegment's all segments lengths.
         * @returns {number}
         */
        getLength(): number;
        __calculateLength(): number;
        /**
         * Get a Point on the ContainerSegment at a position proportional to normalizedPos.
         * If there's no Point in the path for the normalized position, the result of calling
         * <code>getStartingPoint</code> or <code>getEndingPoint</code> is returned.
         * This is consistent since a value for normalizedPos of 1 means end
         * of the path and a value of 0 the start of it.
         * @param normalizedPos {number} Normalized value between 0..1
         * @param out {cc.math.Vector=} out point. if not set, an internal spare point value will be used.
         * @returns {cc.math.Vector}
         */
        getValueAt(normalizedPos: number, out?: Vector): Vector;
        /**
         * Get sample points on the ContainerSegment.
         * @param numPoints {number=} number of points to sample. If not set, ContainerSegment.DEFAULT_TRACE will be used.
         * @param dstArray {Array<cc.math.Vector>=}
         * @returns {Array<cc.math.Vector>} the supplied array or a newly created one with the traced points .
         */
        trace(dstArray?: Array<Vector>, numPoints?: number): Vector[];
        /**
         * @see {cc.math.path.Segment#getStartingPoint}
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * @see {cc.math.path.Segment#getEndingPoint}
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        /**
         * Get the Segment's parent Segment.
         * @returns {cc.math.path.Segment}
         */
        getParent(): ContainerSegment;
        /**
         * Set the Segment's parent Segment.
         * @method cc.math.path.ContainerSegment#setParent
         * @param s {cc.math.path.Segment}
         */
        setParent(s: ContainerSegment): void;
        /**
         * Make a clone of the segment. It will clone all contained segments.
         * ContainerSegments are not allowed to exist by themselves except in the form of Path or SubPath, so cloning
         * one of them will throw an error.
         * @method cc.math.path.ContainerSegment#clone
         * @returns {cc.math.path.Segment}
         */
        clone(): ContainerSegment;
        /**
         * Add this Segment control points to the array.
         * If the array is not set, a new one will be created.
         * The actual Segment points are added, so modifying them means modifying the path.
         * @method cc.math.path.ContainerSegment#getControlPoints
         * @param arr {Array<cc.math.Vector>}
         * @returns {Array<cc.math.Vector>}
         */
        getControlPoints(arr?: Array<Point>): Array<Point>;
        /**
         * Mark a Segment and all its SubSegments are dirty whatever that means.
         * @methodcc.math.path.ContainerSegment#setDirty
         */
        /**
         * Mark the Segment dirty.
         * No action for Arcs.
         * @method cc.math.path.ContainerSegment#setDirty
         */
        setDirty(b: boolean): void;
        paint(ctx: cc.render.RenderingContext): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.math.path {
    import Vector = cc.math.Vector;
    import Segment = cc.math.path.Segment;
    import ContainerSegment = cc.math.path.ContainerSegment;
    /**
     * @class cc.math.path.SubPath
     * @extends cc.math.path.ContainerSegment
     * @classdesc
     *
     * A Subpath is an open or closed Collection of chained Segments.
     * A Segment will share its starting Point with the previous Segment's
     * last Point (or the initial movedTo point) and the final Point with the next Segment's starting Point.
     *
     * A SubPath is considered empty when it has no segments.
     * The length of the SubPath will be the lengths of all its Segments.
     * The results from a call to <code>getValueAt</code> will be proportional to all the Segments it contains.
     * The result from a call to <code>trace</code> will be points proportional to all the Segments it contains.
     * The result from a call to <code>getStartingPoint</code> will be the starting point of the first segment.
     *
     * A SubPath can be closed. When it is in this state, no new Segments can be added to it.
     *
     */
    class SubPath extends ContainerSegment {
        /**
         * Path current tracing point. When adding segments to the path, this is the reference point.
         * @member cc.math.path.SubPath#_currentPoint
         * @type {cc.math.Vector}
         * @private
         */
        _currentPoint: Vector;
        /**
         * Is the path closed ? If so, more path tracing operations will require to build anothe SubPath.
         * @member cc.math.path.SubPath#_closed
         * @type {boolean}
         * @private
         */
        _closed: boolean;
        /**
         * Build a new SubPath instance.
         * @method cc.math.path.SubPath#constructor
         */
        constructor();
        /**
         * Whether the SubPath is closed.
         * @returns {boolean}
         */
        isClosed(): boolean;
        /**
         * Test whether the SubPath is empty, that is, tracing info has not been set yet.
         * @returns {boolean}
         */
        isEmpty(): boolean;
        /**
         * Number of Segments contained in this SubPath.
         * If a Segment is actually another Path, it will count 1 segment.
         * @returns {number}
         */
        numSegments(): number;
        /**
         * Add a Segment to the SubPath and set the Segment's parent as the SubPath.
         * @param s {cc.math.path.Segment}
         */
        addSegment(s: Segment): void;
        /**
         * Clear all sub-path data, and revert to the original path object status.
         * Make sure this path is not another's path segment.
         *
         * @method cc.math.path.SubPath#beginPath
         */
        beginPath(): SubPath;
        /**
         * Move the current path tracer to a position.
         *
         * @method cc.math.path.SubPath#moveTo
         * @param x {number}
         * @param y {number}
         */
        moveTo(x: number, y: number): SubPath;
        /**
         * Add a line to the current path.
         * If the current path is not initialized, in will be initialized from 0,0 and a line added.
         *
         * @method cc.math.path.SubPath#lineTo
         * @param x {number}
         * @param y {number}
         */
        lineTo(x: number, y: number): SubPath;
        /**
         * Add an arc to the SubPath.
         * An arc is defined by a position, a radius, an start and an end angle and how to traverse from the start to
         * the end angle, eg clock or counter clock wisely.
         * The arc will be the minimum angle between start and end angles.
         * Though not strictly necessary, this method expects the difference between startAngle and endAngle
         * to be <= 2*Math.PI
         * @see {cc.math.path.SegmentArc}
         * @method cc.math.path.SubPath#arc
         * @param x {number}
         * @param y {number}
         * @param radius {number}
         * @param startAngle {number} radians
         * @param endAngle {number} radians
         * @param anticlockwise
         * @param addLineTo {boolean} When adding an arc to a Path, if any SubPath is present a line must be added
         *  to the current SubPath. If true add a line from the current SubPath point to the starting point on the arc.
         * @returns {cc.math.path.SubPath}
         */
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean, addLineTo?: boolean): SubPath;
        /**
         * Close the SubPath.
         * If the SubPath was already closed, in DEBUG mode will show a console message. In either case, nothing happens.
         * If the SubPath is empty
         * @returns {cc.math.path.SubPath}
         */
        closePath(): SubPath;
        /**
         * Get the SubPath's starting point.
         * It will return the original SubPath starting point, not a copy of it.
         * If this SubPath is empty (no points) an error is thrown if in DEBUG mode.
         * @returns {cc.math.Vector}
         */
        getStartingPoint(): Vector;
        /**
         * Get the SubPath's ending point.
         * It will return the original SubPath ending point, not a copy of it.
         * If this SubPath is empty (no points) an error is thrown if in DEBUG mode.
         * @returns {cc.math.Vector}
         */
        getEndingPoint(): Vector;
        clone(): SubPath;
        quadraticTo(x0: number, y0: number, x1: number, y1: number): SubPath;
        bezierTo(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): SubPath;
        catmullRomTo(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, tension: number): SubPath;
        paint(ctx: cc.render.RenderingContext): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.math {
    import SubPath = cc.math.path.SubPath;
    import ContainerSegment = cc.math.path.ContainerSegment;
    import Vector = cc.math.Vector;
    /**
     *
     * @class cc.math.Path
     * @extends cc.math.path.ContainerSegment
     * @classdesc
     *
     * This class represents a Path Object.
     * By definition a Path is a collection of Segment objects. These segments are SubPath objects or other Paths.
     * Polimorphically a Path is a Segment itself, so complete paths can be added to another SubPath or Path as a Segment.
     *
     * A path has tracing capabilities. It differentiates from a SubPath in a few aspects:
     *  + a Path may have a cache of the stroke it represents.
     *  + a Path may have a cache of the fill it represents.
     *  + when tracing a Path, the Segments added are transformed by a transformation matrix.
     *  + a path represents an aggregation of Subpaths (contours)
     */
    class Path extends ContainerSegment {
        /**
         * Path current sub path to add segments to. Initially, the current sub-path is the path itself.
         * As new sub-paths are created, _currentSubPath will point to that last sub-path.
         * @member cc.math.Path#_currentSubPath
         * @type {null}
         * @private
         */
        _currentSubPath: SubPath;
        /**
         * Build a new Path instance.
         * @method cc.math.Path#constructor
         */
        constructor();
        /**
         * Get the Path's number of SubPaths.
         * @returns {number}
         */
        numSubPaths(): number;
        __newSubPath(): void;
        /**
         * Test whether this Path is empty, ie has no sub paths.
         * @returns {boolean}
         */
        isEmpty(): boolean;
        /**
         *
         * Make sure the path has a valid sub-path to trace segments on.
         *
         * If the Path has no current sub-path,
         *   a new sub-path is created and its tracer initialized to 0,0.
         * else
         *   if the current sub-path is closed
         *     a new sub-path is created and its tracer initialized to the current sub-path tracer position
         *   endif
         * endif
         *
         * @param x {number=}
         * @param y {number=}
         * @private
         */
        __ensureSubPath(x?: number, y?: number): void;
        __chainSubPathIfCurrentIsClosed(): void;
        /**
         * Get the Path current position for tracing.
         * This point corresponds to the tracing position of the current SubPath.
         * @returns {cc.math.Point}
         */
        getCurrentTracePosition(): Point;
        /**
         * Get the Path starting point.
         * It corresponds to the starting point of the first segment it contains, regardless of its type.
         * If there's no current SubPath, an empty Point (0,0) is returned.
         * @returns {*}
         */
        getStartingPoint(): Vector;
        /**
         * Get the Path ending point.
         * It corresponds to the ending point of the last segment it contains, regardless of its type.
         * If there's no current SubPath, an empty Point (0,0) is returned.
         * @returns {*}
         */
        getEndingPoint(): Vector;
        /**
         * Create a poli-line path from a set of Points.
         * If no points, or an empty array is passed, no Path is built and returns null.
         * @param points {Array<cc.math.Vector>}
         * @returns {cc.math.Path} Newly created path or null if the path can't be created.
         * @static
         */
        static createFromPoints(points: Vector[]): Path;
        /**
         * Clear all sub-path data, and revert to the original path object status.
         * Make sure this path is not another's path segment.
         *
         * @method cc.math.Path#beginPath
         */
        beginPath(): Path;
        quadraticTo(x1: number, y1: number, x2: number, y2: number, matrix?: Float32Array): Path;
        bezierTo(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, matrix?: Float32Array): Path;
        catmullRomTo(points: Point[], closed: boolean, tension: number, matrix?: Float32Array): Path;
        catmullRomTo(cp0x: number, cp0y: number, cp1x: number, cp1y: number, p1x: number, p1y: number, tension: number, matrix?: Float32Array): Path;
        /**
         * Add a catmull rom (cardinal spline
         * @param cp0x {number}
         * @param cp0y {number}
         * @param cp1x {number}
         * @param cp1y {number}
         * @param p1x {number}
         * @param p1y {number}
         * @param matrix {Float32Array}
         */
        __catmullRomTo(cp0x: number, cp0y: number, cp1x: number, cp1y: number, p1x: number, p1y: number, tension: number, matrix?: Float32Array): void;
        /**
         * Close the current SubPath.
         *
         * @returns {cc.math.Path}
         */
        closePath(): Path;
        /**
         * Move the current path tracer to a position.
         * If the current sub-path is not started,
         *   set this point as the sub-path start point.
         * else
         *   if there are segments,
         *      create a new sub-path
         *   else
         *      set sub-path starting point to the new location
         * endif
         *
         * @method cc.math.Path#moveTo
         * @param x {number}
         * @param y {number}
         * @param matrix {cc.math.Float32Array=}
         */
        moveTo(x: number, y: number, matrix?: Float32Array): Path;
        /**
         * Add a line to the current path.
         * If there's no current SubPath,
         * If the current path is not initialized, in will be initialized from 0,0 and a line added.
         *
         * @method cc.math.Path#lineTo
         * @param x {number}
         * @param y {number}
         * @param matrix {Float32Array=}
         */
        lineTo(x: number, y: number, matrix?: Float32Array): Path;
        /**
         * Create a rect as a new SubPath. The rect has 4 segments which conform the rect.
         * It also created a new SubPath movedTo (x,y).
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @param matrix {Float32Array=} transformation matrix.
         * @returns {cc.math.Path}
         */
        rect(x: number, y: number, w: number, h: number, matrix?: Float32Array): Path;
        /**
         * Create an arc segment and add it to the current SubPath.
         * If a SubPath exists, a straight line to (x,y) is added.
         * if the angle difference is > 2PI the angle will be clampled to 2PI. The angle difference will be
         * endAngle - startAngle if anticlockwise is false, and startAngle - endAngle otherwise.
         * In this implementation if the radius is < 0, the radius will be set to 0.
         * If the radius is 0 or the diffangle is 0, no arc is added.
         *
         * @param x {number}
         * @param y {number}
         * @param radius {number}
         * @param startAngle {number}
         * @param endAngle {number}
         * @param anticlockwise {boolean} arc draw direction
         * @param matrix {Float32Array}
         */
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean, matrix?: Float32Array): Path;
        clone(): Path;
        paint(ctx: cc.render.RenderingContext): void;
        getStrokeGeometry(): number[];
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.node {
    var DEFAULT_ANCHOR_POSITION: Vector;
    var DEFAULT_ANCHOR_TRANSFORMATION: Vector;
    import Vector = cc.math.Vector;
    import Point = cc.math.Point;
    import Rectangle = cc.math.Rectangle;
    import Dimension = cc.math.Dimension;
    import Color = cc.math.Color;
    import Action = cc.action.Action;
    import Scene = cc.node.Scene;
    import RenderingContext = cc.render.RenderingContext;
    import SchedulerQueueTask = cc.action.SchedulerQueueTask;
    import SchedulerTaskCallback = cc.action.SchedulerTaskCallback;
    /**
     * Node flag values.
     * Instead of managing several boolean properties they are grouped in a number value.
     * @tsenum cc.node.NodeDirtyFlags
     */
    enum NodeDirtyFlags {
        NONE = 0,
        CHILDREN_SORT = 1,
        TRANSFORMATION_DIRTY = 2,
        REQUEST_TRANSFORM = 4,
        VISIBLE = 8,
        INVERSE_MATRIX = 16,
        PAUSED = 32,
        EVENTS_ENABLED = 64,
        EVENTS_PRIORITY_ENABLED = 128,
        COMPOSITE_ON = 256,
        GLOBAL_ALPHA = 512,
        AABB_DIRTY = 1024,
    }
    /**
     * Callback interface for node's that math an enumeration pattern.
     * @memberOf cc.node
     * @callback EnumerateCallback
     * @param node {Node} This callback will be called for each Node that matches the pattern.
     * @see {cc.node.Node#enumerateChildren}
     */
    interface EnumerateCallback {
        (node: Node): void;
    }
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
    class Node {
        /**
         * Hierarchy dependent nodes.
         * @member cc.node.Node#_children
         * @type {Array<cc.node.Node>}
         * @private
         */
        _children: Array<Node>;
        /**
         * This node's parent node.
         * <br>
         * Don't set directly.
         * @member cc.node.Node#_parent
         * @type {cc.node.Node}
         * @private
         */
        _parent: Node;
        /**
         * This node's position.
         * @member cc.node.Node#_position
         * @type {cc.math.Vector}
         * @private
         */
        _position: Vector;
        /**
         * Node's position anchor.
         * The anchor is normalized, meaning 1 to be node's width or height.
         * @member cc.node.Node#_positionAnchor
         * @type {cc.math.Vector}
         * @private
         */
        _positionAnchor: Vector;
        /**
         * Node's rotation angles for x and y.
         * @member cc.node.Node#_rotation
         * @type {cc.math.Vector}
         * @private
         */
        _rotation: Vector;
        /**
         * Node's scale coeficients.
         * @member cc.node.Node#_scale
         * @type {cc.math.Vector}
         * @private
         */
        _scale: Vector;
        /**
         * Node's skew values.
         * @member cc.node.Node#_skew
         * @type {cc.math.Vector}
         * @private
         */
        /**
         * Node's transformation anchor. Scale and rotation will be around this anchor value.
         * @member cc.node.Node#_transformationAnchor
         * @type {cc.math.Vector}
         * @private
         */
        _transformationAnchor: Vector;
        /**
         * Node's local transformation matrix.
         * @member cc.node.Node#_modelViewMatrix
         * @type {Float32Array}
         * @private
         */
        _modelViewMatrix: Float32Array;
        /**
         * Node's global transformation matrix.
         * @member cc.node.Node#_worldModelViewMatrix
         * @type {Float32Array}
         * @private
         */
        _worldModelViewMatrix: Float32Array;
        /**
         * Node's inverse global transformation matrix.
         * @member cc.node.Node#_worldModelViewMatrixI
         * @type {Float32Array}
         * @private
         */
        _worldModelViewMatrixI: Float32Array;
        /**
         * Node's color. This color, when drawing images, will be set as tint color.
         * Tinting will only be enabled in webgl renderers though.
         * @member cc.node.Node#_color
         * @type {cc.math.Color}
         * @private
         */
        _color: Color;
        /**
         * opacity value. full opaque by default. opacity values go from 0 full transparent to 1 full opaque.
         * @member cc.node.Node#_alpha
         * @type {number}
         * @private
         */
        _alpha: number;
        /**
         * Compound parent cascade alpha value.
         * @member cc.node.Node#_frameAlpha
         * @type {number}
         * @private
         */
        _frameAlpha: number;
        /**
         * Node's dimension.
         * @member cc.node.Node#_contentSize
         * @type {cc.math.Vector}
         * @private
         */
        _contentSize: Dimension;
        /**
         * Node's z-index values.
         * Nodes with a less than zero z-index will be drawn first, then its parent, and then nodes with a greater or
         * equal than zero z-index value.
         * @member cc.node.Node#_localZOrder
         * @type {number}
         * @private
         */
        _localZOrder: number;
        /**
         * Node's order of arrival to the parent node.
         * When sorting a node's children, first, the z-index is taken into account. But nodes with the same z-index
         * will then be sorted by the order of arrival.
         * The order of arrival is by default set incrementally, but the developer has the option to modify it anytime.
         * @member cc.node.Node#_orderOfArrival
         * @type {number}
         * @private
         */
        _orderOfArrival: number;
        /**
         * internal flag that indicates if the node is rotated (false) or not (true).
         * @member cc.node.Node#_isAA
         * @type {boolean}
         * @private
         */
        _isAA: boolean;
        /**
         * Axis aligned bounding box.
         * @member cc.node.Node#_AABB
         * @type {cc.math.Rectangle}
         * @private
         */
        _AABB: Rectangle;
        /**
         * Bounding Box. May overlap _AABB
         * @member cc.node.Node#_BBVertices
         * @type {Array<cc.math.Vector>}
         * @private
         */
        _BBVertices: Array<Point>;
        /**
         * Node tag. Only for backwards compatibility.
         * @member cc.node.Node#_tag
         * @type {any}
         * @private
         * @deprecated
         */
        _tag: any;
        /**
         * Node name.
         * @member cc.node.Node#_name
         * @type {string}
         * @private
         */
        _name: string;
        /**
         * Internal integer value with some flags that affect a node.
         * Values for this flags variable are defined in cc.node.NodeDirtyFlags.
         * Never set this value manually.
         * @member cc.node.Node#_flags
         * @type {number}
         * @private
         */
        _flags: number;
        /**
         * Scene this node is running in.
         * @member cc.node.Node#_scene
         * @type {cc.node.Scene}
         * @private
         */
        _scene: Scene;
        /**
         * When no scene is yet set, this array holds Node's actions.
         * @member cc.node.Node#_actionsToSchedule
         * @type {Array<cc.node.Action>}
         * @private
         */
        _actionsToSchedule: Array<Action>;
        /**
         * When no scene is yet set, this array holds Node's scheduled tasks.
         * @member cc.node.Node#_tasksToSchedule
         * @type {Array<cc.node.Action>}
         * @private
         */
        _tasksToSchedule: Array<SchedulerQueueTask>;
        /**
         * Node x position.
         * @member cc.node.Node#x
         * @type {number}
         */
        x: number;
        /**
         * Node y position.
         * @member cc.node.Node#y
         * @type {number}
         */
        y: number;
        /**
         * Node scale X.
         * @member cc.node.Node#scaleX
         * @type {number}
         */
        scaleX: number;
        /**
         * Node scale Y.
         * @member cc.node.Node#scaleY
         * @type {number}
         */
        scaleY: number;
        /**
         * Node rotation angle in degrees.
         * @member cc.node.Node#rotationAngle
         * @type {number}
         */
        rotationAngle: number;
        _compositeOperation: cc.render.CompositeOperation;
        _inputEvents: any;
        /**
         * Create a new Node object.
         * @method cc.node.Node#constructor
         */
        constructor();
        /**
         * Internal flag check for sorting children nodes.
         * @method cc.node.Node#__childrenMustSort
         * @returns {boolean}
         * @private
         */
        __childrenMustSort(): boolean;
        /**
         * Clear a flag. To avoid managing several different boolean members we pack all of them in a number value.
         * Flag values are {@link cc.node.NodeDirtyFlags}
         * @method cc.node.Node#__clearFlag
         * @param f {number} a flag value.
         * @private
         */
        __clearFlag(f: number): void;
        /**
         * Set a flag. To avoid managing several different boolean members we pack all of them in a number value.
         * Flag values are {@link cc.node.NodeDirtyFlags}
         * @method cc.node.Node#__clearFlag
         * @param f {number} a flag value.
         * @private
         */
        __setFlag(f: number): void;
        /**
         * Return whether a flag is set.
         * @method cc.node.Node#__isFlagSet
         * @param f {number}
         * @returns {boolean}
         * @private
         */
        __isFlagSet(f: number): boolean;
        /**
         * Enable or disable a flag.
         * @method cc.node.Node#__setFlagValue
         * @param f {number}
         * @param enable {boolean} true to enable, false to disable.
         * @private
         */
        __setFlagValue(f: number, enable: boolean): void;
        isGlobalAlpha(): boolean;
        setGlobalAlpha(b: boolean): void;
        /**
         * Set the node composite operation (or blending mode).
         * blending modes available are defined in the cc.render.CompositeOperation enumeration.
         * Pass null to disable custom blending mode, and apply the currently set one.
         * @method cc.node.Node.setCompositeOperation
         * @param o {cc.render.CompositeOperation}
         */
        setCompositeOperation(o: cc.render.CompositeOperation): void;
        /**
         * Set this node position in parent's coordinate space.
         * @method cc.node.Node#setPosition
         * @param x {number} x position.
         * @param y {number} y position.
         * @returns {cc.node.Node}
         */
        setPosition(x: number, y: number): Node;
        /**
         * Set this node's rotation angle
         * @method cc.node.Node#setRotation
         * @param x {number} rotation angle in degrees.
         * @returns {cc.node.Node}
         */
        setRotation(x: number): Node;
        /**
         * Set this node's scale.
         * If y parameter is not set, the scale will be the same for both axis.
         * @method cc.node.Node#setScale
         * @param x {number} scale for x axis
         * @param y {number=} optional scale for y axis. If not set, x scale will be set for y axis.
         * @returns {cc.node.Node}
         */
        setScale(x: number, y?: number): Node;
        /**
         * Set the Node X axis scale value.
         * @param s {number} default scale is 1.
         * @returns {cc.node.Node}
         */
        setScaleX(s: number): Node;
        /**
         * Set the Node Y axis scale value.
         * @param s {number} default scale is 1.
         * @returns {cc.node.Node}
         */
        setScaleY(s: number): Node;
        /**
         * Gets node's parent. The parent is another Node. Some specialized node types like <code>Scene</code> and
         * <code>Director</code> don't have a parent.
         * @method cc.node.Node#getParent
         * @returns {Node} value will be null if no parent, and a Node instance otherwise.
         */
        getParent(): Node;
        /**
         * Sets node's parent.
         * <br>
         * Never call directly.
         * @method cc.node.Node#__setParent
         * @param node {cc.node.Node}
         * @returns {cc.node.Node}
         * @private
         */
        __setParent(node: Node): Node;
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
        setPositionAnchor(x: number, y: number): Node;
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
        setAnchorPoint(x: number, y: number): Node;
        /**
         * Set node's transformation anchor.
         * By default the node will be transformed (scale/rotate) by the node's center.
         * @method cc.node.Node#setTransformationAnchor
         * @param x {number}
         * @param y {number}
         * @returns {cc.node.Node}
         */
        setTransformationAnchor(x: number, y: number): Node;
        /**
         * Set this node's tag.
         * @method cc.node.Node#setTag
         * @param t {object}
         * @returns {cc.node.Node}
         */
        setTag(t: any): Node;
        /**
         * Set Node opacity. Opacity is alpha value.
         * backwards compatible method. use setAlpha or alpha get/set.
         * @param v {number} value in the range 0..255
         * @deprecated
         * @returns {cc.node.Node}
         */
        setOpacity(v: number): Node;
        /**
         * Get node's transparency value.
         * Transparency values are from 0 to 1.
         * @name cc.node.Node#get:alpha
         * @returns {number}
         */
        /**
         * Setter for node's alpha (transparency) value.
         * Alpha values are from 0 to 1.
         * @name cc.node.Node#set:alpha
         * @param a {number}
         */
        alpha: number;
        /**
         * Get node's transparency value.
         * Transparency values are from 0 to 1.
         * @name cc.node.Node#get:opacity
         * @returns {number}
         */
        /**
         * Setter for node's alpha (transparency) value.
         * Alpha values are from 0 to 1.
         * @name cc.node.Node#set:opacity
         * @param a {number}
         */
        opacity: number;
        /**
         * Set node's transparency  value.
         * @method cc.node.Node#setAlpha
         * @param a {number} value from 0 to 1.
         * @returns {cc.node.Node}
         */
        setAlpha(a: number): Node;
        /**
         * Get node's transparency value.
         * Transparency values are from 0 to 1.
         * @method cc.node.Node#getAlpha
         * @returns {number}
         */
        getAlpha(): number;
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
        setColor(r: number, g: number, b: number): Node;
        /**
         * Set this node's content size.
         * @method cc.node.Node#setContentSize
         * @param w {number} node width
         * @param h {number} node height
         * @returns {cc.node.Node}
         */
        setContentSize(w: number, h: number): Node;
        /**
         * Set node's local and global transformation matrices.
         * The matrices may not change.
         * <br>
         * Do not call directly
         * @method cc.node.Node#__setTransform
         * @returns {cc.node.Node}
         * @private
         */
        __setTransform(): Node;
        /**
         * Set the Node local transformation matrix as rotation. Slowest method.
         * @method cc.node.Node#__setLocalTransformRotate
         * @private
         */
        __setLocalTransformRotate(): void;
        /**
         * Set the Node local transformation matrix as scale.
         * @method cc.node.Node#__setLocalTransformScale
         * @private
         */
        __setLocalTransformScale(): void;
        /**
         * Set node's local transformation matrix.
         * This method is very specific and calls different code based on the transformation type that has
         * been detected.
         * @method cc.node.Node#__setLocalTransform
         * @private
         */
        __setLocalTransform(): void;
        /**
         * Set node's global transformation when the node is not axis aligned.
         * @method cc.node.Node#__setWorldTransformNotAA
         * @private
         */
        __setWorldTransformNotAA(): void;
        /**
         * Set node's world transformation when the node is Axis Aligned.
         * An axis aligned Node means that the node, and all its ancestors are axis aligned.
         * @method cc.node.Node#__setWorldTransformAA
         * @private
         */
        __setWorldTransformAA(px: number, py: number): void;
        /**
         * Calculate node's global transformation matrix.
         * @method cc.node.Node#__setWorldTransform
         * @private
         */
        __setWorldTransform(): void;
        getInverseWorldModelViewMatrix(): Float32Array;
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
        visit(ctx: RenderingContext): void;
        __setAlphaImpl(): void;
        /**
         * Calculate if a node is in screen bounds.
         * @param ctx {cc.render.RenderingContext}
         * @method cc.node.Node#__AABBIntersectsScreen
         * @returns {boolean} the node is in screen or not.
         * @private
         */
        __AABBIntersectsScreen(ctx: RenderingContext): boolean;
        /**
         * Calculate a node's Bounding box when the node is not axis aligned.
         * @method cc.node.Node#__calculateNAABBVertices
         * @private
         */
        __calculateNAABBVertices(): void;
        /**
         * Calculate a node's bounding box when the node is axis aligned.
         * @method cc.node.Node#__calculateAABBVertices
         * @private
         */
        __calculateAABBVertices(): void;
        /**
         * Calculate a node's bounding box.
         * @method cc.node.Node#__calculateBoundingBox
         * @returns {cc.node.Node}
         * @private
         */
        calculateBoundingBox(): Rectangle;
        /**
         * Convert a coordinate to world (screen) space.
         * @method cc.node.Node#convertToWorldSpace
         * @param p {Vector}
         */
        convertToWorldSpace(p: Point): void;
        /**
         * Draw a node.
         * @method cc.node.Node#__draw
         * @param ctx {cc.render.RenderingContext}
         * @private
         */
        __draw(ctx: RenderingContext): void;
        /**
         * Get the node scene reference.
         * Each node belongs to an scene, which is held in this variable. Scenes have scheduling capabilities
         * and director references.
         * @method cc.node.Node#getScene
         * @returns {cc.node.Scene}
         */
        getScene(): Scene;
        /**
         * Get the path of nodes to the top node, normally a <code>cc.node.Director</node> object.
         * @method cc.node.Node#getPathToRoot
         * @returns {Array<cc.node.Node>}
         */
        getPathToRoot(): Node[];
        /**
         * Get the path of nodes to the cc.node.Scene containing this Node.
         * This method is called by <code>cc.node.Node#enableEventsForNode</code> because
         * the input manager captures input based on a Scene.
         * @method cc.node.Node#getPathToScene
         * @returns {Array<cc.node.Node>}
         */
        getPathToScene(): Node[];
        /**
         * Register a callback for an event type.
         * @method cc.node.Node#addEventListener
         * @param event {string} event name: mouseup, mousedown, mousemove, mousedrag, mouseover, mouseout, doubleclick
         * @param callback {function} a callback function that will receive an InputManager.Event object.
         */
        addEventListener(event: string, callback: any): Node;
        /**
         * Notify an event callback based on the event type.
         * @method cc.node.Node#notifyEvent
         * @param e {cc.event.InputManagerEvent}
         * @returns {boolean} whether the event must bubble.
         */
        notifyEvent(e: any): boolean;
        /**
         * Get a point in screen space turned into local node space.
         * When nodes are axis aligned, this is trivial, but for transformed nodes this method is needed.
         * The point will be modified.
         * See input demos.
         * @method cc.node.Node#getScreenPointInLocalSpace
         * @param p {cc.math.Vector}
         */
        getScreenPointInLocalSpace(p: Vector): void;
        /**
         * Get a point in local Node space turned into screen space.
         * When nodes are axis aligned, this is trivial, but for transformed nodes this method is needed.
         * The point will be modified.
         * See input demos.
         * @method cc.node.Node#getLocalPointInScreenSpace
         * @param p {cc.math.Vector}
         */
        getLocalPointInScreenSpace(p: Vector): void;
        /**
         * Get a point in local Node space turned into another Node's local space.
         * When nodes are axis aligned, this is trivial, but for transformed nodes this method is needed.
         * The point will be modified.
         * See input demos.
         * @method cc.node.Node#getLocalPointInNodeSpace
         * @param p {cc.math.Vector}
         */
        getLocalPointInNodeSpace(p: Vector, node: Node): void;
        /**
         * Get whether a point in screen space lies in the Node's bounds.
         * When nodes are axis aligned, this is trivial, but for transformed nodes this method is needed.
         * See input demos.
         * @method cc.node.Node#isScreenPointInNode
         * @param p {cc.math.Vector}
         */
        isScreenPointInNode(p: Vector): boolean;
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
        addChild(node: Node, localZOrder?: number): Node;
        __legacyAddChild(child: any, localZOrder: any, tag: any): void;
        /**
         * Change a node's z-index.
         * <br>
         * This will schedule a children sort on next visit call.
         * A call to this method with set orderOfArrival no a new value.
         * @method cc.node.Node#reorderChild
         * @param node {cc.node.Node}
         * @param localZOrder
         */
        reorderChild(node: Node, localZOrder: number): void;
        /**
         * Sort a node's children.
         * Children are sorted based on zOrder and orderOfArrival.
         * @method cc.node.Node#__sortChildren
         * @private
         */
        __sortChildren(): void;
        /**
         * Remove a child from a node.
         * @method cc.node.Node#removeChild
         * @param node {cc.node.Node} node to remove
         * @param cleanup {boolean=} should clean up ?
         */
        removeChild(node: Node, cleanup?: boolean): Node;
        /**
         * Remove the node from its parent.
         * @method cc.node.Node#removeFromParent
         * @param cleanup {boolean} if true, all node's scheduled callbacks will be removed too.
         * @returns {cc.node.Node}
         */
        removeFromParent(cleanup?: boolean): Node;
        /**
         * Remove all Node's child nodes.
         * @method cc.node.Node#removeAllChildren
         * @returns {cc.node.Node}
         */
        removeAllChildren(cleanup?: boolean): Node;
        /**
         * Get the node's children list.
         * @method cc.node.Node#getChildren
         * @returns {Array<cc.node.Node>}
         */
        getChildren(): Array<Node>;
        /**
         * Get a node's root node.
         * A node's root node normally will be a Scene type node.
         * @method cc.node.Node#getRootNode
         * @returns {cc.node.Node}
         */
        getRootNode(): Node;
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
        enumerateChildren(patternName: string, callback: EnumerateCallback): void;
        /**
         * Do the actual enumeration.
         * @method cc.node.Node#__enumerateChildrenImpl
         * @param orgPatternData {Array<RegExp>}
         * @param patternData {Array<RegExp>
         * @param callback {EnumerateCallback} callback function executed for each node that matches the pattern.
         * @param recursive {boolean} is this a recursive enumeration ?
         * @private
         */
        __enumerateChildrenImpl(orgPatternData: Array<RegExp>, patternData: Array<RegExp>, callback: EnumerateCallback, recursive: boolean): void;
        /**
         * Draw a node.
         * Override this method to draw.
         * Draw like a boss w/o worrying of current affine transformation matrix.
         * @method cc.node.Node#draw
         * @param ctx {cc.render.RenderingContext} a rendering context, either canvas or webgl.
         */
        draw(ctx: RenderingContext): void;
        /**
         * Set this node's name. Suitable for identifying and enumerateChildren.
         * @method cc.node.Node#setName
         * @param name {string} must be composed of [A-Za-z0-9_]+ characters.
         * @returns {cc.node.Node}
         */
        setName(name: string): Node;
        startActionChain(): cc.action.ActionChainContext;
        /**
         * Schedule an action to run.
         * By the time an action is meant to be scheduled for running in a Node, there may not yet be a
         * <code>Director</code> or <code>Scene</code>. This method saves locally the actions which will be
         * scheduled in a scene's <code>ActionManager</code> later.
         * @method cc.node.Node#runAction
         * @param action {cc.action.Action}
         * @returns {cc.node.Node}
         */
        runAction(action: Action): Node;
        /**
         * Stop a Node action with the given tag.
         * @method cc.node.Node#stopActionByTag
         * @param tag {string} action tag.
         * @returns {cc.node.Node}
         */
        stopActionByTag(tag: string): Node;
        stopAllActions(): Node;
        /**
         * Set Node's Scene and allow for buffered Actions to be scheduled.
         * This method is called when <code>scene.onEnter</code> is called.
         * @method cc.node.Node#setScene
         * @param scene {cc.node.Scene}
         */
        setScene(scene: Scene): void;
        enableEvents(enable: boolean): cc.node.Node;
        enablePriorityEvents(enable: boolean, priority: number): cc.node.Node;
        getInputPriority(): number;
        /**
         * Set the node's visibility.
         * @method cc.node.Node#setVisible
         * @param v {boolean}
         */
        setVisible(v: boolean): void;
        isVisible(): boolean;
        cleanup(): void;
        /**
         * This method is here for only for backwards compatibility purposes.
         * it exists for historical reasons. Comes from Cocos2d iphone v2.
         * It is called when a call to scheduleUpdate is made.
         * @method cc.node.Node#update
         * @param delta {number}
         * @deprecated
         */
        update(delta: number): void;
        /**
         * Schedule a update call with the given priority. <code>scheduleUpdate</code>,
         * <code>scheduleUpdateWithPriority</code> and <code>unscheduleUpdate</code>
         * methods are just for backwards compatibility.
         * @deprecated
         * @method cc.node.Node#scheduleUpdateWithPriority.
         * @param priority {number}
         */
        scheduleUpdateWithPriority(priority: number): void;
        /**
         * Schedule a task to per frame call update for this node.
         * <code>scheduleUpdate</code>,
         * <code>scheduleUpdateWithPriority</code> and <code>unscheduleUpdate</code>
         * methods are just for backwards compatibility.
         * @method cc.node.Node#scheduleUpdate
         * @deprecated
         */
        scheduleUpdate(): void;
        __scheduleImpl(task: SchedulerQueueTask): void;
        /**
         * Unschedule all update callbacks for this node.
         * <code>scheduleUpdate</code>,
         * <code>scheduleUpdateWithPriority</code> and <code>unscheduleUpdate</code>
         * methods are just for backwards compatibility.
         * @method cc.node.Node#unscheduleUpate
         */
        unscheduleUpate(): void;
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
        schedule(callback_fn: SchedulerTaskCallback, interval: number, repeat?: number, delay?: number): void;
        /**
         * Schedule a single shot task. Will fired only once.
         * @method cc.node.Node#scheduleOnce
         * @param callback_fn {cc.action.SchedulerTaskCallback} scheduler callback.
         * @param delay {number} milliseconds to wait before firing the task.
         * @returns {cc.node.Node}
         */
        scheduleOnce(callback_fn: SchedulerTaskCallback, delay: number): void;
        /**
         * Unschedule a task for the node.
         * @method cc.node.Node#unschedule
         * @param callback_fn {cc.action.SchedulerTaskCallback} callback to unschedule.
         */
        unschedule(callback_fn: SchedulerTaskCallback): void;
        /**
         * Unschedule all tasks for the node.
         * @method cc.node.Node#unscheduleAllCallbacks
         */
        unscheduleAllCallbacks(): void;
        /**
         * Resumes all scheduled tasks and actions.
         * This method is called internally by onEnter
         * @method cc.node.Node#resume
         */
        resume(): void;
        /**
         * Pauses all scheduled selectors and actions.
         * This method is called internally by onExit.
         * @method cc.node.Node#pause
         *
         */
        pause(): void;
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
        setBlendFunc(src_o: any, dst: number): void;
        /**
         * Set a bunch of properties for the node.
         * If a property does exists in Node, a warning is emitted and nothing will happen.
         * Only for backwards compatibility.
         * @deprecated
         * @method cc.node.Node#attr
         * @param properties {any} Collection of key/value pairs.
         * @returns {cc.node.Node}
         */
        attr(properties: any): Node;
        /**
         * @deprecated
         * @method cc.node.Node#set:width
         * @param v {number}
         */
        width: number;
        /**
         * @deprecated
         * @method cc.node.Node#set:height
         * @param v {number}
         */
        height: number;
        /**
         * @deprecated
         * @method cc.node.Node#set:color
         * @param v {cc.math.Color}
         */
        color: Color;
        /**
         * @deprecated
         * @method cc.node.Node#set:rotation
         * @param angle_in_deg {number}
         */
        rotation: number;
        /**
         * @deprecated
         * @method cc.node.Node#set:visible
         * @param v {boolean}
         */
        visible: boolean;
        anchorX: number;
        anchorY: number;
        scale: number;
        parent: Node;
        children: Node[];
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    /**
     * This value is a time unit divisor constant.
     * CocosJS expects all time units to be in seconds, hence the default value of 1000.
     * But you could easily change time unit values to milliseconds, changing this value to 1, and setting all
     * actions/scheduler time units in millis.
     *
     * @member cc.action.TIMEUNITS
     * @type {number}
     */
    var TIMEUNITS: number;
    /**
     * Change time units on actions, schedulers, etc to seconds.
     * This is the default type.
     * @name setTimeReferenceInSeconds
     * @memberof cc.action
     */
    function setTimeReferenceInSeconds(): void;
    /**
     * Change time units on actions, schedulers, etc to milliseconds.
     * @name setTimeReferenceInMillis
     * @memberof cc.action
     */
    function setTimeReferenceInMillis(): void;
    /**
     * Callback definition for Action Apply event.
     * @memberOf cc.action
     * @callback ActionCallbackApplicationCallback
     * @param action {cc.action.Action} Executed Action.
     * @param target: {object} target the Action applied to.
     * @param value: {Object} Current target property value set.
     */
    /**
     * Callback definition for Action Start, End, Pause and Resume events.
     * @memberOf cc.action
     * @callback ActionCallbackStartOrEndOrPauseOrResumeCallback
     * @param action {cc.action.Action} Executed Action.
     * @param target: {object} target the Action applied to.
     */
    /**
     * Callback definition for Action Repeat event.
     * @memberOf cc.action
     * @callback ActionCallbackRepeatCallback
     * @param action {cc.action.Action} Executed Action.
     * @param target: {object} target the Action applied to.
     * @param repetitionCount {number} Current repetition count.
     */
    /**
     * Action internal states.
     * <br>
     * Status diagram is:
     *
     * <pre>
     *
     * CREATED ---> RUNNING ---> PAUSED <---> RESUMED
     *    ^          |  ^                           |
     *    |          |  |                           |
     *    |          |  +---------------------------+
     *    |          v
     *    +------> ENDED
     *
     * </pre>
     *
     * @tsenum cc.action.ActionStates
     */
    enum ActionStates {
        PAUSED = 1,
        RUNNING = 2,
        CREATED = 3,
        ENDED = 4,
        RESUMED = 5,
    }
    interface ActionCallbackStartOrEndOrPauseOrResumeCallback {
        (action: Action, target: any): void;
    }
    interface ActionCallbackRepeatCallback {
        (action: Action, target: any, repetitionCount: number): void;
    }
    interface ActionCallbackApplicationCallback {
        (action: Action, target: any, value: any): void;
    }
    /**
     * @class cc.action.RepeatTimesOptions
     * @interface
     * @classdesc
     * Callback definition for Action application repetition events.
     */
    interface RepeatTimesOptions {
        /**
         * Optional Action after application delay time.
         * @member cc.action.RepeatTimesOptions#withDelay
         * @type {number}
         */
        withDelay?: number;
    }
    /**
     * @class cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * This object describes a base Action initializer object. It contains all common information for actions,
     * and can be used as serializable data.
     */
    interface ActionInitializer {
        /**
         * Action type. A cc.action constructor function name.
         * Type is necessary when deserializing Actions.
         * @member cc.action.ActionInitializer#type
         * @type {string=}
         */
        type?: string;
        /**
         * Action duration. The value must be in the correct Time units.
         * @member cc.action.ActionInitializer#duration
         * @type {number}
         */
        duration?: number;
        /**
         * Action before-application delay. The value must be in the correct Time units.
         * @member cc.action.ActionInitializer#delayBefore
         * @type {number}
         */
        delayBefore?: number;
        /**
         * Action after-application delay. The value must be in the correct Time units.
         * @member cc.action.ActionInitializer#delayAfter
         * @type {number}
         */
        delayAfter?: number;
        /**
         * Start alpha value.
         * @member cc.action.ActionInitializer#interpolator
         * @type {cc.action.InterpolatorInitializer=}
         */
        interpolator?: InterpolatorInitializer;
        /**
         * Start alpha value.
         * @member cc.action.ActionInitializer#from
         * @type {any=}
         */
        from?: any;
        /**
         * End alpha value.
         * @member cc.action.ActionInitializer#to
         * @type {any}
         */
        to?: any;
        /**
         * Make the action relative.
         * @member cc.action.ActionInitializer#relative
         * @type {boolean=}
         */
        relative?: boolean;
        /**
         * Set repetition count.
         * @member cc.action.ActionInitializer#repeatTimes
         * @type {number=}
         */
        repeatTimes?: number;
        /**
         * Set reversed action.
         * @member cc.action.ActionInitializer#reversed
         * @type {boolean=}
         */
        reversed?: boolean;
    }
    /**
     *
     *  @class cc.action.Action
     *  @classdesc
     *
     * Actions are scheduled objects that modify an arbitray object's internal state. It could be a node, or any other
     * object type.
     * For example, schedule a rotation from 0 to 360 degrees, scale from to twice a node's size, or a combination of
     * both.
     * <br>
     * cc.action.Action is an abstract class, and won't affect any target. This Class type must be subclassed.
     * <br>
     *
     * Actions are defined by the following elements:
     *
     *  <li>duration. How long the action will take to end.
     *  <li>delay before application. How long the action will take to start applying.
     *  <li>delay after application. How long the action will take to end after it ended modifying node's properties.
     *  <li>lifecycle. An action has callback functions for: start, pause, resume, end and repeat.
     *  <li>speed. An action has speed modifiers. if an action has speed 2, will take twice the time to execute.
     *  <li>interpolators. An action can have modifiers for time application, like easing functions or curve segments.
     *  <li>relativity. An action can be applied relative to a value, instead of absolutely. For example, rotate by an
     *     angle instead of rotate to.
     *  <li>From. Start values for action application.
     *  <li>To. End values for action application.
     *  <li>Reversability: an action can be set to be played backwards. This is accomplished not by modifying the action
     *      but by modifiying the Interpolator that transforms time into property values.
     *
     * Predefined actions exist for the following node's properties:
     *
     *  <li>AlphaAction. Modifies transparency values.
     *  <li>MoveAction. Modifies position by traversing a straight line.
     *  <li>PathAction. Modifies position by traversing a complex path.
     *  <li>RotateAction. Modifies rotation angle.
     *  <li>ScaleAction. Modifies scale.
     *  <li>TintAction. Modifies s color. This action will only have a visible result when the node is rendered
     *      using WebGL.
     *  <li>SequenceAction. Allows for action sequencing and parallelization.
     *  <li>PropertyAction. Allows for modification of an object's arbitrary property. Either deeply nested or not.
     *
     * There are other type of actions that affect or create a mix of different node properties modification like:
     *
     *  <li>BlinkAction
     *  <li>JumpAction
     *
     *  The current V4 action subsystem is a complete rebuild from the ground up. Although backwards compatible with
     *  Cocos2d HTML5's V2 and V3 action system, this new implementation offers the following features:
     *
     *  <li>Consistent Action naming: easeExponentialIn vs easeQuinticActionIn .
     *  <li>Simplification of cc namespace. From 150+ action objects to a few.
     *  <li>Reduced code complexity.
     *  <li>Offer a new more js-ish code convention via chaining of method calls.
     *  <li>Change concept of easing action. Easing is a property of an Action's time.
     *  <li>Reduce overly class-extension hierarchy from version 2 and 3
     *  <li>Full action lifecycle: START, END, PAUSE, RESUME, REPEAT.
     *
     */
    class Action {
        /**
         * Default tag value.
         * @member cc.action.Action#DEFAULT_TAG
         * @type {string}
         * @static
         */
        static DEFAULT_TAG: string;
        /**
         * Delay to start applying the Action.
         * @member cc.action.Action#_startTime
         * @type {number}
         * @private
         */
        _startTime: number;
        /**
         * Action duration (in seconds). For how long the Action takes to get to the final application result.
         * @member cc.action.Action#_duration
         * @type {number}
         * @private
         */
        _duration: number;
        /**
         * Currently elapsed time.
         * @member cc.action.Action#_currentTime
         * @type {number}
         * @private
         */
        _currentTime: number;
        /**
         * Number of repeat times. 1 by default.
         * @member cc.action.Action#_repeatTimes
         * @type {number}
         * @private
         */
        _repeatTimes: number;
        /**
         * Current repetition count.
         * @member cc.action.Action#_currentRepeatCount
         * @type {number}
         * @private
         */
        _currentRepeatCount: number;
        /**
         * Action speed. Actual Action duration is: ( (_duration + _delayAfterApplication) * _times) / _speed
         * @type {number}
         * @private
         */
        _speed: number;
        /**
         * An action identifier. Defaults to @see(Action.DEFAULT_TAG).
         * @member cc.action.Action#_tag
         * @type {number}
         * @private
         */
        _tag: string;
        /**
         * Action status.
         *
         * Status diagram:
         *
         * <pre>
         *
         * CREATED ---> RUNNING ---> PAUSED <---> RESUMED
         *    ^          |  ^                           |
         *    |          |  |                           |
         *    |          |  +---------------------------+
         *    |          v
         *    +------> ENDED
         *
         * </pre>
         *
         * @member cc.action.Action#_status
         * @type {cc.action.ActionStates}
         * @private
         */
        _status: ActionStates;
        /**
         * On start application callback. Called when the Action is first executed.
         * @member cc.action.Action#_onStart
         * @type {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @private
         */
        _onStart: ActionCallbackStartOrEndOrPauseOrResumeCallback;
        /**
         * On end application callback. Fired each time the Action ends applying.
         * This callback may not be called if _repeatTimes is set too high or is playing forever.
         * @member cc.action.Action#_onEnd
         * @type {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @private
         */
        _onEnd: ActionCallbackStartOrEndOrPauseOrResumeCallback;
        /**
         * On repeat application callback. Fired each time the action is repeated.
         * @member cc.action.Action#_onRepeat
         * @type {cc.action.ActionCallbackRepeatCallback}
         * @private
         */
        _onRepeat: ActionCallbackRepeatCallback;
        /**
         * On application callback. Fired each time the action is applied. this callback can be called many times
         * during the action life cycle.
         * @member cc.action.Action#_onApply
         * @type {cc.action.ActionCallbackApplicationCallback}
         * @private
         */
        _onApply: ActionCallbackApplicationCallback;
        /**
         * On pause callback. Fired each time the action is paused. this callback can be called many times
         * during the action life cycle.
         * @member cc.action.Action#_onPause
         * @type {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @private
         */
        _onPause: ActionCallbackStartOrEndOrPauseOrResumeCallback;
        /**
         * On resume callback. Fired each time the action is resumed. this callback can be called many times
         * during the action life cycle.
         * @member cc.action.Action#_onResume
         * @type { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @private
         */
        _onResume: ActionCallbackStartOrEndOrPauseOrResumeCallback;
        /**
         * Interpolation/Ease function application
         * @member cc.action.Action#_interpolator
         * @type {cc.action.TimeInterpolator}
         * @private
         */
        _interpolator: cc.action.TimeInterpolator;
        /**
         * if the from values for an Action have not been set, a call to __setInitialValues with
         * the target as parameter to have them set.
         * @member cc.action.Action#_fromValuesSet
         * @type {boolean}
         * @private
         */
        _fromValuesSet: boolean;
        /**
         * Flag for executing onStart callback. Do not use or modify.
         * @member cc.action.Action#_firstExecution
         * @type {boolean}
         * @private
         */
        _firstExecution: boolean;
        /**
         * This delay will be applied after each application.
         * @member cc.action.Action#_delayAfterApplication
         * @type {number}
         * @private
         */
        _delayAfterApplication: number;
        /**
         * This delay will be applied before each application.
         * @member cc.action.Action#_delayBeforeApplication
         * @type {number}
         * @private
         */
        _delayBeforeApplication: number;
        /**
         * Action owner ie the ActionManager this Action executes in.
         * @member cc.action.Action#_owner
         * @type {cc.action.ActionManager}
         * @private
         */
        /**
         * Reference for a chained action. Do not use or modify.
         * @member cc.action.Action#_chainAction
         * @type {cc.action.Action}
         * @private
         */
        _chainAction: Action;
        /**
         * If true, the actions must be ActionBy variations.
         * @member cc.action.Action#_relativeAction
         * @type {boolean}
         * @private
         */
        _relativeAction: boolean;
        /**
         * Is the action reversed ?
         * A reversed action will be applied from end to begin.
         * @member cc.action.Action#_reversedTime
         * @type {boolean}
         * @private
         */
        _reversedTime: boolean;
        /**
         * If this Action belongs to a SequenceAction this variable will be its parent sequence.
         * @member cc.action.Action#_parentSequence
         * @type {cc.action.SequenceAction}
         * @private
         */
        _parentSequence: SequenceAction;
        /**
         * Is the action reversed ?
         * This happens by a call to reverse() or setReversed()
         * @member cc.action.Action#_reversed
         * @type {boolean}
         * @private
         */
        _reversed: boolean;
        /**
         * When a call to node.startActionChain() is made, an ActionChainContext object is created. It is a fachade
         * for chainable api. apart from that, does nothing to the Action.
         * @member cc.action.Action#_chainContext
         * @type {cc.action.ActionChainContext}
         * @private
         */
        _chainContext: cc.action.ActionChainContext;
        /**
         * Build an Action instance.
         * This type of objects must augmented.
         * @constructor
         * @method cc.action.Action#constructor
         * @param initilizer {cc.action.ActionInitializer=} a JSON object describing a base Action info.
         */
        constructor(initializer?: ActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.Action#__createFromInitializer
         * @param initializer {cc.action.ActionInitializer}
         * @private
         */
        __createFromInitializer(initializer: ActionInitializer): void;
        /**
         * Set an arbitrary tag for an Action.
         * @method cc.action.Action#setTag
         * @param tag {string} a string composed only of [A-Za-z0-9_-]
         * @returns {cc.action.Action}
         */
        setTag(tag: string): Action;
        /**
         * Update an Action's target object.
         * This function must be overriden by Action subclass Objects.
         * @method cc.action.Action#update
         * @param normalizedTime {number} value between 0 and 1.
         * @param target {any} object instance the action will be applied for.
         *
         * @returns {Object} a value descriptive for the action type. For example, ScaleAction will return an object with
         * the scale applied, and MoveAction a <code>cc.math.Vector</code> with object's set position.
         */
        update(normalizedTime: number, target: any): any;
        /**
         * Set an Action's duration. Duration is in milliseconds.
         * @method cc.action.Action#setDuration
         * @param duration {number}
         */
        setDuration(duration: number): Action;
        /**
         * Set an action's pre application delay.
         * An action will take this milliseconds to start applying values in a target.
         * @method cc.action.Action#setDelay
         * @param d {number} milliseconds.
         * @returns {cc.action.Action}
         */
        setDelay(d: number): Action;
        /**
         * Update this Action's duration.
         * This must be done when a sub Action is updated or when delay times or duration itself have changed.
         * @method cc.action.Action#__updateDuration
         * @private
         */
        __updateDuration(): void;
        /**
         * Restart an action's application.
         * Status gets back to CREATED.
         * First execution set to true.
         * Application times count set to 0.
         * @method cc.action.Action#restart
         * @returns {cc.action.Action}
         */
        restart(): Action;
        /**
         * Get an action's current State.
         * @method cc.action.Action#getStatus
         * @returns {cc.action.ActionStates}
         */
        getStatus(): ActionStates;
        /**
         * Get an action's application speed.
         * Speed values modify an action duration.
         * A speed value of 2 will make the action to take twice the time to execute.
         * @method cc.action.Action#getSpeed
         * @returns {number}
         */
        getSpeed(): number;
        /**
         * Set an action's application speed.
         * @method cc.action.Action#setSpeed
         * @param speed {number}
         * @returns {cc.action.Action}
         */
        setSpeed(speed: number): Action;
        /**
         * Make this action repeat a finite number of timer.
         * 0 repeatTimes means repeat forerver.
         * @method cc.action.Action#setRepeatTimes
         * @param repeatTimes {number}
         * @param obj {RepeatTimesOptions}
         * @return Action
         */
        setRepeatTimes(repeatTimes: number, obj?: RepeatTimesOptions): Action;
        /**
         * Set this action to apply forever.
         * @method cc.action.Action#setRepeatForever
         * @param obj {RepeatTimesOptions}
         * @returns {cc.action.Action}
         */
        setRepeatForever(obj?: RepeatTimesOptions): Action;
        /**
         *
         * @method cc.action.Action#repeatForever
         * @deprecated
         * @returns {Action}
         */
        repeatForever(): Action;
        /**
         * Register a callback notification function fired whenever the Action starts applying.
         * @method cc.action.Action#onStart
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @returns {cc.action.Action}
         */
        onStart(callback: ActionCallbackStartOrEndOrPauseOrResumeCallback): Action;
        /**
         * Register a callback notification function fired whenever the action expires applying.
         * If repeats forever, will never be called.
         * @method cc.action.Action#onEnd
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @return Action
         */
        onEnd(callback: ActionCallbackStartOrEndOrPauseOrResumeCallback): Action;
        /**
         * Register a callback notification function fired whenever the action repeats.
         * BUGBUG if setRepeatForever is not fired.
         * @method cc.action.Action#onRepeat
         * @param callback { cc.action.ActionCallbackRepeatCallback }
         * @return Action
         */
        onRepeat(callback: ActionCallbackRepeatCallback): Action;
        /**
         * Register a callback notification function fired whenever the action applies.
         * The action applies once per frame, and allows for getting values that have been set on the target.
         * @method cc.action.Action#onApply
         * @param callback { cc.action.ActionCallbackApplicationCallback }
         * @return Action
         */
        onApply(callback: ActionCallbackApplicationCallback): Action;
        /**
         * Register a callback notification function fired whenever the action is paused.
         * @method cc.action.Action#onPause
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @return Action
         */
        onPause(callback: ActionCallbackStartOrEndOrPauseOrResumeCallback): Action;
        /**
         * Register a callback notification function fired whenever the action is resumed, that it, exits the
         * paused state.
         * @method cc.action.Action#onResume
         * @param callback { cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback }
         * @return Action
         */
        onResume(callback: ActionCallbackStartOrEndOrPauseOrResumeCallback): Action;
        /**
         * Pause this action.
         * @method cc.action.Action#pause
         * @param target {object=}
         * @returns Action
         */
        pause(target?: any): Action;
        /**
         * Resume this action.
         * @method cc.action.Action#resume
         * @returns Action
         */
        resume(): Action;
        /**
         * Get time to wait after action application to repeat.
         * This time will be spent even if repeat count is 1.
         * @method cc.action.Action#getDelayAfterApplication
         * @returns {number}
         */
        getDelayAfterApplication(): number;
        /**
         * Set time to wait after action application to repeat.
         * This time will be spent even if repeat count is 1.
         * @method cc.action.Action#setDelayAfterApplication
         * @param d {number} milliseconds to wait after application.
         * @returns {cc.action.Action}
         */
        setDelayAfterApplication(d: number): Action;
        /**
         * Get this action's delay time to start applying.
         * @method cc.action.Action#getDelay
         * @returns {number}
         */
        getDelay(): number;
        /**
         * Changes default interpolator to another instance of @link{cc.action.TimeInterpolator}.
         * @method cc.action.Action#setInterpolator
         * @param interpolator {cc.action.TimeInterpolator}
         * @returns Action
         */
        setInterpolator(interpolator: cc.action.TimeInterpolator): Action;
        /**
         * Convert time into a normalized value in the range of the application duration.
         * The values will converted, so that 0 will be just after starting each repetition,
         * and 1 will be just the end of the Action, or the end of each repetition.
         * @method cc.action.Action#__normalizeTime
         * @param time {number}
         * @private
         */
        __normalizeTime(time: number): number;
        /**
         * Get whole action duration. Takes into account action speed, duration, delayAfterApplication and repetition times.
         * @method cc.action.Action#getDuration
         * @returns {number}
         */
        getDuration(): number;
        /**
         * Calculate one repetition duration.
         * @method cc.action.Action#getOneRepetitionDuration
         * @returns {number}
         */
        getOneRepetitionDuration(): number;
        /**
         * Chekcs whether the action is applicable.
         * In case it gets out of scene time, and has not been tagged as expired, the action is expired and observers
         * are notified about that fact.
         * @method cc.action.Action#__isActionApplicable
         * @param time {number} the scene time to check the action against.
         * @return {boolean} whether the action is applicable.
         */
        __isActionApplicable(time: number): boolean;
        /**
         * This method must no be called directly.
         * The director loop will call this method in order to apply target actions.
         * @method cc.action.Action#step
         * @param delta {number} elapsed time since last application.
         * @param target {object}  target object the action is being applied to.
         */
        step(delta: number, target: any): void;
        /**
         * Actual step implementation.
         * @method cc.action.Action#__stepImpl
         * @param delta {number} elapsed time since last application.
         * @param time {number} Action accumulated time.
         * @param target {object} target to apply action to.
         * @private
         */
        __stepImpl(delta: number, time: number, target: any): void;
        /**
         * When an action is in time, and able to be applied to a target, this method does all the necessary steps.
         * Do not call directly.
         * @method cc.action.Action#__actionApply
         * @param time {number} current action's application time.
         * @param target {object} target node.
         * @private
         */
        __actionApply(time: number, target: any): void;
        /**
         * Do code specific for checking action repetition and callback invocation when it makes sense.
         * @method cc.action.Action#__checkRepetition
         * @param time {number} current action application time .
         * @param target {object} target object the action is being applied to.
         * @private
         */
        __checkRepetition(time: number, target: any): void;
        /**
         * Pass in the target node this action will act on.
         * This method must be overriden by each action type.
         * @method cc.action.Action#initWithTarget
         * @param target {object}
         */
        initWithTarget(target: any): void;
        /**
         * Solve Action first application values.
         * Must be overriden.
         * @method cc.action.Action#solveInitialValues
         * @param target {object}
         */
        solveInitialValues(target: any): void;
        /**
         * End this action immediately. Will call onEnd callback if set.
         * @method cc.action.Action#stop
         * @param target {object=}
         */
        stop(target?: any): void;
        /**
         * Is this action finished ?
         * @method cc.action.Action#isFinished
         * @returns {boolean}
         */
        isFinished(): boolean;
        /**
         * Is this action paused ?
         * @method cc.action.Action#isPaused
         * @returns {boolean}
         */
        isPaused(): boolean;
        /**
         * Set origin values for the action.
         * This method MUST be overriden and called from the override function.
         * @method cc.action.Action#from
         * @param obj {Object} any object necessary for the action initialization.
         * @returns {cc.action.Action}
         */
        from(obj: any): Action;
        /**
         * Set destination values for the action.
         * @method cc.action.Action#to
         * @param obj {Object} any object necessary for the action initialization.
         * @returns {cc.action.Action}
         */
        to(obj: any): Action;
        /**
         * Shortcut method for setting an action's duration, delay and easing function.
         * @method cc.action.Action#timeInfo
         * @param delay {number} milliseconds to wait for action start.
         * @param duration {number} milliseconds of this action application.
         * @param interpolator {cc.action.TimeInterpolator} a time interpolator interface object.
         * @returns {cc.action.Action}
         */
        timeInfo(delay: number, duration: number, interpolator?: cc.action.TimeInterpolator): Action;
        /**
         * This method will make actions to be applied relatively instead of absolutely.
         * For example, moveBy will add the position to the current node's position instead of traversing through the
         * path.
         * @method cc.action.Action#setRelative
         * @param relative {boolean} make this action to behave as moveBy
         * @returns {cc.action.MoveAction}
         */
        setRelative(relative: boolean): Action;
        /**
         * @deprecated This method is deprecated because of its semantics. Use createReversed() instead.
         * @method cc.action.Action#reverse
         * @see {cc.action.Action#createReversed}
         */
        reverse(): Action;
        /**
         * Create a new Action which is the reverse of this one.
         * A reverse Action is expected to be the inverse of what it was. In example, getting back from a path,
         * or rotating in the other direction.
         * In this new implementation, a reverse action is just inverting the TimeInterpolation value.
         * @method cc.action.Action#createReversed
         * @returns {cc.action.Action}
         */
        createReversed(): Action;
        /**
         * Set an action to be its reversed action.
         * This method does not create any new action.
         * @method cc.action.Action#setReversed
         * @returns {cc.action.Action}
         */
        setReversed(): Action;
        /**
         * Make the actual cloning implementation.
         * This method must be overriden by each action type.
         * @method cc.action.Action#__cloneImpl
         * @returns {cc.action.Action}
         * @private
         */
        __cloneImpl(): Action;
        /**
         * Create a copy of an action.
         * @method cc.action.Action#clone
         * @returns {cc.action.Action}
         */
        clone(): Action;
        /**
         * Is action relative.
         * In V2 and V3 language, a relative action corresponds to ActionBy types.
         * Non relative actions are ActionTo types.
         * @method cc.action.Action#isRelative
         * @returns {boolean}
         */
        isRelative(): boolean;
        /**
         * Copy generic properties when cloning an Action.
         * Action event Callbacks are copied as well.
         * @method cc.action.Action#__genericCloneProperties
         * @param copy {cc.action.Action}
         * @private
         */
        __genericCloneProperties(copy: any): void;
        /**
         * Backward compatible call.
         * @method cc.action.Action#easing
         * @param i {cc.action.Interpolator} an interpolator/easing function.
         * @returns {cc.action.Action}
         */
        easing(i: cc.action.TimeInterpolator): Action;
        /**
         * Backward compatible call.
         * @method cc.action.Action#speed
         * @param speed
         * @returns {cc.action.Action}
         * @deprecated Use setSpeed(speed)
         */
        speed(speed: number): Action;
        /**
         * Is time applied in inverse order ?
         * @method cc.action.Action#isReversedTime
         * @returns {boolean}
         */
        isReversedTime(): boolean;
        /**
         * Set this action's time to be applied inversely.
         * @method cc.action.Action#setReversedTime
         * @param b {boolean} reverse time ?
         * @returns {cc.action.Action}
         */
        setReversedTime(b: boolean): Action;
        /**
         * This method is called from a SequenceAction object. It clears current action status info so that it can
         * be restarted.
         * @method cc.action.Action#__recursivelySetCreatedStatus
         * @param target {any}
         * @private
         */
        __recursivelySetCreatedStatus(target: any): void;
        /**
         * Apply this action in a pingpong way.
         * @method cc.action.Action#pingpong
         */
        pingpong(): void;
        /**
         * Build an initializer object out of the Action current state and info.
         * Every Action type must override and super.call this method.
         * @method cc.action.Action#getInitializer
         * @returns {cc.action.ActionInitializer}
         */
        getInitializer(): ActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    /**
     * @class cc.action.InterpolatorInitializer
     * @interface
     */
    interface InterpolatorInitializer {
        /**
         * Interpolator type.
         * @member cc.action.InterpolatorInitializer#type
         * @type {string}
         */
        type: string;
        /**
         * Is inverted ?
         * @member cc.action.InterpolatorInitializer#inverse
         * @type {boolean}
         */
        inverse?: boolean;
        /**
         * Is pingpong ?
         * @member cc.action.InterpolatorInitializer#pingpong
         * @type {boolean}
         */
        pingpong?: boolean;
        /**
         * some interpolators need an exponent value.
         * @member cc.action.InterpolatorInitializer#exponent
         * @type {number}
         */
        exponent?: number;
        /**
         * some interpolators need an period value.
         * @member cc.action.InterpolatorInitializer#period
         * @type {number}
         */
        period?: number;
    }
    /**
     * @class cc.action.TimeInterpolator
     * @interface
     * @classdesc
     *
     * Interface for all Interpolator functions.
     * <br>
     * This is a callable interface: <code>(time:number) => number</code>
     *
     */
    interface TimeInterpolator {
        (time: number): number;
        /**
         * Reverse the interpolator instance.
         * @method cc.action.TimeInterpolator#reverse
         */
        reverse(): TimeInterpolator;
        getInitializer(): InterpolatorInitializer;
    }
    /**
     *
     * This function creates a new TimeIntepolator object from a JSON object.
     * It can be the result of serializing an interpolator.
     *
     * @name ParseInterpolator
     * @memberOf cc.action
     * @param ii {cc.action.InterpolatorInitializer}
     * @returns {cc.action.TimeInterpolator}
     * @constructor
     */
    function ParseInterpolator(ii: InterpolatorInitializer): any;
    /**
     * @class cc.action.Interpolator
     *
     * @classdesc
     * Interpolators are functions used to modify a normalized value, commonly an action current time relative to
     * the action's duration.
     * <br>
     * The achieved effect is pretty interesting for animations, from slow acceleration to bounces, elastic behaviors,
     * etc. All interpolators are the same object types, and have same capabilities
     *   <li>inverse {boolean}: make the interpolator apply inversely (time applies from 1 to 0)
     *   <li>pingpong {boolean}: the interpolator will apply half the time non-inverse and the other half of the time
     *       inversely. This is suitable for effects that apply and de-apply. I.e. zoom from scale 1 to 2, and back from
     *       2 to 1. In previous API, two actions were needed for such effects.
     * <br>
     * Some of the interpolators are easing functions, quadratic bezier curves, etc.
     * <br>
     * In V2 and V3 API, interpolators were cc.easing actions, and in V4, they have been turned into an action
     * attribute.
     * <br>
     * An interpolator is set for an action by calling <code>action.setInterpolator</code>.
     */
    class Interpolator {
        /**
         * Build a linear interpolator.
         * @method cc.action.Interpolator.Linear
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {cc.action.TimeInterpolator}
         */
        static Linear(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an ease-in interpolator.
         * @param exponent {number} exponent
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseIn
         */
        static EaseIn(exponent: number, inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an ease-out interpolator.
         * @param exponent {number} exponent
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseOut
         */
        static EaseOut(exponent: number, inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an ease-in-out interpolator.
         * @param exponent {number} exponent
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseInOut
         */
        static EaseInOut(exponent: number, inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an exponential-in interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseExponentialIn(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an exponential-out interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseExponentialOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an exponential-in-out interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialInOut
         */
        static EaseExponentialInOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an sine-in interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseSineIn(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an sine-out interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseSineOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an sine-inout interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseSineInOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseElasticIn interpolator.
         * @param period {number=}
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseElasticIn(period?: number, inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseElasticOut interpolator.
         * @param period {number=}
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseElasticOut(period?: number, inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseElasticInOut interpolator.
         * @param period {number=}
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseElasticInOut(period?: number, inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseBounceIn interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseBounceIn(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseBounceOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBounceOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseBounceInOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBounceInOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseBackIn interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseBackIn(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseBackOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBackOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
        /**
         * Build an EaseBackInOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBackInOut(inverse?: boolean, pingpong?: boolean): TimeInterpolator;
    }
}
declare module cc.action {
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.AlphaActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * AlphaAction initializer object.
     *
     */
    interface AlphaActionInitializer extends ActionInitializer {
        /**
         * Start alpha value.
         * @member cc.action.AlphaActionInitializer#start
         * @type {number}
         */
        from?: number;
        /**
         * End alpha value.
         * @member cc.action.AlphaActionInitializer#end
         * @type {number}
         */
        to?: number;
    }
    /**
     * @class cc.action.AlphaAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's transparency.
     * <br>
     * Transparency values are defined by a number between 0 (fully transparent) and 1 (fully opaque).
     */
    class AlphaAction extends Action {
        /**
         * When the action is initialized with a target, this value is the original transparency value.
         * @member cc.action.AlphaAction#_originalAlpha
         * @type {number}
         * @private
         */
        _originalAlpha: number;
        /**
         * Action start alpha.
         * @member cc.action.AlphaAction#_startAlpha
         * @type {number}
         * @private
         */
        _startAlpha: number;
        /**
         * Action end alpha.
         * @member cc.action.AlphaAction#_endAlpha
         * @type {number}
         * @private
         */
        _endAlpha: number;
        /**
         * AlphaAction constructor.
         * @method cc.action.AlphaAction#constructor
         * @param data {cc.action.AlphaActionInitializer=}
         */
        constructor(data?: AlphaActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.AlphaAction#__createFromInitializer
         * @param data {cc.action.AlphaActionInitializer}
         * @private
         */
        __createFromInitializer(data?: AlphaActionInitializer): void;
        /**
         * Update target Node's transparency.
         * {@link cc.action.Action#update}
         * @method cc.action.AlphaAction#update
         * @override
         * @return {number} Applied transparency value.
         */
        update(delta: number, node: Node): any;
        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.AlphaAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.AlphaAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#from}
         * @method cc.action.AlphaAction#from
         * @override
         */
        from(alpha: number): Action;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.AlphaAction#to
         * @override
         */
        to(alpha: number): Action;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.AlphaAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Serialize the action current definition.
         * @method cc.action.AlphaAction#getInitializer
         * @returns {cc.action.AlphaActionInitializer}
         */
        getInitializer(): AlphaActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    import Point = cc.math.Point;
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.MoveActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * MoveAction initializer object.
     */
    interface MoveActionInitializer extends ActionInitializer {
        /**
         * Move from point.
         * @member cc.action.MoveActionInitializer#from
         * @type {cc.math.Point}
         */
        from?: cc.math.Point;
        /**
         * Move to point.
         * @member cc.action.MoveActionInitializer#to
         * @type {cc.math.Point}
         */
        to: cc.math.Point;
    }
    /**
     * @class cc.action.MoveAction
     * @extends cc.action.Action
     * @classdesc
     * This action applies to a node's position.
     * The action will traverse a line path.
     */
    class MoveAction extends Action {
        /**
         * Node's original x position.
         * @member cc.action.MoveAction#_originalX
         * @type {number}
         * @private
         */
        _originalX: number;
        /**
         * Node's original y position.
         * @member cc.action.MoveAction#_originalX
         * @type {number}
         * @private
         */
        _originalY: number;
        /**
         * Action initial X
         * @member cc.action.MoveAction#_x0
         * @type {number}
         * @private
         */
        _x0: number;
        /**
         * Action initial Y
         * @member cc.action.MoveAction#_y0
         * @type {number}
         * @private
         */
        _y0: number;
        /**
         * Action final X
         * @member cc.action.MoveAction#_x1
         * @type {number}
         * @private
         */
        _x1: number;
        /**
         * Action final Y
         * @member cc.action.MoveAction#_y1
         * @type {number}
         * @private
         */
        _y1: number;
        /**
         * Build a new MoveAction
         * @method cc.action.MoveAction#constructor
         * @param data {cc.action.MoveActionInitializer=}
         */
        constructor(data?: MoveActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.MoveAction#__createFromInitializer
         * @param initializer {cc.action.MoveActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?: MoveActionInitializer): void;
        /**
         * Update target Node's position.
         * {@link cc.action.Action#update}
         * @method cc.action.MoveAction#update
         * @override
         * @return {cc.math.Point} new Node position.
         */
        update(delta: number, node: Node): any;
        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.MoveAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.MoveAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#from}
         * @method cc.action.MoveAction#from
         * @override
         */
        from(point: Point): Action;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.MoveAction#to
         * @override
         */
        to(point: Point): Action;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.MoveAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Serialize the action current definition.
         * @method cc.action.MoveAction#getInitializer
         * @returns {cc.action.MoveActionInitializer}
         */
        getInitializer(): MoveActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    import Action = cc.action.Action;
    /**
     * @class cc.action.PropertyActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     */
    interface PropertyActionInitializer extends ActionInitializer {
    }
    /**
     * @class cc.action.PropertyInfo
     * @classdesc
     *
     * Internal helper Object to store a property information.
     * It stores:
     * <li>a property name, for example 'x' or 'p0.x'
     * <li>the property path. For example ['x'] or ['p0','x']
     * <li>original property value for a target object
     *
     * It is responsible for setting and getting the deep property path values too.
     *
     * Referenced properties MUST be numeric.
     */
    class PropertyInfo {
        _property: string;
        _start: number;
        _end: number;
        /**
         * Property Units. For example, when the property is not a numeric value but something like '250px'.
         * @member cc.action.PropertyInfo#_units
         * @type {string}
         * @private
         */
        _units: string;
        /**
         * If the property is a deep property, like 'p0.x' or 'a.b.c.d.value' this property will indicate it.
         * @member cc.action.PropertyInfo#_nested
         * @type {boolean}
         * @private
         */
        _nested: boolean;
        /**
         * A split('.') of the _property value.
         * @member cc.action.PropertyInfo#_propertyPath
         * @type {Array<string>}
         * @private
         */
        _propertyPath: string[];
        /**
         * Original property value.
         * @member cc.action.PropertyInfo#_original
         * @type {number}
         * @private
         */
        _original: number;
        /**
         * Property name.
         * @member cc.action.PropertyInfo#_property
         * @type {string}
         * @private
         */
        /**
         * Property start value.
         * @member cc.action.PropertyInfo#_start
         * @type {number}
         * @private
         */
        /**
         * Property end value.
         * @member cc.action.PropertyInfo#_end
         * @type {number}
         * @private
         */
        /**
         *
         * @param _property {string} property name.
         * @param _start {number} start value.
         * @param _end {number=} end value.
         */
        constructor(_property: string, _start?: number, _end?: number);
        /**
         * Set the property value in a target object
         * @method cc.action.PropertyInfo#setTargetValue
         * @param target {any}
         * @param v {number}
         */
        setTargetValue(target: any, v: number): void;
        /**
         * Get the property value from a target object
         * @method cc.action.PropertyInfo#getTargetValue
         * @param target {any}
         * @returns {number}
         */
        getTargetValue(target: any): number;
        /**
         * Set PropertyInfo original target value.
         * @param n {number}
         * @returns {cc.action.PropertyInfo}
         */
        setOriginal(n: number): PropertyInfo;
        /**
         * Get property original value in the original target object.
         * @method cc.action.PropertyInfo#getOriginal
         * @returns {number}
         */
        getOriginal(): number;
        /**
         * Clone the PropertyInfo object.
         * @method cc.action.PropertyInfo#clone
         * @returns {cc.action.PropertyInfo}
         */
        clone(): PropertyInfo;
        /**
         * Get the property path.
         * @method cc.action.PropertyInfo#getPath
         * @returns {string[]}
         */
        getPath(): string[];
    }
    /**
     * @class cc.action.PropertyAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to any arbitrary Object's properties. Could apply to multiple properties at the same time.
     * AlphaAction and RotateAction fit in the model of a PropertyInfo, but they are complete Actions for the shake of
     * clarity and performance.
     *
     * The properties a PropertyAction will handle must be simple properties, not Objects, only composed of a number and
     * an optional unit.
     *
     * A different set of properties can be specified in a call to <code>from</code> and <code>to</code>. Properties
     * specified not in both <code>from</code> and <code>to</code> at the same time, will get values either 'from' or
     * 'to' values when a call to <code>initWithTarget</code> is made.
     */
    class PropertyAction extends Action {
        /**
         * Properties the action manages.
         * @member cc.action.PropertyAction#_propertiesInfo
         * @type {Array<Object>}
         * @private
         */
        _propertiesInfo: Array<PropertyInfo>;
        /**
         * From properties values.
         * @member cc.action.PropertyAction#_from
         * @type {Object}
         * @private
         */
        _from: any;
        /**
         * To properties values.
         * @member cc.action.PropertyAction#_to
         * @type {Object}
         * @private
         */
        _to: any;
        /**
         * PropertyAction constructor.
         * @method cc.action.PropertyAction#constructor
         */
        constructor(data?: PropertyActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.PropertyAction#__createFromInitializer
         * @param data {cc.action.PropertyActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?: PropertyActionInitializer): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.PropertyAction#initWithTarget
         * @override
         */
        initWithTarget(node: any): void;
        /**
         * Update target Node's properties.
         * {@link cc.action.Action#update}
         * @method cc.action.PropertyAction#update
         * @override
         * @returns {Object} an Object with all the modified properties.
         */
        update(delta: number, node: any): any;
        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.PropertyAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: any): void;
        /**
         * {@link cc.action.Action#from}
         * @method cc.action.PropertyAction#from
         * @override
         */
        from(props: any): Action;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.PropertyAction#to
         * @override
         */
        to(props: any): Action;
        /**
         * Helper function for cloning this property.
         * @memver cc.action.PropertyAction#__cloneProperties
         * @returns {Array<PropertyInfo>}
         * @private
         */
        __cloneProperties(): Array<PropertyInfo>;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.PropertyAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Serialize the action current definition.
         * @method cc.action.PropertyAction#getInitializer
         * @returns {cc.action.PropertyActionInitializer}
         */
        getInitializer(): PropertyActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.RotateActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * RotateAction initializer object
     */
    interface RotateActionInitializer extends ActionInitializer {
        /**
         * Start rotation angle value
         * @member cc.action.RotateActionInitializer#from
         * @type {number}
         */
        from?: number;
        /**
         * End rotation angle value
         * @member cc.action.RotateActionInitializer#to
         * @type {number}
         */
        to: number;
    }
    /**
     * @class cc.action.RotateAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's rotation angle.
     * The rotation angle is defined in degrees.
     */
    class RotateAction extends Action {
        /**
         * Node's original rotation angle.
         * @member cc.action.RotateAction#_originalAngle
         * @type {number}
         * @private
         */
        _originalAngle: number;
        /**
         * Action start angle
         * @member cc.action.RotateAction#_startAngle
         * @type {number}
         */
        _startAngle: number;
        /**
         * Action end angle
         * @member cc.action.RotateAction#_endAngle
         * @type {number}
         */
        _endAngle: number;
        /**
         * Build a new RotateAction instance.
         * @method cc.action.RotateAction#constructor
         * @param data {cc.action.RotateActionInitializer=}
         */
        constructor(data?: RotateActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.RotateAction#__createFromInitializer
         * @param initializer {cc.action.RotateActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?: RotateActionInitializer): void;
        /**
         * Update target Node's rotation angle.
         * {@link cc.action.Action#update}
         * @method cc.action.RotateAction#update
         * @override
         * @return {number} new Node rotation angle.
         */
        update(delta: number, node: Node): any;
        /**
         * Capture before-application Node's rotation angle.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.RotateAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.RotateAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#from}
         * @method cc.action.RotateAction#from
         * @override
         */
        from(angle: number): Action;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.RotateAction#to
         * @override
         */
        to(angle: number): Action;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.RotateAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Serialize the action current definition.
         * @method cc.action.RotateAction#getInitializer
         * @returns {cc.action.RotateActionInitializer}
         */
        getInitializer(): RotateActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    import Point = cc.math.Point;
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.ScaleActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * Scale action initializer object.
     *
     */
    interface ScaleActionInitializer extends ActionInitializer {
        /**
         * Start scale value. The scale is for x and y axis.
         * @member cc.action.ScaleActionInitializer#from
         * @type {cc.math.Point=}
         */
        from?: cc.math.Point;
        /**
         * End scale value. The scale is for x and y axis.
         * @member cc.action.ScaleActionInitializer#to
         * @type {cc.math.Point}
         */
        to: cc.math.Point;
    }
    /**
     * @class cc.action.ScaleAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a Node's scale values.
     */
    class ScaleAction extends Action {
        /**
         * Node's original x axis scale.
         * @member cc.action.ScaleAction#_originalScaleX
         * @type {number}
         * @private
         */
        _originalScaleX: number;
        /**
         * Node's original y axis scale.
         * @member cc.action.ScaleAction#_originalScaleY
         * @type {number}
         * @private
         */
        _originalScaleY: number;
        /**
         * Action start x axis Scale.
         * @member cc.action.ScaleAction#_scaleX0
         * @type {number}
         */
        _scaleX0: number;
        /**
         * Action start y axis Scale.
         * @member cc.action.ScaleAction#_scaleY0
         * @type {number}
         */
        _scaleY0: number;
        /**
         * Action end x axis Scale.
         * @member cc.action.ScaleAction#_scaleX1
         * @type {number}
         */
        _scaleX1: number;
        /**
         * Action end y axis Scale.
         * @member cc.action.ScaleAction#_scaleY1
         * @type {number}
         */
        _scaleY1: number;
        /**
         * Build a new ScaleAction instance.
         * @param data {cc.action.ScaleActionInitializer=}
         */
        constructor(data?: ScaleActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.ScaleAction#__createFromInitializer
         * @param data {cc.action.ScaleActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?: ScaleActionInitializer): void;
        /**
         * Update target Node's scale.
         * {@link cc.action.Action#update}
         * @method cc.action.ScaleAction#update
         * @override
         * @returns {cc.math.Vector} new node's scale values.
         */
        update(delta: number, node: Node): any;
        /**
         * Capture before-application Node's scale for both axis x and y.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.ScaleAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.ScaleAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#from}
         * @method cc.action.ScaleAction#from
         * @override
         */
        from(point: Point): Action;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.ScaleAction#to
         * @override
         */
        to(point: Point): Action;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.ScaleAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Serialize the action current definition.
         * @method cc.action.ScaleAction#getInitializer
         * @returns {cc.action.ScaleActionInitializer}
         */
        getInitializer(): ScaleActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.SequenceActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * Sequence action initializer object.
     */
    interface SequenceActionInitializer extends ActionInitializer {
        /**
         * Is this Action Sequence or Spawn ?
         * @member cc.action.SequenceActionInitializer#sequential
         * @type {boolean}
         */
        sequential?: boolean;
        actions?: ActionInitializer[];
    }
    /**
     * @class cc.action.SequenceAction
     * @extends cc.action.Action
     * @classdesc
     *
     * SequenceAction is a collection of either parallel or sequential actions.
     * It is useful for grouping actions in a more convenient way.
     * <br>
     * This action maps to previous API versions' Sequence and Spawn, but internally works in a complete different way.
     * <br>
     * A Sequence, constraints its contained Actions to its own duration. That means that if the Sequence Actions are not
     * well setup relatively to the Sequence timing, Actions could not end playing, or callbacks could not be notified
     * appropriately.
     *
     * <li>Internally, a Sequence does not modify a Node's properties. It just choreographs the time for its children
     *  Actions. Hece there's no need to call <code>from</code> or <code>to</code> methods. This means that setting
     *  a Sequence as relative has no impact.
     * <li>A Sequence can contain other Sequences to the desired nesting level.
     * <li>A repeating ActionSequence will repeat its contained actions.
     * <li>A Sequence, if is sequential=true, will sequentialize contained actions, making one start when the previous one
     * ends. If it is sequential=false, Actions will happen at the same time.
     * <li>By default a Sequence Action will conform its duration to the one resulting of the contained Actions. It will
     * have special heuristics for sequential and not sequential behaviors.
     */
    class SequenceAction extends Action {
        /**
         * Collection of Sequenced actions.
         * @member cc.action.SequenceAction#_actions
         * @type {Array<cc.action.Action>}
         * @private
         */
        _actions: Array<Action>;
        /**
         * Configures this action as Sequence or Spawn.
         * @member cc.action.SequenceAction#_sequential
         * @type {boolean}
         */
        _sequential: boolean;
        _prevOnRepeat: ActionCallbackRepeatCallback;
        /**
         * Build a new Sequence action.
         * @method cc.action.SequenceAction#constructor
         * @param data {cc.action.SequenceActionInitializer=}
         */
        constructor(data?: SequenceActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.SequenceAction#__createFromInitializer
         * @param data {cc.action.SequenceActionInitializer}
         * @private
         */
        __createFromInitializer(data?: SequenceActionInitializer): void;
        /**
         * Set onRepeat callback. This method is overridden since repeating sequences must have a custom onRepeat
         * implementation.
         * @method cc.action.SequenceAction#onRepeat
         * @param callback {cc.action.ActionCallbackRepeatCallback}
         * @returns {cc.action.SequenceAction}
         */
        onRepeat(callback: ActionCallbackRepeatCallback): Action;
        /**
         * When a Sequence repeats, it must recursively clear the status of all its children Actions.
         * @method cc.action.SequenceAction#recursivelySetCreatedStatus
         * @param target
         */
        recursivelySetCreatedStatus(target: any): void;
        /**
         * Get the last Action on the sequence.
         * @method cc.action.SequenceAction#getLastAction
         * @returns {cc.action.Action}
         */
        getLastAction(): Action;
        /**
         * Recursive set created status implementation.
         * @method cc.action.SequenceAction#__recursivelySetCreatedStatus
         * @param target {object}
         * @private
         */
        __recursivelySetCreatedStatus(target: any): void;
        /**
         * When an action is added, or has its duration, start time, or delay modified, the Sequence duration will be
         * recalculated.
         * @method cc.action.SequenceAction#__updateDuration
         * @override
         * @private
         */
        __updateDuration(): void;
        /**
         * If this sequence has sequential behavior, this method will sequentialize in time all the Actions.
         * @method cc.action.SequenceAction#__sequentializeStartAndDuration
         * @private
         */
        __sequentializeStartAndDuration(): void;
        /**
         * Add an Action to the Sequence.
         * <br>
         * Added Actions can be other Sequences.
         * <br>
         * Adding actions triggers upwards recursive duration recalculation.
         * @method cc.action.SequenceAction#addAction
         * @param a {cc.action.Action}
         * @returns {cc.action.SequenceAction}
         */
        addAction(a: Action): Action;
        /**
         * Do Sequence application process.
         * <br>
         * Do not call directly.
         *
         * @param delta {number} elapsed time between frames.
         * @param time {number} absolute Action time.
         * @param node {cc.node.Node} target node.
         * @private
         * @method cc.action.SequenceAction#__stepImpl
         */
        __stepImpl(delta: number, time: number, node: Node): void;
        /**
         * Internal method to apply children actions to a target Node.
         * @method cc.action.SequenceAction#__actionApply
         * @param time {number} Time relative to the Sequence to apply a child Action at.
         * @param node {cc.node.Node} target Node to apply actions to.
         * @private
         */
        __actionApply(time: number, node: Node): void;
        /**
         * Clone the Action and all its children Actions.
         * @method cc.action.SequenceAction#__cloneImpl
         * @override
         * @inheritDoc
         */
        __cloneImpl(): Action;
        /**
         * Get Sequence's number of actions.
         * @method cc.action.SequenceAction#getNumActions
         * @returns {number}
         */
        getNumActions(): number;
        /**
         * Get action at index.
         * @method cc.action.SequenceAction#getAction
         * @param i {number}
         * @returns {cc.action.Action}
         */
        getAction(i: number): Action;
        /**
         * @override
         * @inheritDoc
         */
        setReversed(): Action;
        /**
         * Set the Sequence as Sequence (sequential=true) or Spawn (sequential=false).
         * @method cc.action.SequenceAction#setSequential
         * @param b {boolean}
         */
        setSequential(b: boolean): void;
        /**
         * Serialize the action current definition.
         * @method cc.action.SequenceAction#getInitializer
         * @returns {cc.action.SequenceActionInitializer}
         */
        getInitializer(): SequenceActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    import RGBAColor = cc.math.RGBAColor;
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.TintActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * TintAction initializer object.
     *
     */
    interface TintActionInitializer extends ActionInitializer {
        /**
         * Tint initial color
         * @method cc.action.TintActionInitializer#from
         * @type {cc.math.RGBAColor}
         */
        from?: RGBAColor;
        /**
         * Tint final color
         * @method cc.action.TintActionInitializer#to
         * @type {cc.math.RGBAColor}
         */
        to: RGBAColor;
    }
    /**
     * @class cc.action.TintAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a Node's color.
     * The tint color is not the actual node's color, it is a multiplicative value for color or texture.
     * Tint components are values between 0 and 1.
     */
    class TintAction extends Action {
        /**
         * Node's original color.
         * @member cc.action.TintAction#_originalColor
         * @type {cc.math.RGBAColor}
         * @private
         */
        _originalColor: RGBAColor;
        /**
         * Action start color.
         * @member cc.action.TintAction#_startColor
         * @type {cc.math.RGBAColor}
         */
        _startColor: RGBAColor;
        /**
         * Action end color.
         * @member cc.action.TintAction#_endColor
         * @type {cc.math.RGBAColor}
         */
        _endColor: RGBAColor;
        /**
         * Build a new TintAction.
         * @method cc.action.TintAction#constructor
         * @param data {cc.action.TintActionInitializer=}
         */
        constructor(data?: TintActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.TintAction#__createFromInitializer
         * @param data {cc.action.TintActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?: TintActionInitializer): void;
        /**
         * Update target Node's tint color.
         * {@link cc.action.Action#update}
         * @method cc.action.TintAction#update
         * @override
         * @returns {cc.math.RGBAColor} new node's tint values.
         */
        update(delta: number, node: Node): any;
        /**
         * Capture before-application Node's tint color.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.TintAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.TintAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#from}
         * @method cc.action.TintAction#from
         * @override
         */
        from(color: RGBAColor): Action;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.TintAction#to
         * @override
         */
        to(color: RGBAColor): Action;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.TintAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Serialize the action current definition.
         * @method cc.action.TintAction#getInitializer
         * @returns {cc.action.TintActionInitializer}
         */
        getInitializer(): TintActionInitializer;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.action {
    import Action = cc.action.Action;
    import Node = cc.node.Node;
    import SpriteFrame = cc.node.sprite.SpriteFrame;
    import Animation = cc.node.sprite.Animation;
    /**
     * @class cc.action.AnimateActionInitializer
     * @extends ActionInitializer
     * @interface
     * @classdesc
     *
     * AnimateAction initializer object.
     * AnimateAction objects don't have a from and to clauses, but a animation name.
     *
     */
    interface AnimateActionInitializer extends ActionInitializer {
        /**
         * Animation name.
         * The animation must exist in the AssetManager.
         * @member cc.action.AnimateActionInitializer#animationName
         */
        animationName: string;
    }
    /**
     * @class cc.action.AnimateAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action changes Sprite's images in a time basis.
     * <p>
     *     It handles an instance of <code>cc.node.sprite.Animation</code> which is collection of SpriteFrame objects.
     *     Each SpriteFrame references an image and a rect on the image. The action, selects a SpriteFrame on
     *     the Animation based on time keyframing.
     * <p>
     *     Even though an Animation object has control over how many times the animation will be repeated, calling
     *     <code>action.setRepeatTimes(times);</code> or <code>action.setRepeatForever();</code> will override the
     *     Animation value in favor of the newly set one.
     * <p>
     *     Warning. This action expects as its target a @link {cc.node.Sprite} instance and not a @link {cc.node.Node}
     *     like the other actions. The target supplied to this Action must have a <code>setSpriteFrame</code> method
     *     otherwise an undefined error will be thrown.
     *
     *
     *
     * @see {cc.node.sprite.Animation}
     *
     */
    class AnimateAction extends Action {
        /**
         * Original SpriteFrame for the Action target node.
         * @member cc.action.AnimateAction#_originalSpriteFrame
         * @type {cc.node.sprite.SpriteFrame}
         * @private
         */
        _originalSpriteFrame: SpriteFrame;
        /**
         * Animation.
         * @member cc.action.AnimateAction#_animation
         * @type {cc.node.sprite.Animation}
         * @private
         */
        _animation: Animation;
        /**
         * Create a new Animate action instance.
         * @method cc.action.AnimateAction#constructor
         * @param data {cc.node.sprite.Animation}
         */
        constructor(data?: AnimateActionInitializer | Animation);
        /**
         * Initialize the action with an initializer Object
         * @method cc.action.AnimateAction#__createFromInitializer
         * @param data {cc.action.AnimateActionInitializer}
         */
        __createFromInitializer(data?: AnimateActionInitializer): void;
        /**
         * Set the Animation object instance.
         * @method cc.action.AnimateAction#setAnimation
         * @param data {cc.node.sprite.Animation}
         */
        setAnimation(data: Animation): AnimateAction;
        /**
         * Set the Animate action duration.
         * Will always fallback to set the Animation duration.
         * @method cc.action.AnimateAction##setDuration
         * @param d
         */
        setDuration(d: number): AnimateAction;
        /**
         * Update target Node's SpriteFrame.
         * {@link cc.action.Action#update}
         * @method cc.action.AnimateAction#update
         * @override
         * @return {number} Applied transparency value.
         */
        update(normalizedTime: number, target: Node): any;
        /**
         * Calculate one repetition duration. Must be explictly set for V3 bacwards compatiblity and
         * a call to Animate with an still loading animation. This is messy and wrong, but must be.
         * @method cc.action.AnimateAction#getOneRepetitionDuration
         * @returns {number}
         */
        getOneRepetitionDuration(): number;
        /**
         * This method does nothing.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.AnimateAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * Initialize the action with a target node.
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.AnimateAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.AnimateAction#to
         * @override
         */
        to(a: Animation): AnimateAction;
        /**
         * Specific clone implementation function
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.AnimateAction#__cloneImpl
         * @override
         * @private
         */
        __cloneImpl(): AnimateAction;
        /**
         * Stop the Action. If at Action initialization time a originalSpriteFrame was set, and the Animation specifies
         * restore original frame, the original SpriteFrame is set.
         * @param node
         */
        stop(node: Node): void;
        /**
         * Get current action state initializer object.
         * @method cc.action.AnimateAction#getInitializer
         * @returns {cc.action.AnimateActionInitializer}
         */
        getInitializer(): AnimateActionInitializer;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.action {
    import Point = cc.math.Point;
    import Segment = cc.math.path.Segment;
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.PathActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * PathAction initializer object.
     */
    interface PathActionInitializer extends ActionInitializer {
        /**
         * Path traversal segment
         * pending: SegmentInitializer
         * @member cc.action.PathActionInitializer#segment
         * @type {cc.math.path.Segment}
         */
        segment: Segment;
    }
    /**
     * @class cc.action.PathAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's position.
     * The action will traverse a Segment path which can be a simple line or a complex path built out of a collection
     * of Segments and Paths. When traversing through out a simple linear path, prefer MoveAction in favor of this one.
     *
     * <p>
     *     Warning
     * <p>
     * The behavior for relative PathAction (equivalent for example to BezierBy in CocosJS V3 API) is intuitive: the
     * node will add the resulting traversal path to the Node position.
     * For non relative PathActions (for example, the older V3 BezierTo action) is not that clear:
     * + upon a call to <code>initWithNode</code> the Path points will have substracted the current node position and
     *   the first path point will be 0,0 (like in relative actions).
     * + upon a call to <code>update</code> the Path will be solved, and then will have added the node's position
     *   captured during the call to <code>initWithNode</code>.
     *
     * This means, the absolute PathAction will be treated as a relative action, with a modified path.
     *
     * @see cc.action.MoveAction
     */
    class PathAction extends Action {
        /**
         * Node's original x position.
         * @member cc.action.PathAction#_originalX
         * @type {number}
         * @private
         */
        _originalX: number;
        /**
         * Node's original y position.
         * @member cc.action.PathAction#_originalX
         * @type {number}
         * @private
         */
        _originalY: number;
        /**
         * Segment to traverse.
         * @member cc.action.PathAction#_segment
         * @type {cc.math.path.Segment}
         * @private
         */
        _segment: Segment;
        /**
         * Has the path been adjusted.
         * @member cc.action.PathAction#_pathAdjusted
         * @type {boolean}
         * @private
         */
        _pathAdjusted: boolean;
        /**
         * Is the target node tangentially rotated while traversing the path ?
         * @member cc.action.PathAction#_adjustTangentialRotation
         * @type {boolean}
         * @private
         */
        _adjustTangentialRotation: boolean;
        /**
         * If the target node is tangentially rotated, will rotation angles be -PI..PI or constrained to always show
         * the target vertically not flipped ?
         * @member cc.action.PathAction#_tangentialRotationFullAngle
         * @type {boolean}
         * @private
         */
        _tangentialRotationFullAngle: boolean;
        /**
         * Tangential rotation must know whether the animation sprite frames are left-to-right drawn or right-to-left.
         * By default left-to-right is assumed, but in case it is not, this variable must be set to false.
         * @member cc.action.PathAction#_spriteOrientationLR
         * @type {boolean}
         * @private
         */
        _spriteOrientationLR: boolean;
        /**
         * Build a new PathAction
         * @method cc.action.PathAction#constructor
         * @param data {cc.action.PathActionInitializer=}
         */
        constructor(data?: PathActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.PathAction#__createFromInitializer
         * @param data {cc.action.PathActionInitializer}
         * @private
         */
        __createFromInitializer(data?: PathActionInitializer): void;
        /**
         * Update target Node's position.
         * {@link cc.action.Action#update}
         * @method cc.action.PathAction#update
         * @override
         * @return {cc.math.Point} new Node position.
         */
        update(delta: number, node: Node): any;
        /**
         * Calculate a tangential angle based on the current path position.
         * It the node is a sprite, it will also flip the node if necessary based on the property:
         * _tangentialRotationFullAngle and _spriteOrientationLR
         *
         * @method cc.action.PathAction#__getTangentialAngle
         * @param node {cc.node.Node|cc.node.Sprite}
         * @param lefttoright {boolean}
         * @param angle {number}
         * @returns {number}
         * @private
         */
        __getTangentialAngle(node: Node, lefttoright: boolean, angle: number): number;
        /**
         * Restart the action.
         * @method cc.action.PathAction#restart
         * @returns {cc.action.PathAction}
         */
        restart(): PathAction;
        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.PathAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.PathAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#from}
         * @method cc.action.PathAction#from
         * @override
         */
        from(segment: Segment): Action;
        /**
         * {@link cc.action.Action#to}
         * @method cc.action.PathAction#to
         * @override
         */
        to(point: Point): Action;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.PathAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Sets tangential rotation and optionally whether the rotation will be of 360 degrees, or the sprite won't be
         * vertically flipped.
         * @method cc.action.PathAction#adjustRotation
         * @param a {boolean} enable tangential rotation.
         * @param fullAngles {boolean=} allow vertically flipping angles or not.
         * @returns {cc.action.PathAction}
         */
        adjustRotation(a: boolean, fullAngles?: boolean): PathAction;
        /**
         * By default, tangential rotation assumes left-to-right sprites.
         * @method cc.action.PathAction#setSpriteOrientationIsLeftToRight
         * @param v {boolean} left-to-right or not.
         * @returns {cc.action.PathAction}
         */
        setSpriteOrientationIsLeftToRight(v: boolean): PathAction;
        /**
         * Serialize the action current definition.
         * @method cc.action.PathAction#getInitializer
         * @returns {cc.action.PathActionInitializer}
         */
        getInitializer(): PathActionInitializer;
    }
}
declare module cc.action {
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    import Vector = cc.math.Vector;
    /**
     * @class cc.action.JumpActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     * @classdesc
     *
     * JumpAction initialization helper object.
     *
     */
    interface JumpActionInitializer extends ActionInitializer {
        /**
         * Number of jumps
         * @member cc.action.JumpActionInitializer#jumps
         * @type {number}
         */
        jumps: number;
        /**
         * Jump amplitude (max height)
         * @member cc.action.JumpActionInitializer#amplitude
         * @type {number}
         */
        amplitude: number;
        /**
         * Start jump position.
         * @member cc.action.JumpActionInitializer#position
         * @type {cc.math.Vector}
         */
        position: cc.math.Point;
    }
    /**
     * @class cc.action.JumpAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to a node's position by bouncing up to a given altitude.
     */
    class JumpAction extends Action {
        /**
         * Node's original x position.
         * @member cc.action.MoveAction#_originalX
         * @type {number}
         * @private
         */
        _originalX: number;
        /**
         * Node's original y position.
         * @member cc.action.JumpAction#_originalX
         * @type {number}
         * @private
         */
        _originalY: number;
        /**
         * Action jump height.
         * @member cc.action.JumpAction#_amplitude
         * @type {number}
         * @private
         */
        _amplitude: number;
        /**
         * Number of jumps to perform.
         * @member cc.action.JumpAction#_jumps
         * @type {number}
         * @private
         */
        _jumps: number;
        _jumpTo: Vector;
        /**
         * JumpAction constructor.
         * @method cc.action.JumpAction#constructor
         * @param data {cc.action.JumpActionInitializer=}
         */
        constructor(data?: JumpActionInitializer);
        /**
         * Initialize the action with an initializer object.
         * @method cc.action.JumpAction#__createFromInitializer
         * @param data {cc.action.JumpActionInitializer}
         * @private
         */
        __createFromInitializer(data?: JumpActionInitializer): void;
        /**
         * Update target Node's position.
         * {@link cc.action.Action#update}
         * @method cc.action.JumpAction#update
         * @override
         * @return {number} Applied transparency value.
         */
        update(delta: number, node: Node): any;
        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.JumpAction#solveInitialValues
         * @override
         */
        solveInitialValues(node: Node): void;
        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.JumpAction#initWithTarget
         * @override
         */
        initWithTarget(node: Node): void;
        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.JumpAction#__cloneImpl
         * @override
         */
        __cloneImpl(): Action;
        /**
         * Serialize the action current definition.
         * @method cc.action.JumpAction#getInitializer
         * @returns {cc.action.JumpActionInitializer}
         */
        getInitializer(): JumpActionInitializer;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.action {
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    /**
     * @class cc.action.ActionInfo
     * @classdesc
     *
     * This class is the information an <code>ActionManager</code> manages and keeps track of an
     * <code>Action</code> and a <code>Target</code>. It is an internal class for ActionManagers
     * <p>
     * You will have no direct interaction with this class.
     *
     */
    class ActionInfo {
        _actionManager: ActionManager;
        _target: Node;
        _action: Action;
        _chain: ActionInfo;
        constructor(_actionManager: ActionManager, _target: Node, _action?: Action);
        __action(bh: Action): Action;
        action(action: Action): Action;
        step(elapsedTime: number): void;
        isFinished(): boolean;
        pause(): void;
        resume(): void;
        setChain(actionInfo: ActionInfo): void;
        stop(): void;
    }
    /**
     * @class cc.action.ActionManager
     * @classdesc
     *
     * An <code>ActionManager</code> object manages and handles Actions ({@link cc.action.Action}).
     * Each <code>Scene</code> has an instance for managing its nodes Actions, and each <code>Director</code> has
     * another instance for handling Scene <code>Transitions</code> ({@link cc.transition.Transition}).
     * <br>
     * The ActionManager has a virtual timeline fed by Directors or Scenes.
     * On average, no direct interaction with this class will happen.
     * <br>
     * <p>
     *     ActionManager instances have a scheduler implementation as an Action of type: SchedulerQueue
     */
    class ActionManager {
        /**
         * Collection of pairs of Node-Action to execute.
         * @member cc.action.ActionManager#_actionInfos
         * @type {Array<cc.action.ActionInfo>}
         * @private
         */
        _actionInfos: Array<ActionInfo>;
        /**
         * In V4 a scheduler is an Action, integrated in the ActionManager.
         * This is the SchedulerQueue implementation.
         * @member cc.action.ActionManager#_scheduler
         * @type {cc.action.SchedulerQueue}
         * @private
         */
        _scheduler: SchedulerQueue;
        /**
         * Create a new ActionManager instance object.
         * The developer will surely never interact directly with this object.
         * The why to work with it is by calling Node Action/Scheduler methods.
         * @member cc.action.ActionManager#constructor
         */
        constructor();
        /**
         * Get the Scheduler instance.
         * @member cc.action.ActionManager#getScheduler
         * @returns {cc.action.SchedulerQueue}
         */
        getScheduler(): SchedulerQueue;
        /**
         * Associate a target with an action.
         * This method is useful when you pretend to reuse predefined behavior objects.
         * @method cc.action.ActionManager#scheduleActionForNode
         * @param target {cc.node.Node}
         * @param action {cc.action.Action}
         * @returns {ActionInfo}
         */
        scheduleActionForNode(target: any, action: Action): ActionManager;
        /**
         * PENDING use binary search.
         * Stop an action for a node with the given tag.
         * @param target {cc.node.Node} node with action.
         * @param tag {string} action tag.
         * @returns {cc.action.ActionManager}
         */
        stopNodeActionByTag(target: any, tag: string): ActionManager;
        /**
         * Stop the Action objects associated with a target object.
         * @param target
         * @returns {cc.action.ActionManager}
         */
        stopActionsForNode(target: any): ActionManager;
        /**
         * Helper method to build a new ActionInfo with basic information.
         * @method cc.action.ActionManager#__newActionInfo
         * @returns {cc.action.ActionInfo}
         * @private
         */
        __newActionInfo(): ActionInfo;
        /**
         * Execute all scheduled Actions in this ActionManager.
         * The elapsed time is translated into the desired game time units.
         * @see cc.action.TIMEUNITS
         * @method cc.action.ActionManager#step
         * @param elapsedTime {number} milliseconds.
         */
        step(elapsedTime: number): void;
        /**
         * Pause all Actions.
         * @method cc.action.ActionManager#pauseAll
         */
        pauseAll(): void;
        /**
         * Resume all Paused Actions.
         * @method cc.action.ActionManager#resumeAll
         */
        resumeAll(): void;
        /**
         * Get the number of scheduled actions (in any state).
         * @method cc.action.ActionManager#getNumActions
         * @returns {number} number of actions.
         */
        getNumActions(): number;
        /**
         * Get the number of scheduled actions (in any state) for a target.
         * @method cc.action.ActionManager#getNumActionsForTarget
         * @param target {object} target to check for actions.
         * @returns {number} number of actions for the target.
         */
        getNumActionsForTarget(target: any): number;
        /**
         * Get the number of scheduled actions (in any state).
         * @method cc.action.ActionManager#getNumActionsForNode
         * @param node {object} target to check for actions.
         * @returns {number} number of actions for the Node.
         *
         * @deprecated use getNumActionsForTarget instead.
         */
        getNumActionsForNode(node: any): number;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.action {
    import Action = cc.action.Action;
    import Node = cc.node.Node;
    /**
     * @name SchedulerQueueTaskStatus
     * @memberof cc.action
     * @enum
     * @tsenum
     */
    enum SchedulerQueueTaskStatus {
        RUNNING = 0,
        PAUSED = 1,
        ENDED = 2,
    }
    /**
     * Callback definition for a scheduler task.
     * @memberOf cc.action
     * @callback SchedulerTaskCallback
     * @param delta {number} elsapsed time since last call
     * @param target {object=} target object for which the callback was invoked
     */
    interface SchedulerTaskCallback {
        (delta: number, target?: any): void;
    }
    /**
     * @class cc.action.SchedulerQueueTask
     * @classdesc
     *
     * This object represents a Scheduler task.
     * <p>
     * It holds information for an object and a function on that object, as well as time info such as expected
     * repetitions, delay before time count, and the interval between repetitions.
     * <p>
     * It also holds logic for knowing whether the task should be fired or not.
     * A task is fired by calling a function in the context of a target object ie <code>callback.call(target)</code>.
     * <p>
     *     A task without target, will only invoke the callback function.
     */
    class SchedulerQueueTask {
        /**
         * Target object.
         * @member cc.action.SchedulerQueueTask#_target
         * @type {object}
         * @private
         */
        _target: any;
        /**
         * Fire this callback whenever the elapsed time mets.
         * @member cc.action.SchedulerQueueTask#_callback
         * @type {cc.action.SchedulerTaskCallback}
         * @private
         */
        _callback: any;
        /**
         * wait this milliseconds before account time.
         * @member cc.action.SchedulerQueueTask#_startTime
         * @type {function}
         * @private
         */
        _startTime: number;
        /**
         * Custom interval call for a Task
         * @member cc.action.SchedulerQueueTask#_interval
         * @type {number}
         * @private
         */
        _interval: number;
        /**
         * Repetition multishot task. Will repeat until paused or cancelled or shot count ends.
         * @member cc.action.SchedulerQueueTask#_repeat
         * @type {number}
         * @private
         */
        _repeat: number;
        /**
         * Time to wait before counting time.
         * @member cc.action.SchedulerQueueTask#_delay
         * @type {number}
         * @private
         */
        _delay: number;
        /**
         * Internal task state
         * @member cc.action.SchedulerQueueTask#_status
         * @see {cc.action.SchedulerQueueTaskStatus}
         * @type {cc.action.SchedulerQueueTaskStatus}
         * @private
         */
        _status: SchedulerQueueTaskStatus;
        /**
         * Time when the last task repetition was executed.
         * @member cc.action.SchedulerQueueTask#_prevCallbackNotificationTime
         * @type {number}
         * @private
         */
        _prevCallbackNotificationTime: number;
        /**
         * Previous task tick time.
         * @member cc.action.SchedulerQueueTask#_prevTime
         * @type {number}
         * @private
         */
        _prevTime: number;
        /**
         * Task priority.
         * Tasks are sorted by this value. First in execution will be negative values.
         * @member cc.action.SchedulerQueueTask#_priority
         * @type {number}
         * @private
         */
        _priority: number;
        /**
         * Build a new SchedulerQueueTask instance.
         * @method cc.action.SchedulerQueueTask#constructor
         */
        constructor();
        /**
         * Execute a task.
         * The execution takes into account whether the task repeats and the interval repetition.
         * @method cc.action.SchedulerQueueTask#step
         * @param currentTime {number} current scheduler time
         * @returns {boolean} whether the task must de deleted.
         */
        step(currentTime: number): void;
        __stepForRepetition(currentTime: number): void;
        /**
         * Invoke the callback.
         * If target is specified for the task<br>
         *    the callback is invoked like: callback.call( target, elapsedTime, target )<br>
         * else<br>
         *    the callback is invoked like: callback(elapsedTime, target);
         *
         * @method cc.action.SchedulerQueueTask#__doCallback
         * @param elapsedTime {number} time between two consecutive task fires.
         * @private
         */
        __doCallback(elapsedTime: number): void;
        __doCallCallback(elapsedTime: number): void;
        /**
         * Pause the task. If in this state, the task is not fired.
         * @method cc.action.SchedulerQueueTask#pause
         */
        pause(): void;
        /**
         * Resume the current task.
         * @method cc.action.SchedulerQueueTask#resume
         */
        resume(): void;
        /**
         * End the task. Ending turns the task to be elligible for unscheduling and recycling.
         * @method cc.action.SchedulerQueueTask#end
         */
        end(): void;
        /**
         * Whether the task is ended.
         * @method cc.action.SchedulerQueueTask#isEnded
         * @returns {boolean}
         */
        isEnded(): boolean;
        /**
         * Adjust the task time with the Queue time the task is running in.
         * @method cc.action.SchedulerQueueTask#adjustTime
         * @param time {number}
         */
        adjustTime(time: number): void;
    }
    /**
     * @class cc.action.SchedulerQueueUpdateTask
     * @classdesc
     * @extends SchedulerQueueTask
     *
     * This object represents a scheduler task which calls the update method for a given Object, does not have to be
     * a <code>cc.node.Node</code> object.
     *
     * This task type extends a <code>cc.action.SchedulerQueueTask</code> object and only calls the update method,
     * that is, there must be a target object (mandatory at construction) and the callback parameter is omitted.
     * <p>
     * This object makes calling <code>cc.node.Node#scheduleUpdate</code> and then changing the update method safe.
     *
     */
    class SchedulerQueueUpdateTask extends SchedulerQueueTask {
        constructor();
        __doCallCallback(elapsedTime: number): void;
    }
    /**
     * @class cc.action.SchedulerQueue
     * @extends cc.action.Action
     * @classdesc
     *
     * <p>
     * A scheduler queue manages a collection of Tasks. The tasks are scheduled for single or multi shot execution and
     * are guaranteed to execute at the closest schedule interval time. Internally, a SchedulerQueue is an Action.
     * <p>
     * A task is composed of a target, a function (which is a function the target object has) and some time data.
     * The scheduler will take no action to control whether the supplied function exists for the target object.
     * <p>
     * If a task already exists with the data supplied to the <code>schedule</code> function the task interval will be
     * updated with the new data supplied.
     * <p>
     * Unscheduled actions are removed in the next tick of execution, but actions that are ended are not executed
     * nonetheless.
     * <p>
     * Tasks scheduled from other task execution, are added and executed in the next tick of execution.
     * <p>
     *     Tasks are kept sorted in ascending priority order. A new task added to the scheduler with a priority
     *     equals to any other task will be added after the existing one.
     *
     * @see {cc.action.Action}
     */
    class SchedulerQueue extends Action {
        /**
         * The collection of scheduled tasks.
         * @type {Array<cc.action.SchedulerQueueTask>}
         * @member cc.action.SchedulerQueue#_tasks
         * @private
         */
        _tasks: SchedulerQueueTask[];
        /**
         * Build a new SchedulerQueue instance.
         * These objects are managed automatically by scenes and should not need to be built manually.
         * @method cc.action.SchedulerQueue#constructor
         */
        constructor();
        /**
         * SchedulerQueue repeats forever by default.
         * @method cc.action.SchedulerAction#setRepeatForever
         * @returns {cc.action.SchedulerQueue}
         */
        setRepeatForever(): Action;
        /**
         * SchedulerQueue repeats forever by default.
         * @method cc.action.SchedulerAction#setRepeatTimes
         * @param n {number}
         * @returns {cc.action.SchedulerQueue}
         */
        setRepeatTimes(n: number): Action;
        /**
         * SchedulerQueue have 0 duration.
         * @method cc.action.SchedulerAction#setDuration
         * @param d {number}
         * @returns {cc.action.SchedulerQueue}
         */
        setDuration(d: number): Action;
        /**
         * SchedulerQueue can't have time info redefined.
         * @method cc.action.SchedulerAction#timeInfo
         * @param delay {number}
         * @param duration {number}
         * @returns {cc.action.SchedulerQueue}
         */
        timeInfo(delay: number, duration: number): Action;
        /**
         * Create a schedulable task.
         *
         * @method cc.action.SchedulerQueue.createSchedulerTask
         *
         * @param target {object} this object will be supplied as context to the callback function.
         * @param callback {cc.action.SchedulerTaskCallback}
         * @param interval {number} interval time to elapse between scheduler calls. Can't be less than 16ms. If the
         *   value is less, it will be fired at every frame anyway.
         * @param repeat {number} multi-shot task. Should this event repeat over time ?
         * @param delay {boolean} schedule the task and wait this time before firing the event.
         */
        static createSchedulerTask(target: any, callback: SchedulerTaskCallback, interval: number, repeat: number, delay: number): SchedulerQueueTask;
        /**
         * Create a schedulable task to call the update method on a cc.node.Node instance.
         * This special factory method prevents errors when calling scheduleUpdate and then changing the update function.
         *
         * @param target {object} this object will be supplied as context to the callback function.
         * @param interval {number} interval time to elapse between scheduler calls. Can't be less than 16ms. If the
         *   value is less, it will be fired at every frame anyway.
         * @param repeat {number} multi-shot task. Should this event repeat over time ?
         * @param delay {boolean} schedule the task and wait this time before firing the event.
         */
        static createSchedulerUpdateTask(target: any, interval: number, repeat: number, delay: number): SchedulerQueueUpdateTask;
        /**
         * Schedule a task.
         * @method cc.action.SchedulerQueue#scheduleTask
         * @param target {Object}
         * @param callback {SchedulerTaskCallback}
         * @param interval {number}
         * @param repeat {number}
         * @param delay {number}
         */
        scheduleTask(target: any, callback?: SchedulerTaskCallback, interval?: number, repeat?: number, delay?: number): void;
        /**
         * Insert a task in priority order.
         * It uses binary search to find out the correct position.
         * If already exists a task with the same priority, the new task will be inserted after the existing ones.
         * @param task {cc.node.SchedulerQueueTask}
         */
        insertTask(task: SchedulerQueueTask): void;
        /**
         * Find whether a task composed of a given object and callback already exists.
         * @method cc.action.SchedulerQueue#__findTask
         *
         * @param target {object}
         * @param method {cc.action.SchedulerTaskCallback}
         * @returns {*}
         * @private
         */
        __findTask(target: any, method: SchedulerTaskCallback): SchedulerQueueTask;
        /**
         * Pause all tasks for a given target.
         *
         * @method cc.action.SchedulerQueue#pauseTarget
         * @param target {object}
         */
        pauseTarget(target: any): void;
        /**
         * Pause a concrete task for a target.
         * @method cc.action.SchedulerQueue#pauseTask
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        pauseTask(target: any, callback: SchedulerTaskCallback): void;
        /**
         * End a task for a target.
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        endTask(target: any, callback: SchedulerTaskCallback): void;
        /**
         * Resume a paused task for a target. If it was not paused, nothing happens.
         * @method cc.action.SchedulerQueue#resumeTask
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        resumeTask(target: any, callback: SchedulerTaskCallback): void;
        /**
         * Resume all tasks for a target.
         * @method cc.action.SchedulerQueue#resumeTarget
         * @param target {object}
         */
        resumeTarget(target: any): void;
        /**
         * Remove all tasks for a target.
         * @method cc.action.SchedulerQueue#unscheduleAllCallbacks
         * @param target {object}
         */
        unscheduleAllCallbacks(target: any): void;
        /**
         * Unschedule a concrete task for a target.
         * Unschedule means set it as ended, w/o further execution.
         * @method cc.action.SchedulerQueue#unscheduleCallbackForTarget
         * @param target {object}
         * @param callback {cc.action.SchedulerTaskCallback}
         */
        unscheduleCallbackForTarget(target: any, callback: SchedulerTaskCallback): void;
        /**
         * Action update.
         * Traverse the task list and execute events.
         * @method cc.action.SchedulerQueue#update
         * @param normalizedTime {number} normalized action time.
         * @param target {cc.node.Node} node object for which the action executes. For Scheduler queues, no target exists.
         */
        update(normalizedTime: number, target: Node): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.action {
    /**
     * This function parses an Action based on an initializer object.
     * Initializer objects are just JSON objects which could got from a call to action.getInitializer().
     * @name ParseAction
     * @memberOf cc.action
     * @param actionDef {cc.action.ActionInitializer}
     * @returns {cc.action.Action}
     */
    function ParseAction(actionDef: ActionInitializer): Action;
    /**
     * @class cc.action.ActionChainContext
     * @classdesc
     *
     * An ActionChainContext is an object whose only purpose is offer a chainable Action construction API.
     * It keeps track of the last created action and its type. It is a fachade to the last created action for a Node
     * so that calling the chain context methods will forward calls to such Action.
     * It is expected to execute in the context of a cc.node.Node object only.
     * For example, this object allows for an api call like this:
     *
     * <code>
     *     actionSequence().
     *        setRepeatForever().
     *        onEnd( function() {
     *            console.log("end");
     *        }).
     *        actionRotate().
     *            to(180).
     *            setRelative(true).
     *            setDuration(1).
     *        actionScale().
     *            to( {x:0, y:1 }).
     *            setRelative(true).
     *            setDuration(1.5).
     *        actionScale().
     *            to( {x:1, y:1}).
     *            setRelative(true).
     *            setDuration(1.5).
     *        actionTint().
     *            to( {r: -.5, g: -.5, b: -.5 } ).
     *            setRelative(true).
     *            setDuration( 2).
     *    endSequence();
     * </code>
     *
     */
    class ActionChainContext {
        _target: cc.node.Node;
        /**
         * When a call to .then() is made, this property keeps track of the previously built action.
         * @member cc.action.ActionChainContext#_chainAction
         * @type {cc.action.Action}
         * @private
         */
        _chainAction: Action;
        /**
         * The current action the chain context methods will forward calls to.
         * @member cc.action.ActionChainContext#_currentAction
         * @type {cc.action.Action}
         * @private
         */
        _currentAction: Action;
        /**
         * Stack which tracks how many actionSequence calls have been done.
         * @member cc.action.ActionChainContext#_sequenceStack
         * @type {Array<cc.action.SequenceAction>}
         * @private
         */
        _sequenceStack: SequenceAction[];
        /**
         * Last SequenceAction tracked.
         * @member cc.action.ActionChainContext#_currentSequence
         * @type {cc.action.SequenceAction}
         * @private
         */
        _currentSequence: SequenceAction;
        /**
         * Node for which the chain actions are being performed.
         * @name _target
         * @memberof cc.action.ActionChainContext
         * @type {cc.node.Node}
         */
        /**
         * Create a new ActionChainContext object instance.
         * @method cc.action.ActionChainContext#constructor
         * @constructor
         * @param _target {cc.node.Node}
         */
        constructor(_target: cc.node.Node);
        /**
         * Create an Action from a constructor function.
         * If a new SequenceAction is to be build, it will be pushed to the SequenceAction stack.
         * The resulting action will be set as the current chain context Action so that all context calls will be forwarded
         * to this action.
         * @method cc.action.ActionChainContext#__action
         * @param ctor {object} a constructor function
         * @returns {cc.action.ActionChainContext}
         * @private
         */
        __action(ctor: any): ActionChainContext;
        /**
         * Chain a complete action or an action built form an ActionInitializer object.
         * @method cc.action.ActionChainContext#action
         * @param _currentAction {cc.action.Action|cc.action.ActionInitializer}
         * @returns {cc.action.ActionChainContext}
         */
        action(_currentAction: Action | ActionInitializer): ActionChainContext;
        /**
         * Start chaining for a new PathAction.
         * @method cc.action.ActionChainContext#actionPath
         * @returns {cc.action.ActionChainContext}
         */
        actionPath(): ActionChainContext;
        /**
         * Start chaining for a new MoveAction.
         * @method cc.action.ActionChainContext#actionMove
         * @returns {cc.action.ActionChainContext}
         */
        actionMove(): ActionChainContext;
        /**
         * Start chaining for a new RotateAction.
         * @method cc.action.ActionChainContext#actionRotate
         * @returns {cc.action.ActionChainContext}
         */
        actionRotate(): ActionChainContext;
        /**
         * Start chaining for a new PropertyAction.
         * @method cc.action.ActionChainContext#actionProperty
         * @returns {cc.action.ActionChainContext}
         */
        actionProperty(): ActionChainContext;
        /**
         * Start chaining for a new AlphaAction.
         * @method cc.action.ActionChainContext#actionAlpha
         * @returns {cc.action.ActionChainContext}
         */
        actionAlpha(): ActionChainContext;
        /**
         * Start chaining for a new TintAction.
         * @method cc.action.ActionChainContext#actionTint
         * @returns {cc.action.ActionChainContext}
         */
        actionTint(): ActionChainContext;
        /**
         * Start chaining for a new ScaleAction.
         * @method cc.action.ActionChainContext#actionScale
         * @returns {cc.action.ActionChainContext}
         */
        actionScale(): ActionChainContext;
        /**
         * Start chaining for a new SequenceAction.
         * @method cc.action.ActionChainContext#actionSequence
         * @returns {cc.action.ActionChainContext}
         */
        actionSequence(): ActionChainContext;
        /**
         * End a Sequence Action context.
         * This will pop the latest Sequence from the stack.
         * If the stack gets empty, actions will be added in the context of the Target node, and not the sequence.
         * @method cc.action.ActionChainContext#endSequence
         * @returns {cc.action.ActionChainContext}
         */
        endSequence(): ActionChainContext;
        /**
         * Set action 'from' value for the current action.
         * @method cc.action.ActionChainContext#from
         * @param obj {object} the value to set for 'from' action property.
         * @returns {cc.action.ActionChainContext}
         */
        from(obj: any): ActionChainContext;
        /**
         * Set action 'to' value for the current action.
         * @method cc.action.ActionChainContext#from
         * @param obj {object} the value to set for 'from' action property.
         * @returns {cc.action.ActionChainContext}
         */
        to(obj: any): ActionChainContext;
        /**
         * Set action interpolator value for the current action.
         * @method cc.action.ActionChainContext#setInterpolator
         * @param i {cc.action.TimeInterpolator} a interpolator (easing function).
         * @returns {cc.action.ActionChainContext}
         */
        setInterpolator(i: cc.action.TimeInterpolator): ActionChainContext;
        /**
         * Set action as relative.
         * @method cc.action.ActionChainContext#setRelative
         * @param b {boolean}
         * @returns {cc.action.ActionChainContext}
         */
        setRelative(b: boolean): ActionChainContext;
        /**
         * Set action duration.
         * @method cc.action.ActionChainContext#setDuration
         * @param d {number}
         * @returns {cc.action.ActionChainContext}
         */
        setDuration(d: number): ActionChainContext;
        /**
         * Set action repetition forever.
         * @method cc.action.ActionChainContext#setRepeatForever
         * @param obj {cc.action.RepeatTimesOptions=} some repetition attributes.
         * @returns {cc.action.ActionChainContext}
         */
        setRepeatForever(obj?: cc.action.RepeatTimesOptions): ActionChainContext;
        /**
         * Set action repetition times.
         * @method cc.action.ActionChainContext#setRepeatTimes
         * @param n {number} repetition count
         * @returns {cc.action.ActionChainContext}
         */
        setRepeatTimes(n: number): ActionChainContext;
        /**
         * Chain two actions. After a call to then, any of the actionXXX methods should be called. The newly
         * created action will be chained with the current one. Chain means that will start when the preivous ends.
         * @method cc.action.ActionChainContext#then
         * @returns {cc.action.ActionChainContext}
         */
        then(): ActionChainContext;
        /**
         * Set duration and interpolator into in one call.
         * @method cc.action.ActionChainContext#timeInfo
         * @param delay {number} delay before application
         * @param duration {number} action duration in time units.
         * @param interpolator {cc.action.TimeInterpolator=} optional interpolator
         * @returns {cc.action.ActionChainContext}
         */
        timeInfo(delay: number, duration: number, interpolator?: cc.action.TimeInterpolator): ActionChainContext;
        /**
         * Set action onEnd callback.
         * @method cc.action.ActionChainContext#onEnd
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onEnd(f: ActionCallbackStartOrEndOrPauseOrResumeCallback): ActionChainContext;
        /**
         * Set action onStart callback.
         * @method cc.action.ActionChainContext#onStart
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onStart(f: ActionCallbackStartOrEndOrPauseOrResumeCallback): ActionChainContext;
        /**
         * Set action onRepeat callback.
         * @method cc.action.ActionChainContext#onRepeat
         * @param f {cc.action.ActionCallbackRepeatCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onRepeat(f: ActionCallbackRepeatCallback): ActionChainContext;
        /**
         * Set action onPause callback.
         * @method cc.action.ActionChainContext#onPause
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onPause(f: ActionCallbackStartOrEndOrPauseOrResumeCallback): ActionChainContext;
        /**
         * Set action onResume callback.
         * @method cc.action.ActionChainContext#onResume
         * @param f {cc.action.ActionCallbackStartOrEndOrPauseOrResumeCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onResume(f: ActionCallbackStartOrEndOrPauseOrResumeCallback): ActionChainContext;
        /**
         * Set action onApply callback.
         * @method cc.action.ActionChainContext#onApply
         * @param f {cc.action.ActionCallbackApplicationCallback}
         * @returns {cc.action.ActionChainContext}
         */
        onApply(f: ActionCallbackApplicationCallback): ActionChainContext;
        /**
         * If the current action is a sequence, set the Sequence as sequential or spawn.
         * @method cc.action.ActionChainContext#setSequential
         * @param b {boolean}
         * @returns {cc.action.ActionChainContext}
         */
        setSequential(b: boolean): ActionChainContext;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.Performance {
    class Measure {
        _prevValues: number[];
        _accumulatedValue: number;
        _name: string;
        _value: number;
        _start: number;
        constructor(name: any);
        increment(): void;
        clear(): void;
        clearCache(): void;
        setValue(v: number): void;
        getValue(): number;
        start(): void;
        end(): void;
        save(): void;
    }
    class TimeMeasure extends Measure {
        constructor(name: any);
        getValue(): number;
    }
    class Performance {
        _measures: {
            [id: string]: Measure;
        };
        constructor();
        start(id: string): void;
        end(id: string): void;
        increment(id: string): void;
        setValue(id: string, v: number): void;
        clear(): void;
        clearCache(): void;
        save(): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.node {
    import Node = cc.node.Node;
    import Action = cc.action.Action;
    import ActionManager = cc.action.ActionManager;
    import RenderingContext = cc.render.RenderingContext;
    import SchedulerQueue = cc.action.SchedulerQueue;
    import SchedulerQueueTask = cc.action.SchedulerQueueTask;
    import SchedulerTaskCallback = cc.action.SchedulerTaskCallback;
    /**
     * Callback invoked when a Transition Enter/Exit/DidFinishExit/DidStartEnter
     * @memberOf cc.node
     * @callback CallbackSceneTransition
     * @param scene {cc.node.Scene} This callback will be called when a transition ends.
     */
    interface CallbackSceneTransition {
        (scene: Scene): void;
    }
    /**
     * @class cc.node.Scene
     * @extends cc.node.Node
     * @classdesc
     *
     * Scenes are specialized Nodes useful for separating in-game functional pieces.
     * For example, a Scene can be the game menu, another scene can be the game and another scene the results window.
     *
     * <li>At any given moment, only one scene can be running.
     *
     * <li>A Scene can not contain other Scenes, or any Director instance.
     * <li>The size of the scene will by default be the same as the Director, and hence, equal to the Canvas size.
     *
     * <li>A Scene manages all the Actions of all the Node's it contains.
     * <li>A scene manages chronometers/events independently to any other scene.
     *
     * <li>Every Node that hierarchically belongs to this Scene will have a reference to the Scene. This reference will be
     * set when the <code>Director</code> the Scene is running in calls <code>onEnter</code> on the scene.
     *
     * <li>There´ no limitation on how many Scenes can be in a game.
     *
     * <li>Scenes have no parent Node. This means that a call to <code>enumerateChildren</code> will take a Scene as the
     * root search point.
     * <li>An Scene logical parent is a Director object. Scenes have a Director instance in _parent variable.
     *
     * <p>
     *     Scenes are the source point for input routing to the nodes it contains. It contains two members:
     *     <ul>
     *      <li>_sceneGraphPriorityTree: for nodes sorted in scene graph priority. This priority is the natural
     *       way nodes are organized.
     *      <li>_priorityTree: artificial priority were nodes are sorted by value. lower value means higher priority.
     *     </ul>
     *     Each time a scene is set as running by a director, the InputSystem sets that scene as input target.
     *
     * <p>
     *     One important thing about scenes is that they contain an ActionManager which at the same time, manages a
     *     Scheduler.
     *     Scheduling actions or tasks for a Node is as straighforward as calling <code>runAction</code> or
     *     <code>schedule|scheduleUpdate</code>.
     *     These methods expect a time parameter for scheduling, which by default is in seconds. The engine will internally
     *     treat all time measures in milliseconds (makes sense since the animation loop is scheduled every 16ms approx),
     *     but the developer can instrument to set time measurements in seconds (default) by calling
     *     <code>cc.action.setTimeReferenceInSeconds</code> or milliseconds <code>setTimeReferenceInMillis</code>.
     *     Callback notifications with a time parameter will be in the developer desired time units.
     *
     */
    class Scene extends Node {
        /**
         * Node's ActionManager.
         * @member cc.node.Scene#_actionManager
         * @type {cc.action.ActionManager}
         * @private
         */
        _actionManager: ActionManager;
        /**
         * Callback reference for onEnter event.
         * @member cc.node.Scene#_onEnter
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onEnter: CallbackSceneTransition;
        /**
         * Callback reference for onExit event.
         * @member cc.node.Scene#_onExit
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onExit: CallbackSceneTransition;
        /**
         * Callback reference for enter transition end event.
         * @member cc.node.Scene#_onEnterTransitionDidFinish
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onEnterTransitionDidFinish: CallbackSceneTransition;
        /**
         * Callback reference for exit transition start event.
         * @member cc.node.Scene#_onExitTransitionDidStart
         * @type {cc.node.CallbackSceneTransition}
         * @private
         */
        _onExitTransitionDidStart: CallbackSceneTransition;
        _scheduler: SchedulerQueue;
        _sceneGraphPriorityTree: cc.input.SceneGraphInputTreeNode;
        _priorityTree: cc.input.PriorityInputNode[];
        /**
         * Create a new Scene instance.
         * @method cc.node.Scene#constructor
         */
        constructor();
        enableEvents(enable: boolean): Scene;
        enablePriorityEvents(enable: boolean, priority: number): Scene;
        /**
         * Enable events in scene-graph order for a node.
         * If the node is not attached to this scene, nothing will happen.
         * @method cc.node.Scene#enableEvents
         * @param node {cc.node.Node}
         */
        enableEventsForNode(node: Node): Scene;
        getPathToScene(): Node[];
        /**
         * Enable events in priority order for a node.
         * The priority is something external to the Node,
         * @method cc.node.Scene#enablePriorityEvents
         * @param node {cc.node.Node}
         */
        enablePriorityEventsForNode(node: Node): Scene;
        findNodeAtScreenPoint(p: cc.math.Vector, callback?: (node: Node) => boolean): Node;
        /**
         * Increment scene's timeline.
         * This time is local to this scene, and independent to other Scene's time.
         * This local time is handled by the Scene's ActionManager, which translate the delta milliseconds into
         * the desired game time measurement unit, which are seconds by default.
         * @method cc.node.Scene#step
         * @param delta {number} elapsed time in milliseconds.
         * @param ctx {cc.render.RenderingContext} where node's will render.
         */
        step(delta: number, ctx: RenderingContext): void;
        /**
         * Register Scene onEnter callback.
         * @method cc.node.Scene#onEnter
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onEnter(c: CallbackSceneTransition): Scene;
        /**
         * Register Scene onExit callback.
         * @method cc.node.Scene#onExit
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onExit(c: CallbackSceneTransition): Scene;
        /**
         * Register onExitTransitionStart callback. Called when scenes are switched by Transition objects.
         * @method cc.node.Scene#onExitTransitionDidStart
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onExitTransitionDidStart(c: CallbackSceneTransition): Scene;
        /**
         * Register onEnterTransitionFinish callback. Called when scenes are switched by Transition objects.
         * @method cc.node.Scene#onEnterTransitionDidFinish
         * @param c {cc.node.CallbackSceneTransition}
         * @returns {cc.node.Scene}
         */
        onEnterTransitionDidFinish(c: CallbackSceneTransition): Scene;
        /**
         * Notifiy event registered callback.
         * @method cc.node.Scene#callOnEnterTransitionDidFinish
         */
        callOnEnterTransitionDidFinish(): void;
        /**
         * Notifiy event registered callback.
         * @method cc.node.Scene#callOnExitTransitionDidStart
         */
        callOnExitTransitionDidStart(): void;
        /**
         * Notifiy event registered callback.
         *
         *
         * @method cc.node.Scene#callOnEnter
         */
        callOnEnter(): void;
        /**
         * Notify event registered callback.
         * @method cc.node.Scene#callOnExit
         */
        callOnExit(): void;
        /**
         * Overriden Node's method for set scene reference.
         * A scene does not need a scene reference.
         * @method cc.node.Scene#setScene
         * @param scene {cc.node.Scene}
         */
        setScene(scene: Scene): void;
        /**
         * Overriden Node's method for setting a parent.
         * Scenes have no parent reference so this method does nothing.
         * @method cc.node.Scene#setParent
         * @param node {cc.node.Node}
         * @returns {cc.node.Scene}
         */
        setParent(node: Node): Node;
        /**
         * Reset this scene's properties.
         * Needed if the scene is managed by a Transition since position/scale/rotate can be changed.
         * @method cc.node.Scene#resetScene
         * @returns {cc.node.Scene}
         */
        resetScene(): Scene;
        /**
         * Run an Action for a Node.
         * @method cc.node.Scene#scheduleActionForNode
         * @param node {cc.node.Node}
         * @param action {cc.action.Action}
         * @returns {cc.node.Scene}
         */
        scheduleActionForNode(node: Node, action: Action): Scene;
        /**
         * Clear all this scene contents.
         * + all children are removed.
         */
        clear(): void;
        /**
         * Schedule an action to run.
         * By the time an action is meant to be scheduled for running in a Node, there may not yet be a
         * <code>Director</code> or <code>Scene</code>. This method saves locally the actions which will be
         * scheduled in a scene's <code>ActionManager</code> later.
         * @method cc.node.Node#runAction
         * @param action {cc.action.Action}
         * @returns {cc.node.Node}
         */
        runAction(action: Action): Node;
        stopNodeActionByTag(node: Node, tag: string): Node;
        stopActionsForNode(node: Node): void;
        getScheduler(): SchedulerQueue;
        getScene(): Scene;
        scheduleTask(task: SchedulerQueueTask): void;
        scheduleUpdateWithPriority(priority: number): void;
        /**
         * Schedule a task to per frame call update for this node.
         *
         * @method cc.node.Node#scheduleUpdate
         * @deprecated
         */
        scheduleUpdate(): void;
        unscheduleUpate(): void;
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
        schedule(callback_fn: SchedulerTaskCallback, interval: number, repeat?: number, delay?: number): void;
        /**
         * Schedule a single shot task. Will fired only once.
         * @method cc.node.Node#scheduleOnce
         * @param callback_fn {cc.action.SchedulerTaskCallback} scheduler callback.
         * @param delay {number} milliseconds to wait before firing the task.
         * @returns {cc.node.Node}
         */
        scheduleOnce(callback_fn: SchedulerTaskCallback, delay: number): void;
        /**
         * Unschedule a task for the node.
         * @method cc.node.Node#unschedule
         * @param callback_fn {cc.action.SchedulerTaskCallback} callback to unschedule.
         */
        unschedule(callback_fn: SchedulerTaskCallback): void;
        unscheduleCallbackForTarget(target: Node, task: SchedulerTaskCallback): void;
        /**
         * Unschedule all tasks for the node.
         * @method cc.node.Node#unscheduleAllCallbacks
         */
        unscheduleAllCallbacks(target?: Node): void;
        /**
         * Resumes all scheduled tasks and actions.
         * This method is called internally by onEnter
         * @method cc.node.Node#resume
         */
        resume(): void;
        /**
         * Pauses all scheduled selectors and actions.
         * This method is called internally by onExit.
         * @method cc.node.Node#pause
         *
         */
        pause(): void;
        pauseTarget(target: Node): void;
        resumeTarget(target: Node): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.node {
    import Node = cc.node.Node;
    import Scene = cc.node.Scene;
    import ActionManager = cc.action.ActionManager;
    import Renderer = cc.render.Renderer;
    import Dimension = cc.math.Dimension;
    /**
     * Enumeration of Director status.
     *
     * @tsenum cc.node.DirectorStatus
     */
    enum DirectorStatus {
        CREATED = 0,
        RUNNING = 1,
        PAUSED = 2,
        STOPPED = 3,
    }
    /**
     * @class cc.node.Director
     * @extends cc.node.Node
     * @classdesc
     *
     * A Director object is the root node of a game.
     * <li>As the primary component, it is a glue which puts together platform features such as Input routing or Texture
     * and image caching, and Scenes and game logic.
     * <li>Each Director has a renderer, which acts on its own Canvas Object. Since V4, Cocos2D HTML5 allows for multiple
     * <li>Director instances and each one can have a different renderer type.
     *
     * <li>Every Director present in a Document, will share a common Texture and Image cache for better resource management.
     *
     * <li>A Director object runs Scenes. The process of switching scenes is handled using a <code>Transition</code> object.
     * <li>The preferred way of building scenes is by calling <code>director.createScene() -> Scene</code>
     *
     * @see{cc.node.Scene}
     * @see{cc.node.Transition}
     *
     */
    class Director extends Node {
        /**
         * Director status
         * @member cc.node.Director#_status
         * @type {number}
         * @private
         */
        _status: cc.node.DirectorStatus;
        /**
         * Director's renderer.
         * @member cc.node.Director#_renderer
         * @type {cc.render.RenderingContext}
         * @private
         */
        _renderer: Renderer;
        /**
         * Scenes available in this Director.
         * @member cc.node.Director#_scenes
         * @type {Array}
         * @private
         */
        _scenes: Array<cc.node.Scene>;
        /**
         * requestAnimationFrame shim id.
         * @member cc.node.Director#_animFrame
         * @type {number}
         * @private
         */
        _animFrame: number;
        /**
         * Ideal milliseconds between two frames.
         * @member cc.node.Director#_animationInterval
         * @type {number}
         * @private
         */
        _animationInterval: number;
        /**
         * Currently running Scene.
         * @member cc.node.Director#_currentScene
         * @type {cc.node.Scene}
         * @private
         */
        _currentScene: Scene;
        /**
         * If <code>runAction</code> is called with a Transition, _exitingScene will be the currently moving out scene.
         * For internal usage only.
         * @member cc.node.Director#_exitingScene
         * @type {cc.node.Scene}
         * @private
         */
        _exitingScene: Scene;
        /**
         * Scenes action manager that manages Transition objects.
         * @member cc.node.Director#_scenesActionManager
         * @type {cc.action.ActionManager}
         * @private
         * @see {cc.transition.Transition}
         */
        _scenesActionManager: ActionManager;
        /**
         * Timer management. This value is the previous time the director run at.
         * @member cc.node.Director#_prevPerf
         * @type {number}
         * @private
         */
        _prevPerf: number;
        /**
         * General input management system
         * @member cc.node.Director#_inputManager
         * @type {cc.input.InputManager}
         * @private
         */
        _inputManager: cc.input.InputManager;
        _scheduler: cc.action.SchedulerQueue;
        /**
         * Create a new Director instance.
         * @method cc.node.Director#constructor
         */
        constructor();
        /**
         * Get the current renderer.
         * @method cc.node.Director#getRenderer
         * @returns {Renderer}
         */
        getRenderer(): Renderer;
        /**
         * Set the Director's renderer.
         * It will also enable input on the renderer surface.
         * @method cc.node.Director#setRenderingContext
         * @param renderer {cc.render.Renderer}
         * @returns {cc.node.Director}
         */
        setRenderer(renderer: Renderer): Director;
        __setTransform(): Node;
        __setLocalTransform(): void;
        __setWorldTransform(): void;
        /**
         * Get the system input manager object.
         * @method cc.node.Director#getInputManager
         * @returns {cc.input.InputManager}
         */
        getInputManager(): cc.input.InputManager;
        /**
         * Pause the Director.
         * The animation loop is stopped.
         * @method cc.node.Director#pause
         */
        pause(): void;
        /**
         * Resume a paused director.
         * The animation loop restarts.
         * @method cc.node.Director#resume
         */
        resume(): void;
        /**
         * Make the renderer visible in the document.
         * @method cc.node.Director#addToDOM
         */
        addToDOM(): void;
        __sceneExitedDirector(scene: Scene): void;
        /**
         * Run a Scene.
         * Optionally use a transition for switching between scenes.
         * @method cc.node.Director#runScene
         * @param scene {cc.node.Scene}
         * @param transition {cc.transition.Transition}
         */
        runScene(scene_or_transition: Scene | cc.transition.Transition, transition?: cc.transition.Transition): void;
        /**
         * Push a new running scene on top of the stack.
         * @method cc.node.Director#pushScene
         * @param scene {cc.node.Scene}
         */
        pushScene(scene: Scene): void;
        /**
         * Pop a scene from the running stack.
         * @method cc.node.Director#popScene
         * @throws cc.locale.Locale.ERR_DIRECTOR_POPSCENE_UDERFLOW if DEBUG_LEVEL is RuntimeDebugLevel.DEBUG.
         */
        popScene(): void;
        /**
         * Pop all scenes but one.
         * @method cc.node.Director#popToRootScene
         */
        popToRootScene(): void;
        /**
         * Remove scenes from the stack until reaching 'level' scenes stack length.
         * @method cc.node.Director#popToSceneStackLevel
         * @param level {number}
         */
        popToSceneStackLevel(level: number): void;
        /**
         * Start Director's animation loop.
         * Don't call directly, or only call after manually calling <code>stopAnimation</code>
         * @method cc.node.Director#startAnimation
         */
        startAnimation(): void;
        /**
         * Stop Director's animation loop.
         * The Director status will be STOPPED.
         * @method cc.node.Director#stopAnimation
         */
        stopAnimation(): void;
        /**
         * Throttle animation loop.
         * This value will be the minimum millis to wait between two frames.
         * Currently does nothing.
         * @method cc.node.Director#setAnimationInterval
         * @param interval {number}
         */
        setAnimationInterval(interval: number): void;
        /**
         * Main director animation Loop.
         * Don't call directly this method. It is called by startAnimation when the first scene is scheduled in the
         * Director object.
         *
         * PENDING: throttle FPS with _animationInterval value.
         *
         * @method cc.node.Director#mainLoop
         * @param perf {number=} performance time elapsed between two RAF calls.
         */
        mainLoop(perf?: number): void;
        /**
         * Create an scene object.
         * The created Scene will have the size of this director object and have a reference to the director.
         * @method cc.node.Director#createScene
         * @returns {cc.node.Scene}
         */
        createScene(): Scene;
        /**
         * Get director size as a dimension object.
         * The object is a copy of the internal contentSize variable.
         * This method is for backwards compatibility
         * @method cc.node.Director#getWinSize
         * @returns {cc.math.Dimension}
         */
        getWinSize(): Dimension;
        scheduleTask(task: cc.action.SchedulerQueueTask): void;
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
        schedule(callback_fn: cc.action.SchedulerTaskCallback, interval: number, repeat?: number, delay?: number): void;
        /**
         * Schedule a single shot task. Will fired only once.
         * @method cc.node.Node#scheduleOnce
         * @param callback_fn {cc.action.SchedulerTaskCallback} scheduler callback.
         * @param delay {number} milliseconds to wait before firing the task.
         * @returns {cc.node.Node}
         */
        scheduleOnce(callback_fn: cc.action.SchedulerTaskCallback, delay: number): void;
        /**
         * Unschedule a task for the node.
         * @method cc.node.Node#unschedule
         * @param callback_fn {cc.action.SchedulerTaskCallback} callback to unschedule.
         */
        unschedule(callback_fn: cc.action.SchedulerTaskCallback): void;
        /**
         * Unschedule all tasks for the node.
         * @method cc.node.Node#unscheduleAllCallbacks
         */
        unscheduleAllCallbacks(target?: Node): void;
    }
}
/**
 * Created by ibon on 11/17/14.
 */
declare module cc.render {
    /**
     * @class cc.render.Texture2D
     * @classdesc
     *
     * This Object encapsulated a rendering texture, either for Canvas or WebGL.
     * The texture will handle all the burden of creating a webgl texture when needed.
     * Since renderers have different needs for different types of images a call to Renderer.prepareTexture must be
     * performed. This will automatically happen for every pre-loaded texture in the AssetManager by the time a renderer
     * is being built.
     *
     */
    class Texture2D {
        _name: string;
        _webglState: WebGLState;
        _glId: WebGLTexture;
        _textureWidth: number;
        _textureHeight: number;
        /**
         * A texture2D, is bound to a given renderer.
         * @member cc.render.Texture2D#_image
         * @type {Image|WebGLTexture}
         * @private
         */
        _image: any;
        _hasMipmaps: boolean;
        _u0: number;
        _v0: number;
        _u1: number;
        _v1: number;
        _offsetX: number;
        _offsetY: number;
        _imageWidth: number;
        _imageHeight: number;
        _isLoaded: boolean;
        _invertedY: boolean;
        constructor(el: any, name: string);
        initWithElement(el: string): any;
        initWithElement(el: HTMLCanvasElement): any;
        initWithElement(el: HTMLImageElement): any;
        width: number;
        height: number;
        getPixelsWide(): number;
        getPixelsHigh(): number;
        getImage(): any;
        isWebGLEnabled(): boolean;
        release(): void;
        /**
         * Turn an Image texture into a WebGL Texture.
         * The Image object reference will be set to null (gc friendly).
         * If the Texture is already a gl texture, nothing will happen.
         * @param webglstate {cc.render.WebGLState}
         * @returns {cc.render.Texture2D}
         * @private
         */
        __setAsGLTexture(webglstate: WebGLState): Texture2D;
        setTexParameters(texParams: number, magFilter: number, wrapS: number, wrapT: number): void;
        setAntiAliasTexParameters(): void;
        setAliasTexParameters(): void;
        generateMipmap(): void;
    }
}
/**
 * Created by ibon on 11/26/14.
 */
declare module cc.node.sprite {
    import Vector = cc.math.Vector;
    import Rectangle = cc.math.Rectangle;
    import RenderingContext = cc.render.RenderingContext;
    import Texture2D = cc.render.Texture2D;
    /**
     * @class cc.node.sprite.SpriteFrame
     * @classdesc
     *
     * This Object defines a pixels source (image, canvas, texture, etc.) and an associated Rect for image blitting
     * operations.
     * It has parent-child capabilities. A SpriteFrame can create subFrames. SubFrames will have a parent reference,
     * share the same Texture instance and will apply the appropriate offset.
     *
     */
    class SpriteFrame {
        _texture: Texture2D;
        /**
         * Parent's SpriteFrame. When creating Frames from an image, a call to <code>spriteFrame.createFrame</code>
         * will create a child of a frame, set its parent, and inherit the offseting based on parent's chain.
         * Both frames will share the same Texture2D instance.
         * @type {cc.node.SpriteFrame}
         * @member cc.node.sprite.SpriteFrame#_parent
         * @private
         */
        _parent: SpriteFrame;
        /**
         * Offset position in texture.
         * When setting parents, the offset will be the parent's position.
         * @member cc.node.sprite.SpriteFrame#_offset
         * @type {cc.math.Vector}
         * @private
         */
        _offset: Vector;
        /**
         * Displacement to add to position the spriteframe on screen.
         * Nothing to do with uv coords.
         * @member cc.node.sprite.SpriteFrame#_offsetFromCenter
         * @type {cc.math.Vector}
         * @private
         */
        _offsetFromCenter: Vector;
        /**
         * Is the frame rotated ?. Not by default.
         * @member cc.node.sprite.SpriteFrame#_rotated
         * @type {boolean}
         * @private
         */
        _rotated: boolean;
        /**
         * Recatangle in pixels the SpriteFrame represents.
         * @member cc.node.sprite.SpriteFrame#_rect
         * @type {cc.math.Rectangle}
         * @private
         */
        _rect: Rectangle;
        /**
         * Recatangle in uv the SpriteFrame represents.
         * @member cc.node.sprite.SpriteFrame#_normalizedRect
         * @type {cc.math.Rectangle}
         * @private
         */
        _normalizedRect: Rectangle;
        /**
         * Texture data. Texture is a source of pixels, either Image, Canvas or a GLTexture
         * @member cc.node.sprite.SpriteFrame#_texture
         * @type {cc.render.Texture2D}
         * @private
         */
        /**
         *
         * @type {null}
         * @private
         */
        _name: string;
        /**
         * Create a new SpriteFrame instance.
         * @method cc.node.sprite.SpriteFrame#constructor
         * @param _texture {Texture2D} an string or Texture2D
         * @param rect {cc.math.Rectangle=} an optional rect on the texture. If not set, the whole image will be used.
         */
        constructor(_texture?: Texture2D, rect?: Rectangle);
        getWidth(): number;
        getHeight(): number;
        getX(): number;
        getY(): number;
        x: number;
        y: number;
        width: number;
        height: number;
        /**
         * Create a new SpriteFrame from this one. The rect will be relative to this SpriteFrame's rect and offset.
         * The rect supplied is clipped against this SpriteFrame's rect. If the resulting rect is Empty (has no dimension)
         * null will be returned.
         * The caller is responsible from storing the resulting SpriteFrame object.
         * @method cc.node.sprite.SpriteFrame#createSubSpriteFrame
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @param name {string} a frame's name. If not set, "frameXXX" where XXX is a sequence value will be set.
         * @returns {SpriteFrame} a new SubSpriteFrame created from this one or null if the supplied rect does not
         *  intersect this SpriteFrame's rect.
         */
        createSubSpriteFrame(x: number, y: number, w: number, h: number, name: string, centerOffsetX?: number, centerOffsetY?: number): SpriteFrame;
        needsSpecialMatrix(): boolean;
        setOffsetFromCenter(x: number, y: number): void;
        createSubSpriteFrames(rows: number, columns: number): SpriteFrame[];
        /**
         * Set the SpriteFrame offset. This is useful to properly position a Frame inside a frame. For example, a texture
         * atlas with a font, which effectively another atlas.
         * If the offset position is not contained the SpriteFrame's rect, the offset operation does nothing.
         * @method cc.node.sprite.SpriteFrame#setOffset
         * @param x {number}
         * @param y {number}
         */
        setOffset(x: number, y: number): void;
        /**
         * Is this SpriteFrame rotated ?
         * @method cc.node.sprite.SpriteFrame#get:rotated
         * @returns {boolean}
         */
        /**
         * Set this SpriteFrame to have the image rotated.
         * @method cc.node.sprite.SpriteFrame#set:rotated
         * @param v {boolean}
         */
        rotated: boolean;
        /**
         * Calculate WebGL rect based on the current frame info.
         * @member cc.node.sprite.SpriteFrame#__calculateNormalizedRect
         * @private
         */
        __calculateNormalizedRect(): void;
        /**
         * Get this SpriteFrame associated texture 2d object.
         * @method cc.node.sprite.SpriteFrame#getTexture
         * @returns {cc.render.Texture2D}
         */
        getTexture(): Texture2D;
        /**
         * Draw the SpriteFrame.
         * This method takes care of drawing the Frame with the correct rotation and Sprite's status of flip axis values.
         * @method cc.node.sprite.SpriteFrame#draw
         * @param ctx {cc.render.RenderingContext}
         * @param w {number}
         * @param h {number}
         */
        draw(ctx: RenderingContext, w: number, h: number): void;
        /**
         * Create a set of new SpriteFrames from this SpriteFrame area, and defined by a JSON object.
         * The JSON object is typically the result of a ResourceLoaderJSON with parse flag enabled.
         * The JSON structure is the result from the tool TexturePacker, exporting content as JSON.
         * The function will create an array of newly created SpriteFrames. It is not this function's responsibility
         * to add the new frames to a cache or anything but creating them.
         *
         * @param map {object} a TexturePacker JSON exported file.
         * @param frames {Array<cc.node.sprite.SpriteFrame>=} array of newly created SpriteFrames. if this parameter is
         *      not set, a new array will be created and returned.
         * @returns {SpriteFrame[]}
         */
        createSpriteFramesFromJSON(map: any, frames?: SpriteFrame[]): SpriteFrame[];
        /**
         * Create a set of new SpriteFrames from this SpriteFrame area, and defined by a 'plist' object.
         * The plist object is typically the result of a ResourceLoaderXML.
         * The plist structure is the result from the tool TexturePacker, exporting content as Cocos2d.
         * The function will create an array of newly created SpriteFrames. It is not this function's responsibility
         * to add the new frames to a cache or anything but creating them.
         *
         * @param obj {object} plist loaded file content in the form of a javascript array.
         * @returns {SpriteFrame[]}
         */
        createSpriteFramesFromPLIST(obj: Array<any>): SpriteFrame[];
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.node.sprite {
    interface AnimationCacheData {
        [v: string]: Animation;
    }
    /**
     * @class cc.node.sprite.AnimationCache
     */
    class AnimationCache {
        _animations: AnimationCacheData;
        constructor();
        addAnimation(): void;
    }
    /**
     * @class cc.node.sprite.Animation
     * @classdesc
     *
     * An animation is a set of SpriteFrames, playback duration and a loop value. A <code>cc.action.AnimateAction</code>
     * will play the sequence that the animation defines.
     * SpriteFrames roughly define rectangles in images. So if each of these frames is set for a node at a given speed,
     * we get the notion of a sprite animation.
     */
    class Animation {
        /**
         * A collection of SpriteFrames to define an animation.
         * @type {Array<cc.node.sprite.SpriteFrame>}
         * @member cc.node.sprite.Animation#_frames
         * @private
         */
        _frames: SpriteFrame[];
        /**
         * How many times the sequence will be played.
         * @type {number}
         * @member cc.node.sprite.Animation#_loops
         * @private
         */
        _loops: number;
        /**
         * Set the sprite back to the original frame after the animation ends playing.
         * @type {number}
         * @member cc.node.sprite.Animation#_restoreOriginalFrame
         * @private
         */
        _restoreOriginalFrame: boolean;
        /**
         * Time to change to the next frame. Defaults to 0.150 seconds. Value in milliseconds.
         * @member cc.node.sprite.Animation#_delayPerUnit
         * @type {number}
         * @private
         */
        _delayPerUnit: number;
        /**
         * Animation name. By default will be "animationXXX" where XXX is an index sequence value.
         * @member cc.node.sprite.Animation#_name
         * @type {string}
         * @private
         */
        _name: string;
        /**
         * Create a new Animation instance.
         * @method cc.node.sprite.Animation#constructor
         */
        constructor();
        /**
         * Add an animation frame.
         * @method cc.node.sprite.Animation#addFrame
         * @param f {cc.node.sprite.SpriteFrame}
         */
        addFrame(f: SpriteFrame): Animation;
        /**
         * Add a collection of animation frames.
         * @method cc.node.sprite.Animation#addFrames
         * @param f {Array<cc.node.sprite.SpriteFrame>}
         */
        addFrames(f: SpriteFrame[]): Animation;
        /**
         * Set the amount of time each frame of the animation will be shown.
         * @method cc.node.sprite.Animation#setDelayPerUnit
         * @param d {number} delay in seconds.
         */
        setDelayPerUnit(d: number): Animation;
        /**
         * Set the number of animation repetitions. If <1, it will be set to 1.
         * @method cc.node.sprite.Animation#setLoops
         * @param l {number} number of loops
         */
        setLoops(l: number): Animation;
        /**
         * Restore the original frame when the animation ends.
         * @method cc.node.sprite.Animation#setRestoreOriginalFrame
         * @param r {boolean}
         */
        setRestoreOriginalFrame(r: boolean): Animation;
        /**
         * Load an image, create a texture, a frame and then add the resulting SpriteFrame to the animation.
         * @method cc.node.sprite.Animation#addSpriteFrameWithFile
         * @deprecated
         * @param f {string} valid url string for an image resource.
         */
        addSpriteFrameWithFile(f: string): void;
        /**
         * Get the animation duration. It is the number of frames * delayPerUnit
         * @method cc.node.sprite.Animation#getDuration
         * @returns {number} animation duration in seconds.
         */
        getDuration(): number;
        /**
         * Get the number of frames in the Animation.
         * @method cc.node.sprite.Animation#getSize
         * @returns {number}
         */
        getSize(): number;
        /**
         * Get an SpriteFrame from the array at an index.
         * @method cc.node.sprite.Animation#getSpriteFrameAtIndex
         * @param i {number}
         * @returns {cc.node.sprite.SpriteFrame}
         */
        getSpriteFrameAtIndex(i: number): SpriteFrame;
        /**
         * Set this animation to loop forever.
         * @method cc.node.sprite.Animation#setLoopForever
         * @returns {cc.node.sprite.Animation}
         */
        setLoopForever(): Animation;
        /**
         * Create a copy of this Animation.
         * The new Animation name will be the original+<an index sequence value>
         * @method cc.node.sprite.Animation#clone
         * @returns {cc.node.sprite.Animation}
         */
        clone(): Animation;
        /**
         * Reverse this animation. The SpriteFrame collection is reversed.
         * @method cc.node.sprite.Animation#reverse
         * @returns {cc.node.sprite.Animation}
         */
        reverse(): Animation;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.node {
    import Rectangle = cc.math.Rectangle;
    import Node = cc.node.Node;
    import RenderingContext = cc.render.RenderingContext;
    import Texture2D = cc.render.Texture2D;
    import SpriteFrame = cc.node.sprite.SpriteFrame;
    /**
     * @class cc.node.Sprite.SpriteInitializer
     * @classdesc
     *
     * Sprite initializer object.
     */
    interface SpriteInitializer {
        texture?: Texture2D;
        frame?: SpriteFrame;
        rect?: Rectangle;
        frameName?: string;
    }
    /**
     * @class cc.node.Sprite
     * @extend cc.node.Node
     * @classdesc
     * Sprite creates an sprite, a Node that shows images with animations.
     */
    class Sprite extends Node {
        static create(d: any): Sprite;
        /**
         * Set this frame horizontally flipped.
         * @member cc.node.Sprite#_flippedX
         * @type {boolean}
         * @private
         */
        _flippedX: boolean;
        /**
         * Set this frame horizontally flipped.
         * @member cc.node.Sprite#_flippedY
         * @type {boolean}
         * @private
         */
        _flippedY: boolean;
        /**
         * @union
         * @type {cc.render.Texture2D|cc.node.sprite.SpriteFrame}
         * @private
         */
        _spriteFrame: cc.node.sprite.SpriteFrame;
        _resizeOnSpriteFrameSet: boolean;
        _spriteMatrix: Float32Array;
        _spriteMatrixDirty: boolean;
        _spriteMatrixSet: boolean;
        /**
         * @method cc.node.Sprite#constructor
         * @param ddata {cc.node.SpriteInitializer}
         * @param rect {cc.math.Rectangle}
         */
        constructor(ddata: any, rect?: cc.math.Rectangle);
        __init(ddata: any, rect?: cc.math.Rectangle): void;
        /**
         * Backwards compatibility method.
         * Never use directly.
         * ugh!.
         *
         * @param url
         * @param rect
         * @private
         */
        __createFromURL(url: string, rect?: cc.math.Rectangle): void;
        /**
         * Specialized Sprite draw function.
         * The Sprite must have a SpriteFrame, which references a region of an Image.
         * @method cc.node.Sprite#draw
         * @param ctx {cc.render.RenderingContext}
         */
        draw(ctx: RenderingContext): void;
        /**
         * Set this Sprite's frame. Until a frame is set the Sprite won't be drawn on screen.
         * When the frame is set, the Node will have its dimension changed to fit that of the frame.
         * @param s {cc.node.sprite.SpriteFrame}
         */
        setSpriteFrame(s: SpriteFrame): void;
        /**
         *
         *           cc.math.Matrix3.identity( this._spriteMatrix );

                     if (this._flippedX && this._flippedY) {
                         cc.math.Matrix3.translateBy(this._spriteMatrix, w, h);
                         cc.math.Matrix3.scaleBy(this._spriteMatrix, -1, -1);
                         this._spriteMatrixSet= true;
                     } else if (this._flippedX) {
                         cc.math.Matrix3.translateBy(this._spriteMatrix, w, 0);
                         cc.math.Matrix3.scaleBy(this._spriteMatrix, -1, 1);
                         this._spriteMatrixSet= true;
                     } else if (this._flippedY) {
                         cc.math.Matrix3.translateBy(this._spriteMatrix, 0, h);
                         cc.math.Matrix3.scaleBy(this._spriteMatrix, 1, -1);
                         this._spriteMatrixSet= true;
                     }

                     if ( this._spriteFrame.needsSpecialMatrix() ) {
                         cc.math.Matrix3.translateBy(this._spriteMatrix,
                             this._spriteFrame._offsetFromCenter.x,
                             this._spriteFrame._offsetFromCenter.y);

                         if (this._spriteFrame._rotated) {
                             cc.math.Matrix3.translateBy(this._spriteMatrix, w / 2, h / 2);
                             cc.math.Matrix3.rotateBy(this._spriteMatrix, Math.PI / 2);
                             cc.math.Matrix3.translateBy(this._spriteMatrix, -w / 2, -h / 2);
                         }

                         this._spriteMatrixSet = true;
                     }

         *
         * @private
         */
        __createMatrix(): void;
        __setLocalTransform(): void;
        /**
         * Make the sprite to be horizontally mirrored.
         * @method cc.node.Sprite#setFlippedX
         * @param f {boolean} true to mirror, false by default.
         * @returns {cc.node.Sprite}
         */
        setFlippedX(f: boolean): Sprite;
        /**
         * Make the sprite to be vertically mirrored.
         * @method cc.node.Sprite#setFlippedY
         * @param f {boolean} true to mirror, false by default.
         * @returns {cc.node.Sprite}
         */
        setFlippedY(f: boolean): Sprite;
        resizeOnSpriteFrameSet(b: boolean): Sprite;
        setTextureRect(r: cc.math.Rectangle): void;
        flippedX: boolean;
        flippedY: boolean;
    }
    class SpriteBatchNode extends Sprite {
        constructor(ddata: any, rect?: cc.math.Rectangle);
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.node {
    import RenderingContext = cc.render.RenderingContext;
    /**
     * @class cc.node.FastSprite
     * @extends cc.node.Sprite
     * @classdesc
     *
     * While Nodes in general are heavy weight visual components, a Fast sprite is a very lightweight Node. In opposition
     * to a Node, a FastSprite:
     *   + scene graph does not discard it
     *   + expects to have no children. hierarchies are not handled.
     *   + get no input routed to it, such as mouse, touch, etc.
     *   + does not calculate a local bounding box, unless explicitly stated.
     *   + like old nodes, they expect than transformation and positional anchor point to be the same.
     *
     * <p>
     *     FastSprites aim at super fast management and rendering, specially in WebGL where a modern mobile phone could
     *     deliver several thousand of them at steady 60 fps.
     * <p>
     *     FastSprites are ideal for particle rendering, or for visually massive amount of nodes.
     * <p>
     *     If rendering in canvas, a FastSprite will be as fast a Sprite node. (way slower than FastSprite)
     *
     */
    class FastSprite extends cc.node.Sprite {
        constructor(ddata: any);
        visit(ctx: RenderingContext): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc {
    module widget {
        import SpriteFrame = cc.node.sprite.SpriteFrame;
        enum ButtonStatus {
            NORMAL = 0,
            PRESSED = 1,
            OVER = 2,
            DISABLED = 3,
        }
        /**
         * @class cc.widget.Button
         * @classdesc
         *
         * @extends cc.node.Node
         *
         * A button is a special Node type that reacts to touch/mouse events.
         * It is described by 4 SpriteFrame objects of which only one is mandatory to set.
         * This are associated with the button states: normal, over, down and disabled. If any of the images is not defined,
         * they will fallback to use the normal-state image.
         */
        class Button extends cc.node.Node {
            /**
             * Button images in this order: normal, pressed, over, disabled
             * @type {Array<cc.node.sprite.SpriteFrame>}
             * @private
             */
            _frames: SpriteFrame[];
            _status: ButtonStatus;
            _callback: () => any;
            constructor();
            disable(): void;
            enable(): void;
            setEnabled(b: boolean): void;
            draw(ctx: cc.render.RenderingContext): void;
            init(obj: any): void;
            __getCurrentFrame(): SpriteFrame;
            setStatus(st: ButtonStatus): void;
        }
    }
    function MenuItemSprite(normal: any, selected: any, disabled: any, callback: any, context: any): widget.Button;
    function MenuItemLabel(label: cc.widget.Label, callback: any): widget.Label;
    class MenuItemFont extends cc.node.Node {
        _label: cc.widget.LabelTTF;
        _callback: () => any;
        _enabled: boolean;
        constructor(_initializer: cc.widget.LabelTTFInitializer | string, callback: () => any, target: any);
        setFontSize(s: any): void;
        getFontSize(): number;
        setFontName(name: any): void;
        getFontName(): string;
        setEnabled(b: boolean): void;
        fontSize: number;
        fontName: string;
        static DEFAULT_SIZE: number;
        static DEFAULT_FONT: string;
        static setFontSize(fontSize: any): void;
        static fontSize(): number;
        static setFontName(name: any): void;
    }
    class Menu extends cc.node.Node {
        _buttons: cc.widget.Button[];
        _padding: number;
        constructor(...buttons: cc.widget.Button[]);
        alignItemsVerticallyWithPadding(padding: any): void;
        alignItemsInColumns(): void;
    }
    class MenuItemToggle extends cc.node.Node {
        _currentOptionIndex: number;
        _options: cc.node.Node[];
        _callback: (m: cc.node.Node) => any;
        _enabled: boolean;
        constructor();
        setEnabled(b: boolean): void;
        initWithItems(): void;
        __init(args: any[]): void;
        addItem(node: cc.node.Node): void;
        setCallback(callback: (m: cc.node.Node) => any): void;
        onClick(callback: (m: cc.node.Node) => any): void;
        setSelectedIndex(index: number): void;
        __emit(): void;
        __nextOption(): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.widget {
    enum VALIGN {
        TOP = 0,
        MIDDLE = 1,
        BOTTOM = 2,
    }
    enum HALIGN {
        LEFT = 0,
        CENTER = 1,
        RIGHT = 2,
    }
    /**
     * @class cc.widget.Label
     * @extends cc.node.Node
     * @classdesc
     *
     * This object represents a label widget which simply writes text.
     * The text is written using a SpriteFont object which must be in the AssetManager cache.
     *
     * The label text can be drawn freely, that is each text line will span as much width as needed (method
     * or flow constrained by calling <code>setFlowWidth</code where the text will be drawn to a fixed width.
     *
     * For both methods, the label will calculate its bounds upon text or font change. You can override this behavior
     * by calling <code>setResizeContentSize(bool)</code>
     *
     * The text can be multiline text separated by \n characters.
     *
     *
     *
     */
    class Label extends cc.node.Node {
        _text: string;
        _textSize: cc.math.Dimension;
        _font: cc.plugin.font.SpriteFont;
        _resizeContentSize: boolean;
        _valign: cc.widget.VALIGN;
        _halign: cc.widget.HALIGN;
        _enabled: boolean;
        _flowWidth: number;
        /**
         * Build a new LabelBM object instance.
         * @param text {string} label text.
         * @param fontName {string} a cc.plugin.font.SpriteFont in the AssetManager cache object name.
         */
        constructor(text: string, fontName: string);
        setResizeContentSize(b: boolean): Label;
        __measureText(): void;
        setFont(fontName: string): void;
        setText(text: string): void;
        setHAlign(a: cc.widget.HALIGN): Label;
        setVAlign(a: cc.widget.VALIGN): Label;
        draw(ctx: cc.render.RenderingContext): void;
        textAlign: cc.widget.HALIGN;
        textVerticalAlign: cc.widget.VALIGN;
        /**
         *
         * @param text
         * @deprecated
         */
        setString(text: string): void;
        setEnabled(e: boolean): void;
        flowWidth(f: number): Label;
    }
    interface LabelTTFInitializer {
        text: string;
        font: string;
        size: number;
        flowWidth?: number;
        fillColor?: any;
        strokeColor?: any;
        strokeSize?: number;
        fill?: boolean;
        stroke?: boolean;
        shadowBlur?: number;
        shadowColor?: any;
        shadowOffsetX?: number;
        shadowOffsetY?: number;
        horizontalAlignment?: number;
        verticalAlignment?: number;
    }
    class LabelTTF extends cc.node.Sprite {
        _text: string;
        _font: string;
        _size: number;
        _flow: boolean;
        _flowWidth: number;
        _fillColor: string;
        _strokeColor: string;
        _strokeSize: number;
        _fill: boolean;
        _stroke: boolean;
        _shadowBlur: number;
        _shadowColor: any;
        _shadowOffsetX: number;
        _shadowOffsetY: number;
        _texture: cc.render.Texture2D;
        _horizontalAlignment: HALIGN;
        _verticalAlignment: VALIGN;
        _enabled: boolean;
        constructor(_initializer?: LabelTTFInitializer | string, font?: string, fontSize?: number, dimensions?: cc.math.Dimension, halign?: cc.widget.HALIGN, valign?: cc.widget.VALIGN);
        initialize(init: LabelTTFInitializer): LabelTTF;
        setEnabled(b: boolean): void;
        setText(text: string): void;
        setString(text: string): void;
        __initLabel(): void;
        __prepareContext(ctx: CanvasRenderingContext2D): void;
        __drawText(text: string, size: cc.math.Dimension): HTMLCanvasElement;
        __getTextSize(ctx: CanvasRenderingContext2D, text: string, flowWidth: number): cc.math.Dimension;
        getFont(): string;
        setFont(font: string): void;
        setFontSize(s: number): void;
        getFontSize(): number;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.render {
    /**
     * @namespace WebGLState
     * @memberOf cc.render
     *
     * @classdesc
     * This object keeps global webGL state. It has two main purposes.
     *  + Avoid duplicate webgl calls.
     *  + Share internal renderer state with external shaders or renderers so that WebGL state can be consistent when
     *    getting back to the renderer.
     *
     */
    class WebGLState {
        _gl: WebGLRenderingContext;
        /**
         * Current program
         * @member cc.render.WebGLState#_currentProgram
         * @type {WebGLProgram}
         */
        _currentProgram: WebGLProgram;
        /**
         * Current texture
         * @member cc.render.WebGLState#_currentTexture
         * @type {WebGLTexture}
         */
        _currentTexture: WebGLTexture;
        /**
         * blendFunc source blending value.
         * @member cc.render.WebGLState#_blendSource
         * @type {number}
         * @private
         */
        _blendSource: number;
        /**
         * blendFunc destination blending value.
         * @member cc.render.WebGLState#_blendDestination
         * @type {number}
         * @private
         */
        _blendDestination: number;
        /**
         * Object to hold gl flags values, particularly, all calls to gl.enable
         * @member cc.render.WebGLState#_flags
         * @type {{flag:number, enabled:boolean}}
         * @private
         */
        _flags: any;
        /**
         * current gl.clearColor value.
         * @member cc.render.WebGLState#_clearColor
         * @type {Array<number>}
         * @private
         */
        _clearColor: number[];
        /**
         * current gl.viewport value.
         * @member cc.render.WebGLState#_viewport
         * @type {Array<number>}
         * @private
         */
        _viewport: number[];
        /**
         * gl.TEXTURE<XX> values.
         * @member cc.render.WebGLState#_texture
         * @type {{ texture:number, enabled:boolean }}
         * @private
         */
        _texture: any;
        /**
         * WebGLUniformLocation dictionary.
         * @member cc.render.WebGLState#_uniformLocation
         * @type {{uniform:WebGLUniformLocation, value:any}}
         * @private
         */
        _uniformLocation: any;
        /**
         * vertex attrib array enabled values.
         * @member cc.render.WebGLState#_attribArray
         * @type {Map<number,boolean>}
         * @private
         */
        _attribArray: any;
        _attribPointers: any;
        constructor(_gl: WebGLRenderingContext);
        useProgram(program: WebGLProgram): void;
        /**
         *
         * @param i {number} gl.TEXTURE<X> value.
         */
        activeTexture(i: number): void;
        bindTexture(type: number, t: WebGLTexture): void;
        enable(flag: number): void;
        flagEnabled(flag: any): boolean;
        disable(flag: number): void;
        clear(flags: any): void;
        clearColor(r: number, g: number, b: number, a: number): void;
        viewport(x: number, y: number, w: number, h: number): void;
        blendFunc(blendSource: number, blendDestination: number): void;
        __uniform1Scalar(location: any, value: any): void;
        uniform1i(location: any, value: any): void;
        uniform1f(location: any, value: any): void;
        uniformMatrix4fv(location: any, transpose: boolean, value: Float32Array): void;
        vertexAttribPointer(locationIndex: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void;
        enableVertexAttribArray(locationIndex: number): void;
        disableVertexAttribArray(locationIndex: number): void;
        setTexture(textureIndex: number, textureId: WebGLTexture): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.transition {
    import Scene = cc.node.Scene;
    import Action = cc.action.Action;
    import TimeInterpolator = cc.action.TimeInterpolator;
    /**
     * Callback definition for transition end events.
     * @memberOf cc.transition
     * @callback CallbackTransitionEnd
     * @param transition {cc.transition.Transition} Transition triggering end events.
     */
    interface CallbackTransitionEnd {
        (transition: Transition): void;
    }
    /**
     * @class cc.transition.Transition
     * @classdesc
     *
     * Transitions are special action groups that move in and out Scenes.
     * <br>
     * As such, only Scenes have Transtions applied, while regulars Nodes have Actions.
     * This is the preferred way for a Director to switch between scenes by calling
     * <code>director.runScene( scene, transition )</code>.
     */
    class Transition {
        /**
         * Director callback for transition end events.
         * @member cc.transition.Transition#_transitionCallback
         * @type {cc.transition.CallbackTransitionEnd}
         * @private
         */
        _transitionCallback: CallbackTransitionEnd;
        /**
         * User defined callback for transition end events.
         * @member cc.transition.Transition#_userTransitionCallback
         * @type {cc.transition.CallbackTransitionEnd}
         * @private
         */
        _userTransitionCallback: CallbackTransitionEnd;
        /**
         * Transition duration in milliseconds.
         * @member cc.transition.Transition#_duration
         * @type {number}
         * @private
         */
        _duration: number;
        /**
         * Transition interpolator.
         * <br>
         * {@link cc.action.TimeInterpolator}
         * @member cc.transition.Transition#_interpolator
         * @type {cc.action.TimeInterpolator}
         * @private
         */
        _interpolator: TimeInterpolator;
        /**
         * Scene to get in. This is a V3 backwards compatibility need.
         * In v3, Transition extends Scene.
         * In v4, Transition does NOT extend Scene.
         * To keep the director.runAction( Scene|Transition ) method signature, the transition must
         * be built with a target Scene in.
         * @member cc.transition.Transition#_sceneIn
         * @type {cc.node.Scene}
         * @private
         */
        _sceneIn: Scene;
        /**
         * Create a new Transition
         * @method cc.transition.Transition#constructor
         * @param duration {number} transition duration in milliseconds.
         */
        constructor(duration: number, scene?: Scene);
        /**
         * Initialize the transition.
         * @method cc.transition.Transition#initialize
         * @param sceneIn {cc.node.Scene} entering scene.
         * @param sceneOut {cc.node.Scene} exiting scene
         * @returns {cc.transition.Transition} the initialized transition
         */
        initialize(sceneIn: Scene, sceneOut: Scene): Transition;
        /**
         * Register director callback for transition end events.
         * @method cc.transition.Transition#onDirectorTransitionEnd
         * @param callback {cc.transition.CallbackTransitionEnd}
         * @returns {cc.transition.Transition}
         */
        onDirectorTransitionEnd(callback: CallbackTransitionEnd): Transition;
        /**
         * Register user callback for transition end events.
         * @method cc.transition.Transition#onTransitionEnd
         * @param callback {cc.transition.CallbackTransitionEnd}
         * @returns {cc.transition.Transition}
         */
        onTransitionEnd(callback: CallbackTransitionEnd): Transition;
        /**
         * Set the transition interpolator.
         * @method cc.transition.Transition#setInterpolator
         * @param i {cc.action.TimeInterpolator}
         * @returns {cc.transition.Transition}
         */
        setInterpolator(i: TimeInterpolator): Transition;
        /**
         * Prepare the Transition Actions callbacks.
         * In a transition, only the entering scene is mandatory. For example, when the director starts and only one
         * scene slides in.
         * @method cc.transition.Transition#__setupActionCallbacks
         * @param actionIn {cc.node.Scene} enter scene.
         * @param actionOut {cc.node.Scene=} exit scene.
         * @private
         */
        __setupActionCallbacks(actionIn: Action, actionOut?: Action): void;
    }
    /**
     * Enumeration for TransitionMove directions.
     *
     * @tsenum cc.transition.TransitionMoveDirection
     */
    enum TransitionMoveDirection {
        LEFT = 0,
        RIGHT = 1,
        TOP = 2,
        BOTTOM = 3,
    }
    /**
     * @class cc.transition.TransitionFade
     * @classdesc
     */
    class TransitionFade extends Transition {
        /**
         *
         * @param duration
         */
        constructor(duration: number, scene?: Scene);
        initialize(sceneIn: Scene, sceneOut?: Scene): Transition;
    }
    /**
     * @class cc.transition.TransitionMove
     * @classdesc
     *
     * Base Transition for Slide Transitions.
     */
    class TransitionMove extends Transition {
        direction: TransitionMoveDirection;
        /**
         * Transition Slide direction.
         * @member cc.transition.TransitionMove#direction
         * @type {cc.transition.TransitionMoveDirection}
         */
        /**
         * @method cc.transition.TransitionMove#constructor
         * @param duration {number} transition duration in milliseconds.
         * @param direction {cc.transition.TransitionMoveDirection}
         * @param scene {cc.node.Scene}
         */
        constructor(duration: number, direction?: TransitionMoveDirection, scene?: Scene);
        /**
         * Initialize the transition.
         * @method cc.transition.TransitionMove#initialize
         * @override
         * @param sceneIn {cc.node.Scene} scene in.
         * @param sceneOut {cc.node.Scene} scene out.
         * @returns {cc.transition.TransitionMove}
         */
        initialize(sceneIn: Scene, sceneOut?: Scene): Transition;
    }
    /**
     * @class cc.transition.TransitionSlideInL
     * @classdesc
     * A Transition that enters from the left. This is just some sugar to build a TransitionMove.
     */
    class TransitionSlideInL extends TransitionMove {
        constructor(duration: number, scene?: Scene);
    }
    /**
     * @class cc.transition.TransitionSlideInR
     * @classdesc
     * A Transition that enters from the right. This is just some sugar to build a TransitionMove.
     */
    class TransitionSlideInR extends TransitionMove {
        constructor(duration: number, scene?: Scene);
    }
    /**
     * @class cc.transition.TransitionSlideInT
     * @classdesc
     * A Transition that enters from the top. This is just some sugar to build a TransitionMove.
     */
    class TransitionSlideInT extends TransitionMove {
        constructor(duration: number, scene?: Scene);
    }
    /**
     * @class cc.transition.TransitionSlideInB
     * @classdesc
     * A Transition that enters from the bottom. This is just some sugar to build a TransitionMove.
     */
    class TransitionSlideInB extends TransitionMove {
        constructor(duration: number, scene?: Scene);
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render.shader {
    import WebGLState = cc.render.WebGLState;
    /**
     * @class cc.render.shader.UniformInitializer
     * @interface
     * @classdesc
     *
     * Uniform initializer object.
     *
     */
    interface UniformInitializer {
        /**
         * Uniform type.
         * @member cc.render.shader.UniformInitializer#type
         * @type {string}
         */
        type: string;
        /**
         * Uniform initial value.
         * @member cc.render.shader.UniformInitializer#value
         * @type {any}
         */
        value: any;
    }
    /**
     * @class cc.render.shader.Uniform
     * @classdesc
     *
     * Base class for Shader uniforms.
     *
     */
    class Uniform {
        _name: string;
        _type: string;
        _value: any;
        /**
         * Previously value set in shader's location.
         * @member cc.render.shader.Uniform#_prevValue
         * @type {any}
         * @private
         */
        _prevValue: any;
        /**
         * Shader program location.
         * @member cc.render.shader.Uniform#_location
         * @type {any}
         * @private
         */
        _location: any;
        /**
         * Uniform name
         * @member cc.render.shader.Uniform#_name
         * @type {string}
         */
        /**
         * Uniform type
         * @member cc.render.shader.Uniform#_type
         * @type {string}
         */
        /**
         * Uniform initial value.
         * The value is not set in the shader until <code>setValue</code> is called.
         * @member cc.render.shader.Uniform#_value
         * @type {any}
         */
        /**
         * Create a new Uniform instance.
         * @method cc.render.shader.Uniform#constructor
         * @param _name {string}
         * @param _type {string}
         * @param _value {any}
         */
        constructor(_name: string, _type: string, _value: any);
        /**
         * Set Uniform shader location.
         * @method cc.render.shader.Uniform#setLocation
         * @param l {any} shader location.
         */
        setLocation(l: any): void;
        /**
         * Set shader location value.
         * @method cc.render.shader.Uniform#setValue
         * @param gl {WebGLState}
         */
        updateValue(gl: WebGLState): void;
        setValue(v: any): void;
        /**
         * Create a uniform instance based on its type.
         * @method cc.render.shader.Uniform.createUniform
         * @param name {string} uniform name
         * @param type {string} uniform type
         * @param value {any} uniform value.
         * @returns {cc.render.Uniform} A Uniform instance.
         */
        static createUniform(name: string, type: string, value: any): TextureUniform;
    }
    /**
     * @class cc.render.shader.TextureUniform
     * @classdesc
     *
     * Create a Texture uniform.
     * Texture value is global for every shader that uses a sampler.
     *
     */
    class TextureUniform extends Uniform {
        /**
         * Create a TextureUniform instance.
         * @method cc.render.shader.TextureUniform#constructor
         * @param name {string}
         * @param type {string}
         * @param value {any}
         */
        constructor(name: string, type: string, value: any);
        /**
         * Set shader location value.
         * The current texture Id is compared with an statically stored texture Id.
         * @member cc.render.shader.TextureUniform#setValue
         * @param gl {WebGLRenderingContext}
         */
        updateValue(gl: WebGLState): void;
    }
    /**
     * @class cc.render.shader.MatrixUniform
     * @classdesc
     *
     * Create a Matrix uniform.
     *
     */
    class MatrixUniform extends Uniform {
        _dirty: boolean;
        /**
         * @method cc.render.shader.MatrixUniform#constructor
         * @param name {string}
         * @param type {string}
         * @param value {any}
         */
        constructor(name: string, type: string, value: any);
        setValue(v: Float32Array): void;
        /**
         * Set Shader location value.
         * @method cc.render.shader.MatrixUniform#setValue
         * @param gl {WebGLRenderingContext}
         */
        updateValue(gl: WebGLState): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render.shader {
    /**
     * @class cc.render.shader.Attribute
     * @classdesc
     *
     * Shader attribute.
     *
     */
    class Attribute {
        _name: string;
        _location: any;
        /**
         * Attribute name.
         * @member cc.render.shader.Attribute#_name
         * @type {string}
         */
        /**
         * Attribute location.
         * @member cc.render.shader.Attribute#_location
         * @type {any}
         */
        /**
         * Create a new Attribute instance.
         * @method cc.render.shader.Attribute#constructor
         * @param _name {string}
         * @param _location {any}
         */
        constructor(_name: string, _location: any);
        /**
         * Enable the shader attribute.
         * @method cc.render.shader.Attribute#enable
         * @param gl {WebGLRenderingContext}
         */
        enable(gl: cc.render.WebGLState): void;
        /**
         * Disable the shader attribute.
         * @method cc.render.shader.Attribute#disable
         * @param gl {WebGLRenderingContext}
         */
        disable(gl: cc.render.WebGLState): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render.shader {
    import Uniform = cc.render.shader.Uniform;
    import UniformInitializer = cc.render.shader.UniformInitializer;
    import Attribute = cc.render.shader.Attribute;
    import WebGLState = cc.render.WebGLState;
    interface MapOfUniformInitializer {
        [name: string]: UniformInitializer;
    }
    /**
     * @class cc.render.shader.AbstractShaderInitializer
     * @interface
     * @classdesc
     *
     * Shader initializer object.
     *
     */
    interface AbstractShaderInitializer {
        /**
         * Vertex shader string definition
         * @member cc.render.shader.AbstractShaderInitializer#vertexShader
         * @type {string|Array<string>}
         */
        vertexShader: string | string[];
        /**
         * Fragment shader string definition
         * @member cc.render.shader.AbstractShaderInitializer#fragmentShader
         * @type {string|Array<string>}
         */
        fragmentShader: string | string[];
        /**
         * Map of uniform initializers.
         * @member cc.render.shader.AbstractShaderInitializer#uniforms
         * @type {Map<string,cc.render.shader.UniformInitializer>}
         */
        uniforms?: MapOfUniformInitializer;
        /**
         * Array of attribute names.
         * @member cc.render.shader.AbstractShaderInitializer#attributes
         * @type {Array<string>}
         */
        attributes?: Array<any>;
    }
    /**
     * @class cc.render.shader.AbstractShader
     * @classdesc
     *
     * Base class for all 2D rendering shaders.
     *
     */
    class AbstractShader {
        _webglState: WebGLState;
        /**
         * Collection of the shader uniform objects.
         * @member cc.render.shader.AbstractShader#_uniforms
         * @type {Array<cc.render.shader.Uniform>}
         * @private
         */
        _uniforms: Array<Uniform>;
        /**
         * Collection of the shader attribute objects.
         * @member cc.render.shader.AbstractShader#_attributes
         * @type {Array<cc.render.shader.Uniform>}
         * @private
         */
        _attributes: Attribute[];
        /**
         * Compiled shader program.
         * @member cc.render.shader.AbstractShader#_shaderProgram
         * @type {any}
         * @private
         */
        _shaderProgram: WebGLProgram;
        /**
         * Shader Uniform projection matrix.
         * @member cc.render.shader.AbstractShader#_uniformProjection
         * @type {any}
         * @private
         */
        _uniformProjection: cc.render.shader.Uniform;
        /**
         * WebGLState
         * @member cc.render.shader.AbstractShader#_webglState
         * @type {cc.render.WebGLState}
         */
        /**
         * Build a new AbstractShader instance.
         * @method cc.render.shader.AbstractShader#constructor
         * @param _webglState {WebGLState}
         * @param shaderDefinition {cc.render.shader.AbstractShaderInitializer}
         */
        constructor(_webglState: WebGLState, shaderDefinition: AbstractShaderInitializer);
        enableAttributes(): AbstractShader;
        disableAttributes(): AbstractShader;
        __getShaderDef(def: string | string[]): string;
        /**
         * Initialize a shader from a shader initializer.
         * Do not call directly. Ever.
         * @method cc.render.shader.AbstractShader#__initializeFromShaderDefinition
         * @param shaderDef {cc.render.shader.AbstractShaderInitializer}
         * @private
         */
        __initializeFromShaderDefinition(shaderDef: AbstractShaderInitializer): void;
        /**
         * Get a shader of given type.
         * Do not call directly.
         * @member cc.render.shader.AbstractShader#__getShader
         * @param gl {WebGLRenderingContext}
         * @param type {string}
         * @param str {string}
         * @returns {any}
         * @private
         */
        __getShader(gl: any, type: any, str: any): any;
        /**
         * Use this program for gpu rendering.
         * @method cc.render.shader.AbstractShader#useProgram
         * @returns {cc.render.shader.AbstractShader}
         */
        useProgram(): void;
        notUseProgram(): void;
        /**
         * Flush geometry.
         * Must br overridden.
         * @method cc.render.shader.AbstractShader#flushBuffersWithContent
         * @param rcs {rcs:cc.render.RenderingContextSnapshot}
         */
        flushBuffersWithContent(rcs: cc.render.RenderingContextSnapshot): void;
        __updateUniformValues(): void;
        /**
         * Find a uniform by name.
         * @method cc.render.shader.AbstractShader#findUniform
         * @param name {string}
         * @returns {cc.render.shader.Uniform}
         */
        findUniform(name: any): cc.render.shader.Uniform;
        /**
         * Find an attribute by name.
         * @method cc.render.shader.AbstractShader#findAttribute
         * @param name {string}
         * @returns {cc.render.shader.Attribute}
         */
        findAttribute(name: any): Attribute;
        /**
         * Build a shader mat4 from a Matrix3 instance.
         * @method cc.render.shader.AbstractShader#mat4_from_mat3
         * @param mat3 {Float32Array}
         * @param __mat4 {Float32Array}
         * @returns {Float32Array}
         */
        mat4_from_mat3(mat3: Float32Array, __mat4: Float32Array): Float32Array;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render.shader {
    import AbstractShader = cc.render.shader.AbstractShader;
    /**
     * @class cc.render.shader.SolidColorShader
     * @classdesc
     *
     * This shader fills geometry with a solid color.
     *
     */
    class SolidColorShader extends AbstractShader {
        /**
         * Spare matrix
         * @member cc.render.shader.SolidColorShader.mat
         * @type {Float32Array}
         */
        static mat: Float32Array;
        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.SolidColorShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform: any;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition: any;
        /**
         * Shader texture coords attribute. Not used in this shader.
         * @member cc.render.shader.SolidColorShader#_attributeTexture
         * @type {any}
         * @private
         */
        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.SolidColorShader#_attributeColor
         * @type {any}
         * @private
         */
        _attributeColor: any;
        /**
         * Build a new SolidColorShader instance.
         * @method cc.render.shader.SolidColorShader#constructor
         * @param gl {WebGLRenderingContext} gl context
         * @param ortho {Float32Array} projection matrix.
         */
        constructor(gl: cc.render.WebGLState);
        flushBuffersWithContent(rcs: cc.render.RenderingContextSnapshot): void;
    }
}
/**
 * Created by ibon on 11/17/14.
 */
declare module cc.render.shader {
    import AbstractShader = cc.render.shader.AbstractShader;
    /**
     * @class cc.render.shader.TextureShader
     * @extends AbstractShader
     * @classdesc
     *
     * This shader fills rects with an image. It is expected to be invoked by calls to drawImage.
     *
     */
    class TextureShader extends AbstractShader {
        /**
         * Spare matrix
         * @member cc.render.shader.TextureShader.mat
         * @type {Float32Array}
         */
        static mat: Float32Array;
        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.SolidColorShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform: any;
        /**
         * Shader Uniform for texture.
         * @member cc.render.shader.SolidColorShader#_uniformTextureSampler
         * @type {any}
         * @private
         */
        _uniformTextureSampler: any;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition: any;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributeTexture
         * @type {any}
         * @private
         */
        _attributeTexture: any;
        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.SolidColorShader#_attributeColor
         * @type {any}
         * @private
         */
        _attributeColor: any;
        constructor(gl: cc.render.WebGLState);
        flushBuffersWithContent(rcs: cc.render.RenderingContextSnapshot): void;
    }
    /**
     * @class cc.render.shader.MeshShader
     * @extends AbstractShader
     * @classdesc
     *
     * This shader fills rects with an image. It is expected to be invoked by calls to drawImage.
     *
     */
    class MeshShader extends AbstractShader {
        /**
         * Spare matrix
         * @member cc.render.shader.TextureShader.mat
         * @type {Float32Array}
         */
        static mat: Float32Array;
        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.MeshShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform: any;
        /**
         * Shader Uniform for texture.
         * @member cc.render.shader.MeshShader#_uniformTextureSampler
         * @type {any}
         * @private
         */
        _uniformTextureSampler: any;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.MeshShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition: any;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.MeshShader#_attributeTexture
         * @type {any}
         * @private
         */
        _attributeTexture: any;
        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.MeshShader#_uniformColor
         * @type {any}
         * @private
         */
        _uniformColor: any;
        constructor(gl: cc.render.WebGLState);
        flushBuffersWithContent(rcs: cc.render.RenderingContextSnapshot): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render.shader {
    class TexturePatternShader extends AbstractShader {
        static mat: Float32Array;
        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.TexturePatternShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform: cc.render.shader.Uniform;
        _uniformPatternTransform: cc.render.shader.Uniform;
        _uniformPatternImageBounds: cc.render.shader.Uniform;
        _uniformPatternBounds: cc.render.shader.Uniform;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.TexturePatternShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition: any;
        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.TexturePatternShader#_attributeColor
         * @type {any}
         * @private
         */
        _attributeColor: any;
        constructor(gl: cc.render.WebGLState);
        flushBuffersWithContent(rcs: cc.render.RenderingContextSnapshot): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render.shader {
    class FastTextureShader extends AbstractShader {
        /**
         * Spare matrix
         * @member cc.render.shader.TextureShader.mat
         * @type {Float32Array}
         */
        static mat: Float32Array;
        /**
         * Shader Uniform transformation matrix.
         * @member cc.render.shader.SolidColorShader#_uniformTransform
         * @type {any}
         * @private
         */
        _uniformTransform: any;
        /**
         * Shader Uniform for texture.
         * @member cc.render.shader.SolidColorShader#_uniformTextureSampler
         * @type {any}
         * @private
         */
        _uniformTextureSampler: any;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributePosition
         * @type {any}
         * @private
         */
        _attributePosition: any;
        /**
         * Shader geometry attribute.
         * @member cc.render.shader.SolidColorShader#_attributeTexture
         * @type {any}
         * @private
         */
        _attributeTexture: any;
        /**
         * Shader geometry color attribute.
         * @member cc.render.shader.SolidColorShader#_attributeColor
         * @type {any}
         * @private
         */
        _attributeColor: any;
        _attributeAnchorPosition: any;
        _attributeRotation: any;
        _attributeScale: any;
        constructor(gl: cc.render.WebGLState);
        flushBuffersWithContent(): void;
    }
}
/**
 * Created by ibon on 11/19/14.
 */
declare module cc.render.shader {
    class Buffer {
        _gl: WebGLRenderingContext;
        _type: number;
        _buffer: WebGLBuffer;
        _prevValue: any;
        _usage: number;
        constructor(_gl: WebGLRenderingContext, _type: number, initialValue: any, usage: number);
        /**
         *
         * @param gl {WebGLRenderingContext}
         * @param v {Float32Array|UInt16Array}
         */
        enableWithValue(v: any): void;
        forceEnableWithValue(v: any): void;
        bind(type: any): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render {
    type RendererResizedCallback = (uw: number, uh: number, puw: number, puh: number, w: number, h: number, sceneHint: cc.render.ScaleContentSceneHint) => any;
    var ORIGIN_BOTTOM: number;
    var ORIGIN_TOP: number;
    /**
     * This flag sets renderer's y axis origin to be on top or bottom (y axis increases up or downwards.
     * <p>
     * Bottom is default's open/webgl while top is canvas' default.
     * <li>The default for CocosJS engine is bottom
     * <li>Setting this flag will affect both renderer types.
     * <li>This flag must be set BEFORE creating a renderer object.
     * <p>
     *     Performance considerations.
     * <p>
     *     While changing this flag for a WebGL renderer has no impact in performance, this is not the case for Canvas.
     *     If (as it is by default) bottom is specified for the renderer origin, there's an important performance penalty.
     *     This is mainly due to the fact that for each node, its coordinate system must be inverted, and thus an extra
     *     call to concatenate the current transformation matrix with the inversion matrix must be performed.
     *     In my MBA (core i7 dual core 2Ghz), with 3000 sprites in canvas the difference can be up to 8 fps. <br>
     *     There could be some solutions to avoid this extra transformation call though:
     *     <li>Invert all your images at compile time. Images are already flipped vertically before loading.
     *     <li>Invert all your images at load time. Extra memory, and extra bootstrapping time.
     *     <li>Change the y axis orientation to cc.render.ORIGIN_BOTTOM, and avoid the extra call. This will work for both canvas and
     *         webgl rendering.
     * <p>
     *     In either case, right now, the system DOES apply the extra transformation, and the performance penalty is
     *     there.
     * <p>
     *     It is also important to note that the local coordinate system y-axis will for each node be positioned as well
     *     either at the top or the bottom of the node itself.
     *
     * @member cc.render.RENDER_ORIGIN
     * @type {number}
     */
    var RENDER_ORIGIN: number;
    function autodetectRenderer(w: number, h: number, elem: string): cc.render.Renderer;
    import RenderingContext = cc.render.RenderingContext;
    import Node = cc.node.Node;
    import Dimension = cc.math.Dimension;
    import Texture2D = cc.render.Texture2D;
    /**
     * @class cc.render.Renderer
     * @classdesc
     *
     * Interface for any renderer.
     * Must be subclassed to build a canvas or gl renderer.
     *
     */
    class Renderer {
        /**
         * Surface to render to.
         * @member cc.render.Renderer#_surface
         * @type {HTMLCanvasElement}
         * @private
         */
        _surface: HTMLCanvasElement;
        /**
         * Rendering context to render on the surface.
         * @member cc.render.Renderer#_renderingContext
         * @type {cc.render.RenderingContext}
         * @private
         */
        _renderingContext: RenderingContext;
        _dimension: Dimension;
        _addedToDOM: boolean;
        _scaleManager: cc.render.ScaleManager;
        _onContentScaled: RendererResizedCallback;
        /**
         * When scale content is enabled, this flag makes the canvas object to take over the whole screen and not
         * only the area that honors aspect ratio.
         * @member cc.render.Renderer#_adjustContentToFullScreen
         * @type {boolean}
         * @private
         */
        _adjustContentToFullScreen: boolean;
        _preferredUnits: cc.math.Dimension;
        _sceneHint: ScaleContentSceneHint;
        /**
         * Create a new Renderer instance.
         * @param w {width} surface pixels width
         * @param h {height} surface pixels height
         * @param surface {HTMLCanvasElement=} canvas object. @see {cc.render.Renderer#initialize}
         * @member cc.render.Renderer#constructor
         */
        constructor(w: number, h: number, surface?: HTMLCanvasElement);
        __calcPreferredUnits(): cc.math.Dimension;
        adjustContentToFullScreen(hint: cc.render.ScaleContentSceneHint): Renderer;
        onContentScaled(callback: RendererResizedCallback): Renderer;
        isAddedToDOM(): boolean;
        addToDOM(): void;
        /**
         * Get the rendering context. @see {cc.render.Renderer#getRenderingContext}
         * @method cc.render.Renderer#getRenderingContext
         * @returns {cc.render.RenderingContext}
         */
        getRenderingContext(): RenderingContext;
        /**
         * Render a node. @see {cc.render.Renderer#render}
         * @method cc.render.Renderer#render
         */
        render(node: Node): void;
        /**
         * Flush this renderer (push remaining content to the scene).
         * @method cc.render.Renderer#flush
         */
        flush(): void;
        getContentSize(): Dimension;
        prepareTexture(texture: Texture2D): void;
        getScaleContentMatrix(): Float32Array;
        /**
         * Return the internal scale management object.
         * This object handles all things relative to Renderer surface scale and on-screen positioning, as well as
         * orientation changes and content scale ratio calculations.
         * @method cc.node.Director#getScaleManager
         * @see cc.game.ScaleManager
         * @returns {cc.render.ScaleManager}
         */
        getScaleManager(): cc.render.ScaleManager;
        /**
         * Set renderer surface scale strategy.
         * @method cc.node.Director#setScaleStrategy
         * @param ss {cc.render.ScaleManagerStrategy} how renderer surface should me up/down scaled when the window
         *          changes size.
         * @param sp {cc.render.ScalePosition} how to position the renderer surface on the window object.
         */
        setScaleStrategy(ss: cc.render.ScaleManagerStrategy, sp: cc.render.ScalePosition): void;
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
        setScaleContent(w: number, h: number, cw?: number, ch?: number): number;
        /**
         * When <code>setScaleContent</code> has been called this method gives the scale factor for the units-pixel
         * mapping ratio.
         * @method cc.node.Director#getUnitsFactor
         * @returns {number}
         */
        getUnitsFactor(): number;
        /**
         * Set renderer surface orientation strategy. If set to landscape or portrait, when the window changes size
         * will notify about valid or wrong orientation.
         * Default orientation is set to BOTH.
         * @method cc.node.Director#setOrientationStrategy
         * @param os {cc.render.OrientationStrategy} desired orientation.
         * @param onOk {cc.render.OrientationCallback}
         * @param onError {cc.render.OrientationCallback}
         */
        setOrientationStrategy(os: cc.render.OrientationStrategy, onOk?: cc.render.OrientationOkCallback, onError?: cc.render.OrientationErrorCallback): void;
        /**
         * Get whether the device has fullScreen capabilities
         * @method cc.node.Director#isFullScreenCapable
         * @returns {boolean}
         */
        isFullScreenCapable(): boolean;
        /**
         * Is currently the system in full screen ?
         * @method cc.node.Director#isFullScreen
         * @returns {boolean}
         */
        isFullScreen(): boolean;
        /**
         * Start full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#startFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        startFullScreen(f?: () => any): void;
        /**
         * End full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#endFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        endFullScreen(f?: () => any): void;
        forceOrientation(os: OrientationStrategy, onOk?: OrientationOkCallback, onError?: OrientationErrorCallback): ScaleManager;
        checkOrientation(): void;
        __resize(w: number, h: number): void;
        getType(): number;
    }
    /**
     * @class cc.render.CanvasRenderer
     * @classdesc
     *
     * Create a Canvas renderer.
     */
    class CanvasRenderer extends Renderer {
        /**
         * Create a new CanvasRenderer instance
         * @method cc.render.CanvasRenderer#constructor
         * @param w {width} surface pixels width
         * @param h {height} surface pixels height
         * @param surface {HTMLCanvasElement=} canvas object. @see {cc.render.Renderer#initialize}
         */
        constructor(w: number, h: number, surface?: HTMLCanvasElement);
        /**
         * Get a renderingContext. Has drawing capabilities.
         * @method cc.render.CanvasRenderer#get:renderingContext
         * @returns {RenderingContext}
         */
        renderingContext: RenderingContext;
        /**
         * Get Canvas context (result from calling <code>canvas.getContext</code>).
         * @method cc.render.CanvasRenderer#get:canvasContext
         * @returns {any}
         */
        canvasContext: any;
        getCanvasContext(): RenderingContext;
        __resize(w: number, h: number): void;
        getType(): number;
    }
    /**
     * @class cc.render.WebGLRenderer
     * @classdesc
     *
     * Create a WebGL Renderer with drawing capabilities like a canvas object.
     */
    class WebGLRenderer extends Renderer {
        /**
         * The canvas result of calling <code>canvas.getContext("webgl")</code>
         * @member cc.render.WebGLRenderer#_webglState
         * @type {WebGLRenderingContext}
         * @private
         */
        _webglState: WebGLState;
        /**
         * Create a new WebGLRenderer instance.
         * @method cc.render.WebGLRenderer#constructor
         * @param w {width} surface pixels width
         * @param h {height} surface pixels height
         * @param surface {HTMLCanvasElement=} canvas object. @see {cc.render.Renderer#initialize}
         */
        constructor(w: number, h: number, surface?: HTMLCanvasElement);
        getCanvasContext(): WebGLState;
        /**
         * Get a renderingContext. Has drawing capabilities like a <code>CanvasRenderingContext2D</code>
         * @method cc.render.WebGLRenderer#get:renderingContext
         * @returns {RenderingContext}
         */
        renderingContext: RenderingContext;
        /**
         * Get Canvas context (result from calling <code>canvas.getContext</code>). Gets a gl context.
         * @method cc.render.WebGLRenderer#get:canvasContext
         * @returns {WebGLState}
         */
        canvasContext: any;
        prepareTexture(texture: cc.render.Texture2D): void;
        __resize(w: number, h: number): void;
        getType(): number;
    }
    /**
     * @class cc.render.PatchData
     * @interface
     * @classdesc
     *
     * 9Patch scale area definition.
     * The left, right, top, bottom, define the center area.
     * All the others are derived from this. For example, top-left corner (with y growing down) will be:
     *  (0,0)-(left,top)
     */
    interface PatchData {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    }
    /**
     * @name RendererUtil
     * @memberOf cc.render
     *
     * Various rendering helpers like 9path, etc.
     *
     */
    var RendererUtil: {
        draw9Patch: (ctx: RenderingContext, frameName: string, x: number, y: number, w: number, h: number, patchData?: PatchData) => void;
    };
}
/**
 * License: see license.txt file.
 */
declare module cc.render {
    import Color = cc.math.Color;
    var RENDERER_TYPE_CANVAS: number;
    var RENDERER_TYPE_WEBGL: number;
    /**
     * @class cc.render.Pattern
     * @classdesc
     *
     * Pattern fill info.
     *
     */
    class Pattern {
        _texture: Texture2D;
        _type: string;
        constructor(texture: cc.render.Texture2D, type: string);
        texture: Texture2D;
        type: string;
    }
    enum CompositeOperation {
        source_over = 0,
        source_out = 1,
        source_in = 2,
        source_atop = 3,
        destination_over = 4,
        destination_in = 5,
        destination_out = 6,
        destination_atop = 7,
        multiply = 8,
        screen = 9,
        copy = 10,
        lighter = 11,
        darker = 12,
        xor = 13,
        add = 14,
    }
    var CanvasToComposite: {
        "source-over": number;
        "source-out": number;
        "source-in": number;
        "source-atop": number;
        "destination-over": number;
        "destination-in": number;
        "destination-out": number;
        "destination-atop": number;
        "multiply": number;
        "screen": number;
        "copy": number;
        "lighter": number;
        "darker": number;
        "xor": number;
        "add": number;
    };
    var CompositeOperationToCanvas: string[];
    /**
     * @class cc.render.RenderingContext
     * @interface
     * @classdesc
     *
     * Minimum rendering context interface. All nodes when a call to draw is done, whether in canvas or webgl,
     * will be able to use these functions.
     *
     */
    interface RenderingContext {
        /**
         * Renderer surface (canvas object)
         * @member cc.render.RenderingContext#canvas
         * @type {HTMLCanvasElement}
         */
        canvas: HTMLCanvasElement;
        setTintColor(color: Color): any;
        setGlobalAlpha(alpha: number): any;
        getGlobalAlpha(): number;
        /**
         * Set rendering context current transformation matrix.
         * Preferred way of setting this will be by calling <code>matrix3.setRenderingContextTransform</code>.
         * @see {cc.math.Matrix3#setRenderingContextTransform}
         * @method cc.render.RenderingContext#setTransform
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): any;
        /**
         * Concatenate the matrix described by coeficcients with the current transformation matrix.
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        transform(a: number, b: number, c: number, d: number, tx: number, ty: number): any;
        /**
         * Fill a rect with the current fillStyle.
         * @method cc.render.RenderingContext#fillRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        fillRect(x: number, y: number, w: number, h: number): any;
        /**
         * Draw an image.
         * @method cc.render.RenderingContext#drawImage
         * @param image {HTMLImageElement|HTMLCanvasElement}
         * @param x {number}
         * @param y {number}
         */
        drawTexture(texture: Texture2D, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void;
        drawTextureUnsafe(texture: Texture2D, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void;
        /**
         * Clear the current renderer surface.
         * @method cc.render.RenderingContext#clear
         */
        clear(): any;
        /**
         * Flush current renderer. This method only makes sense for WebGL, the canvas implementation is empty.
         * A call to this method must be done in a WebGL renderer to have content shown in the canvas.
         * @method cc.render.RenderingContext#flush
         */
        flush(): any;
        /**
         * Rotate the current rendering context matrix by radians.
         * @method cc.render.RenderingContext#rotate
         * @param angleInRadians {number} radians to rotate
         */
        rotate(angleInRadians: number): any;
        /**
         * Translate the current rendering context.
         * @method cc.render.RenderingContext#translate
         * @param x {number}
         * @param y {number}
         */
        translate(x: number, y: number): any;
        /**
         * Scale the current rendering context.
         * @method cc.render.RenderingContext#scale
         * @param x {number}
         * @param y {number}
         */
        scale(x: number, y: number): any;
        getWidth(): number;
        getHeight(): number;
        type: number;
        save(): void;
        restore(): void;
        beginPath(): any;
        stroke(): any;
        moveTo(x: number, y: number): any;
        lineTo(x: number, y: number): any;
        setFillStyleColor(color: Color): any;
        setFillStyleColorArray(colorArray: Float32Array): any;
        setFillStylePattern(pattern: cc.render.Pattern): any;
        resize(): any;
        getUnitsFactor(): number;
        setCompositeOperation(o: cc.render.CompositeOperation): any;
        getCompositeOperation(): cc.render.CompositeOperation;
        drawMesh(geometry: Float32Array, uv: Float32Array, indices: Uint32Array, color: number, texture: Texture2D): any;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render {
    /**
     * @class cc.render.RenderingContextSnapshot
     * @classdesc
     *
     * This class has all the necessary information for a canvas rendering context.
     * Whenever a call to <code>save</code> or <code>restore</code> is made, a new Object of this type will be
     * created/destroyed.
     * A developer never interacts with this objects directly, but by calling RenderingContext methods.
     * This class is for internal use of RenderingContext implementations (webgl).
     */
    class RenderingContextSnapshot {
        /**
         * Composite operation.
         * @member cc.render.RenderingContextSnapshot#_globalCompositeOperation
         * @type {string}
         * @private
         */
        _globalCompositeOperation: cc.render.CompositeOperation;
        /**
         * Current transformation matrix.
         * @member cc.render.RenderingContextSnapshot#_currentMatrix
         * @type {cc.math.Matrix3}
         * @private
         */
        _currentMatrix: Float32Array;
        /**
         * Current global alpha value.
         * @member cc.render.RenderingContextSnapshot#_globalAlpha
         * @type {number}
         * @private
         */
        _globalAlpha: number;
        /**
         * Current miter limit.
         * @member cc.render.RenderingContextSnapshot#_miterLimit
         * @type {number}
         * @private
         */
        _miterLimit: number;
        _currentFillStyleType: cc.render.FillStyleType;
        /**
         * Current fill style.
         * @member cc.render.RenderingContextSnapshot#_fillStyle
         * @type {any}
         * @private
         */
        _fillStyleColor: Float32Array;
        _fillStylePattern: cc.render.Pattern;
        /**
         * Current tint color. Only makes sense in webgl renderers.
         * @member cc.render.RenderingContextSnapshot#_tintColor
         * @type {Float32Array}
         * @private
         */
        _tintColor: Float32Array;
        /**
         * Current stroke line width.
         * @member cc.render.RenderingContextSnapshot#_lineWidth
         * @type {number}
         * @private
         */
        _lineWidth: number;
        /**
         * Current font data.
         * @member cc.render.RenderingContextSnapshot#_fontDefinition
         * @type {string}
         * @private
         */
        _fontDefinition: string;
        /**
         * Current font baseline.
         * @member cc.render.RenderingContextSnapshot#_textBaseline
         * @type {string}
         * @private
         */
        _textBaseline: string;
        /**
         * Current text align. Valid values are: left, center, right
         * @member cc.render.RenderingContextSnapshot#_textAlign
         * @type {string}
         * @private
         */
        _textAlign: string;
        /**
         * Current path tracing data.
         * @member cc.render.RenderingContextSnapshot#_currentPath
         * @type {any}
         * @private
         */
        _currentPath: any;
        /**
         * Current clipping paths stack
         * @member cc.render.RenderingContextSnapshot#_clippingStack
         * @type {Array}
         * @private
         */
        _clippingStack: Array<any>;
        /**
         * Build a new RenderingContextSnapshot instance.
         * @method cc.render.RenderingContextSnapshot#constructor
         */
        constructor();
        /**
         * Clone this snapshot and create a new one.
         * @method cc.render.RenderingContextSnapshot#clone
         * @returns {cc.render.RenderingContextSnapshot}
         */
        clone(): RenderingContextSnapshot;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render {
    import Point = cc.math.Point;
    import RenderingContextSnapshot = cc.render.RenderingContextSnapshot;
    import AbstractShader = cc.render.shader.AbstractShader;
    import Buffer = cc.render.shader.Buffer;
    import WebGLState = cc.render.WebGLState;
    import Sprite = cc.node.Sprite;
    /**
     * @class cc.render.GeometryBatcher
     * @classdesc
     *
     * This class handles geometry, batches it into ping-pong'ed buffers and signals when to flush.
     */
    class GeometryBatcher {
        /**
         * Max bufferable quads.
         * @member cc.render.GeometryBatcher.MAX_QUADS
         * @type {number}
         */
        static MAX_QUADS: number;
        /**
         * WebGL geometry, color and uv buffer ids.
         * @member cc.render.GeometryBatcher#_glDataBuffers;
         * @type {Array<WebGLBuffer>}
         * @private
         */
        _glDataBuffers: Buffer[];
        /**
         * WebGL indices buffer ids.
         * @member cc.render.GeometryBatcher#_glIndexBuffers;
         * @type {Array<WebGLBuffer>}
         * @private
         */
        _glIndexBuffers: Buffer[];
        /**
         * Currently used gl buffer index.
         * @member cc.render.GeometryBatcher#_glIndexBuffer
         * @type {WebGLBuffer}
         * @private
         */
        _glIndexBuffer: Buffer;
        /**
         * Currently used gl buffer for geometry, color and uv.
         * @member cc.render.GeometryBatcher#_glDataBuffer
         * @type {WebGLBuffer}
         * @private
         */
        _glDataBuffer: Buffer;
        /**
         * Batching buffers index.
         * @member cc.render.GeometryBatcher#_currentBuffersIndex
         * @type {number}
         * @private
         */
        _currentBuffersIndex: number;
        /**
         * Main rendering buffer as buffer array (abstract version).
         * @member cc.render.GeometryBatcher#_dataArrayBuffer
         * @type {ArrayBuffer}
         * @private
         */
        _dataArrayBuffer: ArrayBuffer;
        /**
         * Current rendering buffer as Float32 array
         * @member cc.render.GeometryBatcher#_dataBufferFloat
         * @type {Float32Array}
         * @private
         */
        _dataBufferFloat: Float32Array;
        /**
         * Current rendering buffer as Uint8 array.
         * @member cc.render.GeometryBatcher#_dataBufferByte
         * @type {Uint8Array}
         * @private
         */
        _dataBufferByte: Uint8Array;
        /**
         * Current rendering buffer as Uint32 array.
         * @member cc.render.GeometryBatcher#_dataBufferUint
         * @type {Uint8Array}
         * @private
         */
        _dataBufferUint: Uint32Array;
        /**
         * Current Buffer index.
         * @member cc.render.GeometryBatcher#_dataBufferIndex
         * @type {number}
         * @private
         */
        _dataBufferIndex: number;
        /**
         * Current rendering buffer for geometry indices.
         * @member cc.render.GeometryBatcher#_indexBuffer
         * @type {Float32Array}
         * @private
         */
        _indexBuffer: Uint16Array;
        /**
         * Current Buffer index.
         * @member cc.render.GeometryBatcher#_indexBufferIndex
         * @type {number}
         * @private
         */
        _indexBufferIndex: number;
        _indexBufferMesh: Uint16Array;
        _indexBufferMeshIndex: number;
        _indicesChanged: boolean;
        _glIndexMeshBuffers: Buffer[];
        _glIndexMeshBuffer: Buffer;
        /**
         * The canvas WebGLRenderingContext
         * @member cc.render.GeometryBatcher#_gl
         * @type {WebGLRenderingContext}
         */
        _gl: WebGLRenderingContext;
        /**
         * Build a new GeometryBatcher instance. You probably will need one of this.
         * @method cc.render.GeometryBatcher#constructor
         * @param _gl {WebGLRenderingContext}
         */
        constructor(glstate: WebGLState);
        batchRectGeometryWithTexture(vertices: Point[], u0: number, v0: number, u1: number, v1: number, rcs: RenderingContextSnapshot): boolean;
        /**
         * Batch a rectangle with texture info and tint color.
         * Tint color will be modified by currently alpha value set.
         * @member cc.render.GeometryBatcher#batchRectWithTexture
         * @param x {number} rectangle position
         * @param y {number}
         * @param w {number} rectangle size
         * @param h {number}
         * @param rcs {RenderingContextSnapshot} current rendering context snapshot info
         * @param u0 {number} texture position
         * @param v0 {number}
         * @param u1 {number} texture size
         * @param v1 {number}
         */
        batchRectWithTexture(x: number, y: number, w: number, h: number, rcs: RenderingContextSnapshot, u0: number, v0: number, u1: number, v1: number): boolean;
        /**
         * Batch a rect with the current rendering info. The rect color will be tinted. Resulting transparency value will
         * be modified by currently rendering context alpha value set.
         * @method cc.render.GeometryBatcher#batchRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @param rcs {cc.render.RenderingContextSnapshot} current rendering context snapshot info
         */
        batchRect(x: number, y: number, w: number, h: number, rcs: RenderingContextSnapshot): boolean;
        /**
         * Batch a vertex with color and texture.
         * @method cc.render.GeometryBatcher#batchVertex
         * @param p {Point}
         * @param r {number}
         * @param g {number}
         * @param b {number}
         * @param a {number}
         * @param u {number}
         * @param v {number}
         */
        batchVertex(p: Point, cc: number, u: number, v: number): void;
        /**
         * Flush currently batched geometry and related info with a given shader program.
         * @method cc.render.GeometryBatcher#flush
         * @param shader {cc.render.shader.AbstractShader} program shader
         * @param rcs {cc.render.RenderingContextSnapshot}
         */
        flush(shader: AbstractShader, rcs: cc.render.RenderingContextSnapshot): void;
        __uintColor(rcs: RenderingContextSnapshot): number;
        batchRectGeometryWithSpriteFast(sprite: Sprite, u0: number, v0: number, u1: number, v1: number, rcs: RenderingContextSnapshot): boolean;
        batchMesh(geometry: Float32Array, uv: Float32Array, indices: Uint32Array, color: number, rcs: RenderingContextSnapshot): void;
        batchMeshVertex(x: number, y: number, u: number, v: number): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render {
    import Color = cc.math.Color;
    import RenderingContext = cc.render.RenderingContext;
    import RenderingContextSnapshot = cc.render.RenderingContextSnapshot;
    import GeometryBatcher = cc.render.GeometryBatcher;
    import AbstractShader = cc.render.shader.AbstractShader;
    import WebGLState = cc.render.WebGLState;
    /**
     * Decorated WebGL Rendering Context fill style types.
     * @tsenum cc.render.FillStyleType
     */
    enum FillStyleType {
        COLOR = 0,
        IMAGE = 1,
        IMAGEFAST = 2,
        PATTERN_REPEAT = 3,
        MESH = 4,
    }
    /**
     * Shader types
     * @tsenum cc.render.ShaderType
     */
    enum ShaderType {
        COLOR = 0,
        IMAGE = 1,
        IMAGEFAST = 2,
        PATTERN_REPEAT = 3,
        MESH = 4,
    }
    /**
     * BIT Flag for WebGL enabled/disabled flags.
     * @tsenum cc.render.WEBGL_FLAGS
     */
    enum WEBGL_FLAGS {
        BLEND = 1,
        DEPTH_TEST = 2,
        CULL_FACE = 4,
    }
    /**
     * @class cc.render.DecoratedWebGLRenderingContext
     * @classdesc
     *
     * This object wraps a 3D canvas context (webgl) and exposes a canvas like 2d rendering API.
     * The implementation should be extremely efficient by:
     *   <li>lazily set every property.
     *   <li>batch all drawing operations as much as possible.
     *   <li>ping pong between buffers
     *
     * <br>
     * All this would be transparent for the developer and happen automatically. For example, is a value is set to
     * <code>globalCompositeOperation</code> (set a blend mode), a gl call is not immediately executed, which prevents
     * consecutive calls to <code>globalCompositeOperation</code> to make explicit gl calls. Instead, the gl call
     * is deferred until the moment when some geometry will happen, for example, a fillRect call.
     * <br>
     * This mechanism is set for every potential flushing operation like changing fillStyle, compisite, textures, etc.
     */
    class DecoratedWebGLRenderingContext implements RenderingContext {
        /**
         * Enable UNPACK_PREMULTIPLY_ALPHA_WEBGL for textures. False by default.
         * @member cc.render.DecoratedWebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL
         * @type {boolean}
         */
        static UNPACK_PREMULTIPLY_ALPHA_WEBGL: boolean;
        /**
         * Enable antialias. False by default
         * @member cc.render.DecoratedWebGLRenderingContext.ANTIALIAS
         * @type {boolean}
         */
        static ANTIALIAS: boolean;
        /**
         * Enable context-document alpha blending. False by default.
         * @member cc.render.DecoratedWebGLRenderingContext.CTX_ALPHA
         * @type {boolean}
         */
        static CTX_ALPHA: boolean;
        /**
         * Current rendering context data.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentContextSnapshot
         * @type {cc.render.RenderingContextSnapshot}
         * @private
         */
        _currentContextSnapshot: RenderingContextSnapshot;
        /**
         * Each call to save will create a new rendering context snapshot that will be tracked here.
         * @member cc.render.DecoratedWebGLRenderingContext#_contextSnapshots
         * @type {Array<cc.render.RenderingContextSnapshot>}
         * @private
         */
        _contextSnapshots: Array<RenderingContextSnapshot>;
        /**
         * if _currentFillStyleType===COLOR, this is the current color.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentFillStyleColor
         * @type {Float32Array}
         * @private
         */
        _currentFillStyleColor: Float32Array;
        _currentFillStylePattern: cc.render.Pattern;
        /**
         * Current fill style type. The style type reflects what shader is currently set for rendering.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentFillStyleType
         * @type {cc.render.FillStyleType}
         * @private
         */
        _currentFillStyleType: FillStyleType;
        _currentTintColor: Float32Array;
        /**
         * Last global composite operation set.
         * @member cc.render.DecoratedWebGLRenderingContext#_currentGlobalCompositeOperation
         * @type {string}
         * @private
         */
        _currentGlobalCompositeOperation: cc.render.CompositeOperation;
        /**
         * Internal rendering shaders.
         * @member cc.render.DecoratedWebGLRenderingContext#_shaders
         * @type {Array<cc.render.shader.SolidColorShader>}
         * @private
         */
        _shaders: Array<AbstractShader>;
        /**
         * Geometry batcher.
         * @member cc.render.DecoratedWebGLRenderingContext#_batcher
         * @type {cc.render.GeometryBatcher}
         * @private
         */
        _batcher: GeometryBatcher;
        _webglState: WebGLState;
        _width: number;
        _height: number;
        _renderer: Renderer;
        /**
         * Rendering surface (canvas object)
         * @member cc.render.DecoratedWebGLRenderingContext#_canvas
         * @type {HTMLCanvasElement}
         * @private
         */
        _canvas: HTMLCanvasElement;
        /**
         * Create a new DecoratedWebGLRenderingContext instance.
         * @method cc.render.DecoratedWebGLRenderingContext#constructor
         * @param r {cc.render.Renderer}
         */
        constructor(r: Renderer);
        __initContext(): void;
        clear(): void;
        getWidth(): number;
        getHeight(): number;
        __createProjection(w: number, h: number): Float32Array[];
        /**
         * Create internal rendering shaders.
         * Do not call directly.
         * @method cc.render.DecoratedWebGLRenderingContext#__createRenderingShaders
         * @param w {number}
         * @param h {number}
         * @private
         */
        __createRenderingShaders(w: number, h: number): void;
        __setShadersProjection(w: number, h: number): void;
        /**
         * Get the rendering surface object (canvas).
         * @method cc.render.DecoratedWebGLRenderingContext#get:canvas
         * @returns {HTMLCanvasElement}
         */
        canvas: HTMLCanvasElement;
        /**
         * Set the current rendering tint color. Tint color is an array of 4 components for rgba. Values 0..1
         * @method cc.render.DecoratedWebGLRenderingContext#set:tintColor
         * @param color {cc.math.Color}
         */
        setTintColor(color: Color): void;
        tintColor: Color;
        setGlobalAlpha(v: number): void;
        getGlobalAlpha(): number;
        /**
         * Set the current rendering composite operation (blend mode).
         * The value is any of:
         *
         * "source-over", "source-out", "source-in", "source-atop", "destination-over", "destination-in",
         * "destination-out", "destination-atop", "multiply", "screen", "copy", "lighter", "darker", "xor", "add"
         *
         * @method cc.render.DecoratedWebGLRenderingContext#set:globalCompositeOperation
         * @param gco {cc.render.CompositeOperation}
         */
        setCompositeOperation(gco: cc.render.CompositeOperation): void;
        getCompositeOperation(): cc.render.CompositeOperation;
        /**
         * Internal blending mode set.
         * This function is called not when the blending mode is set, but when an actual geometry operation is about
         * to happen.
         * @method cc.render.DecoratedWebGLRenderingContext#__setGlobalCompositeOperation
         * @private
         */
        __setGlobalCompositeOperation(): void;
        /**
         * Set the current transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#setTransform
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        /**
         * Concatenate current transformation matrix with the given matrix coeficients.
         * @method cc.render.DecoratedWebGLRenderingContext#transform
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        /**
         * Fill an area with the current fillStyle.
         * If w or h are <= 0 the call does nothing.
         * @method cc.render.DecoratedWebGLRenderingContext#fillRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        fillRect(x: number, y: number, w: number, h: number): void;
        drawTextureUnsafe(texture: Texture2D, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void;
        drawTexture(texture: Texture2D, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void;
        batchGeometryWithSprite(sprite: cc.node.Sprite, transposed: boolean): void;
        batchGeometryWithSpriteFast(sprite: cc.node.Sprite): void;
        /**
         * Translate the current rendering context transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#translate
         * @param x {number}
         * @param y {number}
         */
        translate(x: number, y: number): void;
        /**
         * Rotate the current rendering context transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#rotate
         * @param angle {number} angle in radians.
         */
        rotate(angle: number): void;
        /**
         * Scale the current rendering context transformation matrix.
         * @method cc.render.DecoratedWebGLRenderingContext#scale
         * @param x {number} scale x axis.
         * @param y {number} scale y axis.
         */
        scale(x: number, y: number): void;
        /**
         * Flush the content geometry, color and texture to the screen.
         * @member cc.render.DecoratedWebGLRenderingContext#flush
         */
        flush(): void;
        resize(): void;
        getUnitsFactor(): number;
        /**
         * Get RenderingContext type.
         * @member cc.render.DecoratedWebGLRenderingContext#get:type
         * @returns {number} cc.render.RENDERER_TYPE_WEBGL or cc.render.RENDERER_TYPE_CANVAS
         */
        type: number;
        /**
         * @method cc.render.DecoratedWebGLRenderingContext#__drawImageFlushIfNeeded
         * @param textureId {WebGLTexture}
         * @private
         */
        __drawImageFastFlushIfNeeded(textureId: WebGLTexture): void;
        /**
         * @method cc.render.DecoratedWebGLRenderingContext#__drawImageFlushIfNeeded
         * @param textureId {WebGLTexture}
         * @private
         */
        __drawImageFlushIfNeeded(textureId: WebGLTexture): void;
        __drawImageFlushIfNeededImpl(fillStyleType: FillStyleType, shader: AbstractShader, textureId: WebGLTexture): void;
        __flushFillRectIfNeeded(): void;
        __compositeFlushIfNeeded(): void;
        /**
         * @method cc.render.DecoratedWebGLRenderingContext#__setCurrentFillStyleType
         * @param f {cc.render.FillStyleType}
         * @private
         */
        __setCurrentFillStyleType(f: FillStyleType): void;
        setFillStyleColor(color: Color): void;
        setFillStyleColorArray(colorArray: Float32Array): void;
        setFillStylePattern(pattern: Pattern): void;
        beginPath(): void;
        stroke(): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        save(): void;
        restore(): void;
        drawMesh(geometry: Float32Array, uv: Float32Array, indices: Uint32Array, color: number, texture: Texture2D): void;
        __checkMeshFlushConditions(textureId: WebGLTexture, color: number): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.render {
    /**
     * Orientation events callback objects.
     * @name OrientationCallback
     * @memberOf cc.render
     * @callback OrientationCallback
     */
    type WindowResizeCallback = (w: number, h: number) => any;
    type OrientationErrorCallback = () => any;
    type OrientationOkCallback = (o: OrientationStrategy) => any;
    /**
     * Full screen events callback objects.
     * @memberOf cc.render
     * @callback FullScreenCallback
     */
    type FullScreenCallback = () => any;
    /**
     * When setScaleContent is called on a renderer, this hint will tell how to position scenes in director's area.
     * TOP and BOTTOM values are specified regardless of y-axis rendering origin. TOP will always be TOP of the screen.
     * @tsenum cc.render.ScaleContentSceneHint
     */
    enum ScaleContentSceneHint {
        TOP = 1,
        LEFT = 2,
        BOTTOM = 4,
        RIGHT = 8,
        CENTER = 16,
        STRETCH = 32,
    }
    /**
     * Values for Scale canvas and Scale content.
     * @tsenum cc.render.ScaleManagerStrategy
     */
    enum ScaleManagerStrategy {
        NONE = 0,
        SCALE_FIT = 1,
        SCALE_ASPECT = 2,
        SCALE_CONTENT = 128,
    }
    /**
     * Values for forcing orientation.
     * @tsenum cc.render.OrientationStrategy
     */
    enum OrientationStrategy {
        BOTH = 0,
        PORTRAIT = 1,
        LANDSCAPE = 2,
    }
    /**
     * Values for canvas positioning inside parent node after setting canvas Scale values.
     * @tsenum cc.render.ScalePosition
     */
    enum ScalePosition {
        NONE = 0,
        CENTER = 1,
        LEFT = 2,
        RIGHT = 4,
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
    class ScaleManager {
        /**
         * A DOM Node, and is the reference node to calculate values for ScaleStrategy's canvas
         * positioning. Null means to use the window as reference.
         * @member cc.render.ScaleManager#_referenceParentNode
         * @type {HTMLElement}
         * @private
         */
        _referenceParentNode: HTMLElement;
        /**
         * The Scale strategy for up/down scaling the canvas object. Values are from the enum
         * object ScaleManagerStrategy. By default, no scale on the canvas will be applied.
         * @member cc.render.ScaleManager#_scaleStrategy
         * @type {number}
         * @private
         */
        _scaleStrategy: ScaleManagerStrategy;
        /**
         * The Canvas position after setting a ScaleStrategy value. By default, no Position will be forced since by default,
         * there's no scale to apply. Values are from the enum object ScalePosition.
         * @member cc.render.ScaleManager#_scalePosition
         * @type {number}
         * @private
         */
        _scalePosition: ScalePosition;
        /**
         * The preferred Game orientation. By default, both orientations are suitable. The values are from the enum
         * object OrientationStrategy.
         * @member cc.render.ScaleManager#_forceOrientationStrategy
         * @type {number}
         * @private
         */
        _forceOrientationStrategy: OrientationStrategy;
        /**
         * Internal boolean that sets current orientation as valid or not depending on the forced orientation strategy.
         * @member cc.render.ScaleManager#_wrongOrientation
         * @type {boolean}
         * @private
         */
        _wrongOrientation: boolean;
        /**
         * Callback invoked when the device is or enters in a wrong orientation.
         * @member cc.render.ScaleManager#_onOrientationError
         * @type {cc.render.OrientationCallback}
         * @private
         */
        _onOrientationError: OrientationErrorCallback;
        /**
         * Callback invoked when the device is or enters in a valid orientation.
         * @member cc.render.ScaleManager#_onOrientationOk
         * @type {cc.render.OrientationCallback}
         * @private
         */
        _onOrientationOk: OrientationOkCallback;
        /**
         * Is the game in fullscreen ?
         * @member cc.render.ScaleManager#_fullScreen
         * @type {boolean}
         * @private
         */
        _fullScreen: boolean;
        /**
         * Is current browser/device/wrapper full screen capable ?
         * @member cc.render.ScaleManager#_fullScreenCapable
         * @type {boolean}
         * @private
         */
        _fullScreenCapable: boolean;
        /**
         * Canvas object to apply the Scale strategies to.
         * @member cc.render.ScaleManager#_surface
         * @type {HTMLCanvasElement}
         * @private
         */
        _surface: HTMLCanvasElement;
        /**
         * Current browser vendor prefix for orientation and full screen operations.
         * @member cc.render.ScaleManager#_prefix
         * @type {string}
         * @private
         */
        _prefix: string;
        /**
         * When resizing the window object, the ScaleManager must wait a few milliseconds to fire its internal
         * orientation, and scale tests. This member is the setTimeout generated id.
         * @member cc.render.ScaleManager#_windowResizeTimer
         * @type {number}
         * @private
         */
        _windowResizeTimer: number;
        /**
         * Callback invoked when the system exits full screen.
         * @member cc.render.ScaleManager#_onExitFullScreen
         * @type {cc.render.FullScreenCallback}
         * @private
         */
        _onExitFullScreen: FullScreenCallback;
        /**
         * Callback invoked when the system enters full screen.
         * @member cc.render.ScaleManager#_onEnterFullScreen
         * @type {cc.render.FullScreenCallback}
         * @private
         */
        _onEnterFullScreen: FullScreenCallback;
        /**
         * Cached vendor-dependent enter fullscreen function name.
         * @member cc.render.ScaleManager#_requestFullScreen
         * @type {string}
         * @private
         */
        _requestFullScreen: string;
        /**
         * Cached vendor-dependent exit fullscreen function name.
         * @member cc.render.ScaleManager#_exitFullScreen
         * @type {string}
         * @private
         */
        _exitFullScreen: string;
        /**
         * When scale content is enabled, this is the internal matrix to achieve the expected result.
         * @member cc.render.ScaleManager#_unitsMatrix
         * @type {Float32Array}
         * @private
         */
        _unitsMatrix: Float32Array;
        /**
         * User defined game units.
         * @member cc.render.ScaleManager#_units
         * @type {cc.math.Dimension}
         * @private
         */
        _units: cc.math.Dimension;
        /**
         * If scale content is enabled, this is the scale ratio to convert units to pixels.
         * @member cc.render.ScaleManager#_unitsFactor
         * @type {number}
         * @private
         */
        _unitsFactor: number;
        /**
         * Has setContentScale been called ?
         * @member cc.render.ScaleManager#_contentScaled
         * @type {boolean}
         * @private
         */
        _contentScaled: boolean;
        _renderer: Renderer;
        _onWindowResized: WindowResizeCallback;
        /**
         * Create a new ScaleManager object instance.
         * @method cc.render.ScaleManager#constructor
         */
        constructor(renderer: Renderer);
        /**
         * Initialize the ScaleManager, get method cache names, etc.
         * @method cc.render.ScaleManager#__initialize
         * @private
         */
        __initialize(): void;
        /**
         * Set the canvas to apply the ScaleStrategy to.
         * @method cc.render.ScaleManager#setScaleSurface
         * @param surface {HTMLCanvasElement}
         */
        setScaleSurface(surface: HTMLCanvasElement): void;
        /**
         * After setting scale content, this value is the ratio to transform in-game units to pixels.
         * @method cc.render.ScaleManager#getUnitsFactor
         * @returns {number}
         */
        getUnitsFactor(): number;
        /**
         * Enable orientation change detection. If not set, landscape and portrait will be valid orientations.
         * @method cc.render.ScaleManager#forceOrientation
         * @param os {cc.render.OrientationStrategy} enum orientation value
         * @param onOk {cc.render.OrientationOkCallback=} callback invoked when the orientation changes and is valid.
         * @param onError {cc.render.OrientationErrorCallback=} callback invoked when the orientation changes and is NOT valid.
         * @returns {cc.render.ScaleManager}
         */
        forceOrientation(os: OrientationStrategy, onOk?: OrientationOkCallback, onError?: OrientationErrorCallback): ScaleManager;
        /**
         * Check whether the orientation is valid, and invoke callbacks accordingly.
         * @method cc.render.ScaleManager#checkOrientation
         * @private
         */
        checkOrientation(): void;
        /**
         * Get whether the current orientation is valid compared to the expected orientation.
         * @method cc.render.ScaleManager#isWrongOrientation
         * @returns {boolean}
         */
        isWrongOrientation(): boolean;
        /**
         * Get whether the system is able to switch to full screen mode.
         * @method cc.render.ScaleManager#isFullScreenCapable
         * @returns {boolean}
         */
        isFullScreenCapable(): boolean;
        /**
         * Start full screen process. If success the optional f callback function will be called.
         * @method cc.render.ScaleManager#startFullScreen
         * @param f {cc.render.FullScreenCallback=} callback invoked when successfully switching to full screen.
         */
        startFullScreen(f?: FullScreenCallback): void;
        /**
         * End full screen process. If success the optional f callback function will be called.
         * @method cc.render.ScaleManager#startFullScreen
         * @param f {cc.render.FullScreenCallback=} callback invoked when successfully exiting from full screen.
         */
        endFullScreen(f?: () => any): void;
        /**
         * Get whether the scale manager is currently in full screen mode.
         * @method cc.render.ScaleManager#isFullScreen
         * @returns {boolean}
         */
        isFullScreen(): boolean;
        onWindowResized(callback: WindowResizeCallback): ScaleManager;
        /**
         * Internal operation when the window resizes and scale content/scale strategies are set.
         * @method cc.render.ScaleManager#__windowResized
         * @param e {UIEvent}
         * @private
         */
        __windowResized(e: UIEvent): void;
        /**
         * Internal operation when the system switches to full screen.
         * @method cc.render.ScaleManager#__fullScreenChange
         * @param e {UIEvent}
         * @private
         */
        __fullScreenChange(e: any): void;
        /**
         * Register callback to be notified when the system successfully enters full screen mode.
         * @method cc.render.ScaleManager#onEnterFullScreen
         * @param f {cc.render.FullScreenCallback}
         * @returns {cc.render.ScaleManager}
         */
        onEnterFullScreen(f: FullScreenCallback): ScaleManager;
        /**
         * Register callback to be notified when the system successfully exits full screen mode.
         * @method cc.render.ScaleManager#onExitFullScreen
         * @param f {cc.render.FullScreenCallback}
         * @returns {cc.render.ScaleManager}
         */
        onExitFullScreen(f: FullScreenCallback): ScaleManager;
        /**
         * Register callback to be notified when the system successfully changes orientation.
         * @method cc.render.ScaleManager#onOrientationOk
         * @param f {cc.render.OrientationOkCallback}
         * @returns {cc.render.ScaleManager}
         */
        onOrientationOk(f: OrientationOkCallback): ScaleManager;
        /**
         * Register callback to be notified when the system unsuccessfully changes orientation.
         * @method cc.render.ScaleManager#onOrientationError
         * @param f {cc.render.OrientationCallback}
         * @returns {cc.render.ScaleManager}
         */
        onOrientationError(f: OrientationErrorCallback): ScaleManager;
        /**
         * Internal method called at system level when there's no full screen availability.
         * @method cc.render.ScaleManager#__fullScreenError
         * @param e {UIEvent}
         * @private
         */
        __fullScreenError(e: any): void;
        /**
         * When ScaleStrategy is set, this DOM node will be the reference for position calculations.
         * @method cc.render.ScaleManager#setReferenceParentNode
         * @param node {HTMLElement}
         */
        setReferenceParentNode(node: HTMLElement): void;
        /**
         * Enable canvas scale capabilities. This will scale the canvas object, not its internal drawing operations.
         * @method cc.render.ScaleManager#setScale
         * @param scale {cc.render.ScaleManagerStrategy} the scale type.
         * @param positionOp {cc.render.ScalePosition=} the positioning when the scale is set.
         * @returns {cc.render.ScaleManager}
         * @see cc.render.ScaleManager#setScaleContent
         */
        setScale(scale: ScaleManagerStrategy, positionOp?: ScalePosition): ScaleManager;
        /**
         * Enable content scale. Content scale is necessary for retina display honor mechanisms. This method instruments
         * CocosJS core that there's no direct mapping between a pixel and a game unit.
         * @method cc.render.ScaleManager#setScaleContent
         * @param unitsWidth {number}
         * @param unitsHeight {number}
         */
        setScaleContent(unitsWidth: number, unitsHeight: number): Float32Array;
        /**
         * Internal method to calculate the pixel-point mapping operations.
         * @method cc.render.ScaleManager#__setScaleContentMatrix
         * @private
         */
        __setScaleContentMatrix(): void;
        getScaleContentMatrix(): Float32Array;
        /**
         * Internal method to scale the canvas object using css styles.
         * @method cc.render.ScaleManager#__setScaleImpl
         * @private
         */
        __setScaleImpl(): void;
        /**
         * When setting the scale strategy, this method calculates the necessary styles to position the canvas relative to
         * its parent client area. The calculations will be based on the ScalePosition parameter of setScale method call.
         * @method cc.render.ScaleManager#__setScalePosition
         * @param scaleW {number} canvas scale factor. when setScale is called, the canvas can be scaled with different
         *          values. this is the width scale parameter.
         * @private
         */
        __setScalePosition(scaleW: number): void;
        /**
         * Set the canvas with no scale.
         * @method cc.render.ScaleManager#__setScaleNone
         * @param surface {HTMLCanvasElement}
         * @private
         */
        __setScaleNone(surface: HTMLCanvasElement): void;
        /**
         * Stretch the canvas with css scale attributes to fit exactly in its parent.
         * This can lead to uneven scaling, because of canvas object stretch operations.
         * @method cc.render.ScaleManager#__setScaleFit
         * @param surface {HTMLCanvasElement}
         * @private
         */
        __setScaleFit(surface: HTMLCanvasElement): void;
        /**
         * Scale the canvas keeping aspect ratio to fit in its parent node client area.
         * @param surface {HTMLCanvasElement}
         * @method cc.render.ScaleManager#__setScaleAspect
         * @private
         */
        __setScaleAspect(surface: HTMLCanvasElement): void;
        /**
         * Get the currently applied canvas scale strategy.
         * @method cc.render.ScaleManager#getScaleStrategy
         * @returns {cc.render.ScaleManagerStrategy}
         */
        getScaleStrategy(): ScaleManagerStrategy;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.render.util {
    function getAlphaChannel(image: HTMLImageElement | HTMLCanvasElement): any[] | Uint8Array;
    function getRedChannel(image: HTMLImageElement | HTMLCanvasElement): any[] | Uint8Array;
    function getGreenChannel(image: HTMLImageElement | HTMLCanvasElement): any[] | Uint8Array;
    function getBlueChannel(image: HTMLImageElement | HTMLCanvasElement): any[] | Uint8Array;
    function getChannel(image: HTMLImageElement | HTMLCanvasElement, channel: number): any[] | Uint8Array;
    function createCanvas(w: number, h: number): HTMLCanvasElement;
    function extractChannel(data: number[], width: number, height: number, channel: number): any[] | Uint8Array;
}
/**
 * License: see license.txt file
 */
declare module cc.render.mesh {
    /**
     * A mesh is a grid composed of geometry and u,v information.
     */
    class Mesh {
        _originalGeometry: Float32Array;
        _geometry: Float32Array;
        _uv: Float32Array;
        _workuv: Float32Array;
        _indices: Uint16Array;
        _initialized: boolean;
        _rectgl: cc.math.Rectangle;
        Mesh(): void;
        initialize(pointsWidth: number, pointsHeight: number, width: number, height: number): void;
        draw(ctx: cc.render.RenderingContext, sf: cc.node.sprite.SpriteFrame, color?: number): void;
        deform(segment: cc.math.path.Segment): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc {
    module util {
        /**
         * Create a Float32Array. If it is not possible a plain Array will be created.
         * @method cc.util.FloatArray
         * @param size {number} array size.
         * @param defaultValue {number} default array values.
         * @returns {Float32Array|Array}
         */
        function FloatArray(size: any, defaultValue: any): any;
        /**
         * Create a UInt16Array. If it is not possible a plain Array will be created.
         * @method cc.util.UInt16Array
         * @param size {number} array size.
         * @param defaultValue {number} default array value.
         * @returns {Uint16Array|Array}
         */
        function UInt16Array(size: any, defaultValue: any): any;
        /**
         * Transform an string with POSIX like regular expressions into javascript regular expressions.
         * @method cc.util.fromPosixRegularExpression
         * @param expr {string}
         * @returns {string} a javascript like valid regular expression string.
         */
        function fromPosixRegularExpression(expr: string): string;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.loader {
    /**
     * Callback Fired by a Resource to notify about its loader result.
     * Tipically listened by a <code>cc.plugin.loader.Loader</code> object.
     * @memberOf cc.plugin.loader
     * @callback ResourceLoaderResultCallback
     * @param resource {cc.plugin.loader.Resource} loaded resource.
     */
    interface ResourceLoaderResultCallback {
        (resource: Resource): void;
    }
    /**
     * @class cc.util.Resource
     * @classdesc
     *
     * <p>
     *     Class for identifying resources at Cocos level.
     *     Resources are shares across all Director instances by storing them in the static AssetManager object.
     *     This class keeps Resource status and its value after loading.
     *     This class is the same for each resource type, but there are specialized Resource loaders depending on the
     *     type, for example loaders for XML, JSON and text are the same one, but convert the content before emitting
     *     it to any observer.
     * <p>
     *     Resources are identified by a string of the form: <valid_url>[@<id>]
     *     If &lt;id&rt; exists, it will be set as Resource's id, otherwise, the &lt;url&gt; will be.
     *     The Resource will dismiss all information (and including) after the ? sign in its loading url.
     *     Resources url are not normalized. That means that urls of the type ../../end/x/../y.png will be untouched.
     * <p>
     *     It is encouraged to define ids for every resouce by using the resource form <url>@<id>.
     *     It could seem handy to have all resources automatically identify themselves by the name part of the url,
     *     but since resources can be downloaded from different sources and id's could clash, the full url will be
     *     used if not id is defined.
     */
    class Resource {
        /**
         * Resource id.
         * The id is extracted from the url path, and is just the equivalent to the file name.
         * To obtain the id, everything behing an optional question mark is removed.
         * For example, for a resource called /a/b/c/anim.png?stamp=495849809384 the id will be 'anim.png'.
         * @member cc.plugin.loader.Resource#id
         * @type {string}
         */
        id: string;
        /**
         * Resource id extension.
         * It is extracted from the id, and is whatever lies behind the last dot character.
         * The extension is used to identify what loader is needed for this king of resource.
         * @member cc.plugin.loader.Resource#extension
         * @type {string}
         */
        extension: string;
        /**
         * After the loader ends its work, the resulting object of loading the result is stored in this variable.
         * The value is only valid if the status of the resource is 'loaded'.
         * @memver cc.plugin.loader.Resource#value
         * @type {string}
         */
        value: any;
        /**
         * Resource status.
         * Valid status are:
         *   + created: the resource is created and still no load operation has ended for it.
         *   + error: the resource could not be loaded due to an error.
         *   + loaded: the resource has been loaded and is valid to be used.
         * @member cc.plugin.loader.Resource#_status
         * @type {string}
         * @private
         */
        _status: string;
        /**
         * Resource type. Either image, font, atlas, etc.
         * @member cc.plugin.loader.Resource#type
         * @type {string}
         */
        type: string;
        /**
         * resource name. the url part after the last slash sigh.
         * @member cc.plugin.loader.Resource#name
         * @type {string}
         */
        name: string;
        /**
         * Source url the Resource was loaded from.
         * @member cc.plugin.loader.Resource#url
         * @type {string}
         */
        url: string;
        _progress: (p: number) => void;
        /**
         * Create a new Resource instance.
         * Resources are automatically built from a list of resource url/uri passed to a
         * <code>cc.plugin.loader.Loader</code> or <code>cc.plugin.loader.ResourceManager</code>.
         * @method cc.plugin.loader.Resource#constructor
         * @param url
         */
        constructor(_url: string);
        /**
         * Load a Resource by creating a suitable instance of a ResourceLoader based on the resource extension.
         * The resource exposes its loading results throughout the callback parameters.
         * If there's no loader associated with the resource extension, the error callback is called immediately.
         * @param loaded {cc.plugin.loader.ResourceLoaderResultCallback} callback notification if the resource loaded ok.
         * @param error {cc.plugin.loader.ResourceLoaderResultCallback} callback notification if the resource loaded with error.
         */
        load(loaded: ResourceLoaderResultCallback, error: ResourceLoaderResultCallback): void;
        /**
         * Helper function.
         * @method cc.plugin.loader.Resource#__setValue
         * @param value {object} result from the loading operation.
         * @private
         */
        __setValue(value: any): void;
        /**
         * Helper function.
         * @method cc.plugin.loader.Resource#__setError
         * @private
         */
        __setError(): void;
        /**
         * Has this Resource a valid value ?
         * @method cc.plugin.loader.Resource#isValid
         * @returns {boolean}
         */
        isValid(): boolean;
        /**
         * Get the resource id.
         * @method cc.plugin.loader.Resource#getId
         * @returns {string}
         */
        getId(): string;
        setProgress(progress: (p: number) => void): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.loader {
    /**
     * @class ResourceLoaderBuilder
     * @interface
     * @classdesc
     *
     * Type for each ResourceLoader builder descriptor  type.
     * It is composed by a type (image, font, etc.) and a constructor function.
     */
    interface ResourceLoaderBuilder {
        /**
         * Resource type.
         * @member cc.plugin.loader.ResourceLoaderBuilder#type
         * @type {string}
         */
        type: string;
        /**
         * Constructor function for a given resource type.
         * @param url}
         */
        loader(url: string): ResourceLoader;
    }
    /**
     * Register a loader type for a given url extension.
     * @member cc.plugin.loader.RegisterLoaderForType
     * @param builder {cc.plugin.loader.ResourceLoader} a loader of this type will be reated for each resource needing it.
     * @param extension {string}
     */
    function registerLoaderForType(extension: string, builder: ResourceLoaderBuilder): void;
    /**
     * Get a loader type for a given url extension.
     * @member cc.plugin.loader.GetLoaderByType
     * @param extension {string}
     * @return {cc.plugin.loader.ResourceLoaderBuilder}
     */
    function getLoaderByType(extension: string): ResourceLoaderBuilder;
    /**
     * A Resource passed this callback to a ResourceLoader to be notified about the resource being loaded correctly.
     * @callback ResourceLoaderResourceOkCallback
     * @memberOf cc.plugin.loader
     * @param content {object} the result of loading the resource.
     */
    interface ResourceLoaderResourceOkCallback {
        (content: any): void;
    }
    /**
     * A Resource passed this callback to a ResourceLoader to be notified about the resource being loaded NOT correctly.
     * @callback ResourceLoaderResourceErrorCallback
     * @memberOf cc.plugin.loader
     */
    interface ResourceLoaderResourceErrorCallback {
        (): void;
    }
    /**
     * @class cc.plugin.loader.ResourceLoader
     * @interface
     * @classdesc
     *
     * All ResourceLoader instances must have a properly signatured load method.
     * A Resource will build a ResourceLoader instance based on its extension, and the pre-registered set of
     * loaders-by-extension available in __resourceLoaderByType
     *
     */
    interface ResourceLoader {
        /**
         *
         * @param loaded {cc.plugin.loader.ResourceLoaderResourceOkCallback}
         * @param error {cc.plugin.loader.ResourceLoaderResourceErrorCallback}
         */
        load(loaded: ResourceLoaderResourceOkCallback, error: ResourceLoaderResourceErrorCallback, progress?: (p: number) => void): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.loader {
    import ResourceLoader = cc.plugin.loader.ResourceLoader;
    /**
     * @class cc.plugin.loader.ResourceLoaderImage
     * @implements cc.plugin.loader.ResourceLoader
     * @classdesc
     *
     * <p>
     *     This object loads images from a url.
     */
    class ResourceLoaderImage implements ResourceLoader {
        /**
         * Url string where the resource is located.
         * @member cc.plugin.loader.ResourceLoaderImage#_url
         * @type {string}
         * @private
         */
        _url: string;
        /**
         * Create a new ResourceLoaderImage instance.
         * @method cc.plugin.loader.ResourceLoaderImage#constructor
         * @param url {string}
         */
        constructor(url: string);
        /**
         * Load the resource.
         * @param loaded {cc.plugin.loader.ResourceLoaderResourceOkCallback} callback invoked when the resource is successfully loaded.
         * @param error {cc.plugin.loader.ResourceLoaderResourceErrorCallback} callback invoked when the resource is not successfully loaded.
         */
        load(loaded: ResourceLoaderResourceOkCallback, error: ResourceLoaderResourceErrorCallback): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.loader {
    import ResourceLoader = cc.plugin.loader.ResourceLoader;
    /**
     * @class cc.plugin.loader.ResourceLoaderJSON
     * @implements cc.plugin.loader.ResourceLoader
     * @classdesc
     *
     * <p>
     *     This object loads images a JSON object
     */
    class ResourceLoaderJSON implements ResourceLoader {
        /**
         * Url string where the resource is located.
         * @member cc.plugin.loader.ResourceLoaderJSON#_url
         * @type {string}
         * @private
         */
        _url: string;
        /**
         * Use JSON.parse from the loaded value ?
         * @member cc.plugin.loader.ResourceLoaderJSON#_parse
         * @type {boolean}
         * @private
         */
        _parse: boolean;
        /**
         * Create a new ResourceLoaderJSON instance.
         * @method cc.plugin.loader.ResourceLoaderJSON#constructor
         * @param url {string}
         */
        constructor(url: string, initializer?: any);
        /**
         * Load the resource.
         * @param loaded {cc.plugin.loader.ResourceLoaderResourceOkCallback} callback invoked when the resource is successfully loaded.
         * @param error {cc.plugin.loader.ResourceLoaderResourceErrorCallback} callback invoked when the resource is not successfully loaded.
         */
        load(loaded: ResourceLoaderResourceOkCallback, error: ResourceLoaderResourceErrorCallback, progress?: (p: number) => void): void;
        getValue(text: string): any;
    }
    /**
     * @class cc.plugin.loader.ResourceLoaderXML
     * @extends ResourceLoaderJSON
     * @classdesc
     *
     * Loads a xml file. Will return a javascript array object parsed form the plist contents.
     * object[0] will be the first plist node, and so on.
     */
    class ResourceLoaderXML extends ResourceLoaderJSON {
        /**
         * @method cc.plugin.loader.ResourceLoaderXML#constructor
         * @param url
         */
        constructor(url: string);
        /**
         * Get the value from the loaded content.
         * It will parse the xml and build a javascript array object.
         * @method cc.plugin.loader.ResourceLoaderXML#getValue
         * @override
         * @param text {string} file contents.
         * @returns {object}
         */
        getValue(text: string): any;
        /**
         * Parse a XML Document.documentElement.
         * @method cc.plugin.loader.ResourceLoaderXML#__parseNode
         * @param node
         * @returns
         * @private
         */
        __parseNode(node: any): any;
        /**
         * Parse an array Node from a plist.
         * @method cc.plugin.loader.ResourceLoaderXML#__parseArray
         * @param node
         * @returns {Array<object>}
         * @private
         */
        __parseArray(node: any): any[];
        /**
         * Parse a dictionary node form a plist.
         * @method cc.plugin.loader.ResourceLoaderXML#__parseDict
         * @param node
         * @returns {Map<string,object>}
         * @private
         */
        __parseDict(node: any): {};
    }
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.loader {
    import ResourceLoader = cc.plugin.loader.ResourceLoader;
    /**
     * @class cc.plugin.loader.ResourceLoaderAudioBuffer
     * @implements cc.plugin.loader.ResourceLoader
     * @classdesc
     *
     * This object loads an audio as an arraybuffer. It must then be turned into an AudioBuffer by dynamically
     * decoding it.
     */
    class ResourceLoaderAudioBuffer implements ResourceLoader {
        /**
         * Url string where the resource is located.
         * @member cc.plugin.loader.ResourceLoaderAudioBuffer#_url
         * @type {string}
         * @private
         */
        _url: string;
        /**
         * Create a new ResourceLoaderAudioBuffer instance.
         * @method cc.plugin.loader.ResourceLoaderAudioBuffer#constructor
         */
        constructor(url: string);
        /**
         * Load the resource.
         * @param loaded {cc.plugin.loader.ResourceLoaderResourceOkCallback} callback invoked when the resource is successfully loaded.
         * @param error {cc.plugin.loader.ResourceLoaderResourceErrorCallback} callback invoked when the resource is not successfully loaded.
         */
        load(loaded: ResourceLoaderResourceOkCallback, error: ResourceLoaderResourceErrorCallback): void;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.loader {
    import Resource = cc.plugin.loader.Resource;
    /**
     * Callback definition for Loader ends loading all resources.
     * @memberOf cc.plugin.loader
     * @callback LoaderFinishedCallback
     * @param resources {Array<cc.plugin.loader.Resource>} all resources created in this loader.
     */
    interface LoaderFinishedCallback {
        (resources: {
            [id: string]: any;
        }): any;
    }
    /**
     * Callback definition for the event a Loader ends loading one resources.
     * @memberOf cc.plugin.loader
     * @callback LoaderProgressCallback
     * @param resource {cc.plugin.loader.Resource} loaded resource
     * @param index {number} number of loaded resources so far.
     * @param size {number} total number of resources.
     * @param errored {boolean} true if the resource had an error while loading, false otherwise.
     */
    interface LoaderProgressCallback {
        (resource: Resource, index: number, size: number, errored: boolean): void;
    }
    /**
     * Callback definition for the event a Loader gets error loading a resources.
     * @memberOf cc.plugin.loader
     * @callback LoaderErrorCallback
     * @param resource {string} resource error.
     */
    interface LoaderErrorCallback {
        (resource: Resource): void;
    }
    /**
     * @class cc.plugin.loader.LoaderInitializer
     * @interface
     * @classdesc
     *
     * This object is the Loader initializer object.
     *
     */
    interface LoaderInitializer {
        /**
         * Optional common prefix to add to every resource uri before loading.
         * @member cc.plugin.loader.LoaderInitializer#prefix
         * @type {string=}
         */
        prefix?: string;
        /**
         * Optional resource list.
         * @member cc.plugin.loader.LoaderInitializer#resources
         * @type {Array<string>=}
         */
        resources?: string[];
    }
    /**
     * @class cc.plugin.loader.Loader
     * @classdesc
     *
     * <p>
     *     A loader object has the responsibility of loading different types of files and notify success or error
     *     of loading operations.
     * <p>
     *     It has the ability to register new types of loader for different extension files.
     *     The Loader loads data synchronous or asynchronously.
     *     Notifies for each resource in the list about success or error on loading.
     * <p>
     *     The Loader keeps track of loaded content, and notifies callback functions for each resource
     *     loaded, and another callback when it is done with all resources.
     *     When all resources all loaded, local references to these resources are cleared to avoid memory leaks.
     *     Also all resources are instrumented to remove unnecessary information such as loading/error callbacks, etc.
     * <p>
     *     To avoid repetition in resources urls, a common 'prefix' can be specified which will be prepended to every
     *     resource before loading.
     */
    class Loader {
        /**
         * Common uri prefix to add to all resources before loading.
         * The prefix is added to resources that
         *   * don't start with a protocol prefix (http, https, etc.)
         *   * don't start with a slash '/'
         * This way, you could mix prefixed and non-prefixed resources.
         * <p>
         * The prefix is added as is, is not normalized, or modified in any way.
         * <p>
         * The prefix saves time and typing, so that instead of setting something like:
         *
         * <code>
         * {
         *    resources : [
         *      "/folder/folder2/img1.png",
         *      "/folder/folder2/img2.png",
         *      ...
         *    ]
         * }
         * </code>
         *
         * you could instead do:
         *
         * <code>
         * {
         *   prefix : "/folder/folder2/",
         *   resources : [ "img1.png", "img2.png" ]
         * }
         * </code>
         *
         * @member cc.plugin.loader.Loader#_prefix
         * @type {string}
         * @private
         */
        _prefix: string;
        /**
         * Resources list.
         * @member cc.plugin.loader.Loader#_resources
         * @type {Array<string>}
         * @private
         */
        _resources: Resource[];
        /**
         * Current
         * @type {number}
         * @private
         */
        _currentLoadedResourcesCount: number;
        constructor(loaderData?: LoaderInitializer);
        /**
         * Prepend the _prefix to the string s if needed.
         * <p>
         * Won't be added for:
         *   * strings starting with /
         *   * strings starting with protocol http,https or ftp
         *
         * @method cc.plugin.loader.Loader#__addPrefixIfNeeded
         * @param s {string} string to add prefix to.
         * @returns {string}
         * @private
         */
        __addPrefixIfNeeded(s: string): string;
        /**
         * Add one resource to the load queue.
         * @method cc.plugin.loader.Loader#addResource
         * @param url {string}
         */
        addResource(url: string): Loader;
        /**
         * Add a collection of resources to the load queue.
         * @method cc.plugin.loader.Loader#addResources
         * @param resources {Array<string>}
         */
        addResources(resources: string[]): Loader;
        setProgressLoadForResource(id: string, progress: (percentage: number) => void): void;
        /**
         * Start loading all resources in this loader.
         * @param onEnd {cc.plugin.loader.LoaderFinishedCallback} callback invoked when all asset are loaded. If no resources
         *  are registered, this callback will be immediately invoked.
         * @param onProgress {cc.plugin.loader.LoaderProgressCallback} invoked for each successfully loaded resource.
         * @param onError {cc.plugin.loader.LoaderErrorCallback} invoked for each not sucessfully loaded resource.
         */
        startLoading(onEnd: LoaderFinishedCallback, onProgress?: LoaderProgressCallback, onError?: LoaderErrorCallback): Loader;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.plugin.texture {
    /**
     * @class cc.plugin.texture.PackInfo
     * @interface
     * @classdesc
     *
     * Object to configure texture packer result.
     * It defines the size of the resulting images, optional margin between adjacent images and what the sorting
     * strategy will be.
     * The sorting is important because may impact considerably in the final result. Conceptually, since bigger
     * images take more space, it is important to first pack them. But, this sprite packer is simple, and despite
     * it gives very good results, it needs some info form you. On average, a sortBy strategy of perimeter gives
     * better results than based on area. Perimeter will be the default value.
     * You can choose from 'perimeter', 'area', 'width' and 'height'.
     *
     */
    interface PackInfo {
        /**
         * Show debug borders ? Will spoil the generated SpriteFrames but will allow you to see each created node.
         * @member cc.plugin.texture.PackInfo#debug
         * @type {number}
         */
        debug?: boolean;
        /**
         * Texture packer's pages width
         * @member cc.plugin.texture.PackInfo#width
         * @type {number}
         */
        width: number;
        /**
         * Texture packer's pages height
         * @member cc.plugin.texture.PackInfo#height
         * @type {number}
         */
        height: number;
        /**
         * Value from ['perimeter', 'area', 'width', 'height'].
         * Before building the pages the items to pack will be sorted with an internal stock function.
         * 'perimeter' is generally the preferred method and on average gives the best packing results.
         * If not set 'perimeter' will be used.
         * @member cc.plugin.texture.PackInfo#sortBy
         * @type {string=}
         */
        sortBy?: string;
        /**
         * A number defining the margin around packed items. If set will override all other margin-xx values.
         * @member cc.plugin.texture.PackInfo#margin
         * @type {number=}
         */
        margin?: number;
        /**
         * Margin left of packed items.
         * @member cc.plugin.texture.PackInfo#margin-left
         * @type {number=}
         */
        'margin-left'?: number;
        /**
         * Margin top of packed items.
         * @member cc.plugin.texture.PackInfo#margin-top
         * @type {number=}
         */
        'margin-top'?: number;
        /**
         * Margin right of packed items.
         * @member cc.plugin.texture.PackInfo#margin-right
         * @type {number=}
         */
        'margin-right'?: number;
        /**
         * Margin bottom of packed items.
         * @member cc.plugin.texture.PackInfo#margin-bottom
         * @type {number=}
         */
        'margin-bottom'?: number;
    }
    /**
     * @class cc.plugin.texture.TexturePackerNode
     * @classdesc
     *
     * This Object is a helper for a TexturePackerPage object. It represents a region on a packed image.
     * This object is a actually a binary tree.
     * It will either hold an Image, or two descendant nodes.
     *
     */
    class TexturePackerNode {
        /**
         * x position in page.
         * @member cc.plugin.texture.TexturePackerNode#_x
         * @type {number}
         * @private
         */
        _x: number;
        /**
         * y position in page.
         * @member cc.plugin.texture.TexturePackerNode#_y
         * @type {number}
         * @private
         */
        _y: number;
        /**
         * node width in page.
         * @member cc.plugin.texture.TexturePackerNode#_width
         * @type {number}
         * @private
         */
        _width: number;
        /**
         * node height in page.
         * @member cc.plugin.texture.TexturePackerNode#_height
         * @type {number}
         * @private
         */
        _height: number;
        /**
         * Left child node.
         * @member cc.plugin.texture.TexturePackerNode#_left
         * @type {cc.plugin.texture.TexturePackerNode}
         * @private
         */
        _left: TexturePackerNode;
        /**
         * right child node.
         * @member cc.plugin.texture.TexturePackerNode#_right
         * @type {cc.plugin.texture.TexturePackerNode}
         * @private
         */
        _right: TexturePackerNode;
        /**
         * Item this node contains. The item is a pair of Image/Canvas and an id.
         * @member cc.plugin.texture.TexturePackerNode#_item
         * @type {{any,string}
         * @private
         */
        _item: TexturePackerItem;
        /**
         * Create anew TexturePackerNode object instance.
         * @method cc.plugin.texture.TexturePackerNode#constructor
         */
        constructor();
        /**
         * Insert a Node in this node with the given size.
         * The function will recursively traverse in-order the node to find the most suitable place to insert.
         * It will eventually create child nodes as needed.
         *
         * @param w {number}
         * @param h {height}
         * @param margin {Array<number>=} an array describing a margin around the node. array index are: left, top, right, bottom
         * @returns {cc.plugin.texture.TexturePackerNode}
         */
        insert(w: number, h: number, margin: number[]): TexturePackerNode;
        /**
         * Paint this node and all its descendants.
         * @method cc.plugin.texture.TexturePackerNode#paint
         * @param ctx {CanvasRenderingContext2D}
         * @param margin {Array<number>=} an array describing a margin around the node. array index are: left, top, right, bottom
         * @param debug {boolean} draw debug info: a red crossed-rect for empty nodes, and a white rect around packed
         * images.
         */
        paint(ctx: CanvasRenderingContext2D, margin: number[], debug: boolean): void;
        /**
         * Create and add to the AssetManager a SpriteFrame for each node in the tree that has an associated image.
         * The SpriteFrames will be created using the SpriteFrame that corresponds to the textureId parameter.
         * @method cc.plugin.texture.TexturePackerNode#createFrames
         * @param textureId {string}
         */
        createFrames(textureId: string): void;
    }
    /**
     * @class cc.plugin.texture.TexturePackerPage
     * @classdesc
     *
     * This object creates an on-the-fly Image atlas with the Images that best fit in it.
     * Internally keeps a Tree of Nodes to maintain the Atlas image representation.
     * When requested, it will create a canvas object with all the images drawn in it in a non-overlapping manner.
     * Images can (and should) have a margin around them of at least 1 pixel.
     *
     */
    class TexturePackerPage {
        /**
         * Canvas with packer images.
         * @member cc.plugin.texture.TexturePackerPage#_canvas
         * @type {null}
         * @private
         */
        _canvas: HTMLCanvasElement;
        /**
         * Canvas rendering context.
         * @member cc.plugin.texture.TexturePackerPage#_ctx
         * @type {CanvasRenderingContext2D}
         * @private
         */
        _ctx: CanvasRenderingContext2D;
        /**
         * Page width.
         * @member cc.plugin.texture.TexturePackerPage#_width
         * @type {number}
         * @private
         */
        _width: number;
        /**
         * Page height.
         * @member cc.plugin.texture.TexturePackerPage#_height
         * @type {number}
         * @private
         */
        _height: number;
        /**
         * Page id.
         * When assets are created, the page texture will be added to the SpriteFrame assets map with this id.
         * @member cc.plugin.texture.TexturePackerPage#_id
         * @type {string}
         * @private
         */
        _id: string;
        /**
         * This tree keeps the regions for each image.
         * @member {cc.plugin.texture.TexturePackerPage#_root}
         * @type {cc.plugin.texture.TexturePackerNode}
         * @private
         */
        _root: TexturePackerNode;
        /**
         * Create a new TexturePackerPage object instance.
         * @method {cc.plugin.texture.TexturePackerPage#constructor}
         * @param id {string}
         * @param w {number}
         * @param h {number}
         */
        constructor(id: string, w: number, h: number);
        /**
         * Insert an image in the best place for it in the node's tree.
         * @method {cc.plugin.texture.TexturePackerPage#insertImage}
         * @param item {{any,string}} a pair of image/canvas and an id
         * @param margin {Array<number>=} an array describing a margin around the node. array index are: left, top, right, bottom
         * @returns {cc.plugin.texture.TexturePackerNode}
         */
        insertImage(item: TexturePackerItem, margin: number[]): TexturePackerNode;
        /**
         * Create page's assets and adds them to the AssetManager.
         * @method cc.plugin.texture.TexturePackerPage#createAssets
         */
        createAssets(margin: number[], debug: boolean): void;
    }
    /**
     * Internal object to keep a pair of Image and Id.
     */
    interface TexturePackerItem {
        getId(): string;
        getWidth(): number;
        getHeight(): number;
        fits(w: number, h: number): boolean;
        draw(ctx: CanvasRenderingContext2D, x: number, y: number): any;
    }
    /**
     * @class cc.plugin.texture.TexturePacker
     * @classdesc
     *
     * This class is a very simple yet effective TexturePacker. It will create images of a user-defined size
     * and pack images in them.
     *
     * The process is:
     * <li>Add images to the packer. Each image must have an id associated.
     * <li>call pack. This will create page object and the tree of nodes with image references.
     * <li>call createAssets, that creates the Page Images and packs the supplied images on them. It also creates
     *   necessary SpriteFrames and Texture objects.
     *
     * This packer is not expected to be used with dynamic textures, adding and removing textures on-the-fly.
     *
     * Images that don't fit in the specified texture page size will be silently discarded.
     *
     */
    class TexturePacker {
        /**
         * An array of pair Image,id with images to pack.
         * @member cc.plugin.texture.TexturePacker#_images
         * @type {Array<{any,string}>}
         * @private
         */
        _images: TexturePackerItem[];
        /**
         * An array of generated texture page object.
         * @member cc.plugin.texture.TexturePacker#_pages
         * @type {Array<cc.plugin.texture.TexturePackerPage>}
         * @private
         */
        _pages: TexturePackerPage[];
        _margin: number[];
        _debug: boolean;
        /**
         * Create a new TexturePacker object instance.
         * @method cc.plugin.texture.TexturePacker#constructor
         */
        constructor();
        /**
         * Add an image with associated id to pack.
         * @method cc.plugin.texture.TexturePacker#addImage
         * @param image {HTMLImageElement|HTMLCanvasElement}
         * @param id {string}
         */
        addImage(image: any, id?: string): void;
        addSpriteFrame(spriteFrame: cc.node.sprite.SpriteFrame): void;
        addSpriteFrames(spriteFrames: cc.node.sprite.SpriteFrame[]): void;
        addPListAtlas(image: any, atlasInfo: any): void;
        addJSONAtlas(image: any, atlasInfo: any): void;
        /**
         * Pack images.
         * This method ONLY creates the internal TexturePackerPage nodes, not the images.
         * Images will be packed in pages of the specified size.
         * @method cc.plugin.texture.TexturePacker#pack
         * @param pack {cc.plugin.texture.PackInfo} texture packer packing info.
         */
        pack(pack: PackInfo): void;
        /**
         * Builds page images and the associated SpriteFrame and Texture2D objects.
         * Will also add the assets to the AssetManager.
         * Added images will register a SpriteFrame identified by the supplied id or the image.src if it was not set.
         * Added sprite frames will register a SpriteFrame identified by its id.
         * Created Texture pages will register a SpriteFrame identified as texturepage<i>, where i is the sequence
         * of the created page.
         * This TexturePage index grows with every created frame, so don't always expect to habe texturepage0 as the
         * first created page.
         * @method cc.plugin.texture.TexturePacker#createAssets
         */
        createAssets(): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.plugin.font {
    import SpriteFrame = cc.node.sprite.SpriteFrame;
    /**
     * @class cc.plugin.font.SystemFontInitializer
     * @classdesc
     * @interface
     *
     * This interface represents the needed information to build a SpriteFont from a system font.
     * A new canvas with the specified characters will be generated and will also create a Texture2D and the necessary
     * SpriteFrames for the characters.
     *
     */
    interface SystemFontInitializer {
        /**
         * Font size. This will be the px size of the valid canvas string font representation.
         * @member cc.plugin.font.SystemFontInitializer#size
         * @type {number}
         */
        size: number;
        /**
         * Font name. This will be the font name of the valid canvas string font representation.
         * @member cc.plugin.font.SystemFontInitializer#fontface
         * @type {string}
         */
        fontface: string;
        /**
         * The font will have the following characters.
         * @member cc.plugin.font.SystemFontInitializer#characters
         * @type {string}
         */
        characters: string;
        /**
         * The font style. a combination of bold+italic
         * @member cc.plugin.font.SystemFontInitializer#style
         * @type {string=}
         */
        style?: string;
        /**
         * Whether the font will be filled. If not set defaults to false.
         * @member cc.plugin.font.SystemFontInitializer#fill
         * @type {boolean=}
         */
        fill?: boolean;
        /**
         * Whether the font will be stroked
         * @member cc.plugin.font.SystemFontInitializer#stroke
         * @type {boolean=}
         */
        stroke?: boolean;
        /**
         * If the font is stroked, this is the size of the stroke. If not set will default to 1.
         * @member cc.plugin.font.SystemFontInitializer#strokeSize
         * @type {number=}
         */
        strokeSize?: number;
        /**
         * If the font is filled, this is a valid canvas fillStyle. If not set defaults to "#000".
         * @member cc.plugin.font.SystemFontInitializer#fillStyle
         * @type {any=}
         */
        fillStyle?: any;
        /**
         * If the font is stroked, this is a valid canvas strokeStyle. If not set defaults to "#000".
         * @member cc.plugin.font.SystemFontInitializer#fillStyle
         * @type {any=}
         */
        strokeStyle?: any;
        /**
         * A padding between characters and font texture lines.
         * In canvas, there's no kerning information, and some characters may not honor the maxAscend value.
         * If after building the font a characters shows pixels from other surrounding characters, increment the
         * padding.
         * Each font will have its own needs.
         * @member cc.plugin.font.SystemFontInitializer#padding
         * @type {number=}
         */
        padding?: number;
    }
    /**
     * @class cc.plugin.font.SpriteFontChar
     * @classdesc
     *
     * For a SpriteFont, this class represents a TextureFont character.
     * It contains information about its size and kerning.
     *
     */
    class SpriteFontChar {
        /**
         * This numerical id is the charCode of a font character.
         * @member cc.plugin.font.SpriteFontChar#_id
         * @type {number}
         * @private
         */
        _id: number;
        /**
         * A SpriteFrame representing character texture information.
         * @member cc.plugin.font.SpriteFontChar#_frame
         * @type {cc.node.sprite.SpriteFrame}
         * @private
         */
        _frame: SpriteFrame;
        /**
         * Pixels to advance the cursor after typing this character.
         * @member cc.plugin.font.SpriteFontChar#_xadvance
         * @type {number}
         * @private
         */
        _xadvance: number;
        /**
         * Horizontal offset to draw the character.
         * @member cc.plugin.font.SpriteFontChar#_xoffset
         * @type {number}
         * @private
         */
        _xoffset: number;
        /**
         * Vertical offset to draw the character. this offset will make the character lie on the baseline.
         * @member cc.plugin.font.SpriteFontChar#_yoffset
         * @type {number}
         * @private
         */
        _yoffset: number;
        /**
         * Kerning info.
         * @member cc.plugin.font.SpriteFontChar#_kerningInfo
         * @type {Map<string,number>}
         * @private
         */
        _kerningInfo: {
            [char: string]: number;
        };
        /**
         * Reference to the SpriteFont object this char belongs to.
         * @member cc.plugin.font.SpriteFontChar#_font
         * @type {cc.node.sprite.SpriteFont}
         * @private
         */
        _font: SpriteFont;
        /**
         * Create a new SpritFontChar object instance.
         * @method cc.plugin.font.SpriteFontChar#constructor
         */
        constructor();
        /**
         * Get the char width.
         * @member cc.plugin.font.SpriteFontChar#get:width
         * @returns {number}
         */
        width: number;
        /**
         * Set the char SpriteFont reference.
         * @member cc.plugin.font.SpriteFontChar#setFont
         * @param f {cc.plugin.font.SpriteFont}
         */
        setFont(f: SpriteFont): void;
        /**
         * Set the char SpriteFrame.
         * @member cc.plugin.font.SpriteFontChar#setFrame
         * @param spriteFrame {cc.node.sprite.SpriteFrame}
         */
        setFrame(spriteFrame: SpriteFrame): void;
        /**
         * Add kerning info for a given char.
         * @member cc.plugin.font.SpriteFontChar#addKerning
         * @param char {string} a single character string.
         * @param v {number} kerning value for the char parameter
         */
        addKerning(char: string, v: number): void;
        /**
         * Draw a SpritFont character.
         * @member cc.plugin.font.SpriteFontChar#draw
         * @param ctx {cc.render.RenderingContext}
         * @param x {number}
         * @param y {number}
         * @param nextChar {string} next drawing character. needed for kerning adjustment.
         */
        draw(ctx: cc.render.RenderingContext, x: number, y: number, nextChar: string): void;
        /**
         * Create a SpriteFontChar from a SpriteFrame and some data definition.
         * @member cc.plugin.font.SpriteFontChar.createFrom
         * @param frame {cc.node.sprite.SpriteFrame} a sprite frame the character will be mapped to.
         * @param data {object} SpriteFontChar definition.
         * @returns {cc.plugin.font.SpriteFontChar}
         */
        static createFrom(frame: SpriteFrame, data: any): SpriteFontChar;
    }
    /**
     * @class cc.plugin.font.SpriteFont
     * @classdesc
     *
     * A sprite font is a fast drawing type of font that for webgl autobatches with very good performance results.
     * This kind of fonts are backed by a texture, where the characters are already drawn. The font basically blits
     * characters to the screen.
     *
     * Currently, a SpriteFont can be created:
     * <li>From a glyph designer output file
     * <li>A FNT output file, like the ones coming from https://www.glyphite.com
     * <li>From Texture packer JSON output
     *
     * Fonts can be cached in the AssetManager.
     *
     * BUGBUG: fonts are slow. remove all split calls in favor or faster methods.
     */
    class SpriteFont {
        /**
         * A font name of choice. This name will be used as the key for the SpriteFont cache.
         * @member cc.plugin.font.SpriteFont#_fontName
         * @type {string}
         * @private
         */
        _fontName: string;
        /**
         * Whether the font is valid for draw.
         * @member cc.plugin.font.SpriteFont#_valid
         * @type {boolean}
         * @private
         */
        _valid: boolean;
        /**
         * Collection of objects representing font characters.
         * @member cc.plugin.font.SpriteFont#_chars
         * @type {Map<string,SpriteFontChar>}
         * @private
         */
        _chars: {
            [char: string]: SpriteFontChar;
        };
        /**
         * Font height. The height is the height of every font character. Height is the result of ascent+descent.
         * @member cc.plugin.font.SpriteFont#_height
         * @type {number}
         * @private
         */
        _height: number;
        /**
         * Font baseline, corresponding to the alphabetic baseline.
         * @member cc.plugin.font.SpriteFont#_baseline
         * @type {number}
         * @private
         */
        _baseline: number;
        /**
         * Font ascent. Height of char area corresponding to the content above the baseline.
         * @member cc.plugin.font.SpriteFont#_descent
         * @type {number}
         * @private
         */
        _descent: number;
        /**
         * Font descent. Height of the char area correspoingind to the content below the baseline.
         * @member cc.plugin.font.SpriteFont#_ascent
         * @type {number}
         * @private
         */
        _ascent: number;
        /**
         * Create a new SpriteFont object instance.
         * @method cc.plugin.font.SpriteFont#constructor
         * @param name
         */
        constructor(name: string);
        /**
         * Whether the font is valid.
         * @method cc.plugin.font.SpriteFont#isValid
         * @returns {boolean}
         */
        isValid(): boolean;
        /**
         * Insert a SpriteFontChar in the font definition.
         * @method cc.plugin.font.SpriteFont#__addChar
         * @param obj {cc.plugin.font.SpriteFontChar}
         * @private
         */
        __addChar(obj: SpriteFontChar): void;
        /**
         * Create a font font a FNT file.
         * @method cc.plugin.font.SpriteFont#setAsGlypthDesigner
         * @param spriteFrameId {string} The name of a SpriteFrame in the AssetManager cache. The font characters
         *  will be mapped on the SpriteFrame represented by the id.
         * @param fontDef {string} a .fnt file contents.
         * @returns {cc.plugin.font.SpriteFont}
         */
        setAsFnt(spriteFrameId: string, fontDef: string): SpriteFont;
        /**
         * Build the font from a glyph designer output file.
         * @method cc.plugin.font.SpriteFont#setAsGlypthDesigner
         * @param spriteFrameId {string} The name of a SpriteFrame in the AssetManager cache. The font characters
         *  will be mapped on the SpriteFrame represented by the id.
         * @param fontDef {string} a glyph designed file contents.
         * @returns {cc.plugin.font.SpriteFont}
         */
        setAsGlypthDesigner(spriteFrameId: string, fontDef: string): SpriteFont;
        /**
         * Build the font from a systm font object initializer.
         * @method cc.plugin.font.SpriteFont#setAsSystemFont
         * @param fontDef {cc.plugin.font.SystemFontInitializer} font definition
         * @returns {cc.plugin.font.SpriteFont}
         */
        setAsSystemFont(fontDef: SystemFontInitializer): SpriteFont;
        /**
         * Draw text with the font.
         * Characters not present in the font will be skipped, as if they were not in the string.
         * The string can be multiline, and text is splitted in lines with \n character.
         * The split operation is slow and GC prone, so better call drawTextArray.
         * @method cc.plugin.font.SpriteFont#drawText
         * @param ctx {cc.render.RenderingContext}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         */
        drawText(ctx: cc.render.RenderingContext, text: string, x: number, y: number): void;
        /**
         * Draw an array of strings. Each string will be considered one line of text.
         * This method will be called by drawText. Prefer this method to avoid creating intermediate strings
         * per frame compared to drawText.
         * @param ctx {cc.render.RenderingContext}
         * @param lines {string[]}
         * @param x {number}
         * @param y {number}
         */
        drawTextArray(ctx: cc.render.RenderingContext, lines: string[], x: number, y: number): void;
        /**
         * This method is like drawText but does not take into account line breaks.
         * It will therefore draw all text in one single line.
         * This method is called by drawTextArray. Prefer this method if the text has one single line of text.
         * @param ctx {cc.render.RenderingContext}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         */
        drawTextLine(ctx: cc.render.RenderingContext, text: string, x: number, y: number): void;
        /**
         * Draw a text with the current font that will fit in a given rectangle.
         * The text will flow with the given rectangle width.
         * The text will be horizontal and vertically aligned in the rect based on the valign/halign hints.
         * The text can have multiple lines separated by \n characters.
         * @param ctx {cc.render.RenderingContext} multi renderer rendering context.
         * @param text {string} text to fit in the rectangle.
         * @param x {number} x position of the rect to fit the text in.
         * @param y {number} y position of the rect to fit the text in.
         * @param width {number} width of the rect to fit the text in.
         * @param height {number} height of the rect to fit the text in.
         * @param valign {cc.widget.VALIGN} vertical alignment hint
         * @param halign {cc.widget.HALIGN} horizontal alignment hint
         */
        drawTextInRect(ctx: cc.render.RenderingContext, text: string, x: number, y: number, width: number, height: number, halign: number, valign: number): void;
        /**
         * Get a text dimension by this font.
         * @method cc.plugin.font.SpriteFont#textSize
         * @param text {string}
         * @param flowWidth {number=}
         * @returns {cc.math.Dimension}
         */
        getTextSize(text: string, flowWidth?: number): cc.math.Dimension;
        getTextSizeFlow(text: string, flowWidth: number): cc.math.Dimension;
        getLineSizeFlow(text: string, flowWidth: number): cc.math.Dimension;
        /**
         * Get a string width based on the font char definition.
         * If the string contains an unknown character to the font, that character will be skipped and add 0 to the
         * string width.
         * @param text {string}
         * @returns {number} string width based on the current font.
         */
        getStringWidth(text: string): number;
    }
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.font {
    /**
     * @class cc.plugin.font.FontMetrics
     * @classdesc
     *
     * This class represents Font metrics information.
     * It is needed for building on-the-fly system SpriteFont objects.
     *
     */
    class FontMetrics {
        /**
         * Text height.
         * @member cc.plugin.font.FontMetrics#height
         * @type {number}
         */
        height: number;
        /**
         * Text ascent.
         * @member cc.plugin.font.FontMetrics#ascent
         * @type {number}
         */
        ascent: number;
        /**
         * Text descent.
         * @member cc.plugin.font.FontMetrics#descent
         * @type {number}
         */
        descent: number;
        /**
         * Build a new FontMetrics object instance.
         * @method cc.plugin.font.FontMetrics#constructor
         */
        constructor(h?: number, as?: number, des?: number);
    }
    /**
     * Get a FontMetrics object. The system will try to guess the most accurate FontMetrics object based on system
     * capabilities:
     *
     * <li>First, try to get metrics info from the CanvasRenderingContext2D TextMetrics object.
     * <li>If not available, will try to execute a voodoo function to measure size using DOM and CSS.
     * <li>If not, will guess from the font size. most inaccurate, and buggy.
     *
     * @name getFontMetrics
     * @memberOf cc.plugin.font
     *
     * @param ctx {CanvasRenderingContext2D}
     * @param font {string} valid canvas font representation.
     */
    function getFontMetrics(ctx: CanvasRenderingContext2D, font: string): FontMetrics;
}
/**
 * License: see license.txt file
 */
declare module cc.plugin.asset {
    import Resource = cc.plugin.loader.Resource;
    import Texture2D = cc.render.Texture2D;
    import SpriteFrame = cc.node.sprite.SpriteFrame;
    import Animation = cc.node.sprite.Animation;
    import SystemFontInitializer = cc.plugin.font.SystemFontInitializer;
    interface ResourcesMap {
        [id: string]: any;
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
    class AssetManager {
        /**
         * For backwards compatibility
         * Map of string,Resource
         */
        static _resources: {
            [id: string]: any;
        };
        static mergeResources(res: {
            [id: string]: any;
        }): void;
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
        static load(data: cc.plugin.loader.LoaderInitializer, onEnd?: cc.plugin.loader.LoaderFinishedCallback, onProgress?: cc.plugin.loader.LoaderProgressCallback, onError?: cc.plugin.loader.LoaderErrorCallback): void;
        /**
         * Setup textures for a given renderer. Concretelly, if the renderer is webgl, textures are turned into webgl
         * textures.
         * @method cc.plugin.asset.AssetManager.prepareTextures
         * @param renderer {cc.render.Renderer}
         */
        static prepareTextures(renderer: cc.render.Renderer): void;
        /**
         * Add an Image to the Manager resources.
         * The image will be stored as a cc.render.Texture2D object.
         * A SpriteFrame with the given id and representing the whole image will be added too.
         * @method cc.plugin.asset.AssetManager.addImage
         * @param img {HTMLImageElement|HTMLCanvasElement}
         * @param id {string} The texture and the SpriteFrame representing the texture will have this id.
         */
        static addImage(img: HTMLImageElement | HTMLCanvasElement, id: string): cc.render.Texture2D;
        /**
         * Add a cc.plugin.loader.Resource instance.
         * Currently only works for images.
         * @method cc.plugin.asset.AssetManager.addResource
         * @param resource {cc.plugin.loader.Resource}
         */
        static addResource(resource: Resource): void;
        /**
         * Add a SpriteFrame to the cache.
         * @method cc.plugin.asset.AssetManager.addSpriteFrame
         * @param frame {cc.node.sprite.SpriteFrame}
         */
        static addSpriteFrame(frame: SpriteFrame): void;
        /**
         * Get an SpriteFrame by id.
         * @method cc.plugin.asset.AssetManager.getSpriteFrame
         * @param id {string}
         * @returns {cc.node.sprite.SpriteFrame}
         */
        static getSpriteFrame(id: string): SpriteFrame;
        /**
         * Add an array of SpriteFrames to the cache.
         * @method cc.plugin.asset.AssetManager.addSpriteFrames
         * @param frames {Array<cc.node.sprite.SpriteFrame>}
         */
        static addSpriteFrames(frames: SpriteFrame[]): void;
        /**
         * Get an array of sprite frames identified by an array of SpriteFrame ids.
         * If any of the ids does not match a SpriteFrame object, a warning will be printed in the console,
         * but nothing will happen.
         * @method cc.plugin.asset.AssetManager.getSpriteFrames
         * @param ids {Array<string>}
         * @returns {Array<cc.node.sprite.SpriteFrame>}
         */
        static getSpriteFrames(ids: string[]): SpriteFrame[];
        /**
         * Add a Texture2D to the cache.
         * @method cc.plugin.asset.AssetManager.addTexture
         * @param texture {cc.render.Texture2D}
         */
        static addTexture(texture: Texture2D): void;
        /**
         * Get a Texture2D object by string id.
         * @param name {string}
         * @returns {cc.render.Texture2D}
         */
        static getTexture(name: string): Texture2D;
        static addAnimation(animation: cc.node.sprite.Animation, name: string): void;
        /**
         * Create and store an animation build of the frames identified by the frames array.
         * If there's a prefix set, the frames is assumed to be an array of number, to build the SpriteFrame names:
         *  prefix+frames[0], prefix+frames[1], ..., etc.
         * If no prefix, the frames array is assumed to be the sting identifiers of the frames composing the animation.
         * @param animationName {string}
         * @param frames {Array<number|string>}
         * @param prefix {string=}
         */
        static addAnimationForFrames(animationId: string, frames: Array<number> | string[], prefix?: string): Animation;
        /**
         * Get an animation by id.
         * @param animationId {string}
         * @returns {cc.node.sprite.Animation}
         */
        static getAnimationById(animationId: string): cc.node.sprite.Animation;
        /**
         * Create SpriteFrames for all the elements in the JSON object.
         * The new SpriteFrame objects will be mapped inside the SpriteFrame identified by the spriteFrameId parameter.
         * @method cc.plugin.asset.AssetManager.addSpriteFramesFromFrameWithJSON
         * @param spriteFrameId {string} a SpriteFrame in the cache.
         * @param json {any}
         * @param prefix {string=} an optional prefix to prepend to all sprite frame names.
         */
        static addSpriteFramesFromFrameWithJSON(spriteFrameId: string, json: any, prefix?: string): void;
        /**
         * Create a grid of sub SpriteFrames from a given SpriteFrame.
         * @method cc.plugin.asset.AssetManager.addGridSpriteFramesFromFrame
         * @param spriteFrameId {string} a SpriteFrame id from the cache
         * @param rows {number} number or rows of the grid
         * @param cols {number} number or columns of the grid
         */
        static addGridSpriteFramesFromFrame(spriteFrameId: string, rows: number, cols: number): void;
        /**
         * Create a SpriteFont from the definition of a Glypth Designer file.
         * The font will be stored in the fonts cache.
         * @methoc cc.plugin.asset.AssetManager.createSpriteFontFromGlypthDesigner
         * @param fontName {string} name for storing the font.
         * @param spriteFrameId {string} a SpriteFrame from the cache. The glypths will be mapped in this SpriteFrame.
         * @param glypthDesignerInfo {string} the contents of a Glypth Designer file.
         */
        static createSpriteFontFromGlypthDesigner(fontName: string, spriteFrameId: string, glypthDesignerInfo: string): void;
        /**
         * Get a SpriteFont from the cache.
         * @methoc cc.plugin.asset.AssetManager.getSpriteFont
         * @param fontName {string} the id of a SpriteFont in the cache.
         * @returns {cc.plugin.font.SpriteFont}
         */
        static getSpriteFont(fontName: string): cc.plugin.font.SpriteFont;
        /**
         * Create a SpriteFont for a System Font.
         * @param fontName {string} the name to store the font in the cache.
         * @param systemFont {cc.plugin.font.SystemFontInitializer} font definition object.
         */
        static createSystemSpriteFont(fontName: string, systemFont: SystemFontInitializer): void;
        static addSpriteFramesFromFrameWithPLIST(spriteFrameId: string, plist: any): void;
        static getAudioBuffer(id: string): AudioBuffer;
        static addAudioBuffer(buffer: AudioBuffer, id: string): void;
    }
}
/**
 *
 */
declare module cc.plugin.audio {
    /**
     * @name AudioCallback
     * @memberOf cc.plugin.audio
     * @callback cc.plugin.audio.AudioCallback
     * @param audio {cc.plugin.audio.AudioEffect} the audio object that fired the callback.
     */
    type AudioCallback = (audio: AudioEffect) => any;
    /**
     * @tsenum cc.plugin.audio.AudioEffectStatus
     */
    enum AudioEffectStatus {
        NONE = 0,
        PLAY = 1,
        PAUSE = 2,
        STOP = 3,
        END = 4,
        LOADED = 5,
    }
    /**
     * @class cc.plugin.audio.AudioFilterInitializer
     * @interface
     */
    interface AudioFilterInitializer {
        /**
         * A value form: lowpass, highpass, bandpass, lowshelf, highself, peaking, notch, allpass
         * @member cc.plugin.audio.AudioFilterInitializer#type
         * @type {string}
         */
        type: string;
        /**
         * Frequency parameter
         * @member cc.plugin.audio.AudioFilterInitializer#frequency
         * @type {number}
         */
        frequency?: number;
        /**
         * gain parameter
         * @member cc.plugin.audio.AudioFilterInitializer#gain
         * @type {number}
         */
        gain?: number;
        /**
         * Q parameter
         * @member cc.plugin.audio.AudioFilterInitializer#gain
         * @type {number}
         */
        Q?: number;
    }
    /**
     * @class cc.plugin.audio.AudioEffect
     * @classdesc
     *
     * This object represents a WebAudio enabled Object. It can:
     *
     * <ul>
     *  <li>play, pause, resume, stop and loop.
     *  <li>define an AudioSprite (a region over a given audio).
     *  <li>Apply BiquadFilters to output.
     *  <li>Apply Convolution (needs external audio buffers).
     *  <li>Expose full lifecycle: start, stop, repeat, pause and resume.
     *  <li>Manage volume.
     *  <li>Be independently muted.
     *  <li>Play with delay time, so that you can schedule sounds on the future.
     *  <li>Seek audio.
     *  <li>On-the-fly change of properties such as volume, filter, convolver, loop, etc.
     * </ul>
     *
     * This audio object is connected to a master volume.
     */
    class AudioEffect {
        /**
         * An string id.
         * @member cc.plugin.audio.AudioEffect#_id
         * @type {string}
         * @private
         */
        _id: string;
        /**
         *
         * @member cc.plugin.audio.AudioEffect#_isWebAudio
         * @type {boolean}
         * @private
         */
        _isWebAudio: boolean;
        /**
         * Internal audio object status.
         * @member cc.plugin.audio.AudioEffect#_status
         * @type {cc.plugin.audio.AudioEffectStatus}
         * @private
         */
        _status: AudioEffectStatus;
        /**
         * Is this object muted ?
         * @member cc.plugin.audio.AudioEffect#_muted
         * @type {boolean}
         * @private
         */
        _muted: boolean;
        /**
         * The audio volume. Volume ranges from 0 to 1.
         * @member cc.plugin.audio.AudioEffect#_volume
         * @type {boolean}
         * @private
         */
        _volume: number;
        /**
         * The original audio buffer duration.
         * this value opposes to _duration which is the current Audio object duration.
         * @member cc.plugin.audio.AudioEffect#_bufferDuration
         * @type {number}
         * @private
         */
        _bufferDuration: number;
        /**
         * Current Audio object duration. If the audio is a sprite, the value will be different from _bufferDuration
         * @member cc.plugin.audio.AudioEffect#_bufferDuration
         * @type {number}
         * @private
         */
        _duration: number;
        /**
         * The audio source node.
         * @member cc.plugin.audio.AudioEffect#_source
         * @type {AudioBufferSourceNode}
         * @private
         */
        _source: AudioBufferSourceNode;
        /**
         * The audio contents.
         * @member cc.plugin.audio.AudioEffect#_buffer
         * @type {AudioBuffer}
         * @private
         */
        _buffer: AudioBuffer;
        /**
         * Relative to duration time when the audio was paused. Never use directly
         * @member cc.plugin.audio.AudioEffect#_pauseTime
         * @type {number}
         * @private
         */
        _pauseTime: number;
        /**
         * The audioContext time when play was called.
         * @member cc.plugin.audio.AudioEffect#_startPlaybackTime
         * @type {number}
         * @private
         */
        _startPlaybackTime: number;
        /**
         * If play is called with delay, this is the delay time before play the sound.
         * @member cc.plugin.audio.AudioEffect#_delayTime
         * @type {number}
         * @private
         */
        _delayTime: number;
        /**
         * Master volume node to which the audio volume will be connected.
         * @member cc.plugin.audio.AudioEffect#_masterGain
         * @type {number}
         * @private
         */
        _masterGain: GainNode;
        /**
         * The audio volume node.
         * @member cc.plugin.audio.AudioEffect#_gain
         * @type {number}
         * @private
         */
        _gain: GainNode;
        /**
         * Whether the audio is a sprite audio. A sprite audio is just a region from another audio object.
         * @member cc.plugin.audio.AudioEffect#_isSprite
         * @type {boolean}
         * @private
         */
        _isSprite: boolean;
        /**
         * If the audio is a Sprite audio, relative time offset where the sprite starts.
         * @member cc.plugin.audio.AudioEffect#_spriteStartTime
         * @type {boolean}
         * @private
         */
        _spriteStartTime: number;
        /**
         * Loop the audio ?.
         * @member cc.plugin.audio.AudioEffect#_loop
         * @type {boolean}
         * @private
         */
        _loop: boolean;
        /**
         * Internal loop timer.
         * @member cc.plugin.audio.AudioEffect#_endTimerId
         * @type {number}
         * @private
         */
        _endTimerId: number;
        /**
         * Audio end callback.
         * @member cc.plugin.audio.AudioEffect#_onEnd
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onEnd: AudioCallback;
        /**
         * Audio resume callback.
         * @member cc.plugin.audio.AudioEffect#_onResume
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onResume: AudioCallback;
        /**
         * Audio pause callback.
         * @member cc.plugin.audio.AudioEffect#_onPause
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onPause: AudioCallback;
        /**
         * Audio stop callback.
         * @member cc.plugin.audio.AudioEffect#_onStop
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onStop: AudioCallback;
        /**
         * Audio start callback.
         * @member cc.plugin.audio.AudioEffect#_onStart
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onStart: AudioCallback;
        /**
         * Audio repeat callback.
         * @member cc.plugin.audio.AudioEffect#_onRepeat
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onRepeat: AudioCallback;
        /**
         * Internal BiquadFilter node for sound filtering.
         * @member cc.plugin.audio.AudioEffect#_filter
         * @type {object}
         * @private
         */
        _filter: BiquadFilterNode;
        /**
         * Is filtering enabled ?
         * @member cc.plugin.audio.AudioEffect#_filterEnabled
         * @type {boolean}
         * @private
         */
        _filterEnabled: boolean;
        /**
         * Internal convolver node for sound convolution.
         * @member cc.plugin.audio.AudioEffect#_convolver
         * @type {object}
         * @private
         */
        _convolver: ConvolverNode;
        /**
         * Is convolution enabled ?
         * @member cc.plugin.audio.AudioEffect#_convolverEnabled
         * @type {boolean}
         * @private
         */
        _convolverEnabled: boolean;
        _playbackRate: number;
        /**
         * @method cc.plugin.audio.AudioEffect#constructor
         * @param buffer {object} Audio buffer object.
         * @param masterGain {object} a GainNode which will act as system volume.
         */
        constructor(masterGain: GainNode, buffer?: AudioBuffer);
        setId(s: string): AudioEffect;
        getId(): string;
        setBuffer(buffer: AudioBuffer): void;
        /**
         * Make the audio loop or not. This can be changed at any given time.
         * @method cc.plugin.audio.AudioEffect#loop
         * @param enable {boolean} enable loop or not.
         * @returns {cc.plugin.audio.AudioEffect}
         */
        loop(enable: boolean): AudioEffect;
        /**
         * Get whether the sound is looping.
         * @method cc.plugin.audio.AudioEffect#isLoop
         * @returns {boolean}
         */
        isLoop(): boolean;
        /**
         * Get the audio volume
         * @method cc.plugin.audio.AudioEffect#getVolume
         * @returns {number}
         */
        getVolume(): number;
        /**
         * Set the audio volume.
         * @method cc.plugin.audio.AudioEffect#setVolume
         * @param v {number} a number ranging from 0 (no sound) to 1 (full sound)
         */
        setVolume(v: number): void;
        /**
         * Set this audio as sprite.
         * Sprites must not be changed while playing. Should be set before.
         * The default sprite will be from starting of sound to its length;
         * If setSprite is called with enable=false, it will set the audio as non sprite, but the information of
         * sprite's start and duration can still be set. If not specified, these values will be kept 'as is'.
         * @method cc.plugin.audio.AudioEffect#setSprite
         * @param enable {boolean} enable this audio as sprite.
         * @param start {number} time offset to play the sound
         * @param duration {number} the audio will play from start to start+duration
         */
        setSprite(enable: boolean, start?: number, duration?: number): AudioEffect;
        /**
         * Configure internal audio sprite data.
         * @method cc.plugin.audio.AudioEffect#__setSpriteData
         * @private
         */
        __setSpriteData(): void;
        setPlaybackRate(rate: number): void;
        /**
         * Get audio duration. If the audio loops, getDuration will be Number.MAX_VALUE, and the buffer or sprite duration
         * otherwise plus the delay otherwise.
         * @method cc.plugin.audio.AudioEffect#getDuration
         * @returns {number}
         */
        getDuration(): number;
        /**
         * Create the audio source and some internal piping.
         * @method cc.plugin.audio.AudioEffect#__createSource
         * @private
         */
        __createSource(): void;
        /**
         * Do the internal volume, source, filter, convolver wiring.
         * @method cc.plugin.audio.AudioEffect#__connectNodes
         * @private
         */
        __connectNodes(): void;
        /**
         * Set a filter for the effect.
         * @method cc.plugin.audio.AudioEffect#setFilter
         * @param f {cc.plugin.audio.AudioFilterInitializer} filter info.
         */
        setFilter(f: AudioFilterInitializer): void;
        /**
         * Internal method to pause and play the audio. Between pause and play, will do some wiring of the internal nodes.
         * @method cc.plugin.audio.AudioEffect#__pausePlay
         * @private
         */
        __pausePlay(): void;
        /**
         * Play the audio. Alternatively, the play can be deferred by passing a delay parameter.
         * @method cc.plugin.audio.AudioEffect#play
         * @param delay {number} milliseconds to defer audio play.
         * @returns {cc.plugin.audio.AudioEffect}
         */
        play(delay?: number): AudioEffect;
        /**
         * Is the audio playing ?
         * @method cc.plugin.audio.AudioEffect#isPlaying
         * @returns {boolean}
         */
        isPlaying(): boolean;
        /**
         * Convolve the audio.
         * @method cc.plugin.audio.AudioEffect#convolve
         * @param _buffer {string|object} if string, it will look up an AudioObject in the AssetManager as convolution
         *    parameter. If not, a convolution audio buffer is expected.
         */
        convolve(_buffer: string | AudioBuffer): void;
        /**
         * Get current audio time. If playing or paused, will give the actual audio time and zero otherwise.
         * @method cc.plugin.audio.AudioEffect#getCurrentTime
         */
        getCurrentTime(): number;
        /**
         * Set current audio time. The time will be modulo the duration.
         * @method cc.plugin.audio.AudioEffect#setCurrentTime
         * @param time {number} expected audio seek position.
         */
        setCurrentTime(time: number): void;
        /**
         * If the audio is playing or paused get remaining play time, zero otherwise.
         * @method cc.plugin.audio.AudioEffect#getRemainingTime
         */
        getRemainingTime(): number;
        /**
         * Internal method that cancels the end play timer.
         * @method cc.plugin.audio.AudioEffect#__cancelEndTimer
         */
        __cancelEndTimer(): void;
        /**
         * Internal method that starts the end play timer.
         * @method cc.plugin.audio.AudioEffect#__startEndTimer
         */
        __startEndTimer(): void;
        /**
         * Internal method that performs the common stop audio part.
         * @method cc.plugin.audio.AudioEffect#__pause_stop_common
         */
        __pause_stop_common(): void;
        /**
         * Stop the audio
         * @method cc.plugin.audio.AudioEffect#stop
         */
        stop(): AudioEffect;
        /**
         * Pause the audio
         * @method cc.plugin.audio.AudioEffect#pause
         */
        pause(): AudioEffect;
        /**
         * Resume the audio
         * @method cc.plugin.audio.AudioEffect#resume
         */
        resume(): AudioEffect;
        /**
         * Set audio on end callback
         * @method cc.plugin.audio.AudioEffect#onEnd
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onEnd(c: AudioCallback): AudioEffect;
        /**
         * Set audio on repeat callback.
         * Effects repeat when looping.
         * @method cc.plugin.audio.AudioEffect#onRepeat
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onRepeat(c: AudioCallback): AudioEffect;
        /**
         * Set audio on pause callback
         * @method cc.plugin.audio.AudioEffect#onPause
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onPause(c: AudioCallback): AudioEffect;
        /**
         * Set audio on resume callback
         * @method cc.plugin.audio.AudioEffect#onResume
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onResume(c: AudioCallback): AudioEffect;
        /**
         * Set audio on stop callback
         * @method cc.plugin.audio.AudioEffect#onStop
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onStop(c: AudioCallback): AudioEffect;
        /**
         * Set audio on start callback
         * @method cc.plugin.audio.AudioEffect#onStart
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onStart(c: AudioCallback): AudioEffect;
        /**
         * Mute the audio.
         * @method cc.plugin.audio.AudioEffect#mute
         */
        mute(): AudioEffect;
        /**
         * Unmute the audio.
         * @method cc.plugin.audio.AudioEffect#unmute
         */
        unmute(): AudioEffect;
    }
    class SimpleAudioEffect {
        _audio: HTMLAudioElement;
        _loaded: boolean;
        _status: AudioEffectStatus;
        _url: string;
        _pauseTime: number;
        _volume: number;
        _masterVolume: number;
        _loop: boolean;
        constructor();
        setUrl(url: string, autoplay?: boolean): void;
        setMasterVolume(v: number): void;
        setVolume(v: number): void;
        loop(v: boolean): void;
        play(): void;
        pause(): void;
        resume(): void;
        stop(): void;
    }
    interface AudioManagerInitializer {
        numChannels?: number;
    }
    /**
     * @class cc.plugin.audio.AudioManager
     * @classdesc
     *
     * This object represents a sound manager.
     * The sound manager does several things:
     *
     * <li>keep an internal AudioEffect object pool. These elements are AudioBuffer decoded objects or Audio tags,
     *     depending on the AudioManager implementation.
     * <li>Has 3 gain nodes: music, effects, and a general one connected to the two previous ones.
     * <li>Plays background music using an Audio tag. You definitely don't want to have a 10 minutes song decoded
     *     into memory.
     *
     * There's only one music node and up to MAX_AUDIO_EFFECTS (16) for a total of 17 concurrent sounds.
     * The AudioManager objects manages lifecycle of the sounds. That means that an effect can be requested for play,
     * but not stop pause or resume. For such fine control, call <code>createAudio</code> method to get an
     * <code>AudioEffect</code> object which has much more advanced capabilities.
     */
    class AudioManager {
        _context: AudioContext;
        _effects: AudioEffect[];
        /**
         * Master volume.
         * @type {number}
         * @private
         */
        _volume: number;
        _masterGain: GainNode;
        _soundPool: AudioEffect[];
        _playingPool: AudioEffect[];
        _music: SimpleAudioEffect;
        constructor(ami?: AudioManagerInitializer);
        __recycle(ae: AudioEffect): void;
        createAudio(id: string): AudioEffect;
        setVolume(v: number): void;
        setMusicVolume(v: number): void;
        /**
         * Play a loaded AudioBuffer.
         * This method plays a fully system-controlled sound. There's no user-side control.
         * To have a client side controlled audio effect object, call <code>createAudio</code>.
         * @param id {string|AudioBuffer} a string id in the asset manager.
         * @param volume {number=} the volume for this effect. if not set, full volume will be used.
         */
        playEffect(id: string | AudioBuffer, volume?: number): void;
        pauseEffects(): void;
        resumeEffects(): void;
        stopEffects(): void;
        setMusic(url: string, autoplay?: boolean): void;
        playMusic(): void;
        pauseMusic(): void;
        resumeMusic(): void;
        stopMusic(): void;
        static canPlay(codec: string): boolean;
        static getContext(): AudioContext;
        static isWebAudioEnabled(): boolean;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.plugin.layout {
    type UnitValue = number | string;
    /**
     * @interface cc.plugin.layout.BaseLayoutInitializer
     * @classdesc
     *
     * Initializer object for a common layout.
     *
     */
    interface BaseLayoutInitializer {
        /**
         * type of the layout, currently: 'element', 'border', 'grid'
         * @member cc.plugin.layout.BaseLayoutInitializer#type
         * @type {string}
         */
        type: string;
        /**
         * Layout element name
         * @member cc.plugin.layout.BaseLayoutInitializer#name
         * @type {string=}
         */
        name?: string;
        /**
         * Preferred width. Has Unit notation, so values like '10px' or '20%' are valid.
         * @member cc.plugin.layout.BaseLayoutInitializer#preferredWidth
         * @type {string=}
         */
        preferredWidth?: string;
        /**
         * Preferred height. Has Unit notation, so values like '10px' or '20%' are valid.
         * @member cc.plugin.layout.BaseLayoutInitializer#preferredHeight
         * @type {string=}
         */
        preferredHeight?: string;
        /**
         * Element insets.
         * An array of four strings representing insets for: left, top, right, bottom respectively.
         * Unit notation.
         * @member cc.plugin.layout.BaseLayoutInitializer#insets
         * @type {Array<string>=}
         */
        insets?: string[];
        /**
         * Element gap.
         * An array of two strings representing element separation for horizontal and vertical respectively.
         * Unit notation.
         * @member cc.plugin.layout.BaseLayoutInitializer#gap
         * @type {Array<string>=}
         */
        gap?: string[];
        /**
         * Array of other layout initializer objects.
         * @member cc.plugin.layout.BaseLayoutInitializer#elements
         * @type {Array<cc.plugin.layout.BaseLayoutInitializer>} any layout initializer.
         */
        elements?: BaseLayoutInitializer[];
    }
    /**
     * @interface GridLayoutInitializer
     * @extends BaseLayoutInitializer
     * @classdesc
     *
     * Initializer object for a grid layout
     *
     */
    interface GridLayoutInitializer extends BaseLayoutInitializer {
        /**
         * Set the grid to grow in columns every number of rows.
         * @member cc.plugin.layout.GridLayoutInitializer#rows
         * @type {number=}
         */
        rows?: number;
        /**
         * Set the grid to grow in rows every number of columns.
         * @member cc.plugin.layout.GridLayoutInitializer#columns
         * @type {number=}
         */
        columns?: number;
    }
    /**
     * @interface BorderLayoutInitializer
     * @extends BaseLayoutInitializer
     * @classdesc
     *
     * Initializer for a border layout
     */
    interface BorderLayoutInitializer extends BaseLayoutInitializer {
        /**
         * Left element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#left
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        left?: BaseLayoutInitializer;
        /**
         * Right element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#right
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        right?: BaseLayoutInitializer;
        /**
         * Top element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#top
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        top?: BaseLayoutInitializer;
        /**
         * Bottom element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#bottom
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        bottom?: BaseLayoutInitializer;
        /**
         * Center element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#center
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        center?: BaseLayoutInitializer;
    }
    /**
     * @class cc.plugin.layout.Unit
     * @classdesc
     *
     * This class encapsulates a value in a given unit.
     * Currently, it could be a number, or a percentage value.
     * If the value is a percentage, a call to <code>getValue</code> needs a reference value.
     */
    class Unit {
        /**
         * Unit value.
         * @member cc.plugin.layout.Unit#_orgValue
         * @type {number}
         * @private
         */
        _orgValue: number;
        /**
         * Unit type. Either px, %, or nothing.
         * @member cc.plugin.layout.Unit#_orgType
         * @type {string}
         * @private
         */
        _orgType: string;
        /**
         * Create a new Unit object instance.
         * @method cc.plugin.layout.Unit#constructor
         * @param original {string=} Unit value. if not set, the unit it set to 0.
         */
        constructor(original?: string);
        /**
         * Set the unit value. For example '2%', '100px', '100'
         * @method cc.plugin.layout.Unit#setValue
         * @param original {string}
         */
        setValue(original: UnitValue): void;
        /**
         * Get the unit value.
         * If the unit type is percentage, and no reference value is supplied, zero will be returned as value.
         * @method cc.plugin.layout.Unit#getValue
         * @param ref {number=} percentage reference value.
         * @returns {number}
         */
        getValue(ref?: number): number;
    }
    /**
     * @class cc.plugin.layout.Insets
     * @classdesc
     *
     * This class describes a layout element internal padding.
     * It is descibed as independent inset values for top, bottom, left and right.
     * These values are Unit objects, so can be described as percentage values. The relative values are relative to
     * the Layout element assigned dimension, so its calculation is deferred to the proper layout stage.
     */
    class Insets {
        /**
         * Layout element left inset Unit.
         * @member cc.plugin.layout.Insets#left
         * @type {cc.plugin.layout.Unit}
         */
        left: Unit;
        /**
         * Layout element top inset Unit.
         * @member cc.plugin.layout.Insets#top
         * @type {cc.plugin.layout.Unit}
         */
        top: Unit;
        /**
         * Layout element right inset Unit.
         * @member cc.plugin.layout.Insets#right
         * @type {cc.plugin.layout.Unit}
         */
        right: Unit;
        /**
         * Layout element bottom inset Unit.
         * @member cc.plugin.layout.Insets#bottom
         * @type {cc.plugin.layout.Unit}
         */
        bottom: Unit;
    }
    /**
     * @class cc.plugin.layout.Gap
     * @classdesc
     *
     * This object describes the separation values between two adjacent layout elements.
     * For example, for a grid, describes the Units to separate the grid elements.
     */
    class Gap {
        /**
         * Horizontal gap Unit.
         * @member cc.plugin.layout.Gap#horizontal
         * @type {cc.plugin.layout.Unit}
         */
        horizontal: Unit;
        /**
         * Vertical gap Unit.
         * @member cc.plugin.layout.Gap#vertical
         * @type {cc.plugin.layout.Unit}
         */
        vertical: Unit;
    }
    /**
     * @class cc.plugin.layout.Layout
     * @classdesc
     *
     * This object is the base for all other layout objects.
     * The layout will assign bounds (position and size) for all the layout elements it contains.
     * Layouts will apply different space partitioning rules to conform elements to available space.
     * Layout elements can be nested. for example, a grid cell can contain another grid of elements.
     * <p>
     * Each layout element will have its bounds modified by an <code>Insets</code> object which will reduce the
     * available element bounds.
     * Some layout types, like <code>GridLayout</code> or <code>BorderLayout</code> will be able to apply a gap
     * to separate the contained elements.
     * <p>
     * A layout element can define a preferred size (either in units or percentage) to layout with. This value is
     * needed for layout types that don't impose a size constraint. For example, a GridLayout will set each element's
     * bounds with a fixed rule, that is, dividing the space evenly. But others, like a BorderLayout won't, so you
     * must hint how much space each element is expected to take.
     * <p>
     *     Layouts are defined declaratively and a Node or any other object, does not need to know anything about
     *     the layout itself.
     * <p>
     * The BaseLayout object assumes no children when laying out. Other extending objects will modify this behavior.
     */
    class BaseLayout {
        /**
         * Resulting bounds after applying the layout rules.
         * @member cc.plugin.layout.BaseLayout#_bounds
         * @type {cc.math.Rectangle}
         * @private
         */
        _bounds: cc.math.Rectangle;
        /**
         * The layout insets. Insets will reduce the bounds area by setting a padding for the element.
         * @member cc.plugin.layout.BaseLayout#_insets
         * @type {cc.plugin.layout.Insets}
         * @private
         */
        _insets: Insets;
        /**
         * Separation between each layout elements. Not all layout will use this value.
         * @member cc.plugin.layout.BaseLayout#_gap
         * @type {cc.plugin.layout.Gap}
         * @private
         */
        _gap: Gap;
        /**
         * Array of elements to lay out. Since layouts are nestable, children are layout instances as well.
         * @member cc.plugin.layout.BaseLayout#_children
         * @type {Array<cc.plugin.layout.BaseLayout>}
         * @private
         */
        _children: BaseLayout[];
        /**
         * Layout preferred width Unit hint.
         * @member cc.plugin.layout.BaseLayout#_preferredWidth
         * @type {cc.plugin.layout.Unit}
         * @private
         */
        _preferredWidth: Unit;
        /**
         * Layout preferred height Unit hint.
         * @member cc.plugin.layout.BaseLayout#_preferredHeight
         * @type {cc.plugin.layout.Unit}
         * @private
         */
        _preferredHeight: Unit;
        /**
         * Optional layout identifier.
         * This is useful so that a node tag or name can be matched against this layout element.
         * @member cc.plugin.layout.BaseLayout#_name
         * @type {string}
         * @private
         */
        _name: string;
        _parent: BaseLayout;
        /**
         * Create a new BaseLayout object instance.
         * Do not create directly, only by subclasses.
         * @method cc.plugin.layout.BaseLayout#constructor
         */
        constructor();
        /**
         * Parse a layout initializer object to get a layout element object.
         * @param layout {string|cc.plugin.layout.BaseLayoutInitializer} a layout initializer object, or a string.
         *   If a string is set, a BaseLayout object will be used.
         */
        static parse(layout: string | BaseLayoutInitializer): BaseLayout;
        /**
         * Helper method to visually see the layout result.
         * @method cc.plugin.layout.BaseLayout#paint
         * @param ctx {CanvasRenderingContext2D}
         */
        paint(ctx: CanvasRenderingContext2D): void;
        /**
         * Set the layout bounds.
         * @method cc.plugin.layout.BaseLayout#setBounds
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        setBounds(x: number, y: number, w: number, h: number): void;
        /**
         * Set the layout size.
         * @method cc.plugin.layout.BaseLayout#setSize
         * @param w {number}
         * @param h {number}
         */
        setSize(w: number, h: number): void;
        /**
         * Set the layout preferred size Unit hints.
         * @param w {number|string}
         * @param h {number|string}
         */
        setPreferredSize(w: UnitValue, h: UnitValue): void;
        /**
         * Get the element preferredSize.
         * The size units are evaluated, so if they are percentage, the value is recalculated now again.
         * @method cc.plugin.layout.BaseLayout#getPreferredSize
         * @returns {cc.math.Dimension}
         */
        getPreferredSize(): cc.math.Dimension;
        /**
         * Recursively evaluate the layout elements and get the resulting preferred size.
         * This does not take into account the size constraints, will get the desired size.
         * In this object, the implementation returns the result of the preferredSize Unit hints + Insets.
         * @method cc.plugin.layout.BaseLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize(): cc.math.Dimension;
        /**
         * Evaluate the layout with the current size constraints. The root layout element bounds will be used
         * as size constraint.
         * @method cc.plugin.layout.BaseLayout#doLayout
         */
        doLayout(): void;
        /**
         * Set size constraints and evaluate the layout.
         * The result will be all layout elements have assigned a bounds.
         * @method cc.plugin.layout.BaseLayout#layout
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        layout(x: number, y: number, w: number, h: number): void;
        /**
         * Parse a layout definition object.
         * This will get all the common layout properties: insets, gap, preferred size and elements.
         * @method cc.plugin.layout.BaseLayout#parse
         * @param layoutInfo {cc.plugin.layout.BaseLayoutInitializer}
         * @returns {cc.plugin.layout.BaseLayout}
         */
        parse(layoutInfo: BaseLayoutInitializer): BaseLayout;
        /**
         * Parse the elements block from the layout initializer object.
         * @method cc.plugin.layout.BaseLayout#parseElements
         * @param children {Array<object>}
         */
        parseElements(children: Array<any>): void;
        /**
         * Add an element layout to this layout object.
         * @param e {cc.plugin.layout.BaseLayout}
         * @param constraint {string=} a constraint to add an element. For example, BorderLayout requires a position hint
         *      to add an element.
         */
        addElement(e: BaseLayout, constraint?: string): void;
        /**
         * Helper method to add the Inset object value to a Dimension.
         * @method cc.plugin.layout.BaseLayout#adjustWithInsets
         * @param d
         */
        adjustWithInsets(d: cc.math.Dimension): void;
        /**
         * Recursively traverse the layout elements and, if a layout element has name, find a node with that name
         * and then set the found node's position to the layout calculated position. If resize is set to true,
         * the found node's content size will be set to the layout calculated size.
         * The node is searched in the _node parameter or any of its children.
         * @param _node {cc.node.Node} the node to traverse to find a node with a layout name
         * @param resize {boolean} change de node size to that of the calculated layout ?
         */
        applyToNode(_node: cc.node.Node, resize: boolean): void;
    }
    /**
     * @class cc.plugin.layout.BorderLayout
     * @extends cc.plugin.layout.BaseLayout
     * @classdesc
     *
     * A BorderLayout object divides the available space in up to 5 different regions as follows:
     * <pre>
     *
     *     +----------------------------+
     *     |            TOP             |
     *     +------+-------------+-------+
     *     | LEFT |             | RIGHT |
     *     |      |             |       |
     *     |      |             |       |
     *     |      |   CENTER    |       |
     *     |      |             |       |
     *     |      |             |       |
     *     |      |             |       |
     *     +------+-------------+-------+
     *     |           BOTTOM           |
     *     +----------------------------+
     * </pre>
     *
     * <p>
     *     Since all bounds are dynamically calculated, elements added to a BorderLayout (at any nesting level) must
     *     have preferred size hints.
     * <p>
     *     The gap values will be empty filler values between every elements. Horizontal between left-center center-right
     *     and vertical betweeen top and bottom and all the others.
     * <p>
     *     All Elements are optional to define.
     * <p>
     *     The center element will get the remaining space after laying out all the other elements.
     *     The left, right and center elements will get the remaining height after evaluating top and then
     *     bottom elements.
     * <p>
     *     top, left, right, bottom and center can be, at the same time, other layouts.
     *
     */
    class BorderLayout extends BaseLayout {
        /**
         * Left layout element.
         * @member cc.plugin.layout.BorderLayout#_left
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _left: BaseLayout;
        /**
         * Right layout element.
         * @member cc.plugin.layout.BorderLayout#_right
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _right: BaseLayout;
        /**
         * Top layout element.
         * @member cc.plugin.layout.BorderLayout#_top
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _top: BaseLayout;
        /**
         * Bottom layout element.
         * @member cc.plugin.layout.BorderLayout#_bottom
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _bottom: BaseLayout;
        /**
         * Center layout element.
         * @member cc.plugin.layout.BorderLayout#_center
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _center: BaseLayout;
        /**
         * Build a new BorderLayout object instance
         * @method cc.plugin.layout.BorderLayout#constructor
         */
        constructor();
        /**
         * Get the preferred layout size after recursively applying the layout. The size will be the preferred size,
         * not the actual size.
         * @method cc.plugin.layout.BorderLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize(): cc.math.Dimension;
        /**
         * Set the left layout element.
         * @method cc.plugin.layout.BorderLayout#left
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        left(e: BaseLayout): BorderLayout;
        /**
         * Set the right layout element.
         * @method cc.plugin.layout.BorderLayout#right
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        right(e: BaseLayout): BorderLayout;
        /**
         * Set the top layout element.
         * @method cc.plugin.layout.BorderLayout#top
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        top(e: BaseLayout): BorderLayout;
        /**
         * Set the bottom layout element.
         * @method cc.plugin.layout.BorderLayout#bottom
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        bottom(e: BaseLayout): BorderLayout;
        /**
         * Set the center layout element.
         * @method cc.plugin.layout.BorderLayout#center
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        center(e: BaseLayout): BorderLayout;
        /**
         * Parse the BorderLayout.
         * @method cc.plugin.layout.BorderLayout#parse
         * @param layoutInfo {cc.plugin.layout.BorderLayoutInitializer}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        parse(layoutInfo: BorderLayoutInitializer): BorderLayout;
        /**
         * Add an element to the layout. Since this layout only allows for 5 specific elements, an adding constraint
         * must be used.
         * @method cc.plugin.layout.BorderLayout#addElement
         * @param e {cc.plugin.layout.BaseLayout}
         * @param constraint {string} must exist. a value from 'top','bottom','left','right' or 'center'.
         */
        addElement(e: BaseLayout, constraint?: string): void;
        /**
         * Do the actual lay out process. Elements will fit into the previously set element bounds.
         * @method cc.plugin.layout.BorderLayout#doLayout
         */
        doLayout(): void;
    }
    /**
     * @class cc.plugin.layout.GridLayout
     * @extends cc.plugin.layout.BaseLayout
     * @classdesc
     *
     * A grid layout lays elements out either in rows or columns. If rows are specified, the lay out will keep the fixed
     * number of rows and grow on the number of columns or vice versa, like as follows:
     *
     * <pre>
     *
     *     3 rows                        3 columns
     *
     *     +------------+-----...        +----------+----------+----------+
     *     |  row1      |                |   col1   |   col2   |   col3   |
     *     +------------+-----...        +----------+----------+----------+
     *     |  row2      |                |          |          |          |
     *     +------------+-----...        .          .          .          .
     *     |  row3      |                .          .          .          .
     *     +------------+-----...
     * </pre>
     *
     */
    class GridLayout extends BaseLayout {
        /**
         * Lay out in rows or columns.
         * @member cc.plugin.layout.GridLayout#_layoutRows
         * @type {boolean}
         * @private
         */
        _layoutRows: boolean;
        /**
         * Elements to layout before adding a row or column.
         * @member cc.plugin.layout.GridLayout#_numElements
         * @type {number}
         * @private
         */
        _numElements: number;
        /**
         * Calculated number of rows for the current added elements.
         * @member cc.plugin.layout.GridLayout#_rows
         * @type {number}
         * @private
         */
        _rows: number;
        /**
         * Calculated number of columns for the current added elements.
         * @member cc.plugin.layout.GridLayout#_columns
         * @type {number}
         * @private
         */
        _columns: number;
        /**
         * Create a new GridLayout object instance.
         * @method cc.plugin.layout.GridLayout#constructor
         */
        constructor();
        /**
         * Parse the grid info.
         * @method cc.plugin.layout.GridLayout#parse
         * @param layoutInfo {cc.plugin.layout.GridLayoutInitializer}
         * @returns {cc.plugin.layout.GridLayout}
         */
        parse(layoutInfo: GridLayoutInitializer): GridLayout;
        /**
         * Get the preferred layout elements size. The preferred size will be the adjusted to the biggest element's
         * preferred size, adding the gap for each of the layout elements.
         * Finally, the insets will be added to the size.
         * @method cc.plugin.layout.GridLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize(): cc.math.Dimension;
        /**
         * Do the actual elements lay out. The size of each element will be constrained to the element's bound.
         * @method cc.plugin.layout.GridLayout#doLayout
         */
        doLayout(): void;
    }
    /**
     * @class cc.plugin.layout.LayerLayout
     * @extends cc.plugin.layout.BaseLayout
     * @classdesc
     *
     * A LayerLayout stacks elements one on top of the other making their bounds the same.
     * The layout does not work on z-index, simply makes them to take over the same area.
     *
     */
    class LayerLayout extends BaseLayout {
        /**
         * Build a new LayerLayout
         * @method cc.plugin.layout.LayerLayout#constructor
         */
        constructor();
        /**
         * @method cc.plugin.layout.LayerLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize(): cc.math.Dimension;
        /**
         * @method cc.plugin.layout.LayerLayout#doLayout
         */
        doLayout(): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.input {
    import Node = cc.node.Node;
    import KeyboardInputManager = cc.input.KeyboardInputManager;
    /**
     * @class cc.input.InputManagerEvent
     * @classdesc
     *
     * This is the base type for all CocosJS input events.
     */
    class InputManagerEvent {
        /**
         * Target is the object for which the event happened.
         * For example, for MouseInputManagerEvents, _target is the node in which the event happened.
         * @member cc.input.InputManagerEvent#_target
         * @type {Object}
         * @private
         */
        _target: any;
        /**
         * Input event type.
         * Identifies the emitted event type for each addEventListener event call.
         * @member cc.input.InputManagerEvent#_type
         * @type {string}
         * @private
         */
        _type: string;
        /**
         * Build a new InputManagerEvent object.
         * Does nothing.
         * @method cc.input.InputManagerEvent#constructor
         */
        constructor();
        /**
         * Get this event's target. The target can be any type.
         * @method cc.input.InputManagerEvent#get:target
         * @returns {any}
         */
        target: any;
        /**
         * Get the event target.
         * @method cc.input.InputManagerEvent#getCurrentTarget
         * @returns {cc.node.Node}
         */
        getCurrentTarget(): cc.node.Node;
        /**
         * Get this event's type.
         * @method cc.input.InputManagerEvent#get:type
         * @returns {string}
         */
        type: string;
        /**
         * Must override and honor.
         * @method cc.input.InputManagerEvent#initializeEventForTarget
         * @param target {Object} a target object.
         * @param type {string} an event type.
         *
         */
        initializeEventForTarget(target: any, type: string): void;
    }
    /**
     * @class cc.input.InputManager
     * @classdesc
     *
     * General input manager object.
     *
     */
    class InputManager {
        _keyboardManager: KeyboardInputManager;
        constructor();
        enable(element: HTMLCanvasElement): InputManager;
        disable(): InputManager;
        addEventListener(event: any, callback: any, params: any): void;
        registerCursor(kd: cc.input.CursorInitializer, callback: (key: string, down: boolean) => any): number;
        unregisterCursor(id: number): void;
    }
    /**
     * @class cc.input.PriorityInputNode
     * @classdesc
     *
     * This class encapsulated a descriptor for priority input routing. Basically keeps track of a target Node and
     * a priority value.
     * These descriptors are sorted in priority value, meaning lower values will be evaluated for input first.
     */
    class PriorityInputNode {
        node: Node;
        priority: number;
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
        constructor(node: Node, priority: number);
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
    class SceneGraphInputTreeNode {
        /**
         * Target Node.
         * @member cc.input.SceneGraphInputTreeNode#node
         * @type {cc.node.Node}
         */
        node: Node;
        /**
         * This node's Scene-Graph priority children nodes.
         * @member cc.input.SceneGraphInputTreeNode#children
         * @type {cc.input.SceneGraphInputTreeNode}
         */
        children: SceneGraphInputTreeNode[];
        /**
         * Is this node enabled ? if not, it won't be tested for input.
         * @member cc.input.SceneGraphInputTreeNode#enabled
         * @type {boolean}
         */
        enabled: boolean;
        /**
         * Create a new Scene-Graph priority node/tree.
         * @method cc.input.SceneGraphInputTreeNode#constructor
         * @param node {cc.node.Node=}
         */
        constructor(node?: Node);
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
        insert(path: Node[]): SceneGraphInputTreeNode;
        /**
         * Node path insertion implementation.
         * @method cc.input.SceneGraphInputTreeNode#__insertImpl
         * @param inputNode {cc.input.SceneGraphInputTreeNode} a tree node.
         * @param path {Array<cc.node.Node>} node path.
         * @returns {cc.input.SceneGraphInputTreeNode}
         * @private
         */
        __insertImpl(inputNode: SceneGraphInputTreeNode, path: Node[]): SceneGraphInputTreeNode;
        /**
         * Add a node as a Scene-Graph priority tree node's child.
         * @method cc.input.SceneGraphInputTreeNode#addChildInputNode
         * @param node {cc.node.Node}
         * @returns {*}
         */
        addChildInputNode(node: Node): SceneGraphInputTreeNode;
        /**
         * Flatten this tree and get an array of pre-order sorted nodes.
         * @method cc.input.SceneGraphInputTreeNode#flatten
         * @returns {Array<cc.node.Node>}
         */
        flatten(): Node[];
        /**
         * Tree flatten operation implementation.
         * @method cc.input.SceneGraphInputTreeNode#__flattenImpl
         * @param inputNode {cc.input.SceneGraphInputTreeNode} a tree node.
         * @param nodes {Array<cc.node.Node>} an array to push the sorted nodes.
         * @private
         */
        __flattenImpl(inputNode: SceneGraphInputTreeNode, nodes: Node[]): void;
        /**
         * For an screen position, get the first node that is at that position and has input enabled.
         * This will be the target of the pointer input operation.
         * @method cc.input.SceneGraphInputTreeNode#findNodeAtScreenPoint
         * @param e {cc.input.MouseInputManager}
         * @returns {cc.node.Node}
         */
        findNodeAtScreenPoint(p: cc.math.Vector, callback?: (node: Node) => boolean): Node;
        /**
         * findNodeAtScreenPoint's implementation
         * @method cc.input.SceneGraphInputTreeNode#__findNodeAtScreenPoint
         * @param inputNode {cc.input.SceneGraphInputTreeNode}
         * @param e {cc.input.MouseInputManager}
         * @returns {cc.node.Node}
         * @private
         */
        __findNodeAtScreenPoint(inputNode: SceneGraphInputTreeNode, p: cc.math.Vector, callback?: (node: Node) => boolean): Node;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.input {
    import Vector = cc.math.Vector;
    import Scene = cc.node.Scene;
    import Node = cc.node.Node;
    import InputManagerEvent = cc.input.InputManagerEvent;
    /**
     * @class cc.input.MouseInputManagerEvent
     * @extends cc.input.InputManagerEvent
     * @classdesc
     *
     * This class represents information for a Mouse-level event and translated into CocosJS needed information.
     *
     */
    class MouseInputManagerEvent extends InputManagerEvent {
        /**
         * Original DOM level event that triggered this MouseInputManagerEvent
         * @member cc.input.MouseInputManagerEvent#_originalDOMEvent
         * @type {MouseEvent}
         * @private
         */
        _originalDOMEvent: MouseEvent;
        /**
         * position in canvas space.
         * @member cc.input.MouseInputManagerEvent#_screenPoint
         * @type {cc.math.Vector}
         * @private
         */
        _screenPoint: Vector;
        /**
         * Target Node local coordinate.
         * @member cc.input.MouseInputManagerEvent#_screenPoint
         * @type {cc.math.Vector}
         * @private
         */
        _localPoint: Vector;
        /**
         * For a dragging operation, position in canvas space of the previous event.
         * @member cc.input.MouseInputManagerEvent#_screenPoint
         * @type {cc.math.Vector}
         * @private
         */
        _prevScreenPoint: Vector;
        /**
         * Create a new MouseInputManagerEvent instance.
         * @method cc.input.MouseInputManagerEvent#constructor
         * @param e {MouseEvent} DOM level original event.
         */
        constructor(e: MouseEvent);
        getDelta(): cc.math.Point;
        /**
         * Set this event's screen point.
         * @method cc.input.MouseInputManagerEvent#setScreenPoint
         * @param x {number}
         * @param y {number}
         */
        setScreenPoint(x: number, y: number): void;
        /**
         * Initialize the event for type and target.
         * @method cc.input.MouseInputManagerEvent#initializeEventForTarget
         * @param target {cc.node.Node}
         * @param event {string}
         */
        initializeEventForTarget(target: Node, event: string): void;
        /**
         * Get target Node's local coordinate where the event originated.
         * @method cc.input.MouseInputManagerEvent#get:localPoint
         * @returns {cc.math.Vector}
         */
        localPoint: Vector;
        /**
         * Get target screen coordinate where the previous event originated.
         * @method cc.input.MouseInputManagerEvent#get:prevScreenPoint
         * @returns {cc.math.Vector}
         */
        prevScreenPoint: Vector;
        /**
         * Get target screen coordinate where the event originated.
         * @method cc.input.MouseInputManagerEvent#get:screenPoint
         * @returns {cc.math.Vector}
         */
        screenPoint: Vector;
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
    class MouseInputManager {
        /**
         * Set the scene to route input events to.
         * This happens automatically at director level whenever a call to runAction happens.
         * @method cc.input.MouseInputManager.enableInputForScene
         * @param scene {cc.node.Scene}
         */
        static enableInputForScene(scene: Scene): void;
        static disableInputForScene(): void;
        /**
         * Enable the input for mouse and touch.
         * @method cc.input.MouseInputManager.enable
         * @param target {HTMLCanvasElement} canvas target.
         */
        static enable(target: HTMLCanvasElement): void;
        /**
         * Disable the input for mouse and touch.
         * @method cc.input.MouseInputManager.disable
         */
        static disable(): void;
    }
}
/**
 * Created by ibon on 1/6/15.
 */
declare module cc.input {
    /**
     * Keys names and ascii chars.
     * From Impact Game Engine.
     * @name KEYS
     * @memberOf cc.input
     * @type {Map<string,number>}
     */
    var KEYS: {
        0: number;
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        enter: number;
        backspace: number;
        tab: number;
        shift: number;
        ctrl: number;
        alt: number;
        pause: number;
        capslock: number;
        escape: number;
        pageup: number;
        pagedown: number;
        end: number;
        home: number;
        left: number;
        up: number;
        right: number;
        down: number;
        insert: number;
        "delete": number;
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
        g: number;
        h: number;
        i: number;
        j: number;
        k: number;
        l: number;
        m: number;
        n: number;
        o: number;
        p: number;
        q: number;
        r: number;
        s: number;
        t: number;
        u: number;
        v: number;
        w: number;
        x: number;
        y: number;
        z: number;
        command: number;
        meta: number;
        select: number;
        rcommand: number;
        numpad0: number;
        numpad1: number;
        numpad2: number;
        numpad3: number;
        numpad4: number;
        numpad5: number;
        numpad6: number;
        numpad7: number;
        numpad8: number;
        numpad9: number;
        multiply: number;
        add: number;
        subtract: number;
        decimalpoint: number;
        divide: number;
        f1: number;
        f2: number;
        f3: number;
        f4: number;
        f5: number;
        f6: number;
        f7: number;
        f8: number;
        f9: number;
        f10: number;
        f11: number;
        f12: number;
        numlock: number;
        scrolllock: number;
        semicolon: number;
        equalsign: number;
        comma: number;
        dash: number;
        period: number;
        forwardslash: number;
        graveaccent: number;
        openbracket: number;
        backslash: number;
        closebracket: number;
        singlequote: number;
        commandright: number;
    };
    /**
     * @class cc.input.KeyInfo
     * @classdesc
     *
     * Describes a key and its modifiers.
     * For example: command+a, shift+alt+g
     * A Key, is parsed from a string, amd must be defined in this order: modifiers+key.
     * It won't recognize something like: a+shift whili it will recognized shift+a
     * KeyInfo objects keep internal state for parsing result validity.
     *
     * Objects of this type are internal to the keyboard manager.
     */
    class KeyInfo {
        /**
         * Key Code.
         * @member cc.input.KeyInfo#key
         * @type {number}
         */
        key: number;
        /**
         * Modifiers Object.
         * @member cc.input.KeyInfo#modifiers
         * @type {object}
         */
        modifiers: any;
        /**
         * Key has been parsed correctly ?
         * @member cc.input.KeyInfo#isValid
         * @type {boolean}
         */
        isValid: boolean;
        /**
         * Build a new KeyInfo instance from a string key representation.
         * @method cc.input.KeyInfo#constructor
         * @param keyDef {string}
         */
        constructor(keyDef: string);
        /**
         * Test whether this KeyInfo matches a keyCode and some modifiers.
         * @method cc.input.KeyInfo#matches
         * @param key {number} key code.
         * @param modifiers {object}
         * @returns {boolean}
         */
        matches(key: number, modifiers: any): boolean;
    }
    /**
     * @class cc.input.KeyActionInfo
     * @classdesc
     *
     * A KeyActionInfo is responsible for defining a key sequence, composed by a collection of KeyInfo objects.
     * It will also be responsible for identifying whether the sequence has been types correctly, and of notifying any
     * sequence listeners registered for it.
     *
     * A sample KeyActionInfo could be for example the konami code:
     * "up up down dow left right left right b a", "a b c", or a simple "a". The callback associated with the sequence
     * will be fired when all the keys are pressed in order.
     *
     * An action info will be fired on key down or up, depending on the construction parameter.
     * For multi-key actions, the callback will be fired on key down or up of the last sequence key.
     * The sequence will be invalidated if the wrong key for the current sequence position is typed, or it more than
     * KeyActionInfo._typeTime is exceeded.
     */
    class KeyActionInfo {
        /**
         * The registered keys of the sequence action.
         * @member cc.input.KeyActionInfo#_keys
         * @type {Array<cc.input.KeyInfo>}
         * @private
         */
        _keys: KeyInfo[];
        /**
         * Action for which the ket sequence action was registered. Either 'down' or 'up'.
         * @member cc.input.KeyActionInfo#_action
         * @type {string}
         * @private
         */
        _action: string;
        /**
         * Callback to fire when the sequence is complete.
         * @member cc.input.KeyActionInfo#_callback
         * @type {Function}
         * @private
         */
        _callback: Function;
        /**
         * Current sequence expected key.
         * @member cc.input.KeyActionInfo#_currentKeyInfoIndex
         * @type {number}
         * @private
         */
        _currentKeyInfoIndex: number;
        /**
         * Time at which the last valid action sequence key was typed.
         * @member cc.input.KeyActionInfo#_time
         * @type {number}
         * @private
         */
        _time: number;
        /**
         * A index-sequence generated id. It is valid for unregistering key sequences from the keyboard manager.
         * @member cc.input.KeyActionInfo#_id
         * @type {number}
         * @private
         */
        _id: number;
        /**
         * If more than this milliseconds elapse between two valid sequence action keys, the sequence will be aborted.
         * @member cc.input.KeyActionInfo#_typeTime
         * @type {number}
         * @private
         */
        _typeTime: number;
        /**
         * Create a new KeyActionInfo sequence object.
         * @method cc.input.KeyActionInfo#constructor
         * @param keys {string} a string with the sequence keys definition.
         * @param action {string} down or up. If keys is a sequence of keys, the sequence will be fired on up or down
         *                        of the last sequence key.
         * @param callback {function} a parameterless callback function.
         */
        constructor(keys: string, action: string, callback: Function);
        /**
         * Get the sequence id.
         * @method cc.input.KeyActionInfo#getId
         * @returns {number}
         */
        getId(): number;
        /**
         * Build KeyInfo objects from a keys definition string.
         * @method cc.input.KeyActionInfo#__parseKeys
         * @param keys {string} a string with keys (combinations) names. for example: "command+b", "alt+shift+f1 a b c"
         * @private
         */
        __parseKeys(keys: string): void;
        /**
         * Signal a key down event has been generated at keyboard manager level
         * @method cc.intpu.KeyInfoAction#down
         * @param modifiers {object} modifiers object
         * @param key {number} key code
         * @param time {number} time at which the event key was produced.
         */
        down(modifiers: any, key: number, time: number): void;
        /**
         * Signal a key up event has been generated at keyboard manager level
         * @method cc.intpu.KeyInfoAction#up
         * @param modifiers {object} modifiers object
         * @param key {number} key code
         * @param time {number} time at which the event key was produced.
         */
        up(modifiers: any, key: number, time: number): void;
        /**
         * Check whether the key code fulfills the key sequence in time.
         * The sequence will be reset if the wrong expected key is pressed or too much time elapse between two valid
         * sequence keys.
         * @param key {number} key code
         * @param modifiers {object} modifiers object
         * @param time {number} time at which the event key was produced.
         * @private
         */
        __checkKey(key: number, modifiers: any, time: number): void;
        /**
         * Change the valid waiting time between two valid sequence keys.
         * The function won't check whether the number is valid or too low.
         * @method cc.input.KeyInfoAction#setSequenceTypeMaxTime
         * @param m {number}
         */
        setSequenceTypeMaxTime(m: number): KeyActionInfo;
    }
    /**
     * @class cc.input.CursorInitializer
     * @interface
     * @classdesc
     *
     * Cursor initializer. the up, down, left and right members represent a valid key enumeration.
     * Each of the keys in the sequence will be added as valid key sequences for each cursor event.
     * For example, if "w up" is specified for up, the Cursor will fire a callback for each of the keys 'w' and 'up'.
     */
    interface CursorInitializer {
        /**
         * @member cc.input.CursorInitializer#up
         */
        up: string;
        /**
         * @member cc.input.CursorInitializer#down
         */
        down: string;
        /**
         * @member cc.input.CursorInitializer#left
         */
        left: string;
        /**
         * @member cc.input.CursorInitializer#right
         */
        right: string;
    }
    /**
     * @class cc.input.KeyboardCursor
     * @classdesc
     *
     * This class represents a cursor composed of the 4 cursor events up, down, left and right.
     * For each of the events, a valid key enumeration can be defined.
     * For example, if "w up" is specified for up, the Cursor will fire a callback for each of the keys 'w' and 'up'.
     * This class makes all the necessary wiring between the cursor keys and KeyInfoAction objects.
     */
    class KeyboardCursor {
        /**
         * Cursor up flag.
         * @member cc.input.KeyboardCursor#_upPressed
         * @type {boolean}
         * @private
         */
        _upPressed: boolean;
        /**
         * Cursor down flag.
         * @member cc.input.KeyboardCursor#_downPressed
         * @type {boolean}
         * @private
         */
        _downPressed: boolean;
        /**
         * Cursor left flag.
         * @member cc.input.KeyboardCursor#_leftPressed
         * @type {boolean}
         * @private
         */
        _leftPressed: boolean;
        /**
         * Cursor right flag.
         * @member cc.input.KeyboardCursor#_rightPressed
         * @type {boolean}
         * @private
         */
        _rightPressed: boolean;
        /**
         * Array for KeyActionInfo generated objects to keep track of the cursor.
         * @member cc.input.KeyboardCursor#_actionInfoIds
         * @type {Array<number>}
         * @private
         */
        _actionInfoIds: number[];
        /**
         * For each cursor key press/release, this callback function will be called.
         * The key parameter of the callback will contain the cursor event names: up,down,left,right, and not the key name
         * that triggered the action. Thus, a generic cursor handle function could be used instead on having to taylor
         * a function for each cursor type.
         * @member cc.input.KeyboardCursor#_callback
         * @type {function(string,boolean)}
         * @private
         */
        _callback: (key: string, down: boolean, keyCode: number) => any;
        /**
         * Internal cursor id. Necessary for unregistering a cursor.
         * @member cc.input.KeyboardCursor#_id
         * @type {number}
         * @private
         */
        _id: number;
        /**
         * Create a new KeyboardCursor object instance.
         * @method cc.input.KeyboardCursor#constructor
         * @param kim {cc.input.KeyboardInputManager}
         * @param cd {cc.input.CursorInitializer}
         * @param callback {function(string,boolean)}
         */
        constructor(kim: KeyboardInputManager, cd: CursorInitializer, callback: (key: string, down: boolean) => any);
        /**
         * Notify a cursor key status change.
         * @method cc.input.KeyboardCursor#__onKeyChange
         * @param key {string} the cursor event type.
         * @param pressed {boolean} true the key is pressed, false is released.
         * @private
         */
        __onKeyChange(key: string, pressed: boolean): void;
        /**
         * Register a KeyActionInfo for each key defined in the cursor event key description.
         * For example if "up w" is supplied, it will generate sequences for 'up' and 'w' respectively.
         * @param kim {cc.input.KeyboardInputManager}
         * @param keysdesc {string} keys descripion
         * @param callbackdown {function}
         * @param callbackup {function}
         * @private
         */
        __registerKeys(kim: KeyboardInputManager, keysdesc: string, callbackdown: () => any, callbackup: () => any): void;
        /**
         * Get the cursor id.
         * @method cc.input.KeyboardCursor#getId
         * @returns {number}
         */
        getId(): number;
        /**
         * Unregisted all key sequences from the cursor.
         * This method is internally used by the KeyboardInputManager
         * @method cc.input.KeyboardCursor#unregisted
         * @param kim {cc.action.KeyboardInputManager}
         */
        unregister(kim: KeyboardInputManager): void;
        /**
         * Get cursor's event up status flag.
         * @method cc.input.KeyboardCursor#get:up
         * @returns {boolean} true is pressed.
         */
        up: boolean;
        /**
         * Get cursor's event down status flag.
         * @method cc.input.KeyboardCursor#get:down
         * @returns {boolean} true is pressed.
         */
        down: boolean;
        /**
         * Get cursor's event left status flag.
         * @method cc.input.KeyboardCursor#get:left
         * @returns {boolean} true is pressed.
         */
        left: boolean;
        /**
         * Get cursor's event right status flag.
         * @method cc.input.KeyboardCursor#get:right
         * @returns {boolean} true is pressed.
         */
        right: boolean;
    }
    /**
     * @class cc.input.KeyboardInputManager
     * @classdesc
     *
     * This object is the general keyboard input manager.
     * It must be instantiated.
     *
     */
    class KeyboardInputManager {
        /**
         * Registered key sequences.
         * @member cc.input.KeyboardInputManager#_keyActionInfos
         * @type {Array<cc.input.KeyActionInfo>}
         * @private
         */
        _keyActionInfos: KeyActionInfo[];
        /**
         * Whether the keyboard handler is enabled.
         * @member cc.input.KeyboardInputManager#_enabled
         * @type {boolean}
         * @private
         */
        _enabled: boolean;
        /**
         * Global keyboard modifiers.
         * @member cc.input.KeyboardInputManager#_modifiers
         * @type {object}
         * @private
         */
        _modifiers: any;
        /**
         * Registered KeyboardCursor objects.
         * @member cc.input.KeyboardInputManager#_cursors
         * @type {Map<string,KeyboardCursor>}
         * @private
         */
        _cursors: any;
        /**
         * Internally bound function for down events.
         * Do not use or modify.
         * @member cc.input.KeyboardInputManager#_onDown
         * @type {function(KeyboardEvent)}
         * @private
         */
        _onDown: (e: KeyboardEvent) => any;
        /**
         * Internally bound function for up events.
         * Do not use or modify.
         * @member cc.input.KeyboardInputManager#_onUp
         * @type {function(KeyboardEvent)}
         * @private
         */
        _onUp: (e: KeyboardEvent) => any;
        /**
         * Create a new KeyboardInputManager instance.
         * @method cc.input.KeyboardInputManager#constructor
         */
        constructor();
        __onDown(e: KeyboardEvent): void;
        __onUp(e: KeyboardEvent): void;
        __setModifiers(key: number, down: boolean): boolean;
        /**
         * Register and Enable the keyboard manager.
         * @method cc.input.KeyboardInputManager#enable
         */
        enable(): void;
        /**
         * Disable the keyboard manager and remove keyboard listeners.
         * @method cc.input.KeyboardInputManager#enable
         */
        disable(): void;
        /**
         * Add a callback for a key sequence. Fired on 'down' of the last sequence key.
         * @method cc.input.KeyboardInputManager#onDown
         * @param keys {string}
         * @param callback {function()}
         * @returns {number}
         */
        onDown(keys: string, callback: () => any): number;
        /**
         * Add a callback for a key sequence. Fired on 'up' of the last sequence key.
         * @method cc.input.KeyboardInputManager#onUp
         * @param keys {string}
         * @param callback {function()}
         * @returns {number}
         */
        onUp(keys: string, callback: () => any): number;
        /**
         * Register a cursor object with the cursor keys defined in the initializer.
         * @method cc.input.KeyboardInputManager#registerCursor
         * @param cd {cc.input.CursorInitializer}
         * @param callback {function({string},{boolean}) a callback function invoked with the cursor event name and
         *        status of the cursor key.
         * @returns {number}
         */
        registerCursor(cd: CursorInitializer, callback: (key: string, down: boolean) => any): number;
        /**
         * Unregister a KeyboardCursor object.
         * @method cc.input.KeyboardInputManager#unregisterCursor
         * @param id {number}
         */
        unregisterCursor(id: number): void;
        /**
         * Remove a key sequence from the keyboard manager.
         * @method cc.input.KeyboardInputManager#removeActionInfo
         * @param id {number}
         */
        removeActionInfo(id: number): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc.game {
    import Resource = cc.plugin.loader.Resource;
    /**
     * @class cc.game.ResolutionInitializer
     * @interface
     * @classdesc
     *
     * ScaleManager resolution, orientation and units initialization info.
     */
    interface ResolutionInitializer {
        width: number;
        height: number;
        unitsWidth?: number;
        unitsHeight?: number;
        canvasElement?: string;
        scaleStrategy?: string;
        canvasPosition?: string;
        orientation?: string;
        renderer?: string;
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
    class Game {
        _director: cc.node.Director;
        _renderer: cc.render.Renderer;
        constructor();
        setDesignResolutionSize(ri: ResolutionInitializer): cc.game.Game;
        load(assets: string[], _onLoad: (game: cc.game.Game) => any, _onProgress: (resource: Resource, index: number, size: number, errored: boolean) => any, _onError: (resource: Resource) => any): void;
        runScene(scene: cc.node.Scene): void;
        /**
         * Return the internal scale management object.
         * This object handles all things relative to Renderer surface scale and on-screen positioning, as well as
         * orientation changes and content scale ratio calculations.
         * @method cc.node.Director#getScaleManager
         * @see cc.game.ScaleManager
         * @returns {cc.game.ScaleManager}
         */
        getScaleManager(): cc.render.ScaleManager;
        /**
         * Set renderer surface scale strategy.
         * @method cc.node.Director#setScaleStrategy
         * @param ss {cc.render.ScaleManagerStrategy} how renderer surface should me up/down scaled when the window
         *          changes size.
         * @param sp {cc.render.ScalePosition} how to position the renderer surface on the window object.
         */
        setScaleStrategy(ss: cc.render.ScaleManagerStrategy, sp: cc.render.ScalePosition): void;
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
        setScaleContent(w: number, h: number, cw?: number, ch?: number): number;
        /**
         * When <code>setScaleContent</code> has been called this method gives the scale factor for the units-pixel
         * mapping ratio.
         * @method cc.node.Director#getUnitsFactor
         * @returns {number}
         */
        getUnitsFactor(): number;
        /**
         * Set renderer surface orientation strategy. If set to landscape or portrait, when the window changes size
         * will notify about valid or wrong orientation.
         * Default orientation is set to BOTH.
         * @method cc.node.Director#setOrientationStrategy
         * @param os {cc.render.OrientationStrategy} desired orientation.
         * @param onOk {cc.render.OrientationCallback}
         * @param onError {cc.render.OrientationCallback}
         */
        setOrientationStrategy(os: cc.render.OrientationStrategy, onOk?: cc.render.OrientationOkCallback, onError?: cc.render.OrientationErrorCallback): void;
        /**
         * Get whether the device has fullScreen capabilities
         * @method cc.node.Director#isFullScreenCapable
         * @returns {boolean}
         */
        isFullScreenCapable(): boolean;
        /**
         * Is currently the system in full screen ?
         * @method cc.node.Director#isFullScreen
         * @returns {boolean}
         */
        isFullScreen(): boolean;
        /**
         * Start full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#startFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        startFullScreen(f?: () => any): void;
        /**
         * End full screen process. If the system is not full screen capable will silently fail.
         * @method cc.node.Director#endFullScreen
         * @param f {callback=} optional function called when the system enters full screen.
         */
        endFullScreen(f?: () => any): void;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc {
    var __BACKWARDS_COMPATIBILITY__: boolean;
    import Point = cc.math.Point;
    import Action = cc.action.Action;
    import SequenceAction = cc.action.SequenceAction;
    import TimeInterpolator = cc.action.TimeInterpolator;
    import Animation = cc.node.sprite.Animation;
    /**
     * Create a Animate like <code>AnimateAction</code> action.
     * @method cc.animate
     * @param animation {cc.node.sprite.Animation}
     * @returns {Action}
     */
    function animate(animation: Animation): Action;
    function callFunc(fn: any, _this?: any, data?: any): Action;
    function show(): Action;
    function toggleVisibility(): Action;
    function hide(): Action;
    function place(v: Point): Action;
    function blink(timeInSecs: number, blinks: number): Action;
    function jumpTo(timeInSecs: number, pos: Point, amplitude: number, jumps?: number): Action;
    function jumpBy(timeInSecs: number, pos: Point, amplitude: number, jumps?: number): Action;
    function cardinalSplineTo(timeInSecs: number, p: Array<Point>, tension: number, closed?: boolean): Action;
    function cardinalSplineBy(timeInSecs: number, p: Array<Point>, tension: number, closed?: boolean): Action;
    function catmullRomTo(timeInSecs: number, p: Array<Point>, closed?: boolean): Action;
    function catmullRomBy(timeInSecs: number, p: Array<Point>, closed?: boolean): Action;
    function bezierTo(timeInSecs: number, p: Array<Point>): Action;
    function bezierBy(timeInSecs: number, p: Array<Point>): Action;
    /**
     * Create a moveTo like <code>MoveAction</code> action.
     * @method cc.moveTo
     * @param timeInSecs {number}
     * @param p {cc.math.Point}
     * @returns {Action}
     */
    function moveTo(timeInSecs: number, p: Point): Action;
    /**
     * Create a moveBy like <code>MoveAction</code> action.
     * @method cc.moveBy
     * @param timeInSecs {number}
     * @param p {cc.math.Point}
     * @returns {Action}
     */
    function moveBy(timeInSecs: number, p: Point): Action;
    /**
     * Create a scaleTo like <code>ScaleAction</code> action.
     * @method cc.scaleTo
     * @param timeInSecs {number}
     * @param x {number}
     * @param y {number}
     * @returns {Action}
     */
    function scaleTo(timeInSecs: number, x: number, y?: number): Action;
    /**
     * Create a scaleBy like <code>ScaleAction</code> action.
     * @method cc.scaleBy
     * @param timeInSecs {number}
     * @param x {number}
     * @param y {number}
     * @returns {Action}
     */
    function scaleBy(timeInSecs: number, x: number, y?: number): Action;
    /**
     * Create a rotateTo like <code>RotateAction</code> action.
     * @method cc.rotateTo
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    function rotateTo(timeInSecs: number, a: number): Action;
    /**
     * Create a rotateBy like <code>RotateAction</code> action.
     * @method cc.rotateBy
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    function rotateBy(timeInSecs: number, a: number): Action;
    /**
     * Create a fadeIn like <code>AlphaAction</code> action.
     * @method cc.fadeIn
     * @param timeInSecs {number}
     * @returns {cc.action.Action}
     */
    function fadeIn(timeInSecs: number): Action;
    /**
     * Create a fadeIn like <code>AlphaAction</code> action.
     * @method cc.fadeOut
     * @param timeInSecs {number}
     * @returns {cc.action.Action}
     */
    function fadeOut(timeInSecs: number): Action;
    /**
     * Create a fadeTo like <code>AlphaAction</code> action.
     * @method cc.fadeTo
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    function fadeTo(timeInSecs: number, a: number): Action;
    /**
     * Create a fadeBy like <code>AlphaAction</code> action.
     * @method cc.fadeBy
     * @param timeInSecs {number}
     * @param a {number}
     * @returns {Action}
     */
    function fadeBy(timeInSecs: number, a: number): Action;
    /**
     * Create a tintTo like <code>TintAction</code> action.
     * @method cc.tintTo
     * @param timeInSecs {number}
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @returns {Action}
     */
    function tintTo(timeInSecs: number, r: number, g: number, b: number): Action;
    /**
     * Create a tintBy like <code>TintAction</code> action.
     * @method cc.tintBy
     * @param timeInSecs {number}
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @returns {Action}
     */
    function tintBy(timeInSecs: number, r: number, g: number, b: number): Action;
    /**
     * Reverses the target action
     * @method cc.reverseTime
     * @param action {cc.action.Action}
     * @returns {cc.reverseTime}
     */
    function reverseTime(action: Action): Action;
    /**
     * Make an action repeat a number of times.
     * @method cc.repeat
     * @param action {cc.action.Action}
     * @param times {number}
     * @returns {Action}
     */
    function repeat(action: Action, times: number): Action;
    /**
     * Make an action repeat forever.
     * @method cc.repeatForever
     * @param action {cc.action.Action}
     * @returns {Action}
     */
    function repeatForever(action: Action): Action;
    /**
     * Create an action that waits the given time.
     * @method cc.delayTime
     * @param delayInSecs {number}
     * @returns {cc.action.Action}
     */
    function delayTime(delayInSecs: number): Action;
    function __sequence(sequential: boolean, actions: Array<Action>): SequenceAction;
    /**
     * Set an action speed.
     * @method cc.speed
     * @param action {cc.action.Action}
     * @param speed {number} speed 1 is the default speed. speed 2 will make the action to take twice the time.
     * @returns {Action}
     */
    function speed(action: Action, speed: number): Action;
    /**
     * Create a Sequence of Actions.
     * Actions can be other Sequences or Spawns.
     * @method cc.sequence
     * @param actions {Array<cc.action.Action>}
     * @returns {SequenceAction}
     */
    function sequence(...actions: Array<Action>): SequenceAction;
    /**
     * Create a Spawn of Actions.
     * Actions can be other Sequences or Spawns.
     * @methos cc.spawn
     * @param actions {Array<cc.action.Action>}
     * @returns {SequenceAction}
     */
    function spawn(...actions: Array<Action>): SequenceAction;
    /**
     * Apply easing to an action time.
     * @method cc.easing
     * @param action {cc.action.Action}
     * @param interpolator {cc.action.TimeInterpolator}
     * @returns {Action}
     */
    function easing(action: Action, interpolator: TimeInterpolator): Action;
    /**
     * Apply BackIn easing to an action
     * @method cc.easeBackIn
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeBackIn(action?: Action): any;
    /**
     * Apply easeBackOut easing to an action.
     * @method cc.easeBackOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeBackOut(action?: Action): Action;
    /**
     * Apply easeBackInOut easing to an action.
     * @method cc.easeBackInOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeBackInOut(action?: Action): Action;
    /**
     * Apply BounceIn easing to an action
     * @method cc.easeBounceIn
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeBounceIn(action?: Action): Action;
    /**
     * Apply easeBounceOut easing to an action.
     * @method cc.easeBounceOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeBounceOut(action?: Action): Action;
    /**
     * Apply easeBounceInOut easing to an action.
     * @method cc.easeBounceInOut
     * @param action {cc.action.Action=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeBounceInOut(action?: Action): Action;
    /**
     * Apply elasticlIn easing to an action
     * @method cc.easeElasticIn
     * @param action {cc.action.Action|number=}
     * @param period {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeElasticIn(action?: any, period?: number): Action;
    /**
     * Apply elasticOut easing to an action.
     * @method cc.easeElasticOut
     * @param action {cc.action.Action|number=}
     * @param period {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeElasticOut(action: any, period?: number): Action;
    /**
     * Apply elasticInOut easing to an action.
     * @method cc.easeElasticInOut
     * @param action {cc.action.Action|number}
     * @param period {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeElasticInOut(action: any, period?: number): Action;
    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeIn
     * @param action {cc.action.Action|number}
     * @param exponent {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeIn(action: any, exponent: number): Action;
    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeOut
     * @param action {cc.action.Action}
     * @param exponent {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeOut(action: any, exponent?: number): Action;
    /**
     * Apply exponentialInOut easing to an action. Exponent 2.
     * @method cc.easeInOut
     * @param action {cc.action.Action}
     * @param exponent {number=}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeInOut(action: any, exponent?: number): Action;
    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeExponentialIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeExponentialIn(action?: Action): Action;
    /**
     * Apply exponentialOut easing to an action. Exponent 2.
     * @method cc.easeExponentialOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeExponentialOut(action?: Action): Action;
    /**
     * Apply exponentialInOut easing to an action. Exponent 2.
     * @method cc.easeExponentialInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeExponentialInOut(action?: Action): Action;
    /**
     * Apply sineIn easing to an action. Exponent 2.
     * @method cc.easeSineIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeSineIn(action?: Action): Action;
    /**
     * Apply sineOut easing to an action. Exponent 2.
     * @method cc.easeSineOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeSineOut(action?: Action): Action;
    /**
     * Apply sineInOut easing to an action. Exponent 2.
     * @method cc.easeSineInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeSineInOut(action?: Action): Action;
    /**
     * Apply exponentialIn easing to an action. Exponent 2.
     * @method cc.easeQuadraticActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuadraticActionIn(action?: Action): Action;
    /**
     * Apply exponentialOut easing to an action. Exponent 2.
     * @method cc.easeQuadraticActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuadraticActionOut(action?: Action): Action;
    /**
     * Apply exponentialInOut easing to an action. Exponent 2.
     * @method cc.easeQuadraticActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuadraticActionInOut(action?: Action): Action;
    /**
     * Apply exponentialIn easing to an action. Exponent 3.
     * @method cc.easeCubicActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeCubicActionIn(action?: Action): Action;
    /**
     * Apply exponentialOut easing to an action. Exponent 3.
     * @method cc.easeCubicActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeCubicActionOut(action?: Action): Action;
    /**
     * Apply exponentialInOut easing to an action. Exponent 3.
     * @method cc.easeCubicActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeCubicActionInOut(action?: Action): Action;
    /**
     * Apply exponentialIn easing to an action. Exponent 4.
     * @method cc.easeQuarticlActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuarticlActionIn(action?: Action): Action;
    /**
     * Apply exponentialOut easing to an action. Exponent 4.
     * @method cc.easeQuarticActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuarticActionOut(action?: Action): Action;
    /**
     * Apply exponentialInOut easing to an action. Exponent 4.
     * @method cc.easeQuarticActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuarticActionInOut(action?: Action): Action;
    /**
     * Apply exponentialIn easing to an action. Exponent 5.
     * @method cc.easeQuinticlActionIn
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuinticActionIn(action?: Action): Action;
    /**
     * Apply exponentialOut easing to an action. Exponent 5.
     * @method cc.easeQuinticlActionOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuinticActionOut(action?: Action): Action;
    /**
     * Apply exponentialInOut easing to an action. Exponent 5.
     * @method cc.easeQuinticlActionInOut
     * @param action {cc.action.Action}
     * @returns {cc.action.Action|cc.action.Interpolator}
     */
    function easeQuinticActionInOut(action?: Action): Action;
}
/**
 * License: see license.txt file.
 */
declare module cc {
    module EaseBackIn {
        var create: typeof easeBackIn;
    }
    module EaseBackOut {
        var create: typeof easeBackOut;
    }
    module EaseBackInOut {
        var create: typeof easeBackInOut;
    }
    module EaseBounceIn {
        var create: typeof easeBounceIn;
    }
    module EaseBounceOut {
        var create: typeof easeBounceOut;
    }
    module EaseBounceInOut {
        var create: typeof easeBounceInOut;
    }
    module EaseElasticIn {
        var create: typeof easeElasticIn;
    }
    module EaseElasticOut {
        var create: typeof easeElasticOut;
    }
    module EaseElasticInOut {
        var create: typeof easeElasticInOut;
    }
    module EaseSineIn {
        var create: typeof easeSineIn;
    }
    module EaseSineOut {
        var create: typeof easeSineOut;
    }
    module EaseSineInOut {
        var create: typeof easeSineInOut;
    }
    module CatmullRomTo {
        var create: typeof catmullRomTo;
    }
    module CatmullRomBy {
        var create: typeof catmullRomBy;
    }
    module CardinalSplineTo {
        var create: typeof cardinalSplineTo;
    }
    module CardinalSplineBy {
        var create: typeof cardinalSplineBy;
    }
    module BezierTo {
        var create: typeof bezierTo;
    }
    module BezierBy {
        var create: typeof bezierBy;
    }
    module MoveTo {
        var create: typeof moveTo;
    }
    module MoveBy {
        var create: typeof moveBy;
    }
    module ScaleTo {
        var create: typeof scaleTo;
    }
    module ScaleBy {
        var create: typeof scaleBy;
    }
    module RotateTo {
        var create: typeof rotateTo;
    }
    module RotateBy {
        var create: typeof rotateBy;
    }
    module FadeIn {
        var create: typeof fadeIn;
    }
    module FadeOut {
        var create: typeof fadeOut;
    }
    module FadeTo {
        var create: typeof fadeTo;
    }
    module FadeBy {
        var create: typeof fadeBy;
    }
    module TintTo {
        var create: typeof tintTo;
    }
    module TintBy {
        var create: typeof tintBy;
    }
    module ReverseTime {
        var create: typeof reverseTime;
    }
    module Repeat {
        var create: typeof repeat;
    }
    module RepeatForever {
        var create: typeof repeatForever;
    }
    module DelayTime {
        var create: typeof delayTime;
    }
    module Speed {
        var create: typeof speed;
    }
    module Sequence {
        var create: typeof sequence;
    }
    module Spawn {
        var create: typeof spawn;
    }
    module Easing {
        var create: typeof easing;
    }
    module EaseIn {
        var create: typeof easeIn;
    }
    module EaseOut {
        var create: typeof easeOut;
    }
    module EaseInOut {
        var create: typeof easeInOut;
    }
    module EaseExponentialIn {
        var create: typeof easeExponentialIn;
    }
    module EaseExponentialOut {
        var create: typeof easeExponentialOut;
    }
    module EaseExponentialInOut {
        var create: typeof easeExponentialInOut;
    }
    module EaseQuadraticActionIn {
        var create: typeof easeQuadraticActionIn;
    }
    module EaseQuadraticActionOut {
        var create: typeof easeQuadraticActionOut;
    }
    module EaseQuadraticActionInOut {
        var create: typeof easeQuadraticActionInOut;
    }
    module EaseCubicActionIn {
        var create: typeof easeCubicActionIn;
    }
    module EaseCubicActionOut {
        var create: typeof easeCubicActionOut;
    }
    module EaseCubicInOut {
        var create: typeof easeCubicActionInOut;
    }
    module EaseQuarticActionIn {
        var create: typeof easeQuarticlActionIn;
    }
    module EaseQuarticActionOut {
        var create: typeof easeQuarticActionOut;
    }
    module EaseQuarticActionInOut {
        var create: typeof easeQuarticActionInOut;
    }
    module EaseQuinticActionIn {
        var create: typeof easeQuinticActionIn;
    }
    module EaseQuinticActionOut {
        var create: typeof easeQuinticActionOut;
    }
    module EaseQuinticActionInOut {
        var create: typeof easeQuinticActionInOut;
    }
    module CallFunc {
        var create: typeof callFunc;
    }
    module Animate {
        var create: typeof animate;
    }
    module Show {
        var create: typeof show;
    }
    module Hide {
        var create: typeof hide;
    }
    module Place {
        var create: typeof place;
    }
    module ToggleVisibility {
        var create: typeof toggleVisibility;
    }
    module JumpTo {
        var create: typeof jumpTo;
    }
    module JumpBy {
        var create: typeof jumpBy;
    }
    module Blink {
        var create: typeof blink;
    }
}
/**
 * License: see license.txt file
 */
declare module cc {
    import Color = cc.math.Color;
    import Vector = cc.math.Vector;
    function rect(x: number, y: number, w: number, h: number): cc.math.Rectangle;
    /**
     * Create a new Point/Vector object.
     * @param x {number}
     * @param y {number}
     * @returns {cc.math.Vector}
     * @deprecated call <code>new cc.math.Vector(x,y);</code>
     * @see {cc.math.Vector}
     */
    function p(x: number, y: number): Vector;
    function size(w: number, h: number): math.Dimension;
    /**
     * create a new Color full opaque.
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @returns {cc.math.Color}
     * @deprecated call <code>new cc.math.Color(r,g,b,a?);</code>
     * @see {cc.math.Color}
     */
    function c3b(r: number, g: number, b: number): Color;
    /**
     * create a new Color with RGBA
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @param a {number}
     * @returns {cc.math.Color}
     * @deprecated call <code>new cc.math.Color(r,g,b,a);</code>
     * @see {cc.math.Color}
     */
    function c4b(r: number, g: number, b: number, a: number): Color;
    /**
     *
     * @param r {number|string|{r:number,g:number,b:number,a:number=}}
     * @param g {number} 0..255
     * @param b {number} 0..255
     * @param a {number=} 0..255
     * @returns {*}
     */
    function color(r: any, g: number, b: number, a?: number): Color;
    /**
     * @name Director
     * @memberOf cc
     * @deprecated
     */
    module Director {
        /**
         * Get always the same director instance.
         * @method cc.Director.getInstance
         * @returns {cc.node.Director}
         */
        function getInstance(): node.Director;
    }
    var director: cc.node.Director;
    function scene(): node.Scene;
    var Scene: typeof node.Scene;
    function animation(): node.sprite.Animation;
    function sprite(p: any): node.Sprite;
    var Sprite: typeof node.Sprite;
    var SpriteBatchNode: typeof node.SpriteBatchNode;
    function layer(): node.Node;
    var Layer: typeof node.Node;
    var Node: typeof node.Node;
    var LabelBMFont: typeof widget.Label;
    var LabelTTF: typeof widget.LabelTTF;
    function Animation(frames: cc.node.sprite.SpriteFrame[], duration: number): node.sprite.Animation;
    var TransitionSlideInL: (time_in_secs: number, scene?: node.Scene) => transition.TransitionSlideInL;
    var TransitionSlideInR: (time_in_secs: number, scene?: node.Scene) => transition.TransitionSlideInR;
    var TransitionSlideInT: (time_in_secs: number, scene?: node.Scene) => transition.TransitionSlideInT;
    var TransitionSlideInB: (time_in_secs: number, scene?: node.Scene) => transition.TransitionSlideInB;
    var TransitionFade: (time_in_secs: number, scene?: node.Scene) => transition.TransitionFade;
    var TEXT_ALIGNMENT_LEFT: number;
    var TEXT_ALIGNMENT_CENTER: number;
    var TEXT_ALIGNMENT_RIGHT: number;
    var VERTICAL_TEXT_ALIGNMENT_TOP: number;
    var VERTICAL_TEXT_ALIGNMENT_CENTER: number;
    var VERTICAL_TEXT_ALIGNMENT_BOTTOM: number;
    var pAdd: typeof Vector.add;
    function clampf(value: any, min_inclusive: any, max_inclusive: any): any;
    function pClamp(p: any, min_inclusive: any, max_inclusive: any): Vector;
    var audioEngine: {
        playMusic: (url: any) => void;
        stopMusic: () => void;
        stopAllEffects: () => void;
        playEffect: (name: any) => void;
        setMusicVolume: (vol: any) => void;
    };
    function rectIntersectsRect(r0: cc.math.Rectangle, r1: cc.math.Rectangle): boolean;
    var KEY: {
        0: number;
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        enter: number;
        backspace: number;
        tab: number;
        shift: number;
        ctrl: number;
        alt: number;
        pause: number;
        capslock: number;
        escape: number;
        pageup: number;
        pagedown: number;
        end: number;
        home: number;
        left: number;
        up: number;
        right: number;
        down: number;
        insert: number;
        "delete": number;
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
        g: number;
        h: number;
        i: number;
        j: number;
        k: number;
        l: number;
        m: number;
        n: number;
        o: number;
        p: number;
        q: number;
        r: number;
        s: number;
        t: number;
        u: number;
        v: number;
        w: number;
        x: number;
        y: number;
        z: number;
        command: number;
        meta: number;
        select: number;
        rcommand: number;
        numpad0: number;
        numpad1: number;
        numpad2: number;
        numpad3: number;
        numpad4: number;
        numpad5: number;
        numpad6: number;
        numpad7: number;
        numpad8: number;
        numpad9: number;
        multiply: number;
        add: number;
        subtract: number;
        decimalpoint: number;
        divide: number;
        f1: number;
        f2: number;
        f3: number;
        f4: number;
        f5: number;
        f6: number;
        f7: number;
        f8: number;
        f9: number;
        f10: number;
        f11: number;
        f12: number;
        numlock: number;
        scrolllock: number;
        semicolon: number;
        equalsign: number;
        comma: number;
        dash: number;
        period: number;
        forwardslash: number;
        graveaccent: number;
        openbracket: number;
        backslash: number;
        closebracket: number;
        singlequote: number;
        commandright: number;
    };
    var ONE: number;
    var ZERO: number;
    var SRC_ALPHA: number;
    var SRC_ALPHA_SATURATE: number;
    var SRC_COLOR: number;
    var DST_ALPHA: number;
    var DST_COLOR: number;
    var ONE_MINUS_SRC_ALPHA: number;
    var ONE_MINUS_SRC_COLOR: number;
    var ONE_MINUS_DST_ALPHA: number;
    var ONE_MINUS_DST_COLOR: number;
    var ONE_MINUS_CONSTANT_ALPHA: number;
    var ONE_MINUS_CONSTANT_COLOR: number;
}
declare module cc {
    class spriteFrameCache {
        static addSpriteFrames(plist_url_file: any): void;
        static getSpriteFrame(name: string): node.sprite.SpriteFrame;
    }
    class textureCache {
        static addImage(name: string): cc.render.Texture2D;
    }
    class animationCache {
        static addAnimation(animation: cc.node.sprite.Animation, name: string): void;
        static getAnimation(name: string): cc.node.sprite.Animation;
    }
}
/**
 * License: see license.txt file.
 */
declare module cc {
    var Class: any;
}
