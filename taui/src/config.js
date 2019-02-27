// @flow

export const retrieveConfig = (key) => JSON.parse(window.localStorage.getItem(key))
export const storeConfig = (key, json) =>
  window.localStorage.setItem(key, JSON.stringify(json, null, '  '))
