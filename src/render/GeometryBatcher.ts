/**
 * License: see license.txt file.
 */

/// <reference path="../math/Point.ts"/>
/// <reference path="../math/Color.ts"/>
/// <reference path="../math/Matrix3.ts"/>
/// <reference path="../node/Sprite.ts"/>
/// <reference path="./RenderingContextSnapshot.ts"/>
/// <reference path="./WebGLState.ts"/>
/// <reference path="./shader/AbstractShader.ts"/>
/// <reference path="./shader/Buffer.ts"/>

module cc.render {

    "use strict";

    import Color = cc.math.Color;
    import Point = cc.math.Point;
    import Vector = cc.math.Vector;
    import Matrix3 = cc.math.Matrix3;
    import RenderingContextSnapshot = cc.render.RenderingContextSnapshot;
    import AbstractShader = cc.render.shader.AbstractShader;
    import Buffer = cc.render.shader.Buffer;
    import WebGLState = cc.render.WebGLState;
    import Sprite = cc.node.Sprite;

    var __vv : Point = { x:0, y:0 };
    var __vv0 : Point = { x:0, y:0 };
    var __color : Uint8Array = new Uint8Array([0,0,0,0]);

    /**
     * @class cc.render.GeometryBatcher
     * @classdesc
     *
     * This class handles geometry, batches it into ping-pong'ed buffers and signals when to flush.
     */
    export class GeometryBatcher {

        /**
         * Max bufferable quads.
         * @member cc.render.GeometryBatcher.MAX_QUADS
         * @type {number}
         */
        static MAX_QUADS : number = 16383;

        /**
         * WebGL geometry, color and uv buffer ids.
         * @member cc.render.GeometryBatcher#_glDataBuffers;
         * @type {Array<WebGLBuffer>}
         * @private
         */
        _glDataBuffers : Buffer[] = [];

        /**
         * WebGL indices buffer ids.
         * @member cc.render.GeometryBatcher#_glIndexBuffers;
         * @type {Array<WebGLBuffer>}
         * @private
         */
        _glIndexBuffers : Buffer[] = [];

        /**
         * Currently used gl buffer index.
         * @member cc.render.GeometryBatcher#_glIndexBuffer
         * @type {WebGLBuffer}
         * @private
         */
        _glIndexBuffer : Buffer;

        /**
         * Currently used gl buffer for geometry, color and uv.
         * @member cc.render.GeometryBatcher#_glDataBuffer
         * @type {WebGLBuffer}
         * @private
         */
        _glDataBuffer : Buffer;

        /**
         * Batching buffers index.
         * @member cc.render.GeometryBatcher#_currentBuffersIndex
         * @type {number}
         * @private
         */
        _currentBuffersIndex : number = 0;

        /**
         * Main rendering buffer as buffer array (abstract version).
         * @member cc.render.GeometryBatcher#_dataArrayBuffer
         * @type {ArrayBuffer}
         * @private
         */
        _dataArrayBuffer : ArrayBuffer= null;

        /**
         * Current rendering buffer as Float32 array
         * @member cc.render.GeometryBatcher#_dataBufferFloat
         * @type {Float32Array}
         * @private
         */
        _dataBufferFloat : Float32Array = null;

        /**
         * Current rendering buffer as Uint8 array.
         * @member cc.render.GeometryBatcher#_dataBufferByte
         * @type {Uint8Array}
         * @private
         */
        _dataBufferByte : Uint8Array = null;

        /**
         * Current rendering buffer as Uint32 array.
         * @member cc.render.GeometryBatcher#_dataBufferUint
         * @type {Uint8Array}
         * @private
         */
        _dataBufferUint : Uint32Array = null;

        /**
         * Current Buffer index.
         * @member cc.render.GeometryBatcher#_dataBufferIndex
         * @type {number}
         * @private
         */
        _dataBufferIndex : number = 0;

        /**
         * Current rendering buffer for geometry indices.
         * @member cc.render.GeometryBatcher#_indexBuffer
         * @type {Float32Array}
         * @private
         */
        _indexBuffer : Uint16Array = null;

