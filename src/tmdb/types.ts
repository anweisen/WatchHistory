
export interface SearchResults<T> {
  page: number;
  total_results: number;
  total_pages: number;
  results: T[];
}

export interface SearchTvSeriesEntry {
  adult: boolean;
  backdrop_path: string | undefined;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | undefined;
  vote_average: number;
  vote_count: number;
}

export interface SearchMoviesEntry {
  adult: boolean;
  backdrop_path: string | undefined;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  title: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | undefined;
  vote_average: number;
  vote_count: number;
}

export interface TvSeriesDetails {
}