// @flow
import axios from 'axios'
const request = require('request')

export default function getListings(zipcode, budget, beds) {

  // Posts request to api gateway
  const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/get-realtor-listings'

  const json = {
      "zipcode":zipcode,
      "budget":budget,
      "rooms":beds
  }
  return new Promise (resolve => {
      request.post({url:url, json:json}, function(err, res, body) {
          const listings = JSON.parse(body.body)
          resolve(listings)
      })
    }).then(response => {
        return response
    })

}
