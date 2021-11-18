// eslint-disable-next-line
import SearchWorker from "comlink-loader!./worker"; // inline loader

export type SearchWorkerStatus = {
  id?: number;
  active: boolean;
  done: boolean;
  begin: number;
  end: number;
  position: number;
  found: number;
}

export default SearchWorker;
