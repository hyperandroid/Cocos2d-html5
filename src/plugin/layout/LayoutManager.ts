/**
 * License: see license.txt file.
 */

/// <reference path="../../math/Rectangle.ts"/>
/// <reference path="../../math/Dimension.ts"/>

module cc.plugin.layout {

    export type UnitValue= number|string;

    /**
     * @interface cc.plugin.layout.BaseLayoutInitializer
     * @classdesc
     *
     * Initializer object for a common layout.
     *
     */
    export interface BaseLayoutInitializer {

        /**
         * type of the layout, currently: 'element', 'border', 'grid'
         * @member cc.plugin.layout.BaseLayoutInitializer#type
         * @type {string}
         */
        type :              string;

        /**
         * Layout element name
         * @member cc.plugin.layout.BaseLayoutInitializer#name
         * @type {string=}
         */
        name? :             string;

        /**
         * Preferred width. Has Unit notation, so values like '10px' or '20%' are valid.
         * @member cc.plugin.layout.BaseLayoutInitializer#preferredWidth
         * @type {string=}
         */
        preferredWidth? :   string;

        /**
         * Preferred height. Has Unit notation, so values like '10px' or '20%' are valid.
         * @member cc.plugin.layout.BaseLayoutInitializer#preferredHeight
         * @type {string=}
         */
        preferredHeight? :  string;

        /**
         * Element insets.
         * An array of four strings representing insets for: left, top, right, bottom respectively.
         * Unit notation.
         * @member cc.plugin.layout.BaseLayoutInitializer#insets
         * @type {Array<string>=}
         */
        insets? :           string[];

        /**
         * Element gap.
         * An array of two strings representing element separation for horizontal and vertical respectively.
         * Unit notation.
         * @member cc.plugin.layout.BaseLayoutInitializer#gap
         * @type {Array<string>=}
         */
        gap? :              string[];

        /**
         * Array of other layout initializer objects.
         * @member cc.plugin.layout.BaseLayoutInitializer#elements
         * @type {Array<cc.plugin.layout.BaseLayoutInitializer>} any layout initializer.
         */
        elements? :         BaseLayoutInitializer[];
    }

    /**
     * @interface GridLayoutInitializer
     * @extends BaseLayoutInitializer
     * @classdesc
     *
     * Initializer object for a grid layout
     *
     */
    export interface GridLayoutInitializer extends BaseLayoutInitializer {

        /**
         * Set the grid to grow in columns every number of rows.
         * @member cc.plugin.layout.GridLayoutInitializer#rows
         * @type {number=}
         */
        rows? :     number;

        /**
         * Set the grid to grow in rows every number of columns.
         * @member cc.plugin.layout.GridLayoutInitializer#columns
         * @type {number=}
         */
        columns? :  number;
    }

    /**
     * @interface BorderLayoutInitializer
     * @extends BaseLayoutInitializer
     * @classdesc
     *
     * Initializer for a border layout
     */
    export interface BorderLayoutInitializer extends BaseLayoutInitializer {

        /**
         * Left element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#left
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        left? :     BaseLayoutInitializer;

        /**
         * Right element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#right
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        right? :    BaseLayoutInitializer;

        /**
         * Top element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#top
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        top? :      BaseLayoutInitializer;

        /**
         * Bottom element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#bottom
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        bottom? :   BaseLayoutInitializer;

        /**
         * Center element initializer.
         * @member cc.plugin.layout.BorderLayoutInitializer#center
         * @type {cc.plugin.layout.BaseLayoutInitializer=}
         */
        center? :   BaseLayoutInitializer;
    }

    /**
     * @class cc.plugin.layout.Unit
     * @classdesc
     *
     * This class encapsulates a value in a given unit.
     * Currently, it could be a number, or a percentage value.
     * If the value is a percentage, a call to <code>getValue</code> needs a reference value.
     */
    export class Unit {

        /**
         * Unit value.
         * @member cc.plugin.layout.Unit#_orgValue
         * @type {number}
         * @private
         */
        _orgValue:number= 0;

