import { useAppDispatch, useAppSelector } from "../redux";
import GridList from "../components/GridList";
import { periodToStr } from "../utils";
import { showStudentScreen, removeStudent } from "./appSlice";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import DCButton from "../components/DCButton";
import SchedulerWorker, { completed } from "../worker";

const schedulerWorker = new SchedulerWorker();

function SchedulerScreen() {
  useEffect(() => window.scrollTo(0, 0), []);
  const dispatch = useAppDispatch();
  const [studentId, setStudentId] = useState(
    useAppSelector((state) => state.app.selectedStudentId)
  );
  const studentList = [...useAppSelector((state) => state.app.students)];
  studentList.sort((a, b) => a.lesson.begin - b.lesson.begin);
  return (
    <div className={styles.formWrapper}>
      <GridList
        className={styles.gridList}
        selectedRow={studentList.findIndex((student) => student.id === studentId)}
        onSelect={(index) => setStudentId(studentList[index]?.id ?? -1)}
        rows={studentList.map((student) => [student.name, periodToStr(student.lesson)])}
        listenOutside={true}
      />
      <div className={styles.flexPanel}>
        <DCButton>Szukaj</DCButton>
        <DCButton onClick={() => dispatch(showStudentScreen(studentId))} disabled={studentId < 0}>
          Edytuj
        </DCButton>
        <DCButton onClick={() => dispatch(removeStudent(studentId))} disabled={studentId < 0}>
          Usuń
        </DCButton>
        <DCButton onClick={() => dispatch(showStudentScreen())}>Dodaj</DCButton>
      </div>
      <button onClick={onClickStart}>Start</button>
      <button onClick={onClickStop}>Stop</button>
      <button onClick={onClickTest}>Test</button>
    </div>
  );
}

const onClickStart = async () => {

};

const onClickStop = async () => {
  console.log('Stop');
  await schedulerWorker.setActive(false);
};

const onClickTest = async () => {
  const status = await schedulerWorker.getStatus();
  console.log(completed(status), status);
};

export default SchedulerScreen;
