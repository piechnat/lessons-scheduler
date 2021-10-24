declare module "comlink-loader!*" {
  type SchedulerWorkerStatus = import(".").SchedulerWorkerStatus;
  type SchedulerPlane = import("../utils/Scheduler").SchedulerPlane;
  class WebpackWorker extends Worker {
    constructor();
    setup(
      schedulerInput: string | SchedulerPlane,
      begin: number = 0,
      position?: number,
      end?: number,
      active: boolean = false
    );
    setActive(active: boolean): Promise<SchedulerWorkerStatus>;
    getStatus(): Promise<SchedulerWorkerStatus>;
  }
  export = WebpackWorker;
}