        /**
         * Unit type. Either px, %, or nothing.
         * @member cc.plugin.layout.Unit#_orgType
         * @type {string}
         * @private
         */
        _orgType:string= "";

        /**
         * Create a new Unit object instance.
         * @method cc.plugin.layout.Unit#constructor
         * @param original {string=} Unit value. if not set, the unit it set to 0.
         */
        constructor( original?:string ) {

            if ( typeof original!=='undefined' ) {
                this.setValue(original);
            }
        }

        /**
         * Set the unit value. For example '2%', '100px', '100'
         * @method cc.plugin.layout.Unit#setValue
         * @param original {string}
         */
        setValue( original:UnitValue ) {
            var exp:RegExp= new RegExp("\\d+\\.?\\d*(.*)","gi");
            var m= exp.exec(""+original);
            if ( m ) {
                this._orgType=m[1];
                this._orgValue=parseInt(m[0]);
            }
        }

        /**
         * Get the unit value.
         * If the unit type is percentage, and no reference value is supplied, zero will be returned as value.
         * @method cc.plugin.layout.Unit#getValue
         * @param ref {number=} percentage reference value.
         * @returns {number}
         */
        getValue( ref?:number ) {

            switch( this._orgType ) {
                case "":
                    return this._orgValue;
                case "px":
                    return this._orgValue;
                case "%":
                    return typeof ref!=="undefined" ? this._orgValue/100*ref : 0;
            }
        }
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
    export class Insets {

        /**
         * Layout element left inset Unit.
         * @member cc.plugin.layout.Insets#left
         * @type {cc.plugin.layout.Unit}
         */
        left: Unit= new Unit();

        /**
         * Layout element top inset Unit.
         * @member cc.plugin.layout.Insets#top
         * @type {cc.plugin.layout.Unit}
         */
        top: Unit= new Unit();

        /**
         * Layout element right inset Unit.
         * @member cc.plugin.layout.Insets#right
         * @type {cc.plugin.layout.Unit}
         */
        right: Unit= new Unit();

        /**
         * Layout element bottom inset Unit.
         * @member cc.plugin.layout.Insets#bottom
         * @type {cc.plugin.layout.Unit}
         */
        bottom: Unit= new Unit();
    }

    /**
     * @class cc.plugin.layout.Gap
     * @classdesc
     *
     * This object describes the separation values between two adjacent layout elements.
     * For example, for a grid, describes the Units to separate the grid elements.
     */
    export class Gap {

        /**
         * Horizontal gap Unit.
         * @member cc.plugin.layout.Gap#horizontal
         * @type {cc.plugin.layout.Unit}
         */
        horizontal: Unit= new Unit();

        /**
         * Vertical gap Unit.
         * @member cc.plugin.layout.Gap#vertical
         * @type {cc.plugin.layout.Unit}
         */
        vertical: Unit= new Unit();
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
    export class BaseLayout {

        /**
         * Resulting bounds after applying the layout rules.
         * @member cc.plugin.layout.BaseLayout#_bounds
         * @type {cc.math.Rectangle}
         * @private
         */
        _bounds:cc.math.Rectangle= null;

        /**
         * The layout insets. Insets will reduce the bounds area by setting a padding for the element.
         * @member cc.plugin.layout.BaseLayout#_insets
         * @type {cc.plugin.layout.Insets}
         * @private
         */
        _insets : Insets = null;

        /**
         * Separation between each layout elements. Not all layout will use this value.
         * @member cc.plugin.layout.BaseLayout#_gap
         * @type {cc.plugin.layout.Gap}
         * @private
         */
        _gap : Gap = null;

        /**
         * Array of elements to lay out. Since layouts are nestable, children are layout instances as well.
         * @member cc.plugin.layout.BaseLayout#_children
         * @type {Array<cc.plugin.layout.BaseLayout>}
         * @private
         */
        _children : BaseLayout[]= [];

        /**
         * Layout preferred width Unit hint.
         * @member cc.plugin.layout.BaseLayout#_preferredWidth
         * @type {cc.plugin.layout.Unit}
         * @private
         */
        _preferredWidth : Unit= null;

