/**
 * License: see license.txt file.
 */

/// <reference path="../../math/Dimension.ts"/>
/// <reference path="../../node/sprite/SpriteFrame.ts"/>
/// <reference path="../../render/Texture2D"/>
/// <reference path="../../render/RenderingContext"/>
/// <reference path="../asset/AssetManager.ts"/>

module cc.plugin.texture {

    "use strict";

    import Dimension= cc.math.Dimension;

    var getTexturePageIndex= function() {
        var index=0;
        return function() {
            return index++;
        }
    }();

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
    export interface PackInfo {

        /**
         * Show debug borders ? Will spoil the generated SpriteFrames but will allow you to see each created node.
         * @member cc.plugin.texture.PackInfo#debug
         * @type {number}
         */
        debug?:boolean;

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

    var SortStrategies= {

        __compare: function( v0:number, v1:number) {
            if ( v0<v1 ) {
                return 1;
            } else if ( v0>v1 ) {
                return -1;
            }
            return 0;
        },

        perimeter: function(i0:TexturePackerItem, i1:TexturePackerItem) {
            var w0= i0.getWidth();
            var h0= i0.getHeight();
            var w1= i1.getWidth();
            var h1= i1.getHeight();

            return SortStrategies.__compare(w0+w0+h0+h0, w1+w1+h1+h1);
        },

        area: function(i0:TexturePackerItem, i1:TexturePackerItem) {
            var w0= i0.getWidth();
            var h0= i0.getHeight();
            var w1= i1.getWidth();
            var h1= i1.getHeight();

            return SortStrategies.__compare(w0*h0, w1*h1);
        },

        width: function(i0:TexturePackerItem, i1:TexturePackerItem) {
            return SortStrategies.__compare(i0.getWidth(), i1.getHeight());
        },

        height: function(i0:TexturePackerItem, i1:TexturePackerItem) {
            return SortStrategies.__compare(i0.getWidth(), i1.getHeight());
        }

    };

    /**
     * @class cc.plugin.texture.TexturePackerNode
     * @classdesc
     *
     * This Object is a helper for a TexturePackerPage object. It represents a region on a packed image.
     * This object is a actually a binary tree.
     * It will either hold an Image, or two descendant nodes.
     *
     */
    export class TexturePackerNode {

        /**
         * x position in page.
         * @member cc.plugin.texture.TexturePackerNode#_x
         * @type {number}
         * @private
         */
        _x: number= 0;

        /**
         * y position in page.
         * @member cc.plugin.texture.TexturePackerNode#_y
         * @type {number}
         * @private
         */
        _y: number= 0;

        /**
         * node width in page.
         * @member cc.plugin.texture.TexturePackerNode#_width
         * @type {number}
         * @private
         */
        _width: number= 0;

        /**
         * node height in page.
         * @member cc.plugin.texture.TexturePackerNode#_height
         * @type {number}
         * @private
         */
        _height:number= 0;

        /**
         * Left child node.
         * @member cc.plugin.texture.TexturePackerNode#_left
         * @type {cc.plugin.texture.TexturePackerNode}
         * @private
         */
        _left: TexturePackerNode= null;

        /**
         * right child node.
         * @member cc.plugin.texture.TexturePackerNode#_right
         * @type {cc.plugin.texture.TexturePackerNode}
         * @private
         */
        _right:TexturePackerNode= null;

        /**
         * Item this node contains. The item is a pair of Image/Canvas and an id.
         * @member cc.plugin.texture.TexturePackerNode#_item
         * @type {{any,string}
         * @private
         */
        _item:TexturePackerItem= null;

