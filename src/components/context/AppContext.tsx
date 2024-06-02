import React, {createContext} from "react";
import {Item} from "../../utils";

type AppType = {
  items: Item[],
  setItems: React.Dispatch<React.SetStateAction<Item[]>>,
  writeItemsToCookies: (items: Item[]) => void
  retrieveItemsFromCookies: () => Item[],
  isSharedData: boolean
  ogClock: boolean,
  setOgClock: (v: boolean) => void
  sync: () => Promise<void>
};

const AppData: AppType = {
  items: [],
  setItems: () => undefined,
  writeItemsToCookies: (items: Item[]) => undefined,
  retrieveItemsFromCookies: () => [],
  isSharedData: false,
  ogClock: false,
  setOgClock: (v: boolean) => undefined,
  sync: () => Promise.resolve()
};

export const AppContext = createContext(AppData);