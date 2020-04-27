import { DisplayObject } from "../core/DisplayObject";
import { ClickEvent, TouchMouseEvent, InteractionEvent, ComponentEvent } from "../interaction/Index";
import { pointDistance, pointSub, pointSignAngle, deepCopy } from "../utils/Utils";
import { getTexture } from "../utils/Utils";
import { TracingEnum } from "../enum/Index";
import { Tween } from "../tween/Tween";

/**
 * 临摹组件
 *
 * @example let Tracing = new vf.gui.Tracing();
 *
 * @namespace vf.gui
 *
 * @link https://vipkid-edu.github.io/vf-gui/play/#example/TestTracing
 */
const POS_DISTANCE = 7;
/** 优化曲率，小于这个弧度视为直线，把当前点优化掉 */
const MAX_ARC = 0.09; // 5度

/** 点数字转换成字符的数位 */
const DIGIT = 90;
/** 字符列表 ascii */
const NUMBER_TO_STR = "$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";

/** 压缩比例，有损压缩 */
const COMPRESS_RATE = 2;

/** 最大宽度 */
const MAX_WIDTH = 1500;

/** 为了把点都变成正数所用 */
const POSITIVE: number = MAX_WIDTH / 2;

/** 将一个x，y坐标转换成3个字符，宽高不能超过MAX_WIDTH */
function getStrFromPos(x: number, y: number) {
    x = Math.min(Math.max(0, x), MAX_WIDTH);
    y = Math.min(Math.max(0, y), MAX_WIDTH);

    // 有损压缩
    const compX = Math.floor(x / COMPRESS_RATE);
    const compY = Math.floor(y / COMPRESS_RATE);

    const n1 = compX % DIGIT;
    const n2 = compY % DIGIT;
    const n3 = Math.floor(compX / DIGIT) * 10 + Math.floor(compY / DIGIT);

    return NUMBER_TO_STR[n1] + NUMBER_TO_STR[n2] + NUMBER_TO_STR[n3];
}

/** 将字符串转换成坐标数字列表 */
function getVecListFromStr(str: string, from: number, to: number): number[] {
    const list = [];
    for (let index = from; index < to; index += 3) {
        const n1 = str.charCodeAt(index) - 36;
        const n2 = str.charCodeAt(index + 1) - 36;
        const n3 = str.charCodeAt(index + 2) - 36;

        const n12 = Math.floor(n3 / 10);
        const n22 = n3 % 10;

        const compX = n1 + n12 * DIGIT;
        const compY = n2 + n22 * DIGIT;

        const realX = compX * COMPRESS_RATE;
        const realY = compY * COMPRESS_RATE;

        list.push(realX);
        list.push(realY);
    }
    return list;
}

export class Tracing extends DisplayObject {
    public constructor() {
        super();
        this._lines = new Map();
        this.clickEvent = new ClickEvent(this, true);
        this.clickEvent.isOpenLocalPoint = true;
    }

    protected clickEvent: ClickEvent;
    private _renderMode = 0; //绘图模式  0-graphics drawLine  1-mask
    private _guideSprite: vf.Sprite | undefined;
    private _bgSprite: vf.Sprite | undefined;
    private _lines: Map<string, vf.Graphics>;
    private _realTraceIndexArr: number[] = []; //实际临摹轨迹
    private _tempTraceIndexArr: number[] = []; //暂存区
    private _lineStyle: any = {}; //线条样式
    private _posCache: vf.Point[] = []; //绘图的坐标缓存
    private _drawing = false; //是否正在画线
    private _lastLocalPos: vf.Point = new vf.Point(); //上一次的触点
    private _curLocalPos: vf.Point = new vf.Point(); //当前触点
    private _autoComplete = false; //自动绘制是否完成
    private _curIndex = -1; //当前index
    private _tracePointObjArr: { flag: boolean; point: vf.Point }[] = [];
    private _result: TracingEnum.Result = TracingEnum.Result.Uncomplete; //临摹结果
    private _groupStatusArr: { flag: boolean; points: number[] }[] = []; //每个笔画的状态
    private _lineId = 0; //绘制笔画id
    private _newLineFlag = true; //是否是新笔画
    private _pointId = 0; //绘制的笔画的轨迹点id
    private _messageCache: string[] = []; //需要处理的消息列表
    private _tween: Tween | undefined;
    private _guideTime: any; //引导的timeout

