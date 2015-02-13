/**
 * License: see license.txt file.
 */

/**
 * @name cc
 * @namespace
 */

/**
 * Namespace for Action related objects.
 * @name action
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for math related stuff: vector, matrix, color, etc.
 * @name math
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for path related stuff: Segment, SegmentLine, SegmentBezier, etc.
 * @name path
 * @namespace
 * @memberOf cc.math
 */

/**
 * Namespace for Localization messages and utilities.
 * @name locale
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for Scene transitions.
 * @name transition
 * @namespace
 * @memberOf cc
 */

/**
 * Debug object.
 * @name Debug
 * @memberOf cc
 * @namespace
 */

/**
 * Namespace for nodes.
 * @name node
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for Sprite stuff
 * @name sprite
 * @namespace
 * @memberOf cc.node
 */

/**
 * Namespace for utilities.
 * @name util
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for render related objects.
 * @name render
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for renderer shader related objects.
 * @name shader
 * @namespace
 * @memberOf cc.render
 */

/**
 * Namespace for system plugins. Plugins are optional pieces of code.
 * @name plugin
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for resources management.
 * @name loader
 * @namespace
 * @memberOf cc.plugin
 */

/**
 * Namespace for in-game assets.
 * @name asset
 * @namespace
 * @memberOf cc.plugin
 */

/**
 * Namespace for texture related things like TexturePacker, etc.
 * @name texture
 * @namespace
 * @memberOf cc.plugin
 */

/**
 * Namespace for audio related objects.
 * @name audio
 * @memberOf cc.plugin
 * @namespace
 */

/**
 * Namespace for automatic node layout.
 * @name layout
 * @memberOf cc.plugin
 * @namespace
 */

/**
 * Namespace for input subsytem.
 * @name input
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for game subsytem.
 * @name game
 * @namespace
 * @memberOf cc
 */

/**
 * Namespace for widgets: buttons, labels, etc.
 * @name widget
 * @namespace
 * @memberOf cc
 */

module cc {

    (function() {
        console.log('%c','padding:140px 150px;line-height:300px;background:url(http://files.cocos2d-x.org/images/orgsite/logo.png) no-repeat;');
    })();

    (function() {
        var frameTime = 1000 / 60;
        var lastTime = new Date().getTime();

        var stTime = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, frameTime - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback();
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

        var ctTime = function (id) {
            clearTimeout(id);
        };

        var win:any = window;

        win.requestAnimFrame = win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            win.oRequestAnimationFrame ||
            win.msRequestAnimationFrame ||
            stTime;

        win.cancelAnimationFrame = win.cancelAnimationFrame ||
            win.cancelRequestAnimationFrame ||
            win.msCancelRequestAnimationFrame ||
            win.mozCancelRequestAnimationFrame ||
            win.oCancelRequestAnimationFrame ||
            win.webkitCancelRequestAnimationFrame ||
            win.msCancelAnimationFrame ||
            win.mozCancelAnimationFrame ||
            win.webkitCancelAnimationFrame ||
            win.oCancelAnimationFrame ||
            ctTime;
    })();
}