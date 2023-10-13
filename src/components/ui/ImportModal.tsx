import { faArrowRightArrowLeft, faCheck, faCodeBranch, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { ModalContext } from "./ModalContext";
import "./ImportModal.scss"

const ImportModal = () => {

    var {closeModal} = useContext(ModalContext);

    var [importMethod, setImportMethod] = useState("");

    function changeImportMethod(method: string) {
        if (importMethod === method) {
            // setImportMethod(""); // maybe ig
        } else {
            setImportMethod(method);
        }
    }

    return (
        <div className={"ImportModal AnimatedModalContent DefaultModalContent"}>
            <div className={"ModalTitle"}>Are you sure?</div>
            <div className={"Explanation"}>
                Seems like you have already saved some data in your localstorage.
                Wanna overwrite the old data and replace with the new data or merge both watch histories together?
            </div>
            <div className={"Interact"}>
                <div className={"Button " + (importMethod === "overwrite" ? "Selected" : "")} onClick={() => {
                    changeImportMethod("overwrite");
                }}>
                    <FontAwesomeIcon icon={faArrowRightArrowLeft}/>
                    <div>Overwrite</div>
                </div>
                <div className={"Button " + (importMethod === "merge" ? "Selected" : "")} onClick={() => {
                    changeImportMethod("merge")
                }}>
                    <FontAwesomeIcon icon={faCodeBranch}/>
                    <div>Merge</div>
                </div>
            </div>
            <div className={"Buttons"}>
                <div className={"Button Save" + (importMethod === "" ? " Disabled" : "")}><FontAwesomeIcon icon={faCheck}/> Confirm</div>
                <div className="Button Cancel" onClick={() => closeModal()}><FontAwesomeIcon icon={faReply}/> Cancel</div>
            </div>
        </div>
    );
};

export default ImportModal;