        /**
         * Create anew TexturePackerNode object instance.
         * @method cc.plugin.texture.TexturePackerNode#constructor
         */
        constructor() {
        }

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
        insert( w:number, h:number, margin:number[] ) : TexturePackerNode {

            var marginw= margin[0]+margin[2];
            var marginh= margin[1]+margin[3];

            if ( this._left ) {
                var node:TexturePackerNode= this._left.insert( w, h, margin );
                return null===node ?
                    this._right.insert(w,h, margin) :
                    node;
            } else {

                // node has been assigned ? no further search
                if ( this._item!==null) {
                    return null;
                }

                // does not fit here
                if ( this._width<w || this._height<h ) {
                    // return signal to try in another node
                    return null;
                } else if ( this._width===w && this._height===h ) {
                    // perfect match. return this, w/o further dividing
                    return this;
                } else {

                    // create descendants
                    this._left= new TexturePackerNode();
                    this._right= new TexturePackerNode();

                    // when substracting the desired area, it is wider than taller ?
                    // create children maximizing available area.
                    if ( this._width-w >= this._height-h ) {

                        // divide vertically

                        this._left._x= this._x;
                        this._left._y= this._y;
                        this._left._width= w;
                        this._left._height= this._height;

                        //this._right._x= this._x + w;
                        this._right._x= this._x + w + marginw;
                        this._right._y= this._y;
                        //this._right._width= this._width - w;
                        this._right._width= this._width - w - marginw;
                        this._right._height= this._height;
                    } else {

                        // divide horizontally

                        this._left._x= this._x;
                        this._left._y= this._y;
                        this._left._width= this._width;
                        this._left._height= h;

                        this._right._x= this._x;
                        //this._right._y= this._y + h;
                        this._right._y= this._y + h + marginh;
                        this._right._width= this._width;
                        //this._right._height= this._height - h;
                        this._right._height= this._height - h - marginh;
                    }

                    return this._left.insert( w, h, margin );
                }

            }
        }

        /**
         * Paint this node and all its descendants.
         * @method cc.plugin.texture.TexturePackerNode#paint
         * @param ctx {CanvasRenderingContext2D}
         * @param margin {Array<number>=} an array describing a margin around the node. array index are: left, top, right, bottom
         * @param debug {boolean} draw debug info: a red crossed-rect for empty nodes, and a white rect around packed
         * images.
         */
        paint( ctx:CanvasRenderingContext2D, margin:number[], debug:boolean ) {

            if ( debug) {
                // DEBUG rects.

                if ( this._item ) {
                    ctx.strokeStyle = "#fff";
                    ctx.strokeRect(this._x + .5, this._y + .5, this._width - 1, this._height - 1);
                } else if ( !this._left ) {
                    ctx.strokeStyle = "#f00";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(this._x + .5, this._y + .5, this._width - 1, this._height - 1);
                    ctx.beginPath();
                    ctx.moveTo(this._x + .5, this._y + .5);
                    ctx.lineTo( this._x+this._width - .5, this._y+this._height - .5);
                    ctx.moveTo(this._x + this._width - .5, this._y + .5);
                    ctx.lineTo( this._x + .5, this._y + this._height - .5);
                    ctx.stroke();
                }
                //ctx.strokeStyle="#0f0";
                //ctx.lineWidth= margin[0];
                //ctx.st rokeRect( this._x+margin[0], this._y+margin[1], this._width-margin[0]-margin[2], this._height-margin[1]-margin[3] );
            }

            if ( this._item ) {
                this._item.draw( ctx, this._x, this._y );
            }

            if ( this._left ) {
                this._left.paint(ctx, margin, debug);
            }
            if ( this._right ) {
                this._right.paint(ctx, margin, debug);
            }
        }

        /**
         * Create and add to the AssetManager a SpriteFrame for each node in the tree that has an associated image.
         * The SpriteFrames will be created using the SpriteFrame that corresponds to the textureId parameter.
         * @method cc.plugin.texture.TexturePackerNode#createFrames
         * @param textureId {string}
         */
        createFrames( textureId:string ) {
            if ( this._item ) {
                cc.plugin.asset.AssetManager.addSpriteFrame(
                    cc.plugin.asset.AssetManager.getSpriteFrame(textureId).createSubSpriteFrame(
                    this._x, this._y,
                    this._width, this._height,
                    this._item.getId()
                ));
            }

            if ( this._left ) {
                this._left.createFrames(textureId);
            }
            if ( this._right ) {
                this._right.createFrames(textureId);
            }
        }
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
    export class TexturePackerPage {

        /**
         * Canvas with packer images.
         * @member cc.plugin.texture.TexturePackerPage#_canvas
         * @type {null}
         * @private
         */
        _canvas:HTMLCanvasElement= null;

        /**
         * Canvas rendering context.
         * @member cc.plugin.texture.TexturePackerPage#_ctx
         * @type {CanvasRenderingContext2D}
         * @private
         */
        _ctx:CanvasRenderingContext2D= null;

