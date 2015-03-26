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

    export enum LineJoin {
        BEVEL, MITER, ROUND
    }

    /**
     * @class cc.render.RenderingContext
     * @interface
     * @classdesc
     *
     * Minimum rendering context interface. All nodes when a call to draw is done, whether in canvas or webgl,
     * will be able to use these functions.
     *
     */
    export interface RenderingContext {

        /**
         * Renderer surface (canvas object)
         * @member cc.render.RenderingContext#canvas
         * @type {HTMLCanvasElement}
         */
        canvas : HTMLCanvasElement;

        setTintColor( color:Color );

        setGlobalAlpha( alpha: number );
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
         * Concatenate the matrix described by coeficcients with the current transformation matrix.
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
         * @method cc.render.RenderingContext#drawImage
         * @param image {HTMLImageElement|HTMLCanvasElement}
         * @param x {number}
         * @param y {number}
         */
        drawTexture( texture:Texture2D, sx: number, sy:number, sw?:number, sh?:number, dx?: number, dy?:number, dw?:number, dh?:number  ) : void;
        drawTextureUnsafe( texture:Texture2D, sx: number, sy:number, sw?:number, sh?:number, dx?: number, dy?:number, dw?:number, dh?:number  ) : void;

        /**
         * Clear the current renderer surface.
         * @method cc.render.RenderingContext#clear
         */
        clear();

        /**
         * Flush current renderer. This method only makes sense for WebGL, the canvas implementation is empty.
         * A call to this method must be done in a WebGL renderer to have content shown in the canvas.
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

        getWidth() : number;
        getHeight() : number;

        type : number;

        save() : void;
        restore() : void;

        stroke();
        fill();

        beginPath();
        moveTo(x:number, y:number);
        lineTo(x:number, y:number);
        bezierCurveTo( cp0x:number, cp0y:number, cp1x:number, cp1y:number, p2x:number, p2y:number );
        quadraticCurveTo( cp0x:number, cp0y:number, p2x:number, p2y:number );
        rect( x:number, y:number, width:number, height:number );
        arc( x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise:boolean );
        closePath();
        setLineCap( cap:LineCap );
        getLineCap() : LineCap;
        setLineJoin( join:LineJoin );
        getLineJoin() : LineJoin;
        setLineWidth( w:number );
        getLineWidth() : number;

        setFillStyleColor( color:Color );
        setFillStyleColorArray( colorArray:Float32Array );
        setFillStylePattern( pattern:cc.render.Pattern );

        setStrokeStyleColor( color:Color );
        setStrokeStyleColorArray( colorArray:Float32Array );
        setStrokeStylePattern( pattern:cc.render.Pattern );

        resize();

        getUnitsFactor():number;

        setCompositeOperation( o:cc.render.CompositeOperation );
        getCompositeOperation() : cc.render.CompositeOperation;

        drawMesh( geometry:Float32Array, uv:Float32Array, indices:Uint32Array, color:number, texture:Texture2D );
    }

}