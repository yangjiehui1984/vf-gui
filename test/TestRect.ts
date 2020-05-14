// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />

export default class TestRect {

    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app, uiStage)
    }


    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {

        const container = new vf.gui.Container();
        //container.style.backgroundColor = 0xff00cc;
        container.x = 100;
        container.y = 100;
        //container.width = 100;
        //container.maxHeight = 500;
        uiStage.addChild(container);

        const label = new vf.gui.Label('标题....');
        label.x = 0;
        label.y = 0;
        label.style.color = 0x333333;
        label.style.fontSize = 16;
        label.style.fontWeight = 700;
        label.style.wordWrap = true;
        label.style.wordWrapWidth = 309;
        label.style.breakWords = true;
        label.style.left = 42;
        label.style.alignContent = 'center';
        container.addChild(label);

        const iconContainer = new vf.gui.Container();
        iconContainer.style.alignContent = 'center';
        const img = new vf.gui.Image();
        img.src = 'https://img.vipkidstatic.com/cum/homework-service/static/assets/CDNFiles/audio_mobile.png';
        img.x = 5;
        img.y = 0;
        iconContainer.addChild(img);
        
        container.addChild(iconContainer);
    }

    private onClick(e: vf.gui.Interaction.InteractionEvent) {
        console.log(e.type);
    }

}

