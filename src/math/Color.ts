/**
 * License: see license.txt file.
 */


module cc.math {

    "use strict";

    /**
     * @class cc.math.RGBAColor
     * @interface
     * @classdesc
     *
     * Interface for a RGB color with optional alpha value.
     * <br>
     * It is expected that r,g,b,a color components be normalized values [0..1]
     */
    export interface RGBAColor {
        /**
         * Color red component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        r : number;
        /**
         * Color green component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        g : number;
        /**
         * Color blue component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        b : number;
        /**
         * Color alpha component.
         * @member cc.math.RGBAColor#r
         * @type {number}
         */
        a? : number;
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
    export class Color  {

        /**
         * Should rebuild canvas string representation cache ?
         * @member cc.math.Color#_dirty
         * @type {boolean}
         * @private
         */
        _dirty : boolean = true;

        /**
         * Should rebuild hex string representation cache ?
         * @member cc.math.Color#_dirtyHex
         * @type {boolean}
         * @private
         */
        _dirtyHex : boolean = true;

        /**
         * Color components.
         * @member cc.math.Color#_color
         * @type {Float32Array}
         * @private
         */
        _color : Float32Array;

        /**
         * cached canvas rgba string representation.
         * @member cc.math.Color#_fillStyle
         * @type {string}
         * @private
         */
        _fillStyle : string;

        /**
         * cached hex string representation.
         * @member cc.math.Color#_hexRGB
         * @type {string}
         * @private
         */
        _hexRGB : string;

        /**
         * cached hex rgba string representation.
         * @member cc.math.Color#_hexRGBA
         * @type {string}
         * @private
         */
        _hexRGBA : string;


        /**
         * Instantiate a color.
         * @method cc.math.Color#constructor
         * @param r {number} 0..1
         * @param g {number} 0..1
         * @param b {number} 0..1
         * @param a {number} 0..1
         */
        constructor( r : number=1, g : number = 1, b : number = 1, a : number = 1) {
            this._color= new Float32Array(4);
            this._color[0]= r;
            this._color[1]= g;
            this._color[2]= b;
            this._color[3]= a;
        }

        /**
         * Get the color's RGB representation.
         * @method cc.math.Color#getHexRGB
         * @returns {string} "#RRGGBB" color representation
         */
        getHexRGB() : string {

            if (this._dirtyHex) {
                this.__calculateHexStyle();
            }

            return this._hexRGB;
        }

        /**
         * Get the color's RGB representation.
         * @method cc.math.Color#getHexRGBA
         * @returns {string} "#RRGGBBAA" color representation
         */
        getHexRGBA() : string {
            if ( this._dirtyHex ) {
                this.__calculateHexStyle();
            }

            return this._hexRGBA;
        }

        /**
         * Internal helper to calculate hex string color representation.
         * @method cc.math.Color#__calculateHexStyle
         * @private
         */
        __calculateHexStyle() : void {
            var r= ((255*this._color[0])>>0).toString(16).toUpperCase();
            var g= ((255*this._color[1])>>0).toString(16).toUpperCase();
            var b= ((255*this._color[2])>>0).toString(16).toUpperCase();

            this._hexRGB= "#"+
                    (r.length<2 ? "0" : "")+r+
                    (g.length<2 ? "0" : "")+g+
                    (b.length<2 ? "0" : "")+b;

            var a= ((255*this._color[3])>>0).toString(16).toUpperCase();
            this._hexRGBA=  this._hexRGB + (a.length<2 ? "0" : "")+a;
        }

        /**
         * Internal helper to calculate canvas string color representation.
         * @method cc.math.Color#__calculateFillStyle
         * @private
         */
        __calculateFillStyle() : void {
            this._fillStyle = "rgba(" +
                    ((this._color[0] * 255) >> 0) + "," +
                    ((this._color[1] * 255) >> 0) + "," +
                    ((this._color[2] * 255) >> 0) + "," +
                      this._color[3] +
                    ")";

            this._dirty= false;
        }

