/**
 * License: see license.txt file.
 */

/// <reference path="../asset/AssetManager.ts"/>
/// <reference path="../../node/sprite/SpriteFrame.ts"/>
/// <reference path="../../render/RenderingContext.ts"/>
/// <reference path="../../render/Texture2D.ts"/>
/// <reference path="../../widget/Label.ts"/>
/// <reference path="./SpriteFontHelper.ts"/>

module cc.plugin.font {

    import SpriteFrame= cc.node.sprite.SpriteFrame;

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
    export interface SystemFontInitializer {

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
        characters:string;

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
        strokeSize?:number;

        /**
         * If the font is filled, this is a valid canvas fillStyle. If not set defaults to "#000".
         * @member cc.plugin.font.SystemFontInitializer#fillStyle
         * @type {any=}
         */
        fillStyle?:any;

        /**
         * If the font is stroked, this is a valid canvas strokeStyle. If not set defaults to "#000".
         * @member cc.plugin.font.SystemFontInitializer#fillStyle
         * @type {any=}
         */
        strokeStyle?:any;

        /**
         * A padding between characters and font texture lines.
         * In canvas, there's no kerning information, and some characters may not honor the maxAscend value.
         * If after building the font a characters shows pixels from other surrounding characters, increment the
         * padding.
         * Each font will have its own needs.
         * @member cc.plugin.font.SystemFontInitializer#padding
         * @type {number=}
         */
        padding?:number;
    }

    /**
     * @class cc.plugin.font.SpriteFontChar
     * @classdesc
     *
     * For a SpriteFont, this class represents a TextureFont character.
     * It contains information about its size and kerning.
     *
     */
    export class SpriteFontChar {

        /**
         * This numerical id is the charCode of a font character.
         * @member cc.plugin.font.SpriteFontChar#_id
         * @type {number}
         * @private
         */
        _id:number= null;

        /**
         * A SpriteFrame representing character texture information.
         * @member cc.plugin.font.SpriteFontChar#_frame
         * @type {cc.node.sprite.SpriteFrame}
         * @private
         */
        _frame:SpriteFrame= null;

        /**
         * Pixels to advance the cursor after typing this character.
         * @member cc.plugin.font.SpriteFontChar#_xadvance
         * @type {number}
         * @private
         */
        _xadvance:number= 0;

        /**
         * Horizontal offset to draw the character.
         * @member cc.plugin.font.SpriteFontChar#_xoffset
         * @type {number}
         * @private
         */
        _xoffset:number= 0;

        /**
         * Vertical offset to draw the character. this offset will make the character lie on the baseline.
         * @member cc.plugin.font.SpriteFontChar#_yoffset
         * @type {number}
         * @private
         */
        _yoffset:number= 0;

        /**
         * Kerning info.
         * @member cc.plugin.font.SpriteFontChar#_kerningInfo
         * @type {Map<string,number>}
         * @private
         */
        _kerningInfo:{ [char:string]: number; }= {};

        /**
         * Reference to the SpriteFont object this char belongs to.
         * @member cc.plugin.font.SpriteFontChar#_font
         * @type {cc.node.sprite.SpriteFont}
         * @private
         */
        _font:SpriteFont=null;

        /**
         * Create a new SpritFontChar object instance.
         * @method cc.plugin.font.SpriteFontChar#constructor
         */
        constructor( ) {
        }

        /**
         * Get the char width.
         * @member cc.plugin.font.SpriteFontChar#get:width
         * @returns {number}
         */
        get width() : number {
            return this._frame._rect.w;
        }

        /**
         * Set the char SpriteFont reference.
         * @member cc.plugin.font.SpriteFontChar#setFont
         * @param f {cc.plugin.font.SpriteFont}
         */
        setFont( f:SpriteFont ) {
            this._font= f;
        }

        /**
         * Set the char SpriteFrame.
         * @member cc.plugin.font.SpriteFontChar#setFrame
         * @param spriteFrame {cc.node.sprite.SpriteFrame}
         */
        setFrame( spriteFrame:SpriteFrame ) {
            this._frame= spriteFrame;
        }

