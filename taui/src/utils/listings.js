// @flow
import axios from 'axios'

export default function getListings(zipcode, budget, beds) {

  const test = {
    url: 'https://realtor.p.rapidapi.com/properties/v2/list-for-rent',
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'realtor.p.rapidapi.com',
		  'x-rapidapi-key': process.env.REALTOR_ACCESS_TOKEN
    },
    params: {
      postal_code: zipcode,
      sort: 'freshest',
      offset: '0',
      price_max: budget,
      beds_min: beds
    }
  }

  return axios(test)
    .then(response => {
      var updatedProperties = [...response.data.properties]

      for(var i = response.data.properties.length - 1; i >= 0; i--) {

        // only keep the listings with address lines
        if (!response.data.properties[i].address.line) {
          updatedProperties.splice(i,1)
          continue
        }

        // get high quality images
        var link = ''
        var newLink = ''
        for(var j = updatedProperties[i].photos.length - 1; j >= 0; j--) {
          link = updatedProperties[i].photos[j].href
          newLink = link.substr(0, link.lastIndexOf('.')) + '-w1020_h770_q80' + link.substr(link.lastIndexOf('.'))
          updatedProperties[i].photos[j].href = newLink
        }
      }

      response.data.properties = updatedProperties

      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