        /**
         * Get the color's canvas string representation.
         * If color changed, the string will be recalculated.
         * @method cc.math.Color#getFillStyle
         * @returns {string}
         */
        getFillStyle() : string {
            if ( this._dirty ) {
                this.__calculateFillStyle();
            }
            return this._fillStyle;
        }

        /**
         * Get red color component.
         * @name cc.math.Color#get:r
         * @type {number}
         */
        get r() : number {
            return this._color[0];
        }

        /**
         * Set red color component.
         * @name cc.math.Color#set:r
         * @param v {number} red component. Should be in the range 0..1
         */
        set r(v : number) {
            this._color[0]= v;
            this._dirty= true;
            this._dirtyHex= true;
        }

        /**
         * Get green color component.
         * @name cc.math.Color#get:g
         * @type {number}
         */
        get g() : number {
            return this._color[1];
        }

        /**
         * Set green color component.
         * @name cc.math.Color#set:g
         * @param v {number} green component. Should be in the range 0..1
         */
        set g(v : number) {
            this._color[1]= v;
            this._dirty= true;
            this._dirtyHex= true;
        }

        /**
         * Get blue color component.
         * @name cc.math.Color#get:b
         * @type {number}
         */
        get b() : number {
            return this._color[2];
        }

        /**
         * Set blue color component.
         * @name cc.math.Color#set:b
         * @param v {number} blue component. Should be in the range 0..1
         */
        set b(v : number) {
            this._color[2]= v;
            this._dirty= true;
            this._dirtyHex= true;
        }

        /**
         * Get alpha color component.
         * @name cc.math.Color#get:a
         * @type {number}
         */
        get a() : number {
            return this._color[3];
        }

        /**
         * Set alpha color component.
         * @name cc.math.Color#set:a
         * @param v {number} alpha component. Should be in the range 0..1
         */
        set a(v : number) {
            this._color[3]= v;
            this._dirty= true;
            this._dirtyHex= true;
        }

        static createFromRGBA( c : string ) : Color;
        static createFromRGBA( c : RGBAColor ) : Color;

        /**
         * Crate a Color instance from r,g,b,a or string or RGBAColor
         * @method cc.math.Color.createFromRGBA
         * @param r {cc.math.RGBAColor | string | number} if number, red color component. otherwise, color
         *      representation in string or cc.math.RGBAColor
         * @param g {number=} Color green component,
         * @param b {number=} Color blue component,
         * @param a {number=} Color alpha component,
         * @returns {cc.math.Color}
         */
        static createFromRGBA( r : any, g? : number, b?: number, a? : number ) : Color {
            if ( typeof r === "object" ) {
                var c= <RGBAColor>r;
                return new Color( c.r/255, c.g/255, c.b/255, c.a/255 );
            } else if (typeof r === "number" ) {
                return new Color(r / 255, g / 255, b / 255, a / 255);
            } else if (typeof r === "string" ) {
                return Color.fromStringToColor(r);
            }

            return Color.WHITE;
        }

        /**
         * Parse a color of the from rgb(rrr,ggg,bbb) or rgba(rrr,ggg,bbb,a)
         * This method assumes the color parameter starts with rgb or rgba
         * @method cc.math.Color.fromRGBStringToColor
         * @param color {string}
         */
        static fromRGBStringToColor( color : string ) {
            color= color.toLowerCase();

            var skip= 4;
            if (color.indexOf("rgba")===0) {
                skip=5;
            }

            color= color.substring( skip, color.length-1 );
            var colors= color.split(",");

            var c;
            if ( colors.length===3 ) {
                c= new Color( parseInt(colors[0])/255,parseInt(colors[1])/255,parseInt(colors[2])/255 );
            } else {
                c= new Color( parseInt(colors[0])/255,parseInt(colors[1])/255,parseInt(colors[2])/255, parseInt(colors[3]) );
            }
            return c;
        }