        /**
         * Layout preferred height Unit hint.
         * @member cc.plugin.layout.BaseLayout#_preferredHeight
         * @type {cc.plugin.layout.Unit}
         * @private
         */
        _preferredHeight: Unit= null;

        /**
         * Optional layout identifier.
         * This is useful so that a node tag or name can be matched against this layout element.
         * @member cc.plugin.layout.BaseLayout#_name
         * @type {string}
         * @private
         */
        _name: string= '';

        /**
         * Create a new BaseLayout object instance.
         * Do not create directly, only by subclasses.
         * @method cc.plugin.layout.BaseLayout#constructor
         */
        constructor() {
            this._bounds= new cc.math.Rectangle();
            this._insets= new Insets();
            this._gap= new Gap();
            this._preferredWidth= new Unit();
            this._preferredHeight= new Unit();
        }

        /**
         * Parse a layout initializer object to get a layout element object.
         * @param layout {string|cc.plugin.layout.BaseLayoutInitializer} a layout initializer object, or a string.
         *   If a string is set, a BaseLayout object will be used.
         */
        static parse( layout:string|BaseLayoutInitializer ) : BaseLayout {

            if (typeof layout==="string") {
                return new BaseLayout().parse({
                    type: 'element',
                    name: <string>layout
                });
            } else if (layout.type === "element") {
                return new BaseLayout().parse(layout);
            } else if (layout.type === "border") {
                return new BorderLayout().parse(layout);
            } else if (layout.type === "layer") {
                return new LayerLayout().parse(layout);
            } else if (layout.type === "grid") {
                return new GridLayout().parse(layout);
            } else {
                console.log("unknown layout type: "+layout.type);
            }
        }

        /**
         * Helper method to visually see the layout result.
         * @method cc.plugin.layout.BaseLayout#paint
         * @param ctx {CanvasRenderingContext2D}
         */
        paint( ctx:CanvasRenderingContext2D ) {
            //ctx.setTransform(1,0,0,1,0,0);
            ctx.strokeRect( this._bounds.x, this._bounds.y, this._bounds.w, this._bounds.h );
            for( var i=0; i<this._children.length; i++ ) {
                this._children[i].paint(ctx);
            }
        }

        /**
         * Set the layout bounds.
         * @method cc.plugin.layout.BaseLayout#setBounds
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        setBounds( x:number, y:number, w:number, h:number ) {
            this._bounds.set(x,y,w,h);
        }

        /**
         * Set the layout size.
         * @method cc.plugin.layout.BaseLayout#setSize
         * @param w {number}
         * @param h {number}
         */
        setSize( w:number, h:number ) {
            this._bounds.w= w;
            this._bounds.h=h;
        }

        /**
         * Set the layout preferred size Unit hints.
         * @param w {number|string}
         * @param h {number|string}
         */
        setPreferredSize( w:UnitValue, h:UnitValue ) {
            this._preferredWidth.setValue( w );
            this._preferredHeight.setValue( h );
        }

        /**
         * Get the element preferredSize.
         * The size units are evaluated, so if they are percentage, the value is recalculated now again.
         * @method cc.plugin.layout.BaseLayout#getPreferredSize
         * @returns {cc.math.Dimension}
         */
        getPreferredSize() : cc.math.Dimension {
            return new cc.math.Dimension(
                    this._preferredWidth.getValue( this._bounds.w ),
                    this._preferredHeight.getValue( this._bounds.h ) );
        }

        /**
         * Recursively evaluate the layout elements and get the resulting preferred size.
         * This does not take into account the size constraints, will get the desired size.
         * In this object, the implementation returns the result of the preferredSize Unit hints + Insets.
         * @method cc.plugin.layout.BaseLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize() : cc.math.Dimension {
            var ps= this.getPreferredSize();
            this.adjustWithInsets(ps);

            return ps;
        }

        /**
         * Evaluate the layout with the current size constraints. The root layout element bounds will be used
         * as size constraint.
         * @method cc.plugin.layout.BaseLayout#doLayout
         */
        doLayout() {

            var d= new cc.math.Dimension();
            this.adjustWithInsets(d);
            this._bounds.w-= d.width;
            this._bounds.h-= d.height;
            this._bounds.x+= d.width/2;
            this._bounds.y+= d.height/2;
        }

