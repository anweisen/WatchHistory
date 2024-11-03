import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward, faHeart, faHeartCrack, faTrafficLight} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import NavBar from "../NavBar";

import "./PageError.scss";
import {faGithub} from "@fortawesome/free-brands-svg-icons";

const PageError = () => (
  <>
    <NavBar sitename="error"/>
    <div className={"Error"}>
      <span className={"Graphic"}>
        <FontAwesomeIcon icon={faHeart}/>
        <FontAwesomeIcon icon={faHeartCrack}/>
      </span>
      <div>
        <h1>something went wrong..</h1>
        <p>
          sorry, we could not fulfill your request today<br/>
          you might find the following helpful
        </p>
        <div className={"Buttons"}>
          <a href="/"><FontAwesomeIcon icon={faBackward}/> go back</a>
          <a href="https://monitor.anweisen.net"><FontAwesomeIcon icon={faTrafficLight}/> check status</a>
          <a href="https://github.com/anweisen/WatchHistory"><FontAwesomeIcon icon={faGithub}/> contribute</a>
        </div>
      </div>
    </div>
  </>
);
export default PageError;
