import React, {createContext, useState} from "react";
import jwtDecode from "jwt-decode";
import {API_BACKEND_URL} from "../../api/api";

type UserType = {
  loggedIn: boolean,
  email: string,
  name: string,
  picture: string,
  locale: string,
  processJwt: (value: string) => Promise<void>,
  deleteJwt: () => void,
  exchangeAuthCode: (code: string) => Promise<void>
};

const DefaultUserData: UserType = {
  loggedIn: false,
  email: "",
  name: "",
  picture: "",
  locale: "",
  processJwt: (value: string) => Promise.resolve(),
  deleteJwt: () => undefined,
  exchangeAuthCode: (code: string) => Promise.resolve()
};

export const UserContext = createContext(DefaultUserData);

export const UserContextProvider = ({children}: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [locale, setLocale] = useState("");

  const processJwt = async (jwt: string): Promise<void> => {
    localStorage.setItem("auth", jwt);

    try {
      const decoded: any = jwtDecode(jwt);
      console.log(decoded);

      if (Date.now() > decoded.exp * 1000) {
        const token = await refreshIdToken(jwt);
        return processJwt(token);
      }
      // issued in the future
      if (parseInt(decoded.iat) * 1000 > Date.now()) {
        console.log(parseInt(decoded.iat) * 1000 - Date.now());
        await new Promise(resolve => setTimeout(resolve, parseInt(decoded.iat) * 1000 - Date.now()))
      }

      setEmail(decoded.email);
      setName(decoded.name);
      setPicture(decoded.picture);
      setLocale(decoded.locale);
      setLoggedIn(true);
    } catch (ex) {
      console.error("cannot decode jwt", ex);
    }
  };

  const deleteJwt = () => {
    localStorage.removeItem("auth");
    setEmail("");
    setName("");
    setPicture("");
    setLocale("");
    setLoggedIn(false);
  };

  const exchangeAuthCode = async (code: string) => {
    const resp = await fetch(API_BACKEND_URL + "/auth/exchange", {
      method: "POST",
      body: JSON.stringify({
        code: code,
        provider: "google"
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    }).then(value => value.json());
    console.log(resp);

    if (!resp.success) return;
    await processJwt(resp.id_token);
  };

  const refreshIdToken = async (token: string): Promise<string> => {
    const resp = await fetch(API_BACKEND_URL + "/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(value => value.json());

    return resp.id_token;
  };

  return (
    <UserContext.Provider value={{loggedIn, email, name, picture, locale, processJwt, deleteJwt, exchangeAuthCode}}>
      {children}
    </UserContext.Provider>
  );

};

