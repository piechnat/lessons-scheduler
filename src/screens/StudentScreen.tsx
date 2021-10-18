import { useCallback, useEffect, useMemo, useReducer } from "react";
import DCButton from "../components/DCButton";
import useFormError from "../components/FormError";
import GridList from "../components/GridList";
import TimePicker from "../components/TimePicker";
import { useAppDispatch, useAppSelector } from "../redux";
import { periodToStr, range, SDate } from "../utils";
import Period, { PeriodPlane } from "../utils/Period";
import Student from "../utils/Student";
import { setStudent, showSchedulerScreen } from "./appSlice";
import studentScreenReducer, { createAction as action } from "./studentScreenReducer";
import styles from "./styles.module.scss";

const dayNameList = SDate.DAY_NAMES.map((name, index) => (
    <option key={index} value={index}>
      {name}
    </option>
  )),
  lessonLengthList = range(1, 45 / SDate.UNIT).map((value) => (
    <option key={value} value={value}>
      {value * SDate.UNIT} minut
    </option>
  ));

function StudentScreen() {
  const dispatch = useAppDispatch(),
    { FormError, handleSubmit } = useFormError((s) => <p className={styles.error}>{s}</p>),
    defStudent =
      useAppSelector((state) =>
        state.app.activeScreen === "STUDENT_EDIT"
          ? state.app.students.find((student) => student.id === state.app.selectedStudentId)
          : null
      ) ?? new Student().toPlain(),
    [state, send] = useReducer(studentScreenReducer, {
      studentName: defStudent.name,
      lessonLength: defStudent.lesson.length,
      periodList: defStudent.periods,
      periodIndex: -1,
      periodBegin: new SDate(0, 15, 0),
      periodEnd: new SDate(0, 16, 0),
    }),
    onSubmit = (isValid: boolean) => {
      if (isValid) {
        const student = new Student(
          defStudent.id,
          state.studentName,
          new Period(state.periodList[0].begin, state.lessonLength),
          state.periodList.map((period) => new Period(period.begin, period.length))
        ).toPlain();
        dispatch(setStudent(student));
      }
    },
    validateName = (name: string) => name.length > 0 || "To pole nie może być puste",
    validateList = (list: Array<PeriodPlane>) => {
      if (list.length <= 0) {
        return "Należy dodać przynajmniej jeden okres";
      }
      return (
        list.every((period) => period.length >= state.lessonLength) ||
        "Żaden okres nie może być krótszy niż długość lekcji"
      );
    };

  useEffect(() => window.scrollTo(0, 0), []);
  console.log("StudentScreen Render");
  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.row}>
        <span>Imię i nazwisko ucznia</span>
        <input
          value={state.studentName}
          onChange={(e) => send(action("studentNameChange", e.target.value))}
        />
      </label>
      <FormError variable={state.studentName} check={validateName} />
      <label className={styles.row}>
        <span>Długość lekcji</span>
        <select
          value={state.lessonLength}
          onChange={(e) => send(action("lessonLengthChange", parseInt(e.target.value)))}
        >
          {lessonLengthList}
        </select>
      </label>
      <label className={styles.row}>
        <span>Okresy dostępności ucznia</span>
        <GridList
          className={styles.gridList}
          rows={useMemo(() => state.periodList.map((v) => [periodToStr(v)]), [state.periodList])}
          selectedRow={state.periodIndex}
          onSelect={useCallback((index) => send(action("periodListSelect", index)), [])}
        />
      </label>
      <FormError variable={state.periodList} check={validateList} />
      <div className={styles.row}>
        <DCButton onClick={() => send(action("removeClick", null))}>Usuń</DCButton>
        <DCButton onClick={() => send(action("saveClick", null))}>Zapisz</DCButton>
        <DCButton onClick={() => send(action("addClick", null))}>Dodaj</DCButton>
      </div>
      <div className={styles.flexPanel}>
        <label className={styles.row}>
          <span>Dzień</span>
          <select
            value={state.periodBegin.getDay()}
            onChange={(e) => send(action("periodDayChange", parseInt(e.target.value)))}
          >
            {dayNameList}
          </select>
        </label>
        <label className={styles.row}>
          <span>Rozpoczęcie</span>
          <TimePicker
            min={13}
            max={21}
            time={state.periodBegin.getTime()}
            onChange={useCallback((time) => send(action("periodBeginChange", time)), [])}
          />
        </label>
        <label className={styles.row}>
          <span>Zakończenie</span>
          <TimePicker
            min={13}
            max={21}
            time={state.periodEnd.getTime()}
            onChange={useCallback((time) => send(action("periodEndChange", time)), [])}
          />
        </label>
      </div>
      <div className={styles.flexPanel}>
        <DCButton onClick={() => dispatch(showSchedulerScreen())}>Anuluj</DCButton>
        <DCButton type="submit">{defStudent.id >= 0 ? "Zapisz" : "Dodaj"}</DCButton>
      </div>
    </form>
  );
}

export default StudentScreen;
