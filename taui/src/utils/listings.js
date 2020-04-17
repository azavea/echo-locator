// @flow
import axios from 'axios'

export default function getListings(zipcode, budget, beds) {
  console.log(zipcode)
  console.log(budget)
  console.log(beds)

  const test = {
    url: 'https://realtor.p.rapidapi.com/properties/v2/list-for-rent',
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'realtor.p.rapidapi.com',
		  'x-rapidapi-key': '6fc125e6c9mshc9f4623469e7eccp10c1bajsnaca460b441e6'
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
      console.log(response.data)

      var updatedProperties = [...response.data.properties]

      for(var i = updatedProperties.length - 1; i >= 0; i--) {

        if (!response.data.properties[i].community) {
          if (response.data.properties[i].beds != beds) {
            updatedProperties.splice(i,1)
          }
        }
      }

      response.data.properties = updatedProperties

      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
