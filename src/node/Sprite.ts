/**
 * License: see license.txt file.
 */

/// <reference path="Node.ts"/>
/// <reference path="./sprite/SpriteFrame.ts"/>
/// <reference path="../math/Color.ts"/>
/// <reference path="../math/Point.ts"/>
/// <reference path="../math/Rectangle.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../render/RenderingContext.ts"/>
/// <reference path="../render/DecoratedWebGLRenderingContext.ts"/>
/// <reference path="../render/Texture2D.ts"/>
/// <reference path="../locale/Locale.ts"/>
/// <reference path="../util/Debug.ts"/>
/// <reference path="../plugin/loader/Loader.ts"/>
/// <reference path="../plugin/loader/Resource.ts"/>
/// <reference path="../plugin/asset/AssetManager.ts"/>

module cc.node {

    "use strict";

    import Vector = cc.math.Vector;
    import Rectangle = cc.math.Rectangle;
    import Node = cc.node.Node;
    import RenderingContext = cc.render.RenderingContext;
    import DecoratedWebGLRenderingContext = cc.render.DecoratedWebGLRenderingContext;
    import Texture2D = cc.render.Texture2D;
    import SpriteFrame = cc.node.sprite.SpriteFrame;
    import Color= cc.math.Color;

    /**
     * @class cc.node.Sprite.SpriteInitializer
     * @classdesc
     *
     * Sprite initializer object.
     */
    export interface SpriteInitializer {
        texture? : Texture2D;
        frame? : SpriteFrame;
        rect? : Rectangle;
        frameName? : string;
    }

    var __m0= new Float32Array([1,0,0, 0,1,0, 0,0,1]);

    /**
     * @class cc.node.Sprite
     * @extend cc.node.Node
     * @classdesc
     * Sprite creates an sprite, a Node that shows images with animations.
     */
    export class Sprite extends Node {

        static create(d:any):Sprite {
            return new cc.node.Sprite(d);
        }

        /**
         * Set this frame horizontally flipped.
         * @member cc.node.Sprite#_flippedX
         * @type {boolean}
         * @private
         */
        _flippedX : boolean = false;

        /**
         * Set this frame horizontally flipped.
         * @member cc.node.Sprite#_flippedY
         * @type {boolean}
         * @private
         */
        _flippedY : boolean = false;

        /**
         * @union
         * @type {cc.render.Texture2D|cc.node.sprite.SpriteFrame}
         * @private
         */
        _spriteFrame : cc.node.sprite.SpriteFrame = null;

        _resizeOnSpriteFrameSet:boolean = true;

        _spriteMatrix : Float32Array = new Float32Array([1,0,0, 0,1,0, 0,0,1]);
        _spriteMatrixDirty : boolean = false;
        _spriteMatrixSet : boolean = false;

        /**
         * @method cc.node.Sprite#constructor
         * @param ddata {cc.node.SpriteInitializer}
         */
        constructor( ddata : any, rect?:cc.math.Rectangle ) {
            super();
            this.__init( ddata, rect);
        }

        __init(ddata : any, rect?:cc.math.Rectangle ) {

            if ( ddata instanceof cc.node.sprite.SpriteFrame ) {
                // V3 call.
                this.setSpriteFrame( <SpriteFrame>ddata );
                cc.Debug.warn( locale.WARN_SPRITE_CONSTRUCTOR_DEPRECATED_CALL );
            } else if ( ddata instanceof cc.render.Texture2D ) {
                // V3 call
                this.setSpriteFrame( new SpriteFrame(<Texture2D>ddata, arguments[1]) );
                cc.Debug.warn( locale.WARN_SPRITE_CONSTRUCTOR_DEPRECATED_CALL );
            } else if ( typeof ddata==="string" ) {
                // V3 call
                if ( ddata.charAt(0)==="#") {

                    this.setSpriteFrame( cc.plugin.asset.AssetManager.getSpriteFrame( (<string>ddata).substr(1) ) );
                } else {
                    this.__createFromURL(<string>ddata, rect);
                }
                cc.Debug.warn( locale.WARN_SPRITE_CONSTRUCTOR_DEPRECATED_CALL );
            } else {

                var data= <SpriteInitializer>ddata;
                // V4 call

                if ( data ) {
                    if (data.texture) {
                        this.setSpriteFrame(new SpriteFrame(data.texture, data.rect));
                    } else if (data.frame) {
                        this.setSpriteFrame(data.frame);
                    } else if ( data.frameName ) {
                        this.setSpriteFrame( cc.plugin.asset.AssetManager.getSpriteFrame(data.frameName) );
                    } else {
                        cc.Debug.warn(locale.ERR_SPRITE_CONSTRUCTOR_PARAM_ERROR);
                    }
                }
            }

        }

