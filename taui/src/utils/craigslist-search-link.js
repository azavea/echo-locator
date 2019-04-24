// @flow
// Returns a link to Boston area Craigslist housing search for zipcode and number of bedrooms
const CRAIGSLIST_BASE_URL = 'https://boston.craigslist.org/search/aap?postal='
export default function getCraigslistSearchLink (zipcode, rooms) {
  return CRAIGSLIST_BASE_URL + encodeURIComponent(zipcode) + '&min_bedrooms=' +
    encodeURIComponent(rooms) + '&max_bedrooms=' + encodeURIComponent(rooms)
}
