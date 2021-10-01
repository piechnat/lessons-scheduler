import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StudentPlane } from "../utils/Student";
import { SchedulerPlane } from "../utils/Scheduler";
import mainScheduler from "../utils/mainScheduler";

export enum Screen {
  SCHEDULER,
  STUDENT,
}

interface AppState {
  studentId: number;
  activeScreen: Screen;
  students: SchedulerPlane;
}

const initialState: AppState = {
  studentId: -1,
  activeScreen: Screen.SCHEDULER,
  students: mainScheduler.toPlain(),
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeScreen: (state, { payload: newScreen }: PayloadAction<Screen>) => {
      state.activeScreen = newScreen;
    },
    setStudentId: (state, { payload: newId }: PayloadAction<number>) => {
      state.studentId = newId;
    },
    removeStudent: (state) => {
      const removeIndex = state.students.findIndex((student) => student.id === state.studentId);
      if (removeIndex > -1) {
        state.students.splice(removeIndex, 1);
        state.studentId = -1;
      }
    },
    setStudent: (state, { payload: newStudent }: PayloadAction<StudentPlane>) => {
      if (!(newStudent.id > -1)) {
        state.studentId = newStudent.id =
          state.students.reduce<number>((maxId, student) => Math.max(maxId, student.id), -1) + 1;
        state.students.push(newStudent);
      } else {
        state.students.some((student, index) =>
          student.id === newStudent.id ? (state.students[index] = newStudent) : false
        );
      }
    },
  },
});

export const { changeScreen, setStudentId, setStudent, removeStudent } = appSlice.actions;

export default appSlice.reducer;
