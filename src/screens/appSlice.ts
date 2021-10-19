import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StudentPlane } from "../utils/Student";
import Scheduler, { SchedulerPlane } from "../utils/Scheduler";
import { store } from "../redux";

const mainScheduler = ((storageId: string) => {
  let scheduler: Scheduler;
  if (window.location.search === "?demo") {
    scheduler = new Scheduler(
      '[{"name":"Karolina Żak","lesson":{"begin":346,"length":2},"periods":[{"begin":346,"length":2},{"begin":358,"length":7}]},{"name":"Szymon Cegielski","lesson":{"begin":160,"length":2},"periods":[{"begin":160,"length":3},{"begin":355,"length":2}]},{"name":"Joanna Smakowska","lesson":{"begin":158,"length":2},"periods":[{"begin":158,"length":6},{"begin":354,"length":3}]},{"name":"Michalina Gogola","lesson":{"begin":159,"length":3},"periods":[{"begin":159,"length":5},{"begin":349,"length":5}]},{"name":"Sebastian Łowczyński","lesson":{"begin":354,"length":2},"periods":[{"begin":354,"length":4}]},{"name":"Jakub Jażdżewski","lesson":{"begin":159,"length":2},"periods":[{"begin":159,"length":4},{"begin":166,"length":4}]},{"name":"Gabriel Łopata","lesson":{"begin":162,"length":2},"periods":[{"begin":162,"length":3},{"begin":168,"length":3},{"begin":356,"length":2},{"begin":362,"length":3}]},{"name":"Kacper Grzybowski","lesson":{"begin":163,"length":2},"periods":[{"begin":163,"length":3},{"begin":351,"length":4}]},{"name":"Anna Simchuk","lesson":{"begin":169,"length":2},"periods":[{"begin":169,"length":5}]},{"name":"Oskar Moskwa","lesson":{"begin":159,"length":2},"periods":[{"begin":159,"length":4},{"begin":166,"length":4}]},{"name":"Martyna Sztekiel","lesson":{"begin":356,"length":2},"periods":[{"begin":356,"length":8}]},{"name":"Katarzyna Chojnacka","lesson":{"begin":164,"length":3},"periods":[{"begin":164,"length":5},{"begin":348,"length":5},{"begin":357,"length":5}]},{"name":"Tobiasz Drabik","lesson":{"begin":157,"length":2},"periods":[{"begin":157,"length":4},{"begin":358,"length":4}]},{"name":"Chór","lesson":{"begin":168,"length":1},"periods":[{"begin":168,"length":4}]}]'
    );
    window.addEventListener("load", () =>
      window.location.replace(window.location.href.split("?")[0])
    );
  } else {
    scheduler = new Scheduler(localStorage.getItem(storageId));
  }
  window.addEventListener("beforeunload", () => {
    scheduler.assign(store.getState().app.students);
    localStorage.setItem(storageId, scheduler.toString());
  });
  return scheduler;
})("mainScheduler");

interface AppState {
  selectedStudentId: number;
  activeScreen: "SCHEDULER" | "STUDENT_ADD" | "STUDENT_EDIT";
  students: SchedulerPlane;
}

const initialState: AppState = {
  selectedStudentId: -1,
  activeScreen: "SCHEDULER",
  students: mainScheduler.toPlain(),
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    showSchedulerScreen: (state) => {
      state.activeScreen = "SCHEDULER";
    },
    showStudentScreen: (state, { payload: studentId = -1 }: PayloadAction<number | undefined>) => {
      if (studentId > -1) {
        state.selectedStudentId = studentId;
        state.activeScreen = "STUDENT_EDIT";
      } else {
        state.activeScreen = "STUDENT_ADD";
      }
    },
    setStudentId: (state, { payload: newId }: PayloadAction<number>) => {
      state.selectedStudentId = newId;
    },
    removeStudent: (state, { payload: studentId }: PayloadAction<number | undefined>) => {
      studentId = studentId ?? state.selectedStudentId;
      const removeIndex = state.students.findIndex((student) => student.id === studentId);
      if (removeIndex > -1) {
        state.students.splice(removeIndex, 1);
        state.selectedStudentId = -1;
      }
    },
    setStudent: (state, { payload: newStudent }: PayloadAction<StudentPlane>) => {
      let success = false;
      if (!(newStudent.id > -1)) {
        state.selectedStudentId = newStudent.id =
          state.students.reduce<number>((maxId, student) => Math.max(maxId, student.id), -1) + 1;
        state.students.push(newStudent);
        success = true;
      } else {
        success = state.students.some((student, index) =>
          student.id === newStudent.id ? (state.students[index] = newStudent) : false
        );
      }
      if (success) {
        state.activeScreen = "SCHEDULER";
      }
    },
  },
});

export const { showSchedulerScreen, showStudentScreen, setStudentId, setStudent, removeStudent } =
  appSlice.actions;

export default appSlice.reducer;
