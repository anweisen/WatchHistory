import SimpleModal from "./SimpleModal";
import {useContext, useState} from "react";
import {ModalContext} from "../context/ModalContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import "./WageModal.scss";

const WageModal = ({wage, setWage, currency, setCurrency, defaultWage, defaultCurrency}: {
  wage: number, setWage: (wage: number) => void, currency: string, setCurrency: (currency: string) => void, defaultWage: number, defaultCurrency: string
}) => {
  const {closeModal} = useContext(ModalContext);
  const [localWage, setLocalWage] = useState(wage > 0 ? wage : defaultWage);
  const [localCurrency, setLocalCurrency] = useState(currency ? currency : defaultCurrency);

  return (
    <SimpleModal className={"WageModal"} title={"Set Your Wage"} body={<>
      <div>See what you could've earned in all the time you wasted. <br/> And then cry about it</div>
      <div className={"Inputs"}>
        <div className={"Input"}>
          <label>Income per Hour</label>
          <input type={"number"} placeholder={""} defaultValue={localWage} onChange={(event) => {
            if (event.target.value !== null) {
              const wage: number = parseFloat(event.target.value);
              setLocalWage(isNaN(wage) ? -1 : wage);
            } else {
              setLocalWage(-1);
            }
          }}/>
        </div>
        <div className={"Input"}>
          <label>Currency</label>
          <input type={"text"} className={""} placeholder={""} defaultValue={localCurrency} onChange={(event) => {

            if (event.target.value) {
              setLocalCurrency(event.target.value);
            } else {
              setLocalCurrency(defaultCurrency);
            }

          }}/>
        </div>
      </div>
    </>} buttons={<>
      <div className={"Button Save"} onClick={() => {
        setWage(localWage);
        setCurrency(localCurrency);
        closeModal();
      }}><FontAwesomeIcon icon={faCheck}/> Save
      </div>
      <div className={"Button Remove"} onClick={() => {
        setWage(defaultWage);
        setCurrency(defaultCurrency);
        closeModal();
      }}><FontAwesomeIcon icon={faTrashCan}/> Reset
      </div>
    </>}/>
  );
};

export default WageModal;