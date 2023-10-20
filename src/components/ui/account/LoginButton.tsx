import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useContext} from "react";
import {UserContext} from "../../context/UserContext";

const LoginButton = () => {

  const {processJwt} = useContext(UserContext);

  const handleGoogleResponse = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential != null) {
      processJwt(credentialResponse.credential);
    }
  };

  return (
    <GoogleLogin size={"large"} text={"signin"} locale={"en-US"}
                 onSuccess={handleGoogleResponse}
                 onError={() => {
                   console.log("Login Failed");
                 }}
                 useOneTap={(localStorage.getItem("auth") === null)}
                 cancel_on_tap_outside={true}
                 width={140}
                 shape={"pill"}
    />
  );
};

export default LoginButton;
