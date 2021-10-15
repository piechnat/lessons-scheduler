import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
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
  console.log("StudentScreen Render");
  const dispatch = useAppDispatch(),
    defStudent =
      useAppSelector((state) =>
        state.app.activeScreen === "STUDENT_EDIT"
          ? state.app.students.find((student) => student.id === state.app.selectedStudentId)
          : null
      ) ?? new Student().toPlain(),
    initialState = {
      name: defStudent.name,
      length: defStudent.lesson.length,
      list: defStudent.periods,
      index: -1,
      begin: new SDate(0, 15, 0),
      end: new SDate(0, 16, 0),
    },
    [_state, _setState] = useState(initialState),
    setState = useCallback((p: Partial<typeof _state>) => _setState((s) => ({ ...s, ...p })), []),
    editedPeriod = () => ({
      begin: _state.begin.getTime(),
      length: _state.end.getTime() - _state.begin.getTime(),
    }),
    [Error, handleSubmit] = useFormError((s) => <p className={styles.error}>{s}</p>),
    handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setState({ name: e.target.value }),
    handleLengthChange = (e: ChangeEvent<HTMLSelectElement>) =>
      setState({ length: parseInt(e.target.value) }),
    listAsRows = useMemo(() => _state.list.map((period) => [periodToStr(period)]), [_state.list]),
    handleListSelect = useCallback(
      (index: number) => {
        const { begin, length } = _state.list[index];
        setState({ index: index, begin: new SDate(begin), end: new SDate(begin + length) });
      },
      [setState, _state.list]
    ),
    handleRemoveClick = () =>
      setState({ list: _state.list.filter((v, i) => i !== _state.index), index: -1 }),
    handleSaveClick = () =>
      setState({ list: _state.list.map((v, i) => (i === _state.index ? editedPeriod() : v)) }),
    handleAddClick = () => setState({ list: [..._state.list, editedPeriod()] }),
    handleDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const day = parseInt(e.target.value) || 0;
      setState({ begin: _state.begin.clone().setDay(day), end: _state.end.clone().setDay(day) });
    },
    handleBeginChange = useCallback(
      (time: number) => setState({ begin: new SDate(time) }),
      [setState]
    ),
    handleEndChange = (time: number) => setState({ end: new SDate(time) }),
    handleCancelClick = () => dispatch(showSchedulerScreen()),
    onSubmit = () => {
      const student = new Student(
        defStudent.id,
        _state.name,
        new Period(_state.list[0].begin, _state.length),
        _state.list.map((period) => new Period(period.begin, period.length))
      ).toPlain();
      dispatch(setStudent(student));
    },
    validateList = (list: Array<PeriodPlane>) => {
      if (list.length <= 0) {
        return "Należy dodać przynajmniej jeden okres";
      }
      return (
        list.every((period) => period.length >= _state.length) ||
        "Żaden okres nie może być krótszy niż długość lekcji"
      );
    };

  useEffect(() => window.scrollTo(0, 0), []);

  const [state, send] = useReducer(studentScreenReducer, {
    studentName: defStudent.name,
    lessonLength: defStudent.lesson.length,
    periodList: defStudent.periods,
    periodIndex: -1,
    periodBegin: new SDate(0, 15, 0),
    periodEnd: new SDate(0, 16, 0),
  });

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.row}>
        <span>Imię i nazwisko ucznia</span>
        <input
          value={state.studentName}
          onChange={(e) => send(action("studentNameChange", e.target.value))}
        />
      </label>
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
          rows={state.periodList.map((period) => [periodToStr(period)])}
          selectedRow={state.periodIndex}
          onSelect={(index) => send(action("periodIndexChange", index))}
        />
      </label>
      <div className={styles.row}>
        <DCButton onClick={() => send(action("removeClick", null))}>Usuń</DCButton>
        <DCButton onClick={handleSaveClick}>Zapisz</DCButton>
        <DCButton onClick={handleAddClick}>Dodaj</DCButton>
      </div>
      <div className={styles.flexPanel}>
        <label className={styles.row}>
          <span>Dzień</span>
          <select value={_state.begin.getDay()} onChange={handleDayChange}>
            {dayNameList}
          </select>
        </label>
        <label className={styles.row}>
          <span>Rozpoczęcie</span>
          <TimePicker
            min={13}
            max={21}
            time={_state.begin.getTime()}
            onChange={useCallback(handleBeginChange, [setState])}
          />
        </label>
        <label className={styles.row}>
          <span>Zakończenie</span>
          <TimePicker
            min={13}
            max={21}
            time={_state.end.getTime()}
            onChange={useCallback(handleEndChange, [setState])}
          />
        </label>
      </div>
      <div className={styles.flexPanel}>
        <DCButton onClick={handleCancelClick}>Anuluj</DCButton>
        <DCButton type="submit">{defStudent.id >= 0 ? "Zapisz" : "Dodaj"}</DCButton>
      </div>
    </form>
  );
}

export default StudentScreen;
