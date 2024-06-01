import {faAngleLeft, faTrashCan, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";
import {ModalContext} from "../context/ModalContext";
import {AppContext} from "../context/AppContext";
import "./ResetModal.scss";

const ResetModal = () => {
  const {closeModal} = useContext(ModalContext);
  const {setItems, writeItemsToCookies} = useContext(AppContext);

  return (
    <div className={"ResetModal AnimatedModalContent DefaultModalContent SimpleModal"}>
      <FontAwesomeIcon className={"Icon"} icon={faTriangleExclamation}/>
      <div className={"ModalTitle"}>Are you sure?</div>
      <div className={"Explanation"}>
        The Reset of your stored data is not reversible. <br/> All data will be erased for ever, the Great Reset.
      </div>
      <div className={"Buttons"}>
        <div className={"Button Remove"} onClick={() => {
          setItems([]);
          writeItemsToCookies([]);
          closeModal();
        }}>
          <FontAwesomeIcon icon={faTrashCan}/> Reset Data
        </div>
        <div className="Button Cancel" onClick={() => closeModal()}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
      </div>
    </div>
  );
};

export default ResetModal;