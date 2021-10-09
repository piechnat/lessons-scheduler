import { range, SDate } from "../utils";

type TimePickerProps = {
  time: number;
  onChange: (time: number) => void;
  minHour?: number;
  maxHour?: number;
};

function TimePicker({ time, onChange, minHour = 0, maxHour = 23 }: TimePickerProps) {
  const date = new SDate(time);
  return (
    <>
      <select
        value={date.getHours()}
        onChange={(e) => onChange(date.setHours(parseInt(e.target.value)).getTime())}
      >
        {range(minHour, maxHour).map((value) => (
          <option key={value} value={value}>
            {value.toString().padStart(2, "0")}
          </option>
        ))}
      </select>:
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

export default TimePicker;
