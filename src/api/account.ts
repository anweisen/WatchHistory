import {fetchWith, fetchWithCredentials} from "./api";
import {Item} from "../utils";

export type SyncPayload = {
  items: Item[]
}
export type UserAccountInfo = {
  items: Item[],
  user: {
    id: string,
    name: string,
    picture: string,
  }
}

export const fetchSyncRequest = async (items: Item[]): Promise<SyncPayload> => {
  const stringItems: { id: string, times: number[], series: boolean }[] = items.map(item => ({...item, id: item.id.toString()}));
  return fetchWithCredentials("POST", "/user/me/sync", JSON.stringify({items: stringItems}))
    .then(value => value.json())
    .then(value => value?.items?.map((item: any) => ({...item, id: parseInt(item.id)})))
    .then(value => ({items: value}));
};

export const fetchUserDelete = async () => {
  return fetchWithCredentials("DELETE", "/user/me", undefined)
    .then(value => value.json());
};
export const fetchItemUpdate = async (item: Item) => {
  return fetchWithCredentials("POST", "/user/me/item", JSON.stringify({item: {...item, id: item.id.toString()}}))
    .then(value => value.json());
};
export const fetchItemDelete = async (itemId: number) => {
  return fetchWithCredentials("DELETE", "/user/me/item", JSON.stringify({item_id: itemId.toString()}))
    .then(value => value.json());
};
export const fetchUserUnauthorized = async (userId: string) => {
  return fetchWith("GET", `/user/${userId}`, undefined, undefined)
    .then<UserAccountInfo>(value => value.json());
};
