// @flow
// Returns a link to Google Search with the given search term
const GOOGLE_BASE_URL = 'https://www.google.com/search?q='
export default function getGoogleSearchLink (query) {
  return GOOGLE_BASE_URL + encodeURIComponent(query)
}
