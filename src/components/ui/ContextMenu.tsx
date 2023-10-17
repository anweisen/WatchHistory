import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useRef, useState} from "react";
import "./ContextMenu.scss"
import LoginButton from "./account/LoginButton";
import {UserContext} from "../context/UserContext";
import {AppContext} from "../context/AppContext";
import {ModalContext} from "../context/ModalContext";
import SimpleModal from "./SimpleModal";

const ContextMenu = () => {

  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const { setItems, writeItemsToCookies } = useContext(AppContext);
  const { openModal, closeModal } = useContext(ModalContext);

  const { name, picture } = useContext(UserContext);

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
      <div className={"ContextMenu"}>
        <div className={"MainButton"} onClick={() => setUtilitiesOpen(!utilitiesOpen) } ref={ref}>
          {picture !== "" && (
              <img className={"ProfilePicture"} src={picture} alt={""}/>
          )}
          {picture === "" && (
              <FontAwesomeIcon icon={faUser} />
          )}
          
        </div>
        <div className={`ContextWindow ${utilitiesOpen ? "Visible" : ""}`}>
          <div>
            <p className={"SignedInAs"}>Signed in as:</p>
            <p className={"UserName"}>{name}</p>
          </div>
          <hr/>
          <div className={"Button"} onClick={() => {
            openModal(
                <SimpleModal title={"Are you sure?"} body={"This will delete all of your current saved history!"} buttons={
                  <div className={"Button Save"} onClick={() => {
                    setItems([]);
                    writeItemsToCookies([]);
                    closeModal();
                  }}><FontAwesomeIcon icon={faCheck}/> Confirm
                  </div>
                } />
            )
          }}>
            <FontAwesomeIcon  icon={faTrash} className={"ButtonIcon"} />
            <p className={"ButtonTitle"}>Reset History</p>
          </div>
          <hr/>
          <LoginButton />
        </div>
      </div>
  );
};

export default ContextMenu;