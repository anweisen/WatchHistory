import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilm, faLaptop, faSearch} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import {provideImageUrl, searchMovies, searchSeries} from "../tmdb/api";
import {SearchMoviesEntry, SearchTvSeriesEntry} from "../tmdb/types";
import {Item} from "../utils";
import "./Search.scss";

const Search = ({openMenu}: { openMenu: (item: Item) => void }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState(false);
  const [series, setSeries] = useState<SearchTvSeriesEntry[]>([]);
  const [movies, setMovies] = useState<SearchMoviesEntry[]>([]);

  const open = (item: Item) => {
    if (ref.current) ref.current.value = "";
    openMenu(item);
  };
  const search = (input: string) => {
    if (input.length === 0) return;
    setSeries([]);
    setMovies([]);
    searchSeries(input).then(search => setSeries(search.results.splice(0, 3)));
    searchMovies(input).then(search => setMovies(search.results.splice(0, 3)));
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

      <div className="SearchBar">
        <input type="text" placeholder="Add something.." ref={ref} id={"search-input"}
               onChange={event => search(event.target.value)}
               onFocus={event => setFocus(true)}
          // onBlur={event => setFocus(false)} # closes popup before click is registered
        />
        <FontAwesomeIcon icon={faSearch}/>
      </div>

      <span className="SearchResultsContainer">
        <div className="SearchResults" style={!focus ? {display: "none"} : undefined}>
        {series.map((value, index) => <div className="Result" key={index}
                                           onClick={event => open({id: value.id, series: true, times: []})}>
          <img className="Poster" src={provideImageUrl(value.poster_path || value.backdrop_path, "w92")}/>
          <div className="Name">{value.name}</div>
          {value.name !== value.original_name && <div className="OriginalName">{value.original_name}</div>}
          <FontAwesomeIcon className="Type" icon={faLaptop}/>
        </div>)}
          {movies.map((value, index) => <div className="Result" key={index}
                                             onClick={event => open({id: value.id, series: false, times: []})}>
            <img className="Poster" src={provideImageUrl(value.poster_path || value.backdrop_path, "w92")}/>
            <div className="Name">{value.title}</div>
            {value.title !== value.original_title && <div className="OriginalName">{value.original_title}</div>}
            <FontAwesomeIcon className="Type" icon={faFilm}/>
          </div>)}
      </div>
      </span>

    </div>
  );
};
export default Search;