        /**
         * Add kerning info for a given char.
         * @member cc.plugin.font.SpriteFontChar#addKerning
         * @param char {string} a single character string.
         * @param v {number} kerning value for the char parameter
         */
        addKerning( char:string, v:number ) {
            this._kerningInfo[char]= v;
        }

        /**
         * Draw a SpritFont character.
         * @member cc.plugin.font.SpriteFontChar#draw
         * @param ctx {cc.render.RenderingContext}
         * @param x {number}
         * @param y {number}
         * @param nextChar {string} next drawing character. needed for kerning adjustment.
         */
        draw( ctx:cc.render.RenderingContext, x:number, y:number, nextChar:string ) {

            if ( null===this._frame || this._frame._rect.isEmpty() ) {
                return;
            }

            if ( nextChar ) {
                var _kerning= this._kerningInfo[ nextChar ];
                if ( _kerning ) {
                    x+= _kerning;
                }
            }

            var rect= this._frame._rect;

            var _y;
            if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_TOP ) {
                _y= y + this._yoffset;
            } else {
                _y = y + this._font._height - (rect.h+this._yoffset);
            }

            ctx.drawTexture(
                this._frame.getTexture(),
                rect.x, rect.y, rect.w, rect.h,
                x + this._xoffset, _y, rect.w, rect.h);
        }

        /**
         * Create a SpriteFontChar from a SpriteFrame and some data definition.
         * @member cc.plugin.font.SpriteFontChar.createFrom
         * @param frame {cc.node.sprite.SpriteFrame} a sprite frame the character will be mapped to.
         * @param data {object} SpriteFontChar definition.
         * @returns {cc.plugin.font.SpriteFontChar}
         */
        static createFrom( frame:SpriteFrame, data:any ) : SpriteFontChar {

            var sfc= new SpriteFontChar();
            sfc._frame= frame.createSubSpriteFrame( data.x-2, data.y, data.width, data.height, data.id );
            if ( null===sfc._frame ) {
                cc.Debug.info( cc.locale.ERR_FONT_GLYPTH_NOT_IN_FRAME, data.id );
            }
            sfc._xadvance= data.xadvance||0;
            sfc._xoffset= data.xoffset||0;
            sfc._yoffset= data.yoffset||0;
            sfc._id= data.id;

            return sfc;
        }
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
    export class SpriteFont {

        /**
         * A font name of choice. This name will be used as the key for the SpriteFont cache.
         * @member cc.plugin.font.SpriteFont#_fontName
         * @type {string}
         * @private
         */
        _fontName:string= null;

        /**
         * Whether the font is valid for draw.
         * @member cc.plugin.font.SpriteFont#_valid
         * @type {boolean}
         * @private
         */
        _valid:boolean= false;

        /**
         * Collection of objects representing font characters.
         * @member cc.plugin.font.SpriteFont#_chars
         * @type {Map<string,SpriteFontChar>}
         * @private
         */
        _chars: { [char:string]: SpriteFontChar }= {};

        /**
         * Font height. The height is the height of every font character. Height is the result of ascent+descent.
         * @member cc.plugin.font.SpriteFont#_height
         * @type {number}
         * @private
         */
        _height:number=0;

        /**
         * Font baseline, corresponding to the alphabetic baseline.
         * @member cc.plugin.font.SpriteFont#_baseline
         * @type {number}
         * @private
         */
        _baseline:number=0;

        /**
         * Font ascent. Height of char area corresponding to the content above the baseline.
         * @member cc.plugin.font.SpriteFont#_descent
         * @type {number}
         * @private
         */
        _descent:number=0;

        /**
         * Font descent. Height of the char area correspoingind to the content below the baseline.
         * @member cc.plugin.font.SpriteFont#_ascent
         * @type {number}
         * @private
         */
        _ascent:number=0;

        /**
         * Create a new SpriteFont object instance.
         * @method cc.plugin.font.SpriteFont#constructor
         * @param name
         */
        constructor( name:string ) {
            this._fontName= name;
        }

        /**
         * Whether the font is valid.
         * @method cc.plugin.font.SpriteFont#isValid
         * @returns {boolean}
         */
        isValid() : boolean {
            return this._valid;
        }

        /**
         * Insert a SpriteFontChar in the font definition.
         * @method cc.plugin.font.SpriteFont#__addChar
         * @param obj {cc.plugin.font.SpriteFontChar}
         * @private
         */
        __addChar( obj:SpriteFontChar ) {
            obj.setFont( this );
            this._chars[String.fromCharCode(obj._id)]= obj;
        }

