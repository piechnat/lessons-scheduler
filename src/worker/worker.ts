import { SchedulerWorkerStatus } from ".";
import Scheduler, { SchedulerPlane } from "../utils/Scheduler";

const CHUNK_SIZE = 20000000;
const scheduler = new Scheduler();
const status: SchedulerWorkerStatus = {
  active: false,
  done: false,
  begin: 0,
  end: 0,
  position: 0,
  validCombinations: [],
};

function loop(): void {
  if (status.active) {
    setTimeout(() => {
      let keepDoing = false;
      let iterationCounter = 0;
      do {
        if (scheduler.checkValidity()) {
          status.validCombinations.push(scheduler.position);
        }
        if (++iterationCounter >= CHUNK_SIZE) {
          keepDoing = true;
          return loop();
        }
      } while (scheduler.nextCombination());
      status.position = scheduler.position;
      status.active = false;
      status.done = true;
      if (keepDoing) {
        loop();
      }
    }, 0);
  }
}

export function setup(
  schedulerInput: string | SchedulerPlane,
  begin: number = 0,
  position?: number,
  end?: number,
  active: boolean = false
): void {
  scheduler.assign(schedulerInput);
  status.active = active;
  status.begin = begin;
  status.done = false;
  status.end = end ?? scheduler.combinationsCount - 1;
  status.position = position ?? begin;
  status.validCombinations = [];
  scheduler.position = status.position;
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
