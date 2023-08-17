import React from "react";
import {MovieDetails, TvSeriesDetails} from "../tmdb/types";
import {lookupMovie, lookupSeries, provideImageUrl} from "../tmdb/api";
import {Item} from "../utils";
import "./List.scss";

const promises = new Map<number, Promise<any>>();
const details = new Map<number, TvSeriesDetails | MovieDetails>();
export const lookup = (item: Item, callback?: () => void) => {
  // console.log(item.id);
  if (promises.has(item.id)) {
    if (callback) promises.get(item.id)?.then(_ => callback());
    return undefined;
  }
  if (details.has(item.id)) return details.get(item.id);
  console.log(item.id + " not found");
  const promise = item.series ? lookupSeries(item.id) : lookupMovie(item.id);
  promises.set(item.id, promise);
  promise.then(value => {
    promises.delete(item.id);
    details.set(item.id, value);
    callback && callback();
  });
  return undefined;
};

export function useForceUpdate(): () => void {
  return React.useReducer(() => ({}), {})[1] as () => void; // <- paste here
}

const List = ({items, openMenu}: { items: Item[], openMenu: (item: Item) => void }) => {
  const forceUpdate = useForceUpdate();

  return (
    <div className="List">
      {items.map(value => ({item: value, details: lookup(value, forceUpdate)}))
        .map(({item, details}) => <div key={item.id} className={"Item" + (item.series && (details as TvSeriesDetails)?.episode_run_time.length === 0 ? " Unavailable" : "")}
                                       onClick={event => openMenu(item)}>
          {!details ? <></> : item.series ? <><img src={provideImageUrl((details as TvSeriesDetails).poster_path)}/></> : <></>}
        </div>)}
    </div>
  );
};
export default List;