import {
  faAngleLeft,
  faAnglesLeft,
  faCalendar,
  faCheck,
  faClock,
  faFilm,
  faMinus,
  faPlus,
  faRepeat,
  faTrashCan,
  faTv,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useCallback, useContext, useEffect, useState} from "react";
import {findItemById, formatTime, Item, timesOf} from "../utils";
import {lookupDetails, MovieDetails, SeasonDetails, SeriesDetails} from "../api/details";
import {AppContext} from "./context/AppContext";
import Loader from "./Loader";
import "./Menu.scss";

export const ensureTimesArraySize = (item: Item, seasons: SeasonDetails[]) => {
  let times = [0];
  for (let season of seasons) {
    times[season.number] = timesOf(item.times[season.number]);
  }
  return times;
};
const setTimes = (plus: boolean, season: number, seasons: SeasonDetails[], item: Item) => {
  const times = ensureTimesArraySize(item, seasons);
  if (plus && times[season] < 99) times[season] = timesOf(times[season]) + 1;
  else if (!plus && times[season] !== 0) times[season] = timesOf(times[season]) - 1;
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
  const [effected, setEffected] = useState<Item[]>([]);
  const [details, setDetails] = useState<SeriesDetails | MovieDetails>();
  const [totalPlaytime, setTotalPlaytime] = useState<number>();

  const addEffected = useCallback((item: Item) => {
    setEffected(prev => [...prev.filter(test => test.id !== item.id), item]);
  }, [setEffected]);
  const removeEffected = useCallback((item: Item) => {
    setEffected(prev => [...prev.filter(test => test.id !== item.id)]);
  }, [setEffected]);

  useEffect(() => {
    lookupDetails(item).then(setDetails);
  }, [item]);
  useEffect(() => {
    if (!details) return;
    if (item.series) {
      const series = details as SeriesDetails;
      const sum = series.seasons.map(value => value.runtime)
        .reduce((prev, curr) => prev + curr, 0);

      setTotalPlaytime(sum);
    } else {
      setTotalPlaytime((details as MovieDetails).runtime);
    }
    // eslint-disable-next-line
  }, [details]);

  return (
    <div className="AnimatedModalContent DefaultModalContent Menu">
      {details ? <>
        {state.series
          ? <SeriesMenu details={details as SeriesDetails} state={state} setState={setState} isSharedData={isSharedData}
                        totalPlaytime={totalPlaytime}/>
          : <MovieMenu details={details as MovieDetails} totalPlaytime={totalPlaytime} isSharedData={isSharedData}
                       state={state} setState={setState} addEffected={addEffected} removeEffected={removeEffected} effected={effected}/>}

        <div className="Buttons">
          <div className={"Button Save" + (isSharedData ? " Disabled" : "")} onClick={!isSharedData ? () => {
            saveItem(state);
            effected.forEach(saveItem);
          } : undefined}>
            <FontAwesomeIcon icon={faCheck}/> Save
          </div>

          <div className={"Button Remove" + (isSharedData ? " Disabled" : "")} onClick={!isSharedData ? () => {
            removeItem(state);
            effected.forEach(removeItem);
          } : undefined}>
            <FontAwesomeIcon icon={faTrashCan}/> Remove
          </div>

          <div className="Button Cancel" onClick={() => cancel()}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
        </div>
      </> : <Loader/>}
    </div>
  );
};

const SeriesMenu = ({details, totalPlaytime, isSharedData, state, setState}: {
  details: SeriesDetails,
  totalPlaytime: number | undefined,
  isSharedData: boolean,
  state: Item,
  setState: (v: Item) => void
}) => (<>
  <MenuHead name={details.title} originalName={details.original_title} tagline={details.tagline} posterUrl={details.poster_url}
            firstAirDate={details.first_air_date?.substring(0, 4)} lastAirDate={details.last_air_date?.substring(0, 4)}
            totalPlaytime={totalPlaytime} series={true}/>
  <div className="History">
    <div className="Title">Watch History</div>
    <div className="Seasons">
      {details.seasons.map((season) =>
        <div key={season.number} className="Season">
          <div className="SeasonStats">
            <div className="Name">{season.name}</div>
            <div className="Episodes">{season.episode_count}</div>
            <div className="Runtime">{formatTime(season.runtime)}</div>
          </div>
          <div className="Controls">
            <div className={"Minus" + (isSharedData ? " Disabled" : "")}
                 onClick={!isSharedData ? () => setState(setTimes(false, season.number, details.seasons, state)) : undefined}>
              <FontAwesomeIcon icon={faMinus}/></div>
            <div className="Display">{timesOf(state.times[season.number])}x</div>
            <div className={"Plus" + (isSharedData ? " Disabled" : "")}
                 onClick={!isSharedData ? () => setState(setTimes(true, season.number, details.seasons, state)) : undefined}>
              <FontAwesomeIcon icon={faPlus}/></div>
          </div>
        </div>)}
    </div>
  </div>
</>);

