import styles from "./ProgressBar.module.scss";

function ProgressBar({ progress = 0 }: { progress?: number }) {
  const width = Math.round(progress * 100) + "%";
  return (
    <div className={styles.wrapper}>
      <div className={styles.indicator} style={{ width: width }}></div>
    </div>
  );
}

export default ProgressBar;
