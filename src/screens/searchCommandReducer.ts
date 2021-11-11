import { store } from "../redux";
import { PayloadAction } from "@reduxjs/toolkit";
import SearchWorker from "../utils/SearchWorker";
import CombinationList from "../models/CombinationList";
import Scheduler from "../models/Scheduler";
import { AppState, SearchState, searchCommand, setCombinations, setProgress } from "./appSlice";
import { calculateProgress, debounce, range } from "../utils";

const THREAD_COUNT = 4;
const workers: Array<SearchWorker> = [];
const combinationList = new CombinationList();

const updateSearchProgress = debounce(async () => {
  if (store.getState().app.searchState === "START") {
    const combinationsLength = combinationList.length;
    let progress = 0;
    let workingThreads = THREAD_COUNT;
    for (let i = 0; i < THREAD_COUNT; i++) {
      const status = await workers[i].getStatus();
      progress += calculateProgress(status);
      if (status.found > 0) {
        combinationList.addCombinations(await workers[i].readValidCombinations());
      }
      workingThreads -= status.done ? 1 : 0;
    }
    if (combinationList.length > combinationsLength) {
      combinationList.sort();
    }
    store.dispatch(setCombinations(combinationList.getItems()));
    if (workingThreads <= 0) {
      store.dispatch(setProgress(1));
      store.dispatch(searchCommand("STOP"));
    } else {
      store.dispatch(setProgress(progress / THREAD_COUNT));
      updateSearchProgress();
    }
  }
}, 3000);

const searchCommandReducer = (
  state: AppState,
  { payload: command }: PayloadAction<SearchState | "TOGGLE">
) => {
  if (command === "TOGGLE") {
    command = state.searchState === "START" ? "STOP" : "START";
  }
  if (command !== state.searchState) {
    switch (command) {
      case "RESET":
        state.searchProgress = -1;
        state.combinations = [];
        workers.forEach((worker, index) =>
          worker.setActive(false).then(() => {
            worker.terminate();
            delete workers[index];
          })
        );
        break;
      case "START":
        if (state.searchState === "RESET") {
          const scheduler = new Scheduler(state.students);
          const combinationsCount = scheduler.combinationsCount;
          const chunkCount = Math.trunc(combinationsCount / THREAD_COUNT);
          range(THREAD_COUNT).forEach((i) => {
            workers[i] = new SearchWorker();
            const end = i < THREAD_COUNT - 1 ? chunkCount * (i + 1) : combinationsCount;
            workers[i].setup(i, scheduler.toPlain(), false, chunkCount * i, end);
          });
        }
        workers.forEach((worker) => worker.setActive(true));
        state.searchProgress = 0;
        updateSearchProgress();
        break;
      case "STOP":
        workers.forEach((worker) => worker.setActive(false));
        break;
    }
    state.searchState = command;
  }
};

export default searchCommandReducer;
