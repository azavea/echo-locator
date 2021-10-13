// @flow
// Returns a link to GoSection8 housing search for zipcode and number of bedrooms
const GOSECTION8_BASE_URL = 'https://www.gosection8.com/Tenant/tn_Results.aspx'
export default function getGoSection8SearchLink (zipcode, rooms, maxSubsidy) {
  return GOSECTION8_BASE_URL + '?Address=' + encodeURIComponent(zipcode) +
    '&bedrooms=' + encodeURIComponent(rooms) + '&maxRent=' + encodeURIComponent(maxSubsidy)
}
