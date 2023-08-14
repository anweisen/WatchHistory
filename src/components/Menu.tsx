import {Item} from "../App";
import {useEffect, useState} from "react";
import {lookup} from "./List";
import {MovieDetails, TvSeriesDetails} from "../tmdb/types";
import {formatTime, provideImageUrl} from "../tmdb/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import "./Menu.scss";

const setTimes = (plus: boolean, season: number, seasons: number, item: Item) => {
  let times = [...item.times];
  if (times.length <= season) {
    times = Array(seasons);
    for (let i = 0; i < item.times.length; i++)
      times[i] = item.times[i];
  }
  if (plus) times[season] = (times[season] == undefined ? 1 : times[season]) + 1;
  else if (times[season] !== 0) times[season] = (times[season] == undefined ? 1 : times[season]) - 1;
  return {...item, times: times};
};

const Menu = ({item, saveItem}: { item: Item, saveItem: (item: Item) => void }) => {
  const [state, setState] = useState<Item>(item);
  const [details, setDetails] = useState<TvSeriesDetails | MovieDetails>();
  useEffect(() => {
    setDetails(lookup(item, () => setDetails(lookup(item))));
  }, []);

  return (
    <span className="MenuContainer">
      <div className="Menu">
        {details ? <>
          {state.series ? <>
            <div className="Head">
              <img className="Poster" src={provideImageUrl((details as TvSeriesDetails).poster_path)}/>
              <div className="Info">
                <div className="Name">{(details as TvSeriesDetails).name}</div>
                <div className="OriginalName">{(details as TvSeriesDetails).original_name}</div>
                <div className="Year">{(details as TvSeriesDetails).first_air_date?.substring(0, 4)} - {(details as TvSeriesDetails).last_air_date?.substring(0, 4)}</div>
              </div>
            </div>
            <div className="History">
              <div className="Title">Watch History</div>
              <div className="Seasons">
                {(details as TvSeriesDetails).seasons.map(season => <div key={season.season_number} className="Season">
                  <div className="SeasonTitle">{season.name} - {season.episode_count} Episodes - {formatTime(season.episode_count * (details as TvSeriesDetails).episode_run_time[0])}</div>
                  <div className="Controls">
                    <div className="Minus"
                         onClick={event => setState(setTimes(false, season.season_number, (details as TvSeriesDetails).number_of_seasons || season.season_number, state))}>
                      <FontAwesomeIcon icon={faMinus}/></div>
                    <div className="Display">{state.times[season.season_number] === undefined ? 1 : state.times[season.season_number]}x</div>
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
            <div className="Button Save" onClick={() => saveItem(state)}>Save</div>
            <div className="Button Cancel">Cancel</div>
          </div>
        </> : <>
          Loading
        </>}
      </div>
    </span>
  );
};
export default Menu;