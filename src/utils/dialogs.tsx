import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./dialogs.module.scss";

function confirmDialog(
  message: string,
  buttons: [string?, string?] = ["OK", "Anuluj"]
): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div"),
      ANIM_TIME = 200,
      onPopstate = () => ((resolve(false), close())),
      close = () =>
        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(container);
          if (container.parentNode === document.body) document.body.removeChild(container);
          window.removeEventListener("popstate", onPopstate);
        }, ANIM_TIME);
        
    function ConfirmDialog() {
      const [opacity, setOpacity] = useState(0),
        resolveResult = (result: boolean) => ((setOpacity(0), resolve(result), close()));
      useEffect(() => {
        setTimeout(() => setOpacity(1), 50);
      }, []);
      return (
        <div
          className={styles.confirmDialogWrapper}
          style={{ opacity: opacity, transition: "opacity " + ANIM_TIME + "ms ease-in" }}
        >
          <div className={styles.confirmDialog}>
            <div className={styles.message}>{message}</div>
            <div className={styles.btnWrapper}>
              {buttons[1] && <button onClick={() => resolveResult(false)}>{buttons[1]}</button>}
              {buttons[0] && <button onClick={() => resolveResult(true)}>{buttons[0]}</button>}
            </div>
          </div>
        </div>
      );
    }
    document.body.appendChild(container);
    window.addEventListener("popstate", onPopstate);
    ReactDOM.render(<ConfirmDialog />, container);
  });
}

/**************************************************************************************************/

function selectDialog(optionsList: Array<string>, defIndex: number = -1): Promise<number> {
  return new Promise((resolve) => {
    const container = document.createElement("div"),
      ANIM_TIME = 200,
      cancel = () => ((resolve(defIndex), close())),
      close = (delay: number = 0) =>
        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(container);
          if (container.parentNode === document.body) document.body.removeChild(container);
          window.removeEventListener("popstate", cancel);
        }, delay);

    function SelectDialog() {
      let selDlg: HTMLDivElement | null = null;
      const [opacity, setOpacity] = useState(0);
      useEffect(() => {
        setTimeout(() => setOpacity(1), 50);
        if (selDlg) {
          const selected = selDlg.getElementsByClassName(styles.selected)[0];
          if (selected) selected.scrollIntoView({ block: "center" });
        }
      }, [selDlg]);
      return (
        <div
          className={styles.selectDialogWrapper}
          onClick={(e) => selDlg && !selDlg.contains(e.target as Element) && cancel()}
          style={{ opacity: opacity, transition: "opacity " + ANIM_TIME + "ms ease-in" }}
        >
          <div ref={(e) => (selDlg = e)} className={styles.selectDialog}>
            <ul>
              {optionsList.map((item, index) => (
                <li 
                  key={index} 
                  className={index === defIndex ? styles.selected : ""}
                  onClick={() => ((setOpacity(0), resolve(index), close(ANIM_TIME)))}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    document.body.appendChild(container);
    window.addEventListener("popstate", cancel);
    ReactDOM.render(<SelectDialog />, container);
  });
}

/**************************************************************************************************/

function toastNotification(
  message: string,
  duration: number = 3000,
  button?: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const TRUE = "TRUE",
      ID = "toast-notification-container",
      ANIM_TIME = 300,
      container = document.createElement("div"),
      ntfCntr: HTMLElement =
        document.getElementById(ID) ??
        (() => {
          let elm = document.createElement("div");
          elm.setAttribute("id", ID);
          document.body.appendChild(elm);
          return elm;
        })();
    let locked = false;

    function close(res: boolean) {
      if (locked) return;
      locked = true;
      container.removeAttribute("count");
      container.style.bottom = -container.offsetHeight + "px";
      let node = ntfCntr.firstChild,
        pos = 0;
      while (node && node.nodeType === Node.ELEMENT_NODE) {
        const elementNode = node as HTMLElement;
        if (elementNode.getAttribute("count") === TRUE) {
          elementNode.style.bottom = pos + "px";
          pos += elementNode.offsetHeight;
        }
        node = node.nextSibling;
      }
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(container);
        ntfCntr.removeChild(container);
        if (!ntfCntr.hasChildNodes()) document.body.removeChild(ntfCntr);
      }, ANIM_TIME);
      resolve(res === true);
    }

    function dismiss(e: React.SyntheticEvent) {
      if ((e.target as Element).getAttribute("name") !== "button") {
        e.preventDefault();
        close(false);
      }
    }

    function ToastNotification() {
      useEffect(() => {
        Object.assign(container.style, { 
          visibility: "visible",
          transition: "bottom " + ANIM_TIME + "ms", 
          bottom: "-" + container.offsetHeight + "px"
        });
        let node = container,
          pos = 0;
        while ((node = (node.previousSibling as HTMLDivElement))) {
          if (node.getAttribute("count") === TRUE) {
            pos += node.offsetHeight;
          }
        }
        setTimeout(() => (container.style.bottom = pos + "px"), 50);
        setTimeout(close, duration);
      }, []);
      return (
        <div className={styles.toastNotification} onTouchEnd={dismiss} onMouseUp={dismiss}>
          <div className={styles.message}>{message}</div>
          <div className={styles.btnWrapper}>
            {button && <button name="button" onClick={() => close(true)}>{button}</button>}
          </div>
        </div>
      );
    }

    container.className = styles.toastNotificationWrapper;
    container.setAttribute("count", TRUE);
    ntfCntr.appendChild(container);
    ReactDOM.render(<ToastNotification />, container);
  });
}

export { confirmDialog, selectDialog, toastNotification };
