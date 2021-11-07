import Scheduler, { compareByLessonBegin } from "./Scheduler";

export type Combinations = Array<[number, string]>;

export default class CombinationList {
  private items: Combinations = [];
  add(position: number, orderStamp: string): boolean {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i][1] === orderStamp) {
        return false;
      }
    }
    this.items.push([position, orderStamp]);
    return true;
  }
  get length() {
    return this.items.length;
  }
  addFromScheduler(scheduler: Scheduler): boolean {
    const sorted = scheduler.toPlain().sort(compareByLessonBegin);
    const order: Array<string> = Array(sorted.length);
    sorted.forEach((student, index) => (order[index] = String.fromCharCode(student.id)));
    return this.add(scheduler.position, order.join(""));
  }
  addCombinations(combinations: Combinations): number {
    let result = 0;
    for (let i = 0; i < combinations.length; i++) {
      if (this.add(...combinations[i])) {
        result++;
      }
    }
    return result;
  }
  getItems(reset: boolean = false): Combinations {
    return reset ? this.items.splice(0, this.items.length) : [...this.items];
  }
  sort(): CombinationList {
    this.items.sort((a, b) => a[0] - b[0]);
    return this;
  }
}
