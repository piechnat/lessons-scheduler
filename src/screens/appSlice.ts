import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StudentPlane } from "../utils/Student";
import { SchedulerPlane } from "../utils/Scheduler";
import mainScheduler from "../utils/mainScheduler";

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
