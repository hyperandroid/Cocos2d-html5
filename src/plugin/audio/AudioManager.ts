/**
 *
 */

/// <reference path="../../../lib/webaudio/webaudio.d.ts"/>

module cc.plugin.audio {

    /**
     * @name AudioCallback
     * @memberOf cc.plugin.audio
     * @callback cc.plugin.audio.AudioCallback
     * @param audio {cc.plugin.audio.AudioEffect} the audio object that fired the callback.
     */
    export type AudioCallback= (audio:AudioEffect)=>any;

    var audioContext:AudioContext= (function() {
            var ctx= typeof AudioContext!=="undefined" ? AudioContext :
                ( typeof webkitAudioContext!=="undefined" ? webkitAudioContext : null );
            return ctx && new ctx();
        })();

    var codecs:any= null;

    (function() {

        function check(str):boolean {
            return str!=='' && str!=="no";
        }

        var audio = new Audio();
        codecs = {
            mp3: check(audio.canPlayType('audio/mpeg;')),
            ogg: check(audio.canPlayType('audio/ogg; codecs="vorbis"')),
            wav: check(audio.canPlayType('audio/wav; codecs="1"')),
            aac: check(audio.canPlayType('audio/aac;')),
            m4a: check(audio.canPlayType('audio/x-m4a;')) || check(audio.canPlayType('audio/m4a;')) || check(audio.canPlayType('audio/aac;')),
            mp4: check(audio.canPlayType('audio/x-mp4;')) || check(audio.canPlayType('audio/mp4;')) || check(audio.canPlayType('audio/aac;')),
            weba:check(audio.canPlayType('audio/webm; codecs="vorbis"'))
        };
    })();

    /**
     * @tsenum cc.plugin.audio.AudioEffectStatus
     */
    export enum AudioEffectStatus {
        NONE= 0,
        PLAY= 1,
        PAUSE=2,
        STOP= 3,
        END=  4,
        LOADED= 5
    }

    /**
     * @class cc.plugin.audio.AudioFilterInitializer
     * @interface
     */
    export interface AudioFilterInitializer {

        /**
         * A value form: lowpass, highpass, bandpass, lowshelf, highself, peaking, notch, allpass
         * @member cc.plugin.audio.AudioFilterInitializer#type
         * @type {string}
         */
        type : string;

        /**
         * Frequency parameter
         * @member cc.plugin.audio.AudioFilterInitializer#frequency
         * @type {number}
         */
        frequency? : number;

        /**
         * gain parameter
         * @member cc.plugin.audio.AudioFilterInitializer#gain
         * @type {number}
         */
        gain? : number;

        /**
         * Q parameter
         * @member cc.plugin.audio.AudioFilterInitializer#gain
         * @type {number}
         */
        Q? : number
    }

    /**
     * @class cc.plugin.audio.AudioEffect
     * @classdesc
     *
     * This object represents a WebAudio enabled Object. It can:
     *
     * <ul>
     *  <li>play, pause, resume, stop and loop.
     *  <li>define an AudioSprite (a region over a given audio).
     *  <li>Apply BiquadFilters to output.
     *  <li>Apply Convolution (needs external audio buffers).
     *  <li>Expose full lifecycle: start, stop, repeat, pause and resume.
     *  <li>Manage volume.
     *  <li>Be independently muted.
     *  <li>Play with delay time, so that you can schedule sounds on the future.
     *  <li>Seek audio.
     *  <li>On-the-fly change of properties such as volume, filter, convolver, loop, etc.
     * </ul>
     *
     * This audio object is connected to a master volume.
     */
    export class AudioEffect {

        /**
         * An string id.
         * @member cc.plugin.audio.AudioEffect#_id
         * @type {string}
         * @private
         */
        _id:string= null;

        /**
         *
         * @member cc.plugin.audio.AudioEffect#_isWebAudio
         * @type {boolean}
         * @private
         */
        _isWebAudio:boolean= false;

        /**
         * Internal audio object status.
         * @member cc.plugin.audio.AudioEffect#_status
         * @type {cc.plugin.audio.AudioEffectStatus}
         * @private
         */
        _status:AudioEffectStatus= AudioEffectStatus.NONE;

