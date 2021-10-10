import { range, SDate } from "../utils";

type TimePickerProps = {
  date: SDate;
  onChange: (date: SDate) => void;
  hourRange?: [number, number];
};

function TimePicker({ date, onChange, hourRange: [min, max] = [0, 23] }: TimePickerProps) {
  return (
    <>
      <select
        value={date.getHours()}
        onChange={(e) => onChange(date.setHours(parseInt(e.target.value)))}
      >
        {range(min, max).map((value) => (
          <option key={value} value={value}>
            {value.toString().padStart(2, "0")}
          </option>
        ))}
      </select>:
      <select
        value={date.getMinutes()}
        onChange={(e) => onChange(date.setMinutes(parseInt(e.target.value)))}
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
