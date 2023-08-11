import React, {useEffect, useState} from "react";
import {searchSeries} from "./tmdb/api";
import {SearchTvSeries} from "./tmdb/types";
import "./App.scss";
import Search from "./components/Search";

const App = () => {
  const [seriesResult, setSeriesResult] = useState<SearchTvSeries>();

  useEffect(() => {
    let theme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(theme);
  }, []);

  useEffect(() => {
    searchSeries("How I met your mother").then(setSeriesResult);
  }, []);

  return (
    <div className="App">

      <Search/>

    </div>
  );
};

export default App;
