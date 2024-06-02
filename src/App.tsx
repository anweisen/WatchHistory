import {GoogleOAuthProvider} from "@react-oauth/google";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {decodeItems, Item, useCalculateSummary} from "./utils";
import {ModalContext} from "./components/context/ModalContext";
import {AppContext} from "./components/context/AppContext";
import {UserContextProvider} from "./components/context/UserContext";
import Search from "./components/Search";
import List from "./components/List";
import Menu from "./components/Menu";
import OgClock from "./components/clock/OgClock";
import Modal from "./components/ui/Modal";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import NewClock from "./components/clock/NewClock";
import Discover from "./components/Discover";
import {lookup, lookupRuntime} from "./tmdb/api";
import {MovieDetails, TvSeriesDetails} from "./tmdb/types";
import Welcome from "./components/Welcome";
import "./App.scss";

const App = () => {
  const clientId = "844222772441-jvkf4clda9h3sh3amdntjehmii17iugo.apps.googleusercontent.com";

  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState<Item[]>([]);
  const [isSharedData, setIsSharedData] = useState(false);
  const [ogClock, setOgClockState] = useState(localStorage.getItem("ogclock") === "true");
  const [couldRedirectWelcome, setCouldRedirectWelcome] =
    useState(location.pathname === "/" && (!localStorage.getItem("items") || localStorage.getItem("items") === "[]"));
  const [modalStack, setModalStack] = useState<React.ReactNode[]>([]);
  const [modalClosing, setModalClosing] = useState(false);

  useEffect(() => {
    if (couldRedirectWelcome) {
      navigate("/welcome");
      setCouldRedirectWelcome(false);
    }
  }, [couldRedirectWelcome, navigate, items, location.pathname]);

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

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Esc" || event.key === "Escape") {
        if (modalStack.length > 0) {
          closeModal();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalStack]);

  const retrieveItemsFromCookies = (): Item[] => {
    return JSON.parse(localStorage.getItem("items") || "[]");
  };

  const writeItemsToCookies = (items: Item[]) => {
    localStorage.setItem("items", JSON.stringify(items));
  };

  const setOgClock = (v: boolean) => {
    setOgClockState(v);
    localStorage.setItem("ogclock", v + "");
  };

  const saveItem = (item: Item) => {
    if (location.pathname === "/welcome") {
      navigate("/");
    }
    console.log(item);
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
    openModal(<Menu item={item} key={item.id} saveItem={saveItem} removeItem={removeItem} cancel={closeModal} isSharedData={isSharedData}/>);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserContextProvider>
        <AppContext.Provider value={{items, setItems, writeItemsToCookies, retrieveItemsFromCookies, isSharedData, ogClock, setOgClock}}>
          <ModalContext.Provider value={{openModal: openModal, closeModal: closeModal}}>
            <div className="App">

              <Modal visible={!modalClosing && modalStack.length > 0}>
                {modalStack[0]}
              </Modal>

              <div className="Content">

                <Routes>
                  <Route path={"/"} element={<DashboardComponent items={items} openMenu={openMenu}/>}/>
                  <Route path={"/discover"} element={<DiscoverComponent items={items} openMenu={openMenu} saveItem={saveItem}
                                                                        removeItem={removeItem}/>}/>
                  <Route path={"/welcome"} element={<WelcomeComponent openMenu={openMenu}/>}/>
                  <Route path={"*"} element={<PageNotFound/>}/>
                </Routes>

                <Footer/>
              </div>

            </div>
          </ModalContext.Provider>
        </AppContext.Provider>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
};

const PageNotFound = () => (
  <>
    <NavBar sitename="404"/>
  </>
);

const DashboardComponent = ({openMenu, items}: {
  openMenu: (item: Item) => void,
  items: Item[]
}) => {
  return (
    <>
      <NavBar sitename="overview"/>
      <ClockDisplay openMenu={openMenu}/>
      <Search openMenu={openMenu}/>
      <List items={items} openMenu={openMenu}/>
    </>
  );
};

const DiscoverComponent = ({items, openMenu, saveItem, removeItem}: {
  items: Item[],
  openMenu: (item: Item) => void,
  saveItem: (item: Item) => void,
  removeItem: (item: Item) => void
}) => {
  return (
    <>
      <NavBar sitename="discover"/>
      <Discover items={items} openMenu={openMenu} saveItem={saveItem} removeItem={removeItem}/>
    </>
  );
};

const WelcomeComponent = ({openMenu}: {
  openMenu: (item: Item) => void,
}) => {
  return (
    <>
      <NavBar sitename={"welcome"}/>
      <Welcome openMenu={openMenu}/>
    </>
  );
};

export type CompiledValue = { item: Item, details?: TvSeriesDetails | MovieDetails | undefined, runtime: number }

const ClockDisplay = ({openMenu}: { openMenu: (item: Item) => void }) => {
  const {items, ogClock} = useContext(AppContext);
  const {values, time, finished} = useCalculateSummary(items);

  const [wage, setWage] = useState(-1);
  const [currency, setCurrency] = useState("€");

  return ogClock
    ? <OgClock items={items} time={time} finished={finished} wage={wage} setWage={setWage} currency={currency} setCurrency={setCurrency}/>
    : <NewClock values={values} time={time} finished={finished} openMenu={openMenu} wage={wage} setWage={setWage} currency={currency}
                setCurrency={setCurrency}/>;
};

export default App;
