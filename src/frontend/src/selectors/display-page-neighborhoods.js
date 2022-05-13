// @flow
import { createSelector } from "reselect";

import { SIDEBAR_PAGE_SIZE } from "../constants";

import selectPage from "./page";
import listNeighborhoods from "./list-neighborhoods";

// Returns the sorted neighborhoods for the list, either all or user favorites
export default createSelector(listNeighborhoods, selectPage, (neighborhoods, page) => {
  if (!neighborhoods) {
    return [];
  }
  const startingOffset = page * SIDEBAR_PAGE_SIZE;
  const result =
    neighborhoods && neighborhoods.length
      ? neighborhoods.slice(startingOffset, SIDEBAR_PAGE_SIZE + startingOffset)
      : [];
  return result.map((n) => {
    n.properties.routable = true; // mark as routable for shared click interaction
    return n;
  });
});
