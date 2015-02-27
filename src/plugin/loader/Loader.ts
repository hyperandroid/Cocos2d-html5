/**
 * License: see license.txt file
 */

/// <reference path="../../util/Debug.ts"/>
/// <reference path="../../locale/Locale.ts"/>
/// <reference path="./Resource.ts"/>

module cc.plugin.loader {

    import Resource= cc.plugin.loader.Resource;

    /**
     * Callback definition for Loader ends loading all resources.
     * @memberOf cc.plugin.loader
     * @callback LoaderFinishedCallback
     * @param resources {Array<cc.plugin.loader.Resource>} all resources created in this loader.
     */
    export interface LoaderFinishedCallback {
        ( resources : {[id:string] : any} ) : any;
    }

    /**
     * Callback definition for the event a Loader ends loading one resources.
     * @memberOf cc.plugin.loader
     * @callback LoaderProgressCallback
     * @param resource {cc.plugin.loader.Resource} loaded resource
     * @param index {number} number of loaded resources so far.
     * @param size {number} total number of resources.
     * @param errored {boolean} true if the resource had an error while loading, false otherwise.
     */
    export interface LoaderProgressCallback {
        (resource:Resource, index:number, size:number, errored:boolean) : void;
    }

    /**
     * Callback definition for the event a Loader gets error loading a resources.
     * @memberOf cc.plugin.loader
     * @callback LoaderErrorCallback
     * @param resource {string} resource error.
     */
    export interface LoaderErrorCallback {
        (resource:Resource) : void;
    }


    /**
     * @class cc.plugin.loader.LoaderInitializer
     * @interface
     * @classdesc
     *
     * This object is the Loader initializer object.
     *
     */
    export interface LoaderInitializer {

        /**
         * Optional common prefix to add to every resource uri before loading.
         * @member cc.plugin.loader.LoaderInitializer#prefix
         * @type {string=}
         */
        prefix? : string;

        /**
         * Optional resource list.
         * @member cc.plugin.loader.LoaderInitializer#resources
         * @type {Array<string>=}
         */
        resources? : string[];
    }

    /**
     * @class cc.plugin.loader.Loader
     * @classdesc
     *
     * <p>
     *     A loader object has the responsibility of loading different types of files and notify success or error
     *     of loading operations.
     * <p>
     *     It has the ability to register new types of loader for different extension files.
     *     The Loader loads data synchronous or asynchronously.
     *     Notifies for each resource in the list about success or error on loading.
     * <p>
     *     The Loader keeps track of loaded content, and notifies callback functions for each resource
     *     loaded, and another callback when it is done with all resources.
     *     When all resources all loaded, local references to these resources are cleared to avoid memory leaks.
     *     Also all resources are instrumented to remove unnecessary information such as loading/error callbacks, etc.
     * <p>
     *     To avoid repetition in resources urls, a common 'prefix' can be specified which will be prepended to every
     *     resource before loading.
     */
    export class Loader {

        /**
         * Common uri prefix to add to all resources before loading.
         * The prefix is added to resources that
         *   * don't start with a protocol prefix (http, https, etc.)
         *   * don't start with a slash '/'
         * This way, you could mix prefixed and non-prefixed resources.
         * <p>
         * The prefix is added as is, is not normalized, or modified in any way.
         * <p>
         * The prefix saves time and typing, so that instead of setting something like:
         *
         * <code>
         * {
         *    resources : [
         *      "/folder/folder2/img1.png",
         *      "/folder/folder2/img2.png",
         *      ...
         *    ]
         * }
         * </code>
         *
         * you could instead do:
         *
         * <code>
         * {
         *   prefix : "/folder/folder2/",
         *   resources : [ "img1.png", "img2.png" ]
         * }
         * </code>
         *
         * @member cc.plugin.loader.Loader#_prefix
         * @type {string}
         * @private
         */
        _prefix : string= null;

        /**
         * Resources list.
         * @member cc.plugin.loader.Loader#_resources
         * @type {Array<string>}
         * @private
         */
        _resources : Resource[]= [];

