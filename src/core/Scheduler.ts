import { TickerShared } from "../UI";
import { EventType } from "../event/EventType";
import { EventLevel } from "../event/EventLevel";

/**
 * Schedule anything
 *
 * @author 8088
 */

export class Scheduler extends PIXI.utils.EventEmitter {

    public get id(): number {
        return this._id;
    }

    public static clock: () => number = Date.now;

    public static ticker: any = TickerShared;

    public static setInterval(time: number, listener: () => void): Scheduler {
        const scheduler: Scheduler = new Scheduler(Infinity, time);
        scheduler.addListener(EventType.TICK, listener);
        return scheduler;
    }

    public static setTimeout(time: number, listener: () => void): Scheduler {
        const scheduler: Scheduler = new Scheduler(time, Infinity);
        scheduler.addListener(EventType.END, listener, scheduler);
        return scheduler;
    }

    public interval: number = 0;

    public timeout: number = Infinity;

    protected start: number = 0;

    protected lastTick: number = -1;

    protected endHandler: () => void;

    protected elapsedTimeAtPause: number = 0;

    protected lastVisited: number = -1;

    protected tickHandler: () => void;

    private _running: boolean = false;

    private _lastExecuted: number = 0;

    private _id: number = Math.random();

    private TIMEOUT: number = 1000;

    constructor(_timeout: number = Infinity, _interval: number = 0) {
        super();
        this.endHandler = this.noop;
        this.tickHandler = this.noop;
        this.timeout = _timeout;
        this.interval = _interval;
        this.restart();
    }

    public restart(): void {
        this.elapsedTimeAtPause = 0;
        this.start = Scheduler.clock();
        this._lastExecuted = this.start;
        this._running = true;
        Scheduler.ticker.addUpdateEvent(this.run, this);
    }

    public stop(): void {
        this.elapsedTimeAtPause = 0;
        this._running = false;
        Scheduler.ticker.removeUpdateEvent(this.run, this);
    }

    public pause(): void {
        if (this._running) {
            this.stop();
            this.elapsedTimeAtPause = Scheduler.clock() - this.start;
        }
    }

    public resume(): void {
        let _t: number;
        if (!this._running) {
            _t = this.elapsedTimeAtPause;
            this.restart();
            this.start = this.start - _t;
        }
    }

    public seek(time: number): void {
        this.elapsedTimeAtPause = time;
    }

    public isTickable(num: number): boolean {
        return num - this.lastTick >= this.interval;
    }

    protected noop(evt: any = null): void {
        return;
    }


    // Internals
    //

    private run(): boolean {
        let elapsed: number;
        const t: number = Scheduler.clock();
        const timeElapsed: any = t - this._lastExecuted;
        this._lastExecuted = t;

        if (timeElapsed >= this.TIMEOUT) {
            return false; // init Scheduler
        }

        if (this.lastVisited <= t) {
            this.lastVisited = t;
            elapsed = t - this.start;
            if (this.isTickable(t)) {
                this.lastTick = t;
                const info = {
                    code: EventType.TICK,
                    level: EventLevel.STATUS,
                    target: this,
                    elapsed,
                };
                this.emit(EventType.TICK, info);
            }
            if (elapsed >= this.timeout) {
                this.stop();
                const info = {
                    code: EventType.END,
                    level: EventLevel.STATUS,
                    target: this,
                    elapsed,
                };
                this.emit(EventType.END, info);
            }
            // ..
        }

        return false;
    }
}
