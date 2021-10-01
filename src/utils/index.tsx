import { PeriodPlane } from "./Period";

export const UNIT = 15; /* minutes */
const HOUR = 60 / UNIT;
const DAY = (60 * 24) / UNIT;
export const DAY_NAMES = [
  "poniedziałek",
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
  "niedziela",
];

function timeToStr(time: number): string {
  time = time % DAY;
  const hour = Math.trunc(time / HOUR).toString();
  const minutes = Math.trunc((time % HOUR) * UNIT).toString();
  return hour.padStart(2, "0") + ":" + minutes.padStart(2, "0");
}

export function periodToStr(period: PeriodPlane): string {
  return (
    DAY_NAMES[Math.trunc(period.begin / DAY)] +
    " " +
    timeToStr(period.begin) +
    "-" +
    timeToStr(period.begin + period.length)
  );
}

export function range(from: number, to: number): Array<number> {
  return Array.from({length: to - (from - 1)}, (value, index) => index + from);
}
