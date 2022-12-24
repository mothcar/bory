'use strict'

const redis = require('redis')

// promisify for async await
bluebird.promisifyAll(redis)

const initRedis = async ()=>{
  global.redis  = await redis.createClient({host: REDIS.HOST, port: REDIS.PORT})
  log('init redis: ' + REDIS.HOST + ':'+ REDIS.PORT)
}

module.exports = initRedis()
