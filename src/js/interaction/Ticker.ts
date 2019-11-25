export default class Ticker {
  private count = 0;
  private timeout = 0;
  private interval = Infinity;
  private readonly onTick: (tickCount: number) => void;
  constructor(onTick: (tickCount: number) => void) {
    this.onTick = onTick;
  }

  private onTickRequest() {
    this.scheduleNextTick();

    if (this.interval < 16) {
      for (let d = 16; d > this.interval; d -= this.interval) {
        this.onTick(this.count++);
      }
    } else {
      this.onTick(this.count++);
    }
  }

  setTickInterval(tickInterval: number) {
    if (this.interval === tickInterval) return;
    this.interval = tickInterval;
    clearTimeout(this.timeout);
    this.scheduleNextTick();
  }

  tick(delta: number) {
    if (delta > 0) {
      this.count += delta;
      this.onTick(this.count);
    }
  }

  private scheduleNextTick() {
    if (Number.isFinite(this.interval)) {
      this.timeout = setTimeout(() => this.onTickRequest(), Math.max(16, this.interval)) as any;
    }
  }
}