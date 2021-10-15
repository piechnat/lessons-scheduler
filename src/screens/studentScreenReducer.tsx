import { SDate } from "../utils";
import { PeriodPlane } from "../utils/Period";

type State = {
  studentName: string;
  lessonLength: number;
  periodList: Array<PeriodPlane>;
  periodIndex: number;
  periodBegin: SDate;
  periodEnd: SDate;
};

type PayloadType = {
  studentNameChange: string;
  lessonLengthChange: number;
  periodIndexChange: number;
  periodDayChange: number;
  periodBeginChange: number;
  periodEndChange: number;
  removeClick: null;
};

type Transformer<T> = {
  [P in keyof T]: { type: P; payload: T[P] };
};

type Action = Transformer<PayloadType>[keyof Transformer<PayloadType>];

export default function studentScreenReducer(state: State, action: Action): State {
  if (action.payload) {
    switch (action.type) {
      case "studentNameChange":
        return { ...state, studentName: action.payload };
      case "lessonLengthChange":
        return { ...state, lessonLength: action.payload };
    }
  }
  switch (action.type) {
    case "removeClick":
      return { ...state };
  }
  return state;
}

export function createAction<T extends keyof PayloadType>(type: T, payload: PayloadType[T]) {
  return { type: type, payload: payload };
}