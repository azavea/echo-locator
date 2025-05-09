// @flow

export const clearLocalStorage = () => window.localStorage.clear();
export const retrieveConfig = (key) => JSON.parse(window.localStorage.getItem(key));
export const storeConfig = (key, json) =>
  window.localStorage.setItem(key, JSON.stringify(json, null, "  "));

export const networks = [
  {
    name: "Peak",
    url: `${process.env.NETWORK_URL_ROOT}/peak`,
    commuter: true,
  },
  {
    name: "Off Peak",
    url: `${process.env.NETWORK_URL_ROOT}/off-peak`,
    commuter: true,
  },
  {
    name: "Peak No Express",
    url: `${process.env.NETWORK_URL_ROOT}/peak-no-express`,
    commuter: false,
  },
  {
    name: "Off Peak No Express",
    url: `${process.env.NETWORK_URL_ROOT}/off-peak-no-express`,
    commuter: false,
  },
];
