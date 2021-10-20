import { useAppDispatch, useAppSelector } from "../redux";
import GridList from "../components/GridList";
import { periodToStr } from "../utils";
import { showStudentScreen, removeStudent } from "./appSlice";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import DCButton from "../components/DCButton";
import { confirmDialog } from "../utils/dialogs";

import Worker from '../worker';
const instance = new Worker();
const onClick = () => {
  const data = 'Some data';
  return new Promise<string>(async resolve => {
    // Use a web worker to process the data
    const processed = await instance.processData(data);
    resolve(processed);
  });
};

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
        <DCButton onClick={() => onClick().then((value) => confirmDialog(value))}>Szukaj</DCButton>
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