        /**
         * Set size constraints and evaluate the layout.
         * The result will be all layout elements have assigned a bounds.
         * @method cc.plugin.layout.BaseLayout#layout
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         */
        layout( x:number, y:number, w:number, h:number ) {
            this.setBounds(x,y,w,h);
            this.doLayout();
        }

        /**
         * Parse a layout definition object.
         * This will get all the common layout properties: insets, gap, preferred size and elements.
         * @method cc.plugin.layout.BaseLayout#parse
         * @param layoutInfo {cc.plugin.layout.BaseLayoutInitializer}
         * @returns {cc.plugin.layout.BaseLayout}
         */
        parse( layoutInfo:BaseLayoutInitializer ) : BaseLayout {

            if ( typeof layoutInfo.insets!=='undefined' ) {

                var arr:UnitValue[]= <UnitValue[]>layoutInfo.insets;
                if ( arr.length!==4 ) {
                    console.log("wrong defined insets: "+arr);
                }

                this._insets.left.setValue(layoutInfo.insets[0]);
                this._insets.right.setValue(layoutInfo.insets[2]);
                this._insets.top.setValue(layoutInfo.insets[1]);
                this._insets.bottom.setValue(layoutInfo.insets[3]);
            }

            if ( typeof layoutInfo.gap!=='undefined' ) {

                var arr:UnitValue[]= <UnitValue[]>layoutInfo.gap;
                if ( arr.length!==2 ) {
                    console.log("wrong defined gap: "+arr);
                }

                this._gap.horizontal.setValue(layoutInfo.gap[0]);
                this._gap.vertical.setValue(layoutInfo.gap[1]);
            }

            if ( typeof layoutInfo.preferredWidth!=='undefined' ) {
                this._preferredWidth.setValue(layoutInfo.preferredWidth);
            }
            if ( typeof layoutInfo.preferredHeight!=='undefined' ) {
                this._preferredHeight.setValue(layoutInfo.preferredHeight);
            }

            if ( typeof layoutInfo.name!=='undefined' ) {
                this._name= layoutInfo.name;
            }

            if ( typeof layoutInfo.elements!=='undefined' ) {
                if ( Object.prototype.toString.call( layoutInfo.elements ) === '[object Array]' ) {
                    this.parseElements(layoutInfo.elements);
                } else {
                    console.log("Layout elememts block is not array.");
                }
            }
            return this;
        }

        /**
         * Parse the elements block from the layout initializer object.
         * @method cc.plugin.layout.BaseLayout#parseElements
         * @param children {Array<object>}
         */
        parseElements( children:Array<any> ) {

            var me= this;

            function addElement( s:string|BaseLayoutInitializer ) {

                var elem:BaseLayout = cc.plugin.layout.BaseLayout.parse(s);
                if (elem) {
                    me._children.push(elem);
                } else {

                }

            }

            for( var i=0; i<children.length; i++ ) {

                if ( typeof children[i]==='string' ) {

                    var elem:string= <string>children[i];

                    // is elem of the form text[...] ?
                    if ( elem.indexOf('[')!==-1 && elem.indexOf(']')!==-1 ) {
                        var exp= new RegExp("(.*)\\[(.*)\\]","gi");
                        var m= exp.exec( elem );
                        var prefix:string= m[1];
                        var pattern:string[]= m[2].split('-');

                        if ( pattern.length===2 ) {

                            var from:number= parseInt( pattern[0] );
                            var to:number= parseInt( pattern[1] );

                            while( from <= to ) {
                                addElement( prefix+from );
                                from++;
                            }

                        } else {
                            /// wrong pattern ?!?!?!?!?
                            console.log("wrong pattern for element by name: "+elem );
                            addElement( elem );
                        }
                    } else {
                        // not name pattern.
                        addElement( elem );
                    }

                } else {

                    addElement( children[i] );
                }
            }
        }

