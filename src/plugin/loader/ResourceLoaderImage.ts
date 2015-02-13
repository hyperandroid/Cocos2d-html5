/**
 * License: see license.txt file
 */

/// <reference path="./ResourceLoader.ts"/>

module cc.plugin.loader {

    import ResourceLoader= cc.plugin.loader.ResourceLoader;

    /**
     * @class cc.plugin.loader.ResourceLoaderImage
     * @implements cc.plugin.loader.ResourceLoader
     * @classdesc
     *
     * <p>
     *     This object loads images from a url.
     */
    export class ResourceLoaderImage implements ResourceLoader {

        /**
         * Url string where the resource is located.
         * @member cc.plugin.loader.ResourceLoaderImage#_url
         * @type {string}
         * @private
         */
        _url:string= null;

        /**
         * Create a new ResourceLoaderImage instance.
         * @method cc.plugin.loader.ResourceLoaderImage#constructor
         * @param url {string}
         */
        constructor( url:string ) {
            this._url= url;
        }

        /**
         * Load the resource.
         * @param loaded {cc.plugin.loader.ResourceLoaderResourceOkCallback} callback invoked when the resource is successfully loaded.
         * @param error {cc.plugin.loader.ResourceLoaderResourceErrorCallback} callback invoked when the resource is not successfully loaded.
         */
        load( loaded:ResourceLoaderResourceOkCallback, error:ResourceLoaderResourceErrorCallback ) : void {

            var img= new Image();

            img.addEventListener("load", (e) => {
                loaded( e.target );
            }, false);

            img.addEventListener("error", () => {
                error();
            }, false);

            img.src= this._url;
        }
    }

    cc.plugin.loader.registerLoaderForType(
        "png",
        { type: "image", loader: function(url:string) { return new ResourceLoaderImage(url); } }
    );

    cc.plugin.loader.registerLoaderForType(
        "jpg",
        { type: "image", loader: function(url:string) { return new ResourceLoaderImage(url); } }
    );

    cc.plugin.loader.registerLoaderForType(
        "jpeg",
        { type: "image", loader: function(url:string) { return new ResourceLoaderImage(url); } }
    );

}