    /**
     * debug
     */
    private _debug = false;
    public get debug() {
        return this._debug;
    }
    public set debug(value: boolean) {
        this._debug = value;

        if (this._tracePointObjArr.length > 0) {
            const graphic: vf.Graphics = new vf.Graphics();
            this.container.addChild(graphic);
            this._tracePointObjArr.forEach((item) => {
                graphic.beginFill(0x00ff00);
                graphic.drawCircle(item.point.x, item.point.y, 5);
                graphic.endFill();
            });
        }
    }

    /**
     * 模式
     */
    private _mode: TracingEnum.Mode = TracingEnum.Mode.Check;
    public set mode(value: TracingEnum.Mode) {
        if(this._mode !== value){
            this._mode = value;
            this.clear();
        }
    }
    public get mode() {
        return this._mode;
    }

    /**
     * 文字轨迹图
     */
    private _traceSprite:
        | number
        | string
        | vf.Texture
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement
        | undefined;
    public get traceSprite() {
        return this._traceSprite;
    }
    public set traceSprite(value) {
        this._traceSprite = value;
        this.setTraceSprite();
    }

    /**
     * 背景图，mask模式用于画线后漏出来
     */
    private _maskBgSprite:
        | number
        | string
        | vf.Texture
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement
        | undefined;
    public get maskBgSprite() {
        return this._maskBgSprite;
    }
    public set maskBgSprite(value) {
        this._maskBgSprite = value;
        this._renderMode = 1;
        this.setMaskBgSprite();
    }

    /**
     * 轨迹点,二维数组
     */
    private _tracePoints: { x: number; y: number }[][] = [];
    public get tracePoints() {
        return this._tracePoints;
    }
    public set tracePoints(value) {
        this._tracePoints = value;
        let pointIndex = 0;
        this._groupStatusArr = [];
        this._tracePoints.forEach((group, index) => {
            const groupStatus = {
                flag: false,
                points: [] as number[],
            };
            this._groupStatusArr.push(groupStatus);
            group.forEach((point) => {
                groupStatus.points.push(pointIndex++);
                this._tracePointObjArr.push({
                    flag: false,
                    point: new vf.Point(point.x, point.y),
                });
            });
        });

        if (this.debug) {
            const graphic: vf.Graphics = new vf.Graphics();
            this.container.addChild(graphic);
            this._tracePointObjArr.forEach((item) => {
                graphic.beginFill(0x00ff00);
                graphic.drawCircle(item.point.x, item.point.y, 5);
                graphic.endFill();
            });
        }
    }

    /**
     * 线宽
     */
    private _lineWidth = 10;
    public get lineWidth() {
        return this._lineWidth;
    }
    public set lineWidth(value) {
        this._lineWidth = value;
        this.setLineStyle();
    }

    /**
     * 颜色
     */
    private _lineColor = 0xff0000;
    public get lineColor() {
        return this._lineColor;
    }
    public set lineColor(value) {
        this._lineColor = value;
        this.setLineStyle();
    }

    /**
     * 检测精度
     */
    private _precision = 20;
    public get precision() {
        return this._precision;
    }
    public set precision(value) {
        this._precision = value;
    }

    /**
     * 位图
     */
    private _lineTexture: string | number | undefined;
    public get lineTexture() {
        return this._lineTexture;
    }
    public set lineTexture(value) {
        this._lineTexture = value;
        this.setLineStyle();
    }

    /**
     * 画笔样式
     */
    private setLineStyle() {
        this._lineStyle = {
            width: this.lineWidth,
            color: this.lineColor,
            texture: this.lineTexture,
        };
    }

    /**
     * 轨迹图
     */
    private setTraceSprite() {
        const { container, traceSprite } = this;
        const texture = getTexture(traceSprite);
        let sprite: vf.Sprite | undefined;
        try {
            sprite = new vf.Sprite(texture);
        } catch (e) {
            sprite = vf.Sprite.from(texture);
        }
        if (sprite && sprite.parent == undefined) {
            container.addChild(sprite);
        }
    }