        /**
         * Is this object muted ?
         * @member cc.plugin.audio.AudioEffect#_muted
         * @type {boolean}
         * @private
         */
        _muted:boolean= false;

        /**
         * The audio volume. Volume ranges from 0 to 1.
         * @member cc.plugin.audio.AudioEffect#_volume
         * @type {boolean}
         * @private
         */
        _volume= 1;

        /**
         * The original audio buffer duration.
         * this value opposes to _duration which is the current Audio object duration.
         * @member cc.plugin.audio.AudioEffect#_bufferDuration
         * @type {number}
         * @private
         */
        _bufferDuration : number= 0;

        /**
         * Current Audio object duration. If the audio is a sprite, the value will be different from _bufferDuration
         * @member cc.plugin.audio.AudioEffect#_bufferDuration
         * @type {number}
         * @private
         */
        _duration:number = 0;

        /**
         * The audio source node.
         * @member cc.plugin.audio.AudioEffect#_source
         * @type {AudioBufferSourceNode}
         * @private
         */
        _source: AudioBufferSourceNode= null;

        /**
         * The audio contents.
         * @member cc.plugin.audio.AudioEffect#_buffer
         * @type {AudioBuffer}
         * @private
         */
        _buffer: AudioBuffer= null;

        /**
         * Relative to duration time when the audio was paused. Never use directly
         * @member cc.plugin.audio.AudioEffect#_pauseTime
         * @type {number}
         * @private
         */
        _pauseTime:number= 0;

        /**
         * The audioContext time when play was called.
         * @member cc.plugin.audio.AudioEffect#_startPlaybackTime
         * @type {number}
         * @private
         */
        _startPlaybackTime:number= 0;

        /**
         * If play is called with delay, this is the delay time before play the sound.
         * @member cc.plugin.audio.AudioEffect#_delayTime
         * @type {number}
         * @private
         */
        _delayTime:number= 0;

        /**
         * Master volume node to which the audio volume will be connected.
         * @member cc.plugin.audio.AudioEffect#_masterGain
         * @type {number}
         * @private
         */
        _masterGain:GainNode= null;

        /**
         * The audio volume node.
         * @member cc.plugin.audio.AudioEffect#_gain
         * @type {number}
         * @private
         */
        _gain:GainNode= null;

        /**
         * Whether the audio is a sprite audio. A sprite audio is just a region from another audio object.
         * @member cc.plugin.audio.AudioEffect#_isSprite
         * @type {boolean}
         * @private
         */
        _isSprite:boolean= false;

        /**
         * If the audio is a Sprite audio, relative time offset where the sprite starts.
         * @member cc.plugin.audio.AudioEffect#_spriteStartTime
         * @type {boolean}
         * @private
         */
        _spriteStartTime:number= 0;

        /**
         * Loop the audio ?.
         * @member cc.plugin.audio.AudioEffect#_loop
         * @type {boolean}
         * @private
         */
        _loop:boolean= false;

        /**
         * Internal loop timer.
         * @member cc.plugin.audio.AudioEffect#_endTimerId
         * @type {number}
         * @private
         */
        _endTimerId:number= null;

        /**
         * Audio end callback.
         * @member cc.plugin.audio.AudioEffect#_onEnd
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onEnd:AudioCallback= null;

        /**
         * Audio resume callback.
         * @member cc.plugin.audio.AudioEffect#_onResume
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onResume:AudioCallback= null;

        /**
         * Audio pause callback.
         * @member cc.plugin.audio.AudioEffect#_onPause
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onPause:AudioCallback= null;

        /**
         * Audio stop callback.
         * @member cc.plugin.audio.AudioEffect#_onStop
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onStop:AudioCallback= null;

        /**
         * Audio start callback.
         * @member cc.plugin.audio.AudioEffect#_onStart
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onStart:AudioCallback= null;

        /**
         * Audio repeat callback.
         * @member cc.plugin.audio.AudioEffect#_onRepeat
         * @type {cc.plugin.audio.AudioCallback}
         * @private
         */
        _onRepeat:AudioCallback= null;

