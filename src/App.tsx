import {GoogleOAuthProvider} from "@react-oauth/google";
import React, {useContext, useEffect, useState} from "react";
import {Route, Routes, useLocation, useNavigate, useParams} from "react-router-dom";
import {ModalContext} from "./components/context/ModalContext";
import {AppContext} from "./components/context/AppContext";
import {UserContext, UserContextProvider} from "./components/context/UserContext";
import Search from "./components/Search";
import List from "./components/List";
import Menu from "./components/Menu";
import OgClock from "./components/clock/OgClock";
import Modal from "./components/ui/Modal";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import NewClock from "./components/clock/NewClock";
import Discover from "./components/Discover";
import Welcome from "./components/Welcome";
import LoginLoaderOverlay from "./components/ui/LoginLoaderOverlay";
import UserProfile, {RawUserProfile} from "./components/UserProfile";
import InstallButton from "./components/InstallButton";
import OfflineBadge from "./components/OfflineBadge";
import {CompiledValue, decodeItems, Item, useCalculateSummary} from "./utils";
import {fetchItemDelete, fetchItemUpdate, fetchSyncRequest} from "./api/account";
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
    if (location.pathname.startsWith("/@")) {
      document.title = `Watched • Profile (${decodeURIComponent(location.pathname.substring(2).replace("/", ""))})`;
    } else {
      document.title = `Watched`;
    }
  }, [location.pathname]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    setIsSharedData(false);
    setItems(items);

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
    fetchItemUpdate(item).then(console.log);
  };
  const removeItem = (item: Item) => {
    closeModal();
    setItems(prev => {
      const array = prev.filter(value => value.id !== item.id);
      localStorage.setItem("items", JSON.stringify(array));
      return array;
    });
    fetchItemDelete(item.id).then(console.log);
  };

  const openModal = (modal: React.ReactNode) => {
    setModalStack(prev => [...prev, modal]);
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

  const sync = async () => {
    const syncPayload = await fetchSyncRequest(items);
    setItems(syncPayload.items);
    writeItemsToCookies(syncPayload.items);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppContext.Provider value={{items, setItems, writeItemsToCookies, retrieveItemsFromCookies, isSharedData, ogClock, setOgClock, sync}}>
        <UserContextProvider>
          <ModalContext.Provider value={{openModal: openModal, closeModal: closeModal}}>
            <div className="App">
              <AppHooks/>

              <Modal visible={!modalClosing && modalStack.length > 0}>
                {modalStack[0]}
              </Modal>

              <div className="Content">
                <OfflineBadge/>

                <Routes>
                  <Route path={"/"} element={<DashboardComponent items={items} openMenu={openMenu}/>}/>
                  <Route path={"/discover"} element={<DiscoverComponent items={items} openMenu={openMenu} saveItem={saveItem}
                                                                        removeItem={removeItem}/>}/>
                  <Route path={"/welcome"} element={<WelcomeComponent openMenu={openMenu}/>}/>
                  <Route path={"/raw"} element={<RawUserProfileComponent/>}/>
                  <Route path={"/:user"} element={<UserProfileComponent/>}/>
                </Routes>

                <Footer/>
                <InstallButton/>
              </div>

            </div>
          </ModalContext.Provider>
        </UserContextProvider>
      </AppContext.Provider>
    </GoogleOAuthProvider>
  );
};

const AppHooks = () => {
  const {sync} = useContext(AppContext);
  const {processJwt} = useContext(UserContext);
  const {openModal, closeModal} = useContext(ModalContext);

  useEffect(() => {
    const doFetch = async (jwt: string) => {
      openModal(<LoginLoaderOverlay/>);
      try {
        await processJwt(jwt);
        await sync();
      } catch (ex) {
        console.error(ex);
      }
      closeModal();
    };

    console.log("THIS IS HAPPENMNG !!");
    const jwtCredential = localStorage.getItem("auth");
    if (jwtCredential !== null && jwtCredential !== undefined && jwtCredential !== "") {
      doFetch(jwtCredential);
    }
    // eslint-disable-next-line
  }, []);

  return <></>;
};

const PageNotFound = () => (
  <>
    <NavBar sitename="404"/>
    <div className={"NotFound"}>

    </div>
  </>
);

const DashboardComponent = ({openMenu, items}: {
  openMenu: (item: Item) => void,
  items: Item[]
}) => {
  const {values, time, finished} = useCalculateSummary(items);

  return (
    <>
      <NavBar sitename="overview"/>
      <ClockDisplay values={values} time={time} finished={finished} openMenu={openMenu}/>
      <Search openMenu={openMenu}/>
      <List items={items} values={values} openMenu={openMenu}/>
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

const RawUserProfileComponent = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.size > 0) {
      const items = decodeItems(queryParameters.keys().next().value);
      setItems(items);
      console.log(items);
    }
  }, []);

  return (
    <>
      <NavBar sitename={"profile"}/>
      <RawUserProfile items={items}/>
    </>
  );
};
const UserProfileComponent = () => {
  const {user} = useParams();

  if (user?.startsWith("@")) {
    const userId = user.substring(1);
    return (
      <>
        <NavBar sitename={"profile"}/>
        <UserProfile userId={userId}/>
      </>
    );
  } else {
    return <PageNotFound/>;
  }
};

const ClockDisplay = ({openMenu, values, time, finished}: {
  openMenu: (item: Item) => void,
  values: CompiledValue[] | undefined,
  time: number,
  finished: boolean
}) => {
  const {ogClock} = useContext(AppContext);

  const [wage, setWage] = useState(-1);
  const [currency, setCurrency] = useState("€");

  return ogClock
    ? <OgClock time={time} finished={finished} wage={wage} setWage={setWage} currency={currency} setCurrency={setCurrency}/>
    : <NewClock values={values} time={time} finished={finished} openMenu={openMenu}
                wage={wage} setWage={setWage} currency={currency} setCurrency={setCurrency}/>;
};

export default App;
