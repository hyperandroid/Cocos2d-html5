/**
 * License: see license.txt file
 */

/// <reference path="../math/Dimension.ts"/>
/// <reference path="../node/Node.ts"/>
/// <reference path="../node/Sprite.ts"/>
/// <reference path="../node/sprite/SpriteFrame.ts"/>
/// <reference path="../render/RenderingContext.ts"/>
/// <reference path="../render/Texture2D.ts"/>
/// <reference path="../plugin/font/SpriteFont.ts"/>

module cc.widget {

    export enum VALIGN  {
        TOP= 0,
        MIDDLE=1,
        BOTTOM= 2
    }

    export enum HALIGN  {
        LEFT= 0,
        CENTER=1,
        RIGHT= 2
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
    export class Label extends cc.node.Node {

        _text : string = '';
        _textSize : cc.math.Dimension= null;
        _font : cc.plugin.font.SpriteFont = null;
        _resizeContentSize : boolean = true;

        _valign : cc.widget.VALIGN = cc.widget.VALIGN.MIDDLE;
        _halign : cc.widget.HALIGN = cc.widget.HALIGN.CENTER;

        _enabled:boolean = true;

        _flowWidth:number= 0;

        /**
         * Build a new LabelBM object instance.
         * @param text {string} label text.
         * @param fontName {string} a cc.plugin.font.SpriteFont in the AssetManager cache object name.
         */
        constructor( text:string, fontName:string ) {
            super();

            this._text= text;
            this._font= cc.plugin.asset.AssetManager.getSpriteFont( fontName );
            this.__measureText();
        }

        setResizeContentSize( b:boolean ) : Label {
            this._resizeContentSize= b;
            return this;
        }

        __measureText() {
             if ( this._font ) {
                 var d:cc.math.Dimension = this._font.getTextSize(this._text, this._flowWidth);
                 this._contentSize.width = this._flowWidth ? this._flowWidth : d.width;
                 this._contentSize.height = d.height;
                 this._textSize = d;
             }
        }

        setFont( fontName:string ) {
            var fn= cc.plugin.asset.AssetManager.getSpriteFont( fontName );
            if ( null!==fn ) {
                this._font= fn;
                if ( this._resizeContentSize ) {
                    this.__measureText();
                }
            }
        }

        setText( text:string ) {
            this._text= text;
            if ( this._resizeContentSize ) {
                this.__measureText();
            }
        }

        setHAlign( a : cc.widget.HALIGN ) : Label {
            this._halign= a;
            return this;
        }

        setVAlign( a : cc.widget.VALIGN ) : Label {
            this._valign= a;
            return this;
        }

        draw( ctx:cc.render.RenderingContext ) {
            super.draw( ctx );
            if ( this._font ) {
                this._font.drawTextInRect( ctx,
                    this._text,
                    0,0,
                    this._contentSize.width, this._contentSize.height,
                    this._halign, this._valign );
            }
        }

        get textAlign() : cc.widget.HALIGN {
            return this._halign;
        }

        set textAlign( v:cc.widget.HALIGN ) {
            this._halign= v;
        }

        get textVerticalAlign() : cc.widget.VALIGN {
            return this._valign;
        }

        set textVerticalAlign( v:cc.widget.VALIGN ) {
            this._valign= v;
        }

        /**
         *
         * @param text
         * @deprecated
         */
        setString( text:string ) {
            this.setText(text);
        }

        setEnabled(e:boolean) {
            this._enabled= e;
        }

        flowWidth( f:number ) : Label {
            this._flowWidth= f;
            this.__measureText();
            return this;
        }
    }

    var __index=0;

    export interface LabelTTFInitializer {
        text : string;
        font : string;
        size : number;

        flowWidth? : number;

        fillColor?: any;
        strokeColor? : any;
        strokeSize? : number;
        fill? : boolean;
        stroke? : boolean;

        shadowBlur? : number;
        shadowColor? : any;
        shadowOffsetX? : number;
        shadowOffsetY? : number;

        horizontalAlignment? : number;
        verticalAlignment? : number;
    }

    export class LabelTTF extends cc.node.Sprite {

        _text : string = null;
        _font : string = "Arial";
        _size : number = 16;
        _flow : boolean = false;
        _flowWidth : number = 1024;
        _fillColor : string = "#fff";
        _strokeColor : string = "#ccc";
        _strokeSize : number = 1;

