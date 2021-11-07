import { SearchWorkerStatus } from ".";
import { debounce } from "../utils";
import Scheduler, { SchedulerPlane } from "../models/Scheduler";
import CombinationList, { Combinations } from "../models/CombinationList";

const CHUNK_LENGTH = 20000000;
const scheduler = new Scheduler();
const combinationList = new CombinationList();
const status: SearchWorkerStatus = {
  active: false,
  done: false,
  begin: 0,
  end: 0,
  position: 0,
  found: 0,
};

const loop = debounce(() => {
  if (status.active) {
    for (let i = 0; i < CHUNK_LENGTH; i++) {
      if (scheduler.position >= status.end) {
        status.done = true;
        break;
      }
      if (scheduler.checkValidity()) {
        combinationList.addFromScheduler(scheduler);
      }
      if (!scheduler.nextCombination()) {
        status.done = true;
        break;
      }
    }
    status.position = scheduler.position;
    status.found = combinationList.length;
    if (status.done) {
      status.active = false;
    } else {
      loop();
    }
  }
}, 0);

export function readValidCombinations(): Combinations {
  status.found = 0;
  return combinationList.getItems(true);
}

export function setup(
  schedulerInput: string | SchedulerPlane,
  active: boolean = false,
  begin: number = 0,
  end?: number,
  position?: number,
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

export function setActive(active: boolean): SearchWorkerStatus {
  status.active = active;
  if (active) {
    loop();
  }
  return status;
}

export function getStatus(): SearchWorkerStatus {
  return status;
}
