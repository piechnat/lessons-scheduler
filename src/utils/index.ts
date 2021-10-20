import { PeriodPlane } from "./Period";
import SDate from "./SDate";

export function periodToStr(period: PeriodPlane): string {
  return new SDate(period.begin) + "-" + new SDate(period.begin + period.length).toTime();
}

export function range(from: number, to: number): Array<number> {
  return Array.from({ length: to - (from - 1) }, (value, index) => index + from);
}