    /**
     * mask背景图
     */
    private setMaskBgSprite() {
        const { container, maskBgSprite } = this;
        const texture = getTexture(maskBgSprite);
        let sprite: vf.Sprite | undefined;
        try {
            sprite = new vf.Sprite(texture);
        } catch (e) {
            sprite = vf.Sprite.from(texture);
        }
        if (sprite && sprite.parent == undefined) {
            container.addChild(sprite);
            this._bgSprite = sprite;
        }
        const graphic = this.getGraphics("mask", this._lineStyle);
        (this._bgSprite as vf.Sprite).mask = graphic;
    }

    /**
     * 开始，适用于audo和teach模式
     */
    private start(){
        if (this.mode === TracingEnum.Mode.Auto) {
            setTimeout(() => {
                this.auto();
            }, 1000); //自动播放，1s后开始
        } else if (this.mode === TracingEnum.Mode.Teach) {
            //教学模式，需要引导手势
            if (!this._guideSprite) {
                this._guideSprite = vf.Sprite.from(
                    "//ic-static.vipkid.com.cn/course/material/DEMO1-U1-LC1-L1/guide_pointer.png"
                );
            }
            setTimeout(() => {
                this.container.removeChild(this._guideSprite as vf.Sprite);
                this.container.addChild(this._guideSprite as vf.Sprite);
                this.guide();
            }, 1000);
        }
    }

    /**
     * 教学引导
     */
    private guide() {
        const guideSprite = this._guideSprite as vf.Sprite;
        if (this._pointId >= this.tracePoints[this._lineId].length) {
            this._newLineFlag = true;
            guideSprite.visible = false;
            this._pointId = 0;
            clearTimeout(this._guideTime);
            this._guideTime = setTimeout(() => {
                this.guide();
            }, 3000);
            return;
        }
        let point: { x: number; y: number } = this.tracePoints[this._lineId][this._pointId++];
        if (this._newLineFlag) {
            guideSprite.visible = true;
            this._newLineFlag = false;
            this._lastLocalPos.set(point.x, point.y);
            point = this.tracePoints[this._lineId][this._pointId++];
        }
        this._curLocalPos.set(point.x, point.y);
        this.playGuideAnimal();
    }

    private playGuideAnimal() {
        const distance = pointDistance(this._lastLocalPos, this._curLocalPos);
        const startPos = this._lastLocalPos.clone();
        const endPos = this._curLocalPos.clone();
        const curPos = this._curLocalPos.clone();
        this._lastLocalPos.copyFrom(this._curLocalPos);
        const from = { dt: 0 };
        const to = { dt: distance };
        this._tween = new Tween(from)
            .to(to, 500)
            .on(Tween.Event.update, (obj: any) => {
                const dt = Math.ceil(obj.dt);
                const x = (dt * (endPos.x - startPos.x)) / distance + startPos.x;
                const y = (dt * (endPos.y - startPos.y)) / distance + startPos.y;
                curPos.set(x, y);
                (this._guideSprite as vf.Sprite).x = x;
                (this._guideSprite as vf.Sprite).y = y;
            })
            .once(Tween.Event.complete, (obj: any) => {
                if (this._tween) {
                    this._tween.removeAllListeners();
                    this._tween.release();
                }
                this.guide();
            })
            .start();
    }

    /**
     * 清除教学引导
     */
    clearGuide() {
        clearTimeout(this._guideTime);
        const guideSprite = this._guideSprite as vf.Sprite;
        if(guideSprite){
            guideSprite.visible = false;
        }
        this._newLineFlag = true;
        this._pointId = 0;
        this._tween && this._tween.release();
    }

    /**
     * 自动绘制
     */
    private auto() {
        let point: { x: number; y: number } = this.autoNextPoint() as { x: number; y: number };
        if (this._newLineFlag) {
            this._newLineFlag = false;
            this._lastLocalPos.set(point.x, point.y);
            this._posCache = [];
            this._posCache.push(this._lastLocalPos.clone());
            point = this.autoNextPoint() as { x: number; y: number };
        }
        this._curLocalPos.set(point.x, point.y);
        if (this._autoComplete){
            this.emit(ComponentEvent.COMPLETE, this, { mode: this.mode, value: TracingEnum.Result.Complete });
            return;
        } 
        this.drawWithAnimation();
    }

