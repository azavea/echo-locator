// This will replace google-spreadsheet.js to directly pull the listings from the our server

const request = require('request')
const axios = require('axios')

// This function is called by neighborhood-details to get the listings that match the parameters
export default function getBHAListings (zipcode, maxBudget, rooms) {
  const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/-get-bha-listings?zipcode='.concat(zipcode).concat('&rooms=').concat(rooms).concat('&budget=').concat(maxBudget)

  return new Promise(resolve => {
    request.get(url, function (err, response) {
      if (err) {
        console.log(err)
      } else {
        const result = JSON.parse(response.body)
        const listings = JSON.parse(result.body)
        resolve(listings)
      }
    })
  }).then(response => {
    const promises = response.map((item, key) => {
      return fwdGeocode(item.geoAddress)
    })
    return Promise.all(promises).then((results) => {
      for (var i = 0; i < results.length; i++) {
        response[i].latLon = results[i]

        // Street address in format needed for listing popup
        response[i].address = {city: response[i].City,
          country: 'USA',
          lat: response[i].latLon.lat,
          line: response[i]['Street Number'].concat(' ').concat(response[i]['Street Name']),
          lon: response[i].latLon.lng,
          postal_code: response[i]['ZIP CODE (xxxxx)'],
          state: 'Massachusetts',
          state_code: 'MA',
          time_zone: 'America/New_York'}
      }
      return response
    })
  })
}

export function fwdGeocode (address) {
  return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_GEOCODE_TOKEN}`)
    .then(response => {
      return {lat: response.data.features[0].center[1], lng: response.data.features[0].center[0]}
    })
    .catch(err => {
      console.log('fwdGeo', err)
    })
}
