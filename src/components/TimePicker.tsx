import { memo } from "react";
import { range, SDate } from "../utils";

type TimePickerProps = {
  time: number;
  onChange: (time: number) => void;
  hourRange?: [number, number];
};

function TimePicker({ time, onChange, hourRange: [min, max] = [0, 23] }: TimePickerProps) {
  console.log("TimePicker Render " + time);
  const date = new SDate(time);
  return (
    <>
      <select
        value={date.getHours()}
        onChange={(e) => onChange(date.setHours(parseInt(e.target.value)).getTime())}
      >
        {range(min, max).map((value) => (
          <option key={value} value={value}>
            {value.toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      :
      <select
        value={date.getMinutes()}
        onChange={(e) => onChange(date.setMinutes(parseInt(e.target.value)).getTime())}
      >
        {range(0, Math.floor(SDate.HOUR) - 1).map((value) => {
          value *= SDate.UNIT;
          return (
            <option key={value} value={value}>
              {value.toString().padStart(2, "0")}
            </option>
          );
        })}
      </select>
    </>
  );
}

//export default TimePicker;
export default memo(TimePicker, (prevProps, nextProps) => prevProps.time === nextProps.time);
