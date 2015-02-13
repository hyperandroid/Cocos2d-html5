/**
 * Created by ibon on 1/6/15.
 */

/// <reference path="./InputManager.ts"/>

module cc.input {


    /**
     * Keys names and ascii chars.
     * From Impact Game Engine.
     * @name KEYS
     * @memberOf cc.input
     * @type {Map<string,number>}
     */
    export var KEYS = {

        enter: 13,
        backspace: 8,
        tab: 9,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pause: 19,
        capslock: 20,
        escape: 27,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        "delete": 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
        command: 91,
        meta: 91,
        select: 93,
        rcommand: 93,
        numpad0: 96,
        numpad1: 97,
        numpad2: 98,
        numpad3: 99,
        numpad4: 100,
        numpad5: 101,
        numpad6: 102,
        numpad7: 103,
        numpad8: 104,
        numpad9: 105,
        multiply: 106,
        add: 107,
        subtract: 109,
        decimalpoint: 110,
        divide: 111,
        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123,
        numlock: 144,
        scrolllock: 145,
        semicolon: 186,
        equalsign: 187,
        comma: 188,
        dash: 189,
        period: 190,
        forwardslash: 191,
        graveaccent: 192,
        openbracket: 219,
        backslash: 220,
        closebracket: 221,
        singlequote: 222,
        commandright: 224
    };
    
    /**
     * Build a keyboard modifiers object.
     * Modifers have some numerical members corresponding to the key codes for command, commandright, shift, alt and control.
     * 
     * @returns {object}
     */
    function buildKeyModifiers() : any {

        var modifiers:any= {};
        modifiers[ KEYS.command ]= false;
        modifiers[ KEYS.commandright ]= false;
        modifiers[ KEYS.ctrl    ]= false;
        modifiers[ KEYS.shift   ]= false;
        modifiers[ KEYS.alt     ]= false;

        return modifiers;
    }


    /**
     * @class cc.input.KeyInfo
     * @classdesc 
     * 
     * Describes a key and its modifiers.
     * For example: command+a, shift+alt+g
     * A Key, is parsed from a string, amd must be defined in this order: modifiers+key.
     * It won't recognize something like: a+shift whili it will recognized shift+a
     * KeyInfo objects keep internal state for parsing result validity.
     * 
     * Objects of this type are internal to the keyboard manager.
     */
    export class KeyInfo {

        /**
         * Key Code.
         * @member cc.input.KeyInfo#key
         * @type {number}
         */
        key:number = null;
        
        /**
         * Modifiers Object.
         * @member cc.input.KeyInfo#modifiers
         * @type {object}
         */
        modifiers:any = null;
        
        /**
         * Key has been parsed correctly ?
         * @member cc.input.KeyInfo#isValid
         * @type {boolean}
         */
        isValid:boolean= true;

        /**
         * Build a new KeyInfo instance from a string key representation.
         * @method cc.input.KeyInfo#constructor
         * @param keyDef {string}
         */
        constructor( keyDef:string ) {

            this.modifiers= buildKeyModifiers();
            
            var keys= keyDef.split("+");

            // 0 to length-1 are supposed to be the modifers.
            for( var i=0; i<keys.length-1; i++ ) {
                if ( this.modifiers.hasOwnProperty( cc.input.KEYS[ keys[i] ] ) ) {
                    this.modifiers[ cc.input.KEYS[ keys[i] ] ]= true;
                } else {
                    this.isValid= false;
                    console.log("wrong key modifier: '"+keys[i]+"' in key definition: "+keyDef);
                }
            }

            var key= keys[ keys.length-1 ];
            if ( KEYS.hasOwnProperty(key) ) {
                this.key= KEYS[key];
            } else {
                this.isValid= false;
                console.log("wrong key '"+key+"' in key definition: "+keyDef);
            }
        }

        /**
         * Test whether this KeyInfo matches a keyCode and some modifiers.
         * @method cc.input.KeyInfo#matches
         * @param key {number} key code.
         * @param modifiers {object}
         * @returns {boolean}
         */
        matches( key:number, modifiers:any ) {
            return this.key===key &&
                    modifiers.ctrl===           this.modifiers.ctrl &&
                    modifiers.alt===            this.modifiers.alt &&
                    modifiers.shift===          this.modifiers.shift &&
                    modifiers.command===        this.modifiers.command &&
                    modifiers.commandright===   this.modifiers.commandright;
        }
    }

