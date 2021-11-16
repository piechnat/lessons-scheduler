import styles from "./ProgressBar.module.scss";

function ProgressBar({ progress = -1, working = false }: { progress?: number; working?: boolean }) {
  const width = Math.round(Math.max(0, progress) * 100) + "%";
  const striped = working && progress > 0 && progress < 1 ? styles.striped : "";
  const hidden = !working && progress === -1 ? styles.hidden : "";
  return (
    <div className={styles.wrapper + " " + hidden}>
      <div className={styles.caption}>{progress >= 0 ? width : ""}</div>
      <div className={styles.indicator + " " + striped} style={{ width: width }}></div>
    </div>
  );
}

export default ProgressBar;
