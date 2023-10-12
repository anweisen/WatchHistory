import React, {useContext} from "react";
import "./Modal.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faReply} from "@fortawesome/free-solid-svg-icons";
import {ModalContext} from "./ModalContext";
import "./SimpleModal.scss"

const SimpleModal = ({title, body, buttons}: { title: React.ReactNode, body: React.ReactNode, buttons: React.ReactNode }) => {

  const { closeModal } = useContext(ModalContext);

        return (
            <div className={"SimpleModal"}>
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
                  <div className="Button Cancel" onClick={() => closeModal()}><FontAwesomeIcon icon={faReply}/> Cancel</div>
                </div>
              </div>
            </div>
        );
    }
;

export default SimpleModal;
