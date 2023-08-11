import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import "./Search.scss";
import {useState} from "react";
import {provideImageUrl, searchSeries} from "../tmdb/api";
import {SearchTvSeriesEntry} from "../tmdb/types";

const Search = () => {
  const [series, setSeries] = useState<SearchTvSeriesEntry[]>([]);
  // const [movies, setMovies] = useState<SearchResult[]>([]);

  const search = (input: string) => {
    setSeries([]);
    searchSeries(input).then(search => setSeries(search.results.splice(0, 5)));
  };

  return (
    <div className="AddToHistory">

      <div className="SearchBar">
        <input type="text" onChange={event => search(event.target.value)}/>
        <FontAwesomeIcon icon={faSearch}/>
      </div>

      <div className="SearchResults">
        {series.map((value, index) => <div className="Result" key={index}>
          <img src={provideImageUrl(value.poster_path, "w92")}/>
          <div className="Name">{value.name}</div>
          {value.name !== value.original_name && <div className="OriginalName">{value.original_name}</div>}
        </div>)}
      </div>

    </div>
  );
};
export default Search;
