import gui from "../src/vf-gui";
import TestApplication from "./TestApplication";


class Index{
    public static  init(){
        let type = "TestContainer";
        let param = gui.Utils.getQueryVariable("type");
        if(param){
            type = param;
        }
        new TestApplication(this,(app: gui.Application, uiStage: gui.Stage) => {
            import(`./${type}`).then(value=>{
                console.log("create->",type);
                new value.default(app,uiStage);
            }); 
        });
    }
}


Index.init();



