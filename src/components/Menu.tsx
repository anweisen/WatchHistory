import {faAngleLeft, faCalendar, faCheck, faClock, faFilm, faMinus, faPlus, faTrashCan, faTv} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {MovieDetails, TvSeriesDetails, TvSeriesSeason} from "../tmdb/types";
import {lookup, lookupRuntime, provideImageUrl} from "../tmdb/api";
import {formatTime, isValidSeason, Item, timesOf, useForceUpdate} from "../utils";
import Loader from "./Loader";
import "./Menu.scss";

export const ensureTimesArraySize = (item: Item, seasons: TvSeriesSeason[]) => {
  let times = [0];
  for (let season of seasons) {
    if (isValidSeason(season)) {
      times[season.season_number] = timesOf(item.times[season.season_number]);
    }
  }
  return times;
};
const setTimes = (plus: boolean, season: number, seasons: TvSeriesSeason[], item: Item) => {
  const times = ensureTimesArraySize(item, seasons);
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
  const [updater, forceUpdate] = useForceUpdate();

  useEffect(() => {
    setDetails(lookup(item, () => setDetails(lookup(item, forceUpdate))));
  }, [item]);
  useEffect(() => {
    if (!details) return;
    if (item.series) {
      const series = details as TvSeriesDetails;
      const seasonRuntime = lookupRuntime(series, forceUpdate);
      if (!seasonRuntime) return;

      const sum = series.seasons.filter(isValidSeason)
        .map(value => seasonRuntime[value.season_number])
        .reduce((prev, curr) => prev + curr);
      setTotalPlaytime(sum);
    } else {
      setTotalPlaytime((details as MovieDetails).runtime);
    }
  }, [details, updater, forceUpdate]);

  return (
    <div className="AnimatedModalContent DefaultModalContent Menu">
      {details ? <>
        {state.series
          ? <SeriesMenu details={details as TvSeriesDetails} state={state} setState={setState} isSharedData={isSharedData}
                        forceUpdate={forceUpdate} totalPlaytime={totalPlaytime}/>
          : <MovieMenu details={details as MovieDetails} totalPlaytime={totalPlaytime} isSharedData={isSharedData}
                       state={state} setState={setState}/>}

        <div className="Buttons">
          <div className={"Button Save" + (isSharedData ? " Disabled" : "")} onClick={!isSharedData ? () => saveItem(state) : undefined}>
            <FontAwesomeIcon icon={faCheck}/> Save
          </div>
          <div className={"Button Remove" + (isSharedData ? " Disabled" : "")} onClick={!isSharedData ? () => removeItem(state) : undefined}>
            <FontAwesomeIcon icon={faTrashCan}/> Remove
          </div>
          <div className="Button Cancel" onClick={() => cancel()}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
        </div>
      </> : <Loader/>}
    </div>
  );
};

const SeriesMenu = ({details, totalPlaytime, forceUpdate, isSharedData, state, setState}: {
  details: TvSeriesDetails,
  totalPlaytime: number | undefined,
  forceUpdate: () => void,
  isSharedData: boolean,
  state: Item,
  setState: (v: Item) => void
}) => (<>
  <MenuHead name={details.name} originalName={details.original_name} tagline={details.tagline} posterPath={details.poster_path}
            firstAirDate={details.first_air_date?.substring(0, 4)} lastAirDate={details.last_air_date?.substring(0, 4)}
            totalPlaytime={totalPlaytime} series={true}/>
  <div className="History">
    <div className="Title">Watch History</div>
    <div className="Seasons">
      {details.seasons.filter(isValidSeason).map((season) =>
        <div key={season.id + "-" + season.season_number} className="Season">
          <div className="SeasonStats">
            <div className="Name">{season.name}</div>
            <div className="Episodes">{season.episode_count}</div>
            <div className="Runtime">{formatTime(lookupRuntime(details, forceUpdate)?.at(season.season_number))}</div>
          </div>
          <div className="Controls">
            <div className={"Minus" + (isSharedData ? " Disabled" : "")}
                 onClick={!isSharedData ? () => setState(setTimes(false, season.season_number, details.seasons, state)) : undefined}>
              <FontAwesomeIcon icon={faMinus}/></div>
            <div className="Display">{timesOf(state.times[season.season_number])}x</div>
            <div className={"Plus" + (isSharedData ? " Disabled" : "")}
                 onClick={!isSharedData ? () => setState(setTimes(true, season.season_number, details.seasons, state)) : undefined}>
              <FontAwesomeIcon icon={faPlus}/></div>
          </div>
        </div>)}
    </div>
  </div>
</>);

const MovieMenu = ({details, totalPlaytime, isSharedData, state, setState}: {
    details: MovieDetails,
    totalPlaytime: number | undefined,
    isSharedData: boolean,
    state: Item,
    setState: (v: Item) => void
  }) => (<>
    <MenuHead name={details.title} originalName={details.original_title} tagline={details.tagline} posterPath={details.poster_path}
              firstAirDate={details.release_date?.substring(0, 4)} lastAirDate={undefined} totalPlaytime={totalPlaytime} series={false}/>
    <div className="History">
      <div className="Title">Watch History</div>
      <div className="Seasons">
        <div className="Season">
          <div className="SeasonStats">
            <div className="Name">Movie</div>
            {/*<div className="Episodes">{season.episode_count}</div>*/}
            <div className="Runtime">{formatTime(details.runtime)}</div>
          </div>
          <div className="Controls">
            <div className={"Minus" + (isSharedData ? " Disabled" : "")}
                 onClick={!isSharedData ? () => setState({...state, times: [timesOf(state.times[0]) - 1]}) : undefined}>
              <FontAwesomeIcon icon={faMinus}/></div>
            <div className="Display">{timesOf(state.times[0])}x</div>
            <div className={"Plus" + (isSharedData ? " Disabled" : "")}
                 onClick={!isSharedData ? () => setState({...state, times: [timesOf(state.times[0]) + 1]}) : undefined}>
              <FontAwesomeIcon icon={faPlus}/></div>
          </div>
        </div>
      </div>
    </div>
  </>)
;

const MenuHead = ({name, originalName, tagline, posterPath, firstAirDate, lastAirDate, totalPlaytime, series}: {
  name: string,
  originalName: string,
  tagline: string | undefined,
  posterPath: string | undefined,
  firstAirDate: string | undefined,
  lastAirDate: string | undefined,
  totalPlaytime: number | undefined,
  series: boolean,
}) => (
  <div className="Head">
    <img className="Poster" src={provideImageUrl(posterPath)} alt=""/>
    <div className="Info">
      <div className="Name">{name} <FontAwesomeIcon icon={series ? faTv : faFilm}/></div>
      <div className="Tagline">{(name === originalName && tagline) ? tagline : originalName}</div>
      <span>
        <div className="Year"><FontAwesomeIcon icon={faCalendar}/> {firstAirDate} {lastAirDate && firstAirDate !== lastAirDate && "-" + lastAirDate}</div>
        {totalPlaytime && <div className="Playtime"><FontAwesomeIcon icon={faClock}/> {formatTime(totalPlaytime)}</div>}
      </span>
    </div>
  </div>
);

export default Menu;
