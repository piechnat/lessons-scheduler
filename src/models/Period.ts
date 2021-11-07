export type PeriodPlane = {
  begin: number;
  length: number;
};

export default class Period implements PeriodPlane {
  begin: number;
  length: number;
  constructor(begin?: number, length?: number) {
    this.begin = begin ?? 0;
    this.length = length ?? 0;
  }
  toPlain(): PeriodPlane {
    return { begin: this.begin, length: this.length };
  }
  isOverlap(period: Period): boolean {
    return this.end > period.begin && this.begin < period.end;
  }
  get end(): number {
    return this.begin + this.length;
  }
}
