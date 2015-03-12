/**
 * License: see license.txt file
 */

module cc.plugin.loader {

    /**
     * @class ResourceLoaderBuilder
     * @interface
     * @classdesc
     *
     * Type for each ResourceLoader builder descriptor  type.
     * It is composed by a type (image, font, etc.) and a constructor function.
     */
    export interface ResourceLoaderBuilder {
        /**
         * Resource type.
         * @member cc.plugin.loader.ResourceLoaderBuilder#type
         * @type {string}
         */
        type:string;

        /**
         * Constructor function for a given resource type.
         * @param url}
         */
        loader(url:string) : ResourceLoader;
    }

    /**
     * Register a loader type for a given url extension.
     * @member cc.plugin.loader.RegisterLoaderForType
     * @param builder {cc.plugin.loader.ResourceLoader} a loader of this type will be reated for each resource needing it.
     * @param extension {string}
     */
    export function registerLoaderForType( extension:string, builder:ResourceLoaderBuilder ) {
        __resourceLoaderByType[extension]= builder;
    }

    /**
     * Get a loader type for a given url extension.
     * @member cc.plugin.loader.GetLoaderByType
     * @param extension {string}
     * @return {cc.plugin.loader.ResourceLoaderBuilder}
     */
    export function getLoaderByType( extension:string ) : ResourceLoaderBuilder {
        return __resourceLoaderByType[ extension ];
    }

    var __resourceLoaderByType= {
    };

    /**
     * A Resource passed this callback to a ResourceLoader to be notified about the resource being loaded correctly.
     * @callback ResourceLoaderResourceOkCallback
     * @memberOf cc.plugin.loader
     * @param content {object} the result of loading the resource.
     */
    export interface ResourceLoaderResourceOkCallback {
        ( content:any ) : void;
    }

    /**
     * A Resource passed this callback to a ResourceLoader to be notified about the resource being loaded NOT correctly.
     * @callback ResourceLoaderResourceErrorCallback
     * @memberOf cc.plugin.loader
     */
    export interface ResourceLoaderResourceErrorCallback {
        ( ) : void;
    }


    /**
     * @class cc.plugin.loader.ResourceLoader
     * @interface
     * @classdesc
     *
     * All ResourceLoader instances must have a properly signatured load method.
     * A Resource will build a ResourceLoader instance based on its extension, and the pre-registered set of
     * loaders-by-extension available in __resourceLoaderByType
     *
     */
    export interface ResourceLoader {

        /**
         *
         * @param loaded {cc.plugin.loader.ResourceLoaderResourceOkCallback}
         * @param error {cc.plugin.loader.ResourceLoaderResourceErrorCallback}
         */
        load( loaded:ResourceLoaderResourceOkCallback,
              error:ResourceLoaderResourceErrorCallback,
                progress? : (p:number) => void ) : void;
    }

}