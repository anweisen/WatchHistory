import SimpleModal from "./SimpleModal";
import {useContext, useState} from "react";
import {ModalContext} from "../context/ModalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./WageModal.scss";

const WageModal = ({wage, setWage, currency, setCurrency}: {wage: number, setWage: (wage: number) => void, currency: string, setCurrency: (currency: string) => void}) => {

  const {closeModal} = useContext(ModalContext);

  const [localWage, setLocalWage] = useState(wage > 0 ? wage : 12);
  const [localCurrency, setLocalCurrency] = useState(currency ? currency : "€");

  return (
      <SimpleModal className={"WageModal"} title={"Set Your Wage"} body={
        <div className={"ModalBody"}>
          <div>See what you could've earned in all your wasted time. And then cry about it. <br/> <sub>delete values to reset</sub></div>
          <div className={"Inputs"}>
            <div className={"Input"}>
              <label>Income per Hour</label>
              <input type={"number"} placeholder={""} defaultValue={localWage} onChange={(event) => {

                if (event.target.value !== null) {
                  const wage: number = parseFloat(event.target.value);

                  if (!isNaN(wage)) {
                    setLocalWage(wage);
                  } else {
                    setLocalWage(-1);
                  }
                } else {
                  setLocalWage(-1);
                }

              }} />
            </div>
            <div className={"Input"}>
              <label>Currency</label>
              <input type={"text"} className={""} placeholder={""} defaultValue={localCurrency} onChange={(event) => {

                if (event.target.value) {
                  setLocalCurrency(event.target.value);
                } else {
                  setLocalCurrency("€");
                }

              }} />
            </div>
          </div>
        </div>
      } buttons={

        <div className={"Button Save"} onClick={() => {
          setWage(localWage);
          setCurrency(localCurrency);
          closeModal();
        }}><FontAwesomeIcon icon={faCheck}/> Save
        </div>
      } />
  )
}

export default WageModal;