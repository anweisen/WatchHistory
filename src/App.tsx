import React, {useEffect, useState} from "react";
import Search from "./components/Search";
import List from "./components/List";
import Menu from "./components/Menu";
import Clock from "./components/Clock";
import Modal from "./components/ui/Modal";
import {decodeItems, Item} from "./utils";
import {ModalContext} from "./components/context/ModalContext";
import {AppContext} from "./components/context/AppContext";
import "./App.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ContextMenu from "./components/ui/ContextMenu";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {User, UserContext} from "./components/context/UserContext";

const App = () => {
  const clientId = "844222772441-jvkf4clda9h3sh3amdntjehmii17iugo.apps.googleusercontent.com";

  const [items, setItems] = useState<Item[]>([]);
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

  const retrieveItemsFromCookies = (): Item[] => {
    return JSON.parse(localStorage.getItem("items") || "[]");
  };

  const writeItemsToCookies = (items: Item[]) => {
    localStorage.setItem("items", JSON.stringify(items));
  };

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
    openModal(<Menu item={item} saveItem={saveItem} removeItem={removeItem} cancel={closeModal} isSharedData={isSharedData}/>);
  };

  return (
      <GoogleOAuthProvider clientId={clientId}>
        <User>
          <AppContext.Provider value={{items: items, setItems: setItems, writeItemsToCookies: writeItemsToCookies, retrieveItemsFromCookies: retrieveItemsFromCookies, isSharedData: isSharedData}}>
            <ModalContext.Provider value={{openModal: openModal, closeModal: closeModal}}>
              <div className="App">

                <Modal visible={!modalClosing && modalStack.length > 0}>
                  {modalStack[0]}
                </Modal>

                <ContextMenu />

                <div className="Content">
                  <Clock items={items}/>
                  <Search openMenu={openMenu}/>
                  <List items={items} openMenu={openMenu}/>

                  <div className="Footer">
                    <div className={"Credits"}>
                      <div>©️ 2023 <a href="https://github.com/anweisen">anweisen</a> & <a href={"https://github.com/kxmischesdomi"}>KxmischesDomi</a></div>
                      <span>•</span>
                      <div>powered by <a href="https://www.themoviedb.org/">tmdb.org</a></div>
                    </div>
                  </div>

                </div>
              </div>
            </ModalContext.Provider>
          </AppContext.Provider>
        </User>
      </GoogleOAuthProvider>
  );
};
export default App;
