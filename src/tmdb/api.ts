import {MovieDetails, SearchMoviesEntry, SearchResults, SearchTvSeriesEntry, TvSeriesDetails} from "./types";
import {Item} from "../utils";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDlmZWI4NjNmZWRjZmIxZDlkZGJmMTFiMTdhNWQxYyIsInN1YiI6IjYzYWIzNWI3YmU0YjM2MDBkNzNlMjcxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0i-KWF-IHbctdJVHQvMxewEBe8nba9RDE7yT0QChQs4";
const language = "en-US";

const log = (value: any) => {
  console.log(value);
  return value;
};

export const provideImageUrl = (path: string | undefined, size: string = "w185"): string | undefined =>
  path && `https://image.tmdb.org/t/p/${size}${path}`;

export const searchSeries = async (name: string) => {
  return await fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(name)}&include_adult=false&language=${language}&page=1`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then<SearchResults<SearchTvSeriesEntry>>(value => value.json());
  // .then(log);
};
export const searchMovies = async (name: string) => {
  return await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}&include_adult=false&language=${language}&page=1`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then<SearchResults<SearchMoviesEntry>>(value => value.json());
  // .then(log);
};

export const lookupSeries = async (id: number) => {
  return await fetch(`https://api.themoviedb.org/3/tv/${id}?language=${language}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then<TvSeriesDetails>(value => value.json())
    .then(log)
    .catch(reason => console.error(`could not find series ${id}`))
    ;
};
export const lookupMovie = async (id: number) => {
  return await fetch(`https://api.themoviedb.org/3/movie/${id}?language=${language}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then<MovieDetails>(value => value.json())
    .then(log);
};

export const fetchSeriesRuntime = (series: TvSeriesDetails) => {
  const arr: Promise<number>[] = [];
  for (let season of series.seasons) {
    arr.push(fetchSeasonRuntime(series.id, season.season_number));
  }
  return Promise.all(arr);
};
export const fetchSeasonRuntime = async (seriesId: number, seasonNumber: number) => {
  return fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  }).then<{ episodes: [{ runtime: number }] }>(value => value.json())
    .then(value => value.episodes.reduce((prev, cur) => prev + cur.runtime, 0));
};


const details = new Map<number, TvSeriesDetails | MovieDetails>();
const detailsPromises = new Map<number, Promise<any>>();
export const lookup = (item: Item, callback?: () => void) => {
  if (detailsPromises.has(item.id)) {
    if (callback) detailsPromises.get(item.id)?.then(_ => callback());
    return undefined;
  }

  if (details.has(item.id)) return details.get(item.id);

  const promise = item.series ? lookupSeries(item.id) : lookupMovie(item.id);
  detailsPromises.set(item.id, promise);
  promise.then(value => {
    detailsPromises.delete(item.id);
    details.set(item.id, value);
    callback && callback();
  });
  return undefined;
};

const runtime = new Map<number, number[]>();
const runtimePromises = new Map<number, Promise<any>>();
export const lookupRuntime = (series: TvSeriesDetails, callback: () => void) => {
  if (runtimePromises.has(series.id)) {
    if (callback) runtimePromises.get(series.id)?.then(_ => callback());
    return undefined;
  }

  if (runtime.has(series.id)) return runtime.get(series.id);

  const promise = fetchSeriesRuntime(series);
  runtimePromises.set(series.id, promise);
  promise.then(value => {
    runtimePromises.delete(series.id);
    runtime.set(series.id, value);
    callback && callback();
  });
  return undefined;
};
