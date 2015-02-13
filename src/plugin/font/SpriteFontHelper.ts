/**
 * License: see license.txt file
 */

module cc.plugin.font {

    /**
     * @class cc.plugin.font.FontMetrics
     * @classdesc
     *
     * This class represents Font metrics information.
     * It is needed for building on-the-fly system SpriteFont objects.
     *
     */
    export class FontMetrics {

        /**
         * Text height.
         * @member cc.plugin.font.FontMetrics#height
         * @type {number}
         */
        height: number;

        /**
         * Text ascent.
         * @member cc.plugin.font.FontMetrics#ascent
         * @type {number}
         */
        ascent: number;

        /**
         * Text descent.
         * @member cc.plugin.font.FontMetrics#descent
         * @type {number}
         */
        descent:number;

        /**
         * Build a new FontMetrics object instance.
         * @method cc.plugin.font.FontMetrics#constructor
         */
        constructor( h?:number, as?:number, des?:number ) {
            this.height= h;
            this.ascent= as;
            this.descent= des;
        }
    }

    /**
     * Get a FontMetrics object. The system will try to guess the most accurate FontMetrics object based on system
     * capabilities:
     *
     * <li>First, try to get metrics info from the CanvasRenderingContext2D TextMetrics object.
     * <li>If not available, will try to execute a voodoo function to measure size using DOM and CSS.
     * <li>If not, will guess from the font size. most inaccurate, and buggy.
     *
     * @name getFontMetrics
     * @memberOf cc.plugin.font
     *
     * @param ctx {CanvasRenderingContext2D}
     * @param font {string} valid canvas font representation.
     */
    export function getFontMetrics(ctx:CanvasRenderingContext2D, font:string) : FontMetrics {

        var prevFont= ctx.font;
        ctx.font= font;
        var fm:TextMetrics= ctx.measureText("WHGÑg");
        var ffm= <any>fm;
        if ( typeof ffm.actualBoundingBoxDescent!=="undefined" ) {

            var ret= new FontMetrics();
            ret.height= ffm.actualBoundingBoxAscent + ffm.actualBoundingBoxDescent;
            ret.ascent= ffm.actualBoundingBoxAscent;
            ret.descent= ffm.actualBoundingBoxDescent;

            ctx.font= prevFont;
            return ret;
        }

        try {
            ret = getFontMetricsCSS(font);
            return ret;
        } catch (e) {
        }

        return getFontMetricsNoCSS(font);
    }

    function getFontMetricsNoCSS(font) {

        var re = /(\d+(\.\d+)?)p[x|t]\s*/i;
        var res = re.exec(font);

        var height:number;

        if (!res) {
            height = 32;
        } else {
            // yes, no need to split the px|t, parsefloat is good enough !!
            height = parseFloat(res[1]);
        }

        var ascent = height - 1;
        var h = (height + height * 0.25) | 0;
        return new FontMetrics( h, ascent, h - ascent );

    }

    /**
     * Totally ripped from:
     *
     * jQuery (offset function)
     * Daniel Earwicker: http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
     *
     * @param font
     * @return {*}
     */
    function getFontMetricsCSS(font) {

        function offset(elem) {

            var box, docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, top, left;
            var doc = elem && elem.ownerDocument;
            docElem = doc.documentElement;

            box = elem.getBoundingClientRect();

            body = document.body;
            win = doc.nodeType === 9 ? doc.defaultView || doc.parentWindow : false;

            clientTop = docElem.clientTop || body.clientTop || 0;
            clientLeft = docElem.clientLeft || body.clientLeft || 0;
            scrollTop = win.pageYOffset || docElem.scrollTop;
            scrollLeft = win.pageXOffset || docElem.scrollLeft;
            top = box.top + scrollTop - clientTop;
            left = box.left + scrollLeft - clientLeft;

            return { top:top, left:left };
        }

        try {
            var text = document.createElement("span");
            text.style.font = font;
            text.innerHTML = "Ñg";

            var block = document.createElement("div");
            block.style.display = "inline-block";
            block.style.width = "1px";
            block.style.height = "0px";

            var div = document.createElement("div");
            div.appendChild(text);
            div.appendChild(block);


            var body = document.body;
            body.appendChild(div);

            try {

                var result = new FontMetrics( );

                block.style.verticalAlign = 'baseline';
                result.ascent = offset(block).top - offset(text).top;

                block.style.verticalAlign = 'bottom';
                result.height = offset(block).top - offset(text).top;

                result.ascent = Math.ceil(result.ascent);
                result.height = Math.ceil(result.height);

                result.descent = result.height - result.ascent;

                return result;

            } finally {
                body.removeChild(div);
            }
        } catch (e) {
            return null;
        }
    }

}