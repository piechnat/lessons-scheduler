import SDate from "../utils/SDate";
import { PeriodPlane } from "../utils/Period";

type State = {
  studentName: string;
  lessonLength: number;
  periodList: Array<PeriodPlane>;
  periodIndex: number;
  periodBegin: SDate;
  periodEnd: SDate;
};

type ActionType = {
  studentNameChange: string;
  lessonLengthChange: number;
  periodListSelect: number;
  periodDayChange: number;
  periodBeginChange: number;
  periodEndChange: number;
  removeClick: null;
  saveClick: null;
  addClick: null;
};

type Transformer<T> = {
  [P in keyof T]: { type: P; payload: T[P] };
};

type Action = Transformer<ActionType>[keyof Transformer<ActionType>];

const getPeriod = (state: State): PeriodPlane => ({
  begin: state.periodBegin.getTime(),
  length: state.periodEnd.getTime() - state.periodBegin.getTime(),
});

export default function studentScreenReducer(state: State, action: Action): State {
  switch (action.type) {
    case "studentNameChange":
      return { ...state, studentName: action.payload };
    case "lessonLengthChange":
      return { ...state, lessonLength: action.payload };
    case "periodListSelect": {
      const { begin, length } = state.periodList[action.payload];
      return {
        ...state,
        periodIndex: action.payload,
        periodBegin: new SDate(begin),
        periodEnd: new SDate(begin + length),
      };
    }
    case "periodDayChange":
      return {
        ...state,
        periodBegin: state.periodBegin.clone().setDay(action.payload),
        periodEnd: state.periodEnd.clone().setDay(action.payload),
      };
    case "periodBeginChange":
      return { ...state, periodBegin: new SDate(action.payload) };
    case "periodEndChange":
      return { ...state, periodEnd: new SDate(action.payload) };
    case "removeClick":
      return {
        ...state,
        periodList: state.periodList.filter((value, index) => index !== state.periodIndex),
        periodIndex: -1,
      };
    case "saveClick":
      return {
        ...state,
        periodList: state.periodList.map((value, index) =>
          index === state.periodIndex ? getPeriod(state) : value
        ),
      };
    case "addClick":
      return { ...state, periodList: [...state.periodList, getPeriod(state)] };
  }
  return state;
}

export function createAction<T extends keyof ActionType>(type: T, payload: ActionType[T]) {
  return { type: type, payload: payload };
}
