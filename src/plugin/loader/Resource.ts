/**
 * License: see license.txt file
 */

/// <reference path="./Loader.ts"/>
/// <reference path="./ResourceLoader.ts"/>

module cc.plugin.loader {



    /**
     * Callback Fired by a Resource to notify about its loader result.
     * Tipically listened by a <code>cc.plugin.loader.Loader</code> object.
     * @memberOf cc.plugin.loader
     * @callback ResourceLoaderResultCallback
     * @param resource {cc.plugin.loader.Resource} loaded resource.
     */
    export interface ResourceLoaderResultCallback {
        (resource:Resource) : void;
    }


    /**
     * @class cc.util.Resource
     * @classdesc
     *
     * <p>
     *     Class for identifying resources at Cocos level.
     *     Resources are shares across all Director instances by storing them in the static AssetManager object.
     *     This class keeps Resource status and its value after loading.
     *     This class is the same for each resource type, but there are specialized Resource loaders depending on the
     *     type, for example loaders for XML, JSON and text are the same one, but convert the content before emitting
     *     it to any observer.
     * <p>
     *     Resources are identified by a string of the form: <valid_url>[@<id>]
     *     If &lt;id&rt; exists, it will be set as Resource's id, otherwise, the &lt;url&gt; will be.
     *     The Resource will dismiss all information (and including) after the ? sign in its loading url.
     *     Resources url are not normalized. That means that urls of the type ../../end/x/../y.png will be untouched.
     * <p>
     *     It is encouraged to define ids for every resouce by using the resource form <url>@<id>.
     *     It could seem handy to have all resources automatically identify themselves by the name part of the url,
     *     but since resources can be downloaded from different sources and id's could clash, the full url will be
     *     used if not id is defined.
     */
    export class Resource {

        /**
         * Resource id.
         * The id is extracted from the url path, and is just the equivalent to the file name.
         * To obtain the id, everything behing an optional question mark is removed.
         * For example, for a resource called /a/b/c/anim.png?stamp=495849809384 the id will be 'anim.png'.
         * @member cc.plugin.loader.Resource#id
         * @type {string}
         */
        id : string = null;

        /**
         * Resource id extension.
         * It is extracted from the id, and is whatever lies behind the last dot character.
         * The extension is used to identify what loader is needed for this king of resource.
         * @member cc.plugin.loader.Resource#extension
         * @type {string}
         */
        extension : string = null;

        /**
         * After the loader ends its work, the resulting object of loading the result is stored in this variable.
         * The value is only valid if the status of the resource is 'loaded'.
         * @memver cc.plugin.loader.Resource#value
         * @type {string}
         */
        value : any = null;

        /**
         * Resource status.
         * Valid status are:
         *   + created: the resource is created and still no load operation has ended for it.
         *   + error: the resource could not be loaded due to an error.
         *   + loaded: the resource has been loaded and is valid to be used.
         * @member cc.plugin.loader.Resource#_status
         * @type {string}
         * @private
         */
        _status : string= "created";

        /**
         * Resource type. Either image, font, atlas, etc.
         * @member cc.plugin.loader.Resource#type
         * @type {string}
         */
        type : string = null;

        /**
         * resource name. the url part after the last slash sigh.
         * @member cc.plugin.loader.Resource#name
         * @type {string}
         */
        name:string= null;

        /**
         * Source url the Resource was loaded from.
         * @member cc.plugin.loader.Resource#url
         * @type {string}
         */
        url : string = null;

        _progress : (p:number) => void = null;

        /**
         * Create a new Resource instance.
         * Resources are automatically built from a list of resource url/uri passed to a
         * <code>cc.plugin.loader.Loader</code> or <code>cc.plugin.loader.ResourceManager</code>.
         * @method cc.plugin.loader.Resource#constructor
         * @param url
         */
        constructor( _url:string ) {

            var url_and_id = _url.split("@");

            var url= url_and_id[0];
            var id= url_and_id.length>1 ? url_and_id[1] : null;

            var path= url.split("/");
            var name= path[ path.length-1 ];
            name= name.split("?")[0];

            var extensionPos:number;
            var extension:string;

            extensionPos= url.lastIndexOf(".");
            extension= null;

            // exists extension
            if ( -1!==extensionPos ) {
                extension= url.substr(extensionPos+1);
            } else {
                extension= "default";
            }

            this.url= url;
            this.extension= extension;
            this.id= id || url;
            this.name= name;

        }

        /**
         * Load a Resource by creating a suitable instance of a ResourceLoader based on the resource extension.
         * The resource exposes its loading results throughout the callback parameters.
         * If there's no loader associated with the resource extension, the error callback is called immediately.
         * @param loaded {cc.plugin.loader.ResourceLoaderResultCallback} callback notification if the resource loaded ok.
         * @param error {cc.plugin.loader.ResourceLoaderResultCallback} callback notification if the resource loaded with error.
         */
        load( loaded:ResourceLoaderResultCallback, error:ResourceLoaderResultCallback ) : void {
            var loaderDescriptor:ResourceLoaderBuilder= cc.plugin.loader.getLoaderByType(this.extension);
            if (loaderDescriptor) {

                this.type= loaderDescriptor.type;

                var loader= loaderDescriptor.loader( this.url );
                loader.load(
                    ( content:any ) => {
                        this.__setValue(content);
                        loaded( this );
                    },
                    () => {
                        this.__setError();
                        error(this);
                    },
                    this._progress );

            } else {
                cc.Debug.warn( cc.locale.WARN_RESOURCE_OF_UNKNOWN_TYPE, this.id );
                error(this);
            }
        }

        /**
         * Helper function.
         * @method cc.plugin.loader.Resource#__setValue
         * @param value {object} result from the loading operation.
         * @private
         */
        __setValue( value:any ) {
            this.value= value;
            this._status= "loaded";
        }

        /**
         * Helper function.
         * @method cc.plugin.loader.Resource#__setError
         * @private
         */
        __setError() {
            this._status="error";
        }

        /**
         * Has this Resource a valid value ?
         * @method cc.plugin.loader.Resource#isValid
         * @returns {boolean}
         */
        isValid() {
            return this._status==='loaded';
        }

        /**
         * Get the resource id.
         * @method cc.plugin.loader.Resource#getId
         * @returns {string}
         */
        getId() : string {
            return this.id;
        }

        setProgress( progress : (p:number)=> void ) {
            this._progress= progress;
        }
    }


}