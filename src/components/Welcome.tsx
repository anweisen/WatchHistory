import {faArrowRight, faCompass, faHome} from "@fortawesome/free-solid-svg-icons";
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import Search from "./Search";
import {UserContext} from "./context/UserContext";
import {useGoogleOauthLogin} from "./ui/ShareDecisionModal";
import {Item} from "../utils";
import "./Welcome.scss";

const Welcome = ({openMenu}: { openMenu: (item: Item) => void }) => {
  const {loggedIn, name, picture, email} = useContext(UserContext);
  const googleLogin = useGoogleOauthLogin();
  const navigate = useNavigate();

  return (
    <div className={"Welcome"}>

      <div className={"Head"}>
        <div className={"BadgeButton"} onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome}/> go to overview <FontAwesomeIcon icon={faArrowRight}/>
        </div>
        <p className={"Title"}>Time Watching Series</p>
        <p className={"Subtitle"}>
          calculate the time you've been wasting with series<br/>
          it's the new definition of flexing<br/>
        </p>
        <span>
          {loggedIn
            ? <div className={"LoginButton"} onClick={() => navigate(`/@${email.replace(/@.*$/, "")}`)}><img src={picture} alt={""}/><p>{name}</p></div>
            : <div className={"LoginButton"} onClick={googleLogin}><FontAwesomeIcon icon={faGoogle}/><p>Login</p></div>
          }
          <a className={"LoginButton"} rel={"noreferrer"} target={"_blank"} href={"https://github.com/anweisen/WatchHistory"}>
            <FontAwesomeIcon icon={faGithub}/><p>GitHub</p>
          </a>
        </span>
      </div>

      <div className={"Options"}>
        <Search openMenu={openMenu}/>
        <div className={"Or"}>OR</div>
        <div className={"DiscoverSection"}>
          <span>
            <p>Already forgot what you've watched?</p>
            <p>Refresh your memory!</p>
          </span>
          <div onClick={() => navigate("/discover")}><FontAwesomeIcon icon={faCompass}/> discover shows</div>
        </div>
      </div>

      <hr/>

      <div className={"Showcase"}>
        <div className={"Entry"}>
          <h1>open source</h1>
          <span>
            <p>This project is open source. The repository can be found on <a href={"https://github.com/anweisen/WatchHistory"}>GitHub</a>.</p>
            <p>We are always happy to see new ideas being proposed by the community.</p>
          </span>
        </div>

        <div className={"Entry"}>
          <h1>powerd by tmdb</h1>
          <span>
            <p>This site is powered by the api of <a href={"https://tmdb.org"}>themoviedatabase.org</a>.</p>
            <p>Without the generosity of their service, this project would no be possible.</p>
            <p>We are in no way affiliated nor connected with <a href={"https://tmdb.org"}>tmdb.org</a>.</p>
          </span>
        </div>
      </div>

    </div>
  );
};

export default Welcome;
