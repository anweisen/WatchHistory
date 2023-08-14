import "./Clock.scss";
import {Item} from "../App";
import {lookup, useForceUpdate} from "./List";
import {TvSeriesDetails} from "../tmdb/types";
import {formatTime} from "../tmdb/api";
import {useEffect, useState} from "react";

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
      <div className="Wage">{(time / 60 * 12).toLocaleString('en-US', {maximumFractionDigits:0})}€ at minimum wage</div>
    </div>
  );
};
export default Clock;