const MovieMenu = ({details, totalPlaytime, isSharedData, state, setState, addEffected, removeEffected, effected}: {
  details: MovieDetails,
  totalPlaytime: number | undefined,
  isSharedData: boolean,
  state: Item,
  setState: (v: Item) => void,
  addEffected: (v: Item) => void,
  removeEffected: (v: Item) => void,
  effected: Item[]
}) => (<>
  <MenuHead name={details.title} originalName={details.original_title} tagline={details.tagline} posterUrl={details.poster_url}
            firstAirDate={details.first_air_date?.substring(0, 4)} lastAirDate={undefined} totalPlaytime={totalPlaytime} series={false}/>
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
               onClick={!isSharedData ? () => setState({...state, times: [Math.max(timesOf(state.times[0]) - 1, 0)]}) : undefined}>
            <FontAwesomeIcon icon={faMinus}/></div>
          <div className="Display">{timesOf(state.times[0])}x</div>
          <div className={"Plus" + (isSharedData ? " Disabled" : "")}
               onClick={!isSharedData ? () => setState({...state, times: [Math.min(timesOf(state.times[0]) + 1, 99)]}) : undefined}>
            <FontAwesomeIcon icon={faPlus}/></div>
        </div>
      </div>
    </div>
  </div>
  {details.collection
    && <MovieCollection details={details} state={state} addEffected={addEffected} removeEffected={removeEffected} effected={effected}/>}
</>);

const MovieCollection = ({details, state, addEffected, removeEffected, effected}: {
  details: MovieDetails,
  state: Item,
  addEffected: (v: Item) => void,
  removeEffected: (v: Item) => void,
  effected: Item[],
}) => {
  const {items} = useContext(AppContext);
  const [itemMap, setItemMap] = useState<Record<string, Item>>();

  useEffect(() => {
    let map: Record<string, Item> = {};
    for (let part of details.collection!!.parts) {
      let id = parseInt(part.id);
      const foundItem = id === state.id
        ? state : effected.some(test => test.id === id)
          ? effected.find(test => test.id === id)
          : findItemById(items, id, false);
      if (foundItem) {
        map[part.id] = foundItem;
      }
    }
    setItemMap(map);
  }, [items, details, state, effected]);
  useEffect(() => {
    effected.forEach(value => addEffected({id: value.id, series: value.series, times: state.times}));
    // eslint-disable-next-line
  }, [state]);

  return (
    <div className={"Collection"}>
      <div className={"Title"}>{details.collection!!.name}
        {effected.length + 1 !== details.collection?.parts.length ? <div className={"ApplyButton"} onClick={() => {
          details.collection!!.parts.filter(test => test.id !== details.id)
            .forEach(entry => addEffected({id: parseInt(entry.id), series: false, times: state.times}));
        }}><FontAwesomeIcon icon={faAnglesLeft}/> apply all
        </div> : <div className={"ApplyButton"} onClick={() => {
          effected.forEach(removeEffected);
        }}><FontAwesomeIcon icon={faXmark}/> deselect
        </div>}
      </div>
      <div className={"Parts"} style={{backgroundImage: `url(${details.collection!!.backdrop_url})`}}>
          <span>
            {details.collection!!.parts.map(entry => (
              <div className={"Part" + (entry.id === details.id || effected.some(value => value.id === parseInt(entry.id)) ? " Applied" : "")}
                   key={entry.id}
                   onClick={entry.id !== details.id ? () => {
                     let index = effected.findIndex(value => value.id === parseInt(entry.id));
                     if (index !== -1) {
                       removeEffected(effected.at(index)!!);
                     } else {
                       addEffected({id: parseInt(entry.id), series: false, times: state.times});
                     }
                   } : undefined}>
                <img className={"Poster"} src={entry.poster_url} alt=""/>
                <div className={"Info"}>
                  <div className={"Name"}>{entry.title}</div>
                  <div className={"Times"}><FontAwesomeIcon icon={faRepeat}/> {itemMap && itemMap[entry.id]
                    ? timesOf(itemMap[entry.id]?.times?.at(0)) : 0}x
                  </div>
                </div>
              </div>
            ))}
          </span>
      </div>
    </div>
  );
};

const MenuHead = ({name, originalName, tagline, posterUrl, firstAirDate, lastAirDate, totalPlaytime, series}: {
  name: string,
  originalName: string,
  tagline: string | undefined,
  posterUrl: string | undefined,
  firstAirDate: string | undefined,
  lastAirDate: string | undefined,
  totalPlaytime: number | undefined,
  series: boolean,
}) => (
  <div className="Head">
    <img className="Poster" src={posterUrl} alt=""/>
    <div className="Info">
      <div className="Name">{name} <FontAwesomeIcon icon={series ? faTv : faFilm}/></div>
      <div className="Tagline">{(name === originalName && tagline) ? tagline : originalName}</div>
      <span>
        <div className="Year"><FontAwesomeIcon
          icon={faCalendar}/> {firstAirDate} {lastAirDate && firstAirDate !== lastAirDate && "-" + lastAirDate}</div>
        {totalPlaytime ? <div className="Playtime"><FontAwesomeIcon icon={faClock}/> {formatTime(totalPlaytime)}</div> : <></>}
      </span>
    </div>
  </div>
);

export default Menu;
