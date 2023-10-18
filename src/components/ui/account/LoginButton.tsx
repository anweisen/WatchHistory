import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import {useContext, useEffect} from "react";
import {UserContext} from "../../context/UserContext";

const LoginButton = () => {

  const { setName, setEmail, setLocale, setPicture } = useContext(UserContext);

  const processJwt = (jwt: any) => {
    const decoded: any = jwt_decode(jwt);
    console.log(decoded);
    setEmail(decoded.email);
    setName(decoded.given_name);
    setPicture(decoded.picture);
    setLocale(decoded.locale);
  };

  useEffect(() => {
    const jwtCredential = localStorage.getItem('auth');
    if (jwtCredential) {
      processJwt(jwtCredential);
    }
  }, []);

  const handleGoogleResponse = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential != null) {
      localStorage.setItem("auth", credentialResponse.credential);
      processJwt(credentialResponse.credential);
    }
  }

  return (
      <GoogleLogin size={"large"} text={"signin"} locale={"en-US"}
                   onSuccess={handleGoogleResponse}
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
