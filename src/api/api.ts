export const API_BACKEND_URL = process.env.API_BACKEND_URL || window.location.origin + "/api";

export const fetchWithCredentials = (method: string, path: string, body: string | undefined) => {
  const jwt = localStorage.getItem("auth");
  return fetchWith(method, path, body, `Bearer ${jwt}`);
};
export const fetchWith = async (method: string, path: string, body: string | undefined, auth?: string | undefined) => {
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
