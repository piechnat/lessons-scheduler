import { useAppDispatch, useAppSelector } from "../redux";
import GridList from "../components/GridList";
import { periodToStr } from "../utils";
import { showStudentScreen, removeStudent } from "./appSlice";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import DCButton from "../components/DCButton";
import { compareByLessonBegin } from "../utils/Scheduler";
import ProgressBar from "../components/ProgressBar";
import { searchController } from "../worker/searchController";

function SchedulerScreen() {
  useEffect(() => window.scrollTo(0, 0), []);
  const dispatch = useAppDispatch();
  const [studentId, setStudentId] = useState(
    useAppSelector((state) => state.app.selectedStudentId)
  );
  const studentList = [...useAppSelector((state) => state.app.students)];
  studentList.sort(compareByLessonBegin);
  const [searchProgress, selectdCombination, combinations] = useAppSelector((state) => [
    state.app.searchProgress, state.app.selectdCombination, state.app.combinations
  ]);
  return (
    <div className={styles.formWrapper}>
      <GridList
        className={styles.gridList}
        selectedRow={studentList.findIndex((student) => student.id === studentId)}
        onSelect={(index) => setStudentId(studentList[index]?.id ?? -1)}
        rows={studentList.map((student) => [student.name, periodToStr(student.lesson)])}
        listenOutside={true}
      />
      <ProgressBar progress={searchProgress} />
      <div className={styles.flexPanel}>
        <DCButton onClick={() => searchController.start()}>Szukaj</DCButton>
        <DCButton onClick={() => dispatch(showStudentScreen(studentId))} disabled={studentId < 0}>
          Edytuj
        </DCButton>
        <DCButton onClick={() => dispatch(removeStudent(studentId))} disabled={studentId < 0}>
          Usuń
        </DCButton>
        <DCButton onClick={() => dispatch(showStudentScreen())}>Dodaj</DCButton>
      </div>
      <GridList rows={combinations} selectedRow={selectdCombination} onSelect={(index) => index} />
    </div>
  );
}

export default SchedulerScreen;
