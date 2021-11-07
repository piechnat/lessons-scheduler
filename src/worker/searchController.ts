import { store } from "../redux";
import { setCombinations, setSearchProgress } from "../screens/appSlice";
import SearchWorker from ".";
import CombinationList from "../models/CombinationList";
import { calculateProgress, debounce, range } from "../utils";
import Scheduler from "../models/Scheduler";

export namespace SearchController {
  const THREAD_COUNT = 4;
  const workers: Array<SearchWorker> = [];
  const combinationList = new CombinationList();
  let active = false;
  let started = false;

  const loop = debounce(async () => {
    if (active) {
      let progress = 0;
      for (let i = 0; i < THREAD_COUNT; i++) {
        const status = await workers[i].getStatus();
        progress += calculateProgress(status);
        if (status.found > 0) {
          combinationList.addCombinations(await workers[i].readValidCombinations());
        }
      }
      store.dispatch(setSearchProgress(progress / THREAD_COUNT));
      store.dispatch(setCombinations(combinationList.getItems()));
      loop();
    }
  }, 3000);

  export function isActive(): boolean {
    return active;
  }

  export function isStarted(): boolean {
    return started;
  }

  export function reset(): void {
    started = active = false;
    store.dispatch(setSearchProgress(0));
    store.dispatch(setCombinations([]));
    workers.forEach((worker, index) =>
      worker.setActive(false).then(() => {
        worker.terminate();
        delete workers[index];
      })
    );
  }

  export function start(): void {
    if (!started) {
      const students = store.getState().app.students;
      const combinationsCount = new Scheduler(students).combinationsCount;
      const chunkCount = Math.trunc(combinationsCount / THREAD_COUNT);
      range(THREAD_COUNT).forEach((i) => {
        workers[i] = new SearchWorker();
        const end = i < THREAD_COUNT - 1 ? chunkCount * (i + 1) : combinationsCount;
        workers[i].setup(students, false, chunkCount * i, end);
      });
    }
    started = active = true;
    workers.forEach((worker) => worker.setActive(true));
    loop();
  }

  export function stop(): void {
    active = false;
    workers.forEach((worker) => worker.setActive(false));
  }
}
