import React, {useEffect} from "react";
import Search from "./components/Search";
import "./App.scss";

const App = () => {

  useEffect(() => {
    let theme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(theme);
  }, []);

  return (
    <div className="App">

      <Search/>

    </div>
  );
};

export default App;
