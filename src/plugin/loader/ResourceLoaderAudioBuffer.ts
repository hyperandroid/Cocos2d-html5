/**
 * License: see license.txt file
 */

/// <reference path="./ResourceLoader.ts"/>
/// <reference path="../../../lib/webaudio/webaudio.d.ts" />


module cc.plugin.loader {

    import ResourceLoader= cc.plugin.loader.ResourceLoader;


    var audioContext:AudioContext= (function() {
            //var ww= <any>window;
            var ctx= typeof AudioContext!=="undefined" ? AudioContext :
                ( typeof webkitAudioContext!=="undefined" ? webkitAudioContext : null );
            return ctx && new ctx();
        })();

    /**
     * @class cc.plugin.loader.ResourceLoaderAudioBuffer
     * @implements cc.plugin.loader.ResourceLoader
     * @classdesc
     *
     * This object loads an audio as an arraybuffer. It must then be turned into an AudioBuffer by dynamically
     * decoding it.
     */
    export class ResourceLoaderAudioBuffer implements ResourceLoader {

        /**
         * Url string where the resource is located.
         * @member cc.plugin.loader.ResourceLoaderAudioBuffer#_url
         * @type {string}
         * @private
         */
        _url:string= null;


        /**
         * Create a new ResourceLoaderAudioBuffer instance.
         * @method cc.plugin.loader.ResourceLoaderAudioBuffer#constructor
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
                req.responseType = "arraybuffer";

                req.onload = function() {

                    audioContext.decodeAudioData(
                        req.response,
                        function(buffer) {
                            loaded(buffer);
                        }, function(e) {
                            console.log("decode error ",e);
                            error();
                        });

                };

                req.send();
            }
        }
    }

    cc.plugin.loader.registerLoaderForType(
        "mp3",
        { type: "mp3 audio", loader: function(url:string) { return new ResourceLoaderAudioBuffer(url); } }
    );
    cc.plugin.loader.registerLoaderForType(
        "ogg",
        { type: "ogg audio", loader: function(url:string) { return new ResourceLoaderAudioBuffer(url); } }
    );
    cc.plugin.loader.registerLoaderForType(
        "wav",
        { type: "wav audio", loader: function(url:string) { return new ResourceLoaderAudioBuffer(url); } }
    );


}