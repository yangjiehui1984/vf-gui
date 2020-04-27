export const enum Operate{
    Add, //添加
    Clear  //清除
}

export const enum Mode{
    Check,   //检查模式，判断轨迹是否正确
    Teach,   //教学模式，一笔一划教学
    Auto     //自动播放
}

export const enum Result{
    Uncomplete,   //未完成
    Correct,      //正确
    Incorrect,     //不正确
    Complete      //audo或teach模式完成
}