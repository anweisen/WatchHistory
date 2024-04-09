import {faAngleLeft, faCheck, faClock, faMinus, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
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
  if (plus) times[season] = timesOf(times[season]) + 1;
  else if (times[season] !== 0) times[season] = timesOf(times[season]) - 1;
  return {...item, times: times};
};

const Menu = ({item, saveItem, removeItem, cancel, isSharedData}: {
  item: Item,
  saveItem: (item: Item) => void,
  removeItem: (item: Item) => void,
  cancel: () => void,
  isSharedData: boolean
}) => {
  const [state, setState] = useState<Item>(item);
  const [details, setDetails] = useState<TvSeriesDetails | MovieDetails>();
  const [totalPlaytime, setTotalPlaytime] = useState<number>();
  const [, forceUpdate] = useForceUpdate();

  useEffect(() => {
    setDetails(lookup(item, () => setDetails(lookup(item))));
  }, [item]);
  useEffect(() => {
    if (!details) return;
    setTotalPlaytime(lookupRuntime(details as TvSeriesDetails, forceUpdate)?.reduce((prev, current) => prev + current));
  }, [details]);

  return (
    <div className="AnimatedModalContent DefaultModalContent Menu">
      {details ? <>
        {state.series ? <>
          <div className="Head">
            <img className="Poster" src={provideImageUrl((details as TvSeriesDetails).poster_path)} alt=""/>
            <div className="Info">
              <div className="Name">{(details as TvSeriesDetails).name}</div>
              <div
                className="Tagline">{((details as TvSeriesDetails).name === (details as TvSeriesDetails).original_name) ? (details as TvSeriesDetails).tagline || (details as TvSeriesDetails).original_name : (details as TvSeriesDetails).original_name}</div>
              <span>
                <div className="Year">{(details as TvSeriesDetails).first_air_date?.substring(0, 4)} - {(details as TvSeriesDetails).last_air_date?.substring(0, 4)}</div>
                {totalPlaytime && <div className="Playtime"><FontAwesomeIcon icon={faClock}/> {formatTime(totalPlaytime)}</div>}
              </span>
            </div>
          </div>
          <div className="History">
            <div className="Title">Watch History</div>
            <div className="Seasons">
              {(details as TvSeriesDetails).seasons.filter(season => season.air_date && Date.parse(season.air_date) < Date.now() && season.episode_count > 0 && season.name !== "Specials").map((season, index) =>
                <div key={season.season_number} className="Season">
                  <div className="SeasonStats">
                    <div className="Name">{season.name}</div>
                    <div className="Episodes">{season.episode_count}</div>
                    <div className="Runtime">{formatTime(lookupRuntime((details as TvSeriesDetails), forceUpdate)?.at(season.season_number))}</div>
                  </div>
                  <div className="Controls">
                    <div className={"Minus" + (isSharedData ? " Disabled" : "")}
                         onClick={!isSharedData ? () => setState(setTimes(false, season.season_number, (details as TvSeriesDetails).number_of_seasons || season.season_number, state)) : undefined}>
                      <FontAwesomeIcon icon={faMinus}/></div>
                    <div className="Display">{timesOf(state.times[season.season_number])}x</div>
                    <div className={"Plus" + (isSharedData ? " Disabled" : "")}
                         onClick={!isSharedData ? () => setState(setTimes(true, season.season_number, (details as TvSeriesDetails).number_of_seasons || season.season_number, state)) : undefined}>
                      <FontAwesomeIcon icon={faPlus}/></div>
                  </div>
                </div>)}
            </div>
          </div>
        </> : <> {/* Movie */}
          <div>
            <div className="Name">{}</div>
          </div>
        </>}
        <div className="Buttons">
          <div className={"Button Save" + (isSharedData ? " Disabled" : "")} onClick={!isSharedData ? () => saveItem(state) : undefined}><FontAwesomeIcon icon={faCheck}/> Save
          </div>
          <div className={"Button Remove" + (isSharedData ? " Disabled" : "")} onClick={!isSharedData ? () => removeItem(state) : undefined}><FontAwesomeIcon icon={faTrashCan}/> Remove
          </div>
          <div className="Button Cancel" onClick={() => cancel()}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
        </div>
      </> : <>
        <Loader/>
      </>}
    </div>
  );
};
export default Menu;
