import React, {MutableRefObject, useContext, useEffect} from "react";
import {faHourglass3, faLock, faRightFromBracket, faShareNodes, faTag, faTimeline, faTrashCan, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {IconLookup} from "@fortawesome/fontawesome-svg-core";
import {useGoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import ResetModal from "./ResetModal";
import {ModalContext} from "../context/ModalContext";
import {AppContext} from "../context/AppContext";
import {shareHistory} from "../../utils";
import "./ProfileOptions.scss";

const ProfileOptions = ({expanded, setExpanded, profileRef}: {
  expanded: boolean,
  setExpanded: (v: boolean) => void,
  profileRef: MutableRefObject<any>
}) => {
  const {deleteJwt, requestToken, name, email, loggedIn} = useContext(UserContext);
  const {openModal} = useContext(ModalContext);
  const {ogClock, setOgClock, items} = useContext(AppContext);
  const navigate = useNavigate();

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

  const googleLogin = useGoogleLogin({
    onError: errorResponse => {
      console.log(errorResponse);
    },
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      await requestToken(tokenResponse.access_token);
    },
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
        <div className={"Login"} onClick={() => googleLogin()}><FontAwesomeIcon icon={faGoogle}/>Login</div>
      </div>}

      <hr/>

      <Button icon={faUser} name={"Your Account"} action={() => undefined}/>
      <Button icon={faTimeline} name={"Social Timeline"} action={() => undefined}/>
      <Button icon={faShareNodes} name={"Share History"} action={() => shareHistory(items)}/>
      <Button icon={faHourglass3} name={"OG Clock"} action={toggleOgClock}><ButtonSlider enabled={ogClock}/></Button>
      <Button icon={faTag} name={"Features"} action={() => navigate("/welcome")}/>
      <div style={{height: "7px"}}/>
      <Button icon={faTrashCan} name={"Reset List"} className={"Danger"} action={() => openModal(<ResetModal/>)}/>
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
    <div className={"Button " + className} onClick={action}>
      <FontAwesomeIcon icon={icon}/>
      <p>{name}</p>
      {children}
    </div>
  );
};

const ButtonSlider = ({enabled}: { enabled: boolean }) => {
  return (
    <div className={"ButtonSlider " + (enabled ? "On" : "")}></div>
  );
};

export default ProfileOptions;