        /**
         * Backwards compatibility method.
         * Never use directly.
         * ugh!.
         *
         * @param url
         * @param rect
         * @private
         */
        __createFromURL( url : string, rect?:cc.math.Rectangle ) {

            // me sangran los ojos poniendo esto aqui !!!
            var resource= cc.plugin.asset.AssetManager._resources[url] || null;

            // resource exists in the backwards compatibility resources list ?.
            if ( resource ) {
                // if not texture associated, create texture and main sprite frame
                if (!cc.plugin.asset.AssetManager.getTexture(url)) {
                    cc.plugin.asset.AssetManager.addImage(resource, url);
                }

                var mainSpriteFrame= cc.plugin.asset.AssetManager.getSpriteFrame(url);
                this.setSpriteFrame( !rect ?
                    mainSpriteFrame :
                    mainSpriteFrame.createSubSpriteFrame(rect.x, rect.y, rect.w, rect.h, url ));

            } else {

                // image is not even loaded.
                var me = this;

                // load asynchronously and create sprite frame + texture.
                new cc.plugin.loader.Loader({
                    resources: [url]
                }).startLoading(
                    function finished(resources:cc.plugin.asset.ResourcesMap) {

                        cc.plugin.asset.AssetManager.mergeResources( resources );

                        var sf:SpriteFrame = new SpriteFrame(new Texture2D(resources[url], url));
                        if (rect) {
                            sf = sf.createSubSpriteFrame(rect.x, rect.y, rect.w, rect.h, url);
                        }
                        me.setSpriteFrame(sf);
                    }
                );
            }
        }

        /**
         * Specialized Sprite draw function.
         * The Sprite must have a SpriteFrame, which references a region of an Image.
         * @method cc.node.Sprite#draw
         * @param ctx {cc.render.RenderingContext}
         */
        draw(ctx:RenderingContext):void {
            if ( this._spriteFrame ) {
                ctx.globalAlpha= this._frameAlpha;
                ctx.setTintColor( this._color );

                //if ( ctx.type==="canvas" && cc.render.RENDER_ORIGIN==="bottom" ) {
                //    ctx.translate( 0, this._contentSize.height );
                //    ctx.scale( 1, -1 );
                //}

                this._spriteFrame.draw( ctx, this.width, this.height );
            }
        }

        /**
         * Set this Sprite's frame. Until a frame is set the Sprite won't be drawn on screen.
         * When the frame is set, the Node will have its dimension changed to fit that of the frame.
         * @param s {cc.node.sprite.SpriteFrame}
         */
        setSpriteFrame( s : SpriteFrame ) {
            if ( s!==this._spriteFrame ) {
                this._spriteFrame = s;
                if (this._resizeOnSpriteFrameSet) {
                    this.setContentSize(s._rect.w, s._rect.h);
                }

                this._spriteMatrixDirty= true;
            }
        }

        __createMatrix() {

            var w= this.width;
            var h= this.height;

            this._spriteMatrixSet= false;

            cc.math.Matrix3.identity( this._spriteMatrix );

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

            this._spriteMatrixDirty= false;
        }

        __setLocalTransform() {
            super.__setLocalTransform();
            if ( this.__isFlagSet(cc.node.NodeDirtyFlags.TRANSFORMATION_DIRTY ) ) {
                if ( this._spriteMatrixDirty ) {
                    this.__createMatrix();
                }
                if ( this._spriteMatrixSet ) {
                    cc.math.Matrix3.multiply(this._modelViewMatrix, this._spriteMatrix);
                }
            }
        }

        /**
         * Make the sprite to be horizontally mirrored.
         * @method cc.node.Sprite#setFlippedX
         * @param f {boolean} true to mirror, false by default.
         * @returns {cc.node.Sprite}
         */
        setFlippedX( f:boolean ) : Sprite {
            this._flippedX=f;
            this._spriteMatrixDirty= true;
            this.__setFlag(cc.node.NodeDirtyFlags.TRANSFORMATION_DIRTY );
            return this;
        }

        /**
         * Make the sprite to be vertically mirrored.
         * @method cc.node.Sprite#setFlippedY
         * @param f {boolean} true to mirror, false by default.
         * @returns {cc.node.Sprite}
         */
        setFlippedY( f:boolean ) : Sprite {
            this._flippedY=f;
            this._spriteMatrixDirty= true;
            this.__setFlag(cc.node.NodeDirtyFlags.TRANSFORMATION_DIRTY );
            return this;
        }

        resizeOnSpriteFrameSet( b:boolean ) : Sprite {
            this._resizeOnSpriteFrameSet= b;
            return this;
        }

        setTextureRect( r:cc.math.Rectangle ) {
            if ( this._spriteFrame ) {
                this.setSpriteFrame( this._spriteFrame.createSubSpriteFrame(r.x, r.y, r.w, r.h, this._name ) );
            }
        }

        set flippedX( b:boolean ) {
            this.setFlippedX(b);
        }

        set flippedY( b:boolean ) {
            this.setFlippedY(b);
        }
    }

    export class SpriteBatchNode extends Sprite {

        constructor( ddata : any, rect?:cc.math.Rectangle ) {
            super(null);
            this._resizeOnSpriteFrameSet= false;
            this.__init(ddata, rect);
        }
    }
}
