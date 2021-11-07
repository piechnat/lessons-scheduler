import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StudentPlane } from "../models/Student";
import { SchedulerPlane } from "../models/Scheduler";
import { DataLoader } from "../utils/DataLoader";
import { Combinations } from "../models/CombinationList";

interface AppState {
  activeScreen: "SCHEDULER" | "STUDENT_ADD" | "STUDENT_EDIT";
  selectedStudentId: number;
  students: SchedulerPlane;
  searchProgress: number;
  selectdCombination: number;
  combinations: Combinations;
}

const initialState: AppState = {
  activeScreen: "SCHEDULER",
  selectedStudentId: -1,
  students: DataLoader.students,
  searchProgress: 0,
  selectdCombination: -1,
  combinations: [],
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
    setSearchProgress: (state, { payload: progress }: PayloadAction<number>) => {
      state.searchProgress = progress;
    },
    setSelectdCombination: (state, { payload: index }: PayloadAction<number>) => {
      state.selectdCombination = index;
    },
    setCombinations: (state, { payload: combinations }: PayloadAction<Combinations>) => {
      state.combinations = combinations;
    },
  },
});

export const {
  showSchedulerScreen,
  showStudentScreen,
  setStudentId,
  setStudent,
  removeStudent,
  setSearchProgress,
  setSelectdCombination,
  setCombinations
} = appSlice.actions;

export default appSlice.reducer;
