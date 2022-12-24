'use strict'

// const axios     = require('axios')
// const otpUtil   = require('../helper/otp')
const qs        = require('qs')
const uuid      = require('uuid/v4')
const mailer    = require('../helper/mailer')
const validator = require('../helper/validator')
const bcrypt    = require('bcryptjs')
const tms       = require('../helper/tms')
const fs        = require('fs')
const path      = require('path')
const express   = require('express')
const auth      = express.Router({})

// signup
auth.post('/signup',validator.email)
auth.post('/signup',validator.password)
auth.post('/signup', async (req, res)=>{
  try{
    // check logical validation
    log('auth req.body=', req.body)

    let user = await Users.findOne({email: req.body.email})
    if(user){
      if(!user.enabled)         return res.json({msg:RCODE.EMAIL_DENIED, data:{}})
      if(user.isVerifiedEmail)  return res.json({msg:RCODE.EMAIL_DUPLICATED, data:{}})

      log('signup user ready (found)=', user.email)
    }
    else{
      // create user

      let newUser = {}
      if (req.body.email==='mothcar@naver.com') newUser.role = 'SUPER'
      if (req.body.email==='aiacademy131@gmail.com') newUser.role = 'SUPER'
      newUser.name      = req.body.name
      newUser.email      = req.body.email.toLowerCase()
      newUser.password   = await bcrypt.hash(req.body.password, BCRYPT.SALT_SIZE)

      newUser.enabled    = true
      newUser.uuid       = uuid()  // temp UUID for sign up

      log('signup user ready (created)=', newUser.email)
      user = await Users.create(newUser)
    }

    // send email
    let url = EMAIL_CONFIRM_URL + '/' + user.uuid

    let email = {}
    email.from    = NOREPLY_EMAIL
    email.to      = user.email
    email.subject = 'Signup for Voice Mall'
    email.html = fs.readFileSync(path.join(__dirname, '..', 'email', 'verify-email.html'), 'utf8').toString()
    email.html = email.html.replace('Hello OOO(email address or ID).', `Hello ${email.to}`)
    email.html = email.html.replace('<a id="" href="#"',  `<a id="" href="${url}"`)

    // await mailer.sendMail(email)
    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})

// signup confirm
auth.get('/signup/confirm/:uuid', async (req, res)=>{
  try{
    let uuid  = req.params.uuid
    let user  = await Users.findOne({uuid: uuid})

    // check logical validation
    if(!user)                return res.json({msg:RCODE.OPERATION_FAILED, data:{}})
    if(!user.enabled)        return res.json({msg:RCODE.OPERATION_FAILED, data:{}})
    if(!user.uuid)           return res.json({msg:RCODE.OPERATION_FAILED, data:{}})
    if(user.isVerifiedEmail) return res.json({msg:RCODE.OPERATION_FAILED, data:{}})

    // update
    user.isVerifiedEmail = true
    user.uuid = null
    await Users.updateOne({_id: user._id}, user)
    log('user email verified=', user.email)

    // redirect
    return res.redirect(SIGNUP_COMPLETED)
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})



// login
auth.post('/login',validator.email)
auth.post('/login',validator.password)
auth.post('/login', async (req, res)=>{
  try{
    let email = req.body.email.toLowerCase()
    let password = req.body.password

    let user = await Users.findOne({email: email}, {__v:0})
    if(!user)
      return res.json({msg:RCODE.INVALID_USER_INFO, data:{}})

    if(!user.isVerifiedEmail)
      return res.json({msg:RCODE.EMAIL_CONFIRM_REQUIRED, data:{}})

    let ret = await bcrypt.compare(password, user.password)
    if(!ret)
      return res.json({msg:RCODE.INVALID_USER_INFO, data:{}})

    user.password = undefined

    let payload = {
      _id:        user._id,
      email:      user.email,
      loginType:  LOGIN_CODE.EMAIL
    }

    let token = tms.jwt.sign(payload, TOKEN.SECRET, {expiresIn: TOKEN.EXPIRE_SEC})
    if(!token)
      return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})

    await Users.updateOne({_id: user._id}, {loginType: LOGIN_CODE.EMAIL})

    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user, token:token}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})

