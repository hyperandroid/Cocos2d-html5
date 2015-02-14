/**
 * Created by ibon on 11/26/14.
 */

/// <reference path="../../math/Point.ts"/>
/// <reference path="../../math/Rectangle.ts"/>
/// <reference path="../Sprite.ts"/>
/// <reference path="../../render/RenderingContext.ts"/>
/// <reference path="../../render/DecoratedWebGLRenderingContext.ts"/>
/// <reference path="../../render/Texture2D.ts"/>
/// <reference path="../../locale/Locale.ts"/>
/// <reference path="../../util/Debug.ts"/>
/// <reference path="../../plugin/asset/AssetManager.ts"/>


module cc.node.sprite {

    import Vector = cc.math.Vector;
    import Rectangle = cc.math.Rectangle;
    import RenderingContext = cc.render.RenderingContext;
    import DecoratedWebGLRenderingContext = cc.render.DecoratedWebGLRenderingContext;
    import Texture2D = cc.render.Texture2D;
    import Sprite = cc.node.Sprite;

    function __createSpriteFrame( from:SpriteFrame, x, y, w, h, name:string, rotated:boolean, offsetx:number, offsety:number ) : SpriteFrame {

        var frame = from.createSubSpriteFrame( parseFloat(x), parseFloat(y), parseFloat(w), parseFloat(h), name, offsetx, offsety );
        frame.rotated= rotated;

        return frame;
    }

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
    export class SpriteFrame {

        /**
         * Parent's SpriteFrame. When creating Frames from an image, a call to <code>spriteFrame.createFrame</code>
         * will create a child of a frame, set its parent, and inherit the offseting based on parent's chain.
         * Both frames will share the same Texture2D instance.
         * @type {cc.node.SpriteFrame}
         * @member cc.node.sprite.SpriteFrame#_parent
         * @private
         */
        _parent : SpriteFrame = null;

        /**
         * Offset position in texture.
         * When setting parents, the offset will be the parent's position.
         * @member cc.node.sprite.SpriteFrame#_offset
         * @type {cc.math.Vector}
         * @private
         */
        _offset: Vector = new Vector();

        /**
         * Displacement to add to position the spriteframe on screen.
         * Nothing to do with uv coords.
         * @member cc.node.sprite.SpriteFrame#_offsetFromCenter
         * @type {cc.math.Vector}
         * @private
         */
        _offsetFromCenter : Vector = null;

        /**
         * Is the frame rotated ?. Not by default.
         * @member cc.node.sprite.SpriteFrame#_rotated
         * @type {boolean}
         * @private
         */
        _rotated: boolean = false;

        /**
         * Recatangle in pixels the SpriteFrame represents.
         * @member cc.node.sprite.SpriteFrame#_rect
         * @type {cc.math.Rectangle}
         * @private
         */
        _rect: Rectangle = null;

        /**
         * Recatangle in uv the SpriteFrame represents.
         * @member cc.node.sprite.SpriteFrame#_normalizedRect
         * @type {cc.math.Rectangle}
         * @private
         */
        _normalizedRect: Rectangle = new Rectangle();

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
        _name : string = null;

        /**
         * Create a new SpriteFrame instance.
         * @method cc.node.sprite.SpriteFrame#constructor
         * @param _texture {Texture2D} an string or Texture2D
         * @param rect {cc.math.Rectangle=} an optional rect on the texture. If not set, the whole image will be used.
         */
        constructor(public _texture? : Texture2D, rect? : Rectangle ) {

            this._rect= rect ?
                rect :
                (_texture!==null ?
                    new Rectangle( 0,0,_texture._imageWidth, _texture._imageHeight ) :
                    new Rectangle() );
            this.__calculateNormalizedRect();
            this._name= _texture && _texture._name ? _texture._name : "root";
        }

        getWidth() : number {
            return this._rect.w;
        }

        getHeight() : number {
            return this._rect.h;
        }

        getX() : number {
            return this._rect.x;
        }

        getY() : number {
            return this._rect.y;
        }

        get x() {
            return this._rect.x;
        }

        get y() {
            return this._rect.y;
        }

        get width() {
            return this._rect.w;
        }

        get height() {
            return this._rect.h;
        }

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
        createSubSpriteFrame( x:number, y:number, w:number, h:number, name:string, centerOffsetX?:number, centerOffsetY?:number ) : SpriteFrame {

            var newRect:Rectangle = new Rectangle(x, y, w, h);
            newRect.translate( this._rect.x, this._rect.y );

            if (this._rect.intersectsWith(newRect)) {

                var sf:SpriteFrame = new SpriteFrame(this._texture, newRect);
                sf._name = name;
                sf._parent = this;
                sf.setOffset(this._offset.x + this._rect.x, this._offset.y + this._rect.y);
                sf.setOffsetFromCenter( centerOffsetX||0, centerOffsetY||0 );

                return sf;
            }

            return null;
        }

        needsSpecialMatrix() : boolean {
            return this._offsetFromCenter!==null || this._rotated;
        }

        setOffsetFromCenter( x:number, y:number ) {
            if (this._offsetFromCenter===null) {
                this._offsetFromCenter= new Vector(0,0);
            }
            this._offsetFromCenter.set( x, y );
        }

        createSubSpriteFrames( rows:number, columns:number ) : SpriteFrame[] {

            var sfwidth= this._rect.w/columns;
            var sfheight= this._rect.h/rows;
            var frames= [];

            for( var i=0; i<rows; i++) {
                for( var j=0; j<columns; j++ ) {
                    frames.push(
                        this.createSubSpriteFrame(
                            j*sfwidth, i*sfheight, sfwidth, sfheight, this._name+(j+i*columns) ) );
                }
            }

            return frames;
        }

