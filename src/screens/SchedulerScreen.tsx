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
  console.log('Start');
  await schedulerWorker.setup(
    '[{"name":"Karolina Żak","lesson":{"begin":346,"length":2},"periods":[{"begin":346,"length":2},{"begin":358,"length":7}]},{"name":"Szymon Cegielski","lesson":{"begin":160,"length":2},"periods":[{"begin":160,"length":3},{"begin":355,"length":2}]},{"name":"Joanna Smakowska","lesson":{"begin":158,"length":2},"periods":[{"begin":158,"length":6},{"begin":354,"length":3}]},{"name":"Michalina Gogola","lesson":{"begin":159,"length":3},"periods":[{"begin":159,"length":5},{"begin":349,"length":5}]},{"name":"Sebastian Łowczyński","lesson":{"begin":354,"length":2},"periods":[{"begin":354,"length":4}]},{"name":"Jakub Jażdżewski","lesson":{"begin":159,"length":2},"periods":[{"begin":159,"length":4},{"begin":166,"length":4}]},{"name":"Gabriel Łopata","lesson":{"begin":162,"length":2},"periods":[{"begin":162,"length":3},{"begin":168,"length":3},{"begin":356,"length":2},{"begin":362,"length":3}]},{"name":"Kacper Grzybowski","lesson":{"begin":163,"length":2},"periods":[{"begin":163,"length":3},{"begin":351,"length":4}]},{"name":"Anna Simchuk","lesson":{"begin":169,"length":2},"periods":[{"begin":169,"length":5}]},{"name":"Oskar Moskwa","lesson":{"begin":159,"length":2},"periods":[{"begin":159,"length":4},{"begin":166,"length":4}]},{"name":"Martyna Sztekiel","lesson":{"begin":356,"length":2},"periods":[{"begin":356,"length":8}]},{"name":"Katarzyna Chojnacka","lesson":{"begin":164,"length":3},"periods":[{"begin":164,"length":5},{"begin":348,"length":5},{"begin":357,"length":5}]},{"name":"Tobiasz Drabik","lesson":{"begin":157,"length":2},"periods":[{"begin":157,"length":4},{"begin":358,"length":4}]},{"name":"Chór","lesson":{"begin":168,"length":1},"periods":[{"begin":168,"length":4}]}]',
  );
  await schedulerWorker.setActive(true);
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
