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

const fetchWithRetry = async (path: string, abortSignal: AbortSignal | undefined = undefined, maxRetries = 4, retryDelay = 5_000) => {
  let retry = 1;

  const doFetch = (): Promise<any> => {
    const retryFetch = () => {
      if (abortSignal?.aborted) {
        throw new Error("Aborted request!");
      }
      if (retry > maxRetries) {
        throw new Error("429 Too Many Request: exceeded max retry count!");
      }
      console.log(`Encountered Error! Retry ${retry} for ${path} in ${retryDelay / 1000}s..`);
      retry++;
      return new Promise(resolve => setTimeout(resolve, retryDelay)).then(doFetch);
    };

    return fetch(`https://api.themoviedb.org/3${path}`, {
      method: "GET",
      signal: abortSignal,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      abortSignal?.throwIfAborted();
      if (response.ok) {
        return response.json();
      } else if (response.status === 429) {
        return retryFetch();
      } else {
        throw new Error("Fetch failed with status " + response.status);
      }
    }, () => {
      return retryFetch();
    });
  };

  return await doFetch();
};

export const discoverSeries = async (page: number) => {
  return await fetchWithRetry(`/discover/tv?language=${language}&include_adult=true&include_null_first_air_dates=false&sort_by=vote_count.desc&page=${page}`)
    .then<SearchResults<SearchTvSeriesEntry>>(value => value)
}
export const searchSeries = async (name: string, abort: AbortSignal | undefined) => {
  return await fetchWithRetry(`/search/tv?query=${encodeURIComponent(name)}&include_adult=false&language=${language}&page=1`, abort)
    .then<SearchResults<SearchTvSeriesEntry>>(value => value);
};
export const searchMovies = async (name: string, abort: AbortSignal | undefined) => {
  return await fetchWithRetry(`/search/movie?query=${encodeURIComponent(name)}&include_adult=false&language=${language}&page=1`, abort)
    .then<SearchResults<SearchMoviesEntry>>(value => value);
};

export const lookupSeries = async (id: number) => {
  return await fetchWithRetry(`/tv/${id}?language=${language}`)
    .then<TvSeriesDetails>(value => value)
    .then(log)
    .catch(reason => console.error(`could not find series ${id}`));
};
export const lookupMovie = async (id: number) => {
  return await fetchWithRetry(`/movie/${id}?language=${language}`)
    .then<MovieDetails>(value => value)
    .then(log);
};

export const fetchSeriesRuntime = (series: TvSeriesDetails) => {
  const arr: Promise<number>[] = Array(series.number_of_seasons);
  arr[0] = Promise.resolve(0);

  for (let season of series.seasons) {
    arr[season.season_number] = fetchSeasonRuntime(series.id, season.season_number);
  }
  return Promise.all(arr).then(arr => {
    if (series.id === 66732) {
      console.log(arr);
    }
    return arr;
  });
};
export const fetchSeasonRuntime = async (seriesId: number, seasonNumber: number) => {
  return fetchWithRetry(`/tv/${seriesId}/season/${seasonNumber}`)
    .then<{ episodes: [{ runtime: number }] }>(value => value)
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
;
