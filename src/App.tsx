import React, {useEffect, useState} from "react";
import Search from "./components/Search";
import List from "./components/List";
import "./App.scss";
import Menu from "./components/Menu";
import Clock from "./components/Clock";

export interface Item {
  id: number;
  series: boolean; // movie otherwise
  times: number[]; // array for seasons
}

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [menuSubject, setMenuSubject] = useState<Item>();

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("items") || "[]"));
    let theme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(theme);
  }, []);

  const saveItem = (item: Item) => {
    setMenuSubject(undefined);
    setItems(prev => {
      const array = [item, ...prev.filter(value => value.id !== item.id)];
      localStorage.setItem("items", JSON.stringify(array));
      return array;
    });
  };
  const openMenu = (item: Item) => {
    setMenuSubject(items.find(value => value.id === item.id) || item);
  };

  return (
    <div className="App">
      {menuSubject && <Menu item={menuSubject} saveItem={saveItem}/>}

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
