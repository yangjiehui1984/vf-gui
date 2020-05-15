import { DisplayObject } from "../core/DisplayObject";
import { ComponentEvent } from "../interaction/Index";
import * as UIKeys from "../core/DisplayLayoutKeys";
import { IAudioOption } from "vf.js";
import { getSound } from "../utils/Utils";

/**
 * 文本
 * 
 * 
 * 
 * 
 *  
 * 
 * @example let audio = new vf.gui.Audio();
 * 
 * 
 * @link https://vipkid-edu.github.io/vf-gui/play/#example/TestLabel
 */
export class Audio extends DisplayObject {
    private audio: any;
    private _src: any;

    private _autoplay: boolean = false;
    private _loop: boolean = false;
    private _playbackRate: number = 1;
    private _volume:number = 1;
    public constructor() {
        super();
        if(this._src)this.initAudio();
    }

    private initAudio() {
        let o: IAudioOption = {
            autoplay: this._autoplay,
            loop: this._loop,
            playbackRate:this._playbackRate,
            volume:this._volume
        }
        this.audio = vf.AudioEngine.Ins().createAudio(this.uuid.toString(), this._src, o)
        /**
        * 需要上报的事件
        */
        this.audio.on("canplaythrough", (e: any) => {
            this.emit("canplaythrough", e)
        });
        this.audio.on("play", (e: any) => {
            this.emit("play", e)
        });
        this.audio.on("pause", (e: any) => {
            this.emit("pause", e)
        });
        this.audio.on("error", (e: any) => {
            this.emit("error", e)
        });
        this.audio.on("timeupdate", (e: any) => {
            this.emit("timeupdate", e)
        });
        this.audio.on("ended", (e: any) => {
            this.emit("ended", e)
        });
    }
    //支持的参数们~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /**
    * 设置src 支持3种 url base64 arraybuffer;
    */
    public set src(value) {
        let o = getSound(value);
        if(typeof(o) === "object" && o.url){
            this._src = o.url
        }else{
            this._src = value;
        }
        
        this.audio && this.dispose();
        this.initAudio();
    }
    public get src() {
        return this._src;
    }

    public set autoplay(value) {
        this._autoplay = value;
        if(this.audio)this.audio.autoplay = this._autoplay;
    }
    public get autoplay() {
        return this._autoplay;
    }
    public set loop(value) {
        this._loop = value;
        if(this.audio)this.audio.loop = this._loop;
    }
    public get loop() {
        return this.audio.loop;
    }
    public set playbackRate(value) {
        this._playbackRate = value;
        if(this.audio)this.audio.playbackRate = this._playbackRate;
    }
    public get playbackRate() {
        return this.audio.playbackRate;
    }
    public set volume(value) {
        this._volume = value;
        if(this.audio)this.audio.volume = this._volume;
    }
    public get volume() {
        return this.audio.volume;
    }
    /*只读的属性们*/
       
    public get duration() {
        return this.audio.duration;
    }
    public get paused() {
        return this.audio.paused;
    }

    /**
    * 支持的方法们~~~··~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    *    */
    /**
     * 声音播放接口
     *
     *  await sound.play()
     *
     * @param {number} [offset] - 声音的开始偏移值
     * @param {number} [length] - 声音持续时间（以秒为单位）
     */

    public play(time?: number, offset?: number, length?: number) {
        this.audio && this.audio.play(offset, length);
    }

    /**
    * 停止声音
    * @param time (optional) X秒后停止声音。默认情况下立即停止
    */
    public stop(time?: number) {
        this.audio && this.audio.stop(time);
    }
    /**
    * 暂停声音
    */
    public pause() {
        this.audio && this.audio.pause();
    }
    /**
    * 释放
    */
    public dispose() {
        this.audio && this.audio.dispose();
    }

    /**
    * 各种可取参数.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    public get isReadyToPlay() {
        return this.audio._isReadyToPlay;
    }
    public get isPlaying() {
        return this.audio._isPlaying;
    }
    public get isPause() {
        return this.audio._isPause;
    }
}
