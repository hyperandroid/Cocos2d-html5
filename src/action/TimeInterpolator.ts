/**
 * License: see license.txt file.
 */


module cc.action {

    "use strict";

    export interface InterpolatorInitializer {

        type : string;
        inverse? : boolean;
        pingpong? : boolean;
        exponent? : number;
        period? : number;
    }

    /**
     * @class cc.action.TimeInterpolator
     * @interface
     * @classdesc
     *
     * Interface for all Interpolator functions.
     * <br>
     * This is a callable interface: <code>(time:number) => number</code>
     *
     */
    export interface TimeInterpolator {
        (time:number) : number;

        /**
         * Reverse the interpolator instance.
         * @method cc.action.TimeInterpolator#reverse
         */
        reverse() : TimeInterpolator;

        getInitializer() : InterpolatorInitializer;
    }

    export function ParseInterpolator( ii:InterpolatorInitializer ) {
        if ( ii.type==="EaseIn" || ii.type==="EaseOut" || ii.type==="EaseInOut" ) {
            return cc.action.Interpolator[ii.type](ii.exponent, ii.inverse, ii.pingpong);
        } else if ( ii.type==="ElasticIn" || ii.type==="ElasticOut" || ii.type==="ElasticInOut" ) {
            return cc.action.Interpolator[ii.type](ii.period, ii.inverse, ii.pingpong);
        } else {
            return cc.action.Interpolator[ii.type](ii.inverse, ii.pingpong);
        }
    }

    function calcTime( time:number, inverse:boolean, pingpong:boolean ) {

        if (pingpong) {
            if (time < 0.5) {
                time *= 2;
            } else {
                time = 1 - (time - 0.5) * 2;
            }
        }

        if (inverse) {
            time = 1 - time;
        }

        return time;
    }

    function bounceTime(time1) {
        if (time1 < 1 / 2.75) {
            return 7.5625 * time1 * time1;
        } else if (time1 < 2 / 2.75) {
            time1 -= 1.5 / 2.75;
            return 7.5625 * time1 * time1 + 0.75;
        } else if (time1 < 2.5 / 2.75) {
            time1 -= 2.25 / 2.75;
            return 7.5625 * time1 * time1 + 0.9375;
        }

        time1 -= 2.625 / 2.75;
        return 7.5625 * time1 * time1 + 0.984375;
    }

    /**
     * @class cc.action.Interpolator
     *
     * @classdesc
     * Interpolators are functions used to modify a normalized value, commonly an action current time relative to
     * the action's duration.
     * <br>
     * The achieved effect is pretty interesting for animations, from slow acceleration to bounces, elastic behaviors,
     * etc. All interpolators are the same object types, and have same capabilities
     *   <li>inverse {boolean}: make the interpolator apply inversely (time applies from 1 to 0)
     *   <li>pingpong {boolean}: the interpolator will apply half the time non-inverse and the other half of the time
     *       inversely. This is suitable for effects that apply and de-apply. I.e. zoom from scale 1 to 2, and back from
     *       2 to 1. In previous API, two actions were needed for such effects.
     * <br>
     * Some of the interpolators are easing functions, quadratic bezier curves, etc.
     * <br>
     * In V2 and V3 API, interpolators were cc.easing actions, and in V4, they have been turned into an action
     * attribute.
     * <br>
     * An interpolator is set for an action by calling <code>action.setInterpolator</code>.
     */
    export class Interpolator {

        /**
         * Build a linear interpolator.
         * @method cc.action.Interpolator.Linear
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {cc.action.TimeInterpolator}
         */
        static Linear(inverse?:boolean, pingpong?:boolean):TimeInterpolator {

            var fn:any = function LinearImpl(time:number):number {
                return calcTime( time, inverse, pingpong );
            };

            fn.reverse = function () : TimeInterpolator {
                return Interpolator.Linear(!inverse, pingpong);
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "Linear",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;

        }

        /**
         * Build an ease-in interpolator.
         * @param exponent {number} exponent
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseIn
         */
        static EaseIn(exponent:number, inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseInImpl(time:number) : number {

                return Math.pow(calcTime( time, inverse, pingpong ), exponent);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseIn( exponent, !inverse, pingpong );
            };


            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseIn",
                    inverse : inverse,
                    pingpong : pingpong,
                    exponent : exponent
                };
            };