// logout
auth.post('/logout', tms.verifyToken)
auth.post('/logout', (req, res)=>{
  try{
    tms.addBlacklist(req.token)
    req.token = undefined
    return res.json({msg: RCODE.OPERATION_SUCCEED, data:{}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})

// current user info
auth.get('/me', tms.verifyToken)
auth.get('/me', async (req, res)=> {
  try{
    let email = req.token.email
    let user = await Users.findOne({email: email}, {password:0, __v:0})

    if(!user)
      return res.json({msg: RCODE.INVALID_TOKEN, data:{}})

    return res.json({msg: RCODE.OPERATION_SUCCEED, data:{item:user}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})


// social login
auth.post('/socialLogin', validator.email)
auth.post('/socialLogin', validator.name)
auth.post('/socialLogin', validator.loginProvider)
auth.post('/socialLogin', validator.providerInfo)
auth.post('/socialLogin', async (req, res)=> {
  try{
    let email       = req.body.email.toLowerCase()
    let password    = email
    let name        = req.body.name
    let provider    = req.body.loginProvider.toUpperCase()
    let providerInfo= req.body.providerInfo

    // check new user
    let user = await Users.findOne({email: email}, {__v:0})

    if(!user){
      // create user
      let userCreate = {}
      userCreate.email    = email
      userCreate.password = await bcrypt.hash(password, BCRYPT.SALT_SIZE)
      userCreate.name     = name
      userCreate.enabled  = true
      userCreate.role     = 'USER'

      // for voice mall
      userCreate.thumbnailUrl       = req.body.hasOwnProperty('thumbnailUrl') ? req.body.thumbnailUrl : ''
      userCreate.firstName          = name
      userCreate.lastName           = name
      userCreate.phone1             = ''
      userCreate.phone2             = ''
      userCreate.country            = ''
      userCreate.userType           = 'CUSTOMER'
      userCreate.companyName        = ''
      userCreate.bizLicenseNo       = ''
      userCreate.creditCards        = []
      userCreate.bankAccounts       = []
      userCreate.socialLogins       = []

      if(provider === LOGIN_CODE.FACEBOOK)
        userCreate.socialLogins.push({code: LOGIN_CODE.FACEBOOK, providerInfo:providerInfo})
      else if(provider === LOGIN_CODE.GOOGLE)
        userCreate.socialLogins.push({code: LOGIN_CODE.GOOGLE, providerInfo:providerInfo})
      else
        return res.json({msg:RCODE.INVALID_PROVIDER_INFO, data:{}})

      user = await Users.create(userCreate)
      log('social user created:', email + ' (' + provider + ')')
    }

    // login process
    let ret = await bcrypt.compare(password, user.password)
    if(!ret) return res.json({msg:RCODE.INVALID_USER_INFO, data:{}})

    user.password = undefined

    let payload = {
      _id:        user._id,
      email:      user.email,
      role:       user.role,
      userType:   user.userType,
      firstName:  user.firstName,
      lastName:   user.lastName,
      name:       user.name,
      country:    user.country,
      loginType:  provider
    }

    let token = tms.jwt.sign(payload, TOKEN.SECRET, {expiresIn: TOKEN.EXPIRE_SEC})
    if(!token) return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})

    await Users.updateOne({_id: user._id}, {loginType:provider})
    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user, token:token}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})

// OTP 발급
// auth.post('/requestOTP1', validator.user_id)
// auth.post('/requestOTP1', validator.user_nm)
// auth.post('/requestOTP1', validator.mobile)
// auth.post('/requestOTP1', validator.biz_reg_cd)
// auth.post('/requestOTP1', async (req, res)=>{
  // sql = 'select * from user_info where user_id=? and user_nm=? and mobile=? '
  // param = [req.body.user_id,req.body.user_nm,req.body.mobile]
  // user = await pool.query sql, param

  // unless user.length > 0 then return res.json {code:999, msg:RCODE.INVALID_USER_INFO}

  // switch user[0].group_type.toUpperCase()
  //   when GROUP_TYPE.AGENT    then sql = 'select * from agent where agent_cd=?'
  //   when GROUP_TYPE.MERCHANT then sql = 'select * from merchant where merchant_cd=?'
  //   else return res.json {code:999, msg:RCODE.INVALID_USER_INFO}

  // param  = [user[0].group_cd]
  // member = await pool.query sql, param

  // unless member.length > 0 then return res.json {code:999, msg:RCODE.INVALID_BIZ_REG_CD}
  // unless member[0].biz_reg_cd is req.body.biz_reg_cd then return res.json {code:999, msg:RCODE.INVALID_BIZ_REG_CD}

  // otp = otpUtil.makeOtp()
  // redis.set req.body.mobile, qs.stringify otp
  // redis.expire req.body.mobile, otp.ttl

  // try
  //   data =
  //     c_id:   'PMT000002'
  //     subject:''
  //     tc:     '18005649'
  //     tp:     req.body.mobile
  //     msg:    "[PAYMINT] 귀하의 인증번호는 #{otp.code} 입니다. 3분안에 입력해 주세요."

    // await axios.post 'http://stg.paymint.co.kr:9600/api/extra/biztalk_msg', data
    // return res.json {code:200, msg:RCODE.OPERATION_SUCCEED}
  // catch err
  //   log 'err=', err
  //   return res.status(500).json {code:999, msg:RCODE.SERVER_ERROR}
// })


// 비밀번호 수정
// auth.post('/resetPassword', validator.user_id)
// auth.post('/resetPassword', validator.mobile)
// auth.post('/resetPassword', validator.otp)
// auth.post('/resetPassword', validator.user_pw)
// auth.post('/resetPassword', (req, res)=>{
  // sql = 'select * from user_info where user_id=? and mobile=?'
  // param = [req.body.user_id, req.body.mobile]
  // user = await pool.query sql, param
  //
  // unless user.length > 0 then return res.json {code:999, msg:RCODE.INVALID_USER_INFO}
  // otp = await redis.getAsync req.body.mobile
  // unless otp then return res.json {code:999, msg:RCODE.OTP_EXPIRED}
  //
  // otp = JSON.parse(otp)
  // unless otp.code is req.body.otp then return res.json {code:999, msg:RCODE.INVALID_OTP_CODE}
  //
  // result = await pool.query "select password('#{req.body.user_pw}') as user_pw"
  // user_pw = result[0].user_pw
  //
  // sql = 'update user_info set user_pw=? where user_id=?'
  // param = [user_pw, req.body.user_id]
  //
  // await pool.query sql, param
  // return res.json {code:200, msg:RCODE.OPERATION_SUCCEED}
// })

// 아이디 찾기
// auth.post('/findUserID', validator.mobile)
// auth.post('/findUserID', validator.otp)
// auth.post('/findUserID', validator.biz_reg_cd)
// auth.post('/findUserID', (req, res)=>{
  // sql = 'select * from user_info where mobile=?'
  // param = [req.body.mobile]
  // user = await pool.query sql, param
  //
  // unless user.length > 0 then return res.json {code:999, msg:RCODE.INVALID_MOBILE}
  //
  // switch user[0].group_type.toUpperCase()
  //   when GROUP_TYPE.AGENT    then sql = 'select * from agent where agent_cd=?'
  //   when GROUP_TYPE.MERCHANT then sql = 'select * from merchant where merchant_cd=?'
  //   else return res.json {code:999, msg:RCODE.INVALID_USER_INFO}
  //
  // param  = [user[0].group_cd]
  // member = await pool.query sql, param
  //
  // unless member.length > 0 then return res.json {code:999, msg:RCODE.INVALID_BIZ_REG_CD}
  // unless member[0].biz_reg_cd is req.body.biz_reg_cd then return res.json {code:999, msg:RCODE.INVALID_BIZ_REG_CD}
  //
  // user_id = user[0].user_id
  // user_id = user_id.substring(0, user_id.length-3) + '***'
  //
  // return res.json {code:200, msg:RCODE.OPERATION_SUCCEED, data:user_id}
// })

module.exports = auth
