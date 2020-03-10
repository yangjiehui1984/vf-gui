/**
 * status: 状态变化
 * 
 * command: 执行操作
 * 
 * ----------------------
 * 
 * Info: 默认的等级
 * 
 * Warn: 表示可能对系统有损害的情况
 * 
 * 表示非常严重的错误等级，记录极有可能导致应用程序终止运行的致命错误信息；
 */
export const enum EventLevel {
    /**
     * 状态
     */
    STATUS = 'status',

    /**
     * 命令
     */
    COMMAND = 'command',

    /**
     * 默认的等级
     */
    INFO = 'info',
    /**
     * 警告
     */
    WARNING = 'warning',

    /**
     * 错误
     */
    ERROR = 'error',

    /**
     * 原生
     */
    NATIVE = 'native',
    // ...
}