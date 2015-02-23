/**
 * License: see license.txt file.
 */

module cc.render.util {

    export function getAlphaChannel( image:HTMLImageElement|HTMLCanvasElement ) : Array {

        var canvas:HTMLCanvasElement= null;
        var ctx:CanvasRenderingContext2D= null;

        if ( image instanceof HTMLCanvasElement ) {
            canvas= <HTMLCanvasElement>image;
            ctx= canvas.getContext("2d");
        } else {
            var canvas = createCanvas(image.width, image.height);
            ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
        }

        var imageData:ImageData= ctx.getImageData(0,0,canvas.width,canvas.height);

        return extractChannel( imageData.data, canvas.width, canvas.height, 3 );
    }

    export function createCanvas( w:number, h:number ) : HTMLCanvasElement {
        var canvas= document.createElement("canvas");
        canvas.width= w;
        canvas.height=h;

        return canvas;
    }

    export function extractChannel( data:number[], width:number, height:number, channel:number ) : Array {

        var ret= typeof Uint8Array!=="undefined" ?
                    new Uint8Array( width*height ) :
                    new Array( width*height );

        var pos= 0;
        for( var i=0; i<height; i++ ) {
            for( var j=0; j<width; j++ ) {
                var index= (j+i*width)<<2;
                index+= channel;

                ret[pos++]= data[index];
            }
        }

        return ret;
    }
}