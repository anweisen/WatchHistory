import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft, faCodeBranch, faDownload, faReply, faShareAlt} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import {TvSeriesDetails} from "../tmdb/types";
import {lookup, lookupRuntime} from "../tmdb/api";
import {encodeItems, formatTime, Item, timesOf, useForceUpdate} from "../utils";
import Loader from "./Loader";
import "./Clock.scss";
import ImportModal from "./ui/ImportModal";
import { ModalContext } from "./context/ModalContext";
import { AppContext } from "./context/AppContext";

const Clock = ({items}: { items: Item[] }) => {

  const {openModal  } = useContext(ModalContext);
  const { isSharedData } = useContext(AppContext);

  const [time, setTime] = useState(0);
  const [wage, setWage] = useState(-1);
  const [updater, forceUpdate] = useForceUpdate();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let finished = true;
    setTime(items
      .map(value => ({item: value, details: lookup(value, forceUpdate)}))
      .filter(({item, details}) => details !== undefined)
      .map(({item, details}) => {
        if (item.series) {
          const series = details as TvSeriesDetails;
          // if (series.episode_run_time.length === 0) return 0;
          const seasonRuntime = lookupRuntime(series, forceUpdate);
          if (seasonRuntime === undefined) {
            finished = false;
            return 0;
          }
          let runtime = 0;
          for (let i = 0; i < series.seasons.length; i++) {
            // runtime += timesOf(item.times[season.season_number])
            //   * series.episode_run_time[0] * season.episode_count;
            if (!series.seasons[i].air_date || Date.parse(series.seasons[i].air_date) > Date.now()) continue;
            runtime += seasonRuntime[i] * timesOf(item.times[series.seasons[i].season_number]);
          }
          return runtime;
        } else {
          return 0;
        }
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0));
    setFinished(finished);
  }, [items, updater, forceUpdate]);

  return (
    <div className={"Clock" + (!finished ? " Loading" : "")}>
      <div>
        <div className="Title">{isSharedData ? "someone" : "you've"} wasted over</div>
        <div className="Main">{formatTime(time)}</div>
        {!finished ? <Loader/> : <>
          <div className="Or">OR</div>
          <div className="Days">{(time / 60 / 24).toFixed(1)} days</div>
          <div className="Wage">
            <div className={"WageEarned"}>{(time / 60 * (wage <= 0 ? 12 : wage)).toLocaleString("en-US", {maximumFractionDigits: 0})}€</div>
            <div onClick={event => {
              const wageInput: string | null = prompt("Minimum Wage:");

              if (wageInput !== null) {
                const wage: number = parseFloat(wageInput);

                if (!isNaN(wage)) {
                  setWage(wage);
                }
              }

            }} className={"WageAmount"}>at {wage <= 0 ? "minimum wage" : wage + "€/h"}</div>
          </div>
        </>}
      </div>

      <div className={"ButtonWrapper"}>
        {!isSharedData ?
          <div className="Button" onClick={event => {
            const url = `https://watched.anweisen.net?${encodeItems(items)}`;

            if (navigator.share) {
              navigator.share({
                title: formatTime(time) + " wasted",
                text: formatTime(time) + " wasted watching series",
                url: url,
              })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error));
            } else {
              navigator.clipboard.writeText(url)
                .then(() => console.log("Successful copy"))
                .catch((error) => console.log("Error copying", error));
            }
          }}><FontAwesomeIcon icon={faShareAlt}/> share your history
          </div>
          : <div className="Button" onClick={event => openModal(<ImportModal/>)}>
            <FontAwesomeIcon icon={faDownload}/> import this history
          </div>}
      </div>
    </div>
  );
};
export default Clock;