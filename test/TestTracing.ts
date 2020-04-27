import { TracingEnum } from "../src/enum/Index";

export default class TestTracing {
    public constructor(app: vf.Application, uiStage: vf.gui.Stage) {
        this.onLoad(app, uiStage);
    }

    private onLoad(app: vf.Application, uiStage: vf.gui.Stage) {
        console.log('Tracing test...')
        let tracing = new vf.gui.Tracing();
        tracing.debug = true;
        tracing.x = 0;
        tracing.y = 200;
        tracing.width = 400;
        tracing.height = 400;
        tracing.mode = TracingEnum.Mode.Auto;
        uiStage.addChild(tracing);
        //tracing.traceSprite = "assets/tracing/a.png";
        tracing.traceSprite = "assets/tracing/fan.png";
        tracing.maskBgSprite = "assets/tracing/maskBg.png"
        //tracing.lineTexture = 'assets/tracing/dino.png';
        // tracing.tracePoints = [[{
        //     x: 160,
        //     y: 40,
        // },
        // {
        //     x: 120,
        //     y: 140,
        // },
        // {
        //     x: 90,
        //     y: 240,
        // }],
        // [{
        //     x: 160,
        //     y: 40,
        // },
        // {
        //     x: 200,
        //     y: 140,
        // },
        // {
        //     x: 230,
        //     y: 240,
        // }],
        // [{
        //     x: 120,
        //     y: 170,
        // },
        // {
        //     x: 200,
        //     y: 170,
        // }]]
        tracing.tracePoints = [
            [{ x: 108.5625, y: 67.0703125 },
            { x: 92.30859375, y: 91.12109375 },
            { x: 73.35546875, y: 111.6953125 }],
            [{ x: 110.28125, y: 82.3515625 },
            { x: 154.99609375, y: 81.78515625 },
            { x: 200.60546875, y: 82.640625 }],
            [{ x: 101.8828125, y: 111.359375 },
            { x: 95.61328125, y: 147.6953125 },
            { x: 92.2421875, y: 186.08984375 },
            { x: 138.01171875, y: 188.6875 },
            { x: 194.1171875, y: 188.6875 }],
            [{ x: 108.015625, y: 109.6953125 },
            { x: 145.16796875, y: 110.49609375 },
            { x: 183.87109375, y: 111.18359375 },
            { x: 180.90625, y: 148.82421875 },
            { x: 176.85546875, y: 178.00390625 }],
            [{ x: 70.1953125, y: 147.79296875 },
            { x: 137.66015625, y: 147.83984375 },
            { x: 206.5234375, y: 148.63671875 }],
            [{ x: 134.48046875, y: 123.421875 },
            { x: 149.24609375, y: 133.0859375 }],
            [{ x: 130.77734375, y: 162.6171875 },
            { x: 146.1640625, y: 172.87109375 }],
            [{ x: 248.43359375, y: 67.94140625 },
            { x: 231.6328125, y: 102.875 },
            { x: 212.73046875, y: 126.8203125 }],
            [{ x: 249.109375, y: 94.546875 },
            { x: 283.87109375, y: 94.38671875 },
            { x: 326.99609375, y: 94.6640625 }],
            [{ x: 301.56640625, y: 105.62890625 },
            { x: 270.37890625, y: 155.0625 },
            { x: 215.25, y: 192.01953125 }],
            [{ x: 238.65234375, y: 117.91015625 },
            { x: 268.546875, y: 162.3203125 },
            { x: 326.93359375, y: 196.53125 }],
            [{ x: 175.21875, y: 201.94921875 },
            { x: 148.23828125, y: 216.9921875 },
            { x: 116.38671875, y: 231.87109375 },
            { x: 155.96484375, y: 229.46875 },
            { x: 181.94140625, y: 227.21484375 }],
            [{ x: 243.20703125, y: 212.8203125 },
            { x: 173.7578125, y: 242.53515625 },
            { x: 93.0625, y: 271.87109375 },
            { x: 200.01953125, y: 265.32421875 },
            { x: 270.01953125, y: 261.09375 }],
            [{ x: 259.90234375, y: 235.6796875 },
            { x: 285.921875, y: 255.140625 },
            { x: 311.0703125, y: 273.57421875 }],
            [{ x: 204.34375, y: 277.12890625 },
            { x: 202.53125, y: 301.94921875 },
            { x: 199.0078125, y: 321.453125 },
            { x: 160.7890625, y: 323.96484375 }],
            [{ x: 142.52734375, y: 291.484375 },
            { x: 111.8046875, y: 308.3515625 },
            { x: 80.84375, y: 322.27734375 }],
            [{ x: 250.578125, y: 292.7109375 },
            { x: 285.68359375, y: 306.30859375 },
            { x: 315.54296875, y: 319.05078125 }]
        ];

        let label = new vf.gui.Label();
        label.text = '未完成';
        label.x = 100;
        label.y = 100;
        uiStage.addChild(label);


        let tracing2 = new vf.gui.Tracing();
        tracing2.debug = true;
        tracing2.x = 400;
        tracing2.y = 200;
        tracing2.width = 400;
        tracing2.height = 400;
        uiStage.addChild(tracing2);
        //tracing2.traceSprite = "assets/tracing/a.png";
        tracing2.traceSprite = "assets/tracing/fan.png";
        tracing2.maskBgSprite = "assets/tracing/maskBg.png"
        //tracing2.lineTexture = 'assets/tracing/dino.png';
        // tracing2.tracePoints = [[{
        //     x: 160,
        //     y: 40,
        // },
        // {
        //     x: 120,
        //     y: 140,
        // },
        // {
        //     x: 90,
        //     y: 240,
        // }],
        // [{
        //     x: 160,
        //     y: 40,
        // },
        // {
        //     x: 200,
        //     y: 140,
        // },
        // {
        //     x: 230,
        //     y: 240,
        // }],
        // [{
        //     x: 120,
        //     y: 170,
        // },
        // {
        //     x: 200,
        //     y: 170,
        // }]]
        tracing2.tracePoints = [
            [{ x: 108.5625, y: 67.0703125 },
            { x: 92.30859375, y: 91.12109375 },
            { x: 73.35546875, y: 111.6953125 }],
            [{ x: 110.28125, y: 82.3515625 },
            { x: 154.99609375, y: 81.78515625 },
            { x: 200.60546875, y: 82.640625 }],
            [{ x: 101.8828125, y: 111.359375 },
            { x: 95.61328125, y: 147.6953125 },
            { x: 92.2421875, y: 186.08984375 },
            { x: 138.01171875, y: 188.6875 },
            { x: 194.1171875, y: 188.6875 }],
            [{ x: 108.015625, y: 109.6953125 },
            { x: 145.16796875, y: 110.49609375 },
            { x: 183.87109375, y: 111.18359375 },
            { x: 180.90625, y: 148.82421875 },
            { x: 176.85546875, y: 178.00390625 }],
            [{ x: 70.1953125, y: 147.79296875 },
            { x: 137.66015625, y: 147.83984375 },
            { x: 206.5234375, y: 148.63671875 }],
            [{ x: 134.48046875, y: 123.421875 },
            { x: 149.24609375, y: 133.0859375 }],
            [{ x: 130.77734375, y: 162.6171875 },
            { x: 146.1640625, y: 172.87109375 }],
            [{ x: 248.43359375, y: 67.94140625 },
            { x: 231.6328125, y: 102.875 },
            { x: 212.73046875, y: 126.8203125 }],
            [{ x: 249.109375, y: 94.546875 },
            { x: 283.87109375, y: 94.38671875 },
            { x: 326.99609375, y: 94.6640625 }],
            [{ x: 301.56640625, y: 105.62890625 },
            { x: 270.37890625, y: 155.0625 },
            { x: 215.25, y: 192.01953125 }],
            [{ x: 238.65234375, y: 117.91015625 },
            { x: 268.546875, y: 162.3203125 },
            { x: 326.93359375, y: 196.53125 }],
            [{ x: 175.21875, y: 201.94921875 },
            { x: 148.23828125, y: 216.9921875 },
            { x: 116.38671875, y: 231.87109375 },
            { x: 155.96484375, y: 229.46875 },
            { x: 181.94140625, y: 227.21484375 }],
            [{ x: 243.20703125, y: 212.8203125 },
            { x: 173.7578125, y: 242.53515625 },
            { x: 93.0625, y: 271.87109375 },
            { x: 200.01953125, y: 265.32421875 },
            { x: 270.01953125, y: 261.09375 }],
            [{ x: 259.90234375, y: 235.6796875 },
            { x: 285.921875, y: 255.140625 },
            { x: 311.0703125, y: 273.57421875 }],
            [{ x: 204.34375, y: 277.12890625 },
            { x: 202.53125, y: 301.94921875 },
            { x: 199.0078125, y: 321.453125 },
            { x: 160.7890625, y: 323.96484375 }],
            [{ x: 142.52734375, y: 291.484375 },
            { x: 111.8046875, y: 308.3515625 },
            { x: 80.84375, y: 322.27734375 }],
            [{ x: 250.578125, y: 292.7109375 },
            { x: 285.68359375, y: 306.30859375 },
            { x: 315.54296875, y: 319.05078125 }]
        ];

        let label2 = new vf.gui.Label();
        label2.text = '未完成';
        label2.x = 500;
        label2.y = 100;
        uiStage.addChild(label2);

        tracing.on(vf.gui.Interaction.ComponentEvent.CHANGE,(display: vf.gui.Tracing,data:string)=>{
            tracing2.setData(data);
        });

        tracing2.on(vf.gui.Interaction.ComponentEvent.CHANGE,(display: vf.gui.Tracing,data:string)=>{
            tracing.setData(data);
        });

        tracing.on(vf.gui.Interaction.ComponentEvent.COMPLETE, (display: vf.gui.Tracing, curValue: any) =>{
            if(curValue.mode == TracingEnum.Mode.Check){
                if(curValue.value == 0){
                    label.text = '未完成'
                }
                else if(curValue.value == 1){
                    label.text = '笔画正确'
                }
                else{
                    label.text = '笔画错误' 
                }
            }
            else if(curValue.mode == TracingEnum.Mode.Auto){
                label.text = '自动书写完成' 
            }
            else if(curValue.mode == TracingEnum.Mode.Teach){
                label.text = '教学完成' 
            }
        })

        tracing2.on(vf.gui.Interaction.ComponentEvent.COMPLETE, (display:vf.gui.Tracing,curValue: any) =>{
            if(curValue.mode == TracingEnum.Mode.Check){
                if(curValue.value == 0){
                    label2.text = '未完成'
                }
                else if(curValue.value == 1){
                    label2.text = '笔画正确'
                }
                else{
                    label2.text = '笔画错误' 
                }
            }
            else if(curValue.mode == TracingEnum.Mode.Auto){
                label2.text = '自动书写完成' 
            }
            else if(curValue.mode == TracingEnum.Mode.Teach){
                label2.text = '教学完成' 
            }
        })

        let clearBtn = new vf.gui.Button();
        clearBtn.x = 15
        clearBtn.y = 15;
        clearBtn.text = '清除';
        uiStage.addChild(clearBtn);

        clearBtn.on(vf.gui.Interaction.TouchMouseEvent.onClick,()=>{
            tracing.clear();
            tracing2.clear();
            label.text = '未完成';
            label2.text = '未完成';
        });
    }
}
