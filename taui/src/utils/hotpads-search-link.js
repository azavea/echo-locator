// @flow
// Returns a link to Hotpads housing search for zipcode and number of bedrooms
const HOTPADS_BASE_URL = 'https://hotpads.com/'
export default function getHotpadsSearchLink (zipcode, rooms, maxSubsidy) {
  return HOTPADS_BASE_URL + encodeURIComponent(zipcode) + '/apartments-for-rent/?beds=' +
    encodeURIComponent(rooms) + '&price=0-' + encodeURIComponent(maxSubsidy)
}
