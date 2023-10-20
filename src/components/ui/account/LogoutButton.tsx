import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import React, {useContext} from "react";
import {UserContext} from "../../context/UserContext";

const LogoutButton = () => {

  const {deleteJwt} = useContext(UserContext);

  return (
    <div className={"Button Logout"} onClick={deleteJwt}>
      <FontAwesomeIcon icon={faRightFromBracket} className={"ButtonIcon"}/>
      <p className={"ButtonTitle"}>Logout</p>
    </div>
  );
};

export default LogoutButton;