// @flow

/**
 * Update the map and store the settings as query parameters in the URL
 */
export function updateMap(payload: any) {
  // payload has zoom and/or centerCoordinates set
  return {
    type: "update map",
    payload,
  };
}
