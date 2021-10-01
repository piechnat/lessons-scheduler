import { useAppDispatch, useAppSelector } from "../redux";
import GridList from "../components/GridList";
import { periodToStr } from "../utils";
import { changeScreen, removeStudent, Screen, setStudentId } from "./appSlice";
import styles from "./styles.module.scss";
import { useEffect } from "react";

function SchedulerScreen() {
  useEffect(() => window.scrollTo(0, 0), []);
  const dispatch = useAppDispatch();
  const studentId = useAppSelector((state) => state.app.studentId);
  const studentList = [...useAppSelector((state) => state.app.students)];
  studentList.sort((a, b) => a.lesson.begin - b.lesson.begin);
  return (
    <div className={styles.formWrapper}>
      <GridList
        className={styles.gridList}
        selectedRow={studentList.findIndex((student) => student.id === studentId)}
        onSelect={(index) => dispatch(setStudentId(studentList[index]?.id ?? -1))}
        rows={studentList.map((student) => [student.name, periodToStr(student.lesson)])}
        listenOutside={true}
      />
      <div className={styles.buttonPanel}>
        <button>Szukaj</button>
        <button disabled={studentId < 0}>Edytuj</button>
        <button onClick={() => dispatch(removeStudent())} disabled={studentId < 0}>
          Usuń
        </button>
        <button onClick={() => dispatch(changeScreen(Screen.STUDENT))}>Dodaj</button>
      </div>
    </div>
  );
}

export default SchedulerScreen;
