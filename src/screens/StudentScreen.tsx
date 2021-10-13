import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useMemo, useState } from "react";
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
import styles from "./styles.module.scss";

const LessonLengthList = memo(() => (
  <>
    {range(1, 45 / SDate.UNIT).map((value) => (
      <option key={value} value={value}>
        {value * SDate.UNIT} minut
      </option>
    ))}
  </>
));

const DayNameList = memo(() => (
  <>
    {SDate.DAY_NAMES.map((name, index) => (
      <option key={index} value={index}>
        {name}
      </option>
    ))}
  </>
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
    [state, _setState] = useState({
      name: defStudent.name,
      length: defStudent.lesson.length,
      list: defStudent.periods,
      index: -1,
      begin: new SDate(0, 15, 0),
      end: new SDate(0, 16, 0),
    }),
    setState = useCallback((p: Partial<typeof state>) => _setState((s) => ({ ...s, ...p })), []),
    editedPeriod = () => ({
      begin: state.begin.getTime(),
      length: state.end.getTime() - state.begin.getTime(),
    }),
    [Error, handleSubmit] = useFormError((s) => <p className={styles.error}>{s}</p>),
    handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setState({ name: e.target.value }),
    handleLengthChange = (e: ChangeEvent<HTMLSelectElement>) =>
      setState({ length: parseInt(e.target.value) }),
    listAsRows = useMemo(() => state.list.map((period) => [periodToStr(period)]), [state.list]),
    handleListSelect = useCallback(
      (index: number) => {
        const { begin, length } = state.list[index];
        setState({ index: index, begin: new SDate(begin), end: new SDate(begin + length) });
      },
      [setState, state.list]
    ),
    handleRemoveClick = () =>
      setState({ list: state.list.filter((v, i) => i !== state.index), index: -1 }),
    handleSaveClick = () =>
      setState({ list: state.list.map((v, i) => (i === state.index ? editedPeriod() : v)) }),
    handleAddClick = () => setState({ list: [...state.list, editedPeriod()] }),
    handleDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const day = parseInt(e.target.value) || 0;
      setState({ begin: state.begin.clone().setDay(day), end: state.end.clone().setDay(day) });
    },
    handleBeginChange = useCallback(
      (time: number) => setState({ begin: new SDate(time) }),
      [setState]
    ),
    handleEndChange = useCallback((time: number) => setState({ end: new SDate(time) }), [setState]),
    handleCancelClick = () => dispatch(showSchedulerScreen()),
    onSubmit = () => {
      const student = new Student(
        defStudent.id,
        state.name,
        new Period(state.list[0].begin, state.length),
        state.list.map((period) => new Period(period.begin, period.length))
      ).toPlain();
      dispatch(setStudent(student));
    },
    validateList = (list: Array<PeriodPlane>) => {
      if (list.length <= 0) {
        return "Należy dodać przynajmniej jeden okres";
      }
      return (
        list.every((period) => period.length >= state.length) ||
        "Żaden okres nie może być krótszy niż długość lekcji"
      );
    };

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.row}>
        <span>Imię i nazwisko ucznia</span>
        <input value={state.name} onChange={handleNameChange} />
      </label>
      <label className={styles.row}>
        <span>Długość lekcji</span>
        <select value={state.length} onChange={handleLengthChange}>
          <LessonLengthList />
        </select>
      </label>
      <label className={styles.row}>
        <span>Okresy dostępności ucznia</span>
        <GridList
          className={styles.gridList}
          rows={listAsRows}
          selectedRow={state.index}
          onSelect={handleListSelect}
        />
      </label>
      <div className={styles.row}>
        <DCButton onClick={handleRemoveClick}>Usuń</DCButton>
        <DCButton onClick={handleSaveClick}>Zapisz</DCButton>
        <DCButton onClick={handleAddClick}>Dodaj</DCButton>
      </div>
      <div className={styles.flexPanel}>
        <label className={styles.row}>
          <span>Dzień</span>
          <select value={state.begin.getDay()} onChange={handleDayChange}>
            <DayNameList />
          </select>
        </label>
        <label className={styles.row}>
          <span>Rozpoczęcie</span>
          <TimePicker min={13} max={21} time={state.begin.getTime()} onChange={handleBeginChange} />
        </label>
        <label className={styles.row}>
          <span>Zakończenie</span>
          <TimePicker min={13} max={21} time={state.end.getTime()} onChange={handleEndChange} />
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