    private drawWithAnimation() {
        const distance = pointDistance(this._lastLocalPos, this._curLocalPos);
        const startPos = this._lastLocalPos.clone();
        const endPos = this._curLocalPos.clone();
        const curPos = this._curLocalPos.clone();
        this._lastLocalPos.copyFrom(this._curLocalPos);
        const from = { dt: 0 };
        const to = { dt: distance };
        this._tween = new Tween(from)
            .to(to, 500)
            .on(Tween.Event.update, (obj: any) => {
                const dt = Math.ceil(obj.dt);
                const x = (dt * (endPos.x - startPos.x)) / distance + startPos.x;
                const y = (dt * (endPos.y - startPos.y)) / distance + startPos.y;
                curPos.set(x, y);
                this._posCache.push(curPos.clone());
                const graphics = this.getGraphics(this._lineId.toString(), this._lineStyle);
                this.localDraw(graphics);
            })
            .once(Tween.Event.complete, (obj: any) => {
                (this._tween as Tween).removeAllListeners();
                (this._tween as Tween).release();
                this.auto();
            })
            .start();
    }

    private autoNextPoint() {
        if (this._pointId >= this.tracePoints[this._lineId].length) {
            this._newLineFlag = true;
            this._lineId++;
            this._pointId = 0;
            if (this._lineId >= this.tracePoints.length) {
                //绘制全部完成
                this._autoComplete = true;
                this._pointId = 0;
                this._lineId = 0;
                return { x: 0, y: 0 };
            }
        }
        const point = this.tracePoints[this._lineId][this._pointId];
        this._pointId++;
        return point;
    }

