import React, {createContext} from "react";

export const ModalContext = createContext({ openModal: (element: React.ReactElement) => { } , closeModal: () => {} });