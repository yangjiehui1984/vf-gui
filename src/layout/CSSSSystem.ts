import { getTexture, getDisplayObject } from "../utils/Utils";
import { DisplayObject } from "../core/DisplayObject";
import {MaskSprite} from "../core/MaskSprite";

/** ===================== background  ===================== */
export function drawBackgroundColor(background: vf.Graphics,color: number, w: number,h: number){
    background.clear();
    background.beginFill(color);
    background.drawRoundedRect(0, 0, w, h, 0);
    background.endFill();
}
export function backgroundColor(target: DisplayObject){

    if(target.style == undefined){
        return;
    }
    if(target.style.backgroundColor == undefined  && target.$background == undefined){
        return;
    }
    if (target.$background === undefined) {
        target.$background = new vf.Graphics();
        target.$background.name = "background";
        target.container.addChildAt(target.$background, 0);
    }
    drawBackgroundColor(target.$background,target.style.backgroundColor as number,target.width,target.height);
}

export function backgroundPositionSize(target: DisplayObject){
    if(target.style == undefined){
        return;
    }
    if (target.$background && target.$background.children.length > 0) {
        const sprite = target.$background.getChildAt(0) as vf.Sprite;
        const style = target.style;
        if (sprite instanceof vf.TilingSprite) {
            sprite.tilePosition.set(style.backgroundPositionX || 0, style.backgroundPositionY || 0);
        } else {
            if (style.backgroundSize) {
                sprite.width = style.backgroundSize[0];
                sprite.height = style.backgroundSize[1];
            }
            sprite.position.set(style.backgroundPositionX || 0, style.backgroundPositionY || 0);
        }
    }
}

export function backgroundRepeat(target: DisplayObject){
    if(target.style == undefined){
        return;
    }
    const style = target.style;
    if (style.backgroundImage && target.$background) {
        target.$background.removeChildren();

        let backgroundImage: vf.Texture | undefined;
        if (style.backgroundImage instanceof vf.Texture) {
            backgroundImage = style.backgroundImage;
        } else if (typeof style.backgroundImage === "string") {
            backgroundImage = getTexture(style.backgroundImage);
        }
        if (backgroundImage) {
            let sprite: vf.TilingSprite | vf.NineSlicePlane | vf.Sprite;
            if (style.backgroundRepeat === undefined) {
                style.backgroundRepeat = "no-repeat";
            }
            if (style.backgroundRepeat === "repeat") {
                sprite = new vf.TilingSprite(backgroundImage);
            } else {
                sprite = new vf.Sprite(backgroundImage);
            }

            target.$background.addChild(sprite);
            const maskGraphics = new vf.Graphics();
            target.$background.addChild(maskGraphics);
            target.$background.mask = maskGraphics;
        }
    }
}

export function backgroundImage(target: DisplayObject){
    if (target.$background === undefined) {
        target.$background = new vf.Graphics();
        target.$background.name = "background";
        target.container.addChildAt(target.$background, 0);
    }
    backgroundRepeat(target);
    backgroundPositionSize(target);

}

/** ===================== mask  ===================== */


export function maskPosition(target: DisplayObject){
    if(target.style == undefined){
        return;
    }
    if(target.$mask){
        const style = target.style;
        if(style.maskPosition === undefined){
            return;
        }
        
        if(target.$mask instanceof DisplayObject){
            target.$mask.x = style.maskPosition[0];
            target.$mask.y =  style.maskPosition[1];
        }else{
            target.$mask.position.set(style.maskPosition[0],style.maskPosition[1])
        }
    }
}

export function maskSize(target: DisplayObject){
    if(target.style == undefined){
        return;
    }
    if(target.$mask){
        const style = target.style;
        if(style.maskSize === undefined){
            return;
        }

        target.$mask.width = style.maskSize[0];
        target.$mask.height = style.maskSize[1];
        if(target.$mask instanceof vf.Graphics){
            //target.$mask.clone
        }
        if(!(target.$mask instanceof DisplayObject))
            target.$mask.updateTransform();
    }
}

export function maskImage(target: DisplayObject){
    if(target.style == undefined){
        return;
    }
    target.container.mask = null as any;
    if (target.$mask && target.$mask.parent) {
        if (target.$mask instanceof DisplayObject) {
            target.removeChild(target.$mask);
        } else {
            target.$mask.parent.removeChild(target.$mask);
        }
    }

    for (let i = 0; i < target.uiChildren.length; i++) {
        if (target.uiChildren[i].name == "maskImage") {
            target.removeChild(target.uiChildren[i]);
            break;
        }
    }

    target.$mask = undefined;
    const style = target.style;
    const container = target.container;
    let maskdisplay = getDisplayObject( style.maskImage,target) as MaskSprite | vf.Graphics | string;

    if(maskdisplay == null && style.maskImage instanceof vf.Graphics){
        maskdisplay = style.maskImage as vf.Graphics;
    }
    if(maskdisplay == null || maskdisplay === ''){
        return;
    }

    if (maskdisplay instanceof vf.Graphics) {
        target.$mask = maskdisplay;
        container.mask = target.$mask;
        container.addChild(target.$mask);
    } else if (maskdisplay instanceof DisplayObject) {

        if((maskdisplay as MaskSprite).maskSprite){
            target.$mask = maskdisplay;//gui组件
            target.$mask.name = "maskImage";
            container.mask = maskdisplay.maskSprite() || null;//vf组件
            if(maskdisplay.parent == undefined){
                target.addChild(maskdisplay);
            }
                
        }
    } else {
        target.$mask = vf.Sprite.from(getTexture(style.maskImage));
        container.mask = target.$mask;
        container.addChild(target.$mask);
    }

    maskSize(target);
    maskPosition(target)

}


/** ===================== font  ===================== */
export function updateFontStyle(target: any,key: string,value: any){
    if(target.setInputStyle){
        target.setInputStyle(key, value);
    }else{
        target.sprite.style[key] =value;
    } 
}
export function color(target: any,key: string,value: any){
    if(target.setInputStyle){
        target.setInputStyle(key, value);
    }else{
        target.sprite.style.fill =value;
    }
}