        /**
         * Internal BiquadFilter node for sound filtering.
         * @member cc.plugin.audio.AudioEffect#_filter
         * @type {object}
         * @private
         */
        _filter:BiquadFilterNode= null;

        /**
         * Is filtering enabled ?
         * @member cc.plugin.audio.AudioEffect#_filterEnabled
         * @type {boolean}
         * @private
         */
        _filterEnabled:boolean= false;

        /**
         * Internal convolver node for sound convolution.
         * @member cc.plugin.audio.AudioEffect#_convolver
         * @type {object}
         * @private
         */
        _convolver:ConvolverNode = null;

        /**
         * Is convolution enabled ?
         * @member cc.plugin.audio.AudioEffect#_convolverEnabled
         * @type {boolean}
         * @private
         */
        _convolverEnabled:boolean= false;

        _playbackRate:number = 1;

        /**
         * @method cc.plugin.audio.AudioEffect#constructor
         * @param buffer {object} Audio buffer object.
         * @param masterGain {object} a GainNode which will act as system volume.
         */
        constructor( masterGain:GainNode, buffer?:AudioBuffer ) {

            this._isWebAudio= true;

            if ( buffer ) {
                this.setBuffer( buffer );
            }

            this._gain= (typeof audioContext.createGain==="undefined") ?
                (<any>audioContext).createGainNode() :
                audioContext.createGain();

            this._gain.connect( masterGain );
            this._masterGain= masterGain;

            this._filter= cc.plugin.audio.AudioManager.getContext().createBiquadFilter();
            this._convolver= cc.plugin.audio.AudioManager.getContext().createConvolver();
        }

        setId( s:string ) : AudioEffect {
            this._id= s;
            return this;
        }

        getId() : string {
            return this._id;
        }

        setBuffer( buffer:AudioBuffer ) {
            this._bufferDuration= buffer.duration;
            this._duration= buffer.duration;
            this._buffer= buffer;
        }

        /**
         * Make the audio loop or not. This can be changed at any given time.
         * @method cc.plugin.audio.AudioEffect#loop
         * @param enable {boolean} enable loop or not.
         * @returns {cc.plugin.audio.AudioEffect}
         */
        loop( enable:boolean ) : AudioEffect {
            this._loop= enable;
            return this;
        }

        /**
         * Get whether the sound is looping.
         * @method cc.plugin.audio.AudioEffect#isLoop
         * @returns {boolean}
         */
        isLoop() : boolean {
            return this._loop;
        }

        /**
         * Get the audio volume
         * @method cc.plugin.audio.AudioEffect#getVolume
         * @returns {number}
         */
        getVolume() : number {
            return this._gain.gain.value;
        }

        /**
         * Set the audio volume.
         * @method cc.plugin.audio.AudioEffect#setVolume
         * @param v {number} a number ranging from 0 (no sound) to 1 (full sound)
         */
        setVolume( v:number ) {
            this._volume= v;
            if (!this._muted) {
                this._gain.gain.value= v;
            }
        }

        /**
         * Set this audio as sprite.
         * Sprites must not be changed while playing. Should be set before.
         * The default sprite will be from starting of sound to its length;
         * If setSprite is called with enable=false, it will set the audio as non sprite, but the information of
         * sprite's start and duration can still be set. If not specified, these values will be kept 'as is'.
         * @method cc.plugin.audio.AudioEffect#setSprite
         * @param enable {boolean} enable this audio as sprite.
         * @param start {number} time offset to play the sound
         * @param duration {number} the audio will play from start to start+duration
         */
        setSprite( enable:boolean, start?:number, duration?:number ) : AudioEffect {
            this._isSprite = enable;

            if (typeof start !== "undefined") {
                this._spriteStartTime = start;
                this._duration = duration;
            }

            if (this._source) {
                this.__setSpriteData();
            }

            return this;
        }