        /**
         * Page width.
         * @member cc.plugin.texture.TexturePackerPage#_width
         * @type {number}
         * @private
         */
        _width:number;

        /**
         * Page height.
         * @member cc.plugin.texture.TexturePackerPage#_height
         * @type {number}
         * @private
         */
        _height:number;

        /**
         * Page id.
         * When assets are created, the page texture will be added to the SpriteFrame assets map with this id.
         * @member cc.plugin.texture.TexturePackerPage#_id
         * @type {string}
         * @private
         */
        _id:string;

        /**
         * This tree keeps the regions for each image.
         * @member {cc.plugin.texture.TexturePackerPage#_root}
         * @type {cc.plugin.texture.TexturePackerNode}
         * @private
         */
        _root:TexturePackerNode= null;

        /**
         * Create a new TexturePackerPage object instance.
         * @method {cc.plugin.texture.TexturePackerPage#constructor}
         * @param id {string}
         * @param w {number}
         * @param h {number}
         */
        constructor( id:string, w:number, h:number ) {
            this._id= id;
            this._width= w;
            this._height= h;

            this._root= new TexturePackerNode();
            this._root._width= w;
            this._root._height= h;
        }

        /**
         * Insert an image in the best place for it in the node's tree.
         * @method {cc.plugin.texture.TexturePackerPage#insertImage}
         * @param item {{any,string}} a pair of image/canvas and an id
         * @param margin {Array<number>=} an array describing a margin around the node. array index are: left, top, right, bottom
         * @returns {cc.plugin.texture.TexturePackerNode}
         */
        insertImage( item:TexturePackerItem, margin:number[] ) : TexturePackerNode {
            var node= this._root.insert( item.getWidth(), item.getHeight(), margin );
            if (null!==node) {
                node._item= item;
            }

            return node;
        }

        /**
         * Create page's assets and adds them to the AssetManager.
         * @method cc.plugin.texture.TexturePackerPage#createAssets
         */
        createAssets( margin:number[], debug:boolean ) {

            // create a canvas.
            this._canvas= document.createElement("canvas");
            this._canvas.width= this._width;
            this._canvas.height= this._height;
            this._ctx= this._canvas.getContext("2d");

            // draw nodes.
            this._root.paint( this._ctx, margin, debug );

            // create texture
            cc.plugin.asset.AssetManager.addImage( this._canvas, this._id );

            // add all SpriteFrames
            this._root.createFrames( this._id );
        }
    }

    /**
     * Internal object to keep a pair of Image and Id.
     */
    export interface TexturePackerItem {

        getId() : string;
        getWidth() : number;
        getHeight() : number;
        fits( w:number, h:number ) : boolean;
        draw( ctx:CanvasRenderingContext2D, x:number, y:number);
    }

    class TexturePackerItemImage implements TexturePackerItem {

        constructor( public image:any, public id:string ) {
        }

        getId() : string {
            return this.id;
        }

        getWidth() {
            return this.image.width;
        }

        getHeight() {
            return this.image.height;
        }

        fits( w:number, h:number ) : boolean {
            return this.image.width<=w && this.image.height<=h;
        }

        draw( ctx:CanvasRenderingContext2D, x:number, y:number ) {
            ctx.drawImage( this.image, x, y );
        }
    }

    class TexturePackerItemSpriteFrame implements TexturePackerItem {

        constructor( public frame:cc.node.sprite.SpriteFrame, public id:string ) {
        }

        getId() : string {
            return this.id;
        }

        getWidth() {
            return this.frame.getWidth();
        }

        getHeight() {
            return this.frame.getHeight();
        }

        fits( w:number, h:number ) : boolean {
            return this.frame.getWidth()<=w && this.frame.getHeight()<=h;
        }

        draw( ctx:CanvasRenderingContext2D, x:number, y:number ) {

            ctx.save();

            var w= this.frame.getWidth();
            var h= this.frame.getHeight();
            var rect= this.frame._rect;

            if (this.frame._rotated) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.translate(-w / 2, -h / 2);
            }

            //if ( cc.render.RENDER_ORIGIN==="" )
            ctx.drawImage(
                this.frame._texture._image,
                rect.x, rect.y, rect.w, rect.h,
                x, y, w, h);

            ctx.restore();
        }
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
    export class TexturePacker {

