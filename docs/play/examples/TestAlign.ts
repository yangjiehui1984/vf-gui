// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />

export default class TestAlign {

    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app, uiStage);
    }

    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {

        const container = new vf.gui.Container();
        container.width = 800;

        const titleBg = new vf.gui.Image();
        titleBg.src = 'assets/titleBg.png';

        const titleBgcontainer = new vf.gui.Container();
        //titleBgcontainer.style.justifyContent = "center";
        titleBgcontainer.addChild(titleBg);

        const btnbg = new vf.gui.Image();
        btnbg.src = 'assets/btnbg.png';

        const btnbgcontainer = new vf.gui.Container();
        btnbgcontainer.name = "btnbgcontainer";
        btnbgcontainer.style.justifyContent = "center";
        btnbgcontainer.addChild(btnbg);

        container.addChild(titleBgcontainer);
        container.addChild(btnbgcontainer);
        uiStage.addChild(container);
    }
}