        /**
         * Configure internal audio sprite data.
         * @method cc.plugin.audio.AudioEffect#__setSpriteData
         * @private
         */
        __setSpriteData() {

            if ( this._isSprite ) {
                if ( this._isWebAudio ) {
                    this._source.loopStart = this._spriteStartTime;
                    this._source.loopEnd = Math.min( this._duration, this._spriteStartTime + this._duration );
                }
            } else {
                if ( this._isWebAudio ) {
                    this._duration= this._bufferDuration;
                    this._source.loopStart= 0;
                    this._source.loopEnd= this._duration;
                }
            }

        }

        setPlaybackRate( rate:number ) {
            this._playbackRate= rate;

            if ( this._source ) {
                var wasPlaying= this.isPlaying();
                if (wasPlaying) {
                    this.pause();
                }
                this._source.playbackRate.value = rate;
                if (wasPlaying) {
                    this.resume();
                }
            }
        }

        /**
         * Get audio duration. If the audio loops, getDuration will be Number.MAX_VALUE, and the buffer or sprite duration
         * otherwise plus the delay otherwise.
         * @method cc.plugin.audio.AudioEffect#getDuration
         * @returns {number}
         */
        getDuration() {
            return this._loop ? Number.MAX_VALUE : this._delayTime + this._duration;
        }

        /**
         * Create the audio source and some internal piping.
         * @method cc.plugin.audio.AudioEffect#__createSource
         * @private
         */
        __createSource() {

            this._source= audioContext.createBufferSource();
            this._source.buffer= this._buffer;

            this.__connectNodes();

            this.loop( this._loop );
            this.__setSpriteData();

            this._delayTime=0;
            this._startPlaybackTime= 0;
            if ( !this._muted ) {
                this._gain.gain.value = this._volume;
            }
            this._status= AudioEffectStatus.NONE;
        }

        /**
         * Do the internal volume, source, filter, convolver wiring.
         * @method cc.plugin.audio.AudioEffect#__connectNodes
         * @private
         */
        __connectNodes() {

            var chain:AudioNode[]= [];

            chain.push( this._source );
            if ( this._filterEnabled ) {
                chain.push( this._filter );
            }
            if ( this._convolverEnabled ) {
                chain.push( this._convolver );
            }
            chain.push( this._gain );

            for( var i=0; i<chain.length-1; i++ ) {
                chain[i].connect( chain[i+1] );
            }

        }

        /**
         * Set a filter for the effect.
         * @method cc.plugin.audio.AudioEffect#setFilter
         * @param f {cc.plugin.audio.AudioFilterInitializer} filter info.
         */
        setFilter( f:AudioFilterInitializer ) {

            var wasFilterEnabled= this._filterEnabled;

            this._filterEnabled= f!==null;

            if ( f ) {
                var type= f.type.toLowerCase();
                this._filter.type= type;

                for( var pr in f ) {
                    if ( pr!=="type" && f.hasOwnProperty(pr) ) {
                        this._filter[ pr ].value= f[pr];
                    }
                }
            }

            if ( this._status===AudioEffectStatus.PLAY ) {

                // only if there's no filter now or was not before, do the audio filter wiring.
                if ( !wasFilterEnabled || !this._filterEnabled ) {
                    this.__pausePlay();
                }
            }
        }

        /**
         * Internal method to pause and play the audio. Between pause and play, will do some wiring of the internal nodes.
         * @method cc.plugin.audio.AudioEffect#__pausePlay
         * @private
         */
        __pausePlay() {
            var ct = this.getCurrentTime();
            this.stop();
            this.setCurrentTime(ct);
            this.__connectNodes();
            this.play();
        }

