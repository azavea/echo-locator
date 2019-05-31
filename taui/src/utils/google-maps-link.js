// @flow
// Returns a link to Google Maps with the given search term
const GOOGLE_BASE_URL = 'https://www.google.com/maps/place/'
export default function getGoogleSearchLink (query) {
  return GOOGLE_BASE_URL + encodeURIComponent(query)
}
