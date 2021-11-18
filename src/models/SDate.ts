export default class SDate {
  private time = 0;
  private day = 0;
  private hours = 0;
  private minutes = 0;
  static readonly DAY_NAMES = [
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
    "niedziela",
  ];
  static readonly UNIT = 15; /* minutes */
  static readonly HOUR = 60 / SDate.UNIT;
  static readonly DAY = 24 * SDate.HOUR;
  static readonly WEEK = SDate.DAY_NAMES.length * SDate.DAY;
  constructor(...args: Array<number>) {
    if (args.length > 1) {
      this.day = args[0] ?? 0;
      this.hours = args[1] ?? 0;
      this.minutes = args[2] ?? 0;
      this._updateTime();
    } else if (args[0]) {
      this.setTime(args[0]);
    }
  }
  private _updateTime() {
    this.setTime(this.day * SDate.DAY + this.hours * SDate.HOUR + this.minutes / SDate.UNIT);
  }
  setTime(time: number): SDate {
    this.time = time = Math.trunc(Math.max(0, time) % SDate.WEEK);
    this.day = Math.trunc(time / SDate.DAY);
    time %= SDate.DAY;
    this.hours = Math.trunc(time / SDate.HOUR);
    this.minutes = Math.trunc((time % SDate.HOUR) * SDate.UNIT);
    return this;
  }
  setDay(day: number): SDate {
    this.day = day;
    this._updateTime();
    return this;
  }
  setHours(hours: number): SDate {
    this.hours = hours;
    this._updateTime();
    return this;
  }
  setMinutes(minutes: number): SDate {
    this.minutes = minutes;
    this._updateTime();
    return this;
  }
  getTime(): number {
    return this.time;
  }
  getDay(): number {
    return this.day;
  }
  getHours(): number {
    return this.hours;
  }
  getMinutes(): number {
    return this.minutes;
  }
  toTime(): string {
    return this.hours.toString().padStart(2, "0") + ":" + this.minutes.toString().padStart(2, "0");
  }
  toDay(): string {
    return SDate.DAY_NAMES[this.day];
  }
  toString(): string {
    return this.toDay() + " " + this.toTime();
  }
  clone(): SDate {
    return Object.assign(new SDate(), this);
  }
}
