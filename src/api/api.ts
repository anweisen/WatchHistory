import {Item} from "../utils";

export const API_BACKEND_URL = process.env.API_BACKEND_URL || window.location.origin + "/api";

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

const fetchWithCredentials = (method: string, path: string, body: string | undefined) => {
  const jwt = localStorage.getItem("auth");
  return fetchWith(method, path, body, `Bearer ${jwt}`);
};
const fetchWith = async (method: string, path: string, body: string | undefined, auth: string | undefined) => {
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (auth) headers["Authorization"] = auth;
  return fetch(API_BACKEND_URL + path, {
    method: method,
    body: body,
    headers: headers
  }).then(value => {
    if (value.status !== 200) {
      throw new Error(`HTTP Error ${value.status}: ${value.statusText}`);
    } else {
      return value;
    }
  });
};