        /**
         * An array of pair Image,id with images to pack.
         * @member cc.plugin.texture.TexturePacker#_images
         * @type {Array<{any,string}>}
         * @private
         */
        _images:TexturePackerItem[] = [];

        /**
         * An array of generated texture page object.
         * @member cc.plugin.texture.TexturePacker#_pages
         * @type {Array<cc.plugin.texture.TexturePackerPage>}
         * @private
         */
        _pages: TexturePackerPage[] = [];

        _margin: number[]= [0,0,0,0];

        _debug: boolean= false;

        /**
         * Create a new TexturePacker object instance.
         * @method cc.plugin.texture.TexturePacker#constructor
         */
        constructor() {

        }

        /**
         * Add an image with associated id to pack.
         * @method cc.plugin.texture.TexturePacker#addImage
         * @param image {HTMLImageElement|HTMLCanvasElement}
         * @param id {string}
         */
        addImage( image:any, id?:string ) {
            this._images.push( new TexturePackerItemImage( image, id ? id : image.src ) );
        }

        addSpriteFrame( spriteFrame:cc.node.sprite.SpriteFrame ) {
            this._images.push( new TexturePackerItemSpriteFrame( spriteFrame, spriteFrame._name ) );
        }

        addSpriteFrames( spriteFrames:cc.node.sprite.SpriteFrame[] ) {
            for( var i=0; i<spriteFrames.length; i++ ) {
                this.addSpriteFrame( spriteFrames[i] );
            }
        }

        addPListAtlas( image:any, atlasInfo:any ) {
            var main= new cc.node.sprite.SpriteFrame( new cc.render.Texture2D(image, "") );
            var sf:cc.node.sprite.SpriteFrame[]= main.createSpriteFramesFromPLIST(atlasInfo);
            this.addSpriteFrames(sf);
        }

        addJSONAtlas( image:any, atlasInfo:any ) {
            var main= new cc.node.sprite.SpriteFrame( new cc.render.Texture2D(image, "") );
            var sf:cc.node.sprite.SpriteFrame[]= main.createSpriteFramesFromJSON(atlasInfo);
            this.addSpriteFrames(sf);
        }

        /**
         * Pack images.
         * This method ONLY creates the internal TexturePackerPage nodes, not the images.
         * Images will be packed in pages of the specified size.
         * @method cc.plugin.texture.TexturePacker#pack
         * @param pack {cc.plugin.texture.PackInfo} texture packer packing info.
         */
        pack( pack:PackInfo  ) {

            var w= pack.width || 2048;
            var h= pack.height || 2048;
            var sortStrategy= pack.sortBy;
            var margin_v= pack.margin || 0;

            // left top right bottom
            var margin= [ margin_v, margin_v, margin_v, margin_v ];
            if ( pack['margin-left'] ) {
                margin[0]= pack['margin-left'];
            }
            if ( pack['margin-top'] ) {
                margin[1]= pack['margin-top'];
            }
            if ( pack['margin-right'] ) {
                margin[2]= pack['margin-right'];
            }
            if ( pack['margin-bottom'] ) {
                margin[3]= pack['margin-bottom'];
            }

            this._debug= typeof pack.debug!=="undefined" ? pack.debug : false;

            this._margin= margin;
            this._pages= [];

            if ( sortStrategy ) {
                var ss= SortStrategies[sortStrategy] || SortStrategies['perimeter'];
                this._images.sort( ss );
            }

            this._pages.push( new TexturePackerPage( "texturepage"+getTexturePageIndex(), w,h ) );

            for( var i=0; i<this._images.length; i++ ) {
                if ( this._images[i].fits(w,h) ) {

                    var node:TexturePackerNode = null;
                    for( var j=0; j<this._pages.length; j++ ) {
                        node= this._pages[j].insertImage( this._images[i], margin );
                        if (node!==null) {
                            break;
                        }
                    }

                    // not a valid insertion node in the currently created pages.
                    // create a new one (the image fits in page dimensions after all)
                    if ( null===node ) {
                        var newPage:TexturePackerPage= new TexturePackerPage( "texturepage"+getTexturePageIndex(),w,h );
                        this._pages.push( newPage );
                        newPage.insertImage(this._images[i], margin);
                    }
                }
            }
        }

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
        createAssets() {
            for( var i=0; i<this._pages.length; i++ ) {
                this._pages[i].createAssets( this._margin, this._debug );
            }
        }
    }
}