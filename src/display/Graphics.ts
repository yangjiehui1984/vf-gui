import { DisplayObject } from "../core/DisplayObject";


/**
 * 矢量绘制
 * 
 * @example let graphics = new vf.gui.Graphics();
 * 
 * 
 * @link https://vipkid-edu.github.io/vf-gui/play/#example/TestTimeLine
 */
export class Graphics extends DisplayObject {

    public constructor(geometry?: vf.GraphicsGeometry | undefined) {
        super();
        this.graphics = new vf.Graphics(geometry);
        this.container.addChild(this.graphics);
    }

    public readonly graphics: vf.Graphics;

}