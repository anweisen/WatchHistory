import {useEffect, useState} from "react";
import {TvSeriesDetails} from "../tmdb/types";
import {lookup, lookupRuntime} from "../tmdb/api";
import {encodeItems, formatTime, Item, timesOf, useForceUpdate} from "../utils";
import "./Clock.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShareAlt} from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";

const Clock = ({items}: { items: Item[] }) => {
  const [time, setTime] = useState(0);
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
            if (!series.seasons[i].air_date) continue;
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
      <div className="Title">you've wasted over</div>
      <div className="Main">{formatTime(time)}</div>
      {!finished ? <Loader/> : <>
        <div className="Or">OR</div>
        <div className="Days">{(time / 60 / 24).toFixed(1)} days</div>
        <div className="Wage">{(time / 60 * 12).toLocaleString("en-US", {maximumFractionDigits: 0})}€ at minimum wage</div>
      </>}

      <div className="Share" onClick={event => {
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
      }}><FontAwesomeIcon icon={faShareAlt}/> share your results
      </div>
    </div>
  );
};
export default Clock;