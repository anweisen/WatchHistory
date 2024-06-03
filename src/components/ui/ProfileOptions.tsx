import React, {MutableRefObject, useContext, useEffect} from "react";
import {faHourglass3, faLock, faRightFromBracket, faShareNodes, faTag, faTimeline, faTrashCan, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {IconLookup} from "@fortawesome/fontawesome-svg-core";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {ModalContext} from "../context/ModalContext";
import {AppContext} from "../context/AppContext";
import ResetModal from "./ResetModal";
import {useGoogleOauthLogin, useShareStrategy} from "./ShareDecisionModal";
import "./ProfileOptions.scss";

const ProfileOptions = ({expanded, setExpanded, profileRef}: {
  expanded: boolean,
  setExpanded: (v: boolean) => void,
  profileRef: MutableRefObject<any>
}) => {
  const {deleteJwt, name, email, loggedIn} = useContext(UserContext);
  const {openModal} = useContext(ModalContext);
  const {ogClock, setOgClock} = useContext(AppContext);
  const navigate = useNavigate();
  const share = useShareStrategy();
  const googleLogin = useGoogleOauthLogin();

  // register outside click, close results
  useEffect(() => {
    const handler = (event: Event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("click", handler, {capture: true});
    return () => document.removeEventListener("click", handler);
  });


  const toggleOgClock = () => {
    localStorage.setItem("ogclock", !ogClock + "");
    setOgClock(!ogClock);
  };

  return (
    <div className={"ProfileOptions" + (expanded ? " Expanded" : "")}>
      {name ? <div>
        <p className={"UserName"}>{name} <FontAwesomeIcon icon={faGoogle}/></p>
        <p className={"SignedInAs"}>{email}</p>
      </div> : <div className={"LoggedOut"}>
        <FontAwesomeIcon icon={faLock}/>
        <p>You're logged out</p>
        <div className={"Login"} onClick={googleLogin}><FontAwesomeIcon icon={faGoogle}/>Login</div>
      </div>}

      <hr/>

      {loggedIn && <Button icon={faUser} name={"Your Profile"} action={() => navigate(`/@${email.replace(/@.*$/, "")}`)}/>}
      {loggedIn && <Button icon={faTimeline} name={"Social Timeline"} action={() => undefined}/>}
      <Button icon={faShareNodes} name={"Share History"} action={share}/>
      <Button icon={faHourglass3} name={"OG Clock"} action={toggleOgClock}><ButtonSlider enabled={ogClock}/></Button>
      <Button icon={faTag} name={"Features"} action={() => navigate("/welcome")}/>
      <div style={{height: "7px"}}/>
      <Button icon={faTrashCan} name={"Reset Data"} className={"Danger"} action={() => openModal(<ResetModal/>)}/>
      {loggedIn && <Button icon={faRightFromBracket} name={"Logout"} className={"Danger"} action={deleteJwt}/>}
    </div>
  );
};

const Button = ({icon, name, action, className, children}: {
  icon: IconLookup;
  name: string,
  action: () => void,
  className?: string | undefined,
  children?: React.ReactNode
}) => {
  return (
    <div className={"Button" + (className ? " " + className : "")} onClick={action}>
      <FontAwesomeIcon icon={icon}/>
      <p>{name}</p>
      {children}
    </div>
  );
};

const ButtonSlider = ({enabled}: { enabled: boolean }) => (
  <div className={"ButtonSlider " + (enabled ? "On" : "")}></div>
);

export default ProfileOptions;