        _fill : boolean = true;
        _stroke:boolean = false;

        _shadowBlur : number = 0;
        _shadowColor : any = "#ff0";
        _shadowOffsetX : number = 0;
        _shadowOffsetY : number = 0;

        _texture: cc.render.Texture2D= null;

        _horizontalAlignment : HALIGN= HALIGN.LEFT;
        _verticalAlignment : VALIGN= VALIGN.MIDDLE;

        _enabled : boolean = true;

        constructor( _initializer?:LabelTTFInitializer|string,
                        font?:string, fontSize?:number,
                        dimensions?:cc.math.Dimension,
                        halign?:cc.widget.HALIGN, valign?:cc.widget.VALIGN ) {

            super(null);

            var initializer:LabelTTFInitializer;

            if ( typeof _initializer==="string" ) {
                // old calls
                initializer= {
                    text: <string>_initializer,
                    font: typeof font !== "undefined" ? font : this._font,
                    size: typeof fontSize !== "undefined" ? fontSize : this._size
                };

                if ( typeof dimensions!=="undefined" ) {
                    initializer.flowWidth= dimensions.width;
                }

                initializer.horizontalAlignment= typeof halign!=="undefined" ? halign : this._horizontalAlignment;
                initializer.verticalAlignment= typeof valign!=="undefined" ? valign : this._verticalAlignment;

            } else {
                initializer= <LabelTTFInitializer>_initializer;
            }

            if ( initializer ) {
                this.initialize(initializer);

                if (initializer.text) {
                    this.__initLabel();
                }
            }
        }

        initialize( init:LabelTTFInitializer ) : LabelTTF {

            this._text= init.text;
            if ( typeof init.font!=="undefined" ) { this._font= init.font; };
            if ( typeof init.size!=="undefined" ) { this._size= init.size; };

            this._flow= typeof init.flowWidth!=='undefined';
            if (typeof init.flowWidth!=='undefined') { this._flowWidth=init.flowWidth; }

            if (typeof init.fillColor!=='undefined') { this._fillColor= init.fillColor; }
            if (typeof init.strokeColor!=='undefined'){ this._strokeColor= init.strokeColor; }
            if (typeof init.strokeSize!=='undefined' ){ this._strokeSize= init.strokeSize; }

            if (typeof init.fill!=='undefined') { this._fill= init.fill; }
            if (typeof init.stroke!=='undefined') {this._stroke=init.stroke; }

            if (typeof init.shadowBlur!=='undefined') {this._shadowBlur= init.shadowBlur; }
            if (typeof init.shadowColor!=='undefined') {this._shadowColor=init.shadowColor; }
            if (typeof init.shadowOffsetX==='undefined') {this._shadowOffsetX= init.shadowOffsetX; }
            if (typeof init.shadowOffsetY==='undefined') {this._shadowOffsetY=init.shadowOffsetY; }

            if (typeof init.horizontalAlignment!=="undefined") { this._horizontalAlignment= init.horizontalAlignment; }
            if (typeof init.verticalAlignment!=="undefined") { this._verticalAlignment= init.verticalAlignment; }

            this.__initLabel();

            return this;
        }

        setEnabled( b:boolean ) {
            this._enabled= b;

            return this;
        }

        setText( text:string ) {
            if ( this._text===text ) {
                return;
            }

            this._text= text;
            this.__initLabel();

            return this;
        }

        setString( text:string ) {
            return this.setText(text);
        }

        __initLabel() {

            if ( !this._text ) {
                return;
            }

            if ( this._texture ) {
                this._texture.release();
            }

            var canvas= document.createElement("canvas");
            var ctx= canvas.getContext("2d");

            this.__prepareContext(ctx);

            var textSize:cc.math.Dimension= this.__getTextSize( ctx, this._text, this._flowWidth );

            var canvas= this.__drawText( this._text, textSize );

            var textureId= "labelTTF"+__index++;
            this._texture= new cc.render.Texture2D( canvas, textureId );

            this.setSpriteFrame( new cc.node.sprite.SpriteFrame( this._texture ) );
        }

