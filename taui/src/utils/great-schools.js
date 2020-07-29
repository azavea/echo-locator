import axios from 'axios'

// Change 'MA' to another state if necessary

export default function getGreatSchools (city, state) {
  const test = {
    url: `/schools/${state}/${city}/`,
    method: 'GET',
    params: {
      key: process.env.GREATSCHOOLS_API_KEY
    }
  }

  return axios(test)
    .then(response => {
      console.log('Success!')
      console.log('xyz', response)
      console.log('ok', response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

// const {createProxyMiddleware} = require('http-proxy-middleware');
// const {morgan} = require('morgan');

// module.exports = function(app) {
//   app.use(
//     createProxyMiddleware("/schools", {
//       target: "https://api.greatschools.org",
//       changeOrigin: true
//     })
//   );
//   app.use(morgan('morganite'))
// };
