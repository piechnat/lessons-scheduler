import { ChangeEvent, memo, useEffect, useState } from "react";
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

function _Test({ test, callback }: { test: string, callback: () => void }) {
  callback();
  //console.log('Test Render');
  return <>{test}</>;
}
const Test = memo(_Test);

type FormFields = {
  studentName: string;
  lessonLength: number;
  periodsList: PeriodPlane[];
};

function StudentScreen() {
  //console.log('StudentScreen Render');

  const [Error, handleSubmit1] = useFormError((s) => <p style={{color:"blue"}}>{s}</p>);

  const {
      register,
      handleSubmit,
      setValue,
      getValues,
      trigger,
      formState: { errors, isSubmitted },
    } = useForm<FormFields>(),
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
      test: "dupaTEST"
    }),
    dispatch = useAppDispatch();

  const setState = (newState: object) => _setState({ ...state, ...newState }),
    FormError = ({ name, message }: { name: string; message?: string }) => {
      const error = (errors as any)?.[name];
      return error ? <p className={styles.error}>{message ?? error.message}</p> : null;
    },
    getEditedPeriod = () => ({
      begin: state.begin.getTime(),
      length: state.end.getTime() - state.begin.getTime(),
    }),
    onListSelect = (index: number) => {
      const { begin, length } = state.list[index];
      setState({ index: index/*, begin: new SDate(begin), end: new SDate(begin + length)*/ });
    },
    onRemoveClick = () =>
      setState({ list: state.list.filter((v, i) => i !== state.index), index: -1 }),
    onSaveClick = () =>
      setState({ list: state.list.map((v, i) => (i === state.index ? getEditedPeriod() : v)) }),
    onAddClick = () => setState({ list: [...state.list, getEditedPeriod()] }),
    onDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const day = parseInt(e.target.value) || 0;
      setState({ begin: state.begin.clone().setDay(day), end: state.end.clone().setDay(day) });
    },
    onBeginChange = (time: number) => setState({ begin: new SDate(time) }),
    onEndChange = (time: number) => setState({ end: new SDate(time) }),
    onCancelClick = () => dispatch(showSchedulerScreen()),
    onSubmit = (data: FormFields) => {
      const student = new Student(
        defStudent.id,
        data.studentName,
        new Period(state.list[0].begin, data.lessonLength),
        state.list.map((period) => new Period(period.begin, period.length))
      ).toPlain();
      dispatch(setStudent(student));
    };

  useEffect(() => {
    window.scrollTo(0, 0);
    register("periodsList", {
      required: "Należy dodać przynajmniej jeden okres",
      validate: (list) => {
        const lessonLength = getValues("lessonLength"),
          success = list.every((period) => period.length >= lessonLength);
        return success || "Żaden okres nie może być krótszy niż długość lekcji";
      },
    });
  }, [register, getValues]);

  useEffect(() => {
    setValue("periodsList", state.list);
    isSubmitted && trigger("periodsList");
  }, [setValue, isSubmitted, trigger, state.list]);

  const callback = ()=>{};

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit1()}>
      <Test test={state.test} callback={callback} />
      <label className={styles.row}>
        <span>Imię i nazwisko ucznia</span>
        <input {...register("studentName", { required: true })} defaultValue={defStudent.name} />
      </label>
      <Error variable={state.index} check={(v) => v > 1 ? "dupa" : true} />
      <FormError name="studentName" message="To pole jest wymagane" />
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
      <FormError name="periodsList" />
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
          <TimePicker hourRange={[13, 21]} time={state.begin.getTime()} onChange={onBeginChange} />
        </label>
        <label className={styles.row}>
          <span>Zakończenie</span>
          <TimePicker hourRange={[13, 21]} time={state.end.getTime()} onChange={onEndChange} />
        </label>
      </div>
      <div className={styles.flexPanel}>
        <DCButton onClick={onCancelClick}>Anuluj</DCButton>
        <DCButton type="submit">{defStudent.id >= 0 ? "Zapisz" : "Dodaj"}</DCButton>
      </div>
      <Test test={state.test} callback={callback} />
    </form>
  );
}

export default StudentScreen;
