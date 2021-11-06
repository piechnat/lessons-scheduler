import { store } from "../redux";
import { setCombinations, setSearchProgress } from "../screens/appSlice";
import SchedulerWorker, { completed } from ".";
import CombinationList from "./Combinations";

export namespace searchController {
  let active = false,
    started = false;
  const worker = new SchedulerWorker();
  const combinationList = new CombinationList();
  function loop(): void {
    if (active) {
      setTimeout(async () => {
        const status = await worker.getStatus();
        store.dispatch(setSearchProgress(completed(status)));
        combinationList.addCombinations(await worker.readValidCombinations());
        store.dispatch(setCombinations(combinationList.getItems()));
      }, 3000);
    }
  }
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
  }
  export function start(): void {
    if (!started) {
      worker.setup(store.getState().app.students);
    }
    started = active = true;
    worker.setActive(active);
    loop();
  }
  export function stop(): void {
    active = false;
    worker.setActive(active);
  }
}