        __prepareContext( ctx:CanvasRenderingContext2D ) {

            ctx.font= ""+this._size+"px "+this._font;
            ctx.textBaseline= "top";

            ctx.fillStyle= this._fillColor;

            if ( this._stroke ) {
                ctx.strokeStyle = this._strokeColor;
                ctx.lineWidth= this._strokeSize;
            }

            if ( this._shadowBlur ) {
                ctx.shadowBlur= this._shadowBlur;
                ctx.shadowColor= this._shadowColor;
                ctx.shadowOffsetX= this._shadowOffsetX;
                ctx.shadowOffsetY= this._shadowOffsetY;
            }

        }

        __drawText( text:string, size:cc.math.Dimension ) {

            var y=0;
            var flowWidth= size.width;

            var offsetX= 0;
            var offsetY= 0;
            if ( this._stroke ) {
                offsetX+= this._strokeSize / 2;
                offsetY+= this._strokeSize / 2;
                size.width+= this._strokeSize;
                size.height+= this._strokeSize;
            }
            if ( this._shadowBlur ) {
                size.width+= this._shadowBlur + this._shadowOffsetX;
                size.height+= this._shadowBlur + this._shadowOffsetY;

                offsetX+= this._shadowBlur / 2 + this._shadowOffsetX;
                offsetY+= this._shadowBlur / 2 + this._shadowOffsetY * (cc.render.RENDER_ORIGIN===cc.render.ORIGIN_BOTTOM ? -1 : 1);
            }

            var canvas= document.createElement("canvas");
            canvas.width= size.width;
            canvas.height= size.height + this._size*.3; // + descent
            var ctx= canvas.getContext("2d");
            this.__prepareContext(ctx);

            y= offsetY;

            var lines= text.split("\n");
            var linesWidth= [];

            // calculate each line width
            for( var l=0; l<lines.length; l++ ) {
                var x:number= offsetX;
                var words= lines[l].split(" ");

                for( var w=0; w<words.length; w++ ) {

                    var word= words[w] + (w<words.length-1 ? " " : "");
                    var wordLength= ctx.measureText(word).width;

                    if ( x+wordLength > flowWidth ) {
                        linesWidth.push( x );
                        x= 0;
                    }

                    x += wordLength;
                }

                linesWidth.push( x );
            }

            function calculateOffset( ha ) {
                switch( ha ) {
                    case HALIGN.LEFT:
                        return offsetX;
                    case HALIGN.CENTER:
                        return (flowWidth - linesWidth[currentLine])/2;
                    case HALIGN.RIGHT:
                        return flowWidth - linesWidth[currentLine] - offsetX - 1;
                }

                return 0;
            }

            var currentLine= 0;
            for( var l=0; l<lines.length; l++ ) {

                var x:number= calculateOffset( this._horizontalAlignment );

                var words= lines[l].split(" ");

                for( var w=0; w<words.length; w++ ) {

                    var word= words[w] + (w<words.length-1 ? " " : "");
                    var wordLength= ctx.measureText(word).width;

                    if ( x+wordLength > flowWidth ) {
                        y+= this._size;
                        currentLine++;
                        x= calculateOffset( this._horizontalAlignment );
                    }

                    if ( this._stroke ) {
                        ctx.strokeText(word,x,y);
                    }
                    if ( this._fill ) {
                        ctx.fillText(word, x, y);
                    }

                    x += wordLength;
                }

                y+= this._size;
            }

            return canvas;
        }

        __getTextSize( ctx:CanvasRenderingContext2D, text:string, flowWidth:number ) : cc.math.Dimension {

            var dim= new cc.math.Dimension();
            flowWidth= this._flowWidth;


            var lines= text.split("\n");
            for( var l=0; l<lines.length; l++ ) {


                var x:number= 0;
                var words= lines[l].split(" ");

                for( var w=0; w<words.length; w++ ) {

                    var word= words[w] + (w<words.length-1 ? " " : "");
                    var wordLength= ctx.measureText(word).width;

                    if ( x+wordLength > flowWidth ) {
                        dim.width= Math.max( dim.width, x );
                        dim.height+= this._size;
                        x= wordLength;
                    } else {
                        x+=wordLength;
                    }
                }

                dim.height+= this._size;
                dim.width= Math.max( dim.width, x );
            }

            if ( this._flow ) {
                dim.width= flowWidth;
            }

            return dim;
        }

        getFont() : string {
            return this._font;
        }

        setFont( font:string ) {
            this._font= font;
            this.__initLabel();
        }

        setFontSize(s:number) {
            this._size= s;
            this.__initLabel();
        }

        getFontSize() : number {
            return this._size;
        }

    }
}