        /**
         * Create a font font a FNT file.
         * @method cc.plugin.font.SpriteFont#setAsGlypthDesigner
         * @param spriteFrameId {string} The name of a SpriteFrame in the AssetManager cache. The font characters
         *  will be mapped on the SpriteFrame represented by the id.
         * @param fontDef {string} a .fnt file contents.
         * @returns {cc.plugin.font.SpriteFont}
         */
        setAsFnt( spriteFrameId:string, fontDef:string ) :SpriteFont {
            return this.setAsGlypthDesigner( spriteFrameId, fontDef );
        }

        /**
         * Build the font from a glyph designer output file.
         * @method cc.plugin.font.SpriteFont#setAsGlypthDesigner
         * @param spriteFrameId {string} The name of a SpriteFrame in the AssetManager cache. The font characters 
         *  will be mapped on the SpriteFrame represented by the id.
         * @param fontDef {string} a glyph designed file contents.
         * @returns {cc.plugin.font.SpriteFont}
         */
        setAsGlypthDesigner( spriteFrameId:string, fontDef:string ) :SpriteFont {

            var f:SpriteFrame= cc.plugin.asset.AssetManager.getSpriteFrame(spriteFrameId);

            // remove tabs for spaces.
            var text= fontDef.split("\n");

            // iterate lines.
            for (var i = 0; i < text.length; i++) {

                text[i]= text[i].replace(/\t/gi," ");

                // parse a char
                if (0 === text[i].indexOf("char ")) {

                    var str = text[i].substring(5);
                    var pairs = str.split(' ');
                    var props= {};

                    for ( var j = 0; j < pairs.length; j++) {
                        var pair = pairs[j];

                        // skip empty split pairs which are just ""
                        if ( pair!=="" ) {
                            var pairData = pair.trim().split("=");

                            if (pairData[0] !== "page" && pairData[0] !== "chnl" && pairData[0] !== "letter") {
                                var property = pairData[0];
                                var value = pairData[1];
                                props[property] = parseFloat(value);
                            }
                        }
                    }

                    this.__addChar( SpriteFontChar.createFrom( f, props ) );

                } else if ( 0=== text[i].indexOf("kerning ") ) {

                    // parse kerning info.

                    var str= text[i].substring(8);
                    var pairs= str.trim().split(' ');
                    for( var j=0; j< pairs.length; j++ ) {
                        var first=  pairs[0].split('=')[1];
                        var second= pairs[1].split('=')[1];
                        var amount= pairs[2].split('=')[1];

                        var char= this._chars[ String.fromCharCode(parseInt(first)) ];
                        if ( char ) {
                            char.addKerning( String.fromCharCode(parseInt(second)), parseInt(amount) );
                        }
                    }
                } else if ( 0=== text[i].indexOf("common")) {

                    // parse font definition info

                    var str= text[i].substring(7);
                    var pairs= str.trim().split(' ');
                    for( var j=0; j< pairs.length; j++ ) {
                        var vv= pairs[j].split("=");
                        var key= vv[0];
                        value= vv[1];

                        if ( key==="lineHeight" ) {
                            this._height= parseFloat(value);
                        } else if ( key==="base" ) {
                            this._baseline= parseFloat(value);
                            this._descent= this._height-this._baseline;
                        }
                    }
                } else if ( 0=== text[i].indexOf("info")) {

                }
            }

            this._valid= true;

            return this;
        }