        /**
         * Add an element layout to this layout object.
         * @param e {cc.plugin.layout.BaseLayout}
         * @param constraint {string=} a constraint to add an element. For example, BorderLayout requires a position hint
         *      to add an element.
         */
        addElement( e:BaseLayout, constraint?:string ) {
            this._children.push(e);
        }

        /**
         * Helper method to add the Inset object value to a Dimension.
         * @method cc.plugin.layout.BaseLayout#adjustWithInsets
         * @param d
         */
        adjustWithInsets( d:cc.math.Dimension ) {
            d.width+= this._insets.left.getValue( this._bounds.w ) + this._insets.right.getValue( this._bounds.w );
            d.height+= this._insets.top.getValue( this._bounds.h ) + this._insets.bottom.getValue( this._bounds.h );
        }

        /**
         * Recursively traverse the layout elements and, if a layout element has name, find a node with that name
         * and then set the found node's position to the layout calculated position. If resize is set to true,
         * the found node's content size will be set to the layout calculated size.
         * The node is searched in the _node parameter or any of its children.
         * @param _node {cc.node.Node} the node to traverse to find a node with a layout name
         * @param resize {boolean} change de node size to that of the calculated layout ?
         */
        applyToNode( _node:cc.node.Node, resize:boolean ) {

            if (!_node ) {
                return;
            }

            if ( this._name!=="" ) {
                _node.enumerateChildren(this._name, ( node:cc.node.Node ) => {
                    node.setPosition( this._bounds.x, this._bounds.y );
                    if ( resize ) {
                        node.setContentSize( this._bounds.w, this._bounds.h );
                    }
                });
            }

            for( var i=0; i<this._children.length; i++ ) {
                this._children[i].applyToNode( _node, resize );
            }
        }
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
    export class BorderLayout extends BaseLayout {

        /**
         * Left layout element.
         * @member cc.plugin.layout.BorderLayout#_left
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _left:BaseLayout =    null;

        /**
         * Right layout element.
         * @member cc.plugin.layout.BorderLayout#_right
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _right:BaseLayout =   null;

        /**
         * Top layout element.
         * @member cc.plugin.layout.BorderLayout#_top
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _top:BaseLayout =     null;

        /**
         * Bottom layout element.
         * @member cc.plugin.layout.BorderLayout#_bottom
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _bottom:BaseLayout =  null;

        /**
         * Center layout element.
         * @member cc.plugin.layout.BorderLayout#_center
         * @type {cc.plugin.layout.BaseLayout}
         * @private
         */
        _center:BaseLayout =  null;

        /**
         * Build a new BorderLayout object instance
         * @method cc.plugin.layout.BorderLayout#constructor
         */
        constructor() {
            super();
        }

