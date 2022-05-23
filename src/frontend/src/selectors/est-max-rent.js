// @flow
import get from "lodash/get";
import { createSelector } from "reselect";

import detailNeighborhood from "./detail-neighborhood";

export default createSelector(
  (state) => get(state, "data.userProfile"),
  detailNeighborhood,
  (userProfile, neighborhood) => {
    if (
      !userProfile ||
      !neighborhood ||
      (!userProfile.voucherRooms && !userProfile.nonVoucherRooms) ||
      !neighborhood.properties ||
      !neighborhood.properties[
        `max_rent_${
          userProfile.hasVoucher ? userProfile.voucherRooms : userProfile.nonVoucherRooms
        }br`
      ]
    ) {
      return 0;
    }
    return neighborhood.properties[
      `max_rent_${
        userProfile.hasVoucher ? userProfile.voucherRooms : userProfile.nonVoucherRooms
      }br`
    ];
  }
);
