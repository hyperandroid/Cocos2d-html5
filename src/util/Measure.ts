/**
 * License: see license.txt file
 */

module cc.Performance {

    function __startPerformance() : number {
        return performance.now();
    }

    function __startTime() : number {
        return new Date().getTime();
    }

    var _units:number = typeof performance!=="undefined" ? 1000 : 1;
    var __start:()=>number = typeof performance!=="undefined" ? __startPerformance : __startTime;

    var MEASURE_CACHE_SIZE= 500;

    export class Measure {

        _prevValues:number[]= [];
        _accumulatedValue:number= 0;

        _name:string= null;
        _value:number=0;
        _start:number= 0;

        constructor( name ) {
            this._name= name;
        }

        increment() {
            this._value++;
        }

        clear() {
            this._start= 0;
            this._value= 0;
            this._accumulatedValue= 0;
        }

        clearCache() {
            this._prevValues= [];
        }

        setValue( v:number ) {
            this._value= v;
            this._accumulatedValue+= v;
        }

        getValue() {
            return this._value;
        }

        start() {
            this._start= __start();
        }

        end() {
            this._value+= __start()-this._start
        }

        save() {
            if ( this._prevValues.length>MEASURE_CACHE_SIZE ) {
                this._prevValues.shift();
            }
            this._prevValues.push( this.getValue() );
        }
    }

    export class TimeMeasure extends Measure {

        constructor( name ) {
            super(name);
        }

        getValue() {
            return this._value/_units;
        }
    }

    export class Performance {

        _measures: {[id:string]:Measure} = {
            draws : new Measure("draws"),
            loop  : new TimeMeasure("loop")
        };

        constructor() {

        }

        start( id:string ) {
            this._measures[id].start();
        }

        end(id:string) {
            this._measures[id].end();
        }

        increment(id:string) {
            this._measures[id].increment();
        }

        setValue(id:string, v:number) {
            this._measures[id].setValue(v);
        }

        clear() {
            for( var id in this._measures ) {
                if ( this._measures.hasOwnProperty(id) ) {
                    this._measures[id].clear();
                }
            }
        }

        clearCache() {
            for( var id in this._measures ) {
                if ( this._measures.hasOwnProperty(id) ) {
                    this._measures[id].clearCache();
                }
            }
        }

        save() {
            for( var id in this._measures ) {
                if ( this._measures.hasOwnProperty(id) ) {
                    this._measures[id].save();
                }
            }
        }

    }
}