/**
 * License: see license.txt file.
 */


/// <reference path="../node/Node.ts"/>
/// <reference path="../action/Action.ts"/>

module cc.action {

    "use strict";

    import Node = cc.node.Node;
    import Action = cc.action.Action;

    /**
     * @class cc.action.PropertyActionInitializer
     * @extends cc.action.ActionInitializer
     * @interface
     */
    export interface PropertyActionInitializer extends ActionInitializer {

    }

    /**
     * @class cc.action.PropertyInfo
     * @classdesc
     *
     * Internal helper Object to store a property information.
     * It stores:
     * <li>a property name, for example 'x' or 'p0.x'
     * <li>the property path. For example ['x'] or ['p0','x']
     * <li>original property value for a target object
     *
     * It is responsible for setting and getting the deep property path values too.
     *
     * Referenced properties MUST be numeric.
     */
    export class PropertyInfo {


        /**
         * Property Units. For example, when the property is not a numeric value but something like '250px'.
         * @member cc.action.PropertyInfo#_units
         * @type {string}
         * @private
         */
        _units : string = "";

        /**
         * If the property is a deep property, like 'p0.x' or 'a.b.c.d.value' this property will indicate it.
         * @member cc.action.PropertyInfo#_nested
         * @type {boolean}
         * @private
         */
        _nested : boolean = false;

        /**
         * A split('.') of the _property value.
         * @member cc.action.PropertyInfo#_propertyPath
         * @type {Array<string>}
         * @private
         */
        _propertyPath : string[];

        /**
         * Original property value.
         * @member cc.action.PropertyInfo#_original
         * @type {number}
         * @private
         */
        _original : number;

        /**
         * Property name.
         * @member cc.action.PropertyInfo#_property
         * @type {string}
         * @private
         */

        /**
         * Property start value.
         * @member cc.action.PropertyInfo#_start
         * @type {number}
         * @private
         */

        /**
         * Property end value.
         * @member cc.action.PropertyInfo#_end
         * @type {number}
         * @private
         */

        /**
         *
         * @param _property {string} property name.
         * @param _start {number} start value.
         * @param _end {number=} end value.
         */
        constructor(public _property:string, public _start?:number, public _end?:number) {
            this._nested= _property.indexOf('.')!==-1;
            this._propertyPath= _property.split('.');
        }

        /**
         * Set the property value in a target object
         * @method cc.action.PropertyInfo#setTargetValue
         * @param target {any}
         * @param v {number}
         */
        setTargetValue( target:any, v:number ) {
            var cursor= target;
            for( var i=0; i<this._propertyPath.length-1; i++ ) {
                if ( typeof cursor[ this._propertyPath[i] ]!=="undefined" ) {
                    cursor= cursor[ this._propertyPath[i] ];
                } else {
                    // error, no deep path found on object
                    return;
                }
            }

            cursor[ this._propertyPath[i] ]= v;
        }

        /**
         * Get the property value from a target object
         * @method cc.action.PropertyInfo#getTargetValue
         * @param target {any}
         * @returns {number}
         */
        getTargetValue( target:any ) : number {
            var cursor= target;
            for( var i=0; i<this._propertyPath.length; i++ ) {
                if ( typeof cursor[ this._propertyPath[i] ]!=="undefined" ) {
                    cursor= cursor[ this._propertyPath[i] ];
                } else {
                    // error, no deep path found on object
                    return null;
                }
            }

            return cursor;
        }

        /**
         * Set PropertyInfo original target value.
         * @param n {number}
         * @returns {cc.action.PropertyInfo}
         */
        setOriginal( n : number ) : PropertyInfo {
            this._original= n;
            return this;
        }

        /**
         * Get property original value in the original target object.
         * @method cc.action.PropertyInfo#getOriginal
         * @returns {number}
         */
        getOriginal() : number {
            return this._original;
        }

        /**
         * Clone the PropertyInfo object.
         * @method cc.action.PropertyInfo#clone
         * @returns {cc.action.PropertyInfo}
         */
        clone() : PropertyInfo {
            return new PropertyInfo( this._property, this._start, this._end );
        }

        /**
         * Get the property path.
         * @method cc.action.PropertyInfo#getPath
         * @returns {string[]}
         */
        getPath() : string[] {
            return this._propertyPath;
        }
    }

    /**
     * @class cc.action.PropertyAction
     * @extends cc.action.Action
     * @classdesc
     *
     * This action applies to any arbitrary Object's properties. Could apply to multiple properties at the same time.
     * AlphaAction and RotateAction fit in the model of a PropertyInfo, but they are complete Actions for the shake of
     * clarity and performance.
     *
     * The properties a PropertyAction will handle must be simple properties, not Objects, only composed of a number and
     * an optional unit.
     *
     * A different set of properties can be specified in a call to <code>from</code> and <code>to</code>. Properties
     * specified not in both <code>from</code> and <code>to</code> at the same time, will get values either 'from' or
     * 'to' values when a call to <code>initWithTarget</code> is made.
     */
    export class PropertyAction extends Action {

