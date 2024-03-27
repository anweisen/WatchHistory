import "./Footer.scss";
import React from "react";

const Footer = () => (
  <div className="Footer">
    <div className={"Credits"}>
      <div>©️ 2023 - {new Date().getUTCFullYear()} <a href="https://github.com/anweisen">anweisen</a></div>
      <span>•</span>
      <div>powered by <a href="https://www.themoviedb.org/">tmdb.org</a></div>
    </div>
  </div>
);

export default Footer;
