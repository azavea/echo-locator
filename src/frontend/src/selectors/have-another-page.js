// @flow
import { createSelector } from "reselect";

import { SIDEBAR_PAGE_SIZE } from "../constants";

import selectPage from "./page";
import listNeighborhoods from "./list-neighborhoods";

// Returns true if there are more neighborhoods to display in the list view
export default createSelector(selectPage, listNeighborhoods, (page, neighborhoods) => {
  const startingOffset = page * SIDEBAR_PAGE_SIZE;
  return neighborhoods && neighborhoods.length > startingOffset + SIDEBAR_PAGE_SIZE;
});
