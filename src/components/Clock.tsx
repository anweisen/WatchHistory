import {useEffect, useState} from "react";
import {TvSeriesDetails} from "../tmdb/types";
import {encodeItems, formatTime, Item} from "../utils";
import {lookup, useForceUpdate} from "./List";
import "./Clock.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShareAlt} from "@fortawesome/free-solid-svg-icons";

const Clock = ({items}: { items: Item[] }) => {
  const [time, setTime] = useState(0);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setTime(items
      .map(value => ({item: value, details: lookup(value, forceUpdate)}))
      .filter(({item, details}) => details !== undefined)
      .map(({item, details}) => {
        if (item.series) {
          const series = details as TvSeriesDetails;
          if (series.episode_run_time.length === 0) return 0;
          let runtime = 0;
          for (let season of series.seasons) {
            runtime += (item.times[season.season_number] === undefined ? 1 : item.times[season.season_number])
              * series.episode_run_time[0] * season.episode_count;
          }
          return runtime;
        } else {
          return 1;
        }
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0));
  });

  return (
    <div className="Clock">
      <div className="Title">you've wasted over</div>
      <div className="Main">{formatTime(time)}</div>
      <div className="Or">OR</div>
      <div className="Days">{(time / 60 / 24).toFixed(1)} days</div>
      <div className="Wage">{(time / 60 * 12).toLocaleString("en-US", {maximumFractionDigits: 0})}€ at minimum wage</div>
      <div className="Share" onClick={event => {
        const url = `https://watched.anweisen.net?${encodeItems(items)}`;

        const mobileAndTabletCheck = function () {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };

        if (navigator.share && mobileAndTabletCheck()) {
          navigator.share({
            title: "time wasted watching",
            text: "i got " + formatTime(time),
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