        /**
         * Properties the action manages.
         * @member cc.action.PropertyAction#_propertiesInfo
         * @type {Array<Object>}
         * @private
         */
        _propertiesInfo : Array<PropertyInfo>;

        /**
         * From properties values.
         * @member cc.action.PropertyAction#_from
         * @type {Object}
         * @private
         */
        _from : any;

        /**
         * To properties values.
         * @member cc.action.PropertyAction#_to
         * @type {Object}
         * @private
         */
        _to : any;

        /**
         * PropertyAction constructor.
         * @method cc.action.PropertyAction#constructor
         */
        constructor( data? : PropertyActionInitializer ) {
            super();

            this._propertiesInfo= [];

            if ( data ) {
                this.__createFromInitializer(data);
            }
        }

        /**
         * Initialize the action with an initializer object.
         * @method cc.action.PropertyAction#__createFromInitializer
         * @param data {cc.action.PropertyActionInitializer}
         * @private
         */
        __createFromInitializer(initializer?:PropertyActionInitializer ) {
            super.__createFromInitializer(initializer);
        }

        /**
         * {@link cc.action.Action#initWithTarget}
         * @method cc.action.PropertyAction#initWithTarget
         * @override
         */
        initWithTarget( node : any ) {
            this.solveInitialValues(node);
        }

        /**
         * Update target Node's properties.
         * {@link cc.action.Action#update}
         * @method cc.action.PropertyAction#update
         * @override
         * @returns {Object} an Object with all the modified properties.
         */
        update(delta:number, node : any ) : any {

            var ret = {};

            for( var i=0; i<this._propertiesInfo.length; i++ ) {
                var pr= this._propertiesInfo[i];
                var v = pr._start + delta * (pr._end - pr._start);

                if ( this.isRelative() ) {
                    v+= pr.getOriginal();
                }

                pr.setTargetValue( node, v );
                //node[pr._property] = pr.getValue(v);

                // register applied values only if there´s someone interested.
                if ( this._onApply ) {
                    ret[pr._property] = v;
                }
            }

            return ret;
        }

        /**
         * Capture before-application Node's property values.
         * {@link cc.action.Action#solveInitialValues}
         * @method cc.action.PropertyAction#solveInitialValues
         * @override
         */
        solveInitialValues( node : any ) {

            for (var i = 0; i < this._propertiesInfo.length; i++) {
                var pr = this._propertiesInfo[i];
                if (typeof pr._start === "undefined") {
                    pr._start = pr.getTargetValue( node );
                }
                if (typeof pr._end === "undefined") {
                    pr._end = pr.getTargetValue( node );
                }

                pr._original= pr.getTargetValue( node );
            }
        }


        /**
         * {@link cc.action.Action#from}
         * @method cc.action.PropertyAction#from
         * @override
         */
        from( props : any ) : Action {

            this._from= props;

            if ( props ) {
                for (var pr in props) {
                    if (props.hasOwnProperty(pr)) {
                        var propertyInfo = new PropertyInfo(pr, props[pr]);
                        this._propertiesInfo.push(propertyInfo);
                    }
                }
            }

            return this;
        }

        /**
         * {@link cc.action.Action#to}
         * @method cc.action.PropertyAction#to
         * @override
         */
        to( props : any ) : Action {

            this._to= props;

            var i;

            for( var pr in props ) {

                if (props.hasOwnProperty(pr)) {
                    // if no property set, create a property w/o initial value. will be filled automagically by a call to
                    // __setInitialValues
                    var property = null;
                    for (i = 0; i < this._propertiesInfo.length; i++) {
                        if (this._propertiesInfo[i]._property === pr) {
                            property = this._propertiesInfo[i];
                            break;
                        }
                    }

                    if (!property) {
                        property = new PropertyInfo(pr);
                        this._propertiesInfo.push(property);
                    }

                    property._end = props[ pr ];
                }
            }

            return this;
        }

        /**
         * Helper function for cloning this property.
         * @memver cc.action.PropertyAction#__cloneProperties
         * @returns {Array<PropertyInfo>}
         * @private
         */
        __cloneProperties() : Array<PropertyInfo> {
            var pr : Array<PropertyInfo> = [];

            for (var i = 0; i < this._propertiesInfo.length; i++) {
                pr.push( this._propertiesInfo[i].clone() );
            }

            return pr;
        }

        /**
         * {@link cc.action.Action#__cloneImpl}
         * @method cc.action.PropertyAction#__cloneImpl
         * @override
         */
        __cloneImpl() : Action {

            var copy= new PropertyAction().
                to(this.__cloneProperties());

            this.__genericCloneProperties( copy );

            return copy;
        }

        /**
         * Serialize the action current definition.
         * @method cc.action.PropertyAction#getInitializer
         * @returns {cc.action.PropertyActionInitializer}
         */
        getInitializer() : PropertyActionInitializer {
            var init:PropertyActionInitializer= <PropertyActionInitializer>super.getInitializer();

            if ( this._fromValuesSet ) {
                init.from = this._from;
            }
            init.to= this._to;
            init.type="PropertyAction";

            return init;
        }

    }

}