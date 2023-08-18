import {faCheck, faCompressAlt, faMinus, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {MovieDetails, TvSeriesDetails} from "../tmdb/types";
import {lookup, lookupRuntime, provideImageUrl} from "../tmdb/api";
import {formatTime, Item, timesOf, useForceUpdate} from "../utils";
import Loader from "./Loader";
import "./Menu.scss";

const setTimes = (plus: boolean, season: number, seasons: number, item: Item) => {
  let times = [...item.times];
  if (times.length <= season) {
    times = Array(seasons);
    for (let i = 0; i < item.times.length; i++)
      times[i] = item.times[i];
  }
  if (plus) times[season] = (times[season] === undefined ? 1 : times[season]) + 1;
  else if (times[season] !== 0) times[season] = (times[season] === undefined ? 1 : times[season]) - 1;
  return {...item, times: times};
};

const Menu = ({item, saveItem, removeItem, cancel}: { item: Item, saveItem: (item: Item) => void, removeItem: (item: Item) => void, cancel: () => void }) => {
  const [state, setState] = useState<Item>(item);
  const [details, setDetails] = useState<TvSeriesDetails | MovieDetails>();
  const [, forceUpdate] = useForceUpdate();

  useEffect(() => {
    setDetails(lookup(item, () => setDetails(lookup(item))));
  }, [item]);

  return (
    <span className="MenuContainer">
      <div className="Menu">
        {details ? <>
          {state.series ? <>
            <div className="Head">
              <img className="Poster" src={provideImageUrl((details as TvSeriesDetails).poster_path)} alt=""/>
              <div className="Info">
                <div className="Name">{(details as TvSeriesDetails).name}</div>
                <div className="OriginalName">{(details as TvSeriesDetails).original_name}</div>
                <div className="Year">{(details as TvSeriesDetails).first_air_date?.substring(0, 4)} - {(details as TvSeriesDetails).last_air_date?.substring(0, 4)}</div>
              </div>
            </div>
            <div className="History">
              <div className="Title">Watch History</div>
              <div className="Seasons">
                {(details as TvSeriesDetails).seasons.map((season, index) => <div key={season.season_number} className="Season">
                  <div className="SeasonStats">
                    <div className="Name">{season.name}</div>
                    <div className="Episodes">{season.episode_count}</div>
                    <div className="Runtime">{formatTime(lookupRuntime((details as TvSeriesDetails), forceUpdate)?.at(index))}</div>
                  </div>
                  <div className="Controls">
                    <div className="Minus"
                         onClick={event => setState(setTimes(false, season.season_number, (details as TvSeriesDetails).number_of_seasons || season.season_number, state))}>
                      <FontAwesomeIcon icon={faMinus}/></div>
                    <div className="Display">{timesOf(state.times[season.season_number])}x</div>
                    <div className="Plus"
                         onClick={event => setState(setTimes(true, season.season_number, (details as TvSeriesDetails).number_of_seasons || season.season_number, state))}>
                      <FontAwesomeIcon icon={faPlus}/></div>
                  </div>
                </div>)}
              </div>
            </div>
          </> : <>
            <div>
              <div className="Name">{}</div>
            </div>
          </>}
          <div className="Buttons">
            <div className="Button Save" onClick={() => saveItem(state)}><FontAwesomeIcon icon={faCheck}/> Save</div>
            <div className="Button Remove" onClick={() => removeItem(state)}><FontAwesomeIcon icon={faTrash}/> Remove</div>
            <div className="Button Cancel" onClick={() => cancel()}><FontAwesomeIcon icon={faCompressAlt}/> Cancel</div>
          </div>
        </> : <>
          <Loader/>
        </>}
      </div>
    </span>
  );
};
export default Menu;