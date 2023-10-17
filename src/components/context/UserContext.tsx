import React, {createContext, useState} from "react";

type UserType = {
  email: string,
  setEmail: (value: string) => void,
  name: string,
  setName: (value: string) => void,
  picture: string,
  setPicture: (value: string) => void,
  locale: string,
  setLocale: (value: string) => void,
};

const UserData: UserType = {
  email: "",
  setEmail: (value: string) => {},
  name: "",
  setName: (value: string) => {},
  picture: "",
  setPicture: (value: string) => {},
  locale: "",
  setLocale: (value) => {}
}

export const UserContext = createContext(UserData);

export const User = ({ children }: { children: React.ReactNode }) => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('Someone');
  const [picture, setPicture] = useState('');
  const [locale, setLocale] = useState('');

  return (
      <UserContext.Provider value={{ email: email, setEmail: setEmail, name: name, setName: setName, picture: picture, setPicture: setPicture, locale: locale, setLocale: setLocale }}>
        {children}
      </UserContext.Provider>
  );

}

