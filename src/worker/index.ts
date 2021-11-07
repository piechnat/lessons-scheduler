// eslint-disable-next-line
import SearchWorker from "comlink-loader!./SearchWorker"; // inline loader

export type SearchWorkerStatus = {
  active: boolean;
  done: boolean;
  begin: number;
  end: number;
  position: number;
  found: number;
}

export default SearchWorker;