            return fn;
        }

        /**
         * Build an ease-out interpolator.
         * @param exponent {number} exponent
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseOut
         */
        static EaseOut(exponent:number, inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseOutImpl(time:number) : number {

                return 1 - Math.pow(1 - calcTime( time, inverse, pingpong ), exponent);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseOut( exponent, !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseOut",
                    inverse : inverse,
                    pingpong : pingpong,
                    exponent : exponent
                };
            };

            return fn;
        }

        /**
         * Build an ease-in-out interpolator.
         * @param exponent {number} exponent
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseInOut
         */
        static EaseInOut(exponent:number, inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseInOutImpl(time:number) : number {

                time= calcTime( time, inverse, pingpong );

                if (time * 2 < 1) {
                    return Math.pow(time * 2, exponent) / 2;
                }

                return 1 - Math.abs(Math.pow(time * 2 - 2, exponent)) / 2;
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseInOut( exponent, !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseInOut",
                    inverse : inverse,
                    pingpong : pingpong,
                    exponent : exponent
                };
            };

            return fn;
        }


        /**
         * Build an exponential-in interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseExponentialIn(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseInImpl(time:number) : number {

                time= calcTime( time, inverse, pingpong );
                return time===0 ? 0 : Math.pow(2, 10 * (time - 1));
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseExponentialIn( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseExponentialIn",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an exponential-out interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseExponentialOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseOutImpl(time:number) : number {

                time= calcTime( time, inverse, pingpong );

                return time === 1 ? 1 : 1-Math.pow(2, -10 * time);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseExponentialOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseExponentialOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an exponential-in-out interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialInOut
         */
        static EaseExponentialInOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseInOutImpl(time:number) : number {

                var dt= calcTime( time, inverse, pingpong );
                dt *= 2;
                if (dt < 1) {
                    return 0.5 * Math.pow(2, 10 * (dt - 1));
                }
                else {
                    return 0.5 * (-Math.pow(2, -10 * (dt - 1)) + 2);
                    //return 0.5 * (1 -Math.pow(2, -10 * (dt - 2)) );
                }
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseExponentialInOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseExponentialInOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an sine-in interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseSineIn(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseSineInImpl(time:number) : number {
                time= calcTime( time, inverse, pingpong );
                return time===0 || time===1 ? time : 1 - Math.cos(time * Math.PI / 2);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseSineIn( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseSineIn",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an sine-out interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseSineOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseSineOutImpl(time:number) : number {
                time = calcTime(time, inverse, pingpong);
                return time === 1 || time === 0 ? time : Math.sin(time * Math.PI / 2);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseSineOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseSineOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an sine-inout interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseSineInOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseSineInOutImpl(time:number) : number {
                var dt = calcTime(time, inverse, pingpong);
                return dt===0 || dt===1 ? dt : -0.5 * (Math.cos(Math.PI * dt) - 1);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseSineInOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseSineInOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an EaseElasticIn interpolator.
         * @param period {number=}
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseElasticIn(period?:number, inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseElasticInImpl(time:number) : number {

                period = typeof period==='undefined' ? 0.3 : period;

                var dt= calcTime( time, inverse, pingpong );

                if (dt === 0 || dt === 1) {
                    return dt;
                } else {
                    var s = period / 4;
                    dt = dt - 1;
                    return -Math.pow(2, 10 * dt) * Math.sin((dt - s) * Math.PI * 2 / period);
                }
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseElasticIn( period, !inverse, pingpong );
            };


            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseElasticIn",
                    inverse : inverse,
                    pingpong : pingpong,
                    period: period
                };
            };

            return fn;
        }

        /**
         * Build an EaseElasticOut interpolator.
         * @param period {number=}
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseElasticOut(period?:number, inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseElasticOutImpl(time:number) : number {

                period = typeof period==='undefined' ? 0.3 : period;

                var dt = calcTime(time, inverse, pingpong);

                if (dt === 0 || dt == 1) {
                    return dt;
                } else {
                    var s = period / 4;
                    return Math.pow(2, -10 * dt) * Math.sin((dt - s) * Math.PI * 2 / period) + 1;
                }
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseElasticOut( period, !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseElasticOut",
                    inverse : inverse,
                    pingpong : pingpong,
                    period: period
                };
            };

            return fn;
        }

        /**
         * Build an EaseElasticInOut interpolator.
         * @param period {number=}
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseElasticInOut(period?:number, inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseElasticInOutImpl(time:number) : number {

                period = typeof period==='undefined' ? 0.3 : period;

                var dt = calcTime(time, inverse, pingpong);

                if (dt === 0 || dt == 1) {
                    return dt;
                } else {
                    dt = dt * 2;
                    var s = period / 4;
                    dt = dt - 1;
                    if (dt < 0)
                        return -0.5 * Math.pow(2, 10 * dt) * Math.sin((dt - s) * Math.PI * 2 / period);
                    else
                        return Math.pow(2, -10 * dt) * Math.sin((dt - s) * Math.PI * 2 / period) * 0.5 + 1;
                }
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseElasticInOut( period, !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseElasticInOut",
                    inverse : inverse,
                    pingpong : pingpong,
                    period: period
                };
            };

            return fn;
        }

        /**
         * Build an EaseBounceIn interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseBounceIn(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseBounceInImpl(time:number) : number {
                var dt= calcTime( time, inverse, pingpong );
                return 1 - bounceTime(1 - dt);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseBounceIn( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseBounceIn",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an EaseBounceOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBounceOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseBounceOutImpl(time:number) : number {
                return bounceTime( calcTime(time, inverse, pingpong) );
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseBounceOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseBounceOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an EaseBounceInOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBounceInOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseBounceInOutImpl(time:number) : number {

                var dt = calcTime(time, inverse, pingpong);
                if (dt < 0.5) {
                    dt = dt * 2;
                    return (1 - bounceTime(1 - dt)) * 0.5;
                } else {
                    return bounceTime(dt * 2 - 1) * 0.5 + 0.5;
                }
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseBounceInOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseBounceInOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an EaseBackIn interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialIn
         */
        static EaseBackIn(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseBackInImpl(time:number) : number {
                var dt= calcTime( time, inverse, pingpong );
                var overshoot = 1.70158;
                return dt===0 || dt===1 ?
                    dt :
                    dt * dt * ((overshoot + 1) * dt - overshoot);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseBackIn( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseBackIn",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an EaseBackOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBackOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseBackOutImpl(time:number) : number {
                var dt= calcTime(time, inverse, pingpong);
                var overshoot = 1.70158;
                dt = dt - 1;
                return 1 + dt * dt * ((overshoot + 1) * dt + overshoot);
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseBackOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseBackOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

        /**
         * Build an EaseBackInOut interpolator.
         * @param inverse {boolean=}
         * @param pingpong {boolean=}
         * @returns {TimeInterpolator}
         * @method cc.action.Interpolator.EaseExponentialOut
         */
        static EaseBackInOut(inverse?:boolean, pingpong?:boolean) : TimeInterpolator {

            var fn : any = function EaseBounceInOutImpl(time:number) : number {

                var dt = calcTime(time, inverse, pingpong);
                var overshoot = 1.70158;
                dt = dt * 2;
                    if (dt < 1) {
                        return (dt * dt * ((overshoot + 1) * dt - overshoot)) / 2;
                    } else {
                        dt = dt - 2;
                        return 1 + (dt * dt * ((overshoot + 1) * dt + overshoot)) / 2;
                    }
            };

            fn.reverse = function() : TimeInterpolator {
                return Interpolator.EaseBackInOut( !inverse, pingpong );
            };

            fn.getInitializer = function() : InterpolatorInitializer {
                return {
                    type : "EaseBackInOut",
                    inverse : inverse,
                    pingpong : pingpong
                };
            };

            return fn;
        }

    }
}