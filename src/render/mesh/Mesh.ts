/**
 * License: see license.txt file
 */

/// <reference path="../../node/sprite/SpriteFrame.ts"/>
/// <reference path="../RenderingContext.ts"/>
/// <reference path="../../math/Rectangle.ts"/>

module cc.render.mesh {


    /**
     * A mesh is a grid composed of geometry and u,v information.
     */
    export class Mesh {

        _originalGeometry:      Float32Array = null;
        _geometry:      Float32Array = null;
        _uv:            Float32Array = null;
        _workuv:        Float32Array = null;
        _indices:       Uint16Array = null;

        _initialized:   boolean = false;
        _rectgl:        cc.math.Rectangle = null;

        Mesh() {

        }

        initialize( pointsWidth:number, pointsHeight:number, width:number, height:number ) {

            var numPointsInMesh:number= pointsWidth*pointsHeight;

            this._geometry= new Float32Array( numPointsInMesh*3 );
            this._originalGeometry= new Float32Array( numPointsInMesh*3 );
            this._uv= new Float32Array( numPointsInMesh*2 );
            this._workuv= new Float32Array( numPointsInMesh*2 );
            this._indices= new Uint16Array( (pointsWidth-1)*(pointsHeight-1)*6 );

            for( var i=0; i<pointsHeight; i++ ) {
                for( var j=0; j< pointsWidth; j++ ) {

                    var pointIndex= j+i*pointsWidth;

                    this._geometry[pointIndex*3  ]= j/(pointsWidth-1) * width;      // x
                    this._geometry[pointIndex*3+1]= i/(pointsHeight-1) * height;    // y
                    this._geometry[pointIndex*3+2]= 0;                              // z
                    this._originalGeometry[ pointIndex*3   ] = this._geometry[ pointIndex * 3   ];
                    this._originalGeometry[ pointIndex*3+1 ] = this._geometry[ pointIndex * 3+1 ];
                    this._originalGeometry[ pointIndex*3+2 ] = this._geometry[ pointIndex * 3+2 ];

                    this._uv[pointIndex*2  ]= j/(pointsWidth-1);                    // normalized u
                    this._uv[pointIndex*2+1]= i/(pointsHeight-1);                   // normalized v

                    this._workuv[pointIndex*2  ]= j/(pointsWidth-1);                // normalized u
                    this._workuv[pointIndex*2+1]= i/(pointsHeight-1);               // normalized v
                }
            }

            var index= 0;
            for( var i=0; i<pointsHeight-1; i++ ) {
                for (var j = 0; j < pointsWidth - 1; j++) {

                    var indexindex= j+i*pointsWidth;

                    this._indices[ index   ]= indexindex;
                    this._indices[ index+1 ]= indexindex+1;
                    this._indices[ index+2 ]= indexindex+pointsWidth;

                    this._indices[ index+3 ]= indexindex+pointsWidth;
                    this._indices[ index+4 ]= indexindex+1;
                    this._indices[ index+5 ]= indexindex+pointsWidth+1;

                    index+=6;
                }
            }

            this._initialized= true;
        }

        draw( ctx:cc.render.RenderingContext, sf:cc.node.sprite.SpriteFrame, color? : number ) {
            if ( !this._initialized ) {
                return;
            }

            color= typeof color==="undefined" ? 0xffffffff : color;

            if ( this._rectgl!==sf._normalizedRect ) {
                this._rectgl= sf._normalizedRect;

                var offx= this._rectgl.x;
                var offy= this._rectgl.y;
                var diffx= this._rectgl.x1-this._rectgl.x;
                var diffy= this._rectgl.y1-this._rectgl.y;

                for( var i=0; i<this._uv.length; i+=2 ) {
                    this._workuv[i]= this._uv[i]*diffx + offx;
                    this._workuv[i]= this._uv[i]*diffy + offy;
                }
            }

            ctx.drawMesh( this._geometry, this._workuv, this._indices, color, sf._texture );
        }

        deform( segment:cc.math.path.Segment ) {

        }
    }

}