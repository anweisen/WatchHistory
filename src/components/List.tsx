import React from "react";
import {faHourglass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {lookup, provideImageUrl} from "../tmdb/api";
import {Item, useForceUpdate} from "../utils";
import "./List.scss";

const List = ({items, openMenu}: { items: Item[], openMenu: (item: Item) => void }) => {
  const [, forceUpdate] = useForceUpdate();
  const navigate = useNavigate();

  return (
    <div className="List">
      {items.length > 0
        ? items.map(value => ({item: value, details: lookup(value, forceUpdate)}))
          .map(({item, details}) =>
            <div key={item.id} className={"Item"} onClick={() => openMenu(item)}>
              {!details ? <></> : <img src={provideImageUrl(details.poster_path)} alt="?"/>}
            </div>)
        : <Empty navigate={navigate}/>}
    </div>
  );
};

const Empty = ({navigate}: { navigate: (to: string) => void }) => (
  <div className={"Empty"}>
    <div className={"Text"}>
      <FontAwesomeIcon icon={faHourglass}/>
      <div>You currently have no shows added to your history</div>
    </div>
    <div className={"Badge"}>
      <div className={"Button"} onClick={() => document.getElementById("search-input")!!.focus()}>try adding a show</div>
      <div className={"Button"} onClick={() => navigate("/discover")}>explore shows</div>
    </div>
  </div>
);

export default List;
