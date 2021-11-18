import { range } from "../utils";
import SDate from "../models/SDate";

export const DayNameOptions = () => (
  <>
    {SDate.DAY_NAMES.map((name, index) => (
      <option key={index} value={index}>
        {name}
      </option>
    ))}
  </>
);

export const LessonLengthOptions = () => (
  <>
    {range(1, 45 / SDate.UNIT).map((value) => (
      <option key={value} value={value}>
        {value * SDate.UNIT} minut
      </option>
    ))}
  </>
);