        /**
         * Get the preferred layout size after recursively applying the layout. The size will be the preferred size,
         * not the actual size.
         * @method cc.plugin.layout.BorderLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize() : cc.math.Dimension {

            var ret:cc.math.Dimension= new cc.math.Dimension();

            var d:cc.math.Dimension;

            if ( this._left ) {
                d= this._left.getPreferredLayoutSize();
                ret.width+= d.width + this._gap.horizontal.getValue( this._bounds.w );
                ret.height= Math.max( d.height, ret.height );
            }

            if ( this._right ) {
                d= this._right.getPreferredLayoutSize();
                ret.width+= d.width + this._gap.horizontal.getValue( this._bounds.w );
                ret.height= Math.max( d.height, ret.height );
            }

            if ( this._center ) {
                d= this._center.getPreferredLayoutSize();
                ret.width+= d.width;
                ret.height= Math.max( d.height, ret.height );
            }

            if ( this._top ) {
                d= this._top.getPreferredLayoutSize();
                ret.height+= d.height + this._gap.vertical.getValue( this._bounds.h );
                ret.width= Math.max( ret.width, d.width );
            }

            if ( this._bottom ) {
                d= this._bottom.getPreferredLayoutSize();
                ret.height+= d.height + this._gap.vertical.getValue( this._bounds.h );
                ret.width= Math.max( ret.width, d.width );
            }

            this.adjustWithInsets( d );

            var pd= this.getPreferredSize();
            d.width= Math.max( d.width, pd.width );
            d.height= Math.max( d.width, pd.height );

            return d;
        }

        /**
         * Set the left layout element.
         * @method cc.plugin.layout.BorderLayout#left
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        left( e:BaseLayout ) : BorderLayout {
            this._children.push(e);
            this._left= e;
            return this;
        }

        /**
         * Set the right layout element.
         * @method cc.plugin.layout.BorderLayout#right
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        right( e:BaseLayout ) : BorderLayout {
            this._children.push(e);
            this._right= e;
            return this;
        }

        /**
         * Set the top layout element.
         * @method cc.plugin.layout.BorderLayout#top
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        top( e:BaseLayout ) : BorderLayout {
            this._children.push(e);
            this._top= e;
            return this;
        }

        /**
         * Set the bottom layout element.
         * @method cc.plugin.layout.BorderLayout#bottom
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        bottom( e:BaseLayout ) : BorderLayout {
            this._children.push(e);
            this._bottom= e;
            return this;
        }

        /**
         * Set the center layout element.
         * @method cc.plugin.layout.BorderLayout#center
         * @param e {cc.plugin.layout.BaseLayout}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        center( e:BaseLayout ) : BorderLayout {
            this._children.push(e);
            this._center= e;
            return this;
        }

        /**
         * Parse the BorderLayout.
         * @method cc.plugin.layout.BorderLayout#parse
         * @param layoutInfo {cc.plugin.layout.BorderLayoutInitializer}
         * @returns {cc.plugin.layout.BorderLayout}
         */
        parse( layoutInfo:BorderLayoutInitializer ) : BorderLayout {

            super.parse(layoutInfo);

            if ( typeof layoutInfo.left!=="undefined" ) {
                this.left( cc.plugin.layout.BaseLayout.parse( layoutInfo.left ) );
            }
            if ( typeof layoutInfo.right!=="undefined" ) {
                this.right( cc.plugin.layout.BaseLayout.parse( layoutInfo.right ) );
            }
            if ( typeof layoutInfo.bottom!=="undefined" ) {
                this.bottom( cc.plugin.layout.BaseLayout.parse( layoutInfo.bottom ) );
            }
            if ( typeof layoutInfo.top!=="undefined" ) {
                this.top( cc.plugin.layout.BaseLayout.parse( layoutInfo.top ) );
            }
            if ( typeof layoutInfo.center!=="undefined" ) {
                this.center( cc.plugin.layout.BaseLayout.parse( layoutInfo.center ) );
            }

            return this;
        }

        /**
         * Add an element to the layout. Since this layout only allows for 5 specific elements, an adding constraint
         * must be used.
         * @method cc.plugin.layout.BorderLayout#addElement
         * @param e {cc.plugin.layout.BaseLayout}
         * @param constraint {string} must exist. a value from 'top','bottom','left','right' or 'center'.
         */
        addElement( e:BaseLayout, constraint?:string ) {
            if ( typeof this[constraint]!=='undefined' ) {
                this[constraint](e);
            } else {
                console.log("wrong border layout constraint.");
            }
        }

