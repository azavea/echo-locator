// @flow
import { createSelector } from "reselect";

import listNeighborhoods from "./list-neighborhoods";

// Returns currently reachable neighborhood count
export default createSelector(listNeighborhoods, (neighborhoods) => {
  return neighborhoods ? neighborhoods.length : 0;
});
