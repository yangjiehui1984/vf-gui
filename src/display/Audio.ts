import { DisplayObject } from "../core/DisplayObject";
import { IAudioOption } from "vf.js";
import { getSound } from "../utils/Utils";

/**
 * 音频组件
 * 
 * 准备完成 canplaythrough
 *
 * 播放事件 play
 *
 * 暂停事件 pause
 *
 * 错误事件 error
 *
 * 播放时间改变 timeupdate
 *
 * 播放完成 ended
 * 
 * @example let audio = new vf.gui.Audio();
 * 
 * 
 * @link https://vipkid-edu.github.io/vf-gui/play/#example/TestLabel
 */
export class Audio extends DisplayObject {

    private audio?: vf.IAudio;

    private _src: any;
    private _autoplay = false;
    private _loop = false;
    private _playbackRate = 1;
    private _volume = 1;

<<<<<<< HEAD
    private _autoplay: boolean = false;
    private _loop: boolean = false;
    private _playbackRate: number = 1;
    private _volume: number = 1;


    private stoping: any;
    public constructor() {
        super();
        if (this._src) this.initAudio();
=======
    public constructor() {
        super();
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    }

    private initAudio() {

        const o: IAudioOption = {
            autoplay: this._autoplay,
            loop: this._loop,
            playbackRate: this._playbackRate,
            volume: this._volume
        }
        
        this.audio = vf.AudioEngine.Ins().createAudio(this.uuid.toString(), this._src, o);
        /**
        * 需要上报的事件
        */
        this.audio.on("canplaythrough", (e: any) => {
            this.emit("canplaythrough", e)
        },this);
        this.audio.on("play", (e: any) => {
            this.emit("play", e)
        },this);
        this.audio.on("pause", (e: any) => {
            this.emit("pause", e)
        },this);
        this.audio.on("error", (e: any) => {
            this.emit("error", e)
        }),this;
        this.audio.on("timeupdate", (e: any) => {
            this.emit("timeupdate", e)
        });
        this.audio.on("ended", (e: any) => {
            this.emit("ended", e)
<<<<<<< HEAD
        });

=======
        },this);
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    }

    //支持的参数们~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /**
    * 设置src 支持3种 url base64 arraybuffer;
    */
    public set src(value) {
<<<<<<< HEAD
        let o = getSound(value);
        if (typeof (o) === "object" && o.url) {
=======
        const o = getSound(value);
        if(typeof(o) === "object" && o.url){
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
            this._src = o.url
        } else {
            this._src = value;
        }
<<<<<<< HEAD

=======
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
        this.audio && this.dispose();
        this.invalidateProperties();
    }

    public get src() {
        return this._src;
    }

    public set autoplay(value) {
        this._autoplay = value;
<<<<<<< HEAD
        if (this.audio) this.audio.autoplay = this._autoplay;
=======
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    }

    public get autoplay() {
        return this._autoplay;
    }

    public set loop(value) {
        this._loop = value;
<<<<<<< HEAD
        if (this.audio) this.audio.loop = this._loop;
=======
        if(this.audio){
            this.audio.loop = this._loop;
        }
        
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    }

    public get loop() {
        if(this.audio){
            return this.audio.loop;
        }
        return false;
    }

    public set playbackRate(value) {
        this._playbackRate = value;
<<<<<<< HEAD
        if (this.audio) this.audio.playbackRate = this._playbackRate;
=======
        if(this.audio){
            this.audio.playbackRate = this._playbackRate;
        }
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    }

    public get playbackRate() {
        if(this.audio){
            return this.audio.playbackRate;
        }
        return 0;
    }

    public set volume(value) {
        this._volume = value;
<<<<<<< HEAD
        if (this.audio) this.audio.volume = this._volume;
=======
        if(this.audio){
            this.audio.volume = this._volume;
        }
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    }
    public get volume() {
        if(this.audio){
            return this.audio.volume;
        }
        return 0;
    }

    /*只读的属性们*/
<<<<<<< HEAD

=======
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    public get duration() {
        if(this.audio){
            return this.audio.duration;
        }
        return 0;
    }
    public get paused() {
        if(this.audio){
            return this.audio.paused;
        }
        return false;
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
        let that = this;
        this.audio && this.audio.stop(time);
        if(this.stoping)clearTimeout(this.stoping)
        if (time) {
            this.stoping = setTimeout(() => {
                that.emit("stop", that)
            }, time);
        } else {
            this.emit("stop", this);
        }

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
        if (this.audio) {
            this.audio.removeAllListeners();
            this.audio.dispose();
        }
    }

<<<<<<< HEAD
    /**
    * 各种可取参数.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    public get isPlaying() {
        return this.audio._isPlaying;
=======
    protected commitProperties() {
        this.initAudio();
>>>>>>> bbc58d6fc5a5882c2f8fc6a020a2a0772366f3c0
    }
}
