import {useContext, useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faCompass, faFilm, faImage, faKeyboard, faSearch, faTv, faXmark} from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";
import {AppContext} from "./context/AppContext";
import {provideImageUrl, searchMovies, searchSeries} from "../tmdb/api";
import {SearchMoviesEntry, SearchTvSeriesEntry} from "../tmdb/types";
import {findItemById, Item} from "../utils";
import {useNavigate} from "react-router-dom";
import "./Search.scss";

const Search = ({openMenu}: { openMenu: (item: Item) => void }) => {
  const {isSharedData, items} = useContext(AppContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<any>(null);
  const [focus, setFocus] = useState(false);
  const [series, setSeries] = useState<SearchTvSeriesEntry[] | undefined>([]);
  const [movies, setMovies] = useState<SearchMoviesEntry[] | undefined>([]);

  const navigate = useNavigate();

  const clearInput = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSeries([]);
    setMovies([]);
  };
  const open = (item: Item) => {
    clearInput();
    setSeries([]);
    setMovies([]);
    openMenu(item);
  };

  let inputDelayTimer = useRef<any>();
  let inputSearchAbort = useRef<AbortController>(new AbortController());
  const search = (input: string) => {
    inputSearchAbort.current?.abort(); // abort current request
    if (inputDelayTimer.current) clearTimeout(inputDelayTimer.current);

    // create new separate abort control
    let abortController = new AbortController();
    let abortSignal = abortController.signal;
    inputSearchAbort.current = abortController;

    // display "no results"
    if (input.length === 0) {
      setSeries([]);
      setMovies([]);
      return;
    }
    // displays loader
    setSeries(undefined);
    setMovies(undefined);

    inputDelayTimer.current = setTimeout(() => {
      if (abortSignal.aborted) return;
      searchSeries(input, abortSignal)
        .then(search => setSeries(search.results.splice(0, 3)))
        .catch(_ => undefined);
      searchMovies(input, abortSignal)
        .then(search => setMovies(search.results.splice(0, 3)))
        .catch(_ => undefined);
    }, 100);
  };

  // focus input field when key pressed
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (document.activeElement !== null && document.activeElement !== inputRef.current
        && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
        return;
      }

      if (event.key.length === 1) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keypress", handler);
    return () => document.removeEventListener("keypress", handler);
  });
  // register outside click, close results
  useEffect(() => {
    const handler = (event: Event) => {
      if (!containerRef.current?.contains(event.target)) {
        setFocus(false);
      } else if (containerRef.current && !focus) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("click", handler, {capture: true});
    return () => document.removeEventListener("click", handler);
  });

  const scrollOnFocus = () => {
    setFocus(true);
    const element = document.getElementsByClassName("SearchBar").item(0);
    if (element) {
      // delay the scroll, as on mobile devices the expansion of the keyboard happens after and has to be taken into account
      setTimeout(() => {
        const targetY = element.getBoundingClientRect().y + window.scrollY - 25; // + 25px of padding above
        // enough space & not out of screen, no need to scroll
        if (window.innerHeight - element.getBoundingClientRect().bottom > 300 && element.getBoundingClientRect().top > 0) return;
        window.scroll(0, targetY); // scrollTo / scrollIntoView are animated but a bit biggy therefor no suitable
      }, 10);
    }
  };

  return (
    <div className="Search">

      <div className={"SearchRow"}>
        <div className={"SearchBar"} ref={containerRef}>
          <FontAwesomeIcon icon={faSearch}/>
          <input className={(isSharedData ? " Disabled" : "")} type="new-password" autoCorrect="off" autoComplete="off" placeholder="search and add.."
                 ref={inputRef} id={"search-input"}
                 onChange={event => search(event.target.value)}
                 onFocus={scrollOnFocus} disabled={isSharedData}/>
          <FontAwesomeIcon className={"Clear"} icon={faXmark} onClick={clearInput}/>
        </div>

        <div className={"DiscoverButton"} onClick={() => navigate("/discover")}>
          <FontAwesomeIcon icon={faCompass}/>
          <p>discover</p>
        </div>
      </div>

      <span className="SearchResultsContainer">
        <div className="SearchResults" style={!focus ? {display: "none"} : undefined}>
          {!series && !movies
            ? <Loader/> : !inputRef?.current?.value?.length
              ? <div className="None"><FontAwesomeIcon icon={faKeyboard}/>enter a show or movie name</div>
              : !series?.length && !movies?.length
                ? <div className="None"><FontAwesomeIcon icon={faCircleXmark}/>try another show or movie</div> : undefined}

          {series?.map((value, index) => (
            <div className="Result" key={index}
                 onClick={() => open(findItemById(items, value.id, true) || {id: value.id, series: true, times: []})}>
              {!value.poster_path
                ? <UnknownThumbnail/>
                : <img className="Poster" src={provideImageUrl(value.poster_path, "w92")} alt=""/>}
              <div className="Name">{value.name}</div>
              {value.name !== value.original_name && <div className="OriginalName">{value.original_name}</div>}
              <FontAwesomeIcon className="Type" icon={faTv}/>
            </div>
          ))}

          {movies?.map((value, index) => (
            <div className="Result" key={index}
                 onClick={() => open(findItemById(items, value.id, false) || {id: value.id, series: false, times: []})}>
              {!value.poster_path
                ? <UnknownThumbnail/>
                : <img className="Poster" src={provideImageUrl(value.poster_path, "w92")} alt=""/>}
              <div className="Name">{value.title}</div>
              {value.title !== value.original_title && <div className="OriginalName">{value.original_title}</div>}
              <FontAwesomeIcon className="Type" icon={faFilm}/>
            </div>
          ))}
        </div>
      </span>

    </div>
  );
};

const UnknownThumbnail = () => (
  <div className={"UnknownThumbnail Poster"}>
    <FontAwesomeIcon icon={faImage}/>
  </div>
);

export default Search;
