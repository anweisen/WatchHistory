import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark, faImage, faLaptop, faSearch} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useRef, useState} from "react";
import {provideImageUrl, searchMovies, searchSeries} from "../tmdb/api";
import {SearchMoviesEntry, SearchTvSeriesEntry} from "../tmdb/types";
import {Item} from "../utils";
import Loader from "./Loader";
import "./Search.scss";
import {AppContext} from "./context/AppContext";

let timer: any;

const UnknownThumbnail = () => (
  <div className={"UnknownThumbnail Poster"}>
    <FontAwesomeIcon icon={faImage}/>
  </div>
);

const Search = ({openMenu}: { openMenu: (item: Item) => void }) => {

  const {isSharedData} = useContext(AppContext);

  const ref = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState(false);
  const [series, setSeries] = useState<SearchTvSeriesEntry[] | undefined>([]);
  const [movies, setMovies] = useState<SearchMoviesEntry[] | undefined>([]);

  const open = (item: Item) => {
    if (ref.current) ref.current.value = "";
    setSeries([]);
    setMovies([]);
    openMenu(item);
  };
  const search = (input: string) => {
    if (input.length === 0) {
      setSeries([]);
      setMovies([]);
      return;
    }
    setSeries(undefined);
    setMovies(undefined);

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      searchSeries(input).then(search => setSeries(search.results.splice(0, 3)));
      searchMovies(input).then(search => setMovies(search.results.splice(0, 3)));
    }, 250);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.length === 1) {
        //@ts-ignore
        ref.current.focus();
      }
    };
    document.addEventListener("keypress", handler);
    return () => document.removeEventListener("keypress", handler);
  });
  useEffect(() => {
    const handler = (event: Event) => {
      if (event.target !== ref.current) {
        setFocus(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  return (
    <div className="Search">

      <div className={"SearchBar"}>
        <input className={(isSharedData ? " Disabled" : "")} type="new-password" autoCorrect="off" autoComplete="off" placeholder="add something.." ref={ref} id={"search-input"}
               onChange={event => search(event.target.value)}
               onFocus={event => setFocus(true)}
          // onBlur={event => setFocus(false)} # closes popup before click is registered
               disabled={isSharedData}/>
        <FontAwesomeIcon icon={faSearch}/>
      </div>

      <span className="SearchResultsContainer">
        <div className="SearchResults" style={!focus ? {display: "none"} : undefined}>
          {!series && !movies ? <Loader/> : !series?.length && !movies?.length ? <div className="None"><FontAwesomeIcon icon={faCircleXmark}/>try another show</div> : undefined}

          {series?.map((value, index) => <div className="Result" key={index} onClick={() => open({id: value.id, series: true, times: []})}>
            {!(value.poster_path || value.backdrop_path) ? <UnknownThumbnail/> :
              <img className="Poster" src={provideImageUrl(value.poster_path || value.backdrop_path, "w92")} alt=""/>}
            <div className="Name">{value.name}</div>
            {value.name !== value.original_name && <div className="OriginalName">{value.original_name}</div>}
            <FontAwesomeIcon className="Type" icon={faLaptop}/>
          </div>)}

          {/*{movies?.map((value, index) => <div className="Result" key={index}*/}
          {/*                                    onClick={() => open({id: value.id, series: false, times: []})}>*/}
          {/*  <img className="Poster" src={provideImageUrl(value.poster_path || value.backdrop_path, "w92")} alt="?"/>*/}
          {/*  <div className="Name">{value.title}</div>*/}
          {/*  {value.title !== value.original_title && <div className="OriginalName">{value.original_title}</div>}*/}
          {/*  <FontAwesomeIcon className="Type" icon={faFilm}/>*/}
          {/*</div>)}*/}
        </div>
      </span>

    </div>
  );
};
export default Search;
