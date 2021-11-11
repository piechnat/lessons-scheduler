import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import GridList from "../components/GridList";
import DCButton from "../components/DCButton";
import ProgressBar from "../components/ProgressBar";
import { compareByLessonBegin } from "../models/Scheduler";
import { periodToStr } from "../utils";
import { selectDialog } from "../utils/dialogs";
import styles from "./styles.module.scss";
import {
  showStudentScreen,
  removeStudent,
  searchCommand,
  setCombinationIndex,
  setStudentId,
} from "./appSlice";

function SchedulerScreen() {
  useEffect(() => window.scrollTo(0, 0), []);
  const dispatch = useAppDispatch();
  const {
    students: unsortedStudents,
    selectedStudentId: studentId,
    combinations,
    selectdCombinationIndex: combinationIndex,
    searchState,
    searchProgress,
  } = useAppSelector((state) => state.app);
  const students = [...unsortedStudents].sort(compareByLessonBegin);
  function handleSelectCombination() {
    if (combinations.length > 0) {
      selectDialog(
        combinations.map((item) => item[0].toString()),
        combinationIndex
      ).then((index) => {
        if (index > -1) {
          dispatch(setCombinationIndex(index));
        }
      });
    }
  }
  return (
    <div className={styles.formWrapper}>
      <GridList
        className={styles.gridList}
        rows={students.map((student) => [student.name, periodToStr(student.lesson)])}
        selectedRow={students.findIndex((student) => student.id === studentId)}
        onSelect={(index) => dispatch(setStudentId(students[index]?.id ?? -1))}
        listenOutside={true}
      />
      <ProgressBar progress={searchProgress} />
      {combinations.length > 0 && (
        <div className={styles.flexPanel}>
          <DCButton onClick={() => dispatch(setCombinationIndex(combinationIndex - 1))}>
            Poprzedni
          </DCButton>
          <DCButton onClick={handleSelectCombination}>
            Wyniki ({combinationIndex + 1}/{combinations.length})
          </DCButton>
          <DCButton onClick={() => dispatch(setCombinationIndex(combinationIndex + 1))}>
            Następny
          </DCButton>
        </div>
      )}
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
    </div>
  );
}

export default SchedulerScreen;
