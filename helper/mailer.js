'use strict'

const nodemailer = require('nodemailer')
const mailer = {}

// helper for blacklist
mailer.sendMail = async (email)=>{
  try{
    if(!email) return new Error(RCODE.CONTENT_REQUIRED)

    let transport = nodemailer.createTransport(NODEMAILER_NOREPLY)

    return await transport.sendMail(email)
  }
  catch(err){
    log('err=', err)
    new Error(RCODE.SERVER_ERROR)
  }
}


module.exports = mailer
