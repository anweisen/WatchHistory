import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchUserUnauthorized, UserAccountInfo} from "../../api/account";
import {ModalContext} from "../context/ModalContext";
import Loader from "../Loader";
import "./FriendsModal.scss";

const FriendsModal = ({userInfo}: { userInfo: UserAccountInfo }) => {
  const {closeModal} = useContext(ModalContext);
  const [info, setInfo] = useState<Record<string, UserAccountInfo>>({});
  const navigate = useNavigate();

  useEffect(() => {
    setInfo({});
    for (let friend of userInfo.friends || []) {
      fetchUserUnauthorized(friend).then(value => setInfo(prev => ({...prev, [friend]: value})));
    }
  }, [userInfo]);

  return (
    <div className={"FriendsModal ImportModal AnimatedModalContent DefaultModalContent SimpleModal"}>
      <div className={"ModalTitle"}>Friends
        <p className={"Amount"}>{userInfo.friends?.length || 0}</p>
      </div>
      <hr/>
      {!userInfo.friends?.length
        ? <div className={"Empty"}>{userInfo.user.display} got friends yet :(</div>
        : Object.values(info).length !== userInfo.friends.length
          ? <Loader/>
          : <div className={"Entries"}>{userInfo.friends?.map((friendId) => info[friendId])?.map(info => (
            <div key={info.user.id} className={"Entry"} onClick={() => {
              navigate(`/@${info.user.username}`);
              closeModal();
            }}>
              <img src={info.user.picture} alt=""/>
              <span>
                <p className={"DisplayName"}>{info.user.display}</p>
                <p className={"UserName"}>{info.user.username}</p>
              </span>
            </div>
          ))}</div>
      }

      <div className={"Buttons"}>
        <div className="Button Cancel" onClick={() => closeModal()}><FontAwesomeIcon icon={faAngleLeft}/> Cancel</div>
      </div>
    </div>
  );
};

export default FriendsModal;
