import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faShareAlt} from "@fortawesome/free-solid-svg-icons";
import React, {useContext} from "react";
import {formatTime, Item, shareHistory} from "../../utils";
import ImportModal from "../ui/ImportModal";
import {ModalContext} from "../context/ModalContext";
import {AppContext} from "../context/AppContext";
import WageModal from "../ui/WageModal";
import Loader from "../Loader";
import "./OgClock.scss";

const OgClock = ({items, time, finished, wage, setWage, currency, setCurrency}: {
  items: Item[],
  time: number,
  finished: boolean,
  wage: number,
  setWage: (v: number) => void,
  currency: string,
  setCurrency: (v: string) => void
}) => {
  const {openModal, closeModal} = useContext(ModalContext);
  const {isSharedData} = useContext(AppContext);

  return (
    <div className={"OgClock" + (!finished ? " Loading" : "")}>
      <div>
        <div className={"TitleWrapper"}>
          {isSharedData && <div className={"TitleNotice"} onClick={() => window.location.href = window.location.origin}>this could be you</div>}
          <div className="Title">{isSharedData ? "⤿ someone" : "you've"} wasted over</div>
        </div>
        <div className="Main">{formatTime(time)}</div>
        {!finished ? <Loader/> : <>
          <div className="Or">OR</div>
          <div className="Days">{(time / 60 / 24).toFixed(1)} days</div>
          <div className="Wage">
            <div className={"WageEarned"}>{(time / 60 * (wage <= 0 ? 12 : wage)).toLocaleString("en-US", {maximumFractionDigits: 0})}{currency}</div>
            <div onClick={() => {
              openModal(<WageModal wage={wage} setWage={setWage} currency={currency} setCurrency={setCurrency} defaultCurrency={"€"}
                                   defaultWage={12}/>);
            }} className={"WageAmount"}>at {wage <= 0 ? "minimum wage" : wage + currency + "/h"}</div>
          </div>
        </>}
      </div>

      <div className={"ButtonWrapper"}>
        {!isSharedData ?
          <div className="Button" onClick={() => shareHistory(items)}><FontAwesomeIcon icon={faShareAlt}/> share your history</div>
          :
          <div className="Button" onClick={() => openModal(<ImportModal/>)}>
            <FontAwesomeIcon icon={faDownload}/> import this history
          </div>}
      </div>
    </div>
  );
};
export default OgClock;