        /**
         * Build the font from a systm font object initializer.
         * @method cc.plugin.font.SpriteFont#setAsSystemFont
         * @param fontDef {cc.plugin.font.SystemFontInitializer} font definition
         * @returns {cc.plugin.font.SpriteFont}
         */
        setAsSystemFont( fontDef:SystemFontInitializer ) : SpriteFont {

            if ( typeof fontDef.fontface==="undefined" ) {
                fontDef.fontface="arial";
            }
            if ( typeof fontDef.size==="undefined") {
                fontDef.size= 20;
            }

            fontDef.padding= fontDef.padding||2;
            fontDef.strokeSize=fontDef.strokeSize||1;
            fontDef.strokeStyle= fontDef.strokeStyle || "#000";
            fontDef.fillStyle= fontDef.fillStyle || "#000";

            // create a canvas object
            var canvas:HTMLCanvasElement= document.createElement("canvas");
            var ctx= canvas.getContext("2d");

            var font=  "" + fontDef.size + "px " + fontDef.fontface + (fontDef.style? " "+fontDef.style : "");
            ctx.font= font;
            ctx.strokeStyle= fontDef.strokeStyle;
            ctx.fillStyle=fontDef.fillStyle;
            ctx.lineWidth=fontDef.strokeSize;

            var mt:cc.plugin.font.FontMetrics= cc.plugin.font.getFontMetrics(ctx, font);

            this._height= mt.height + fontDef.padding;
            this._baseline= this._height;

            var mwidth= ctx.measureText(fontDef.characters).width;  //  measured width
            var w= (Math.min(mwidth,1024)|0)+1;
            var h= (2+((mwidth/1024)|0))*this._height;

            canvas.width= w;
            canvas.height= h;
            ctx= canvas.getContext("2d");

            ctx.font= font;

            ctx.textBaseline= "alphabetic";
            ctx.textAlign= "center";

            ctx.strokeStyle= fontDef.strokeStyle;
            ctx.fillStyle=fontDef.fillStyle;
            ctx.lineWidth=fontDef.strokeSize;

            var x=0;
            var y= mt.ascent;

            var chars = {};

            for( var i=0; i<fontDef.characters.length; i++ ) {
                var str= fontDef.characters.substr(i,1);
                var strw= 1+(ctx.measureText( str ).width|0);

                if ( x+strw+fontDef.padding >= w ) {
                    x=0;
                    y+= this._height;
                }

                if ( fontDef.stroke ) {
                    ctx.strokeText( str, x+strw/2, y );
                }
                if ( fontDef.fill ) {
                    ctx.fillText( str, x+strw/2, y );
                }

                chars[ str ]= {
                    x: x + fontDef.padding/2,
                    y: y - mt.ascent ,
                    width: strw+ fontDef.strokeSize/2,
                    height: this._height,
                    id : str.charCodeAt(0),
                    xadvance : strw
                };

                x+=strw+fontDef.padding;
            }

            cc.plugin.asset.AssetManager.addImage( canvas, this._fontName );

            for( var char in chars ) {
                this.__addChar( SpriteFontChar.createFrom( cc.plugin.asset.AssetManager.getSpriteFrame(this._fontName), chars[char] ) );
            }

            this._valid= true;

            return this;
        }

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
        drawText( ctx:cc.render.RenderingContext, text:string, x:number, y:number ) {

            var lines = text.split('\n');
            this.drawTextArray( ctx, lines, x, y );
        }

        /**
         * Draw an array of strings. Each string will be considered one line of text.
         * This method will be called by drawText. Prefer this method to avoid creating intermediate strings
         * per frame compared to drawText.
         * @param ctx {cc.render.RenderingContext}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         */
        drawTextArray( ctx:cc.render.RenderingContext, lines:string[], x:number, y:number ) {

            if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM) {
                y += (lines.length - 1) * this._height;
            }

            for(var n = 0; n < lines.length; n++) {
                this.drawTextLine( ctx, lines[n], x, y );
                y += this._height * (cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ? -1 : 1);
            }
        }

        /**
         * This method is like drawText but does not take into account line breaks.
         * It will therefore draw all text in one single line.
         * This method is called by drawTextArray. Prefer this method if the text has one single line of text.
         * @param ctx {cc.render.RenderingContext}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         */
        drawTextLine( ctx:cc.render.RenderingContext, text:string, x:number, y:number ) {

            for (var i = 0; i < text.length; i++) {

                var char = this._chars[text.charAt(i)];
                if (char) {
                    // draw char
                    char.draw(ctx, x, y, text.charAt(i + 1));
                    x += char._xadvance;
                }
            }
        }

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
        drawTextInRect( ctx:cc.render.RenderingContext, text:string, x:number, y:number, width:number, height:number, halign:number, valign:number ) {

            var textSize= this.getTextSize( text, width );

            var lines = text.split('\n');

            var textHeight= textSize.height;
            var yoffset= 0;

            // make top be always up regardless how y-axis grows.
            if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM) {
                if ( valign===cc.widget.VALIGN.BOTTOM ) {
                    valign= cc.widget.VALIGN.TOP;
                } else if ( valign===cc.widget.VALIGN.TOP ) {
                    valign= cc.widget.VALIGN.BOTTOM;
                }
            }

