import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DCButton from "../components/DCButton";
import GridList from "../components/GridList";
import TimePicker from "../components/LessonTime";
import { useAppDispatch, useAppSelector } from "../redux";
import { periodToStr, range, SDate } from "../utils";
import Period from "../utils/Period";
import Student, { StudentPlane } from "../utils/Student";
import { setStudent, showSchedulerScreen } from "./appSlice";
import styles from "./styles.module.scss";

function StudentScreen() {
  const dispatch = useAppDispatch();

  const defStudent: StudentPlane =
    useAppSelector((state) =>
      state.app.activeScreen === "STUDENT_EDIT"
        ? state.app.students.find((student) => student.id === state.app.selectedStudentId)
        : null
    ) ?? new Student().toPlain();

  const [state, _setState] = useState({ list: defStudent.periods, index: -1, begin: 0, end: 0 });
  const setState = (newState: object) => _setState({ ...state, ...newState });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
    register("periodsList", { required: true });
  }, [register]);

  useEffect(() => setValue("periodsList", state.list), [setValue, state.list]);

  function onSubmit(data: any) {
    const student = new Student(
      defStudent.id,
      data.studentName,
      new Period(defStudent.lesson.begin, data.lessonLength),
      state.list.map((period) => new Period(period.begin, period.length))
    ).toPlain();
    dispatch(setStudent(student));
  }

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
      <label className={styles.row}>
        <span>Imię i nazwisko ucznia</span>
        <input {...register("studentName", { required: true })} defaultValue={defStudent.name} />
      </label>
      {errors.studentName && <p className={styles.error}>To pole jest wymagane</p>}

      <label className={styles.row}>
        <span>Długość lekcji</span>
        <select {...register("lessonLength")} defaultValue={defStudent.lesson.length}>
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
          onSelect={(index) => {
            const { begin, length } = state.list[index];
            setState({ index: index, begin: begin, end: begin + length });
          }}
        />
      </label>
      {errors.periodList && <p className={styles.error}>Należy dodać przynajmniej jeden okres</p>}

      <div className={styles.row}>
        <DCButton
          onClick={() => {
            setState({
              index: -1,
              list: state.list.filter((period, index) => index !== state.index),
            });
          }}
        >
          Usuń
        </DCButton>
        <DCButton
          onClick={() => {
            const end = new SDate(state.end).setDay(new SDate(state.begin).getDay()).getTime();
            const newPeriod = { begin: state.begin, length: end - state.begin };
            setState({
              list: state.list.map((period, index) => index === state.index ? newPeriod : period),
              end: end,
            });
          }}
        >
          Zapisz
        </DCButton>
        <DCButton
          onClick={() => {
            const end = new SDate(state.end).setDay(new SDate(state.begin).getDay()).getTime();
            setState({
              list: [...state.list, { begin: state.begin, length: end - state.begin }],
              end: end,
            });
          }}
        >
          Dodaj
        </DCButton>
      </div>

      <div className={styles.flexPanel}>
        <label className={styles.row}>
          <span>Dzień</span>
          <select
            value={new SDate(state.begin).getDay()}
            onChange={(e) =>
              setState({
                begin: new SDate(state.begin).setDay(parseInt(e.target.value)).getTime(),
              })
            }
          >
            {SDate.DAY_NAMES.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.row}>
          <span>Rozpoczęcie</span>
          <TimePicker
            minHour={13}
            maxHour={21}
            time={state.begin}
            onChange={(time) => setState({ begin: time })}
          />
        </label>
        <label className={styles.row}>
          <span>Zakończenie</span>
          <TimePicker
            minHour={13}
            maxHour={21}
            time={state.end}
            onChange={(time) => setState({ end: time })}
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
