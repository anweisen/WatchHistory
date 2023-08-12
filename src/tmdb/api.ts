import {SearchMoviesEntry, SearchResults, SearchTvSeriesEntry} from "./types";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDlmZWI4NjNmZWRjZmIxZDlkZGJmMTFiMTdhNWQxYyIsInN1YiI6IjYzYWIzNWI3YmU0YjM2MDBkNzNlMjcxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0i-KWF-IHbctdJVHQvMxewEBe8nba9RDE7yT0QChQs4";
const language = "en-US";

export const provideImageUrl = (path: string | undefined, size: string = "w185"): string | undefined => path && `https://image.tmdb.org/t/p/${size}${path}`;

export const searchSeries = async (name: string) => {
  return await fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(name)}&include_adult=false&language=${language}&page=1`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then<SearchResults<SearchTvSeriesEntry>>(value => value.json())
    .then(value => {
      console.log(value);
      return value;
    })
    ;
};
export const searchMovies = async (name: string) => {
  return await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}&include_adult=false&language=${language}&page=1`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then<SearchResults<SearchMoviesEntry>>(value => value.json())
    .then(value => {
      console.log(value);
      return value;
    })
    ;
};
