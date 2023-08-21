import React, {useEffect, useState} from "react";
import Search from "./components/Search";
import List from "./components/List";
import Menu from "./components/Menu";
import Clock from "./components/Clock";
import {decodeItems, encodeItems, Item} from "./utils";
import "./App.scss";


const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [menuSubject, setMenuSubject] = useState<Item>();

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.size > 0) {
      const items = decodeItems(queryParameters.keys().next().value);
      setItems(items);
      console.log(items);
    } else {
      const items = JSON.parse(localStorage.getItem("items") || "[]");
      setItems(items);
    }

    let theme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(theme);
  }, []);

  const saveItem = (item: Item) => {
    closeMenu();
    setItems(prev => {
      const array = [item, ...prev.filter(value => value.id !== item.id)];
      localStorage.setItem("items", JSON.stringify(array));
      return array;
    });
  };
  const removeItem = (item: Item) => {
    closeMenu();
    setItems(prev => {
      const array = prev.filter(value => value.id !== item.id);
      localStorage.setItem("items", JSON.stringify(array));
      return array;
    });
  };
  const openMenu = (item: Item) => {
    setMenuSubject(items.find(value => value.id === item.id) || item);
  };
  const closeMenu = () => {
    setMenuSubject(undefined);
  };

  return (
    <div className="App">
      {menuSubject && <Menu item={menuSubject} saveItem={saveItem} removeItem={removeItem} cancel={closeMenu}/>}

      <div className="Content">
        <Clock items={items}/>
        <Search openMenu={openMenu}/>
        <List items={items} openMenu={openMenu}/>

        <div className="Credits">
          ©️ 2023 <a href="https://github.com/anweisen">anweisen</a> • powered by <a href="https://www.themoviedb.org/">tmdb.org</a>
        </div>
      </div>

    </div>
  );
};

export default App;