    /**
     * 更新显示列表,子类重写，实现布局
     */
    protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
        super.updateDisplayList(unscaledWidth, unscaledHeight);
        this.container.hitArea = new vf.Rectangle(0, 0, this.width, this.height);
    }

    $onInit() {
        //由于绑定的可能非当前显示对象，所以此处不可以使用this.on("xxxx")
        this.clickEvent.getTarget().on(TouchMouseEvent.onPress, this.onPress, this);
        this.clickEvent.getTarget().on(TouchMouseEvent.onMove, this.onMove, this);
        this.setLineStyle();
    }

    $onRelease() {
        this.clickEvent.getTarget().off(TouchMouseEvent.onPress, this.onPress, this);
        this.clickEvent.getTarget().off(TouchMouseEvent.onMove, this.onMove, this);
        this.clickEvent.remove();
    }

    /**
     * 检测触摸点和轨迹点
     * @param point
     */
    private checkTrace(point: vf.Point) {
        if (this.tracePoints.length == 0) {
            this._result = TracingEnum.Result.Correct;
            return;
        }
        this._curIndex = -1;
        for (let i = 0; i < this._tracePointObjArr.length; ++i) {
            if (
                !this._tracePointObjArr[i].flag &&
                pointDistance(point, this._tracePointObjArr[i].point) < this.precision
            ) {
                this._tracePointObjArr[i].flag = true;
                this._curIndex = i;
                break;
            }
        }
        if (this._curIndex === -1) return;

        if (this._realTraceIndexArr.length === 0 && this._curIndex === 0) {
            this._realTraceIndexArr.push(this._curIndex);
            return;
        }

        if (this._curIndex === this._realTraceIndexArr[this._realTraceIndexArr.length - 1] + 1) {
            this._realTraceIndexArr.push(this._curIndex);
            this._tempTraceIndexArr.forEach((item) => {
                this._tracePointObjArr[item].flag = false;
            });
            this._tempTraceIndexArr = [];
        } else {
            this._tempTraceIndexArr.push(this._curIndex);
            if (this._tempTraceIndexArr.length > 3) {
                //暂存区超过4个，不再容错了
                this._realTraceIndexArr = this._realTraceIndexArr.concat(this._tempTraceIndexArr);
                this._tempTraceIndexArr = [];
            } else {
            }
        }
        if (this.debug) {
            console.log(
                "实际轨迹：",
                this._realTraceIndexArr,
                "暂存区：",
                this._tempTraceIndexArr,
                "result:",
                this._result
            );
        }
    }
    /**
     * 检查暂存区,抬起时检测暂存区中的点是否在一个笔画上
     */
    private checkTemp() {
        if (this._tempTraceIndexArr.length < 2) return;
        //检查temp中的点是否在一个笔画上,如果是，则认为这是一次有效画线而非误触,否则就算误触,退回到待触发数组
        const groupIndexArr: number[] = [];
        this._tempTraceIndexArr.forEach((element) => {
            this._groupStatusArr.forEach((item, index) => {
                if (item.points.indexOf(element) !== -1) {
                    groupIndexArr.push(index);
                }
            });
        });
        if (new Set(groupIndexArr).size === 1) {
            this._realTraceIndexArr = this._realTraceIndexArr.concat(this._tempTraceIndexArr);
            this._tempTraceIndexArr = [];
        } else {
            this._tempTraceIndexArr.forEach((item) => {
                this._tracePointObjArr[item].flag = false;
            });
            this._tempTraceIndexArr = [];
        }
    }

    /**
     * 检查group
     */
    // private checkGroup() {}

    private checkResult() {
        if (this._realTraceIndexArr.length === 0) return;
        if (this._realTraceIndexArr.length + this._tempTraceIndexArr.length == this._tracePointObjArr.length) {
            //结束了
            this._realTraceIndexArr = this._realTraceIndexArr.concat(this._tempTraceIndexArr);
            this._tempTraceIndexArr = [];
            this._result = TracingEnum.Result.Correct;
            let preIndex = -1;
            this._realTraceIndexArr.forEach((item) => {
                if (item > preIndex) {
                    preIndex = item;
                } else {
                    this._result = TracingEnum.Result.Incorrect;
                }
            });
            this.emit(ComponentEvent.COMPLETE, this, { mode: this.mode, value: this._result });
        } else {
            this._result = TracingEnum.Result.Uncomplete;
            if (this._realTraceIndexArr[0] != 0) {
                this._result = TracingEnum.Result.Incorrect;
            } else {
                let preIndex = -1;
                this._realTraceIndexArr.forEach((item) => {
                    if (item < preIndex) {
                        this._result = TracingEnum.Result.Incorrect;
                    } else {
                        preIndex = item;
                    }
                });
            }
            if (this._result != TracingEnum.Result.Uncomplete) {
                this.emit(ComponentEvent.COMPLETE, this, { mode: this.mode, value: this._result });
            }
        }
    }

    /**
     * 教学模式检查
     */
    private checkTeach(): boolean {
        let flag = true;
        if(this._lineId != 1){
            this._realTraceIndexArr.shift();
        }
        if (this._realTraceIndexArr.length != this._groupStatusArr[this._lineId - 1].points.length) {
            flag = false;
        } else {
            for (let i = 0; i < this._groupStatusArr[this._lineId - 1].points.length; ++i) {
                if (this._realTraceIndexArr[i] != this._groupStatusArr[this._lineId - 1].points[i]) {
                    flag = false;
                    break;
                }
            }
        }
        if (!flag) {
            this._lineId--;
            this._realTraceIndexArr.forEach((item) => {
                this._tracePointObjArr[item].flag = false;
            });
        }
        if(this._lineId < this._groupStatusArr.length)
        {
            this._realTraceIndexArr = [];
            if(this._lineId != 0){
                const firstIndex = this._groupStatusArr[this._lineId].points[0] - 1;
                this._realTraceIndexArr.push(firstIndex);
            }
            this.guide();
        }
        else{
            //教学完成
            this.emit(ComponentEvent.COMPLETE, this, { mode: this.mode, value: TracingEnum.Result.Complete });
        }
        return flag;
    }
    /**
     * 画线
     * @param lineId
     * @param data
     * @param from
     * @param to
     * @param lineStyle
     */
    private drawLine(lineId: string, data: string, from: number, to: number, lineStyle: any) {
        const graphics = this.getGraphics(lineId, lineStyle);
        const posList = getVecListFromStr(data, from, to);
        this.draw(graphics, posList);
    }

    /**
     * 绘图
     * @param graphics
     * @param posList
     */
    private draw(graphics: vf.Graphics, posList: number[]) {
        let lastX = posList[0] - POSITIVE;
        let lastY = posList[1] - POSITIVE;
        graphics.moveTo(lastX, lastY);
        // 利用贝塞尔将线平滑化
        const realList = [];
        for (let index = 2; index < posList.length; index += 2) {
            const x = posList[index] - POSITIVE;
            const y = posList[index + 1] - POSITIVE;

            const halfX = lastX + (x - lastX) * 0.5;
            const halfY = lastY + (y - lastY) * 0.5;

            realList.push(halfX, halfY, x, y);

            lastX = x;
            lastY = y;
        }

        graphics.lineTo(realList[0], realList[1]);
        for (let index = 2; index < realList.length - 2; index += 4) {
            const cx = realList[index];
            const cy = realList[index + 1];
            const x = realList[index + 2];
            const y = realList[index + 3];
            graphics.quadraticCurveTo(cx, cy, x, y);
        }

        graphics.lineTo(realList[realList.length - 2], realList[realList.length - 1]);
    }

    /**
     * 本地绘制
     * @param graphics
     */
    private localDraw(graphics: vf.Graphics) {
        this._posCache.forEach((item, index) => {
            if (index == 0) {
                graphics.moveTo(item.x, item.y);
            } else {
                graphics.lineTo(item.x, item.y);
            }
        });
    }

    private onPress(e: InteractionEvent, thisObj: DisplayObject, isPress: boolean) {
        e.stopPropagation();
        if (this.mode === TracingEnum.Mode.Auto) {
            //自动播放，不可操作
            return;
        }
        const curLocal = this.container.toLocal(e.local, thisObj.container);
        if (isPress) {
            if (this.mode === TracingEnum.Mode.Teach){
                this.clearGuide();
            }
            this._drawing = true;
            this._lastLocalPos.copyFrom(curLocal);
            this._posCache = [this._lastLocalPos.clone()];
            this.checkTrace(this._lastLocalPos);
        } else {
            if (this._posCache.length === 1) {
                //仅有一个点
                const newPoint = this._lastLocalPos.clone(); //在附近新建一个点，保证第一个触点也能画出来
                newPoint.set(newPoint.x, newPoint.y - POS_DISTANCE);
                this._posCache.push(newPoint);
                const graphics = this.getGraphics(this._lineId.toString(), this._lineStyle);
                this.localDraw(graphics);
            }
            this._drawing = false;
            this.checkTemp();
            if (this.mode === TracingEnum.Mode.Check) {
                this.checkResult();
            }

            this.emitTracingMsg(
                TracingEnum.Operate.Add,
                this._lineId.toString(),
                this.getDataStrByPosCache(),
                this._lineStyle,
                this._realTraceIndexArr,
                this._tempTraceIndexArr,
                this._result
            );
            ++this._lineId;
            if (this.mode === TracingEnum.Mode.Teach) {
                this.checkTeach();
            }
        }
    }

    private onMove(e: InteractionEvent, thisObj: DisplayObject) {
        e.stopPropagation();
        if (this.mode == TracingEnum.Mode.Auto) {
            //自动播放，不可操作
            return;
        }
        if (this._drawing) {
            const curLocal = this.container.toLocal(e.local, thisObj.container);
            if (pointDistance(curLocal, this._lastLocalPos) >= POS_DISTANCE) {
                this._lastLocalPos.copyFrom(curLocal);
                this._posCache.push(this._lastLocalPos.clone());
                const graphics = this.getGraphics(this._lineId.toString(), this._lineStyle);
                this.localDraw(graphics);
                this.checkTrace(this._lastLocalPos);
            }
        }
    }

    /**
     *
     * @param lineId
     * @param lineStyle
     */
    private getGraphics(lineId: string, lineStyle: any): vf.Graphics {
        if (this._renderMode === 1) {
            lineId = "mask";
        }
        const key = "line_" + lineId;
        if (this._lines.has(key)) {
            return this._lines.get(key) as vf.Graphics;
        }
        const graphics = new vf.Graphics();
        graphics.interactive = false;
        graphics.interactiveChildren = false;
        graphics.name = key;
        this.container.addChild(graphics);
        this._lines.set(key, graphics);
        lineStyle = deepCopy(lineStyle);
        lineStyle.color = lineStyle.texture ? 0xffffff : lineStyle.color;
        lineStyle.texture = lineStyle.texture ? getTexture(this.lineTexture) : vf.Texture.WHITE;
        lineStyle.alpha = 1;
        lineStyle.cap = "round";
        lineStyle.join = "round";
        if (this._renderMode === 0) {
            graphics.lineTextureStyle(lineStyle);
        } else {
            graphics.lineTextureStyle({
                width: lineStyle.width,
                color: 0xff0000,
            });
        }

        return graphics;
    }

    private getDataStrByPosCache(): string {
        const { _posCache } = this;
        if (_posCache.length == 0) {
            return '';
        }
        // 稀疏位置点，通过曲率
        const finalX = [_posCache[0].x];
        const finalY = [_posCache[0].y];

        let lastLastPos = _posCache[0];
        let lastPos = _posCache[1];

        let sumAngle = 0;

        for (let index = 2; index < _posCache.length; index++) {
            const pos = _posCache[index];
            const pos1 = pointSub(lastPos, lastLastPos);
            const pos2 = pointSub(pos, lastPos);
            const angle = pointSignAngle(pos1, pos2);

            if (angle > MAX_ARC || angle < -MAX_ARC || sumAngle > MAX_ARC || sumAngle < -MAX_ARC) {
                finalX.push(lastPos.x);
                finalY.push(lastPos.y);
                sumAngle = 0;
            } else {
                sumAngle += angle;
            }

            lastLastPos = lastPos;
            lastPos = pos;
        }

        finalX.push(_posCache[_posCache.length - 1].x);
        finalY.push(_posCache[_posCache.length - 1].y);

        const finalStrList = [];
        for (let index = 0; index < finalX.length; index++) {
            const x = finalX[index] + POSITIVE;
            const y = finalY[index] + POSITIVE;
            const str = getStrFromPos(x, y);

            finalStrList.push(str);
        }

        const finalStr = finalStrList.join("");
        return finalStr;
    }

    /**
     * 发送一个笔画的msg
     * @param lineId
     * @param data
     */
    private emitTracingMsg(
        operate: number = TracingEnum.Operate.Add,
        lineId = '',
        data = '',
        lineStyle: any = {},
        realTraceIndexArr: number[] = [],
        tempTraceIndexArr: number[] = [],
        result = 0
    ) {
        const obj: any = {
            operate,
            lineId,
            data,
            lineStyle,
            realTraceIndexArr,
            tempTraceIndexArr,
            result,
        };
        
        this.emit(ComponentEvent.CHANGE, this, JSON.stringify(obj));
    }

    private onMessage() {
        const { _messageCache } = this;
        if (_messageCache.length > 0) {
            while (_messageCache.length > 0) {
                const message: string = _messageCache.pop() as string;
                const { operate, lineId, data, lineStyle, realTraceIndexArr, tempTraceIndexArr, result } = JSON.parse(
                    message
                );
                this._realTraceIndexArr = realTraceIndexArr;
                this._tempTraceIndexArr = tempTraceIndexArr;
                this._result = result;
                if (this._result != TracingEnum.Result.Uncomplete) {
                    //临摹完成，返回结果
                    this.emit(ComponentEvent.COMPLETE, this, { mode: this.mode, value: this._result });
                }
                switch (operate) {
                    case TracingEnum.Operate.Add:
                        this.drawLine(lineId, data, 0, data.length, lineStyle);
                        break;
                    case TracingEnum.Operate.Clear:
                        this.clear();
                        break;
                }
            }
        }
    }

    /**
     * clear
     */
    public clear() {
        this._lines.forEach((value: vf.Graphics, key: string) => {
            if (value.parent) {
                value.parent.removeChild(value);
                value.destroy();
            }
        });
        this._lines.clear();
        if(this._renderMode == 1){
            const graphic = this.getGraphics("mask", this._lineStyle);
            (this._bgSprite as vf.Sprite).mask = graphic;
        }
        this._lineId = 0;
        this._pointId = 0;
        this._realTraceIndexArr = [];
        this._tempTraceIndexArr = [];
        this._posCache = [];
        this._autoComplete = false;
        this._newLineFlag = true;
        this._result = TracingEnum.Result.Uncomplete;
        this._tracePointObjArr.forEach(item => {
            item.flag = false;
        })
        if (this._tween) {
            (this._tween as Tween).release();
        }
        this.clearGuide();
        this.start();
    }

    /**
     * @private
     * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
     */
    protected commitProperties(): void {
        this.onMessage();
    }

    public setData(data: string | string[]) {
        if (typeof data === "string") {
            this._messageCache.push(data);
        } else {
            this._messageCache = this._messageCache.concat(data);
        }

        this.invalidateProperties();
    }

    public set source(data: string | string[]) {
        this.setData(data);
    }
}
