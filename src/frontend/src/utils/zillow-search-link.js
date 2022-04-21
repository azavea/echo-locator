// @flow
// Returns a link to Zillow rental search for zipcode and number of bedrooms
const ZILLOW_BASE_URL = "https://www.zillow.com/homes/for_rent/";
export default function getZillowSearchLink(zipcode, rooms, maxSubsidy) {
  let zipcodeSearch =
    ZILLOW_BASE_URL +
    encodeURIComponent(zipcode) +
    "_rb/" +
    "0-" +
    encodeURIComponent(maxSubsidy) +
    "_mp/";
  if (parseInt(rooms) > 0) {
    zipcodeSearch += encodeURIComponent(rooms) + "-_beds";
  }
  return zipcodeSearch;
}
