import { useEffect, useState } from "react";
import GridList from "../components/GridList";
import { useAppSelector } from "../redux";
import { UNIT, DAY_NAMES, periodToStr, range } from "../utils";
import Student, { StudentPlane } from "../utils/Student";
import styles from "./styles.module.scss";

function StudentScreen() {
  useEffect(() => window.scrollTo(0, 0), []);
  const student: StudentPlane =
    useAppSelector((state) =>
      state.app.students.find((student) => student.id === state.app.studentId)
    ) ?? new Student().toPlain();

  const [studentName, setStudentName] = useState(student.name);
  const [lessonLength, setlessonLength] = useState(student.lesson.length);
  const [periodList, setPeriodList] = useState(student.periods);
  const [periodIndex, setPeriodIndex] = useState(-1);

  return (
    <div className={styles.formWrapper}>
      <label>
        <span>Imię i nazwisko ucznia</span>
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      </label>
      <label>
        <span>Długość lekcji</span>
        <select value={lessonLength} onChange={(e) => setlessonLength(parseInt(e.target.value))}>
          {range(1, 45 / UNIT).map((value) => (
            <option key={value} value={value}>
              {value * UNIT} minut
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Okresy dostępności ucznia</span>
        <GridList
          className={styles.gridList}
          rows={periodList.map((period) => [periodToStr(period)])}
          selectedRow={periodIndex}
          onSelect={(index) => setPeriodIndex(index)}
        />
      </label>
      <label>
        <button>Edytuj</button>
        <button
          onClick={() => {
            setPeriodList(periodList.filter((period, index) => index !== periodIndex));
            setPeriodIndex(-1);
          }}
        >
          Usuń
        </button>
      </label>
      <label>
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
      <label>
        <button>Dodaj</button>
        <button>Zapisz</button>
      </label>
    </div>
  );
}

export default StudentScreen;