        /**
         * Play the audio. Alternatively, the play can be deferred by passing a delay parameter.
         * @method cc.plugin.audio.AudioEffect#play
         * @param delay {number} milliseconds to defer audio play.
         * @returns {cc.plugin.audio.AudioEffect}
         */
        play( delay?:number ) : AudioEffect {

            delay= delay || 0;

            var startTime= 0;
            var waspaused= false;

            if ( this._status=== AudioEffectStatus.PLAY ) {
                this.stop();
            } else if ( this._status===AudioEffectStatus.PAUSE ) {
                startTime= this._pauseTime;
                waspaused= true;
            }

            this.__createSource();
            this._status= AudioEffectStatus.PLAY;

            this._startPlaybackTime= audioContext.currentTime;
            this._delayTime= delay;

            this._source.playbackRate.value= this._playbackRate;

            if ( this._isSprite ) {
                if ( this._isWebAudio ) {
                    if (typeof this._source.start === 'undefined') {
                        (<any>this._source).noteGrainOn( delay, this._spriteStartTime+startTime, this.getRemainingTime());
                    } else {
                        this._source.start(delay, this._spriteStartTime+startTime, this.getRemainingTime());
                    }
                }
            } else {
                if ( this._isWebAudio ) {
                    this._source.start(delay, startTime);

                }
            }

            //if ( !this._loop ) {
                this.__cancelEndTimer();
                this.__startEndTimer();
            //}

            if ( waspaused ) {
                if ( this._onResume ) {
                    this._onResume(this);
                }
            } else {
                if ( this._onStart ) {
                    this._onStart(this);
                }
            }

            return this;
        }

        /**
         * Is the audio playing ?
         * @method cc.plugin.audio.AudioEffect#isPlaying
         * @returns {boolean}
         */
        isPlaying() : boolean {
            return this._status===cc.plugin.audio.AudioEffectStatus.PLAY;
        }

        /**
         * Convolve the audio.
         * @method cc.plugin.audio.AudioEffect#convolve
         * @param _buffer {string|object} if string, it will look up an AudioObject in the AssetManager as convolution
         *    parameter. If not, a convolution audio buffer is expected.
         */
        convolve( _buffer:string|AudioBuffer ) {

            var buffer:AudioBuffer = null;

            if ( typeof _buffer!=="undefined") {
                if ( typeof _buffer==='string' ) {
                    buffer= cc.plugin.asset.AssetManager.getAudioBuffer( _buffer );
                }
            }

            if ( null===buffer ) {
                this._convolver.buffer= null;
                this._convolverEnabled= false;
            } else {
                this._convolverEnabled= true;
                this._convolver.buffer =  buffer;
            }

            if ( this.isPlaying() ) {
                this.__pausePlay();
            }
        }

        /**
         * Get current audio time. If playing or paused, will give the actual audio time and zero otherwise.
         * @method cc.plugin.audio.AudioEffect#getCurrentTime
         */
        getCurrentTime() {
            return this._status===AudioEffectStatus.PLAY || this._status===AudioEffectStatus.PAUSE ?
                ((audioContext.currentTime - this._startPlaybackTime + this._spriteStartTime)%this._duration) - this._delayTime + this._pauseTime:
                0;
        }

        /**
         * Set current audio time. The time will be modulo the duration.
         * @method cc.plugin.audio.AudioEffect#setCurrentTime
         * @param time {number} expected audio seek position.
         */
        setCurrentTime( time:number ) {

            var wasPlaying:boolean= this._status===AudioEffectStatus.PLAY;
            this.stop();
            this._pauseTime= time%this._duration + this._spriteStartTime;
            // hack to restart from pause position.
            this._status= AudioEffectStatus.PAUSE;
            if ( wasPlaying) {
                this.play();
            }
        }

        /**
         * If the audio is playing or paused get remaining play time, zero otherwise.
         * @method cc.plugin.audio.AudioEffect#getRemainingTime
         */
        getRemainingTime() {
            // sometimes, an few milliseconds negative time could happen when you mess around a lot with pause/resume
            return this._status===AudioEffectStatus.PLAY || this._status===AudioEffectStatus.PAUSE ?
                Math.max(0,this._duration - this.getCurrentTime() ) :
                0;
        }

        /**
         * Internal method that cancels the end play timer.
         * @method cc.plugin.audio.AudioEffect#__cancelEndTimer
         */
        __cancelEndTimer() {
            if ( this._endTimerId ) {
                clearTimeout( this._endTimerId );
                this._endTimerId= null;
            }
        }

