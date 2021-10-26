import { SchedulerWorkerStatus } from ".";
import Scheduler, { SchedulerPlane } from "../utils/Scheduler";

const CHUNK_LENGTH = 20000000,
  scheduler = new Scheduler(),
  status: SchedulerWorkerStatus = {
    active: false,
    done: false,
    begin: 0,
    end: 0,
    position: 0,
    found: 0,
  },
  validCombinations = [] as Array<number>;

function loop(): void {
  if (status.active) {
    setTimeout(() => {
      for (let i = 0; i < CHUNK_LENGTH; i++) {
        if (scheduler.position >= status.end) {
          status.done = true;
          break;
        }
        if (scheduler.checkValidity()) {
          validCombinations.push(scheduler.position);
        }
        if (!scheduler.nextCombination()) {
          status.done = true;
          break;
        }
      }
      status.position = scheduler.position;
      status.found = validCombinations.length;
      if (status.done) {
        status.active = false;
      } else {
        loop();
      }
    }, 0);
  }
}

export function readValidCombinations(): Array<number> {
  status.found = 0;
  return validCombinations.splice(0, validCombinations.length);
}

export function setup(
  schedulerInput: string | SchedulerPlane,
  active: boolean = false,
  begin: number = 0,
  end?: number,
  position?: number
): void {
  scheduler.assign(schedulerInput);
  status.done = false;
  status.active = active;
  status.begin = Math.max(0, begin);
  status.end = scheduler.combinationsCount;
  status.end = Math.min(end ?? status.end, status.end);
  status.position = Math.min(
    Math.max(position ?? scheduler.position, status.begin),
    status.end - 1
  );
  scheduler.position = status.position;
  readValidCombinations();
  loop();
}

export function setActive(active: boolean): SchedulerWorkerStatus {
  status.active = active;
  loop();
  return status;
}

export function getStatus(): SchedulerWorkerStatus {
  return status;
}
