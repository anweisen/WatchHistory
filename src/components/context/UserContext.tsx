import React, {createContext, useEffect, useState} from "react";
import {log} from "util";
import jwt_decode from "jwt-decode";

type UserType = {
  loggedIn: boolean,
  setLoggedIn: (value: boolean) => void,
  email: string,
  setEmail: (value: string) => void,
  name: string,
  setName: (value: string) => void,
  picture: string,
  setPicture: (value: string) => void,
  locale: string,
  setLocale: (value: string) => void,
  processJwt: (value: any) => void,
  deleteJwt: () => void
};

const UserData: UserType = {
  loggedIn: false,
  setLoggedIn: (value: boolean) => {},
  email: "",
  setEmail: (value: string) => {},
  name: "",
  setName: (value: string) => {},
  picture: "",
  setPicture: (value: string) => {},
  locale: "",
  setLocale: (value: string) => {},
  processJwt: (value: any) => {},
  deleteJwt: () => {}
}

export const UserContext = createContext(UserData);

export const User = ({ children }: { children: React.ReactNode }) => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('Someone');
  const [picture, setPicture] = useState('');
  const [locale, setLocale] = useState('');

  const processJwt = (jwt: any) => {
    localStorage.setItem("auth", jwt);
    const decoded: any = jwt_decode(jwt);
    console.log(decoded);
    setEmail(decoded.email);
    setName(decoded.given_name);
    setPicture(decoded.picture);
    setLocale(decoded.locale);
    setLoggedIn(true);
  };

  const deleteJwt = () => {
    localStorage.removeItem("auth");
    setEmail("");
    setName("");
    setPicture("");
    setLocale("");
    setLoggedIn(false);
  }

  useEffect(() => {
    const jwtCredential = localStorage.getItem('auth');
    if (jwtCredential) {
      processJwt(jwtCredential);
    }
  }, []);

  return (
      <UserContext.Provider value={{ loggedIn: loggedIn, setLoggedIn: setLoggedIn, email: email, setEmail: setEmail, name: name, setName: setName, picture: picture, setPicture: setPicture, locale: locale, setLocale: setLocale, processJwt: processJwt, deleteJwt: deleteJwt }}>
        {children}
      </UserContext.Provider>
  );

}

