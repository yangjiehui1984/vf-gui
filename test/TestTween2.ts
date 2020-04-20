// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />

export default class TestTween2 {

    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app,uiStage)
    }

    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {

        /** 基础文本展示 */
        const basicText = new vf.gui.Label();
        basicText.style.left = 100;
        basicText.style.top = 100;
        basicText.style.color = 0xffffff;
        basicText.text = "Basic text in vf-gui 33434";
        basicText.isClick = true;
        uiStage.addChild(basicText);

        const tween = new vf.gui.Tween();
        tween.setObject(basicText);
        tween.to({rotation:0,scaleX:0.1,scaleY:0.1},7000)
            .repeat(Infinity)
            .easing(vf.gui.Easing.Linear.None)
            .yoyo(true)
            .start().delay(2000);

        basicText.on('click',()=>{
            if(tween.isPlaying)
                tween.stop();
            else
                tween.start();
        });
    }
}

