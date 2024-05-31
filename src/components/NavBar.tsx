import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faUser} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UserContext} from "./context/UserContext";
import ProfileOptions from "./ui/ProfileOptions";
import "./NavBar.scss";

const NavBar = ({sitename}: { sitename: string }) => {
  const {loggedIn, name, picture} = useContext(UserContext);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className={"NavBar"}>
      <span className={"Branding"}>
        <IconSvg onClick={() => navigate("/")}/>
        <div>
          <div className={"Title"}>
            <p>Watched</p>
            <span className={"AltTitle"}>Time Wasted</span>
          </div>
          <div className={"Sitename"}>
            <p>{sitename}</p>
            <span>{[["overview", "/"], ["discover"], ["welcome"]].map(([value, path], index) => (
              <div key={index} onClick={() => navigate(path || "/" + value)}>{value}</div>
            ))}</span>
          </div>
        </div>
      </span>

      <span ref={profileRef}>
        <div className={"Profile"} onClick={() => setOptionsVisible(prev => !prev)}>
          <div className={"ProfilePicture"}>
            {loggedIn && picture && true && picture !== ""
              ? <img src={picture} alt={""}/>
              : <FontAwesomeIcon icon={faUser}/>}
          </div>
          <FontAwesomeIcon className={"ProfileExpand" + (optionsVisible ? " Expanded" : "")} icon={faAngleDown}/>
        </div>
        <ProfileOptions expanded={optionsVisible} setExpanded={setOptionsVisible} profileRef={profileRef}/>
      </span>
    </div>
  );
};

const IconSvg = ({onClick}: { onClick: () => void }) => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className={"Icon"} onClick={onClick}>
    <g transform="matrix(3.092065095901489, 0, 0, 3.0920650959014893, -517.6794360661147, -555.6766279136087)">
      <path style={{"fill": "rgb(255, 255, 255)", "fillRule": "nonzero", "strokeLinejoin": "round", "strokeWidth": "0.821098px"}}
            d="M 302 296 L 255.671 253.502 L 308.324 202.693 C 334.569 239.073 320.96 275.309 302 296 Z M 247.223 328.941 L 175.099 329.348 L 208.908 296.1 L 302 296 C 290.744 309.613 268.519 327.867 247.223 328.941 Z"/>
      <polygon style={{"fill": "none", "stroke": "rgb(255, 255, 255)", "strokeLinejoin": "round", "strokeWidth": "4.10549px"}}
               points="212.741 218.539 212.178 271.805 241.214 244.503"/>
    </g>
  </svg>
);

export default NavBar;
