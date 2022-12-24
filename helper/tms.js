'use strict'

const qs      = require('qs')
const jwt     = require('jsonwebtoken')
const moment  = require('moment')
let tms       = {}

// express middleware
tms.verifyToken = (req, res, next)=>{
  let token = req.headers.authorization
  if(!token) return res.json({msg:RCODE.INVALID_TOKEN, data:{}})

  try{
    token = token.split(' ')
    if(!token) return res.json({msg:RCODE.INVALID_TOKEN, data:{}})

    if(!token[0].toUpperCase() === TOKEN.TYPE)
      return res.json({msg:RCODE.INVALID_TOKEN, data:{}})

    // verify token
    jwt.verify(token[1], TOKEN.SECRET, async (err, decoded)=>{
      if(err){
        if(err.name.toUpperCase() === 'TOKENEXPIREDERROR')
          return res.json({msg:RCODE.TOKEN_EXPIRED, data:{}})
        else
          return res.json({msg:RCODE.INVALID_TOKEN, data:{}})
      }

      // check blacklist token
      let value = await redis.getAsync(token[1])
      if(value)
        return res.json({msg:RCODE.INVALID_TOKEN, data:{}})

      req.token = decoded
      req.token.raw = token[1]
      return next()
    })
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

// helper for blacklist
tms.jwt = jwt
tms.addBlacklist = (token)=>{
  if(!token)
    return log(RCODE.INVALID_TOKEN)

  let now = Math.round(new Date() / 1000)
  let delta = token.exp - now

  let iat = moment.unix(token.iat).format('YYYY-MM-DD a hh:mm:ss')
  let exp = moment.unix(token.exp).format('YYYY-MM-DD a hh:mm:ss')
  redis.set(token.raw, qs.stringify({iat, exp}))
  return redis.expire(token.raw, delta)
}

module.exports = tms
