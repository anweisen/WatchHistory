import {useContext} from "react";
import {ModalContext} from "../context/ModalContext";
import Loader from "../Loader";
import "./LoginLoaderOverlay.scss";

const LoginLoaderOverlay = () => {
  const {closeModal} = useContext(ModalContext);

  return (
    <div className={"LoginLoaderOverlay SimplyAnimatedModalContent"}>
      <div className={"Title"}>Processing Login</div>
      <Loader/>
      <div className={"TextButton"} onClick={closeModal}>Close</div>
    </div>
  );
};
export default LoginLoaderOverlay;
