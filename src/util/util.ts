/**
 * License: see license.txt file.
 */


module cc {

    //export function extend(derived, base) {
    //    for (var p in base) {
    //        if (base.hasOwnProperty(p)) {
    //            derived[p] = base[p];
    //        }
    //    }
    //
    //    function __() {
    //        this.constructor = derived;
    //    }
    //
    //    __.prototype = base.prototype;
    //    derived.prototype = new __();
    //}

    export module util {
        "use strict";

        /**
         * Create a Float32Array. If it is not possible a plain Array will be created.
         * @method cc.util.FloatArray
         * @param size {number} array size.
         * @param defaultValue {number} default array values.
         * @returns {Float32Array|Array}
         */
        export function FloatArray(size, defaultValue) {
            var a, i;

            defaultValue = defaultValue || 0;

            if (typeof Float32Array !== "undefined") {
                a = new Float32Array(size);
                if (defaultValue) {
                    for (i = 0; i < size; i++) {
                        a[i] = defaultValue;
                    }
                }
            } else {
                a = new Array(size);
                for (i = 0; i < size; i++) {
                    a[i] = defaultValue;
                }

            }

            return a;
        }

        /**
         * Create a UInt16Array. If it is not possible a plain Array will be created.
         * @method cc.util.UInt16Array
         * @param size {number} array size.
         * @param defaultValue {number} default array value.
         * @returns {Uint16Array|Array}
         */
        export function UInt16Array(size, defaultValue) {
            var a, i;

            defaultValue = defaultValue || 0;

            if (typeof Uint16Array !== "undefined") {
                a = new Uint16Array(size);
                if (defaultValue) {
                    for (i = 0; i < size; i++) {
                        a[i] = defaultValue;
                    }
                }
            } else {
                a = new Array(size);
                for (i = 0; i < size; i++) {
                    a[i] = defaultValue;
                }

            }

            return a;
        }

        /**
         * Transform an string with POSIX like regular expressions into javascript regular expressions.
         * @method cc.util.fromPosixRegularExpression
         * @param expr {string}
         * @returns {string} a javascript like valid regular expression string.
         */
        export function fromPosixRegularExpression(expr:string):string {
            expr = expr.replace(/\[\:digit\:\]/g, "\\d");
            expr = expr.replace(/\[\:alpha\:\]/g, "[A-Za-z]");
            expr = expr.replace(/\[\:alnum\:\]/g, "[A-Za-z0-9]");
            expr = expr.replace(/\[\:word\:\]/g, "\\w");

            expr = expr.replace(/\[\:cntrl\:\]/g, "[\\x00-\\x1F\\x7F]");
            expr = expr.replace(/\[\:graph\:\]/g, "[\\x21-\\x7E]");
            expr = expr.replace(/\[\:lower\:\]/g, "[a-z]");
            expr = expr.replace(/\[\:print\:\]/g, "[\\x20-\\x7E]");
            expr = expr.replace(/\[\:punct\:\]/g, "[][!\"#$%&\'()*+,./:;<=>?@\\^_`{|}~-]");
            expr = expr.replace(/\[\:space\:\]/g, "\\s");
            expr = expr.replace(/\[\:upper\:\]/g, "[A-Z]");
            expr = expr.replace(/\[\:xdigit\:\]/g, "[A-Fa-f0-9]");

            return expr;
        }
    }
}