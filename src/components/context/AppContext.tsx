import React, {createContext} from "react";
import { Item } from "../../utils";

type AppType = {
    items: Item[],
    setItems: React.Dispatch<React.SetStateAction<Item[]>>,
    writeItemsToCookies: (items: Item[]) => void
    retrieveItemsFromCookies: () => Item[],
    isSharedData: boolean
    ogClock: boolean,
    setOgClock: (v: boolean) => void
};

const AppData: AppType = {
    items: [],
    setItems: () => {},
    writeItemsToCookies: (items: Item[]) => {},
    retrieveItemsFromCookies: () => { return [] },
    isSharedData: false,
    ogClock: false,
    setOgClock: (v: boolean) => {},
}

export const AppContext = createContext(AppData);