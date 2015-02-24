/**
 * License: see license.txt file.
 */

module cc.render.util {

    export function getAlphaChannel( image:HTMLImageElement|HTMLCanvasElement ) : any[] | Uint8Array {
        return getChannel(image, 3);
    }

    export function getRedChannel( image:HTMLImageElement|HTMLCanvasElement ) : any[] | Uint8Array {
        return getChannel(image, 0);
    }

    export function getGreenChannel( image:HTMLImageElement|HTMLCanvasElement ) : any[] | Uint8Array {
        return getChannel(image, 1);
    }

    export function getBlueChannel( image:HTMLImageElement|HTMLCanvasElement ) : any[] | Uint8Array {
        return getChannel(image, 2);
    }

    export function getChannel( image:HTMLImageElement|HTMLCanvasElement, channel:number ) : any[] | Uint8Array {
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

    export function extractChannel( data:number[], width:number, height:number, channel:number ) : any[] | Uint8Array {

        var ret= typeof Uint8Array!=="undefined" ?
                    new Uint8Array( width*height ) :
                    new Array( width*height );

        var pos= 0;
        for( var i=0; i<data.length; i+=4 ) {
            ret[pos++]= data[i+channel];
        }

        return ret;
    }
}