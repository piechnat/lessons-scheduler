import { useAppDispatch, useAppSelector } from "../redux";
import GridList from "../components/GridList";
import { periodToStr } from "../utils";
import { showStudentScreen, removeStudent, searchCommand, setSelectdCombination } from "./appSlice";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import DCButton from "../components/DCButton";
import { compareByLessonBegin } from "../models/Scheduler";
import ProgressBar from "../components/ProgressBar";

function SchedulerScreen() {
  useEffect(() => window.scrollTo(0, 0), []);
  const dispatch = useAppDispatch();
  const [studentId, setStudentId] = useState(
    useAppSelector((state) => state.app.selectedStudentId)
  );
  const [studentList, searchState, searchProgress, selectdCombination, combinations] =
    useAppSelector((state) => [
      [...state.app.students],
      state.app.searchState,
      state.app.searchProgress,
      state.app.selectdCombination,
      state.app.combinations,
    ]);
  studentList.sort(compareByLessonBegin);
  return (
    <div className={styles.formWrapper}>
      <GridList
        className={styles.gridList}
        rows={studentList.map((student) => [student.name, periodToStr(student.lesson)])}
        selectedRow={studentList.findIndex((student) => student.id === studentId)}
        onSelect={(index) => setStudentId(studentList[index]?.id ?? -1)}
        listenOutside={true}
      />
      <ProgressBar progress={searchProgress} />
      <div className={styles.flexPanel}>
        <DCButton onClick={() => dispatch(searchCommand("TOGGLE"))}>
          {searchState === "RESET" ? "Szukaj" : searchState === "START" ? "Zatrzymaj" : "Wznów"}
        </DCButton>
        <DCButton onClick={() => dispatch(showStudentScreen(studentId))} disabled={studentId < 0}>
          Edytuj
        </DCButton>
        <DCButton onClick={() => dispatch(removeStudent(studentId))} disabled={studentId < 0}>
          Usuń
        </DCButton>
        <DCButton onClick={() => dispatch(showStudentScreen())}>Dodaj</DCButton>
      </div>
      <GridList
        className={styles.gridList}
        rows={combinations}
        selectedRow={selectdCombination}
        onSelect={(index) => dispatch(setSelectdCombination(index))}
      />
    </div>
  );
}

export default SchedulerScreen;
