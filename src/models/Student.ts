import Period, { PeriodPlane } from "./Period";

export type StudentPlane = {
  id: number;
  name: string;
  lesson: PeriodPlane;
  periods: Array<PeriodPlane>;
};

export default class Student implements StudentPlane {
  private _index: number = 0;
  id: number;
  name: string;
  lesson: Period;
  periods: Array<Period>;
  constructor(id?: number, name?: string, lesson?: Period, periods?: Array<Period>) {
    this.id = id ?? -1;
    this.name = name ?? '';
    this.lesson = lesson ?? new Period();
    this.periods = periods ?? [];
  }
  toPlain(): StudentPlane {
    return {
      id: this.id,
      name: this.name,
      lesson: this.lesson.toPlain(),
      periods: this.periods.map((period) => period.toPlain()),
    };
  }
  isOverlap(student: Student): boolean {
    return this.lesson.isOverlap(student.lesson);
  }
  nextCombination(): boolean {
    ++this.lesson.begin;
    let result = this.lesson.end <= this.periods[this._index].end;
    if (!result) {
      result = ++this._index < this.periods.length;
      if (!result) {
        this._index = 0;
      }
      this.lesson.begin = this.periods[this._index].begin;
    }
    return result;
  }
  get combinationsCount(): number {
    const len = this.periods.length;
    let result = 0,
      i = 0;
    while (i < len) {
      result += this.periods[i].length - this.lesson.length + 1;
      ++i;
    }
    return result;
  }
  get position(): number {
    let pos = 0,
      i = 0;
    while (i < this._index) {
      pos += this.periods[i].length - this.lesson.length + 1;
      ++i;
    }
    return pos + (this.lesson.begin - this.periods[this._index].begin);
  }
  set position(pos: number) {
    this._index = 0;
    this.lesson.begin = this.periods[this._index].begin;
    while (pos > 0) {
      this.nextCombination();
      --pos;
    }
  }
}