        /**
         * Do the actual lay out process. Elements will fit into the previously set element bounds.
         * @method cc.plugin.layout.BorderLayout#doLayout
         */
        doLayout() {

            var left= this._bounds.x + this._insets.left.getValue( this._bounds.w );
            var top= this._bounds.y + this._insets.top.getValue( this._bounds.h );
            var right= this._bounds.x1 - this._insets.right.getValue( this._bounds.w );
            var bottom= this._bounds.y1 - this._insets.bottom.getValue( this._bounds.h );

            var d:cc.math.Dimension;

            if ( this._top ) {
                this._top.setSize(right - left, this._top._bounds.h);
                d = this._top.getPreferredLayoutSize();
                this._top._bounds.set( left, top, right-left, d.height );
                this._top.doLayout();
                top+= d.height + this._gap.vertical.getValue( this._bounds.h );
            }
            if ( this._bottom ) {
                this._bottom.setSize(right - left, this._bottom._bounds.h);
                d = this._bottom.getPreferredLayoutSize();
                this._bottom._bounds.set(left, bottom - d.height, right-left, d.height);
                this._bottom.doLayout( );
                bottom-= d.height + this._gap.vertical.getValue( this._bounds.h );
            }
            if ( this._right ) {
                this._right.setSize(this._right._bounds.w, bottom - top);
                d = this._right.getPreferredLayoutSize();
                this._right._bounds.set(right - d.width, top, d.width, bottom-top);
                this._right.doLayout( );
                right-= d.width + this._gap.horizontal.getValue( this._bounds.w );
            }
            if ( this._left ) {
                this._left.setSize(this._left._bounds.w, bottom - top);
                d = this._left.getPreferredLayoutSize();
                this._left._bounds.set(left, top, d.width, bottom-top );
                this._left.doLayout();
                left+= d.width + this._gap.horizontal.getValue( this._bounds.w );
            }
            if ( this._center ) {
                this._center._bounds.set(left, top, right-left, bottom-top);
                this._center.doLayout( );
            }

        }
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
    export class GridLayout extends BaseLayout {

        /**
         * Lay out in rows or columns.
         * @member cc.plugin.layout.GridLayout#_layoutRows
         * @type {boolean}
         * @private
         */
        _layoutRows:boolean= false;

        /**
         * Elements to layout before adding a row or column.
         * @member cc.plugin.layout.GridLayout#_numElements
         * @type {number}
         * @private
         */
        _numElements:number= 0;

        /**
         * Calculated number of rows for the current added elements.
         * @member cc.plugin.layout.GridLayout#_rows
         * @type {number}
         * @private
         */
        _rows:number= 0;

        /**
         * Calculated number of columns for the current added elements.
         * @member cc.plugin.layout.GridLayout#_columns
         * @type {number}
         * @private
         */
        _columns:number= 0;

        /**
         * Create a new GridLayout object instance.
         * @method cc.plugin.layout.GridLayout#constructor
         */
        constructor() {
            super();
        }

        /**
         * Parse the grid info.
         * @method cc.plugin.layout.GridLayout#parse
         * @param layoutInfo {cc.plugin.layout.GridLayoutInitializer}
         * @returns {cc.plugin.layout.GridLayout}
         */
        parse( layoutInfo:GridLayoutInitializer ) : GridLayout {
            super.parse(layoutInfo);

            if ( typeof layoutInfo.rows!=='undefined' ) {
                this._layoutRows= true;
                this._numElements= <number>layoutInfo.rows;
            }

            if ( typeof layoutInfo.columns!=='undefined' ) {
                this._layoutRows= false;
                this._numElements= <number>layoutInfo.columns;
            }

            if ( !this._numElements ) {
console.log("bug bug grid info wrong defined.");
            }

            return this;
        }

