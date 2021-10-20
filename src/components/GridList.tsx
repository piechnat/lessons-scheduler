import { memo, useEffect, useRef } from "react";
import styles from "./GridList.module.scss";

type GridProps = {
  className?: string;
  rows: Array<Array<string>>;
  selectedRow: number;
  onSelect: (index: number) => void;
  listenOutside?: boolean;
  [propName: string]: any;
};

function GridList({ className, rows, selectedRow, onSelect, listenOutside, ...rest }: GridProps) {
  const schedulerScreen = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listenOutside) {
      const root = document.getElementById("root");
      let timeout: NodeJS.Timeout;
      const clickOutsideHandler = (e: any) => {
        const elm = schedulerScreen.current;
        if (root && root.contains(e.target) && elm && !elm.contains(e.target)) {
          timeout = setTimeout(() => onSelect(-1), 200);
        }
      };
      document.addEventListener("click", clickOutsideHandler);
      return () => {
        clearTimeout(timeout);
        document.removeEventListener("click", clickOutsideHandler);
      }
    }
  }, [onSelect, listenOutside]);
  return (
    <div {...rest} ref={schedulerScreen} className={styles.gridList + " " + className}>
      <table>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={selectedRow === i ? "selected" : ""} onClick={() => onSelect(i)}>
              {row.map((col, j) => (
                <td key={j}>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(GridList);
