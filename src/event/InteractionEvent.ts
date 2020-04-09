
const tempLocal = new vf.Point(0,0);
/**
 * 事件的基础类
 * 
 * 触摸或鼠标操作事件 可查看 -> TouchEventEnum.TouchEnum
 * 
 * import InteractionEvent from "../interaction/InteractionEvent",
 */
export class InteractionEvent extends vf.interaction.InteractionEvent {
    public constructor() {
        super();
        this.local = tempLocal;
    }

    public local:vf.Point;
}
