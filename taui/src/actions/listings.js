// @flow
import axios from 'axios'

export default function getListings(zipcode) {
  const test = {
    url: 'https://realtor.p.rapidapi.com/properties/list-for-rent',
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'realtor.p.rapidapi.com',
		  'x-rapidapi-key': '6fc125e6c9mshc9f4623469e7eccp10c1bajsnaca460b441e6'
    },
    params: {
      postal_code: zipcode,
      sort: 'freshest',
      offset: '0'
    }
  }

  return axios(test)
    .then(response => {
      console.log('Success!')
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
