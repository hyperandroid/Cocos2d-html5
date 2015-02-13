/**
 * License: see license.txt file.
 */

module cc.Debug {

    "use strict";


    /**
     * Runtime debug level.
     * if DEBUG, a error message will throw an exception.
     * in RELEASE, the exception is not thrown.
     *
     * @tsenum cc.Debug.RuntimeDebugLevel
     */
    export enum RuntimeDebugLevel {

        DEBUG = 0,
        RELEASE = 1
    }

    /**
     * Current Runtime debug level. DEBUG by default.
     * @member cc.Debug.DEBUG_LEVEL
     * @type {RuntimeDebugLevel}
     */
    export var DEBUG_LEVEL : RuntimeDebugLevel = RuntimeDebugLevel.DEBUG;

    /**
     * Debug message levels.
     *
     * @tsenum cc.Debug.DebugLevel
     */
    export enum DebugLevel {
        Info = 0,
        Warning = 1,
        Error = 2
    }

    var __consoleDecoration = [
        "",
        "background: orange; color: #000",
        "background: #a00; color: #fff",
    ];
    var __defaultDecoration = "background: #fff; color: #000";

    /**
     * Show a message in the console.
     * @method cc.Debug.debug
     * @param level {cc.Debug.RuntimeDebugLevel} debug level criticism
     * @param msg {string} message to show
     * @param rest {Array<any>} other parameters to show in console.
     */
    export function debug( level : DebugLevel, msg : string, rest : Array<any> ) {
        console.log("%c%s:%c %s", __consoleDecoration[level], DebugLevel[level], __defaultDecoration, msg );
        if ( rest.length ) {
            console.log( rest );
        }

        if ( level===DebugLevel.Error && DEBUG_LEVEL===RuntimeDebugLevel.DEBUG ) {
            throw msg;
        }
    }

    /**
     * Show an error message.
     * @method cc.Debug.error
     * @param msg {string} error message.
     * @param rest {Array<any>} other elements to show in console.
     */
    export function error( msg : string, ...rest : Array<any> ) : void {
        cc.Debug.debug( DebugLevel.Error, msg, rest );
    }

    /**
     * Show a warning message.
     * @method cc.Debug.warn
     * @param msg {string} error message.
     * @param rest {Array<any>} other elements to show in console.
     */
    export function warn( msg : string, ...rest : Array<any> ) : void {
        cc.Debug.debug( DebugLevel.Warning, msg, rest );
    }

    /**
     * Show an info message.
     * @method cc.Debug.info
     * @param msg {string} error message.
     * @param rest {Array<any>} other elements to show in console.
     */
    export function info( msg : string, ...rest : Array<any> ) : void {
        cc.Debug.debug( DebugLevel.Info, msg, rest );
    }

}