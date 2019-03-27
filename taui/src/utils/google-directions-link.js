// @flow
// Returns a link to Google Maps with the given search term
// See: https://developers.google.com/maps/documentation/urls/guide#directions-action
const GOOGLE_BASE_URL = 'https://www.google.com/maps/search/?api=1&query='
export default function getGoogleDirectionsLink (query) {
  return GOOGLE_BASE_URL + encodeURIComponent(query)
}
