// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />

export default class TestCheckBox {

    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app, uiStage)
    }

    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {

        /** 复选框 */
        const checkbox = this.getNewCheckBox(uiStage);
        checkbox.value = "1";

        const checkbox2 = this.getNewCheckBox(uiStage);
        checkbox2.value = "2";
        checkbox2.style.left = 130;

        const checkbox3 = this.getNewCheckBox(uiStage);
        checkbox3.value = "3";
        checkbox3.style.left = 160;

        //单选,通过设置分组区分
        const radio = this.getNewRadio(uiStage);
        radio.checked = true;
        radio.value = "r1";
        radio.checkGroup = "a1";

        const radio2 = this.getNewRadio(uiStage);
        radio2.value = "r2";
        radio2.style.left = 130;
        radio2.checkGroup = "a1";

        const radio3 = this.getNewRadio(uiStage);
        radio3.value = "r3";
        radio3.style.left = 160;
        radio3.checkGroup = "a1";

    }


    private getNewCheckBox(uiStage: vf.gui.Stage) {
        const checkbox = new vf.gui.CheckBox();
        checkbox.style.top = 100;
        checkbox.style.left = 100;
        checkbox.style.width = 23;
        checkbox.style.height = 23;
        checkbox.up = "assets/skin/CheckBox/unselect.png";
        checkbox.down = "assets/skin/CheckBox/unselect.png";
        checkbox.move = "assets/skin/CheckBox/unselect.png";
        checkbox.disabled = "assets/skin/CheckBox/unselect.png";
        checkbox.upAndSelected = "assets/skin/CheckBox/select_up.png";
        checkbox.downAndSelected = "assets/skin/CheckBox/select_down.png";
        checkbox.moveAndSelected = "assets/skin/CheckBox/select_down.png";
        checkbox.disabledAndSelected = "assets/skin/CheckBox/select_disabled.png";
        checkbox.on(vf.gui.Interaction.ComponentEvent.CHANGE, this.onChange, this);
        uiStage.addChild(checkbox);
        return checkbox;
    }


    private getNewRadio(uiStage: vf.gui.Stage) {
        const radio = new vf.gui.CheckBox();
        radio.style.top = 150;
        radio.style.left = 100;
        radio.style.width = 22;
        radio.style.height = 22;
        radio.up = "assets/skin/Radio/unselect.png";
        radio.down = "assets/skin/Radio/unselect.png";
        radio.move = "assets/skin/Radio/unselect.png";
        radio.disabled = "assets/skin/Radio/unselect.png";
        radio.upAndSelected = "assets/skin/Radio/select_up.png";
        radio.downAndSelected = "assets/skin/Radio/select_down.png";
        radio.moveAndSelected = "assets/skin/Radio/select_down.png";
        radio.disabledAndSelected = "assets/skin/Radio/select_disabled.png";
        radio.on(vf.gui.Interaction.ComponentEvent.CHANGE, this.onChange, this);
        uiStage.addChild(radio);
        return radio;
    }

    private onChange(checkBox: vf.gui.CheckBox) {
        console.log("->", checkBox.value, checkBox.checked);
    }
}
