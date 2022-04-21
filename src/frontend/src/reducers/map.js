// @flow
import { handleActions } from "redux-actions";

export default handleActions(
  {
    "update map"(state, action) {
      return { ...state, ...action.payload };
    },
    "set start"(state, action) {
      const newCenter = action.payload && action.payload.position;
      return {
        ...state,
        centerCoordinates: newCenter,
      };
    },
    "set origin"(state, action) {
      const newCenter = action.payload && action.payload.position;
      return {
        ...state,
        centerCoordinates: newCenter,
      };
    },
  },
  {
    zoom: 13,
    // Leaflet style (lat,lon)
    centerCoordinates: [42.360612, -71.057929],
  }
);
