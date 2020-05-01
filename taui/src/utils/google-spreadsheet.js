//Gsheet API Key + BHA Listings Spreadsheet ID:
//tester:1-oSni5SVKOjj_9YR4LPKN7N4UgPdi3eeFA8sM-X0XNw
//real: 1aTsG_fm5CGYWiM-YJkfXKzJwEVWjo7-HNQ9t1S6_jQY
const SHEET_ID = '1-oSni5SVKOjj_9YR4LPKN7N4UgPdi3eeFA8sM-X0XNw'
const RANGES = 'Sheet1'

//or: Form+Responses+1

import axios from 'axios'
//GSHEET_API_KEY
//reads from BHA Coronvirus google sheets -> returns data from spreadsheet SHEET_ID for RANGES as specified. 
export default function readSheetValues() {
  const rows = [];
      axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${API_KEY}`)
      .then(response => {

      const data = response.data
      let batchRowValues = data.valueRanges[0].values;

      for (let i = 1; i < batchRowValues.length; i++) {
        let rowObject = {};
        for (let j = 0; j < batchRowValues[i].length; j++) {
          rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
        }
        rows.push(rowObject);
      }
    })

    return rows;
  }


//address to coordinate, using MapQuest
export function fwdGeocode(address){
  let coord = [];
  axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_API_KEY}&location=${address}`)
    .then(response => {
      const results = response.data
      let lat = results.results[0].locations[0].latLng.lat;
      let lng = results.results[0].locations[0].latLng.lng;
      coord.push(lat);
      coord.push(lng);
    })
    .catch(err => {
        console.log("fwdGeo", err)
    })
    return coord;
}
  