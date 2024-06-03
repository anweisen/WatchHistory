import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {faAngleLeft, faUserSecret} from "@fortawesome/free-solid-svg-icons";
import {useGoogleLogin} from "@react-oauth/google";
import React, {useContext} from "react";
import {ModalContext} from "../context/ModalContext";
import {AppContext} from "../context/AppContext";
import {UserContext} from "../context/UserContext";
import LoginLoaderOverlay from "./LoginLoaderOverlay";
import {shareAccount, shareAnonymously} from "../../utils";

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

export const useGoogleOauthLogin = () => {
  const {exchangeAuthCode} = useContext(UserContext);
  const {openModal, closeModal} = useContext(ModalContext);
  const {sync} = useContext(AppContext);

  return useGoogleLogin({
    flow: "auth-code",
    onError: errorResponse => {
      console.log(errorResponse);
    },
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      openModal(<LoginLoaderOverlay/>);
      try {
        await exchangeAuthCode(tokenResponse.code);
        await sync();
      } catch (ex) {
        console.error(ex);
      }
      closeModal();
    },
  });
};

export default ShareDecisionModal;
