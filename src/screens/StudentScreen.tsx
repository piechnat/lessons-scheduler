import { useEffect, useState } from "react";
import DCButton from "../components/DCButton";
import GridList from "../components/GridList";
import { useAppDispatch, useAppSelector } from "../redux";
import { UNIT, DAY_NAMES, periodToStr, range } from "../utils";
import Period from "../utils/Period";
import Student, { StudentPlane } from "../utils/Student";
import { Screen, setStudent, showSchedulerScreen } from "./appSlice";
import styles from "./styles.module.scss";

function StudentScreen() {
  useEffect(() => window.scrollTo(0, 0), []);
  const dispatch = useAppDispatch();

  const student: StudentPlane =
    useAppSelector((state) =>
      state.app.activeScreen === Screen.STUDENT_EDIT
        ? state.app.students.find((student) => student.id === state.app.selectedStudentId)
        : null
    ) ?? new Student().toPlain();

  const [studentName, setStudentName] = useState(student.name);
  const [lessonLength, setlessonLength] = useState(student.lesson.length);
  const [periodList, setPeriodList] = useState(student.periods);
  const [periodIndex, setPeriodIndex] = useState(-1);

  function loadStudent(): StudentPlane {
    return new Student(
      student.id,
      studentName,
      new Period(student.lesson.begin, lessonLength),
      periodList.map((period) => new Period(period.begin, period.length))
    ).toPlain();
  }

  return (
    <div className={styles.formWrapper}>
      <label className={styles.row}>
        <span>Imię i nazwisko ucznia</span>
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      </label>
      <label className={styles.row}>
        <span>Długość lekcji</span>
        <select value={lessonLength} onChange={(e) => setlessonLength(parseInt(e.target.value))}>
          {range(1, 45 / UNIT).map((value) => (
            <option key={value} value={value}>
              {value * UNIT} minut
            </option>
          ))}
        </select>
      </label>
      <label className={styles.row}>
        <span>Okresy dostępności ucznia</span>
        <GridList
          className={styles.gridList}
          rows={periodList.map((period) => [periodToStr(period)])}
          selectedRow={periodIndex}
          onSelect={(index) => setPeriodIndex(index)}
        />
      </label>
      <div className={styles.row}>
        <DCButton>Edytuj</DCButton>
        <DCButton
          onClick={() => {
            setPeriodList(periodList.filter((period, index) => index !== periodIndex));
            setPeriodIndex(-1);
          }}
        >
          Usuń
        </DCButton>
      </div>
      <label className={styles.row}>
        <span>Dzień tygodnia</span>
        <select>
          {DAY_NAMES.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>
      </label>
      Czas rozpoczęcia Czas zakończenia
      <div className={styles.row}>
        <DCButton>Dodaj</DCButton>
        <DCButton>Zapisz</DCButton>
      </div>
      <div className={styles.buttonPanel}>
        <DCButton onClick={() => dispatch(showSchedulerScreen())}>Anuluj</DCButton>
        <DCButton onClick={() => dispatch(setStudent(loadStudent()))}>
          {student.id > -1 ? "Zapisz" : "Dodaj"}
        </DCButton>
      </div>
    </div>
  );
}

export default StudentScreen;