        /**
         * Get the preferred layout elements size. The preferred size will be the adjusted to the biggest element's
         * preferred size, adding the gap for each of the layout elements.
         * Finally, the insets will be added to the size.
         * @method cc.plugin.layout.GridLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize() : cc.math.Dimension {

            var rows=0;
            var columns=0;

            var ret= new cc.math.Dimension();

            if ( this._layoutRows ) {
                rows= this._numElements;
                columns= ((rows + this._children.length - 1)/rows)>>0;

            } else {
                columns= this._numElements;
                rows= ((columns + this._children.length - 1)/columns)>>0;
            }

            for( var i=0; i<this._children.length; i++ ) {

                var d= this._children[i].getPreferredLayoutSize();
                if ( d.width > ret.width ) {
                    ret.width= d.width;
                }
                if ( d.height > ret.height ) {
                    ret.height= d.height;
                }
            }



            this.adjustWithInsets(d);

            d.width+=  columns * ret.width  + (columns - 1) * this._gap.horizontal.getValue( this._bounds.w );
            d.height+= rows    * ret.height + (rows - 1)    * this._gap.vertical.getValue(   this._bounds.h );

            var pd= this.getPreferredSize();
            d.width= Math.max( d.width, pd.width );
            d.height= Math.max( d.width, pd.height );


            this._rows= rows;
            this._columns= columns;

            return d;
        }

        /**
         * Do the actual elements lay out. The size of each element will be constrained to the element's bound.
         * @method cc.plugin.layout.GridLayout#doLayout
         */
        doLayout() {


            if (!this._children.length) {
                return;
            }

            var rows, columns;

            if ( this._layoutRows ) {
                rows= this._numElements;
                columns= ((rows + this._children.length - 1)/rows)>>0;

            } else {
                columns= this._numElements;
                rows= ((columns + this._children.length - 1)/columns)>>0;
            }

            this._rows= rows;
            this._columns= columns;

            var nrows = this._rows;
            var ncols = this._columns;

            var totalGapsWidth = (ncols - 1) * this._gap.horizontal.getValue( this._bounds.w );
            var widthWOInsets = this._bounds.w - (this._insets.left.getValue( this._bounds.w ) + this._insets.right.getValue( this._bounds.w ) );
            var widthOnComponent = ((widthWOInsets - totalGapsWidth) / ncols);  // floor
            var extraWidthAvailable = ((widthWOInsets - (widthOnComponent * ncols + totalGapsWidth)) / 2); // floor

            var totalGapsHeight = (nrows - 1) * this._gap.vertical.getValue( this._bounds.h );
            var heightWOInsets = this._bounds.h - (this._insets.top.getValue( this._bounds.h ) + this._insets.bottom.getValue(this._bounds.h));
            var heightOnComponent = ((heightWOInsets - totalGapsHeight) / nrows); // floor
            var extraHeightAvailable = ((heightWOInsets - (heightOnComponent * nrows + totalGapsHeight)) / 2); // floor

            for (var c = 0, x = this._insets.left.getValue( this._bounds.w ) + extraWidthAvailable;
                 c < ncols;
                 c++, x += widthOnComponent + this._gap.horizontal.getValue( this._bounds.w ) ) {

                for (var r = 0, y = this._insets.top.getValue( this._bounds.h ) + extraHeightAvailable;
                     r < nrows;
                     r++, y += heightOnComponent + this._gap.vertical.getValue( this._bounds.h ) ) {

                    var i = r * ncols + c;
                    if (i < this._children.length) {
                        var child = this._children[i];
                        if (null !== child) {
                            child.setBounds(this._bounds.x + x, this._bounds.y + y, widthOnComponent, heightOnComponent);
                            child.doLayout( );
                        }
                    }
                }
            }

        }
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
    export class LayerLayout extends BaseLayout {

        /**
         * Build a new LayerLayout
         * @method cc.plugin.layout.LayerLayout#constructor
         */
        constructor() {
            super();
        }

        /**
         * @method cc.plugin.layout.LayerLayout#getPreferredLayoutSize
         * @returns {cc.math.Dimension}
         */
        getPreferredLayoutSize() : cc.math.Dimension {
            var d= new cc.math.Dimension();

            d.set( this._preferredWidth.getValue( this._bounds.w ), this._preferredHeight.getValue( this._bounds.h ) );
            this.adjustWithInsets( d );

            var pd= this.getPreferredSize();
            d.width= Math.max( d.width, pd.width );
            d.height= Math.max( d.width, pd.height );

            return d;
        }

        /**
         * @method cc.plugin.layout.LayerLayout#doLayout
         */
        doLayout() {

            var x= this._bounds.x + this._insets.left.getValue( this._bounds.w );
            var y= this._bounds.y + this._insets.top.getValue( this._bounds.h );
            var w= this._bounds.w - this._insets.left.getValue( this._bounds.w ) - this._insets.right.getValue( this._bounds.w );
            var h= this._bounds.h -this._insets.top.getValue( this._bounds.h ) - this._insets.bottom.getValue( this._bounds.h );

            for( var i=0; i<this._children.length; i++ ) {
                this._children[i].setBounds( x,y,w,h );
                this._children[i].doLayout( );
            }
        }
    }
}