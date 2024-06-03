import {faAngleLeft, faCheck, faTrashCan, faTriangleExclamation, faUserSlash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext, useState} from "react";
import {ModalContext} from "../context/ModalContext";
import {AppContext} from "../context/AppContext";
import {UserContext} from "../context/UserContext";
import {fetchUserDelete} from "../../api/api";
import "./ResetModal.scss";

const ResetModal = () => {
  const {setItems, writeItemsToCookies} = useContext(AppContext);
  const {closeModal} = useContext(ModalContext);
  const {loggedIn, deleteJwt} = useContext(UserContext);
  const [deleteAccount, setDeleteAccount] = useState(false);

  return (
    <div className={"ResetModal AnimatedModalContent DefaultModalContent SimpleModal"}>
      <FontAwesomeIcon className={"Icon"} icon={faTriangleExclamation}/>
      <div className={"ModalTitle"}>Are you sure?</div>
      <div className={"Explanation"}>
        The Reset of your stored data is not reversible. <br/> All data will be erased for ever, the Great Reset.
      </div>
      {loggedIn && <div className={"Confirm"} onClick={() => setDeleteAccount(prev => !prev)}>
        <FontAwesomeIcon icon={faUserSlash}/>
        <p>delete your account & data</p>
        <div className={"Status" + (deleteAccount ? " Yes" : "")} key={deleteAccount + ""}>{deleteAccount ? "yes" : "no"}</div>
      </div>}
      <div className={"Buttons"}>
        <div className={"Button Remove"} onClick={() => {
          setItems([]);
          writeItemsToCookies([]);

          if (deleteAccount) {
            fetchUserDelete()
              .catch(console.error)
            deleteJwt();
          }
          closeModal();
        }}><FontAwesomeIcon icon={faTrashCan}/> Reset Data
        </div>
        <div className="Button Cancel" onClick={() => closeModal()}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
      </div>
    </div>
  );
};

export default ResetModal;