/**
 * License: see license.txt file.
 */

/// <reference path="../node/Node.ts"/>
/// <reference path="../node/sprite/SpriteFrame.ts"/>
/// <reference path="../input/InputManager.ts"/>
/// <reference path="../input/MouseInputManager.ts"/>
/// <reference path="../render/RenderingContext.ts"/>

module cc {

    export module widget {
        import SpriteFrame= cc.node.sprite.SpriteFrame;


        export enum ButtonStatus {
            NORMAL= 0,
            PRESSED= 1,
            OVER= 2,
            DISABLED= 3
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
        export class Button extends cc.node.Node {

            /**
             * Button images in this order: normal, pressed, over, disabled
             * @type {Array<cc.node.sprite.SpriteFrame>}
             * @private
             */
            _frames:SpriteFrame[] = [null, null, null, null];

            _status:ButtonStatus = ButtonStatus.NORMAL;

            _callback:()=>any = null;

            constructor() {
                super();

                this.enableEvents(true);

                var down = function (e:cc.input.MouseInputManagerEvent) {
                    if ( e.target._status===ButtonStatus.DISABLED ) {
                        return;
                    }
                    e.target.setStatus( ButtonStatus.PRESSED );
                };

                var click = function (e:cc.input.MouseInputManagerEvent) {
                    if ( e.target._status===ButtonStatus.DISABLED ) {
                        return;
                    }
                    e.target.setStatus( ButtonStatus.NORMAL );
                    if (e.target._callback) {
                        e.target._callback();
                    }
                };

                var over = function (e:cc.input.MouseInputManagerEvent) {
                    if ( e.target._status===ButtonStatus.DISABLED ) {
                        return;
                    }
                    e.target.setStatus( ButtonStatus.OVER );

                };

                var out = function (e:cc.input.MouseInputManagerEvent) {
                    if ( e.target._status===ButtonStatus.DISABLED ) {
                        return;
                    }
                    e.target.setStatus( ButtonStatus.NORMAL );
                };

                this.addEventListener("mousedown", down);
                this.addEventListener("touchstart", down);

                this.addEventListener("touchend", click);
                this.addEventListener("mouseclick", click);

                this.addEventListener("mouseover", over);
                this.addEventListener("touchover", over);

                this.addEventListener("mouseout", out);
                this.addEventListener("touchout", out);
            }

            disable() {
                this._status= ButtonStatus.DISABLED;
                this.enableEvents(false);
            }

            enable() {
                this._status= ButtonStatus.NORMAL;
                this.enableEvents(true);
            }

            setEnabled( b:boolean ) {
                if (b) {
                    this.enable();
                } else {
                    this.disable();
                }
            }

            draw( ctx:cc.render.RenderingContext ) {
                var sf= this.__getCurrentFrame();
                if ( sf ) {
                    ctx.globalAlpha = this._frameAlpha;
                    ctx.setTintColor(this._color);
                    sf.draw( ctx, this );
                }
            }

            init( obj ) {
                if ( obj.normal ) {
                    this._frames[ ButtonStatus.NORMAL ]= obj.normal;
                }
                if ( obj.pressed ) {
                    this._frames[ ButtonStatus.PRESSED ]= obj.pressed;
                }
                if ( obj.over ) {
                    this._frames[ ButtonStatus.OVER ]= obj.over;
                }
                if ( obj.disabled ) {
                    this._frames[ ButtonStatus.DISABLED ]= obj.disabled;
                }

                this._status= ButtonStatus.NORMAL;

                if ( obj.callback ) {
                    this._callback= obj.callback;
                }

                this.width= obj.normal.getWidth();
                this.height= obj.normal.getHeight();
            }

            __getCurrentFrame() : SpriteFrame {
                return this._frames[this._status] || this._frames[ ButtonStatus.NORMAL ];
            }

            setStatus( st:ButtonStatus ) {
                this._status= st;

                var frame= this.__getCurrentFrame();

                this.setContentSize( frame.getWidth(), frame.getHeight() );
            }
        }

    }

    export function MenuItemSprite( normal, selected, disabled, callback, context ) {
        var button:cc.widget.Button = new cc.widget.Button();

        button.setAnchorPoint(.5,.5);

        var obj:any= {
            normal: normal._spriteFrame
        };

        if (selected) {
            obj.pressed= selected._spriteFrame;
        }
        if (disabled) {
            obj.disabled= disabled._spriteFrame;
        }
        if (callback) {
            obj.callback= context ? callback.bind(context) : callback;
        }

        button.init(obj);

        return button;
    }

