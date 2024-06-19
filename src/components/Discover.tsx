import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faPen, faTrashCan, faAngleUp, faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {discoverSeries, provideImageUrl} from "../tmdb/api";
import {SearchTvSeriesEntry} from "../tmdb/types";
import {findItemById, Item, timesOf} from "../utils";
import {lookupDetails, SeriesDetails} from "../api/details";
import {ensureTimesArraySize} from "./Menu";
import Loader from "./Loader";
import "./Discover.scss";


const Discover = ({items, openMenu, saveItem, removeItem}: {
  items: Item[],
  openMenu: (item: Item) => void,
  saveItem: (item: Item) => void,
  removeItem: (item: Item) => void
}) => {
  const navigate = useNavigate();

  const [jumpButton, setJumpButton] = useState(false);
  const [entries, setEntries] = useState<SearchTvSeriesEntry[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<any>(null);

  const checkRemainingSpace = () => {
    const bounds = listRef.current?.getBoundingClientRect();
    if (!bounds) return false;
    return bounds.bottom - window.innerHeight < 100;
  };

  // do the fetch (page change)
  const fetching = useRef(false);
  useEffect(() => {
    if (fetching.current) return;
    fetching.current = true;
    setLoading(true);

    console.log("DISCOVER", page);
    discoverSeries(page)
      .then(value => {
        setEntries(prev => [...prev, ...value.results]);
        setLoading(false);
        fetching.current = false;
      });
  }, [page]);

  // load when empty space remaining
  useEffect(() => {
    if (!loading && checkRemainingSpace()) {
      setLoading(true);
      setPage(prev => prev + 1);
    }
  }, [loading]);

  // load on scroll
  useEffect(() => {
    const handler = () => {
      setJumpButton(window.scrollY > window.innerHeight / 2);
      if (!loading && checkRemainingSpace()) {
        setLoading(true);
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [loading]);

  return (
    <div className={"Discover"}>
      {jumpButton && <div className={"JumpButton"} onClick={() => window.scroll({top: 0, behavior: "smooth"})}><FontAwesomeIcon icon={faAngleUp}/></div>}
      
      <div className={"Head"}>
        <p className={"Title"}>Can't even remember everything?</p>
        <div className={"Subtitle"}>
          <p>Click what you watched!</p>
          <div className={"BackButton"} onClick={() => navigate("/")}><FontAwesomeIcon icon={faHome}/> back to overview</div>
        </div>
      </div>

      <hr/>

      <div ref={listRef} className={"List"}>
        {entries.map(value => ({entry: value, item: findItemById(items, value.id, true)}))
          .map(({entry, item}, index) => (
            <div className={"Item"} key={index}>
              {item && <div className={"Overlay"}>
                <p className={"Number"} onClick={() => updateTimes(item, saveItem, removeItem, entry, true)}>
                  {max(item.times)}x
                </p>
                <FontAwesomeIcon className={"Delete"} icon={max(item.times) > 1 ? faMinusCircle : faTrashCan} onClick={() => updateTimes(item, saveItem, removeItem, entry, false)}/>
                <FontAwesomeIcon className={"Edit"} icon={faPen} onClick={() => openMenu(item || {id: entry.id, series: true, times: []})}/>
              </div>}
              <img src={provideImageUrl(entry.poster_path)} alt={""} onClick={() => updateTimes(item, saveItem, removeItem, entry, true)}/>
            </div>
          ))}
      </div>

      {loading && <Loader/>}
    </div>
  );
};

const max = (times: number[] | undefined) => {
  if (!times || times.length === 0) return 1;
  return times.map(value => timesOf(value)).reduce((prev, curr) => curr > prev ? curr : prev, 1);
};

function updateTimes(item: Item | undefined, saveItem: (item: Item) => void, removeItem: (item: Item) => void, entry: SearchTvSeriesEntry, plus: boolean) {
  if (item) {
    lookupDetails(item).then(details => {
      const series = details as SeriesDetails;
      const times = ensureTimesArraySize(item, series.seasons);
      for (let season of series.seasons) {
        const value = timesOf(times[season.number]);
        times[season.number] = Math.max(plus ? value + 1 : value - 1, 0);
      }

      if (Math.max(...times) === 0) {
        removeItem(item);
      } else {
        saveItem({...item, times: times});
      }
    });
  } else {
    saveItem({id: entry.id, times: [], series: true});
  }
}

export default Discover;