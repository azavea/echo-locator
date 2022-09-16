// @flow
import fetch from "@conveyal/woonerf/fetch";

import { fwdGeocodeBatch } from "../utils/fwd-geocode";
import { REALTOR_BASE_URL, BHA_BASE_URL } from "../constants";
import { ActiveListing, Listing, ListingQuery } from "../types";

import { addActionLogItem } from "./log";

const REALTOR_ACTION_TYPE = "set Realtor listings";
const BHA_ACTION_TYPE = "set BHA listings";

const handleError = (error, name, actionType) => {
  console.error(`Error fetching ${name} listings.`);
  console.error(error);
  return { type: actionType, payload: { error } };
};

export const setRealtorListings =
  (payload: Listing | ListingQuery) => (dispatch: Dispatch, getState: any) => {
    // reset listings state to empty after error and on clicked neighborhood change
    if (payload.data && !payload.data.length) {
      dispatch({ type: REALTOR_ACTION_TYPE, payload });
    } else {
      addActionLogItem("Set Realtor listings");
      dispatch({ type: REALTOR_ACTION_TYPE, payload: { pending: true } });
      dispatch(
        fetch({
          url: REALTOR_BASE_URL,
          options: {
            method: "post",
            body: payload.query,
          },
          next: (error, response) => {
            // handle error here instead of automatically dispatching fetch's fetchError
            if (error) {
              return handleError(error, "Realtor", REALTOR_ACTION_TYPE);
            }
            try {
              return { type: REALTOR_ACTION_TYPE, payload: { data: response.value } };
            } catch (error) {
              return handleError(error, "Realtor", REALTOR_ACTION_TYPE);
            }
          },
        })
      );
    }
  };

export const setBHAListings =
  (payload: Listing | ListingQuery) => (dispatch: Dispatch, getState: any) => {
    // reset listings state to empty after error and on clicked neighborhood change
    if (payload.data && !payload.data.length) {
      dispatch({ type: BHA_ACTION_TYPE, payload });
    } else {
      const zipcode = payload.query.zipcode;
      const budget = payload.query.budget;
      // The BHA API is not currently filtering by rooms correctly
      // As a temporary fix, we took out the bedrooms query parameter so no listings are accidentally hidden
      const urlWithQuery = `${BHA_BASE_URL}zipcode=${zipcode}&budget=${budget}`;

      addActionLogItem("Set BHA listings");
      dispatch({ type: BHA_ACTION_TYPE, payload: { pending: true } });
      dispatch(
        fetch({
          url: urlWithQuery,
          next: (error, response) => {
            // handle error here instead of automatically dispatching fetch's fetchError
            if (error) {
              return handleError(error, "BHA", BHA_ACTION_TYPE);
            }
            return fwdGeocodeBatch(response.value)
              .then((data) => {
                return { type: BHA_ACTION_TYPE, payload: { data } };
              })
              .catch((error) => {
                return handleError(error, "BHA", BHA_ACTION_TYPE);
              });
          },
        })
      );
    }
  };

export const setActiveListing = (listing: ActiveListing) => (dispatch: Dispatch, getState: any) => {
  addActionLogItem(`Updating active listing to ${listing}`);
  dispatch({ type: "set active listing", payload: listing });
};
