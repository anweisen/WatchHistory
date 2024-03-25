import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faLock, faTrashCan, faUser} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useRef, useState} from "react";
import LoginButton from "./account/LoginButton";
import {UserContext} from "../context/UserContext";
import {AppContext} from "../context/AppContext";
import {ModalContext} from "../context/ModalContext";
import SimpleModal from "./SimpleModal";
import LogoutButton from "./account/LogoutButton";
import "./ContextMenu.scss";
import ResetModal from "./ResetModal";

const ContextMenu = () => {

  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const {setItems, writeItemsToCookies} = useContext(AppContext);
  const {openModal, closeModal} = useContext(ModalContext);

  const {loggedIn, name, picture} = useContext(UserContext);

  const ref: any = useRef("contextMenu");

  function useClickOutside(ref: any, onClickOutside: any) {
    useEffect(() => {

      function handleClickOutside(event: { target: any; }) {
        if (ref.current && !ref.current.contains(event.target)) {
          onClickOutside();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };

    }, [ref, onClickOutside]);
  }

  useClickOutside(ref, () => {
    setUtilitiesOpen(false);
  });

  return (
    <div className={"ContextMenu"} ref={ref}>
      <div className={"MainButton"} onClick={() => setUtilitiesOpen(!utilitiesOpen)}>
        {picture && picture !== "" ?
          <img className={"ProfilePicture"} src={picture} alt={""}/>
          : <FontAwesomeIcon icon={faUser}/>}
      </div>
      <div className={`ContextWindow ${utilitiesOpen ? "Visible" : ""}`}>
        {name ? <div>
          <p className={"SignedInAs"}>Signed in as:</p>
          <p className={"UserName"}>{name}</p>
        </div> : <div className={"LoggedOut"}>
          <FontAwesomeIcon icon={faLock}/>
          <p>You're logged out</p>
        </div>}
        <hr/>
        <div className={"Button"} onClick={() => {
          openModal(<ResetModal/>);
        }}>
          <FontAwesomeIcon icon={faTrashCan} className={"ButtonIcon"}/>
          <p className={"ButtonTitle"}>Reset History</p>
        </div>
        <hr/>
        {loggedIn ? (<LogoutButton/>) : (<LoginButton/>)}
      </div>
    </div>
  );
};

export default ContextMenu;