    /**
     * @class cc.input.KeyActionInfo
     * @classdesc
     * 
     * A KeyActionInfo is responsible for defining a key sequence, composed by a collection of KeyInfo objects.
     * It will also be responsible for identifying whether the sequence has been types correctly, and of notifying any
     * sequence listeners registered for it.
     * 
     * A sample KeyActionInfo could be for example the konami code:
     * "up up down dow left right left right b a", "a b c", or a simple "a". The callback associated with the sequence
     * will be fired when all the keys are pressed in order.
     * 
     * An action info will be fired on key down or up, depending on the construction parameter.
     * For multi-key actions, the callback will be fired on key down or up of the last sequence key.
     * The sequence will be invalidated if the wrong key for the current sequence position is typed, or it more than
     * KeyActionInfo._typeTime is exceeded.
     */
    export class KeyActionInfo {

        /**
         * The registered keys of the sequence action.
         * @member cc.input.KeyActionInfo#_keys
         * @type {Array<cc.input.KeyInfo>} 
         * @private
         */
        _keys : KeyInfo[] = [];

        /**
         * Action for which the ket sequence action was registered. Either 'down' or 'up'.
         * @member cc.input.KeyActionInfo#_action
         * @type {string}
         * @private
         */
        _action : string = null;

        /**
         * Callback to fire when the sequence is complete.
         * @member cc.input.KeyActionInfo#_callback
         * @type {Function}
         * @private
         */
        _callback : Function = null;

        /**
         * Current sequence expected key.
         * @member cc.input.KeyActionInfo#_currentKeyInfoIndex
         * @type {number}
         * @private
         */
        _currentKeyInfoIndex= -1;

        /**
         * Time at which the last valid action sequence key was typed.
         * @member cc.input.KeyActionInfo#_time
         * @type {number}
         * @private
         */
        _time:number= -1;

        /**
         * A index-sequence generated id. It is valid for unregistering key sequences from the keyboard manager.
         * @member cc.input.KeyActionInfo#_id
         * @type {number}
         * @private
         */
        _id:number=KeyboardIdGenerator();

        /**
         * If more than this milliseconds elapse between two valid sequence action keys, the sequence will be aborted.
         * @member cc.input.KeyActionInfo#_typeTime
         * @type {number}
         * @private
         */
        _typeTime:number = 1000;
        
        /**
         * Create a new KeyActionInfo sequence object.
         * @method cc.input.KeyActionInfo#constructor
         * @param keys {string} a string with the sequence keys definition.
         * @param action {string} down or up. If keys is a sequence of keys, the sequence will be fired on up or down
         *                        of the last sequence key.
         * @param callback {function} a parameterless callback function.
         */
        constructor( keys:string, action:string, callback:Function ) {
            this._action= action;
            this._callback= callback;

            this.__parseKeys( keys );
        }

        /**
         * Get the sequence id.
         * @method cc.input.KeyActionInfo#getId
         * @returns {number}
         */
        getId():number {
            return this._id;
        }

        /**
         * Build KeyInfo objects from a keys definition string.
         * @method cc.input.KeyActionInfo#__parseKeys
         * @param keys {string} a string with keys (combinations) names. for example: "command+b", "alt+shift+f1 a b c"
         * @private
         */
        __parseKeys( keys:string ) {

            var keyDefs= keys.split(" ");
            for( var i=0; i<keyDefs.length; i++ ) {
                var keyDef:KeyInfo = new KeyInfo( keyDefs[i] );
                if ( keyDef.isValid ) {
                    this._keys.push( keyDef );
                }
            }
        }

        /**
         * Signal a key down event has been generated at keyboard manager level
         * @method cc.intpu.KeyInfoAction#down
         * @param modifiers {object} modifiers object
         * @param key {number} key code
         * @param time {number} time at which the event key was produced.
         */
        down(modifiers:any, key:number, time:number) {
            if ( this._action==="down" ) {
                this.__checkKey(key,modifiers,time);
            }
        }

        /**
         * Signal a key up event has been generated at keyboard manager level
         * @method cc.intpu.KeyInfoAction#up
         * @param modifiers {object} modifiers object
         * @param key {number} key code
         * @param time {number} time at which the event key was produced.
         */
        up(modifiers:any, key:number, time:number) {

            if ( this._action==="up" ) {
                this.__checkKey(key,modifiers,time);
            }
        }

