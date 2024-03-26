import React from "react";
import {TvSeriesDetails} from "../tmdb/types";
import {lookup, provideImageUrl} from "../tmdb/api";
import {Item, useForceUpdate} from "../utils";
import {faHourglass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./List.scss";

const List = ({items, openMenu}: { items: Item[], openMenu: (item: Item) => void }) => {
  const [, forceUpdate] = useForceUpdate();

  return (
    <div className="List">
      {items.length > 0 ? items.map(value => ({item: value, details: lookup(value, forceUpdate)}))
          .map(({item, details}) => //  + (item.series && (details as TvSeriesDetails)?.episode_run_time.length === 0 ? " Unavailable" : "")
            <div key={item.id} className={"Item"} onClick={() => openMenu(item)}>
              {!details ? <></> : item.series ? <><img src={provideImageUrl((details as TvSeriesDetails).poster_path)} alt="?"/></> : <></>}
            </div>) :
        <div className={"Empty"}>
          <div className={"Text"}>
            <FontAwesomeIcon icon={faHourglass}/>
            <div>You currently have no shows added to your history</div>
          </div>
          <div className={"Badge"} onClick={() => document.getElementById("search-input")!!.focus()}>
            <div className={"Button"}>try adding a show</div>
            <div className={"Button"}>explore shows</div>
          </div>
        </div>}
    </div>
  );
};
export default List;
