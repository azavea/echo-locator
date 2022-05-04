// @flow
import axios from 'axios'

export async function fwdGeocode (item: any): Promise<void> {
  return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${item.geoAddress}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`)
    .then(response => {
      return {...item, lat: response.data.features[0].center[1], lon: response.data.features[0].center[0]}
    })
    .catch(err => {
      return (err)
    })
}

export async function fwdGeocodeBatch (listings: Array): Promise<void> {
  return Promise.all(listings.map((item) => fwdGeocode(item)))
}