        /**
         * Internal method that starts the end play timer.
         * @method cc.plugin.audio.AudioEffect#__startEndTimer
         */
        __startEndTimer() {

            if ( this._endTimerId ) {
                return;
            }

            var timeleft= this.getRemainingTime() / this._playbackRate;
            var me= this;

            this._endTimerId= setTimeout( function() {
                me._endTimerId= null;
                me._pauseTime= 0;
                me._status= AudioEffectStatus.END;
                if ( me._loop ) {
                    if (me._onRepeat) {
                        me._onRepeat(me);
                    }
                    me.play(0);
                } else {
                    if (me._onEnd) {
                        me._onEnd(me);
                    }
                }
            }, timeleft * 1000 );

        }

        /**
         * Internal method that performs the common stop audio part.
         * @method cc.plugin.audio.AudioEffect#__pause_stop_common
         */
        __pause_stop_common() {

            if (typeof this._source.stop === 'undefined') {
                (<any>this._source).noteOff(0);
            } else {
                this._source.stop(0);
            }
            this.__cancelEndTimer();
        }

        /**
         * Stop the audio
         * @method cc.plugin.audio.AudioEffect#stop
         */
        stop() : AudioEffect {

            if ( this._source ) {
                this.__pause_stop_common();
            }

            this._pauseTime= 0;
            this._status= AudioEffectStatus.STOP;

            if ( this._onStop ) {
                this._onStop(this);
            }

            return this;
        }

        /**
         * Pause the audio
         * @method cc.plugin.audio.AudioEffect#pause
         */
        pause() :AudioEffect {
            if ( this._status!==AudioEffectStatus.PLAY ) {
                return;
            }

            var pt=this.getCurrentTime();

            this.__pause_stop_common();

            var ct= audioContext.currentTime;
            this._pauseTime= pt;
//console.log("pause at "+this._pauseTime);
            this._startPlaybackTime= ct;
            this._status= AudioEffectStatus.PAUSE;

            if ( this._onPause ) {
                this._onPause(this);
            }

            return this;
        }

        /**
         * Resume the audio
         * @method cc.plugin.audio.AudioEffect#resume
         */
        resume():AudioEffect {

            if ( this._status!==AudioEffectStatus.PAUSE ) {
                return;
            }
            return this.play();
        }

        /**
         * Set audio on end callback
         * @method cc.plugin.audio.AudioEffect#onEnd
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onEnd( c:AudioCallback ) : AudioEffect {
            this._onEnd= c;
            return this;
        }

        /**
         * Set audio on repeat callback.
         * Effects repeat when looping.
         * @method cc.plugin.audio.AudioEffect#onRepeat
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onRepeat( c:AudioCallback ) : AudioEffect {
            this._onRepeat= c;
            return this;
        }

        /**
         * Set audio on pause callback
         * @method cc.plugin.audio.AudioEffect#onPause
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onPause( c:AudioCallback ) : AudioEffect {
            this._onPause= c;
            return this;
        }

        /**
         * Set audio on resume callback
         * @method cc.plugin.audio.AudioEffect#onResume
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onResume( c:AudioCallback ) : AudioEffect {
            this._onResume= c;
            return this;
        }

        /**
         * Set audio on stop callback
         * @method cc.plugin.audio.AudioEffect#onStop
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onStop( c:AudioCallback ) : AudioEffect {
            this._onStop= c;
            return this;
        }

        /**
         * Set audio on start callback
         * @method cc.plugin.audio.AudioEffect#onStart
         * @param c {cc.plugin.audio.AudioCallback}
         */
        onStart( c:AudioCallback ) : AudioEffect {
            this._onStart= c;
            return this;
        }

        /**
         * Mute the audio.
         * @method cc.plugin.audio.AudioEffect#mute
         */
        mute():AudioEffect {
            if ( this._isWebAudio ) {
                this._gain.gain.value= 0;
            }
            this._muted= true;
            return this;
        }

        /**
         * Unmute the audio.
         * @method cc.plugin.audio.AudioEffect#unmute
         */
        unmute():AudioEffect {

            if ( this._isWebAudio ) {
                this._gain.gain.value= this._volume;
            }
            this._muted= false;
            return this;
        }
    }

