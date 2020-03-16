export const enum EventType {


    /** 
     * 状态变化 ：IVFData -> VFStateCode
     */
    STATUS = 'status',
    /** 
     * 推送消息到外部
     */
    MESSAGE = 'message',
    /** 
     * 接收外部消息
     */
    ONMESSAGE = 'onMessage',
    /**
     * 通用状态变化
     */
    STATE = 'state',

    /**
     * 启动/开始
     */
    START = 'start',

    /**
     * 心跳
     */
    TICK = 'tick',

    /**
     * 更新
     */
    UPDATE = 'update',

    /**
     * 已改变
     */
    CHANGED = 'changed',

    /**
     * 结束
     */
    END = 'end',

    // ...
}