        /**
         * Current Buffer index.
         * @member cc.render.GeometryBatcher#_indexBufferIndex
         * @type {number}
         * @private
         */
        _indexBufferIndex : number = 0;

        _indexBufferMesh : Uint16Array = null;
        _indexBufferMeshIndex : number = 0;

        _glIndexMeshBuffers : Buffer[] = [];
        _glIndexMeshBuffer : Buffer = null;

        /**
         * The canvas WebGLRenderingContext
         * @member cc.render.GeometryBatcher#_gl
         * @type {WebGLRenderingContext}
         */
        _gl : WebGLRenderingContext= null;

        /**
         * Build a new GeometryBatcher instance. You probably will need one of this.
         * @method cc.render.GeometryBatcher#constructor
         * @param _gl {WebGLRenderingContext}
         */
        constructor( glstate : WebGLState ) {

            this._gl= glstate._gl;

            this._dataArrayBuffer= new ArrayBuffer(GeometryBatcher.MAX_QUADS*40*4);
            this._dataBufferFloat= new Float32Array(this._dataArrayBuffer);    // 40 is fastshader vertex size.
            this._dataBufferByte= new Uint8Array(this._dataArrayBuffer);
            this._dataBufferUint= new Uint32Array(this._dataArrayBuffer);
            this._indexBuffer= new Uint16Array( GeometryBatcher.MAX_QUADS*6 );
            this._indexBufferMesh= new Uint16Array( GeometryBatcher.MAX_QUADS*6 );

            // preset geometry indices.
            var indexBufferIndex= 0;
            var elementIndex= 0;
            var indexBuffer= this._indexBuffer;
            for( var i=0; i<GeometryBatcher.MAX_QUADS; i++ ) {

                indexBuffer[indexBufferIndex] = elementIndex;
                indexBuffer[indexBufferIndex + 1] = elementIndex + 1;
                indexBuffer[indexBufferIndex + 2] = elementIndex + 2;

                indexBuffer[indexBufferIndex + 3] = elementIndex;
                indexBuffer[indexBufferIndex + 4] = elementIndex + 2;
                indexBuffer[indexBufferIndex + 5] = elementIndex + 3;
                indexBufferIndex += 6;
                elementIndex += 4;
            }

            for( var i=0; i<GeometryBatcher.MAX_QUADS*6; i++ ) {
                this._indexBufferMesh[ i ]= i;
            }

            this._glDataBuffers.push( new Buffer( this._gl, this._gl.ARRAY_BUFFER, this._dataBufferFloat, this._gl.DYNAMIC_DRAW ) );
            this._glDataBuffers.push( new Buffer( this._gl, this._gl.ARRAY_BUFFER, this._dataBufferFloat, this._gl.DYNAMIC_DRAW ) );
            this._glDataBuffers.push( new Buffer( this._gl, this._gl.ARRAY_BUFFER, this._dataBufferFloat, this._gl.DYNAMIC_DRAW ) );
            this._glDataBuffers.push( new Buffer( this._gl, this._gl.ARRAY_BUFFER, this._dataBufferFloat, this._gl.DYNAMIC_DRAW ) );

            this._glIndexBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer, this._gl.STATIC_DRAW ) );
            this._glIndexBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer, this._gl.STATIC_DRAW ) );
            this._glIndexBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer, this._gl.STATIC_DRAW ) );
            this._glIndexBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer, this._gl.STATIC_DRAW ) );

            this._glIndexMeshBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBufferMesh, this._gl.STATIC_DRAW ) );
            this._glIndexMeshBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBufferMesh, this._gl.STATIC_DRAW ) );
            this._glIndexMeshBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBufferMesh, this._gl.STATIC_DRAW ) );
            this._glIndexMeshBuffers.push( new Buffer( this._gl, this._gl.ELEMENT_ARRAY_BUFFER, this._indexBufferMesh, this._gl.STATIC_DRAW ) );

            this._glDataBuffer= this._glDataBuffers[0];
            this._glIndexBuffer= this._glIndexBuffers[0];
            this._glIndexMeshBuffer= this._glIndexMeshBuffers[0];
        }

        batchRectGeometryWithTexture( vertices:Point[], u0:number, v0:number, u1:number, v1:number, rcs:RenderingContextSnapshot ) {
            var cc= this.__uintColor( rcs );

            this.batchVertex( vertices[0], cc, u0,v0 );
            this.batchVertex( vertices[1], cc, u1,v0 );
            this.batchVertex( vertices[2], cc, u1,v1 );
            this.batchVertex( vertices[3], cc, u0,v1 );

            // add two triangles * 3 values each.
            this._indexBufferIndex+=6;

            return this._indexBufferIndex+6 >= this._indexBuffer.length;
        }

        /**
         * Batch a rectangle with texture info and tint color.
         * Tint color will be modified by currently alpha value set.
         * @member cc.render.GeometryBatcher#batchRectWithTexture
         * @param x {number} rectangle position
         * @param y {number}
         * @param w {number} rectangle size
         * @param h {number}
         * @param rcs {RenderingContextSnapshot} current rendering context snapshot info
         * @param u0 {number} texture position
         * @param v0 {number}
         * @param u1 {number} texture size
         * @param v1 {number}
         */
        batchRectWithTexture( x:number, y:number, w:number, h:number, rcs:RenderingContextSnapshot,
                              u0:number, v0:number, u1:number, v1:number ) :boolean {

            var cm : Float32Array= rcs._currentMatrix;
            var cc= this.__uintColor( rcs );

            __vv.x= x;
            __vv.y= y;
            this.batchVertex( Matrix3.transformPoint(cm,__vv), cc, u0,v0 );
            __vv.x= x+w;
            __vv.y= y;
            this.batchVertex( Matrix3.transformPoint(cm,__vv), cc, u1,v0 );
            __vv.x= x+w;
            __vv.y= y+h;
            this.batchVertex( Matrix3.transformPoint(cm,__vv), cc, u1,v1 );
            __vv.x= x;
            __vv.y= y+h;
            this.batchVertex( Matrix3.transformPoint(cm,__vv), cc, u0,v1 );

            // add two triangles * 3 values each.
            this._indexBufferIndex+=6;

            return this._indexBufferIndex+6 >= this._indexBuffer.length;
        }

        /**
         * Batch a rect with the current rendering info. The rect color will be tinted. Resulting transparency value will
         * be modified by currently rendering context alpha value set.
         * @method cc.render.GeometryBatcher#batchRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @param rcs {cc.render.RenderingContextSnapshot} current rendering context snapshot info
         */
        batchRect( x:number, y:number, w:number, h:number, rcs:RenderingContextSnapshot ) : boolean {

            var color:Float32Array= rcs._fillStyleColor;
            var tint:Float32Array= rcs._tintColor;

            var r= ((color[0] * tint[0])*255)|0;
            var g= ((color[1] * tint[1])*255)|0;
            var b= ((color[2] * tint[2])*255)|0;
            var a= ((color[3] * tint[3] * rcs._globalAlpha)*255)|0;
            var cc= (r)|(g<<8)|(b<<16)|(a<<24);

            var cm : Float32Array= rcs._currentMatrix;

            // 0-1-2

            __vv0.x= x;
            __vv0.y= y;
            Matrix3.transformPoint(cm,__vv0);
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv0.x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv0.y;
            this._dataBufferUint [ this._dataBufferIndex++ ] = cc;

            __vv.x= x+w;
            __vv.y= y;
            Matrix3.transformPoint(cm,__vv);
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.y;
            this._dataBufferUint [ this._dataBufferIndex++ ] = cc;

            __vv.x= x+w;
            __vv.y= y+h;
            Matrix3.transformPoint(cm,__vv);
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.y;
            this._dataBufferUint [ this._dataBufferIndex++ ] = cc;


            // 0-2-3

            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv0.x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv0.y;
            this._dataBufferUint [ this._dataBufferIndex++ ] = cc;

            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.y;
            this._dataBufferUint [ this._dataBufferIndex++ ] = cc;

            __vv.x= x;
            __vv.y= y+h;
            Matrix3.transformPoint(cm,__vv);
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = __vv.y;
            this._dataBufferUint [ this._dataBufferIndex++ ] = cc;

            // add two triangles * 3 values each.
            this._indexBufferMeshIndex+=6;

            return this._indexBufferMeshIndex+6 >= this._indexBuffer.length;
        }

        /**
         * Batch a vertex with color and texture.
         * @method cc.render.GeometryBatcher#batchVertex
         * @param p {Point}
         * @param r {number}
         * @param g {number}
         * @param b {number}
         * @param a {number}
         * @param u {number}
         * @param v {number}
         */
        batchVertex( p:Point, cc:number, u:number, v:number ) : void {
            this._dataBufferFloat[ this._dataBufferIndex++ ] = p.x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = p.y;
            this._dataBufferUint [ this._dataBufferIndex++ ] = cc;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = u;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = v;
        }

        /**
         * BUGBUG refactor. Move to AbstractShader and reimplement for each shader.
         * Flush currently batched geometry and related info with a given shader program.
         * @method cc.render.GeometryBatcher#flush
         * @param shader {cc.render.shader.AbstractShader} program shader
         * @param rcs {cc.render.RenderingContextSnapshot}
         */
        flush( shader: AbstractShader, rcs:cc.render.RenderingContextSnapshot ) : void {

            var trianglesCount;

            if (shader.useMeshIndex()) {
                trianglesCount = this._indexBufferMeshIndex;
                if (!trianglesCount) {
                    return;
                }
                this._glIndexMeshBuffer.bind(this._gl.ELEMENT_ARRAY_BUFFER);

            } else {
                trianglesCount = this._indexBufferIndex;
                if (!trianglesCount) {
                    return;
                }
                // simply rebind the buffer, not modify its contents.
                this._glIndexBuffer.bind(this._gl.ELEMENT_ARRAY_BUFFER);
            }

            //this._glDataBuffer.forceEnableWithValue(this._dataBufferFloat);
            this._glDataBuffer.forceEnableWithValue(this._dataBufferFloat.subarray(0, this._dataBufferIndex));
            //this._glDataBuffer.enableWithValue(this._dataBufferFloat.subarray(0, this._dataBufferIndex));

            shader.flushBuffersWithContent(rcs);

            this._gl.drawElements(this._gl.TRIANGLES, trianglesCount, this._gl.UNSIGNED_SHORT, 0);
            //this._gl.drawArrays(this._gl.TRIANGLES, 0, trianglesCount);

            // reset buffer data index.
            this._dataBufferIndex = 0;
            this._indexBufferIndex = 0;
            this._indexBufferMeshIndex = 0;

            // ping pong rendering buffer.
            this._currentBuffersIndex = (this._currentBuffersIndex + 1) & 3;
            this._glDataBuffer = this._glDataBuffers[this._currentBuffersIndex];
            this._glIndexBuffer = this._glIndexBuffers[this._currentBuffersIndex];
            this._glIndexMeshBuffer = this._glIndexMeshBuffers[this._currentBuffersIndex];
        }

        __uintColor( rcs:RenderingContextSnapshot ) : number {
            var tint:Float32Array= rcs._tintColor;

            var r= (tint[0]*255)|0;
            var g= (tint[1]*255)|0;
            var b= (tint[2]*255)|0;
            var a= (tint[3] * rcs._globalAlpha*255)|0;

            return (r)|(g<<8)|(b<<16)|(a<<24);
        }

        batchRectGeometryWithSpriteFast( sprite:Sprite, u0:number, v0:number, u1:number, v1:number, rcs:RenderingContextSnapshot ) {

            var cc= this.__uintColor( rcs );

            var db= this._dataBufferFloat;
            var dbuint= this._dataBufferUint;
            var dbi=this._dataBufferIndex;

            //var w0 = (sprite._contentSize.width ) * (1-sprite._transformationAnchor.x);
            //var w1 = (sprite._contentSize.width ) * -sprite._transformationAnchor.x;
            //
            //var h1 = sprite._contentSize.height * (1-sprite._transformationAnchor.y);
            //var h0 = sprite._contentSize.height * -sprite._transformationAnchor.y;


            dbuint[dbi+2]= dbuint[dbi+12]= dbuint[dbi+22]= dbuint[dbi+32]= cc;
            db[dbi  ]= db[dbi+10]= db[dbi+20]= db[dbi+30]= sprite.x;
            db[dbi+1]= db[dbi+11]= db[dbi+21]= db[dbi+31]= sprite.y;
            db[dbi+7]= db[dbi+17]= db[dbi+27]= db[dbi+37]= sprite.rotationAngle;
            db[dbi+8]= db[dbi+18]= db[dbi+28]= db[dbi+38]= sprite.scaleX;
            db[dbi+9]= db[dbi+19]= db[dbi+29]= db[dbi+39]= sprite.scaleY;

            var w0 = sprite.width/2.0;
            var w1 = -w0;

            var h1 = sprite.height/2.0;
            var h0 = -h1;

            db[dbi+3]= u0;
            db[dbi+4]= v0;
            db[dbi+5]= w0;
            db[dbi+6]= h0;

            db[dbi+13]= u1;
            db[dbi+14]= v0;
            db[dbi+15]= w1;
            db[dbi+16]= h0;

            db[dbi+23]= u1;
            db[dbi+24]= v1;
            db[dbi+25]= w1;
            db[dbi+26]= h1;

            db[dbi+33]= u0;
            db[dbi+34]= v1;
            db[dbi+35]= w0;
            db[dbi+36]= h1;

            // add two triangles * 3 values each.
            this._indexBufferIndex+=6;
            this._dataBufferIndex+= 40;

            return this._dataBufferIndex+40 >= this._dataBufferFloat.length;
        }

        batchMesh( geometry:Float32Array, uv:Float32Array, indices:Uint32Array, color:number, rcs:RenderingContextSnapshot  ) {

            for( var i=0; i<indices.length; i+=3 ) {

                var indexVertex0= indices[i+0]*3;
                var indexVertexUV0= indices[i+0]*2;
                this.batchMeshVertex(
                    geometry[ indexVertex0 ], geometry[ indexVertex0+1 ],
                    uv[ indexVertexUV0 ], uv[ indexVertexUV0+1 ] );

                var indexVertex1= indices[i+1]*3;
                var indexVertexUV1= indices[i+1]*2;
                this.batchMeshVertex(
                    geometry[ indexVertex1 ], geometry[ indexVertex1+1 ],
                    uv[ indexVertexUV1 ], uv[ indexVertexUV1+1 ] );

                var indexVertex2= indices[i+2]*3;
                var indexVertexUV2= indices[i+2]*2;
                this.batchMeshVertex(
                    geometry[ indexVertex2 ], geometry[ indexVertex2+1 ],
                    uv[ indexVertexUV2 ], uv[ indexVertexUV2+1 ] );
            }

        }

        batchMeshVertex( x:number, y:number, u:number, v:number ) : void {
            this._dataBufferFloat[ this._dataBufferIndex++ ] = x;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = y;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = u;
            this._dataBufferFloat[ this._dataBufferIndex++ ] = v;
            this._indexBufferMeshIndex++;
        }

        /**
         * Batch a path geometry.
         * Requires sequential indices.
         * Geometry already in screen space.
         *
         * @param geometry {Float32Array}
         * @param rcs {cc.render.RenderingContextSnapshot}
         */
        batchPath( geometry:Float32Array, rcs:RenderingContextSnapshot ) {

            var color:Float32Array= rcs._fillStyleColor;
            var tint:Float32Array= rcs._tintColor;

            var r= ((color[0] * tint[0])*255)|0;
            var g= ((color[1] * tint[1])*255)|0;
            var b= ((color[2] * tint[2])*255)|0;
            var a= ((color[3] * tint[3] * rcs._globalAlpha)*255)|0;
            var cc= (r)|(g<<8)|(b<<16)|(a<<24);

            for( var i=0; i<geometry.length; i+=2 ) {
                this._dataBufferFloat[ this._dataBufferIndex++ ] = geometry[i];
                this._dataBufferFloat[ this._dataBufferIndex++ ] = geometry[i+1];
                this._dataBufferUint [ this._dataBufferIndex++ ] = cc;
                this._indexBufferMeshIndex++
            }
        }
    }

}