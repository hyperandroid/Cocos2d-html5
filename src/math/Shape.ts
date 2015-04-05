/**
 * License: see license.txt file
 */

/// <reference path="./Path.ts"/>
/// <reference path="./Matrix3.ts"/>
/// <reference path="./Color.ts"/>
/// <reference path="./path/geometry/StrokeGeometry.ts"/>
/// <reference path="../render/RenderingContext.ts"/>

module cc.math {

    export class ShapePathAttributes {

        path :          cc.math.Path= null;
        isStroked :     boolean= false;
        isFilled :      boolean= false;
        fillStyle :     any = null;
        strokeStyle :   any = null;

        fillFirst : boolean = false;

        constructor() {
            this.path= new cc.math.Path();
            this.fillStyle= cc.math.Color.BLACK;
            this.strokeStyle= cc.math.Color.BLACK;
        }

        setFilled( ) {
            if (!this.isStroked) {
                this.fillFirst= true;
            }
            this.isFilled= true;
        }

        setStroked() {
            if ( !this.isFilled ) {
                this.fillFirst= false;
            }

            this.isStroked= true;
        }

        draw( ctx:cc.render.RenderingContext ) {

            if ( this.fillFirst ) {

                if ( this.isFilled ) {
                    ctx.setFillStyle( this.fillStyle );
                    ctx.fillPath( this.path );
                }
                if ( this.isStroked ) {
                    ctx.setStrokeStyle( this.strokeStyle );
                    ctx.strokePath( this.path );
                }

            } else {

                if ( this.isStroked ) {
                    ctx.setStrokeStyle( this.strokeStyle );
                    ctx.strokePath( this.path );
                }
                if ( this.isFilled ) {
                    ctx.setFillStyle( this.fillStyle );
                    ctx.fillPath( this.path );
                }
            }
        }
    }

    /**
     * @class cc.math.Shape
     * @classdesc
     *
     * A Shape object is a collection of <code>cc.math.Path</code> objects and a fill style associated with each of them.
     * The idea is to keep under an easy-to-handle class the responsibility of stroke/paint a collection of different
     * path objects. For example, this is a good fit for SVG elements which on average are composed of a collection of
     * path and contour objects.
     *
     * PENDING: Shape objects currently don't honor the current transformation matrix.
     *
     */
    export class Shape {

        _pathAttributes : ShapePathAttributes[]= [];
        _currentPathAttributes : ShapePathAttributes = null;
        _currentPath : cc.math.Path = null;

        lineJoin : cc.render.LineJoin = cc.render.LineJoin.MITER;
        lineCap  : cc.render.LineCap = cc.render.LineCap.BUTT;
        miterLimit : number = 10;
        lineWidth : number = 1;

        constructor() {

        }

        beginPath() {
            var spa= new ShapePathAttributes();
            this._pathAttributes.push( spa );
            this._currentPathAttributes= spa;
            this._currentPath= spa.path;
        }

        __ensureCurrentPathAttributes() {
            if ( null===this._currentPathAttributes ) {
                this.beginPath();
            }
        }

        moveTo( x:number, y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.moveTo(x,y,matrix);
        }

        lineTo( x:number, y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.lineTo(x,y,matrix);
        }

        bezierCurveTo( cp0x:number, cp0y:number, cp1x:number, cp1y:number, p2x:number, p2y:number, matrix?:Float32Array  ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.bezierCurveTo( cp0x, cp0y, cp1x, cp1y, p2x, p2y, matrix );
        }

        quadraticCurveTo( cp0x:number, cp0y:number, p2x:number, p2y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.quadraticCurveTo( cp0x, cp0y, p2x, p2y, matrix );
        }

        rect( x:number, y:number, width:number, height:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.rect( x, y, width, height, matrix );
        }

        arc( x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise:boolean, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.arc( x, y, radius, startAngle, endAngle, counterClockWise, matrix );
        }

        closePath() {
            this.__ensureCurrentPathAttributes();
            this._currentPath.closePath();
        }

        stroke( ) {
            this._currentPathAttributes.setStroked();
            this._currentPath.getStrokeGeometry( {
                join        : this.lineJoin,
                cap         : this.lineCap,
                miterLimit  : this.miterLimit,
                width       : this.lineWidth
            });
        }

        fill( style : Float32Array ) {
            this._currentPathAttributes.setFilled();
            this._currentPath.getFillGeometry();
        }

        set strokeStyle( ss:any ) {
            this.__ensureCurrentPathAttributes();
            this._currentPathAttributes.strokeStyle= ss;
        }

        set fillStyle( ss:any ) {
            this.__ensureCurrentPathAttributes();
            this._currentPathAttributes.fillStyle= ss;
        }

        draw( ctx:cc.render.RenderingContext, from?:number, to?:number ) {

            if ( typeof from==="undefined" ) {
                from=0;
                to= this._pathAttributes.length;
            }
            if ( typeof to==="undefined" ) {
                to= from+1;
            }

            for( var i=from; i<to; i++ ) {
                this._pathAttributes[i].draw( ctx );
            }
        }
    }
}