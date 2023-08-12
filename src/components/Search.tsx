import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilm, faSearch, faTv} from "@fortawesome/free-solid-svg-icons";
import {provideImageUrl, searchMovies, searchSeries} from "../tmdb/api";
import {SearchMoviesEntry, SearchTvSeriesEntry} from "../tmdb/types";
import "./Search.scss";

const Search = () => {
  const ref = useRef(null);
  const [focus, setFocus] = useState(false);
  const [series, setSeries] = useState<SearchTvSeriesEntry[]>([]);
  const [movies, setMovies] = useState<SearchMoviesEntry[]>([]);

  const search = (input: string) => {
    setSeries([]);
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

  return (
    <div className="Search">

      <div className="SearchBar">
        <input type="text" placeholder="Search.." ref={ref}
               onChange={event => search(event.target.value)}
               onFocus={event => setFocus(true)}
               onBlur={event => setFocus(false)}/>
        <FontAwesomeIcon icon={faSearch}/>
      </div>

      <span className="SearchResultsContainer">
        <div className="SearchResults" style={!focus ? {display: "none"} : undefined}>
        {series.map((value, index) => <div className="Result" key={index}>
          <img className="Poster" src={provideImageUrl(value.poster_path || value.backdrop_path, "w92")}/>
          <div className="Name">{value.name}</div>
          {value.name !== value.original_name && <div className="OriginalName">{value.original_name}</div>}
          <FontAwesomeIcon icon={faTv}/>
        </div>)}
        {movies.map((value, index) => <div className="Result" key={index}>
          <img className="Poster" src={provideImageUrl(value.poster_path || value.backdrop_path, "w92")}/>
          <div className="Name">{value.title}</div>
          {value.title !== value.original_title && <div className="OriginalName">{value.original_title}</div>}
          <FontAwesomeIcon icon={faFilm}/>
        </div>)}
      </div>
      </span>

    </div>
  );
};
export default Search;
