import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {faAngleLeft, faUserSecret} from "@fortawesome/free-solid-svg-icons";
import React, {useContext} from "react";
import {ModalContext} from "../context/ModalContext";
import {AppContext} from "../context/AppContext";
import {shareAccount, shareAnonymously} from "../../utils";
import {UserContext} from "../context/UserContext";

const ShareDecisionModal = () => {
  const {closeModal} = useContext(ModalContext);
  const {items} = useContext(AppContext);

  return (
    <div className={"ImportModal AnimatedModalContent DefaultModalContent SimpleModal"}>
      <div className={"ModalTitle"}>How to Share?</div>
      <div className={"Explanation"}>Seems like you haven't created an account</div>
      <div className={"Interact"}>
        <div className={"Button"} onClick={() => undefined}>
          <FontAwesomeIcon icon={faGoogle}/>
          <div>Login</div>
        </div>
        <div className={"Button"} onClick={() => shareAnonymously(items)}>
          <FontAwesomeIcon icon={faUserSecret}/>
          <div>Raw Data</div>
        </div>
      </div>
      <div className={"Buttons"}>
        <div className="Button Cancel" onClick={closeModal}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
      </div>
    </div>
  );
};
export const useShareStrategy = () => {
  const {loggedIn, email} = useContext(UserContext);
  const {openModal} = useContext(ModalContext);

  return loggedIn ? () => shareAccount(email.replace(/@.*$/, "")) : () => openModal(<ShareDecisionModal/>);
};

export default ShareDecisionModal;
