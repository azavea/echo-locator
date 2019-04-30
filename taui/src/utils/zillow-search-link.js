// @flow
// Returns a link to Zillow rental search for zipcode and number of bedrooms
const ZILLOW_BASE_URL = 'https://www.zillow.com/homes/for_rent/'
export default function getZillowSearchLink (zipcode, rooms) {
  const zipcodeSearch = ZILLOW_BASE_URL + encodeURIComponent(zipcode) + '_rb/'
  return parseInt(rooms) > 0
    ? zipcodeSearch + encodeURIComponent(rooms) + '-_beds' : zipcodeSearch
}
