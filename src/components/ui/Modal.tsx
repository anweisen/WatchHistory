import React from "react";
import "./Modal.scss";

const Modal = ({visible, children}: { visible: boolean, children: React.ReactNode }) => {
    return (
      <div className={"Modal" + (visible ? " Visible" : "")}>
        {children}
      </div>
    );
  }
;

export default Modal;
