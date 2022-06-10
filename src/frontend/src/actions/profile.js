// @flow
import axios from "axios";

import { retrieveConfig, storeConfig } from "../config";
import { PROFILE_CONFIG_KEY } from "../constants";

import { addActionLogItem } from "./log";
import { getNeighborhoods } from "./neighborhood";

export const loadProfile = () => (dispatch, getState) => {
  try {
    dispatch({ type: "set profile loading", payload: true });
    const json = retrieveConfig(PROFILE_CONFIG_KEY);
    dispatch({ type: "set profile", payload: json });
    return json;
  } catch (e) {
    console.error("Error parsing localStorage configuration " + PROFILE_CONFIG_KEY, e);
  }

  return {};
};

export const setProfile = (profile) => (dispatch, getState) => {
  try {
    addActionLogItem(`Updating currently selected account profile to  ${profile}`);
    storeConfig(PROFILE_CONFIG_KEY, profile);
    dispatch({ type: "set profile", payload: profile });
  } catch (e) {
    console.error("Error parsing localStorage configuration " + PROFILE_CONFIG_KEY, e);
  }
};

export const saveProfile = (profile, authToken) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`/api/user/`, profile, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const sendSignUpLink = (email) => (dispatch, getState) => {
  addActionLogItem(`Sending signup link to ${email}`);
  axios
    .post("/api/signup/", {
      username: email,
    })
    .then((response) => {
      dispatch({ type: "set login message", payload: response.data });
    })
    .catch((error) => {
      console.error("Error creating user profile", error);
      dispatch({ type: "set login message", payload: "SignIn.SignUpError" });
    });
};

export const sendLoginLink = (email) => (dispatch, getState) => {
  addActionLogItem(`Sending login link to ${email}`);
  axios.post("/api/login/", { username: email });
  dispatch({ type: "set login message", payload: "SignIn.LoginLinkSent" });
};

export const setLogout = (authToken) => (dispatch, getState) => {
  addActionLogItem(`Deleting token cookie`);
  axios
    .post("/api/logout/", null, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
    .then(() => {
      dispatch({ type: "set auth token", payload: null });
      dispatch({ type: "set profile", payload: null });
    });
};

export const setAuthToken = (authToken) => (dispatch, getState) => {
  addActionLogItem("Updating authToken");
  axios
    .get(`/api/user/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
    .then((response) => {
      dispatch(getNeighborhoods(authToken));
      dispatch({ type: "set auth token", payload: authToken });
      dispatch({ type: "set profile", payload: response.data });
    })
    .catch((error) => {
      console.error("Error fetching user profile", error);
      dispatch({ type: "set login message", payload: "SignIn.NoProfileFound" });
    });
};

export const setLoginMessage = (loginMessage) => (dispatch, getState) => {
  try {
    dispatch({ type: "set login message", payload: loginMessage });
  } catch (e) {
    console.error("Error updating login message", e);
  }
};
