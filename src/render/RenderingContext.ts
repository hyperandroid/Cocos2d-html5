/**
 * License: see license.txt file.
 */

/// <reference path="../math/Color.ts"/>
/// <reference path="../render/Texture2D.ts"/>

module cc.render {

    import Color= cc.math.Color;

    "use strict";

    export var RENDERER_TYPE_CANVAS:number = 1;
    export var RENDERER_TYPE_WEBGL:number = 0;

    /**
     * @class cc.render.Pattern
     * @classdesc
     *
     * Pattern fill info.
     *
     */
    export class Pattern {

        _texture: Texture2D= null;
        _type: string= "repeat";

        constructor( texture:cc.render.Texture2D, type:string ) {
            this._texture= texture;
            this._type= type;
        }

        get texture() : Texture2D {
            return this._texture;
        }

        get type() : string {
            return this._type;
        }
    }

    export enum CompositeOperation {
        source_over= 0,
        source_out=1,
        source_in=2,
        source_atop=3,
        destination_over=4,
        destination_in=5,
        destination_out=6,
        destination_atop= 7,
        multiply=8,
        screen=9,
        copy=10,
        lighter=11,
        darker=12,
        xor=13,
        add=14
    }

    export var CanvasToComposite= {
        "source-over": 0,
        "source-out": 1,
        "source-in": 2,
        "source-atop": 3,
        "destination-over": 4,
        "destination-in": 5,
        "destination-out": 6,
        "destination-atop": 7,
        "multiply": 8,
        "screen": 9,
        "copy": 10,
        "lighter": 11,
        "darker": 12,
        "xor": 13,
        "add": 14
    };

    export var CompositeOperationToCanvas= [
        "source-over",
        "source-out",
        "source-in",
        "source-atop",
        "destination-over",
        "destination-in",
        "destination-out",
        "destination-atop",
        "multiply",
        "screen",
        "copy",
        "lighter",
        "darker",
        "xor",
        "lighter"   // should be add, but does not exist.
    ];

    export enum LineCap {
        BUTT, SQUARE, ROUND
    }

    /**
     * @enum
     * 
     */
    export enum LineJoin {
        BEVEL, MITER, ROUND
    }

    /**
     * @class cc.render.RenderingContext
     * @interface
     * @classdesc
     *
     * A RenderingContext is a high level API for paint code execution. Normally, this paint code will be wrapped in a
     * <code>cc.node.Node</code>'s <code>draw</code> method. This allows arbitrary drawing capabilities per node which
     * is a big game changer from previous engine implementations where Node specialization at drawing forced composition
     * for custom draw.
     * <p>
     * While the <code>cc.render.CanvasRenderer</code> will mostly proxy to the under-laying
     * <code>CanvasRenderingContext2D</code>, the <code>cc.render.WebGLRenderer</code> will do extra to achieve
     * to aim at visual consistency with its canvas counterpart. This webgl implementation will allow for:
     *   <li>stroking and filling paths with color, patterns and gradients
     *   <li>use custom shader per quad
     *   <li>image slicing
     *   <li>rendering context save and restore
     *
     * <h4>Path</h4>
     * <p>
     * The rendering context has support for path stroke or fill operations. Internally, these operations are backed by
     * a path implementation <code>cc.math.Path</code>. The path, is composed by a collection of contours (basically
     * each time <code>moveTo</code> is called a new contour is created) and each contour is a collection of
     * <code>cc.math.path.Segment</code> objects. Calls to <code>lineTo</code> or <code>QuadraticCurveTo</code> create
     * segments and contour creation is automatically done.
     * <p>
     * The segment creation operations are incremental. In order to avoid leaking, a call to <code>beginPath</code>
     * must be performed to start with a new fresh path. The rendering context <code>cc.math.Path</code> object is not
     * reset per frame, it is something the developer must do on its own.
     * <p>
     * Each segment operation will automatically be modified by the current transformation matrix.
     * <p>
     * The Path object can manually created and stroked/filled for later fast stroke/fill operations.
     *
     * <h4>Transformation</h4>
     * At any given time, all rendering context operations can be transformed by a cumulative transformation matrix.
     * Calls to <code>translate</code>, <code>rotate</code> and <code>scale</code>, will
     * indistinctly affect path tracing/filling, image drawing, line width, text, pattern and gradient projection space,
     * etc.
     * <p>
     * The tansformation is not reset by the system at any time. It is developers responsibility to either make a call
     * to <code>setTransform(1,0,0,1,0,0)</code> or make appropriate <code>save</code>/<code>restore</code> calls.
     */
    export interface RenderingContext {

        /**
         * Renderer surface (canvas object)
         * @member cc.render.RenderingContext#canvas
         * @type {HTMLCanvasElement}
         */
        canvas : HTMLCanvasElement;

