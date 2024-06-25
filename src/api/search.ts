
export type SearchResults = {
  total_results: number,
  total_pages: number,
  results: ResultEntry[],
}

export type ResultEntry = {
  id: string;
  title: string;
  original_title: string;
  poster_url: string | undefined;
}