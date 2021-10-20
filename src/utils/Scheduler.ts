import Period, { PeriodPlane } from "./Period";
import Student, { StudentPlane } from "./Student";

export type SchedulerPlane = Array<StudentPlane>;

export default class Scheduler {
  students: Array<Student> = [];
  constructor(dataInput?: SchedulerPlane | string | null) {
    if (dataInput) {
      this.assign(dataInput);
    }
  }
  assign(dataInput: SchedulerPlane | string) {
    this.students = (typeof dataInput === "string" ? JSON.parse(dataInput) : dataInput).map(
      (student: StudentPlane, index: number) =>
        new Student(
          index,
          student.name,
          new Period(student.lesson.begin, student.lesson.length),
          student.periods.map((period: PeriodPlane) => new Period(period.begin, period.length))
        )
    );
  }
  toString(): string {
    return JSON.stringify(this.students);
  }
  toPlain(): SchedulerPlane {
    return this.students.map((student) => student.toPlain());
  }
  nextCombination(): boolean {
    const len = this.students.length;
    let i = 0;
    while (i < len) {
      if (this.students[i].nextCombination()) return true;
      ++i;
    }
    return false;
  }
  get combinationsCount(): number {
    const len = this.students.length;
    let result = 1,
      i = 0;
    while (i < len) {
      result *= this.students[i].combinationsCount;
      ++i;
    }
    return result;
  }
  checkValidity(): boolean {
    const last = this.students.length - 1;
    let i = 0,
      j = 0;
    while (i < last) {
      j = i + 1;
      while (j <= last) {
        if (this.students[i].isOverlap(this.students[j])) return false;
        ++j;
      }
      ++i;
    }
    return true;
  }
  get position(): number {
    const len = this.students.length;
    let tmp = 1,
      multipliers: Array<number> = [],
      i = 0;
    multipliers.push(tmp);
    while (i < len) {
      multipliers.push((tmp *= this.students[i].combinationsCount));
      ++i;
    }
    tmp = i = 0;
    while (i < len) {
      tmp += this.students[i].position * multipliers[i];
      ++i;
    }
    return tmp;
  }
  set position(pos: number) {
    const len = this.students.length;
    let tmp = 1,
      multipliers: Array<number> = [],
      i = 0,
      howMany = 0;
    multipliers.push(tmp);
    while (i < len) {
      multipliers.push((tmp *= this.students[i].combinationsCount));
      ++i;
    }
    i = len - 1;
    while (i >= 0) {
      howMany = Math.floor(pos / multipliers[i]);
      this.students[i].position = howMany;
      pos -= howMany * multipliers[i];
      --i;
    }
  }
}