    export function MenuItemLabel( label:cc.widget.Label, callback:any ) {

        if ( callback ) {
            label.enableEvents(true);

            label.addEventListener("mouseclick", function (e) {
                if (e.target._enabled) {
                    callback();
                }
            });

            label.addEventListener("touchend", function (e) {
                if (e.target._enabled) {
                    callback();
                }
            });
        }

        return label;
    }

    export class MenuItemFont extends cc.node.Node {

        _label:cc.widget.LabelTTF = null;
        _callback:()=>any = null;
        _enabled:boolean = true;

        constructor(_initializer:cc.widget.LabelTTFInitializer|string, callback:()=>any, target:any) {

            super();

            var label:cc.widget.LabelTTF;

            if ( typeof _initializer==="string" ) {

                label = new cc.widget.LabelTTF( <string>_initializer, cc.MenuItemFont.DEFAULT_FONT, cc.MenuItemFont.DEFAULT_SIZE );

            } else {
                label = new cc.widget.LabelTTF();
                label.initialize(<cc.widget.LabelTTFInitializer>_initializer);
            }
            this._label = label;

            if (callback) {

                this._callback = target ? callback.bind(target) : callback;

                this._label.enableEvents(true);
                this._label.addEventListener("mouseup", (e)=> {
                    if (this._enabled) {
                        this._callback();
                    }
                });
                this._label.addEventListener("touchend", (e)=> {
                    if (this._enabled) {
                        this._callback();
                    }
                });
            }

            this.addChild(this._label);
            this._label.setPositionAnchor(0, 0);
            this.setContentSize(this._label.width, this._label.height);
        }

        setFontSize(s) {
            this._label.setFontSize(s);
        }

        getFontSize() {
            return this._label.getFontSize()
        }

        setFontName(name) {
            this._label.setFont(name);
        }

        getFontName() {
            return this._label.getFont();
        }

        setEnabled(b:boolean) {
            this._label.setEnabled(b);
        }

        get fontSize():number {
            return this._label._size;
        }

        set fontSize(v:number) {
            this._label._size = v;
        }

        get fontName():string {
            return this._label._font;
        }

        set fontName(v:string) {
            this._label._font = v;
        }

        static DEFAULT_SIZE : number= 16;
        static DEFAULT_FONT : string= "Arial";

        static setFontSize(fontSize) {
            cc.MenuItemFont.DEFAULT_SIZE = fontSize;
        }

        static fontSize() {
            return cc.MenuItemFont.DEFAULT_SIZE;
        }

        static setFontName(name) {
            cc.MenuItemFont.DEFAULT_FONT = name;
        }
    }


    export class Menu extends cc.node.Node {

        _buttons: cc.widget.Button[];
        _padding: number;

        constructor( ...buttons:cc.widget.Button[] ) {
            super();

            for( var i=0; i<buttons.length; i++ ) {
                this.addChild( buttons[i] );
            }

            this.setPositionAnchor(0,0);

            var winSize= cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setContentSize(winSize.width,winSize.height);
        }

        alignItemsVerticallyWithPadding(padding) {

            this._padding= padding + this.y;

            var height = -padding, locChildren = this._children, len, i, locScaleY, locHeight, locChild;
            if (locChildren && locChildren.length > 0) {
                for (i = 0, len = locChildren.length; i < len; i++)
                    height += locChildren[i].height * locChildren[i].scaleY + padding;

                var y = height / 2.0;

                for (i = 0, len = locChildren.length; i < len; i++) {
                    locChild = locChildren[i];
                    locHeight = locChild.height;
                    locScaleY = locChild.scaleY;
                    locChild.setPosition(0, y - locHeight * locScaleY / 2);
                    y -= locHeight * locScaleY + padding;
                }
            }
        }

