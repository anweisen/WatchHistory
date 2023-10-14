import {faArrowRightArrowLeft, faCheck, faCodeBranch, faReply} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext, useState} from "react";
import {ModalContext} from "../context/ModalContext";
import "./ImportModal.scss";
import {AppContext} from "../context/AppContext";
import {mergeItemSets} from "../../utils";

const ImportModal = () => {
  const { closeModal } = useContext(ModalContext);
  const { items, setItems, writeItemsToCookies, retrieveItemsFromCookies } = useContext(AppContext);

  const [importMethod, setImportMethod] = useState("");

  function changeImportMethod(method: string) {
    if (importMethod === method) {
      // setImportMethod(""); // maybe ig
    } else {
      setImportMethod(method);
    }
  }

  function confirmClick() {
    closeModal();

    if (importMethod === "merge") {
      // Merge data and replace saved data

      let mergedItems = mergeItemSets(items, retrieveItemsFromCookies());
      writeItemsToCookies(mergedItems);

    } else if (importMethod === "replace") {
      // Replace old data and set new data
      writeItemsToCookies(items);
    }

    window.location.href = window.location.origin;

  }

  // TODO: Check if data exists. If not disable merge button and change text
  return (
    <div className={"ImportModal AnimatedModalContent DefaultModalContent"}>
      <div className={"ModalTitle"}>Are you sure?</div>
      <div className={"Explanation"}>
        Seems like you have already saved some data in your localstorage.
        Wanna delete the old data and replace with the new data or merge both watch histories together?
      </div>
      <div className={"Interact"}>
        <div className={"Button " + (importMethod === "replace" ? "Selected" : "")} onClick={() => {
          changeImportMethod("replace");
        }}>
          <FontAwesomeIcon icon={faArrowRightArrowLeft}/>
          <div>Replace</div>
        </div>
        <div className={"Button " + (importMethod === "merge" ? "Selected" : "")} onClick={() => {
          changeImportMethod("merge");
        }}>
          <FontAwesomeIcon icon={faCodeBranch}/>
          <div>Merge</div>
        </div>
      </div>
      <div className={"Buttons"}>
        <div className={"Button Save" + (importMethod === "" ? " Disabled" : "")} onClick={importMethod !== "" ? () => confirmClick() : () => {
        }}><FontAwesomeIcon icon={faCheck}/> Confirm
        </div>
        <div className="Button Cancel" onClick={() => closeModal()}><FontAwesomeIcon icon={faReply}/> Cancel</div>
      </div>
    </div>
  );
};

export default ImportModal;