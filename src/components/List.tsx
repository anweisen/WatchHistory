import React, {useState} from "react";
import {faChevronUp, faDisplay, faFilm, faHourglass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconLookup} from "@fortawesome/fontawesome-svg-core";
import {useNavigate} from "react-router-dom";
import {CompiledValue, Item} from "../utils";
import "./List.scss";

const List = ({items, values, openMenu}: { items: Item[], values: CompiledValue[] | undefined, openMenu: (item: Item) => void }) => {
  const navigate = useNavigate();

  const series = items.filter(item => item.series).map(item => (values?.find(value => value.item.id === item.id)));
  const movies = items.filter(item => !item.series).map(item => (values?.find(value => value.item.id === item.id)));

  return items?.length === 0
    ? <div className={"List"}><Empty navigate={navigate}/></div>
    : (series.length === items.length)
      ? <ListContent items={series} openMenu={openMenu}/>
      : (movies.length === items.length)
        ? <ListContent items={movies} openMenu={openMenu}/>
        : (
          <div className={"ListWrapper"}>
            <ListGroup items={series} openMenu={openMenu} icon={faDisplay} label={"tv series"}/>
            <ListGroup items={movies} openMenu={openMenu} icon={faFilm} label={"movies"}/>
          </div>
        );
};

const ListContent = ({items, openMenu}: { items: (CompiledValue | undefined)[], openMenu: (item: Item) => void }) => (
  <div className={"List"}>
    {items.map((value, index) => (
      <div key={index + "-" + value?.item.id} className={"Item"} onClick={() => openMenu(value?.item!!)}>
        {!value ? <></> : <img src={value.details.poster_url} alt="?" loading="lazy"/>}
      </div>
    ))}
  </div>
);

const ListGroup = ({items, openMenu, icon, label}: { items: (CompiledValue | undefined)[], openMenu: (item: Item) => void, icon: IconLookup, label: string }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={"ListGroup" + (expanded ? "" : " Hidden")}>
      <div className={"ListLabel"} onClick={() => setExpanded(prev => !prev)}><FontAwesomeIcon icon={icon}/> {label} <FontAwesomeIcon icon={faChevronUp}/></div>
      <ListContent items={items} openMenu={openMenu}/>
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