        /**
         * Check whether the key code fulfills the key sequence in time.
         * The sequence will be reset if the wrong expected key is pressed or too much time elapse between two valid
         * sequence keys.
         * @param key {number} key code
         * @param modifiers {object} modifiers object
         * @param time {number} time at which the event key was produced.
         * @private
         */
        __checkKey( key:number, modifiers:any, time:number ) {

            // too much time for sequence
            if ( time-this._time > this._typeTime ) {
                // restart
                this._currentKeyInfoIndex= -1;
            }

            if ( this._currentKeyInfoIndex===-1 ) {
                this._currentKeyInfoIndex=0;
                this._time= time;
            }

            if ( this._keys[this._currentKeyInfoIndex].matches(key, modifiers) ) {
                // right key + modifiers
                this._currentKeyInfoIndex++;
                this._time= time;

                if ( this._currentKeyInfoIndex===this._keys.length ) {
                    // sequence ok
                    this._callback();
                    this._currentKeyInfoIndex= -1;
                }

            } else {
                // wrong key, restart
                this._currentKeyInfoIndex=-1;
            }

        }

        /**
         * Change the valid waiting time between two valid sequence keys.
         * The function won't check whether the number is valid or too low.
         * @method cc.input.KeyInfoAction#setSequenceTypeMaxTime
         * @param m {number}
         */
        setSequenceTypeMaxTime( m : number ) : KeyActionInfo {
            this._typeTime= m;
            return this;
        }
    }

    /**
     * @class cc.input.CursorInitializer
     * @interface
     * @classdesc
     * 
     * Cursor initializer. the up, down, left and right members represent a valid key enumeration.
     * Each of the keys in the sequence will be added as valid key sequences for each cursor event.
     * For example, if "w up" is specified for up, the Cursor will fire a callback for each of the keys 'w' and 'up'.
     */
    export interface CursorInitializer {

        /**
         * @member cc.input.CursorInitializer#up
         */
        up:string;

        /**
         * @member cc.input.CursorInitializer#down
         */
        down:string;

        /**
         * @member cc.input.CursorInitializer#left
         */
        left:string;
        /**
         * @member cc.input.CursorInitializer#right
         */
        right:string;
    }

    var KeyboardIdGenerator = function() {

        var index= 0;

        return function() {
            return index++;
        }

    }();

    /**
     * @class cc.input.KeyboardCursor
     * @classdesc
     *
     * This class represents a cursor composed of the 4 cursor events up, down, left and right.
     * For each of the events, a valid key enumeration can be defined.
     * For example, if "w up" is specified for up, the Cursor will fire a callback for each of the keys 'w' and 'up'.
     * This class makes all the necessary wiring between the cursor keys and KeyInfoAction objects.
     */
    export class KeyboardCursor {

        /**
         * Cursor up flag.
         * @member cc.input.KeyboardCursor#_upPressed
         * @type {boolean}
         * @private
         */
        _upPressed:boolean=     false;

        /**
         * Cursor down flag.
         * @member cc.input.KeyboardCursor#_downPressed
         * @type {boolean}
         * @private
         */
        _downPressed:boolean=   false;

        /**
         * Cursor left flag.
         * @member cc.input.KeyboardCursor#_leftPressed
         * @type {boolean}
         * @private
         */
        _leftPressed:boolean=   false;

        /**
         * Cursor right flag.
         * @member cc.input.KeyboardCursor#_rightPressed
         * @type {boolean}
         * @private
         */
        _rightPressed:boolean=  false;

        /**
         * Array for KeyActionInfo generated objects to keep track of the cursor.
         * @member cc.input.KeyboardCursor#_actionInfoIds
         * @type {Array<number>}
         * @private
         */
        _actionInfoIds:number[]= [];

        /**
         * For each cursor key press/release, this callback function will be called.
         * The key parameter of the callback will contain the cursor event names: up,down,left,right, and not the key name
         * that triggered the action. Thus, a generic cursor handle function could be used instead on having to taylor
         * a function for each cursor type.
         * @member cc.input.KeyboardCursor#_callback
         * @type {function(string,boolean)}
         * @private
         */
        _callback: ( key:string, down:boolean, keyCode:number ) => any;

        /**
         * Internal cursor id. Necessary for unregistering a cursor.
         * @member cc.input.KeyboardCursor#_id
         * @type {number}
         * @private
         */
        _id: number= KeyboardIdGenerator();

