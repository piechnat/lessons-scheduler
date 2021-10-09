import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DCButton from "../components/DCButton";
import GridList from "../components/GridList";
import TimePicker from "../components/LessonTime";
import { useAppDispatch, useAppSelector } from "../redux";
import { periodToStr, range, SDate } from "../utils";
import Period, { PeriodPlane } from "../utils/Period";
import Student from "../utils/Student";
import { setStudent, showSchedulerScreen } from "./appSlice";
import styles from "./styles.module.scss";

type FormFields = {
  studentName: string;
  lessonLength: number;
  periodsList: PeriodPlane[];
};

function StudentScreen() {
  const dispatch = useAppDispatch(),
    defStudent =
      useAppSelector((state) =>
        state.app.activeScreen === "STUDENT_EDIT"
          ? state.app.students.find((student) => student.id === state.app.selectedStudentId)
          : null
      ) ?? new Student().toPlain(),
    [state, _setState] = useState({
      list: defStudent.periods,
      index: -1,
      begin: new SDate(0, 15, 0),
      end: new SDate(0, 16, 0),
    }),
    {
      register,
      handleSubmit,
      setValue,
      getValues,
      trigger,
      formState: { errors, isSubmitted },
    } = useForm<FormFields>();

  const setState = (newState: object) => _setState({ ...state, ...newState }),
    getEditedPeriod = () => ({
      begin: state.begin.getTime(),
      length: state.end.getTime() - state.begin.getTime(),
    }),
    onCancelClick = () => dispatch(showSchedulerScreen()),
    onSubmit = (data: FormFields) => {
      const student = new Student(
        defStudent.id,
        data.studentName,
        new Period(state.list[0].begin, data.lessonLength),
        state.list.map((period) => new Period(period.begin, period.length))
      ).toPlain();
      dispatch(setStudent(student));
    },
    onListSelect = (index: number) => {
      const { begin, length } = state.list[index];
      setState({ index: index, begin: new SDate(begin), end: new SDate(begin + length) });
    },
    onRemoveClick = () =>
      setState({ list: state.list.filter((v, i) => i !== state.index), index: -1 }),
    onSaveClick = () =>
      setState({ list: state.list.map((v, i) => (i === state.index ? getEditedPeriod() : v)) }),
    onAddClick = () => setState({ list: [...state.list, getEditedPeriod()] }),
    onDayChange = (e: ChangeEvent<HTMLSelectElement>) =>
      setState({ begin: state.begin.setDay(parseInt(e.target.value)) }),
    onBeginChange = (date: SDate) => setState({ begin: date }),
    onEndChange = (date: SDate) => setState({ end: date.setDay(state.begin.getDay()) });

  useEffect(() => {
    window.scrollTo(0, 0);
    register("periodsList", {
      required: true,
      validate: (list) => {
        const lessonLength = getValues("lessonLength");
        return list.every((period) => period.length >= lessonLength);
      },
    });
  }, [register, getValues]);
  useEffect(() => {
    setValue("periodsList", state.list);
    isSubmitted && trigger("periodsList");
  }, [setValue, isSubmitted, trigger, state.list]);

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.row}>
        <span>Imię i nazwisko ucznia</span>
        <input {...register("studentName", { required: true })} defaultValue={defStudent.name} />
      </label>
      {errors.studentName && <p className={styles.error}>To pole jest wymagane</p>}
      <label className={styles.row}>
        <span>Długość lekcji</span>
        <select
          {...register("lessonLength", { valueAsNumber: true })}
          defaultValue={defStudent.lesson.length}
        >
          {range(1, 45 / SDate.UNIT).map((value) => (
            <option key={value} value={value}>
              {value * SDate.UNIT} minut
            </option>
          ))}
        </select>
      </label>
      <label className={styles.row}>
        <span>Okresy dostępności ucznia</span>
        <GridList
          className={styles.gridList}
          rows={state.list.map((period) => [periodToStr(period)])}
          selectedRow={state.index}
          onSelect={onListSelect}
        />
      </label>
      {errors.periodsList && <p className={styles.error}>Należy dodać przynajmniej jeden okres</p>}
      <div className={styles.row}>
        <DCButton onClick={onRemoveClick}>Usuń</DCButton>
        <DCButton onClick={onSaveClick}>Zapisz</DCButton>
        <DCButton onClick={onAddClick}>Dodaj</DCButton>
      </div>
      <div className={styles.flexPanel}>
        <label className={styles.row}>
          <span>Dzień</span>
          <select value={state.begin.getDay()} onChange={onDayChange}>
            {SDate.DAY_NAMES.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.row}>
          <span>Rozpoczęcie</span>
          <TimePicker hourRange={[13, 21]} date={state.begin} onChange={onBeginChange} />
        </label>
        <label className={styles.row}>
          <span>Zakończenie</span>
          <TimePicker hourRange={[13, 21]} date={state.end} onChange={onEndChange} />
        </label>
      </div>
      <div className={styles.flexPanel}>
        <DCButton onClick={onCancelClick}>Anuluj</DCButton>
        <DCButton type="submit">{defStudent.id >= 0 ? "Zapisz" : "Dodaj"}</DCButton>
      </div>
    </form>
  );
}

export default StudentScreen;
