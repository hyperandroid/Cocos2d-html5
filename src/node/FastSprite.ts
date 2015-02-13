/**
 * License: see license.txt file.
 */

/// <reference path="./Node.ts"/>
/// <reference path="./Sprite.ts"/>
/// <reference path="../render/RenderingContext.ts"/>
/// <reference path="../render/DecoratedWebGLRenderingContext.ts"/>

module cc.node {

    import Node= cc.node.Node;
    import Sprite= cc.node.Sprite;
    import RenderingContext= cc.render.RenderingContext;

    /**
     * @class cc.node.FastSprite
     * @extends cc.node.Sprite
     * @classdesc
     *
     * While Nodes in general are heavy weight visual components, a Fast sprite is a very lightweight Node. In opposition
     * to a Node, a FastSprite:
     *   + scene graph does not discard it
     *   + expects to have no children. hierarchies are not handled.
     *   + get no input routed to it, such as mouse, touch, etc.
     *   + does not calculate a local bounding box, unless explicitly stated.
     *   + like old nodes, they expect than transformation and positional anchor point to be the same.
     *
     * <p>
     *     FastSprites aim at super fast management and rendering, specially in WebGL where a modern mobile phone could
     *     deliver several thousand of them at steady 60 fps.
     * <p>
     *     FastSprites are ideal for particle rendering, or for visually massive amount of nodes.
     * <p>
     *     If rendering in canvas, a FastSprite will be as fast a Sprite node. (way slower than FastSprite)
     *
     */
    export class FastSprite extends cc.node.Sprite {

        constructor( ddata : any ) {
            super(ddata);
        }

        visit(ctx:RenderingContext) {

            if (!this.__isFlagSet(NodeDirtyFlags.VISIBLE)) {
                return;
            }

            if (this._spriteFrame) {
                ctx.globalAlpha = this._frameAlpha;
                ctx.setTintColor(this._color);

                if ( ctx.type==="webgl" ) {
                    (<cc.render.DecoratedWebGLRenderingContext>ctx).batchGeometryWithSpriteFast(this);
                } else {
                    super.visit(ctx);
                }

            }
        }

    }
}