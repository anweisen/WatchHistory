import {createContext} from "react";
import { Item } from "../../utils";

type AppType = {
    items: Item[],
    isSharedData: boolean
};

const AppData: AppType = {
    items: [],
    isSharedData: false
}

export const AppContext = createContext(AppData);