// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../dist/gui.d.ts" />
import TestApplication from "./TestApplication";


class Index {
    public static init() {
        let type = "TestContainer";
        const param = vf.gui.Utils.getQueryVariable("type");
        if (param) {
            type = param;
        }
        //console.group("VFJS Version");
        new TestApplication(this, (app: vf.Application, uiStage: vf.gui.Stage) => {
            import(`./${type}`).then(value => {
                console.log("create->", type);
                new value.default(app, uiStage);
            });
        });
        // vf.utils.versionPrint('gui '+(vf.gui as any).version);
        // console.groupEnd();
    }
}


Index.init();