            switch( valign ) {
                case cc.widget.VALIGN.MIDDLE:
                    yoffset= (height-textHeight)/2;
                    break;
                case cc.widget.VALIGN.BOTTOM:
                    yoffset= height-textHeight-1;
            }

            if ( cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM) {
                yoffset += (lines.length - 1) * this._height;
            }

            var xx= x;

            for(var n = 0; n < lines.length; n++) {

                var xoffset=0;
                var lineWidth= this.getStringWidth( lines[n] );
                switch( halign ) {
                    case cc.widget.HALIGN.CENTER:
                        //xoffset= (width-lineWidth)/2;
                        break;
                    case cc.widget.HALIGN.RIGHT:
                        //xoffset= width-lineWidth-1;
                }

                var words= lines[n].split(" ");

                for (var i = 0; i < words.length; i++) {

                    var word= words[i];
                    if ( i<words.length-1 ) {
                        word += " ";
                    }

                    var wordWidth= this.getStringWidth( word );
                    if ( x+wordWidth>width ) {
                        y += this._height * (cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ? -1 : 1);
                        x= 0;
                    }

                    for( var j=0; j<word.length; j++ ) {
                        var char = this._chars[ word[j] ];
                        if (char) {
                            // draw char
                            char.draw(ctx, x + xoffset, y + yoffset, lines[n].charAt(i + 1));
                            x += char._xadvance;
                        }
                    }
                }

                y += this._height * (cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ? -1 : 1);
                x = xx;

            }
        }

        /**
         * Get a text dimension by this font.
         * @method cc.plugin.font.SpriteFont#textSize
         * @param text {string}
         * @param flowWidth {number=}
         * @returns {cc.math.Dimension}
         */
        getTextSize( text:string, flowWidth?:number ) : cc.math.Dimension {

            var width=0;
            var height=0;

            if (!flowWidth) {

                var lines = text.split('\n');
                for (var n = 0; n < lines.length; n++) {

                    var w = this.getStringWidth(lines[n]);
                    if (w > width) {
                        width = w;
                    }
                    height += this._height;
                }

                return new cc.math.Dimension(width, height);
            } else {

                return this.getTextSizeFlow( text, flowWidth );
            }
        }

        getTextSizeFlow( text:string, flowWidth:number ) : cc.math.Dimension {
            var lines= text.split("\n");
            var ret= new cc.math.Dimension();
            for( var i=0; i<lines.length; i++) {
                var d= this.getLineSizeFlow( lines[i], flowWidth );

                if ( d.width>ret.width ) {
                    ret.width= d.width;
                }

                ret.height+= d.height;
            }

            return ret;
        }

        getLineSizeFlow( text:string, flowWidth:number ) : cc.math.Dimension {

            var maxWidth=0;
            var w=0;
            var h= this._height;

            var words= text.split(" ");
            for (var i = 0; i < words.length; i++) {

                var word= words[i];
                if ( i<words.length-1 ) {
                    word += " ";
                }

                var wordWidth=this.getStringWidth(word);

                // wrap line
                if ( w+wordWidth > flowWidth ) {
                    h+= this._height;
                    if ( w>maxWidth ) {
                        maxWidth=w;
                    }
                    w=wordWidth;
                } else {
                    w+= wordWidth;
                }
            }

            if ( w>maxWidth ) {
                maxWidth=w;
            }

            return new cc.math.Dimension( maxWidth, h );
        }

        /**
         * Get a string width based on the font char definition.
         * If the string contains an unknown character to the font, that character will be skipped and add 0 to the
         * string width.
         * @param text {string}
         * @returns {number} string width based on the current font.
         */
        getStringWidth( text:string ) : number {

            var w= 0;
            for (var i = 0; i < text.length; i++) {
                var char = this._chars[text.charAt(i)];
                if (char) {
                    w += char._xadvance;
                }
            }

            return w;
        }

    }
}