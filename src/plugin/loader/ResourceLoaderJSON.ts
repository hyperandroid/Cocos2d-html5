/**
 * License: see license.txt file
 */

/// <reference path="./ResourceLoader.ts"/>
/// <reference path="../../util/Debug.ts"/>
/// <reference path="../../locale/Locale.ts"/>

module cc.plugin.loader {

    import ResourceLoader= cc.plugin.loader.ResourceLoader;

    /**
     * @class cc.plugin.loader.ResourceLoaderJSON
     * @implements cc.plugin.loader.ResourceLoader
     * @classdesc
     *
     * <p>
     *     This object loads images a JSON object
     */
    export class ResourceLoaderJSON implements ResourceLoader {

        /**
         * Url string where the resource is located.
         * @member cc.plugin.loader.ResourceLoaderJSON#_url
         * @type {string}
         * @private
         */
        _url:string= null;

        /**
         * Use JSON.parse from the loaded value ?
         * @member cc.plugin.loader.ResourceLoaderJSON#_parse
         * @type {boolean}
         * @private
         */
        _parse:boolean=true;

        /**
         * Create a new ResourceLoaderJSON instance.
         * @method cc.plugin.loader.ResourceLoaderJSON#constructor
         * @param url {string}
         */
        constructor( url:string, initializer?:any ) {
            this._url= url;

            if ( typeof initializer!=="undefined" ) {
                this._parse = typeof initializer.parse!=="undefined" ? initializer.parse : true;
            }
        }

        /**
         * Load the resource.
         * @param loaded {cc.plugin.loader.ResourceLoaderResourceOkCallback} callback invoked when the resource is successfully loaded.
         * @param error {cc.plugin.loader.ResourceLoaderResourceErrorCallback} callback invoked when the resource is not successfully loaded.
         */
        load( loaded:ResourceLoaderResourceOkCallback, error:ResourceLoaderResourceErrorCallback ) : void {

            var me = this;

            var req = null;
            if (typeof XMLHttpRequest!=="undefined" && typeof ActiveXObject==="undefined") {
                try {
                    req = new XMLHttpRequest();
                } catch (e) {
                    req = null;
                }
            } else if (typeof ActiveXObject!=="undefined") {
                try {
                    req = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        req = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e1) {
                        req = null;
                    }
                }
            }

            if (req) {

                req.open("GET", me._url, true);
                req.onload = function (e) {
                    if (req.status != 200) {
                        error();
                        return;
                    }

                    var text = e.currentTarget ? e.currentTarget.responseText : e.target.responseText;
                    if (text!=="") {
                        try {
                            loaded( me.getValue(text) );
                        } catch (e) {
                            cc.Debug.warn(cc.locale.LOADER_JSON_PARSE_ERROR);
                            loaded({});
                        }
                    }

                };
                req.send();
            }
        }

        getValue( text:string ) {
            return this._parse ? JSON.parse(text) : text;
        }
    }

    /**
     * @class cc.plugin.loader.ResourceLoaderXML
     * @extends ResourceLoaderJSON
     * @classdesc
     *
     * Loads a xml file. Will return a javascript array object parsed form the plist contents.
     * object[0] will be the first plist node, and so on.
     */
    export class ResourceLoaderXML extends ResourceLoaderJSON {

        /**
         * @method cc.plugin.loader.ResourceLoaderXML#constructor
         * @param url
         */
        constructor( url:string ) {
            super(url);
        }

        /**
         * Get the value from the loaded content.
         * It will parse the xml and build a javascript array object.
         * @method cc.plugin.loader.ResourceLoaderXML#getValue
         * @override
         * @param text {string} file contents.
         * @returns {object}
         */
        getValue( text:string ) : any {

            if ( typeof DOMParser!=="undefined" ) {

                var parser:DOMParser= new DOMParser();
                var doc:Document= parser.parseFromString( text, "text/xml" );

                // type Node
                return this.__parseNode( doc.documentElement );

            } else {
                return {};
            }
        }

        /**
         * Parse a XML Document.documentElement.
         * @method cc.plugin.loader.ResourceLoaderXML#__parseNode
         * @param node
         * @returns
         * @private
         */
        __parseNode( node ) {
            var data = null, tagName = node.tagName;

            if(tagName === "plist" ) {
                return this.__parseArray(node);
            } else if(tagName === "dict"){
                return this.__parseDict(node);
            }else if(tagName === "array"){
                return this.__parseArray(node);
            }else if(tagName === "string"){
                if (node.childNodes.length == 1)
                    data = node.firstChild.nodeValue;
                else {
                    //handle Firefox's 4KB nodeValue limit
                    data = "";
                    for (var i = 0; i < node.childNodes.length; i++)
                        data += node.childNodes[i].nodeValue;
                }
            }else if(tagName === "false"){
                return false;
            }else if(tagName === "true"){
                return true;
            }else if(tagName === "real"){
                return parseFloat(node.firstChild.nodeValue);
            }else if(tagName === "integer"){
                return parseInt(node.firstChild.nodeValue, 10);
            }
            return data;
        }

        /**
         * Parse an array Node from a plist.
         * @method cc.plugin.loader.ResourceLoaderXML#__parseArray
         * @param node
         * @returns {Array<object>}
         * @private
         */
        __parseArray(node) {
            var data = [];
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;
                data.push(this.__parseNode(child));
            }
            return data;
        }

        /**
         * Parse a dictionary node form a plist.
         * @method cc.plugin.loader.ResourceLoaderXML#__parseDict
         * @param node
         * @returns {Map<string,object>}
         * @private
         */
        __parseDict(node) {
            var data = {};
            var key = null;
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;

                // Grab the key, next noe should be the value
                if (child.tagName === 'key')
                    key = child.firstChild.nodeValue;
                else
                    data[key] = this.__parseNode(child);                 // Parse the value node
            }
            return data;
        }



    }

    cc.plugin.loader.registerLoaderForType(
        "json",
        { type: "javascript json", loader: function(url:string) { return new ResourceLoaderJSON(url, {parse:true}); } }
    );
    cc.plugin.loader.registerLoaderForType(
        "txt",
        { type: "plain text files", loader: function(url:string) { return new ResourceLoaderJSON(url, {parse:false}); } }
    );
    cc.plugin.loader.registerLoaderForType(
        "fnt",
        { type: "Glypth designer fnt", loader: function(url:string) { return new ResourceLoaderJSON(url, {parse:false}); } }
    );
    cc.plugin.loader.registerLoaderForType(
        "xml",
        { type: "XML file", loader: function(url:string) { return new ResourceLoaderXML(url); } }
    );
    cc.plugin.loader.registerLoaderForType(
        "plist",
        { type: "MAC Plist file", loader: function(url:string) { return new ResourceLoaderXML(url); } }
    );

}