        /**
         * Set the SpriteFrame offset. This is useful to properly position a Frame inside a frame. For example, a texture
         * atlas with a font, which effectively another atlas.
         * If the offset position is not contained the SpriteFrame's rect, the offset operation does nothing.
         * @method cc.node.sprite.SpriteFrame#setOffset
         * @param x {number}
         * @param y {number}
         */
        setOffset( x:number, y:number ) : void {
            if (!this._texture) {
                cc.Debug.error(locale.ERR_SPRITE_FRAME_NO_TEXTURE, "setOffset");
            }
            //if ( this._rect.contains( x,y ) ) {
                this._offset.set(x, y);
                this.__calculateNormalizedRect();
            //}
        }

        /**
         * Set this SpriteFrame to have the image rotated.
         * @method cc.node.sprite.SpriteFrame#set:rotated
         * @param v {boolean}
         */
        set rotated( v : boolean ) {
            this._rotated= v;
        }

        /**
         * Is this SpriteFrame rotated ?
         * @method cc.node.sprite.SpriteFrame#get:rotated
         * @returns {boolean}
         */
        get rotated() {
            return this._rotated;
        }

        /**
         * Calculate WebGL rect based on the current frame info.
         * @member cc.node.sprite.SpriteFrame#__calculateNormalizedRect
         * @private
         */
        __calculateNormalizedRect() : void {

            if ( cc.render.RENDER_ORIGIN==="bottom" ) {
                this._normalizedRect.set(
                    this._rect.x,
                    this._texture._imageHeight - this._rect.y - this._rect.h,
                    this._rect.w,
                    this._rect.h).
                    normalizeBy(this._texture._textureWidth, this._texture._textureHeight);

            } else {
                this._normalizedRect.set(
                    this._rect.x,
                    this._rect.y,
                    this._rect.w,
                    this._rect.h).
                    normalizeBy(this._texture._textureWidth, this._texture._textureHeight);
            }
        }

        /**
         * Get this SpriteFrame associated texture 2d object.
         * @method cc.node.sprite.SpriteFrame#getTexture
         * @returns {cc.render.Texture2D}
         */
        getTexture() : Texture2D {
            return this._texture;
        }

        /**
         * Draw the SpriteFrame.
         * This method takes care of drawing the Frame with the correct rotation and Sprite's status of flip axis values.
         * @method cc.node.sprite.SpriteFrame#draw
         * @param ctx {cc.render.RenderingContext}
         * @param sprite {cc.node.Sprite}
         */
        draw( ctx : RenderingContext, w:number, h:number ) : void {

            var rotated= this._rotated;

            if ( ctx.type==="webgl" ) {

                if (!this._texture.isWebGLEnabled()) {
                    cc.Debug.warn(cc.locale.SPRITEFRAME_WARN_TEXTURE_NOT_WEBGL_INITIALIZED, "SpriteFrame.draw");
                    this._texture.__setAsGLTexture((<DecoratedWebGLRenderingContext>ctx)._webglState);
                    this.__calculateNormalizedRect();
                }
            }

            ctx.drawTexture(
                this._texture,
                this._rect.x, this._rect.y, this._rect.w, this._rect.h,
                0,0 ,w, h );

        }

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
        createSpriteFramesFromJSON( map:any, frames?:SpriteFrame[] ) : SpriteFrame[] {

            frames= frames || [];

            map = map.frames || map;

            for (var element in map) {
                if (map.hasOwnProperty(element)) {

                    var frameRect= map[element].frame;
                    frames.push( __createSpriteFrame(
                        this,
                        frameRect.x, frameRect.y,
                        frameRect.w, frameRect.h,
                        element,
                        map[element].rotated,
                        0, 0) );
                }
            }

            return frames;
        }

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
        createSpriteFramesFromPLIST( obj:Array<any> ) : SpriteFrame[] {

            var ret:SpriteFrame[] = [];

            var frames= obj[0].frames;
            for( var id in frames ) {

                if ( frames.hasOwnProperty(id) ) {
                    var frameInfo = frames[id];

                    if ( frameInfo.frame ) {

                        // frame info is of the form {{x,y},{w,h}}
                        var fi= frameInfo.frame.substring(1,frameInfo.frame.length-1);
                        var fis= fi.substring(1,fi.length-1).split('},{');
                        var xy= fis[0].split(',');
                        var wh= fis[1].split(',');

                        // frame info offset {0,0}
                        var foffset= frameInfo.offset.substring(1,fi.length-1).split('},{');
                        var offsetxy= foffset[0].split(',');

                        // WFT!!!
                        // the file format specifies if rotated, the frame size in inverted.
                        var w, h;
                        w= parseFloat(frameInfo.rotated ? wh[1] : wh[0]);
                        h= parseFloat(frameInfo.rotated ? wh[0] : wh[1]);

                        var ox, oy;
                        //ox= parseFloat(frameInfo.rotated ? offsetxy[1] : offsetxy[0]);
                        //oy= parseFloat(frameInfo.rotated ? offsetxy[0] : offsetxy[1]);
                        ox= parseFloat(offsetxy[0]);
                        oy= parseFloat(offsetxy[1]);

                        ret.push(__createSpriteFrame(
                            this,
                            parseFloat(xy[0]), parseFloat(xy[1]),
                            w,h,
                            id,
                            frameInfo.rotated,
                            ox, oy)
                        );

                    } else {

                        ret.push(__createSpriteFrame(
                            this, frameInfo.x, frameInfo.y,
                            frameInfo.width, frameInfo.height,
                            id,
                            frameInfo.rotated,
                            0, 0));
                    }
                }

            }

            return ret;
        }

    }

}