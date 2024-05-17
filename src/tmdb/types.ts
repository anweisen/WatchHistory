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
  adult: boolean;
  backdrop_path: string;
  created_by: object;
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: object;
  name: string;
  networks: object[];
  next_episode_to_air: object | undefined;
  number_of_episodes: number;
  number_of_seasons: number | undefined;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: object[];
  production_countries: object[];
  seasons: TvSeriesSeason[];
  spoken_languages: object[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TvSeriesSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: object[];
  production_countries: object[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: object[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
