import {GoogleLogin} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import {useContext} from "react";
import {UserContext} from "../../context/UserContext";
import {Decipher} from "crypto";

const LoginButton = () => {

  var { setName, setEmail, setLocale, setPicture } = useContext(UserContext);

  return (
      <GoogleLogin size={"large"} text={"signin"} locale={"en-US"}
                   onSuccess={credentialResponse => {
                     if (credentialResponse.credential != null) {
                       const decoded: any = jwt_decode(credentialResponse.credential);
                       console.log(decoded);
                       setEmail(decoded.email);
                       setName(decoded.given_name);
                       setPicture(decoded.picture);
                       setLocale(decoded.locale);
                     }
                   }}
                   onError={() => {
                     console.log('Login Failed');
                   }}
                   useOneTap={true}
                   cancel_on_tap_outside={true}
                   width={140}
                   shape={"pill"}

      />
  );
};

export default LoginButton;
