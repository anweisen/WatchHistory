import React from "react";
import {TvSeriesDetails} from "../tmdb/types";
import {lookup, provideImageUrl} from "../tmdb/api";
import {Item, useForceUpdate} from "../utils";
import "./List.scss";

const List = ({items, openMenu}: { items: Item[], openMenu: (item: Item) => void }) => {
  const [, forceUpdate] = useForceUpdate();

  return (
    <div className="List">
      {items.map(value => ({item: value, details: lookup(value, forceUpdate)}))
        .map(({item, details}) => <div key={item.id} className={"Item"} //  + (item.series && (details as TvSeriesDetails)?.episode_run_time.length === 0 ? " Unavailable" : "")
                                       onClick={event => openMenu(item)}>
          {!details ? <></> : item.series ? <><img src={provideImageUrl((details as TvSeriesDetails).poster_path)} alt="?"/></> : <></>}
        </div>)}
    </div>
  );
};
export default List;
