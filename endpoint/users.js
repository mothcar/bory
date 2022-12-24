'use strict'

// const moment    = require('moment')
// const acl       = require('../helper/acl')
const _         = require('lodash')
const tms       = require('../helper/tms')
const validator = require('../helper/validator')
const bcrypt    = require('bcryptjs')
const express   = require('express')
const users     = express.Router({})


//--------------------------------------------------
// helper functions
//--------------------------------------------------
users.get('/pageInfo', tms.verifyToken)
users.get('/pageInfo', validator.qry_limit)
users.get('/pageInfo', async (req, res)=>{
  try{
    // compute pagination
    let total = await Users.countDocuments()
    let limit = parseInt(req.query.limit)
    if(limit > total) limit = total
    let pages  = Math.ceil(total / limit)

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit
    }

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// users.post('/isNewEmail', tms.verifyToken)
users.post('/isNewEmail', validator.isNewEmail)
users.post('/isNewEmail', async (req, res)=>{
  return res.json({msg:RCODE.OPERATION_SUCCEED, data:true})
})


//--------------------------------------------------
// users
//--------------------------------------------------
// TODO: ACL (ADMIN, OPERATOR, USER)
users.post('/', tms.verifyToken)
users.post('/', validator.isNewEmail)
users.post('/', validator.password)
users.post('/', validator.name)
users.post('/', validator.role)
users.post('/', validator.firstName)
users.post('/', validator.lastName)
users.post('/', validator.phone1)
users.post('/', validator.phone2)
users.post('/', validator.country)
users.post('/', validator.if_thumbnailUrl)
users.post('/', validator.if_userType)
users.post('/', validator.if_companyName)
users.post('/', validator.if_bizLicenseNo)
users.post('/', async (req, res)=>{
  try{
    let user = {}
    user.email    = req.body.email
    user.password = await bcrypt.hash(req.body.password, BCRYPT.SALT_SIZE)
    user.name     = req.body.name
    user.role     = req.body.role

    // check logical validation
    // if( _.includes(req.token.role, 'ADMIN')
    //   || _.includes(req.token.role, 'OPERATOR')){
    //   user.enabled = (req.body.enabled !== null) ? JSON.parse(req.body.enabled) : false
    //   user.role   = req.body.role ? req.body.role : ['USER']
    // }
    // else{
    //   user.enabled    = false
    //   user.role      = 'USER'
    // }


    // for voice mall
    user.thumbnailUrl       = req.body.thumbnailUrl ? req.body.thumbnailUrl : ''
    user.firstName          = req.body.firstName
    user.lastName           = req.body.lastName
    user.phone1             = req.body.phone1
    user.phone2             = req.body.phone2
    user.country            = req.body.country.toUpperCase()
    user.userType           = req.body.userType ? req.body.userType.toUpperCase() : 'CUSTOMER'
    user.companyName        = req.body.companyName ? req.body.companyName : ''
    user.bizLicenseNo       = req.body.bizLicenseNo ? req.body.bizLicenseNo : ''
    user.creditCards        = []
    user.bankAccounts       = []
    user.isSignedOut        = false
    // user.signedOutAt        = new Date()

    user = await Users.create(user)
    user.password = undefined
    user.__v = undefined

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/', tms.verifyToken)
users.get('/', validator.qry_page)
users.get('/', validator.qry_limit)
users.get('/', async (req, res)=>{
  try{
    // compute pages
    let total = await Users.countDocuments()
    let limit = parseInt(req.query.limit)
    let page  = parseInt(req.query.page)
    if(limit > total) limit = total
    let pages = Math.ceil(total / limit)
    if(page > pages) page = pages
    let skip = (page - 1) * limit

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit,
      page:  page
    }

    let users = await Users.find({}, {password:0, __v:0}).limit(limit).skip(skip)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo, items:users}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id', tms.verifyToken)
users.get('/:_id', validator.param_isUserIdExist)
users.get('/:_id', async (req, res)=>{
  let _id = mongoose.Types.ObjectId(req.params._id)
  let user = await Users.findOne({_id: _id}, {password:0, __v:0})

  return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user}})
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.put('/:_id', tms.verifyToken)
users.put('/:_id', validator.param_isUserIdExist)
users.put('/:_id', validator.if_email)
users.put('/:_id', validator.if_password)
users.put('/:_id', validator.if_role)
users.put('/:_id', validator.if_thumbnailUrl)
users.put('/:_id', validator.if_companyName)
users.put('/:_id', validator.if_phone1)
users.put('/:_id', validator.if_phone2)
users.put('/:_id', validator.if_userType)
users.put('/:_id', validator.if_bizLicenseNo)
users.put('/:_id', validator.if_firstName)
users.put('/:_id', validator.if_lastName)
users.put('/:_id', validator.if_name)
users.put('/:_id', validator.if_country)
users.put('/:_id', validator.if_isSignedOut)
users.put('/:_id', validator.if_signedOutAt)
users.put('/:_id', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    // log('find user=', user)
    // log('req.body=', req.body)

    // temp code
    if(req.body.email)        user.email = req.body.email
    if(req.body.password)     user.password = await bcrypt.hash(req.body.password, BCRYPT.SALT_SIZE)
    if(req.body.role)         user.role = req.body.role

    if(req.body.thumbnailUrl) user.thumbnailUrl = req.body.thumbnailUrl
    if(req.body.companyName)  user.companyName  = req.body.companyName
    if(req.body.phone1)       user.phone1 = req.body.phone1
    if(req.body.phone2)       user.phone2 = req.body.phone2
    if(req.body.userType)     user.userType = req.body.userType
    if(req.body.bizLicenseNo) user.bizLicenseNo = req.body.bizLicenseNo
    if(req.body.firstName)    user.firstName = req.body.firstName
    if(req.body.lastName)     user.lastName = req.body.lastName
    if(req.body.name)         user.name = req.body.name
    if(req.body.country)      user.country = req.body.country.toUpperCase()
    if(req.body.isSignedOut)  user.isSignedOut = JSON.parse(req.body.isSignedOut)
    if(req.body.signedOutAt)  user.signedOutAt = req.body.signedOutAt


    // log('update user=', user)

    await Users.updateOne({_id: _id}, user)
    user = await Users.findOne({_id: _id}, {password:0, __v:0})

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item: user}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


users.delete('/:_id', tms.verifyToken)
users.delete('/:_id', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})
    if(!user) return res.json({msg:RCODE.USER_NOT_FOUND, data:{}})

    //await Users.deleteOne({_id: _id})
    //return res.json({msg:RCODE.OPERATION_SUCCEED, data:{}})

    user.isSignedOut = true
    user.signedOutAt = new Date()

    await Users.updateOne({_id: _id}, user)
    user = await Users.findOne({_id: _id}, {password:0, __v:0})
    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item: user}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


//--------------------------------------------------
// credit cards
//--------------------------------------------------
// TODO: ACL (ADMIN, OPERATOR, USER)
users.post('/:_id/creditCards', tms.verifyToken)
users.post('/:_id/creditCards', validator.alias)
users.post('/:_id/creditCards', validator.param_isNewCardNo)
users.post('/:_id/creditCards', validator.expires)
users.post('/:_id/creditCards', validator.fullName)
users.post('/:_id/creditCards', validator.address1)
users.post('/:_id/creditCards', validator.address2)
users.post('/:_id/creditCards', validator.city)
users.post('/:_id/creditCards', validator.state)
users.post('/:_id/creditCards', validator.zipCode)
users.post('/:_id/creditCards', validator.country)
users.post('/:_id/creditCards', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    let card = {}
    card.alias      = req.body.alias                  // 카드별칭
    card.cardNo     = req.body.cardNo                 // 카드번호
    card.expires    = req.body.expires                // 만기년월
    card.fullName   = req.body.fullName               // 카드 표기 이름
    card.address1   = req.body.address1               // 주소1
    card.address2   = req.body.address2               // 주소2
    card.city       = req.body.city                   // 도시
    card.state      = req.body.state                  // 주
    card.zipCode    = req.body.zipCode                // 우편번호
    card.country    = req.body.country.toUpperCase()  // 국가

    if(user.creditCards.length < 1)
      card.isDefault  = true
    else
      card.isDefault  = false

    user.creditCards.push(card)
    user = await Users.create(user)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:user.creditCards}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/creditCards', tms.verifyToken)
users.get('/:_id/creditCards', validator.param_isUserIdExist)
users.get('/:_id/creditCards', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    if(user.creditCards.length < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})
    else
      return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:user.creditCards}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/creditCards/:_cardNo', tms.verifyToken)
users.get('/:_id/creditCards/:_cardNo', validator.param_is_cardNoExist)
users.get('/:_id/creditCards/:_cardNo', async (req, res)=>{
  try{
    let cardNo = req.params._cardNo
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    for(let card of user.creditCards){
      if(card.cardNo.replace(/-/g, '') === cardNo.replace(/-/g, ''))
        return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:card}})
    }

    return res.json({msg:RCODE.NO_RESULT, data:{}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.put('/:_id/creditCards/:_cardNo', tms.verifyToken)
users.put('/:_id/creditCards/:_cardNo', validator.param_is_cardNoExist)
users.put('/:_id/creditCards/:_cardNo', validator.if_alias)
users.put('/:_id/creditCards/:_cardNo', validator.if_expires)
users.put('/:_id/creditCards/:_cardNo', validator.if_fullName)
users.put('/:_id/creditCards/:_cardNo', validator.if_address1)
users.put('/:_id/creditCards/:_cardNo', validator.if_address2)
users.put('/:_id/creditCards/:_cardNo', validator.if_city)
users.put('/:_id/creditCards/:_cardNo', validator.if_state)
users.put('/:_id/creditCards/:_cardNo', validator.if_zipCode)
users.put('/:_id/creditCards/:_cardNo', validator.if_country)
users.put('/:_id/creditCards/:_cardNo', async (req, res)=>{
  try{
    // check logical validation
    if(req.body.hasOwnProperty('isDefault'))
      return res.json({msg:RCODE.IS_DEFAULT_NOT_ALLOWED, data:{}})

    // check logical validation
    if(req.body.hasOwnProperty('cardNo')){
      let currentCardNo = req.params.cardNo
      let putCardNo     = req.body.cardNo
      if(currentCardNo.replace(/-/g, '') !== putCardNo.replace(/-/g, ''))
        return res.json({msg:RCODE.INVALID_CARD_NUM, data:{}})
    }

    let cardNo = req.params.cardNo
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    for(let card of user.creditCards){
      if(card.cardNo.replace(/-/g, '') === cardNo.replace(/-/g, '')){
        if(req.body.alias)    card.alias    = req.body.alias    // 카드별칭
        if(req.body.cardNo)   card.cardNo   = req.body.cardNo   // 카드번호
        if(req.body.expires)  card.expires  = req.body.expires  // 만기년월
        if(req.body.fullName) card.fullName = req.body.fullName // 카드 표기 이름
        if(req.body.address1) card.address1 = req.body.address1 // 주소1
        if(req.body.address2) card.address2 = req.body.address2 // 주소2
        if(req.body.city)     card.city     = req.body.city     // 도시
        if(req.body.state)    card.state    = req.body.state    // 주
        if(req.body.zipCode)  card.zipCode  = req.body.zipCode  // 우편번호
        if(req.body.country)  card.country  = req.body.country.toUpperCase() // 국가

        await Users.updateOne({_id: _id}, user)
        return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:card}})
      }
    }

    return res.json({msg:RCODE.NO_RESULT, data:{}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.delete('/:_id/creditCards/:_cardNo', tms.verifyToken)
users.delete('/:_id/creditCards/:_cardNo', validator.param_is_cardNoExist)
users.delete('/:_id/creditCards/:_cardNo', async (req, res)=>{
  try{
    let deleteCardNo = req.params._cardNo
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    let deleteCard = await _.remove(user.creditCards, (card)=>{
      if(card.cardNo.replace(/-/g, '') === deleteCardNo.replace(/-/g, ''))
        return true
      else
        return false
    })

    if(deleteCard) {
      await Users.updateOne({_id: _id}, user)
      return res.json({msg:RCODE.OPERATION_SUCCEED, data:{}})
    }

    return res.json({msg:RCODE.NO_RESULT, data:{}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


//--------------------------------------------------
// bank accounts
//--------------------------------------------------
// TODO: ACL (ADMIN, OPERATOR, USER)
users.post('/:_id/bankAccounts', tms.verifyToken)
users.post('/:_id/bankAccounts', validator.param_isNewAccountNo)
users.post('/:_id/bankAccounts', validator.country)
users.post('/:_id/bankAccounts', validator.bankName)
users.post('/:_id/bankAccounts', validator.accountType)
users.post('/:_id/bankAccounts', validator.routingNo)
users.post('/:_id/bankAccounts', async (req, res)=>{
  try{
    // check logical validation
    if(req.body.hasOwnProperty('isDefault'))
      return res.json({msg:RCODE.IS_DEFAULT_NOT_ALLOWED, data:{}})

    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    let account = {}
    account.country     = req.body.country.toUpperCase()// 국가
    account.bankName    = req.body.bankName             // 은행 이름
    account.accountType = req.body.accountType.toUpperCase() // 계좌 타입?
    account.routingNo   = req.body.routingNo            // routing No ?
    account.accountNo   = req.body.accountNo            // 계좌 번호

    if(user.bankAccounts.length < 1)
      account.isDefault  = true
    else
      account.isDefault  = false

    user.bankAccounts.push(account)
    user = await Users.create(user)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:user.bankAccounts}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/bankAccounts', tms.verifyToken)
users.get('/:_id/bankAccounts', validator.param_isUserIdExist)
users.get('/:_id/bankAccounts', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    if(user.bankAccounts.length < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})
    else
      return res.json({msg:RCODE.OPERATION_SUCCEED, data:{items:user.bankAccounts}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/bankAccounts/:_accountNo', tms.verifyToken)
users.get('/:_id/bankAccounts/:_accountNo', validator.param_is_accountNoExist)
users.get('/:_id/bankAccounts/:_accountNo', async (req, res)=>{
  try{
    let accountNo = req.params._accountNo
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    for(let account of user.bankAccounts){
      if(account.accountNo.replace(/-/g, '') === accountNo.replace(/-/g, ''))
        return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:account}})
    }

    return res.json({msg:RCODE.NO_RESULT, data:{}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.put('/:_id/bankAccounts/:_accountNo', tms.verifyToken)
users.put('/:_id/bankAccounts/:_accountNo', validator.param_is_accountNoExist)
users.put('/:_id/bankAccounts/:_accountNo', validator.if_country)
users.put('/:_id/bankAccounts/:_accountNo', validator.if_bankName)
users.put('/:_id/bankAccounts/:_accountNo', validator.if_accountType)
users.put('/:_id/bankAccounts/:_accountNo', validator.if_routingNo)
users.put('/:_id/bankAccounts/:_accountNo', async (req, res)=>{
  try{
    // check logical validation
    // if(req.body.hasOwnProperty('isDefault'))
    //   return res.json({msg:RCODE.IS_DEFAULT_NOT_ALLOWED, data:{}})

    // check logical validation
    if(req.body.hasOwnProperty('accountNo')){
      let currentAccountNo = req.params._accountNo
      let putAccountNo     = req.body.accountNo
      if(currentAccountNo.replace(/-/g, '') !== putAccountNo.replace(/-/g, ''))
        return res.json({msg:RCODE.INVALID_ACCOUNT_NUM, data:{}})
    }

    let accountNo = req.params._accountNo
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    for(let account of user.bankAccounts){
      if(account.accountNo.replace(/-/g, '') === accountNo.replace(/-/g, '')){
        if(req.body.country)      account.country     = req.body.country.toUpperCase()// 국가
        if(req.body.bankName)     account.bankName    = req.body.bankName    // 은행 이름
        if(req.body.accountType)  account.accountType = req.body.accountType // 계좌 타입
        if(req.body.routingNo)    account.routingNo   = req.body.routingNo   // routing No ?
        if(req.body.accountNo)    account.accountNo   = req.body.accountNo   // 계좌 번호

        await Users.updateOne({_id: _id}, user)
        return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:account}})
      }
    }

    return res.json({msg:RCODE.NO_RESULT, data:{}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.delete('/:_id/bankAccounts/:_accountNo', tms.verifyToken)
users.delete('/:_id/bankAccounts/:_accountNo', validator.param_is_accountNoExist)
users.delete('/:_id/bankAccounts/:_accountNo', async (req, res)=>{
  try{
    let deleteAccountNo = req.params._accountNo
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})

    let deleteAccount = await _.remove(user.bankAccounts, (account)=>{
      if(account.accountNo.replace(/-/g, '') === deleteAccountNo.replace(/-/g, ''))
        return true
      else
        return false
    })

    if(deleteAccount) {
      await Users.updateOne({_id: _id}, user)
      return res.json({msg:RCODE.OPERATION_SUCCEED, data:{}})
    }

    return res.json({msg:RCODE.NO_RESULT, data:{}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

users.delete('/', tms.verifyToken)
users.delete('/', validator.deleteItems)
users.delete('/', async (req, res)=>{
  try{
    let qry = {_id: {$in: req.body.deleteItems}}
    let deletedItems = await Users.deleteMany(qry)

    log('deletedItems=', deletedItems)

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

//--------------------------------------------------
// users voices List
//--------------------------------------------------

users.get('/:_id/voices/pageInfo', tms.verifyToken)
users.get('/:_id/voices/pageInfo', validator.qry_limit)
users.get('/:_id/voices/pageInfo', async (req, res)=>{
  try{
    // compute pagination
    let _id = mongoose.Types.ObjectId(req.params._id)
    let qry = {ownerId:_id}
    let total = await Voices.countDocuments(qry)
    let limit = parseInt(req.query.limit)
    if(limit > total) limit = total
    let pages  = Math.ceil(total / limit)

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit
    }

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/voices', tms.verifyToken)
users.get('/:_id/voices', validator.qry_page)
users.get('/:_id/voices', validator.qry_limit)
users.get('/:_id/voices', validator.qry_if_colorCode)
users.get('/:_id/voices', validator.qry_if_categoryCode)
users.get('/:_id/voices', validator.qry_if_keyword)
users.get('/:_id/voices', validator.qry_if_language)
users.get('/:_id/voices', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)

    let qry = {ownerId:_id}
    let voices = []
    let total = 0

    // query: colorCode + categoryCode
    if(req.query.colorCode && req.query.categoryCode){
      let regexColor    = new RegExp(req.query.colorCode, 'i')
      let regexCategory = new RegExp(req.query.categoryCode.replace(/\./g, '[.]'), 'i')
      qry = {
        ownerId: _id,
        colorCode: {$regex: regexColor},
        category:  {$regex: regexCategory}
      }
    }

    // query: colorCode + keyword
    else if(req.query.colorCode && req.query.keyword){
      let regexColor   = new RegExp(req.query.colorCode, 'i')
      let regexKeyword = new RegExp(req.query.keyword, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {colorCode: {$regex: regexColor}},
          {$or:[
            {name: {$regex: regexKeyword}},
            {keywords: {$regex: regexKeyword}},
            {description: {$regex: regexKeyword}}
          ]}
        ]
      }
    }

    // query: colorCode + language
    else if(req.query.colorCode && req.query.language){
      let regexColor    = new RegExp(req.query.colorCode, 'i')
      let regexLanguage = new RegExp(req.query.language, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {colorCode: {$regex: regexColor}},
          {language:  {$regex: regexLanguage}}
        ]
      }
    }

    // query: categoryCode + keyword
    else if(req.query.categoryCode && req.query.keyword){
      let regexCategory = new RegExp( req.query.categoryCode.replace(/\./g, '[.]'), 'i' )
      let regexKeyword = new RegExp(req.query.keyword, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {category: {$regex: regexCategory}},
          {$or:[
            {name:        {$regex: regexKeyword}},
            {keywords:    {$regex: regexKeyword}},
            {description: {$regex: regexKeyword}}
          ]}
        ]
      }
    }

    // query: categoryCode + language
    else if(req.query.categoryCode && req.query.language){
      let regexCategory = new RegExp( req.query.categoryCode.replace(/\./g, '[.]'), 'i' )
      let regexLanguage = new RegExp(req.query.language, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {category: {$regex: regexCategory}},
          {language: {$regex: regexLanguage}}
        ]
      }
    }

    // query: language
    else if(req.query.language){
      let regexLanguage = new RegExp(req.query.language, 'i')
      qry = {
        ownerId: _id,
        language: {$regex: regexLanguage}
      }
    }

    // query: keyword
    else if(req.query.keyword){
      let regexKeyword = new RegExp(req.query.keyword, 'i')
      qry = {
        $and : [
          {$or:[
              {name:        {$regex: regexKeyword}},
              {keywords:    {$regex: regexKeyword}},
              {description: {$regex: regexKeyword}}
          ]},
          {ownerId: _id}
        ]
      }
    }

    // query: colorCode
    else if(req.query.colorCode){
      let regexColor    = new RegExp(req.query.colorCode, 'i')
      qry = {
        ownerId: _id,
        colorCode: {$regex: regexColor}
      }
    }

    // query: categoryCode
    else if(req.query.categoryCode){
      let regex = new RegExp( req.query.categoryCode.replace(/\./g, '[.]') )
      qry = {
        ownerId: _id,
        category: {$regex: regex}
      }
    }

    total = await Voices.countDocuments(qry)

    if(total < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    let limit = parseInt(req.query.limit)
    let page  = parseInt(req.query.page)
    if(limit > total) limit = total

    let pages = Math.ceil(total / limit)
    if(page > pages) page = pages
    let skip = (page - 1) * limit

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit,
      page:  page
    }

    voices = await Voices.find(qry, {__v:0}).limit(limit).skip(skip)

    if(voices.length < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo, items:voices}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})




//--------------------------------------------------
// users voicesProducts List
//--------------------------------------------------

users.get('/:_id/voicesProducts/pageInfo', tms.verifyToken)
users.get('/:_id/voicesProducts/pageInfo', validator.qry_limit)
users.get('/:_id/voicesProducts/pageInfo', async (req, res)=>{
  try{
    // compute pagination
    let _id = mongoose.Types.ObjectId(req.params._id)
    let qry = {ownerId:_id}
    let total = await VoicesProducts.countDocuments(qry)
    let limit = parseInt(req.query.limit)
    if(limit > total) limit = total
    let pages  = Math.ceil(total / limit)

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit
    }

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})



// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/voicesProducts', tms.verifyToken)
users.get('/:_id/voicesProducts', validator.qry_page)
users.get('/:_id/voicesProducts', validator.qry_limit)
users.get('/:_id/voicesProducts', validator.qry_if_colorCode)
users.get('/:_id/voicesProducts', validator.qry_if_categoryCode)
users.get('/:_id/voicesProducts', validator.qry_if_keyword)
users.get('/:_id/voicesProducts', validator.qry_if_language)
users.get('/:_id/voicesProducts', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)

    let qry = {ownerId:_id}
    let voices = []
    let total = 0

    // query: colorCode + categoryCode
    if(req.query.colorCode && req.query.categoryCode){
      let regexColor    = new RegExp(req.query.colorCode, 'i')
      let regexCategory = new RegExp(req.query.categoryCode.replace(/\./g, '[.]'), 'i')
      qry = {
        ownerId: _id,
        colorCode: {$regex: regexColor},
        category:  {$regex: regexCategory}
      }
    }

    // query: colorCode + keyword
    else if(req.query.colorCode && req.query.keyword){
      let regexColor   = new RegExp(req.query.colorCode, 'i')
      let regexKeyword = new RegExp(req.query.keyword, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {colorCode: {$regex: regexColor}},
          {$or:[
            {name: {$regex: regexKeyword}},
            {keywords: {$regex: regexKeyword}},
            {description: {$regex: regexKeyword}}
          ]}
        ]
      }
    }

    // query: colorCode + language
    else if(req.query.colorCode && req.query.language){
      let regexColor    = new RegExp(req.query.colorCode, 'i')
      let regexLanguage = new RegExp(req.query.language, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {colorCode: {$regex: regexColor}},
          {language:  {$regex: regexLanguage}}
        ]
      }
    }

    // query: categoryCode + keyword
    else if(req.query.categoryCode && req.query.keyword){
      let regexCategory = new RegExp( req.query.categoryCode.replace(/\./g, '[.]'), 'i' )
      let regexKeyword = new RegExp(req.query.keyword, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {category: {$regex: regexCategory}},
          {$or:[
            {name:        {$regex: regexKeyword}},
            {keywords:    {$regex: regexKeyword}},
            {description: {$regex: regexKeyword}}
          ]}
        ]
      }
    }

    // query: categoryCode + language
    else if(req.query.categoryCode && req.query.language){
      let regexCategory = new RegExp( req.query.categoryCode.replace(/\./g, '[.]'), 'i' )
      let regexLanguage = new RegExp(req.query.language, 'i')
      qry = {
        $and:[
          {ownerId: _id},
          {category: {$regex: regexCategory}},
          {language: {$regex: regexLanguage}}
        ]
      }
    }

    // query: language
    else if(req.query.language){
      let regexLanguage = new RegExp(req.query.language, 'i')
      qry = {
        ownerId: _id,
        language: {$regex: regexLanguage}
      }
    }

    // query: keyword
    else if(req.query.keyword){
      let regexKeyword = new RegExp(req.query.keyword, 'i')
      qry = {
        $and : [
          {$or:[
              {name:        {$regex: regexKeyword}},
              {keywords:    {$regex: regexKeyword}},
              {description: {$regex: regexKeyword}}
          ]},
          {ownerId: _id}
        ]
      }
    }

    // query: colorCode
    else if(req.query.colorCode){
      let regexColor    = new RegExp(req.query.colorCode, 'i')
      qry = {
        ownerId: _id,
        colorCode: {$regex: regexColor}
      }
    }

    // query: categoryCode
    else if(req.query.categoryCode){
      let regex = new RegExp( req.query.categoryCode.replace(/\./g, '[.]') )
      qry = {
        ownerId: _id,
        category: {$regex: regex}
      }
    }

    total = await VoicesProducts.countDocuments(qry)

    if(total < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    let limit = parseInt(req.query.limit)
    let page  = parseInt(req.query.page)
    if(limit > total) limit = total

    let pages = Math.ceil(total / limit)
    if(page > pages) page = pages
    let skip = (page - 1) * limit

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit,
      page:  page
    }

    voices = await VoicesProducts.find(qry, {__v:0}).limit(limit).skip(skip)

    if(voices.length < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo, items:voices}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})



//--------------------------------------------------
// users purchases List
//--------------------------------------------------
users.get('/:_id/purchases/pageInfo', tms.verifyToken)
users.get('/:_id/purchases/pageInfo', validator.qry_limit)
users.get('/:_id/purchases/pageInfo', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)

    let qry = {buyerId:_id}

    // compute pagination
    let total = await Purchases.countDocuments(qry)
    let limit = parseInt(req.query.limit)
    if(limit > total) limit = total
    let pages  = Math.ceil(total / limit)

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit
    }

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/purchases', tms.verifyToken)
users.get('/:_id/purchases', validator.qry_page)
users.get('/:_id/purchases', validator.qry_limit)
users.get('/:_id/purchases', validator.qry_if_productName)
users.get('/:_id/purchases', validator.qry_if_payName)
users.get('/:_id/purchases', validator.qry_if_payType)
users.get('/:_id/purchases', validator.qry_if_useType)
users.get('/:_id/purchases', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)

    let qry = {buyerId:_id}
    let purchases = []
    let total = 0

    // 검색 조건  시간,  fromAt,   toAt
    if(req.query.fromAt && req.query.toAt) {
      let fromAt = req.query.fromAt
      let toAt = req.query.toAt

      log('fromAt=', fromAt)
      log('toAt=', toAt)

      qry = {
        $and:[
          {createdAt: {
            '$gte': fromAt,
            '$lte': toAt,
          }},
          {buyerId:_id}
        ]
      }
    }


    total = await Purchases.countDocuments(qry)

    if(total < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    let limit = parseInt(req.query.limit)
    let page  = parseInt(req.query.page)
    if(limit > total) limit = total

    let pages = Math.ceil(total / limit)
    if(page > pages) page = pages
    let skip = (page - 1) * limit

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit,
      page:  page
    }

    purchases = await Purchases.find(qry,{__v:0}).limit(limit).skip(skip)

    if(purchases.length < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo, items:purchases}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

//--------------------------------------------------
// users sales List  -  특정 유저 아이디가 판매한 제품. 리스트.
//--------------------------------------------------
users.get('/:_id/sales/pageInfo', tms.verifyToken)
users.get('/:_id/sales/pageInfo', validator.qry_limit)
users.get('/:_id/sales/pageInfo', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)

    let qry = {productOwnerId:_id}

    // compute pagination
    let total = await Purchases.countDocuments(qry)
    let limit = parseInt(req.query.limit)
    if(limit > total) limit = total
    let pages  = Math.ceil(total / limit)

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit
    }

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


// TODO: ACL (ADMIN, OPERATOR, USER)
users.get('/:_id/sales', tms.verifyToken)
users.get('/:_id/sales', validator.qry_page)
users.get('/:_id/sales', validator.qry_limit)
users.get('/:_id/sales', validator.qry_if_productName)
users.get('/:_id/sales', validator.qry_if_payName)
users.get('/:_id/sales', validator.qry_if_payType)
users.get('/:_id/sales', validator.qry_if_useType)
users.get('/:_id/sales', async (req, res)=>{
  try{
    let _id = mongoose.Types.ObjectId(req.params._id)

    let qry = {productOwnerId:_id}
    let purchases = []
    let total = 0

    // 검색 조건  시간,  fromAt,   toAt
    if(req.query.fromAt && req.query.toAt) {
      let fromAt = req.query.fromAt
      let toAt = req.query.toAt

      log('fromAt=', fromAt)
      log('toAt=', toAt)

      qry = {
        $and:[
          {createdAt: {
            '$gte': fromAt,
            '$lte': toAt,
          }},
          {productOwnerId:_id}
        ]
      }
    }


    total = await Purchases.countDocuments(qry)

    if(total < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    let limit = parseInt(req.query.limit)
    let page  = parseInt(req.query.page)
    if(limit > total) limit = total

    let pages = Math.ceil(total / limit)
    if(page > pages) page = pages
    let skip = (page - 1) * limit

    // init page info
    let pageInfo = {
      total: total,
      pages: pages,
      limit: limit,
      page:  page
    }

    purchases = await Purchases.find(qry,{__v:0}).limit(limit).skip(skip)

    if(purchases.length < 1)
      return res.json({msg:RCODE.NO_RESULT, data:{}})

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo, items:purchases}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

module.exports = users