        /**
         * Create a new KeyboardCursor object instance.
         * @method cc.input.KeyboardCursor#constructor
         * @param kim {cc.input.KeyboardInputManager}
         * @param cd {cc.input.CursorInitializer}
         * @param callback {function(string,boolean)}
         */
        constructor( kim:KeyboardInputManager, cd:CursorInitializer, callback:(key:string, down:boolean)=>any ) {

            var me= this;
            
            this._callback= callback;
            
            this.__registerKeys(
                kim,
                cd.up,
                function() {
                    me._upPressed= true;
                    me.__onKeyChange("up", me._upPressed);
                }, 
                function() {
                    me._upPressed= false;
                    me.__onKeyChange("up", me._upPressed);
                }
            );
            
            this.__registerKeys(
                kim,
                cd.down,
                function() {
                    me._downPressed= true;
                    me.__onKeyChange("down", me._downPressed);
                }, 
                function() {
                    me._downPressed= false;
                    me.__onKeyChange("down", me._downPressed);
                }
            );

            this.__registerKeys(
                kim,
                cd.left,
                function() {
                    me._leftPressed= true;
                    me.__onKeyChange("left", me._leftPressed);
                }, 
                function() {
                    me._leftPressed= false;
                    me.__onKeyChange("left", me._leftPressed);
                }
            );

            this.__registerKeys(
                kim,
                cd.right,
                function() {
                    me._rightPressed= true;
                    me.__onKeyChange("right", me._rightPressed);
                }, 
                function() {
                    me._rightPressed= false;
                    me.__onKeyChange("right", me._rightPressed);
                }
            );

        }

        /**
         * Notify a cursor key status change.
         * @method cc.input.KeyboardCursor#__onKeyChange
         * @param key {string} the cursor event type.
         * @param pressed {boolean} true the key is pressed, false is released.
         * @private
         */
        __onKeyChange( key:string, pressed:boolean ) {
            this._callback( key, pressed, KEYS[key] );
        }

        /**
         * Register a KeyActionInfo for each key defined in the cursor event key description.
         * For example if "up w" is supplied, it will generate sequences for 'up' and 'w' respectively.
         * @param kim {cc.input.KeyboardInputManager}
         * @param keysdesc {string} keys descripion
         * @param callbackdown {function}
         * @param callbackup {function}
         * @private
         */
        __registerKeys( kim:KeyboardInputManager, keysdesc:string, callbackdown:()=>any, callbackup:()=>any ) {
            var keys= keysdesc.split(" ");
            for( var i=0; i<keys.length; i++ ) {
                this._actionInfoIds.push( kim.onDown( keys[i], callbackdown ) );
                this._actionInfoIds.push( kim.onUp( keys[i], callbackup ) );
            }
        }

        /**
         * Get the cursor id.
         * @method cc.input.KeyboardCursor#getId
         * @returns {number}
         */
        getId() {
            return this._id;
        }

        /**
         * Unregisted all key sequences from the cursor.
         * This method is internally used by the KeyboardInputManager
         * @method cc.input.KeyboardCursor#unregisted
         * @param kim {cc.action.KeyboardInputManager}
         */
        unregister( kim:KeyboardInputManager ) {
            for( var i=0; i<this._actionInfoIds.length; i++ ) {
                kim.removeActionInfo( this._actionInfoIds[i] );
            }
        }

        /**
         * Get cursor's event up status flag.
         * @method cc.input.KeyboardCursor#get:up
         * @returns {boolean} true is pressed.
         */
        get up() :boolean {
            return this._upPressed;
        }

        /**
         * Get cursor's event down status flag.
         * @method cc.input.KeyboardCursor#get:down
         * @returns {boolean} true is pressed.
         */
        get down() :boolean {
            return this._downPressed;
        }

        /**
         * Get cursor's event left status flag.
         * @method cc.input.KeyboardCursor#get:left
         * @returns {boolean} true is pressed.
         */
        get left() :boolean {
            return this._leftPressed;
        }

        /**
         * Get cursor's event right status flag.
         * @method cc.input.KeyboardCursor#get:right
         * @returns {boolean} true is pressed.
         */
        get right() :boolean {
            return this._rightPressed;
        }

    }

    /**
     * @class cc.input.KeyboardInputManager
     * @classdesc
     *
     * This object is the general keyboard input manager.
     * It must be instantiated.
     *
     */
    export class KeyboardInputManager {

        /**
         * Registered key sequences.
         * @member cc.input.KeyboardInputManager#_keyActionInfos
         * @type {Array<cc.input.KeyActionInfo>}
         * @private
         */
        _keyActionInfos : KeyActionInfo[];

        /**
         * Whether the keyboard handler is enabled.
         * @member cc.input.KeyboardInputManager#_enabled
         * @type {boolean}
         * @private
         */
        _enabled:boolean= false;

        /**
         * Global keyboard modifiers.
         * @member cc.input.KeyboardInputManager#_modifiers
         * @type {object}
         * @private
         */
        _modifiers: any = null;

        /**
         * Registered KeyboardCursor objects.
         * @member cc.input.KeyboardInputManager#_cursors
         * @type {Map<string,KeyboardCursor>}
         * @private
         */
        _cursors: any = {};