        /**
         * Set draw operations tint color.
         * The tinting only makes sense in a WebGL renderer.
         * @param color {cc.math.Color}
         * @method cc.render.RenderingContext#setTintColor
         */
        setTintColor( color:Color );

        /**
         * Set a global transparency value.
         * @param alpha {number} value between 0 and 1. 0 is full transparent and 1 is full opaque.
         * @method cc.render.RenderingContext#setGlobalAlpha
         */
        setGlobalAlpha( alpha: number );

        /**
         * Get the global transparency value.
         * @method cc.render.RenderingContext#getGlobalAlpha
         * @return number
         */
        getGlobalAlpha( ) : number;

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
        setTransform( a : number, b: number, c : number, d: number, tx : number, ty : number );

        /**
         * Concatenate the matrix described by a,b,c,d,tx,ty with the current transformation matrix.
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        transform( a : number, b: number, c : number, d: number, tx : number, ty : number );

        /**
         * Fill a rect with the current fillStyle.
         * @method cc.render.RenderingContext#fillRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        fillRect( x : number, y :number, w : number, h : number );

        /**
         * Draw an image.
         * This method can be called in 3 different ways:
         *
         * <li>3 parameters</li>
         * This will draw the whole texture at its actual size at the given sx,sy position.
         * <li>5 parameters</li>
         * This will draw the whole texture size at the given sx,sy position but at the size specified by sw,sh.
         * <li>9 parameters</li>
         * This will draw a source rectangle of the texture defined by sx,sy,sw,sh in the destination rectangle defined
         * by dx,dy,dw,dh.
         *
         * <p>
         * This method honors the current transformation matrix and will be safe to perform new drawing operations after
         * calling it.
         *
         * @param texture {cc.render.Texture2D}
         * @param sx {number}
         * @param sy {number}
         * @param sw {number=}
         * @param sh {number=}
         * @param dx {number=}
         * @param dy {number=}
         * @param dw {number=}
         * @param dh {number=}
         *
         * @method cc.render.RenderingContext#drawImage
         */
        drawTexture( texture:Texture2D, sx: number, sy:number, sw?:number, sh?:number, dx?: number, dy?:number, dw?:number, dh?:number  ) : void;

        /**
         * Draw an image.
         * This method can be called in 3 different ways:
         *
         * <li>3 parameters</li>
         * This will draw the whole texture at its actual size at the given sx,sy position.
         * <li>5 parameters</li>
         * This will draw the whole texture size at the given sx,sy position but at the size specified by sw,sh.
         * <li>9 parameters</li>
         * This will draw a source rectangle of the texture defined by sx,sy,sw,sh in the destination rectangle defined
         * by dx,dy,dw,dh.
         *
         * <p>
         * This method <b>does not</b> may leave the current transformation matrix in the wrong state, and you may get
         * not the expected results after calling new drawTexture/drawTextureUnsafe operations.
         * <p>
         * For a webgl renderer, this method is much faster than calling <code>drawTexture</code>. In most cases,
         * like an sprite which just needs to draw a chunk of a texture in a destination rectangle, this method will
         * suffice.
         *
         * @param texture {cc.render.Texture2D}
         * @param sx {number}
         * @param sy {number}
         * @param sw {number=}
         * @param sh {number=}
         * @param dx {number=}
         * @param dy {number=}
         * @param dw {number=}
         * @param dh {number=}
         *
         * @method cc.render.RenderingContext#drawImageUnsafe
         */
        drawTextureUnsafe( texture:Texture2D, sx: number, sy:number, sw?:number, sh?:number, dx?: number, dy?:number, dw?:number, dh?:number  ) : void;

        /**
         * Clear the current renderer surface.
         * @method cc.render.RenderingContext#clear
         */
        clear();

        /**
         * Flush current renderer. This method only makes sense for WebGL, the canvas implementation is empty.
         * A call to this method must be done in a WebGL renderer to have content shown in the canvas.
         * If running inside the engine, this method is called automatically.
         * @method cc.render.RenderingContext#flush
         */
        flush();

        /**
         * Rotate the current rendering context matrix by radians.
         * @method cc.render.RenderingContext#rotate
         * @param angleInRadians {number} radians to rotate
         */
        rotate( angleInRadians : number );

        /**
         * Translate the current rendering context.
         * @method cc.render.RenderingContext#translate
         * @param x {number}
         * @param y {number}
         */
        translate( x:number, y:number );

        /**
         * Scale the current rendering context.
         * @method cc.render.RenderingContext#scale
         * @param x {number}
         * @param y {number}
         */
        scale( x:number, y:number );

        /**
         * Get the rendering area width in pixels.
         * @method cc.render.RenderingContext#getWidth
         */
        getWidth() : number;

        /**
         * Get the rendering area height in pixels.
         * @method cc.render.RenderingContext#getWidth
         */
        getHeight() : number;

