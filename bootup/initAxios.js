'use strict'

const axios = require('axios')

const initAxios = ()=>{
  let baseURL
  if(APP.USE_SSL)
    baseURL = `https://${APP.HOST}:${APP.PORT}`
  else
    baseURL = `http://${APP.HOST}:${APP.PORT}`

  global.axios  = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 10
  })

  log('init axios: ' + baseURL)
}

module.exports = initAxios()