        /**
         * Internally bound function for down events.
         * Do not use or modify.
         * @member cc.input.KeyboardInputManager#_onDown
         * @type {function(KeyboardEvent)}
         * @private
         */
        _onDown : (e:KeyboardEvent) => any = null;

        /**
         * Internally bound function for up events.
         * Do not use or modify.
         * @member cc.input.KeyboardInputManager#_onUp
         * @type {function(KeyboardEvent)}
         * @private
         */
        _onUp : (e:KeyboardEvent) => any = null;

        /**
         * Create a new KeyboardInputManager instance.
         * @method cc.input.KeyboardInputManager#constructor
         */
        constructor() {
            this._keyActionInfos= [];
            this._onDown= this.__onDown.bind(this);
            this._onUp= this.__onUp.bind(this);
            this._modifiers= buildKeyModifiers();
        }

        __onDown( e:KeyboardEvent ) {

            var key:number= e.which ? e.which : e.keyCode;
            var time:number=new Date().getTime();

            if ( !this.__setModifiers( key, true ) ) {
                for( var i=0;i<this._keyActionInfos.length;i++ ) {
                    this._keyActionInfos[i].down( this._modifiers, key, time )
                }
            }
        }

        __onUp( e:KeyboardEvent ) {

            var key:number= e.which ? e.which : e.keyCode;
            var time:number=new Date().getTime();

            if ( !this.__setModifiers( key, false ) ) {
                for( var i=0;i<this._keyActionInfos.length;i++ ) {
                    this._keyActionInfos[i].up( this._modifiers, key, time )
                }
            }
        }

        __setModifiers( key:number, down:boolean ) {
            if ( this._modifiers.hasOwnProperty(key) ) {
                this._modifiers[key]= down;
                return true;
            }

            return false;
        }

        /**
         * Register and Enable the keyboard manager.
         * @method cc.input.KeyboardInputManager#enable
         */
        enable() {
            if ( !this._enabled ) {
                window.addEventListener("keydown", this._onDown, false);
                window.addEventListener("keyup", this._onUp, false);
                this._enabled= true;
            }
        }

        /**
         * Disable the keyboard manager and remove keyboard listeners.
         * @method cc.input.KeyboardInputManager#enable
         */
        disable() {
            if ( this._enabled ) {
                window.removeEventListener("keydown", this._onDown, false);
                window.removeEventListener("keyup", this._onUp, false);
                this._enabled= false;
            }
        }

        /**
         * Add a callback for a key sequence. Fired on 'down' of the last sequence key.
         * @method cc.input.KeyboardInputManager#onDown
         * @param keys {string}
         * @param callback {function()}
         * @returns {number}
         */
        onDown( keys:string, callback:()=>any ) : number {
            var kai:KeyActionInfo= new KeyActionInfo(keys, "down", callback);
            this._keyActionInfos.push( kai );
            return kai.getId();
        }

        /**
         * Add a callback for a key sequence. Fired on 'up' of the last sequence key.
         * @method cc.input.KeyboardInputManager#onUp
         * @param keys {string}
         * @param callback {function()}
         * @returns {number}
         */
        onUp( keys:string, callback:()=>any ) : number {
            var kai:KeyActionInfo= new KeyActionInfo(keys, "up", callback);
            this._keyActionInfos.push( kai );
            return kai.getId();
        }

        /**
         * Register a cursor object with the cursor keys defined in the initializer.
         * @method cc.input.KeyboardInputManager#registerCursor
         * @param cd {cc.input.CursorInitializer}
         * @param callback {function({string},{boolean}) a callback function invoked with the cursor event name and
         *        status of the cursor key.
         * @returns {number}
         */
        registerCursor( cd:CursorInitializer, callback:(key:string,down:boolean)=>any ) : number {
            var kc= new KeyboardCursor( this, cd, callback );
            this._cursors[ kc.getId() ]= kc;
            return kc.getId();
        }

        /**
         * Unregister a KeyboardCursor object.
         * @method cc.input.KeyboardInputManager#unregisterCursor
         * @param id {number}
         */
        unregisterCursor( id:number ) {

            if ( this._cursors.hasOwnProperty(id) ) {
                this._cursors[id].unregister(this);
                this._cursors[id]= null;
            }
        }

        /**
         * Remove a key sequence from the keyboard manager.
         * @method cc.input.KeyboardInputManager#removeActionInfo
         * @param id {number}
         */
        removeActionInfo( id : number ) {
            for( var i=0; i<this._keyActionInfos.length; i++ ) {
                if ( this._keyActionInfos[i].getId()===id ) {
                    this._keyActionInfos.splice(i,1);
                    return;
                }
            }
        }
    }
}