        /**
         * Get the renderer type. A value from cc.render.RENDERER_TYPE_CANVAS | cc.render.RENDERER_TYPE_WEBGL
         * @type {number}
         * @member cc.render.RenderingContext#type
         */
        type : number;

        /**
         * Save the current RenderingContext status. It clones the associated <code>cc.render.RenderingContextSnapshot</code>.
         * @method cc.render.RenderingContext#save
         */
        save() : void;

        /**
         * Restore a previously saved RenderingContext status.
         * It clones the associated <code>cc.render.RenderingContextSnapshot</code>.
         * @method cc.render.RenderingContext#restore
         */
        restore() : void;

        /**
         * Stroke (trace contour) of the current rendering context's state path.
         * The path is tracked internally in a <code>cc.math.Path</code> object.
         * The trace of the path contour is modified by:
         *   <li>current transformation matrix
         *   <li>line width
         *   <li>line join
         *   <li>line cap
         *   <li>line join miter limit
         *
         * @method cc.render.RenderingContext#stroke
         */
        stroke();

        /**
         * Fill the current rendering context's state path.
         * The path is tracked internally in a <code>cc.math.Path</code> object.
         * The fill is performed by a basic tessellation process. Self intersecting path contours won't be appropriately
         * displayed.
         * <b>This method may not be consistent between canvas and webgl renderers</b>
         *
         * @method cc.render.RenderingContext#fill
         */
        fill();

        /**
         * Fill a <code>cc.math.Path</code> object.
         * @param path
         */
        fillPath( path:cc.math.Path );

        /**
         * Stroke a <code>cc.math.Path</code> object.
         * @param path
         */
        strokePath( path:cc.math.Path );

        /**
         * The the current rendering context to reset the internal path representation.
         * This method should be called to start a fresh path tracing/filling operation.
         *
         * This operation will be affected by the current transformation matrix.
         *
         * @method cc.render.RenderingContext#beginPath
         */
        beginPath();

        /**
         * Move the path tracer position.
         * @param x {number}
         * @param y {number}
         *
         * @method cc.render.RenderincContext#moveTo
         */
        moveTo(x:number, y:number);

        /**
         * Add a line from the current path position to the desired position.
         * This operation will be affected by the current transformation matrix.
         *
         * @param x {number}
         * @param y {number}
         * @method cc.render.RenderingContext#lineTo
         */
        lineTo(x:number, y:number);

        /**
         * Add a cubic bezier from the current path position defined by the two control points and the final curve point.
         *
         * @param cp0x {number} first control point x position
         * @param cp0y {number} first control point y position
         * @param cp1x {number} second control point x position
         * @param cp1y {number} second control point y position
         * @param p2x {number} second curve point x position
         * @param p2y {number} second curve point y position
         *
         * This operation will be affected by the current transformation matrix.
         *
         * @method cc.render.RenderingContext#bezierCurveTo
         */
        bezierCurveTo( cp0x:number, cp0y:number, cp1x:number, cp1y:number, p2x:number, p2y:number );

        /**
         * Add a quadratic bezier from the current path position defined by one control point and the final curve point.
         *
         * @param cp0x {number} control point x position
         * @param cp0y {number} control point y position
         * @param p2x {number} second curve point x position
         * @param p2y {number} second curve point y position
         *
         * This operation will be affected by the current transformation matrix.
         *
         * @method cc.render.RenderingContext#quadraticCurveTo
         */
        quadraticCurveTo( cp0x:number, cp0y:number, p2x:number, p2y:number );

        /**
         * Create a new rectangular closed contour on the current path.
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         *
         * This operation will be affected by the current transformation matrix.
         *
         * @method cc.render.RenderingContext#rect
         */
        rect( x:number, y:number, width:number, height:number );

        /**
         * Add an arc segment to the current path.
         * The arc will be drawn as the least angle difference between startAngle and endAngle. This means that if an arc
         * is defined from 0 to 100*PI radians, the arc will actually be from 0 to 2*PI radians.
         *
         *
         * @param x {number} arc center x position
         * @param y {number} arc center y position
         * @param radius {number} arc radius
         * @param startAngle {number} arc start angle
         * @param endAngle {number} arc end angle
         * @param counterClockWise {boolean} if true the arc will be complimentary arc from the original one.
         *
         * This operation will be affected by the current transformation matrix.
         *
         * @method cc.render.RenderingContext#arc
         */
        arc( x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise:boolean );

        arcTo( x1:number, y1:number, x2:number, y2:number, radius:number );

        /**
         * Close the current contour on the current path.
         * Successive path operations will create a new contour.
         *
         * This operation will be affected by the current transformation matrix.
         *
         * @method cc.render.RenderingContext#closePath
         */
        closePath();

