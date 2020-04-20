// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />

export default class TestFollowLine {

    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app, uiStage)
    }

    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {


        const messageList: string[] = [];

        /** 测试影响点击区域 */
        // let rect = new vf.gui.Rect();
        // rect.lineWidth = 3;
        // rect.lineColor = 0x00ffcc;
        // rect.width = 340;
        // rect.height = 200;
        // rect.x = 15;
        // rect.y = 50;
        // uiStage.addChild(rect);

        const eraseBtn = new vf.gui.Button();
        eraseBtn.x = 15
        eraseBtn.y = 15;
        eraseBtn.text = '擦除 false';
        uiStage.addChild(eraseBtn);

        const restorBtn = new vf.gui.Button();
        restorBtn.x = 130
        restorBtn.y = 15;
        restorBtn.text = '重置';
        uiStage.addChild(restorBtn);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const followLineTop = new vf.gui.FollowLine(uiStage as any);
        followLineTop.x = 15;
        followLineTop.y = 50;
        followLineTop.width = 340;
        followLineTop.height = 200;
        followLineTop.style.backgroundColor = 0xffffff;
        followLineTop.role = vf.gui.Enum.FollowLineEnum.Role.teacher;
        uiStage.addChild(followLineTop);

        const followLineDown = new vf.gui.FollowLine();
        followLineDown.x = 15;
        followLineDown.y = 270;
        followLineDown.width = 340;
        followLineDown.height = 200;
        followLineDown.style.backgroundColor = 0xffffff;
        followLineDown.role = vf.gui.Enum.FollowLineEnum.Role.student;
        uiStage.addChild(followLineDown);

        const slider = new vf.gui.Slider();
        slider.vertical = false;
        slider.thumb = "assets/skin/Slider/thumb.png";
        slider.track = "assets/skin/Slider/track.png";
        slider.tracklight = "assets/skin/Slider/tracklight.png";
        slider.width = 340;
        slider.height = 10;
        slider.x = 15;
        slider.y = 480;
        slider.value = 0;
        slider.maxValue = messageList.length;
        uiStage.addChild(slider);
        slider.on(vf.gui.Interaction.ComponentEvent.CHANGE, (slider: vf.gui.CheckBox, curValue: number) => {
            followLineDown.clear();
            followLineTop.clear();
            for (let i = 0; i < curValue; i++) {
                if (messageList[i]) {
                    followLineDown.setData(messageList[i]);
                    followLineTop.setData(messageList[i]);
                }
            }
        });

        followLineTop.on(vf.gui.Interaction.ComponentEvent.COMPLETE, (display: vf.gui.FollowLine, data: string) => {
            messageList.push(data);
            slider.maxValue = messageList.length;
            followLineDown.setData(data);
        });

        followLineDown.on(vf.gui.Interaction.ComponentEvent.COMPLETE, (display: vf.gui.FollowLine, data: string) => {
            messageList.push(data);
            slider.maxValue = messageList.length;
            followLineTop.setData(data);
        });


        let isErasing = true;
        eraseBtn.on(vf.gui.Interaction.TouchMouseEvent.onClick, () => {
            followLineTop.isErasing = isErasing;
            followLineDown.isErasing = isErasing;
            eraseBtn.text = '擦除 ' + isErasing;
            isErasing = !isErasing;
        });

        restorBtn.on(vf.gui.Interaction.TouchMouseEvent.onClick, () => {
            followLineTop.reset();

        });


    }
}
