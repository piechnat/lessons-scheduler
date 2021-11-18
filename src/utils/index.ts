import { PeriodPlane } from "../models/Period";
import SDate from "../models/SDate";
import { SearchWorkerStatus } from "./SearchWorker";

export const DEV_MODE = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
export const debugLog = DEV_MODE ? (...args: any[]) => console.log(...args) : () => {};

export function periodToStr(period: PeriodPlane): string {
  return new SDate(period.begin) + "-" + new SDate(period.begin + period.length).toTime();
}

export function range(fromOrLength: number, to?: number): Array<number> {
  if (to === undefined) {
    to = fromOrLength - 1;
    fromOrLength = 0;
  }
  return Array.from({ length: to - (fromOrLength - 1) }, (value, index) => index + fromOrLength);
}

export function calculateProgress(status: SearchWorkerStatus): number {
  const len = status.end - status.begin;
  const pos = status.position - status.begin;
  return pos / len;
}

export function debounce<A extends any[]>(fn: (...args: A) => void, timeout = 1000) {
  let handle: NodeJS.Timeout;
  return (...args: A) => {
    clearTimeout(handle);
    handle = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}
