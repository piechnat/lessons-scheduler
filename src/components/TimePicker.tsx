import { ChangeEvent, memo } from "react";
import SDate from "../models/SDate";
import { range } from "../utils";

type TimePickerProps = {
  minHour?: number;
  maxHour?: number;
  time: number;
  onChange: (time: number) => void;
};

const minutesList = range(0, Math.floor(SDate.HOUR) - 1).map((value) => {
  value *= SDate.UNIT;
  return (
    <option key={value} value={value}>
      {value.toString().padStart(2, "0")}
    </option>
  );
});

function TimePicker({ time, onChange, minHour = 0, maxHour = 23 }: TimePickerProps) {
  const date = new SDate(time),
    handleHoursChange = (e: ChangeEvent<HTMLSelectElement>) =>
      onChange(date.setHours(parseInt(e.target.value)).getTime()),
    handleMinutesChange = (e: ChangeEvent<HTMLSelectElement>) =>
      onChange(date.setMinutes(parseInt(e.target.value)).getTime());
  return (
    <>
      <select value={date.getHours()} onChange={handleHoursChange}>
        {range(minHour, maxHour).map((value) => (
          <option key={value} value={value}>
            {value.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      :
      <select value={date.getMinutes()} onChange={handleMinutesChange}>
        {minutesList}
      </select>
    </>
  );
}

export default memo(TimePicker);
