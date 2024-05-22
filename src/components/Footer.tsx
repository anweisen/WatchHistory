import React from "react";
import "./Footer.scss";

const Footer = () => (
  <div className="Footer">
    <div className={"Credits"}>
      <div>©️ 2023 - {new Date().getUTCFullYear()} <a href="https://github.com/anweisen" target="_blank">anweisen</a> & <a href="https://github.com/anweisen/WatchHistory/graphs/contributors" target="_blank">contributors</a></div>
      <span>•</span>
      <div>powered by <a href="https://www.themoviedb.org/">tmdb.org</a></div>
    </div>
  </div>
);

export default Footer;
