// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />

export default class TestAudio {

    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app, uiStage)
    }

    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {

        /** audio */
        var a = new vf.gui.Audio();
        a.loop = true;
        a.src = "https://s.vipkidstatic.com/fe-static/learning-stages/assets/great-20191221.mp3";
        a.play();
        a.on("ended",()=>{
            console.log("play ended");
            a.dispose();
        })
        a.on("canplaythrough",()=>{
            console.log("im ready");
           // a.play();
        })
        setTimeout(() => {
            a.stop();
        }, 2000);

        /** 基础文本展示 */
        const basicText = new vf.gui.Label();
        basicText.style.left = 15;
        basicText.style.top = 50;
        basicText.style.color = 0xffffff;
        basicText.text = "Basic text in vf-gui 33434"
        uiStage.addChild(basicText);
    }

}

