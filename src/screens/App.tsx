import React from "react";
import SchedulerScreen from "./SchedulerScreen";
import styles from "./App.module.scss";
import { useAppDispatch, useAppSelector } from "../redux";
import StudentScreen from "./StudentScreen";
import { changeScreen, Screen } from "./appSlice";

function App() {
  const dispatch = useAppDispatch();
  const activeScreen = useAppSelector((state) => state.app.activeScreen);
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgFixed}>
        <div className={styles.halfCircle}></div>
        <div className={styles.triangle1}></div>
        <div className={styles.triangle2}></div>
      </div>
      <div className={styles.content}>
        <div>
          <h1 className={styles.title} onClick={() => dispatch(changeScreen(Screen.SCHEDULER))}>
            Lessons Scheduler <span> by Mateusz Piechnat</span>
          </h1>
        </div>
        {(() => {
          switch (activeScreen) {
            case Screen.SCHEDULER:
              return <SchedulerScreen />;
            case Screen.STUDENT:
              return <StudentScreen />;
          }
        })()}
      </div>
    </div>
  );
}

export default App;