    export class SimpleAudioEffect {

        _audio: HTMLAudioElement= null;
        _loaded:boolean= false;
        _status:AudioEffectStatus= AudioEffectStatus.NONE;
        _url:string= null;
        _pauseTime:number=0;
        _volume:number=1;
        _masterVolume:number=1;
        _loop:boolean;

        constructor() {

            this._audio= document.createElement('audio');
            this._audio.preload= "auto";
            this._audio.autoplay= false;

        }

        setUrl( url:string, autoplay?:boolean ) {

            if ( url===this._url ) {
                return;
            }

            var me= this;
            this._url= url;
            this._loaded= false;
            this._audio.addEventListener( "canplaythrough", function(e) {

                e.srcElement.removeEventListener("canplaythrough",this);
                me._loaded= true;
                me._status= AudioEffectStatus.LOADED;
                if ( autoplay ) {
                    me.play();
                }

            }, false );

            this._audio.src= url;
        }

        setMasterVolume( v:number ) {
            this._masterVolume= v;
        }

        setVolume( v:number ) {
            this._volume= v;
            this._audio.volume= v*this._masterVolume;
        }

        loop( v:boolean ) {
            this._loop= true;
            this.play();
        }

        play() {
            if ( this._status!==AudioEffectStatus.NONE ) {
                this._status=AudioEffectStatus.PLAY;
                this._audio.currentTime=0;
                this._audio.loop= this._loop;
                this._audio.play();
            }
        }

        pause() {

            if ( this._status!==AudioEffectStatus.NONE ) {
                this._status=AudioEffectStatus.PAUSE;
                this._pauseTime= this._audio.currentTime;
                this._audio.pause();
            }
        }

        resume() {

            if ( this._status!==AudioEffectStatus.NONE ) {
                this._status=AudioEffectStatus.PLAY;
                this._audio.currentTime= this._pauseTime;
                this._audio.play();
                this._pauseTime=0;
            }
        }

        stop() {
            this._status=AudioEffectStatus.STOP;
            this._pauseTime=0;
            this._audio.pause();
        }
    }

    export interface AudioManagerInitialized {

        numChannels? : number;

    }

    /**
     * @class cc.plugin.audio.AudioManager
     * @classdesc
     *
     * This object represents a sound manager.
     * The sound manager does several things:
     *
     * <li>keep an internal AudioEffect object pool. These elements are AudioBuffer decoded objects or Audio tags,
     *     depending on the AudioManager implementation.
     * <li>Has 3 gain nodes: music, effects, and a general one connected to the two previous ones.
     * <li>Plays background music using an Audio tag. You definitely don't want to have a 10 minutes song decoded
     *     into memory.
     *
     * There's only one music node and up to MAX_AUDIO_EFFECTS (16) for a total of 17 concurrent sounds.
     * The AudioManager objects manages lifecycle of the sounds. That means that an effect can be requested for play,
     * but not stop pause or resume. For such fine control, call <code>createAudio</code> method to get an
     * <code>AudioEffect</code> object which has much more advanced capabilities.
     */
    export class AudioManager {

        _context : AudioContext= null;

        _effects:AudioEffect[];

        /**
         * Master volume.
         * @type {number}
         * @private
         */
        _volume: number = 1;
        _masterGain:GainNode= null;

        _soundPool : AudioEffect[] = [];
        _playingPool : AudioEffect[] = [];

        _music : SimpleAudioEffect = null;

        constructor( ami?:AudioManagerInitialized ) {

            if ( audioContext ) {
                this._masterGain= audioContext.createGain();
                this._masterGain.connect( audioContext.destination );
            }

            this._music= new SimpleAudioEffect();

            ami= ami || {};
            ami.numChannels= ami.numChannels || 16;

            for( var i=0; i<ami.numChannels; i++ ) {
                var ae:AudioEffect= new AudioEffect( this._masterGain );
                this._soundPool.push( ae );

                ae.onEnd( (ae:AudioEffect)=> {
                    this.__recycle( ae );
                });

                ae.onStop( (ae:AudioEffect)=> {
                    this.__recycle( ae );
                });
            }
        }

