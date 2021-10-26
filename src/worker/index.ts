// eslint-disable-next-line
import SchedulerWorker from "comlink-loader!./worker"; // inline loader

export type SchedulerWorkerStatus = {
  active: boolean;
  done: boolean;
  begin: number;
  end: number;
  position: number;
  found: number;
}

export function completed(status: SchedulerWorkerStatus): number {
  const len = status.end - status.begin;
  const pos = status.position - status.begin;
  return pos / len;
}

export default SchedulerWorker;
