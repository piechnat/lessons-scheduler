declare module "comlink-loader!*" {
  type SearchWorkerStatus = import(".").SearchWorkerStatus;
  type SchedulerPlane = import("../../models/Scheduler").SchedulerPlane;
  type Combinations = import("../../models/CombinationList").CombinationList;
  class WebpackWorker extends Worker {
    constructor();
    setup(
      id: number,
      schedulerInput: string | SchedulerPlane,
      active: boolean = false,
      begin: number = 0,
      end?: number,
      position?: number,
    );
    setActive(active: boolean): Promise<SearchWorkerStatus>;
    getStatus(): Promise<SearchWorkerStatus>;
    readValidCombinations(): Promise<Combinations>;
  }
  export = WebpackWorker;
}