        alignItemsInColumns(/*Multiple Arguments*/) {

            var rows = [];
            for (var i = 0; i < arguments.length; i++) {
                rows.push(arguments[i]);
            }
            var height = -5;
            var row = 0;
            var rowHeight = 0;
            var columnsOccupied = 0;
            var rowColumns, tmp, len;
            var locChildren = this._children;
            if (locChildren && locChildren.length > 0) {
                for (i = 0, len = locChildren.length; i < len; i++) {
                    if (row >= rows.length)
                        continue;

                    rowColumns = rows[row];
                    // can not have zero columns on a row
                    if (!rowColumns)
                        continue;

                    tmp = locChildren[i].height;
                    rowHeight = ((rowHeight >= tmp || isNaN(tmp)) ? rowHeight : tmp);

                    ++columnsOccupied;
                    if (columnsOccupied >= rowColumns) {
                        height += rowHeight + 5;

                        columnsOccupied = 0;
                        rowHeight = 0;
                        ++row;
                    }
                }
            }
            // check if too many rows/columns for available menu items
            //cc.assert(!columnsOccupied, "");    //?
            var winSize = cc.director.getWinSize();

            row = 0;
            rowHeight = 0;
            rowColumns = 0;
            var w = 0.0;
            var x = 0.0;
            var y = (height / 2);

            if (locChildren && locChildren.length > 0) {
                for (i = 0, len = locChildren.length; i < len; i++) {
                    var child = locChildren[i];
                    if (rowColumns == 0) {
                        rowColumns = rows[row];
                        w = winSize.width / (1 + rowColumns);
                        x = w;
                    }

                    tmp = child.height;
                    rowHeight = ((rowHeight >= tmp || isNaN(tmp)) ? rowHeight : tmp);
                    child.setPosition(x - winSize.width / 2, y - tmp / 2);

                    x += w;
                    ++columnsOccupied;

                    if (columnsOccupied >= rowColumns) {
                        y -= rowHeight + 5;
                        columnsOccupied = 0;
                        rowColumns = 0;
                        rowHeight = 0;
                        ++row;
                    }
                }
            }
        }
    }

    export class MenuItemToggle extends cc.node.Node {

        _currentOptionIndex : number= -1;
        _options : cc.node.Node[]= [];
        _callback : (m:cc.node.Node)=>any = null;
        _enabled : boolean = true;

        constructor() {
            super();

            this.setAnchorPoint(.5,.5);

            this.enableEvents(true);
            this.addEventListener( "mouseup", (e) => {
                if ( this._enabled ) {
                    this.__nextOption();
                }
            });
            this.addEventListener( "touchup", (e) => {
                if ( this._enabled ) {
                    this.__nextOption();
                }
            });

            this.__init.call( this, Array.prototype.slice.call(arguments) );
        }

        setEnabled(b:boolean) {
            this._enabled= b;
            for( var i=0; i<this._options.length; i++ ) {
                var node=<any>this._options[i];
                if ( typeof node.setEnabled!=="undefined" ) {
                    node.setEnabled(b);
                }
            }
        }

        initWithItems() {
            this.__init.call( this, Array.prototype.slice.call(arguments) );
        }

        __init( args:any[] ) {
            var len= args.length;
            if (typeof args[args.length - 2]==='function') {
                len-=2;
                this._callback= args[args.length-2].bind( args[args.length-1] );
            } else if (typeof args[args.length - 1]==='function') {
                len-=1;
                this._callback=args[args.length-1];
            }

            for( var i=0; i<len; i++ ) {
                this.addItem( args[i] );
            }

            this.setSelectedIndex(0);
        }

        addItem( node:cc.node.Node ) {

            node.setAnchorPoint(0.5, 0.5);
            node.visible= false;

            this._options.push( node );

            this.addChild(node);
            if ( this._children.length===1 ) {
                this.setSelectedIndex( 0 );
            }
        }

        setCallback( callback:(m:cc.node.Node)=>any ) {
            this.onClick(callback);
        }

        onClick( callback:(m:cc.node.Node)=>any ) {
            this._callback= callback;
        }

        setSelectedIndex( index:number ) {
            if ( this._options.length===0 ) {
                return;
            }

            index%=this._children.length;
            if ( index!==this._currentOptionIndex ) {
                if ( this._currentOptionIndex!==-1 ) {
                    this._options[ this._currentOptionIndex ].visible= false;
                }
                this._currentOptionIndex= index;
                var co:cc.node.Node= this._options[ this._currentOptionIndex ];
                co.setPosition( co.width/2, co.height/2 );
                co.visible= true;
                this.setContentSize( co.width, co.height );
            }
        }

        __emit() {
            if ( this._callback ) {
                this._callback( this._currentOptionIndex!==-1 ? this._options[this._currentOptionIndex] : null );
            }
        }

        __nextOption() {
            if ( this._children.length===0 ) {
                return;
            }

            this.setSelectedIndex( this._currentOptionIndex===-1 ? 0 : this._currentOptionIndex+1 );
            this.__emit();
        }

    }
}