        /**
         * Parse a CSS color. If the color is not recognizable will return MAGENTA;
         * @method cc.math.Color.fromStringToColor
         * @param hex {string} of the form RGB, RGBA, RRGGBB, RRGGBBAA, #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb(rrr,ggg,bbb), rgba(rrr,ggg,bbb,a)
         * @returns {cc.math.Color}
         */
        static fromStringToColor( hex : string ) : Color {

            hex= hex.toLowerCase();

            if ( hex.indexOf("rgb")===0 || hex.indexOf("rgba")===0 ) {
                return Color.fromRGBStringToColor(hex);
            }

            if ( hex.charAt(0)==="#") {
                hex = hex.substring(1);
            }

            if ( hex.length!==3 && hex.length!==4 && hex.length!==6 && hex.length!==8 ) {
                return Color.MAGENTA;
            }

            var r,g,b,a;

            if ( hex.length<6 ) {
                r= parseInt(hex.charAt(0), 16);
                g= parseInt(hex.charAt(1), 16);
                b= parseInt(hex.charAt(2), 16);

                if ( hex.length===4 ) {
                    a= parseInt(hex.charAt(3), 16);
                } else {
                    a= 15;
                }

                return new Color( r/15,g/15,b/15,a/15 );

            } else {
                r= parseInt(hex.substring(0,2), 16);
                g= parseInt(hex.substring(2,4), 16);
                b= parseInt(hex.substring(4,6), 16);

                // ALPHA
                if ( hex.length===8 ) {
                    a= parseInt(hex.substring(6,8), 16);
                } else {
                    a= 255;
                }

                return new Color( r/255.0,g/255.0,b/255.0,a/255.0 );
            }
        }

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
        static HSV( c:cc.math.Color, H:number, S:number, V:number ) : Color {

            var VSU:number = V*S*Math.cos(H*Math.PI/180);
            var VSW:number = V*S*Math.sin(H*Math.PI/180);

            var r = (.299*V+.701*VSU+.168*VSW)*c.r +
                (.587*V-.587*VSU+.330*VSW)*c.g +
                (.114*V-.114*VSU-.497*VSW)*c.b;
            var g = (.299*V-.299*VSU-.328*VSW)*c.r +
                (.587*V+.413*VSU+.035*VSW)*c.g +
                (.114*V-.114*VSU+.292*VSW)*c.b;
            var b = (.299*V-.3*VSU+1.25*VSW)*c.r +
                (.587*V-.588*VSU-1.05*VSW)*c.g +
                (.114*V+.886*VSU-.203*VSW)*c.b;

            c.r= r;
            c.g= g;
            c.b= b;
            return c;
        }

        /**
         * Transparent black color.
         * @member cc.math.Color.TRANSPARENT_BLACK
         * @type {cc.math.Color}
         */
        static TRANSPARENT_BLACK : Color= new Color(0,0,0,0);

        /**
         * Opaque black color.
         * @member cc.math.Color.BLACK
         * @type {cc.math.Color}
         */
        static BLACK : Color= new Color(0,0,0,1.0);

        /**
         * Opaque red color.
         * @member cc.math.Color.RED
         * @type {cc.math.Color}
         */
        static RED : Color= new Color(1.0,0,0,1.0);

        /**
         * Opaque green color.
         * @member cc.math.Color.GREEN
         * @type {cc.math.Color}
         */
        static GREEN : Color= new Color(0,1.0,0,1.0);

        /**
         * Opaque blue color.
         * @member cc.math.Color.BLUE
         * @type {cc.math.Color}
         */
        static BLUE : Color= new Color(0,0,1.0,1.0);

        /**
         * Opaque white color.
         * @member cc.math.Color.WHITE
         * @type {cc.math.Color}
         */
        static WHITE : Color= new Color(1.0,1.0,1.0,1.0);

        /**
         * Opaque magenta color.
         * @member cc.math.Color.MAGENTA
         * @type {cc.math.Color}
         */
        static MAGENTA : Color= new Color(1.0,0,1.0,1.0);

        /**
         * Opaque yellow color.
         * @member cc.math.Color.YELLOW
         * @type {cc.math.Color}
         */
        static YELLOW : Color= new Color(1.0,1.0,0,1.0);

        /**
         * Opaque cyan color.
         * @member cc.math.Color.CYAN
         * @type {cc.math.Color}
         */
        static CYAN : Color= new Color(0,1.0,1.0,1.0);

    }
}