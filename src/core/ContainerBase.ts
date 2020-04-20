/** 容器扩展类，后续便于做延时渲染 */
export class ContainerBase extends vf.Container{
    public constructor(){
        super();
    }

    public isEmitRender = false;

    public render(renderer: vf.Renderer): void{
        if(this.isEmitRender){
            this.emit("renderChange",renderer);
        }
        super.render(renderer);
    }
}