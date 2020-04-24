// @flow
// Returns a link to Zillow rental search for zipcode and number of bedrooms
const REALTOR_BASE_URL = 'https://www.realtor.com/apartments/'
export default function getZillowSearchLink (zipcode, rooms, budget) {
  let zipcodeSearch = REALTOR_BASE_URL + encodeURIComponent(zipcode) + '/price-na-' +
    encodeURIComponent(parseInt(budget)) + '/beds-'
  if (parseInt(rooms) > 0) {
    zipcodeSearch += encodeURIComponent(rooms)
  }
  return zipcodeSearch
}