        /**
         * Set the current path line cap. This call will have effect when a call to <code>stroke</code> is performed.
         * @param cap {cc.render.LineCap}
         *
         * @method cc.render.RenderingContext#setLineCap
         */
        setLineCap( cap:LineCap );

        /**
         * Get the current line cap.
         *
         * @method cc.render.RenderingContext#getLineCap
         * @return cc.render.LineCap
         */
        getLineCap() : LineCap;

        /**
         * Set the current path line join. This call will have effect when a call to <code>stroke</code> is performed.
         * @param join {cc.render.LineJoin}
         *
         * @method cc.render.RenderingContext#setLineJoin
         */
        setLineJoin( join:LineJoin );

        /**
         * Get the current line join.
         *
         * @method cc.render.RenderingContext#getLineJoin
         * @return cc.render.LineJoin
         */
        getLineJoin() : LineJoin;

        /**
         * Set the line width for stroking a path.
         * The lineWidth will be affected by the current transformation matrix.
         *
         * @param w {number} desired line width. 1 by default.
         * @method cc.render.RenderingContext#setLineWidth
         */
        setLineWidth( w:number );

        /**
         * Get the current line width.
         *
         * @method cc.render.RenderingContext#getLineWidth
         * @return number
         */
        getLineWidth() : number;

        /**
         * Set fill operations color.
         *
         * @param color {cc.math.Color}
         * @method cc.render.RenderingContext#setFillStyleColor
         */
        setFillStyleColor( color:Color );

        /**
         * Set fill operations color.
         *
         * @param colorArray {Float32Array}
         * @method cc.render.RenderingContext#setFillStyleColorArray
         */
        setFillStyleColorArray( colorArray:Float32Array );

        /**
         * Set fill operations <code>cc.render.Pattern</code>.
         *
         * @param pattern {cc.render.Pattern}
         * @method cc.render.RenderingContext#setFillStylePattern
         */
        setFillStylePattern( pattern:cc.render.Pattern );

        /**
         * Set stroke operations color.
         *
         * @param color {cc.math.Color}
         * @method cc.render.RenderingContext#setStrokeStyleColor
         */
        setStrokeStyleColor( color:Color );

        /**
         * Set stroke operations color.
         *
         * @param colorArray {Float32Array}
         * @method cc.render.RenderingContext#setStrokeStyleColorArray
         */
        setStrokeStyleColorArray( colorArray:Float32Array );

        /**
         * Set stroke operations <code>cc.render.Pattern</code>.
         *
         * @param pattern {cc.render.Pattern}
         * @method cc.render.RenderingContext#setStrokeStylePattern
         */
        setStrokeStylePattern( pattern:cc.render.Pattern );

        /**
         * Set the appropriate fill style based on the parameter type.
         * This method is not the preferred way of setting a fill style.
         * Instead refer to the specific methods.
         * @method cc.render.RenderingContext#setFillStyle
         * @param style {object}
         */
        setFillStyle( style:any );

        /**
         * Set the appropriate stroke style based on the parameter type.
         * This method is not the preferred way of setting a fill style.
         * Instead refer to the specific methods.
         * @method cc.render.RenderingContext#setStrokeStyle
         * @param style
         */
        setStrokeStyle( style:any );

        /**
         * Resize the rendering context.
         * This method is internal and must never be called directly.
         *
         * @method cc.render.RenderingContext#resize
         */
        resize();

        /**
         * Get the units/pixels conversion ratio value.
         *
         * @method cc.render.RenderingContext#getUnitsFactor
         */
        getUnitsFactor():number;

        /**
         * Set current composite operation (blending mode).
         *
         * @param o {cc.render.CompositeOperation}
         * @method cc.render.RenderingContext#setCompositeOperation
         */
        setCompositeOperation( o:cc.render.CompositeOperation );

        /**
         * Get current composite operation (blending mode).
         *
         * @method cc.render.RenderingContext#getCompositeOperation
         * @return cc.render.CompositeOperation
         */
        getCompositeOperation() : cc.render.CompositeOperation;

        /**
         * Draw a mesh defined by geometry, texture coordinates and indices.
         * This method is expected to be used only in webgl. Current canvas renderer implementation will draw the mesh
         * itself and not the image.
         *
         * @param geometry {Float32Array} vertices geometry. <b>It expects 3 coords per vertex.</b>
         * @param uv {Float32Array} texture coordinates per vertex. 2 coords per vertex.
         * @param indices {Uint32Array} vertices indices.
         * @param color {number} a 32 bit encoded RGBA value. This will be a tint over the texture.
         * @param texture {cc.render.Texture2D} a texture.
         *
         * @method cc.render.RenderingContext#drawMesh
         */
        drawMesh( geometry:Float32Array, uv:Float32Array, indices:Uint32Array, color:number, texture:Texture2D );
    }

}