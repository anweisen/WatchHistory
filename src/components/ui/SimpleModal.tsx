import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import {ModalContext} from "../context/ModalContext";
import "./Modal.scss";
import "./SimpleModal.scss";

const SimpleModal = ({className, title, body, buttons}: { className?: string, title: React.ReactNode, body: React.ReactNode, buttons: React.ReactNode }) => {
    const {closeModal} = useContext(ModalContext);
    return (
      <div className={`SimpleModal AnimatedModalContent DefaultModalContent ${className ? className : ""}`}>
        <div className={"ModalWrapper"}>
          <div className={"ModalContent"}>
            <div className={"ModalTitle"}>
              {title}
            </div>
            <div className={"ModalBody"}>
              {body}
            </div>
          </div>
          <div className="Buttons">
            {buttons}
            <div className="Button Cancel" onClick={() => closeModal()}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
          </div>
        </div>
      </div>
    );
  }
;

export default SimpleModal;
