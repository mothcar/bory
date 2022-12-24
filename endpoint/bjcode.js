'use strict'

const faker   = require('faker')
const express = require('express')
const xlsx    = require('xlsx')
const bjcode    = express.Router({})
const dateFormat = require('dateformat');

//--------------------------------------------------
//   functions
//--------------------------------------------------


//--------------------------------------------------
// test functions
//--------------------------------------------------
bjcode.post('/', async (req, res)=>{
  try{
    log('test req.body= :', req.body)
    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:'Good Server~~~'}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

bjcode.get('/', async (req, res)=>{
  try{
    log('test req.body=', req.body)
    let data = await Bjcode.find()
    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:data}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})








bjcode.get('/newestUser', async (req, res)=>{
  try{
    let user = await Users.find().sort({$natural:-1}).limit(1)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user[0]}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})











bjcode.get('/oldestUser', async (req, res)=>{
  try{
    let user = await Users.find().limit(1)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user[0]}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

bjcode.get('/randomUser', async (req, res)=>{
  try{
    let count = await Users.countDocuments()
    let random = faker.random.number({min:0, max:count})
    let user = await Users.findOne().skip(random).limit(1)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})




module.exports = bjcode
