//Gsheet API Key + BHA Listings Spreadsheet ID:
const SHEET_ID = '1-oSni5SVKOjj_9YR4LPKN7N4UgPdi3eeFA8sM-X0XNw'
const RANGES = 'Sheet1'

import axios from 'axios'
//GSHEET_API_KEY
//reads from BHA Coronvirus google sheets -> returns data from spreadsheet SHEET_ID for RANGES as specified. 
export default function readSheetValues {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?ranges=${RANGES}&majorDimension=ROWS&key=${API_KEY}`)
      .then(response => response.json()).then(data => {
      let batchRowValues = data.valueRanges[0].values;
      const rows = [];
      for (let i = 1; i < batchRowValues.length; i++) {
        let rowObject = [];
        for (let j = 0; j < batchRowValues[i].length; j++) {
          rowObject.push(batchRowValues[i][j]);
        }
        rows.push(rowObject);
      }
      return rows;
    });
  }


//address to coordinate, using MapQuest
export default function fwdGeocode(address){
  let coord = [];
  fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_API_KEY}&location=${address}`)
      .then(response => response.json()).then(results => {

          lat = results.results[0].locations[0].latLng.lat;
          long = results.results[0].locations[0].latLng.long;
          coord.push(lat);
          coord.push(long);
          return (coord)
      })
      .catch(err => {
          console.log(err)
      })}