        /**
         * Current
         * @type {number}
         * @private
         */
        _currentLoadedResourcesCount= 0;

        constructor(loaderData?:LoaderInitializer) {
            if ( loaderData ) {

                // if there's a prefix, set it.
                if (typeof loaderData.prefix!=="undefined") {
                    this._prefix= loaderData.prefix;
                }

                // if there are resources to load, register them.
                if (typeof loaderData.resources!=="undefined") {
                    this.addResources( loaderData.resources );
                }
            }
        }

        /**
         * Prepend the _prefix to the string s if needed.
         * <p>
         * Won't be added for:
         *   * strings starting with /
         *   * strings starting with protocol http,https or ftp
         *
         * @method cc.plugin.loader.Loader#__addPrefixIfNeeded
         * @param s {string} string to add prefix to.
         * @returns {string}
         * @private
         */
        __addPrefixIfNeeded( s:string ) {

            // there's no prefix, nothing to prepend.
            if (!this._prefix) {
                return s;
            }

            // remove trailing spaces.
            s= s.trim();

            // resouce starts with /, an absolute uri, don't add prefix.
            if ( s.charAt(0)==='/' ) {
                return s;
            }

            // is a protocol url, don't add prefix.
            if ( s.indexOf("http")===0 || s.indexOf("https")===0 || s.indexOf("ftp")===0 ) {
                return s;
            }

            return this._prefix + s;
        }

        /**
         * Add one resource to the load queue.
         * @method cc.plugin.loader.Loader#addResource
         * @param url {string}
         */
        addResource( url:string ) : Loader {

            url= this.__addPrefixIfNeeded(url);

            var resource= new Resource(url);
            this._resources.push( resource );

            return this;
        }

        /**
         * Add a collection of resources to the load queue.
         * @method cc.plugin.loader.Loader#addResources
         * @param resources {Array<string>}
         */
        addResources( resources:string[] ) : Loader {
            for( var i=0; i<resources.length; i++) {
                this.addResource( resources[i] );
            }
            return this;
        }

        /**
         * Start loading all resources in this loader.
         * @param onEnd {cc.plugin.loader.LoaderFinishedCallback} callback invoked when all asset are loaded. If no resources
         *  are registered, this callback will be immediately invoked.
         * @param onProgress {cc.plugin.loader.LoaderProgressCallback} invoked for each successfully loaded resource.
         * @param onError {cc.plugin.loader.LoaderErrorCallback} invoked for each not sucessfully loaded resource.
         */
        startLoading( onEnd:LoaderFinishedCallback, onProgress?:LoaderProgressCallback, onError?:LoaderErrorCallback ) : Loader {

            if ( this._resources.length===0 ) {
                onEnd({});
                return;
            }

            for( var i=0; i<this._resources.length; i++ ) {
                this._resources[i].load(
                    (resource:Resource) => {    // loaded

                        this._currentLoadedResourcesCount++;
                        if ( onProgress ) {
                            onProgress(resource, this._currentLoadedResourcesCount, this._resources.length, true);
                        }
                        if ( this._currentLoadedResourcesCount===this._resources.length ) {

                            // create resources object. Has index with resources, and associate values by id.
                            var notify:any= {};
                            for( var i=0; i<this._resources.length; i++ ) {
                                //notify[i]= this._resources[i];
                                notify[ this._resources[i].getId() ]= this._resources[i].value;
                            }
                            //notify.length= this._resources.length;

                            onEnd( notify );

                            // remove all local references for resources. Avoid leaks.
                            this._resources= null;
                            this._currentLoadedResourcesCount= 0;
                        }
                    },
                    (resource:Resource) => {    // error

                        this._currentLoadedResourcesCount++;
                        if ( onProgress ) {
                            onProgress(resource, this._currentLoadedResourcesCount, this._resources.length, false);
                        }
                        if ( onError ) {
                            onError(resource);
                        }
                    }
                );
            }

            return this;
        }

    }

}