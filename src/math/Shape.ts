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

            var ppa= this._currentPathAttributes;

            var spa= new ShapePathAttributes();
            this._pathAttributes.push( spa );
            this._currentPathAttributes= spa;
            this._currentPath= spa.path;

            if ( ppa ) {
                spa.fillStyle = ppa.fillStyle;
                spa.strokeStyle = ppa.strokeStyle;
            }

            return this;
        }

        __ensureCurrentPathAttributes() {
            if ( null===this._currentPathAttributes ) {
                this.beginPath();
            }
        }

        setLineWidth( w:number ) {
            this.lineWidth= w;
            return this;
        }

        setMiterLimit( w:number ) {
            this.miterLimit= w;
            return this;
        }

        setLineCap( w:cc.render.LineCap ) {
            this.lineCap= w;
            return this;
        }

        setLineJoin( w:cc.render.LineJoin ) {
            this.lineJoin= w;
            return this;
        }

        moveTo( x:number, y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.moveTo(x,y,matrix);
            return this;
        }

        lineTo( x:number, y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.lineTo(x,y,matrix);
            return this;
        }

        bezierCurveTo( cp0x:number, cp0y:number, cp1x:number, cp1y:number, p2x:number, p2y:number, matrix?:Float32Array  ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.bezierCurveTo( cp0x, cp0y, cp1x, cp1y, p2x, p2y, matrix );
            return this;
        }

        quadraticCurveTo( cp0x:number, cp0y:number, p2x:number, p2y:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.quadraticCurveTo( cp0x, cp0y, p2x, p2y, matrix );
            return this;
        }

        rect( x:number, y:number, width:number, height:number, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.rect( x, y, width, height, matrix );
            return this;
        }

        arc( x:number, y:number, radius:number, startAngle:number, endAngle:number, counterClockWise:boolean, matrix?:Float32Array ) {
            this.__ensureCurrentPathAttributes();
            this._currentPath.arc( x, y, radius, startAngle, endAngle, counterClockWise, matrix );
            return this;
        }

        closePath() {
            this.__ensureCurrentPathAttributes();
            this._currentPath.closePath();
            return this;
        }

        stroke( ) {
            this._currentPathAttributes.setStroked();
            this._currentPath.getStrokeGeometry( {
                join        : this.lineJoin,
                cap         : this.lineCap,
                miterLimit  : this.miterLimit,
                width       : this.lineWidth
            });
            return this;
        }

        fill( ) {
            this._currentPathAttributes.setFilled();
            this._currentPath.getFillGeometry();
            return this;
        }

        setStrokeStyle( ss:any ) {
            this.__ensureCurrentPathAttributes();
            this._currentPathAttributes.strokeStyle= ss;
            return this;
        }

        set strokeStyle( ss:any ) {
            this.setStrokeStyle(ss);
        }

        set fillStyle( ss:any ) {
            this.setFillStyle(ss);
        }

        setFillStyle( ss:any ) {
            this.__ensureCurrentPathAttributes();
            this._currentPathAttributes.fillStyle= ss;
            return this;
        }

        draw( ctx:cc.render.RenderingContext ) {
            for( var i=0; i<this._pathAttributes.length; i++ ) {
                this._pathAttributes[i].draw( ctx );
            }
        }
    }
}