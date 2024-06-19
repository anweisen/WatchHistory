import {fetchWith} from "./api";
import {Item} from "../utils";

export interface IDetails {
  id: string;
  title: string;
  original_title: string;
  poster_url: string | undefined;
  tagline: string | undefined;
  genres: Genre[];
  first_air_date: string;
  last_air_date: string | undefined;
}

export interface MovieDetails extends IDetails {
  runtime: number;
}

export interface SeriesDetails extends IDetails {
  seasons: SeasonDetails[];
}

export interface SeasonDetails {
  name: string;
  number: number;
  episode_count: number;
  runtime: number;
}

export interface Genre {
  id: number;
  name: string;
}

export const fetchSeriesDetails = async (id: string) => {
  return fetchWith("GET", `/series/details/${id}`, undefined)
    .then<SeriesDetails>(value => value.json());
};
export const fetchMovieDetails = async (id: string) => {
  return fetchWith("GET", `/movie/details/${id}`, undefined)
    .then<SeriesDetails>(value => value.json());
};


const details = new Map<string, MovieDetails | SeriesDetails>();
const promises = new Map<string, Promise<MovieDetails | SeriesDetails>>();
export const lookupDetails = async (item: Item): Promise<MovieDetails | SeriesDetails> => {
  let id = item.id.toString();
  if (details.has(id)) {
    return Promise.resolve(details.get(id)!!);
  }

  if (promises.has(id)) {
    return wrapPromise(promises.get(id)!!);
  }

  const promise: Promise<MovieDetails | SeriesDetails> = item.series ? fetchSeriesDetails(id) : fetchMovieDetails(id);
  promises.set(id, promise)
  return wrapPromise(promise)
};
const wrapPromise = <T>(promise: Promise<T>) => {
  return new Promise<T>(resolve => {
    promise.then(value => {
      resolve(value);
      return value;
    })
  })
}
