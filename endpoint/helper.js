'use strict'


// const moment    = require('moment')
// const acl       = require('../helper/acl')
const validator = require('../helper/validator')
const mailer    = require('../helper/mailer')
const tms       = require('../helper/tms')
const express   = require('express')
const helper    = express.Router({})

//--------------------------------------------------
// helper functions
//--------------------------------------------------

// helper.get('/voiceColors', tms.verifyToken)
helper.get('/voiceColors', (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:VOICE_COLOR}})
})

// helper.get('/categories', tms.verifyToken)
helper.get('/categories', (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:CATEGORY}})
})

// helper.get('/countries', tms.verifyToken)
helper.get('/countries', (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:COUNTRY}})
})

// helper.get('/languages', tms.verifyToken)
helper.get('/languages', (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:LANGUAGE}})
})

// helper.get('/userRoles', tms.verifyToken)
helper.get('/userRoles', (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:USER_ROLE}})
})

// helper.get('/userTypes', tms.verifyToken)
helper.get('/userTypes', (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:USER_TYPE}})
})

// helper.get('/loginProviders', tms.verifyToken)
helper.get('/loginProviders', (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:LOGIN_PROVIDER}})
})

// helper.get('/currencies', tms.verifyToken)
helper.get('/currencies', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:CURRENCY}})
})

// helper.get('/payTypes', tms.verifyToken)
helper.get('/payTypes', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:PAY_TYPE}})
})

// helper.get('/useTypes', tms.verifyToken)
helper.get('/useTypes', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:USE_TYPE}})
})

// helper.get('/accountTypes', tms.verifyToken)
helper.get('/accountTypes', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:ACCOUNT_TYPE}})
})

// helper.get('/genders', tms.verifyToken)
helper.get('/genders', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:GENDER}})
})

// helper.get('/payStates', tms.verifyToken)
helper.get('/payStates', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:PAY_STATE}})
})

// helper.get('/taskStates', tms.verifyToken)
helper.get('/taskStates', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:TASK_STATE}})
})

// helper.get('/popularKeyword', tms.verifyToken)
helper.get('/popularKeyword', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:POPULAR_KEYWORD}})
})

// helper.get('/recommendedKeyword', tms.verifyToken)
helper.get('/recommendedKeyword', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:RECOMMENDED_KEYWORD}})
})

// helper.get('/permissions', tms.verifyToken)
helper.get('/permissions', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:PERMISSION}})
})

// helper.get('/trainStates', tms.verifyToken)
helper.get('/trainStates', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:TRAIN_STATE}})
})

// helper.get('/modelStates', tms.verifyToken)
helper.get('/modelStates', async (req, res, next)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:MODEL_STATE}})
})

// helper.post('/sendMail', tms.verifyToken)
helper.post('/sendMail', validator.email_to)
helper.post('/sendMail', validator.email_subject)
helper.post('/sendMail', validator.email_html)
helper.post('/sendMail', async (req, res, next)=>{
  try{
    let email = {}
    email.from    = 'noreply@sruniverse.kr'
    email.to      = req.body.to
    email.subject = req.body.subject
    email.html    = req.body.html

    let ret = await mailer.sendMail(email)

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})

module.exports = helper
