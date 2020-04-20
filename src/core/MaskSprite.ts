import { DisplayObject } from "./DisplayObject";

export interface MaskSprite extends DisplayObject{
    maskSprite(): vf.Sprite | vf.Graphics;
}
