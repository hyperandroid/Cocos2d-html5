/**
 * License: see license.txt file.
 */

module cc {

    var initializing:boolean= false;

    // The base Class implementation (does nothing)
    var _Class:any= function() {
    };

    // Create a new Class that inherits from this class
    _Class.extend = function (extendingProt) {

        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // The dummy class constructor
        var CCClass:any= function() {
            // All construction is actually done in the ctor method
            if (!initializing && typeof this.ctor!=="undefined") {
                this.ctor.apply(this, arguments);
            }
        };

        // Populate our constructed prototype object
        CCClass.prototype = prototype;
        // Enforce the constructor to be what we expect
        CCClass.prototype.constructor = CCClass;
        CCClass.superclass = _super;
        // And make this class extendable
        CCClass.extend = _Class.extend;

        CCClass["__CLASS"] = name;

        extendingProt = (typeof extendingProt==="function" ? extendingProt() : extendingProt);

        // Copy the properties over onto the new prototype
        for (var fname in extendingProt) {


            var isFunc= typeof extendingProt[fname]==='function';
            var overrideIsFunc= typeof prototype[fname]==='function';

            // ctor (wrong) idiom.
            if ( fname==='ctor' ) {

                prototype[fname] = (function (name, fn, superconstructor) {
                    return function () {

                        var tmp = this._super;
                        this._super = function() {
                            superconstructor.apply(this, arguments);
                        };
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(fname, extendingProt[fname], this);


            } else if ( isFunc && overrideIsFunc && /\b_super\b/.test( extendingProt[fname] ) ) {

                // function with overriden function that uses _super in code

                prototype[fname] = (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-Class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(fname, extendingProt[fname]);

            } else {
                // Check if we're overwriting an existing function
                prototype[fname] = extendingProt[fname];
            }
        }


        return CCClass;
    };

    (<any>cc.node.Node).extend =   _Class.extend;
    (<any>cc.node.Sprite).extend = _Class.extend;
    (<any>cc.node.FastSprite).extend = _Class.extend;
    (<any>cc.node.SpriteBatchNode).extend = _Class.extend;
    (<any>cc.node.Scene).extend =  _Class.extend;
    (<any>cc.action.Action).extend = _Class.extend;



    export var Class= _Class;

}