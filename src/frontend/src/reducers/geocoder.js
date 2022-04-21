// @flow
import { handleActions } from "redux-actions";

export default handleActions(
  {
    "set start"(state, { payload }) {
      return {
        ...state,
        start: payload,
      };
    },
    "set end"(state, { payload }) {
      return {
        ...state,
        end: payload,
      };
    },
    "set geocoder"(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  {
    start: null,
    end: null,
    proximity: "-71.057929,42.360612",
    types: "country,region,postcode,district,place,locality,neighborhood,address,poi",
  }
);
