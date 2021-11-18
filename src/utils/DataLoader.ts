import { store } from "../redux";
import Scheduler from "../models/Scheduler";

export namespace DataLoader {
  const STUDENTS_ID = "STUDENTS_ID";
  let dataInput: string | null = null;
  if (window.location.search === "?demo") {
    dataInput =
      '[{"name":"Karolina Żak","lesson":{"begin":346,"length":2},"periods":[{"begin":346,"length":2},{"begin":358,"length":7}]},{"name":"Szymon Cegielski","lesson":{"begin":160,"length":2},"periods":[{"begin":160,"length":3},{"begin":355,"length":2}]},{"name":"Joanna Smakowska","lesson":{"begin":158,"length":2},"periods":[{"begin":158,"length":6},{"begin":354,"length":3}]},{"name":"Michalina Gogola","lesson":{"begin":159,"length":3},"periods":[{"begin":159,"length":5},{"begin":349,"length":5}]},{"name":"Sebastian Łowczyński","lesson":{"begin":354,"length":2},"periods":[{"begin":354,"length":4}]},{"name":"Jakub Jażdżewski","lesson":{"begin":159,"length":2},"periods":[{"begin":159,"length":4},{"begin":166,"length":4}]},{"name":"Gabriel Łopata","lesson":{"begin":162,"length":2},"periods":[{"begin":162,"length":3},{"begin":168,"length":3},{"begin":356,"length":2},{"begin":362,"length":3}]},{"name":"Kacper Grzybowski","lesson":{"begin":163,"length":2},"periods":[{"begin":163,"length":3},{"begin":351,"length":4}]},{"name":"Anna Simchuk","lesson":{"begin":169,"length":2},"periods":[{"begin":169,"length":5}]},{"name":"Oskar Moskwa","lesson":{"begin":159,"length":2},"periods":[{"begin":159,"length":4},{"begin":166,"length":4}]},{"name":"Martyna Sztekiel","lesson":{"begin":356,"length":2},"periods":[{"begin":356,"length":8}]},{"name":"Katarzyna Chojnacka","lesson":{"begin":164,"length":3},"periods":[{"begin":164,"length":5},{"begin":348,"length":5},{"begin":357,"length":5}]},{"name":"Tobiasz Drabik","lesson":{"begin":157,"length":2},"periods":[{"begin":157,"length":4},{"begin":358,"length":4}]},{"name":"Chór","lesson":{"begin":168,"length":1},"periods":[{"begin":168,"length":4}]}]';
    window.addEventListener("load", () =>
      window.location.replace(window.location.href.split("?")[0])
    );
  } else {
    dataInput = localStorage.getItem(STUDENTS_ID);
  }
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(STUDENTS_ID, new Scheduler(store.getState().app.students).toString());
  });
  export const students = new Scheduler(dataInput).toPlain();
}
