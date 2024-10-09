import {faArrowRight, faCalculator, faCompass, faFilm, faHome, faLightbulb, faSearch, faTv} from "@fortawesome/free-solid-svg-icons";
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
          calculate the time you've been wasting<br/>
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

      <div className={"Features"}>

        <div className={"Entry"}>
          <img src={`${process.env.PUBLIC_URL}/showcase/movie.png`} alt="" loading="lazy"/>
          <span>
            <p className={"Title"}><FontAwesomeIcon icon={faFilm}/> add & count movies</p>
            <p className={"Explanation"}>
              Add the movies you have seen and rewatched.<br/>
              Use the movie collection feature to add all movies of a movie series at once.<br/>
            </p>
            <div className={"Button"} onClick={() => document.getElementById("search-input")?.focus()}><FontAwesomeIcon icon={faSearch}/> search for movies</div>
          </span>
        </div>

        <div className={"Entry"}>
          <img src={`${process.env.PUBLIC_URL}/showcase/series.png`} alt="" loading="lazy"/>
          <span>
            <p className={"Title"}><FontAwesomeIcon icon={faTv}/> add & track shows</p>
            <p className={"Explanation"}>
              Add the tv shows you have seen.<br/>
              Customize how many times you have rewatched certain seasons or not.<br/>
            </p>
            <div className={"Button"} onClick={() => document.getElementById("search-input")?.focus()}><FontAwesomeIcon icon={faSearch}/> search for series</div>
          </span>
        </div>

        <div className={"Entry"}>
          <img src={`${process.env.PUBLIC_URL}/showcase/clock.png`} alt="" loading="lazy"/>
          <span>
            <p className={"Title"}><FontAwesomeIcon icon={faCalculator}/> view your results</p>
            <p className={"Explanation"}>
              Get a detailed overview about your viewing history.<br/>
              Visualize your spent time with a square for every day.<br/>
              Find out and analyze out your viewing personality.<br/>
              And then calculate how much money you could have earned.<br/>
            </p>
            <div className={"Button"} onClick={() => navigate("/")}><FontAwesomeIcon icon={faHome}/> go to overview</div>
          </span>
        </div>

        <div className={"Entry"}>
          <img src={`${process.env.PUBLIC_URL}/showcase/discover.png`} alt="" loading="lazy"/>
          <span>
            <p className={"Title"}><FontAwesomeIcon icon={faLightbulb}/> discover shows</p>
            <p className={"Explanation"}>
              If you can't even remember what you all watched in the past,<br/>
              you can discover the most popular shows and movies and simply add them to your list.<br/>
            </p>
            <div className={"Button"} onClick={() => navigate("/discover")}><FontAwesomeIcon icon={faCompass}/> discover</div>
          </span>
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
