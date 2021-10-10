import { useEffect, useRef } from "react";
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
      const clickOutsideHandler = (e: any) => {
        const elm = schedulerScreen.current;
        if (root && root.contains(e.target) && elm && !elm.contains(e.target)) {
          onSelect(-1);
        }
      };
      document.addEventListener("click", clickOutsideHandler);
      return () => document.removeEventListener("click", clickOutsideHandler);
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

export default GridList;
