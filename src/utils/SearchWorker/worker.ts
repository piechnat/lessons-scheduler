import { SearchWorkerStatus } from ".";
import { debounce, debugLog } from "..";
import Scheduler, { SchedulerPlane } from "../../models/Scheduler";
import CombinationList, { Combinations } from "../../models/CombinationList";

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

const searchLoop = debounce(() => {
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
      searchLoop();
    }
  }
}, 0);

export function readValidCombinations(): Combinations {
  status.found = 0;
  return combinationList.getItems(true);
}

export function setup(
  id: number,
  schedulerInput: string | SchedulerPlane,
  active: boolean = false,
  begin: number = 0,
  end?: number,
  position?: number,
): void {
  scheduler.assign(schedulerInput);
  status.id = id;
  status.done = false;
  status.active = active;
  status.begin = Math.max(0, begin);
  status.end = scheduler.combinationsCount;
  status.end = Math.min(end ?? status.end, status.end);
  status.position = Math.min(
    Math.max(position ?? status.begin, status.begin),
    status.end - 1
  );
  scheduler.position = status.position;
  readValidCombinations();
  searchLoop();
  debugLog(status);
}

export function setActive(active: boolean): SearchWorkerStatus {
  status.active = active;
  if (active) {
    searchLoop();
  } 
  return status;
}

export function getStatus(): SearchWorkerStatus {
  return status;
}
