import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamation, faUser, faUserCheck, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Loader from "./Loader";
import List from "./List";
import NewClock from "./clock/NewClock";
import {CompiledValue, Item, useCalculateSummary} from "../utils";
import {fetchUserUnauthorized, UserAccountInfo} from "../api/account";
import "./UserProfile.scss";

const UserProfile = ({userId}: {
  userId: string
}) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<UserAccountInfo | undefined>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    fetchUserUnauthorized(userId)
      .then(setUserInfo)
      .catch(setError);
  }, [userId]);

  return (
    <div className={"UserProfile"}>
      {
        error
          ? <UnknownUser navigate={() => navigate(-1)}/>
          : !userInfo
            ? <div className={"Loading"}><Loader/></div>
            : <UserProfileContent userName={userId} userInfo={userInfo}/>
      }
    </div>
  );
};

export const RawUserProfile = ({items}: {
  items: Item[]
}) => {
  return (
    <div className={"UserProfile"}>
      <UserProfileContent userName={"raw data"} userInfo={{items: items, user: {name: "Anonymous", id: "", picture: ""}}}/>
    </div>
  );
};

const UnknownUser = ({navigate}: { navigate: () => void }) => (
  <div className={"UnknownUser"}>
    <FontAwesomeIcon icon={faExclamation}/>
    <span>
      <p>the requested user does not exist</p>
      <div className={"Button"} onClick={navigate}>go back</div>
    </span>
  </div>
);

const UserProfileContent = ({userName, userInfo}: {
  userName: string,
  userInfo: UserAccountInfo,
}) => {
  const {values, finished, time} = useCalculateSummary(userInfo.items);

  return (
    <>
      <div className={"Banner"}>
        <UserInfo userName={userName} userInfo={userInfo}/>
        <Ranking values={values}/>
      </div>
      <NewClock values={values} finished={finished} time={time} openMenu={() => undefined}
                wage={12} setWage={() => undefined} currency={"€"} setCurrency={() => undefined}/>
      <hr/>
      <List items={userInfo.items} values={values} openMenu={() => undefined}/>
    </>
  );
};

const UserInfo = ({userName, userInfo}: {
  userName: string,
  userInfo: UserAccountInfo,
}) => {
  return (
    <div className={"UserInfo"}>
      <div className={"ProfilePicture"}>
        {userInfo.user.picture
          ? <img src={userInfo.user.picture} alt={""}/>
          : <FontAwesomeIcon icon={faUser}/>
        }
      </div>
      <span>
        <div className={"DisplayName"}>{userInfo.user.name}</div>
        <div className={"UserName"}>{userName}</div>
      </span>
      <hr/>
      <span>
        <div className={"FriendsAmount"}>01</div>
        <div className={"FriendsLabel"}>friends</div>
      </span>
    </div>
  );
};

const Ranking = ({values}: { values: CompiledValue[] | undefined }) => {
  const [ranked, setRanked] = useState<CompiledValue[]>();

  useEffect(() => {
    if (!values) return;
    const sorted = [...values].sort((a, b) => b.runtime - a.runtime);
    setRanked(sorted.slice(0, 3));
  }, [values]);

  return (
    <div className={"Ranking"}>
      <div className={"Rank Second"}>
        <div className={"Bar"}><p>2</p></div>
        <div className={"Image"}>
          {ranked && (ranked?.length || 0) >= 2 && <img src={ranked?.at(1)?.details?.poster_url} alt={""}/>}
        </div>
      </div>
      <div className={"Rank First"}>
        <div className={"Bar"}><p>1</p></div>
        <div className={"Image"}>
          {ranked && (ranked?.length || 0) >= 1 && <img src={ranked?.at(0)?.details?.poster_url} alt={""}/>}
        </div>
      </div>
      <div className={"Rank Third"}>
        <div className={"Bar"}><p>3</p></div>
        <div className={"Image"}>
          {ranked && (ranked?.length || 0) >= 3 && <img src={ranked?.at(2)?.details?.poster_url} alt={""}/>}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