        __recycle( ae:AudioEffect ) {
            var index= this._playingPool.indexOf(ae);
            if ( -1!==index ) {
                this._playingPool.splice(index,1);
                this._soundPool.push(ae);
            } else {
                console.log("recycle sound for not found element.");
            }
        }

        createAudio( id:string ) : AudioEffect {
            return new AudioEffect( this._masterGain,  cc.plugin.asset.AssetManager.getAudioBuffer(id) );
        }

        setVolume( v:number ) {
            this._volume= v;
            this._masterGain.gain.value= v;
            this._music.setMasterVolume(v);
        }

        setMusicVolume( v:number ) {
            this._music.setVolume( v );
        }

        /**
         * Play a loaded AudioBuffer.
         * This method plays a fully system-controlled sound. There's no user-side control.
         * To have a client side controlled audio effect object, call <code>createAudio</code>.
         * @param id {string|AudioBuffer} a string id in the asset manager.
         */
        playEffect( id:string|AudioBuffer ) {
            if ( this._soundPool.length===0 ) {
                cc.Debug.warn( cc.locale.ERR_SOUND_POOL_EMPTY );
            }

            var ab:AudioBuffer= null;
            if ( typeof id==='string' ) {
                ab= cc.plugin.asset.AssetManager.getAudioBuffer(id);
            } else {
                ab= <AudioBuffer>id;
            }

            if (null!==ab) {
                var ae:AudioEffect = this._soundPool.pop();
                ae.setBuffer( ab );
                ae.play();

                this._playingPool.push( ae );
            }
        }

        pauseEffects() {
            for( var i=0; i<this._playingPool.length; i++ ) {
                this._playingPool[i].pause();
            }
        }

        resumeEffects() {
            for( var i=0; i<this._playingPool.length; i++ ) {
                this._playingPool[i].resume();
            }
        }

        stopEffects() {
            for( var i=0; i<this._playingPool.length; i++ ) {
                this._playingPool[i].stop();
            }
        }

        setMusic( url:string, autoplay?:boolean ) {
            this._music.loop(true);
            this._music.setUrl(url, autoplay);
        }

        playMusic() {
            this._music.loop(true);
            this._music.play();
        }

        pauseMusic() {
            this._music.pause();
        }

        resumeMusic() {
            this._music.resume()
        }

        stopMusic() {
            this._music.stop();
        }

      //
      //  enableiOSAudio() {
      //    var me = this;
      //
      //    if (audioContext && (me._iOSEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
      //      return;
      //    }
      //
      //    me._iOSEnabled = false;
      //
      //    // call this method on touch start to create and play a buffer,
      //    // then check if the audio actually played to determine if
      //    // audio has now been unlocked on iOS
      //    var unlock = function() {
      //      // create an empty buffer
      //      var buffer = ctx.createBuffer(1, 1, 22050);
      //      var source = ctx.createBufferSource();
      //      source.buffer = buffer;
      //      source.connect(ctx.destination);
      //
      //      // play the empty buffer
      //      if (typeof source.start === 'undefined') {
      //        source.noteOn(0);
      //      } else {
      //        source.start(0);
      //      }
      //
      //      // setup a timeout to check that we are unlocked on the next event loop
      //      setTimeout(function() {
      //        if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
      //          // update the unlocked state and prevent this check from happening again
      //          me._iOSEnabled = true;
      //          me.iOSAutoEnable = false;
      //
      //          // remove the touch start listener
      //          window.removeEventListener('touchstart', unlock, false);
      //        }
      //      }, 0);
      //    };
      //
      //    // setup a touch start listener to attempt an unlock in
      //    window.addEventListener('touchstart', unlock, false);
      //
      //    return me;
      //  }
      //}

        static canPlay(codec:string):boolean {
            return codecs[codec];
        }

        static getContext():AudioContext {
            return audioContext;
        }

        static isWebAudioEnabled():boolean {
            return audioContext!==null;
        }
    }

}