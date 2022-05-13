// @flow
import get from "lodash/get";
import { createSelector } from "reselect";

export default createSelector(
  (state) => get(state, "data.networks"),
  (state) => get(state, "data.userProfile"),
  (networks, userProfile) => {
    // Default to use commuter rail if property not set
    const useCommuter =
      !userProfile || userProfile.useCommuterRail === undefined || !!userProfile.useCommuterRail;
    let index = networks.findIndex((n) => !!n.active);
    // Filter to first network that matches user profile setting to use commuter rail or not
    if (index === -1) {
      index = networks.findIndex((n) => !!n.commuter === useCommuter);
    }
    return index >= 0 ? index : 0;
  }
);
