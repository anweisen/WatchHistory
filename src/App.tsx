import React, {useEffect, useState} from "react";
import Search from "./components/Search";
import List from "./components/List";
import Menu from "./components/Menu";
import Clock from "./components/Clock";
import {decodeItems, Item} from "./utils";
import "./App.scss";
import Modal from "./components/ui/Modal";
import {ModalContext} from "./components/ui/ModalContext";


const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [menuSubject, setMenuSubject] = useState<Item>();
  const [isSharedData, setIsSharedData] = useState(false);
  const [modalStack, setModalStack] = useState<React.ReactNode[]>([]);
  const [modalClosing, setModalClosing] = useState(false);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.size > 0) {
      const items = decodeItems(queryParameters.keys().next().value);
      setIsSharedData(true);
      setItems(items);
      console.log(items);
    } else {
      const items = JSON.parse(localStorage.getItem("items") || "[]");
      setIsSharedData(false);
      setItems(items);
    }

    let theme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(theme);
  }, []);

  const saveItem = (item: Item) => {
    closeModal();
    setItems(prev => {
      const array = [item, ...prev.filter(value => value.id !== item.id)];
      localStorage.setItem("items", JSON.stringify(array));
      return array;
    });
  };
  const removeItem = (item: Item) => {
    closeModal();
    setItems(prev => {
      const array = prev.filter(value => value.id !== item.id);
      localStorage.setItem("items", JSON.stringify(array));
      return array;
    });
  };

  const openModal = (modal: React.ReactNode) => {
    setModalStack(prev => [...prev, [modal, false]]);
  };
  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setModalClosing(false);
      setModalStack(prev => {
        const stack = [...prev];
        stack.pop();
        return stack;
      });
    }, 300);
  };

  const openMenu = (item: Item) => {
    // setMenuSubject(items.find(value => value.id === item.id) || item);
    openModal(<Menu item={item} saveItem={saveItem} removeItem={removeItem} cancel={closeModal} isSharedData={isSharedData}/>);
  };

  return (
    <ModalContext.Provider value={{openModal: openModal, closeModal: closeModal}}>
      <div className="App">

        <Modal visible={!modalClosing && modalStack.length > 0}>
          {modalStack[0]}
        </Modal>

        <div className="Content">
          <Clock items={items} isSharedData={isSharedData}/>
          <Search openMenu={openMenu}/>
          <List items={items} openMenu={openMenu}/>

          <div className="Footer">
            <div className={"Credits"}>
              ©️ 2023 <a href="https://github.com/anweisen">anweisen</a> & <a href={"https://github.com/kxmischesdomi"}>KxmischesDomi</a> • powered by <a href="https://www.themoviedb.org/">tmdb.org</a>
            </div>
          </div>

        </div>
      </div>
    </ModalContext.Provider>
  );
};
export default App;
