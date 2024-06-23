import React from "react";
import {faHourglass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {CompiledValue, Item} from "../utils";
import "./List.scss";

const List = ({items, values, openMenu}: { items: Item[], values: CompiledValue[] | undefined, openMenu: (item: Item) => void }) => {
  const navigate = useNavigate();

  return (
    <div className="List">
      {items.length > 0
        ? items.map(item => (values?.find(value => value.item.id === item.id)))
          .map((value: CompiledValue | undefined, index: number) =>
            <div key={index + "-" + value?.item?.id} className={"Item"} onClick={() => openMenu(value?.item!!)}>
              {!value ? <></> : <img src={value?.details?.poster_url} alt="?"/>}
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
