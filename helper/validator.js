'use strict'

const _ = require('lodash')

let validator = {}
let regex     = {}

// etc
regex._id             = /^[a-fA-F0-9]{24}$/                                // mongo ObjectId
regex.limit           = /^[0-9]+$/                                         // 페이지당 아이템 개수
regex.page            = /^[0-9]+$/                                         // 페이지 번호
regex.loginProvider   = /^.{1,100}$/                                       // 소셜 로그인 공급자

// user
regex.email           = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/    // 이메일
regex.password        = /^.{1,100}$/                                       // 패스워드
regex.name            = /^.{1,100}$/                                       // 이름
regex.firstName       = /^.{1,100}$/                                       // 이름
regex.lastName        = /^.{1,100}$/                                       // 성
regex.phone           = /^.{1,100}$/                                       // 전화번호
regex.url             = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
regex.companyName     = /^.{1,100}$/                                       // 회사 이름
regex.bizLicenseNo    = /^[0-9-]{1,50}$/                                   // 사업자 번호

// credit card
regex.alias           = /^.{1,50}$/                                        // 카드별칭
regex.cardNo          = /^[0-9]{4}-?[0-9]{4}-?[0-9]{4}-?[0-9]{4}$/         // 카드번호
regex.expires         = /^[0-9]{1,2}\/[0-9]{4}$/                           // 만료 월/년
regex.fullName        = /^[A-Za-z ]{1,50}$/                                // 카드표기 이름
regex.address         = /^.{1,200}$/                                       // 주소
regex.city            = /^.{1,100}$/                                       // 도시 이름
regex.state           = /^.{1,100}$/                                       // 주 이름
regex.zipCode         = /^[0-9-]{1,10}$/                                   // 우편번호

// bank account
regex.bankName        = /^.{1,50}$/                                        // 은행 이름
regex.accountNo       = /^[0-9-]{1,50}$/                                   // 계좌 번호
regex.routingNo       = /^[0-9-]{1,50}$/                                   // routing No ?

// voices & voice products
regex.description     = /^.{1,1000}$/                                      // 설명
regex.price           = /^\d+[.]?\d+$/                                     // 상품 가격
regex.age             = /^\d+$/                                            // 나이
regex.colorCode       = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/               // 색상 코드
regex.keywords        = /^.{1,100}$/                                       // 색상 키워드
regex.gender          = /^[MFN]$/                                          // 성별 (M, F, N)
regex.vvsId           = /^.{1,500}$/                                       // VVS 연동 id
regex.language        = /^.{1,500}$/                                       // 언어 국가
regex.categoryCode    = /^[A-Za-z0-9_-]+[.]?[A-Za-z0-9_-]*$/               // 카테고리 코드

// etc
regex.agent_cd        = /^[A-Z]{2}[0-9]{12}$/                              // 제휴사 코드
regex.company_nm      = /^[가-힣A-Za-z0-9]{1,45}$/                         // 사업자명
regex.main_phone_num  = /^[0-9]{9,16}$/                                    // 대표전화번호
regex.manager_nm      = /^[가-힣A-Za-z0-9]{1,10}$/                         // 담당자 이름
regex.manager_id      = /^[A-Za-z][A-Za-z0-9]{3,20}$/                      // 담당자 아이디
regex.manager_pw      = /^\S{4,45}$/                                       // 담당자 패스워드
regex.system_use_yn   = /^[YNyn]$/                                         // 사용여부
regex.bank_cd         = /^[0-9]{3}$/                                       // 은행코드
regex.bank_nm         = /^[가-힣A-Za-z0-9]{2,10}$/                         // 은행명
regex.depositor       = /^[가-힣A-Za-z0-9]{1,45}$/                         // 예금주
regex.bank_account_num= /^[0-9]{10,16}$/                                   // 계좌번호
regex.user_id         = /^[A-Za-z][A-Za-z0-9]{3,20}$/                      // 담당자 아이디
regex.user_nm         = /^[가-힣A-Za-z0-9]{1,10}$/                         // 담당자 이름
regex.use_yn          = /^[YNyn]$/                                         // 사용여부
regex.group_cd        = /^[A-Z]{2}[0-9]{12}$/                              // 제휴사 코드 or 가맹점 코드
regex.otp             = /^[0-9]{4}$/                                       // OTP 코드

validator.regex = regex
//--------------------------------------------------
// user
//--------------------------------------------------
validator.email = (req, res, next)=>{
  if(!req.body.hasOwnProperty('email'))
    return res.json({msg:RCODE.EMAIL_REQUIRED, data:{}})

  if(!req.body.email || !regex.email.test(req.body.email.toLowerCase()))
    return res.json({msg:RCODE.INVALID_EMAIL, data:{}})

  req.body.email = req.body.email.toLowerCase()

  return next()
}

validator.if_email = (req, res, next)=>{
  if(!req.body.hasOwnProperty('email'))
    return next()

  if(!regex.email.test(req.body.email.toLowerCase()))
    return res.json({msg:RCODE.INVALID_EMAIL, data:{}})

  req.body.email = req.body.email.toLowerCase()

  return next()
}

validator.isNewEmail = async (req, res, next)=>{
  try{
    if(!req.body.hasOwnProperty('email'))
      return res.json({msg:RCODE.EMAIL_REQUIRED, data:{}})

    if(!req.body.email || !regex.email.test(req.body.email))
      return res.json({msg:RCODE.INVALID_EMAIL, data:{}})

    let regexp = new RegExp(req.body.email, 'i')
    let user = await Users.findOne({email: regexp}, {password:0, __v:0})
    if(user)
      return res.json({msg:RCODE.EMAIL_DUPLICATED, data:{}})

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}


validator.password = (req, res, next)=>{
  if(!req.body.hasOwnProperty('password'))
    return res.json({msg:RCODE.PASSWORD_REQUIRED, data:{}})

  if(!req.body.password || !regex.password.test(req.body.password))
    return res.json({msg:RCODE.INVALID_PASSWORD, data:{}})

  return next()
}

validator.if_password = (req, res, next)=>{
  if(!req.body.hasOwnProperty('password'))
    return next()

  if(!regex.password.test(req.body.password))
    return res.json({msg:RCODE.INVALID_PASSWORD, data:{}})

  return next()
}

validator.thumbnailUrl = (req, res, next)=>{
  if(!req.body.hasOwnProperty('thumbnailUrl'))
    return res.json({msg:RCODE.THUMBNAIL_URL_REQUIRED, data:{}})

  if(!req.body.thumbnailUrl)
    return res.json({msg:RCODE.INVALID_THUMBNAIL_URL, data:{}})

  return next()
}

validator.if_thumbnailUrl = (req, res, next)=>{
  if(!req.body.hasOwnProperty('thumbnailUrl'))
    return next()

  return next()
}

validator.role = (req, res, next)=>{
  if(!req.body.hasOwnProperty('role'))
    return res.json({msg:RCODE.ROLE_REQUIRED, data:{}})

  if(!req.body.role)
    return res.json({msg:RCODE.INVALID_ROLE, data:{}})

  let roles = req.body.role.toUpperCase().split(',')
  for(let role of roles){
    if(!_.find(USER_ROLE, {code: role}))
      return res.json({msg:RCODE.INVALID_ROLE, data:{}})
  }

  return next()
}

validator.if_role = (req, res, next)=>{
  if(!req.body.hasOwnProperty('role'))
    return next()

  let roles = req.body.role.toUpperCase().split(',')
  for(let role of roles){
    if(!_.find(USER_ROLE, {code: role}))
      return res.json({msg:RCODE.INVALID_ROLE, data:{}})
  }

  return next()
}

validator.companyName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('companyName'))
    return res.json({msg:RCODE.COMPANY_NAME_REQUIRED, data:{}})

  if(!req.body.companyName || !regex.companyName.test(req.body.companyName))
    return res.json({msg:RCODE.INVALID_COMPANY_NAME, data:{}})

  return next()
}

validator.if_companyName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('companyName'))
    return next()

  if(!regex.companyName.test(req.body.companyName))
    return res.json({msg:RCODE.INVALID_COMPANY_NAME, data:{}})

  return next()
}

validator.bizLicenseNo = (req, res, next)=>{
  if(!req.body.hasOwnProperty('bizLicenseNo'))
    return res.json({msg:RCODE.BIZ_LICENSE_NUM_REQUIRED, data:{}})

  if(!req.body.bizLicenseNo || !regex.bizLicenseNo.test(req.body.bizLicenseNo))
    return res.json({msg:RCODE.INVALID_BIZ_LICENSE_NUM, data:{}})

  return next()
}

validator.if_bizLicenseNo = (req, res, next)=>{
  if(!req.body.hasOwnProperty('bizLicenseNo'))
    return next()

  if(!regex.bizLicenseNo.test(req.body.bizLicenseNo))
    return res.json({msg:RCODE.INVALID_BIZ_LICENSE_NUM, data:{}})

  return next()
}

validator.name = (req, res, next)=>{
  if(!req.body.hasOwnProperty('name'))
    return res.json({msg:RCODE.NAME_REQUIRED, data:{}})

  if(!req.body.name || !regex.name.test(req.body.name))
    return res.json({msg:RCODE.INVALID_NAME, data:{}})

  return next()
}

validator.if_name = (req, res, next)=>{
  if(!req.body.hasOwnProperty('name'))
    return next()

  if(!regex.name.test(req.body.name))
    return res.json({msg:RCODE.INVALID_NAME, data:{}})

  return next()
}

validator.firstName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('firstName'))
    return res.json({msg:RCODE.FIRST_NAME_REQUIRED, data:{}})

  if(!req.body.firstName || !regex.firstName.test(req.body.firstName))
    return res.json({msg:RCODE.INVALID_FIRST_NAME, data:{}})

  return next()
}

validator.if_firstName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('firstName'))
    return next()

  if(!regex.firstName.test(req.body.firstName))
    return res.json({msg:RCODE.INVALID_FIRST_NAME, data:{}})

  return next()
}

validator.lastName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('lastName'))
    return res.json({msg:RCODE.LAST_NAME_REQUIRED, data:{}})

  if(!req.body.lastName || !regex.lastName.test(req.body.lastName))
    return res.json({msg:RCODE.INVALID_LAST_NAME, data:{}})

  return next()
}

validator.if_lastName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('lastName'))
    return next()

  if(!regex.lastName.test(req.body.lastName))
    return res.json({msg:RCODE.INVALID_LAST_NAME, data:{}})

  return next()
}

validator.phone1 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('phone1'))
    return res.json({msg:RCODE.PHONE1_NUM_REQUIRED, data:{}})

  if(!req.body.phone1 || !regex.phone.test(req.body.phone1))
      return res.json({msg:RCODE.INVALID_PHONE1_NUM, data:{}})

  if(!_.find(COUNTRY, {phone_code: req.body.phone1}))
    return res.json({msg:RCODE.INVALID_PHONE1_NUM, data:{}})

  return next()
}

validator.phone2 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('phone2'))
    return res.json({msg:RCODE.PHONE2_NUM_REQUIRED, data:{}})

  if(!req.body.phone2 || !regex.phone.test(req.body.phone2))
    return res.json({msg:RCODE.INVALID_PHONE2_NUM, data:{}})

  return next()
}

validator.if_phone1 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('phone1'))
    return next()

  if(!regex.phone.test(req.body.phone1))
    return res.json({msg:RCODE.INVALID_PHONE1_NUM, data:{}})

  if(!_.find(COUNTRY, {phone_code: req.body.phone1}))
      return res.json({msg:RCODE.INVALID_PHONE1_NUM, data:{}})

  return next()
}

validator.if_phone2 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('phone2'))
    return next()

  if(!regex.phone.test(req.body.phone2))
    return res.json({msg:RCODE.INVALID_PHONE2_NUM, data:{}})

  return next()
}

validator.country = (req, res, next)=>{
  if(!req.body.hasOwnProperty('country'))
    return res.json({msg:RCODE.COUNTRY_CODE_REQUIRED, data:{}})

  if(!req.body.country)
    return res.json({msg:RCODE.INVALID_COUNTRY_CODE, data:{}})

  if(!_.find(COUNTRY, {code:req.body.country.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_COUNTRY_CODE, data:{}})

  return next()
}

validator.if_country = (req, res, next)=>{
  if(!req.body.hasOwnProperty('country'))
    return next()

  if(!_.find(COUNTRY, {code:req.body.country.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_COUNTRY_CODE, data:{}})

  return next()
}

validator.userType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('userType'))
    return res.json({msg:RCODE.USER_TYPE_REQUIRED, data:{}})

  if(!req.body.userType)
    return res.json({msg:RCODE.INVALID_USER_TYPE, data:{}})

  let userTypes = req.body.userType.toUpperCase().split(',')
  for(let type of userTypes){
    if(!_.find(USER_TYPE, {code: type}))
      return res.json({msg:RCODE.INVALID_USER_TYPE, data:{}})
  }

  return next()
}

validator.if_userType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('userType'))
    return next()

  let userTypes = req.body.userType.toUpperCase().split(',')
  for(let type of userTypes){
    if(!_.find(USER_TYPE, {code: type}))
      return res.json({msg:RCODE.INVALID_USER_TYPE, data:{}})
  }

  return next()
}


//--------------------------------------------------
// credit card
//--------------------------------------------------
validator.alias = (req, res, next)=>{
  if(!req.body.hasOwnProperty('alias'))
    return res.json({msg:RCODE.ALIAS_REQUIRED, data:{}})

  if(!req.body.alias || !regex.alias.test(req.body.alias))
    return res.json({msg:RCODE.INVALID_ALIAS, data:{}})

  return next()
}

validator.if_alias = (req, res, next)=>{
  if(!req.body.hasOwnProperty('alias'))
    return next()

  if(!regex.alias.test(req.body.alias))
    return res.json({msg:RCODE.INVALID_ALIAS, data:{}})

  return next()
}

validator.cardNo = (req, res, next)=>{
  if(!req.body.hasOwnProperty('cardNo'))
    return res.json({msg:RCODE.CARD_NUM_REQUIRED, data:{}})

  if(!req.body.cardNo || !regex.cardNo.test(req.body.cardNo))
    return res.json({msg:RCODE.INVALID_CARD_NUM, data:{}})

  return next()
}

validator.if_cardNo = (req, res, next)=>{
  if(!req.body.hasOwnProperty('cardNo'))
    return next()

  if(!regex.cardNo.test(req.body.cardNo))
    return res.json({msg:RCODE.INVALID_CARD_NUM, data:{}})

  return next()
}

validator.expires = (req, res, next)=>{
  if(!req.body.hasOwnProperty('expires'))
    return res.json({msg:RCODE.EXPIRES_REQUIRED, data:{}})

  if(!req.body.expires || !regex.expires.test(req.body.expires))
    return res.json({msg:RCODE.INVALID_EXPIRES, data:{}})

  return next()
}

validator.if_expires = (req, res, next)=>{
  if(!req.body.hasOwnProperty('expires'))
    return next()

  if(!regex.expires.test(req.body.expires))
    return res.json({msg:RCODE.INVALID_EXPIRES, data:{}})

  return next()
}

validator.fullName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('fullName'))
    return res.json({msg:RCODE.FULL_NAME_REQUIRED, data:{}})

  if(!req.body.fullName || !regex.fullName.test(req.body.fullName))
    return res.json({msg:RCODE.INVALID_FULL_NAME, data:{}})

  return next()
}

validator.if_fullName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('fullName'))
    return next()

  if(!regex.fullName.test(req.body.fullName))
    return res.json({msg:RCODE.INVALID_FULL_NAME, data:{}})

  return next()
}

validator.address1 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('address1'))
    return res.json({msg:RCODE.ADDRESS1_REQUIRED, data:{}})

  if(!req.body.address1 || !regex.address.test(req.body.address1))
    return res.json({msg:RCODE.INVALID_ADDRESS1, data:{}})

  return next()
}

validator.if_address1 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('address1'))
    return next()

  if(!regex.address.test(req.body.address1))
    return res.json({msg:RCODE.INVALID_ADDRESS1, data:{}})

  return next()
}

validator.address2 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('address2'))
    return res.json({msg:RCODE.ADDRESS2_REQUIRED, data:{}})

  if(!req.body.address2 || !regex.address.test(req.body.address2))
    return res.json({msg:RCODE.INVALID_ADDRESS2, data:{}})

  return next()
}

validator.if_address2 = (req, res, next)=>{
  if(!req.body.hasOwnProperty('address2'))
    return next()

  if(!regex.address.test(req.body.address2))
    return res.json({msg:RCODE.INVALID_ADDRESS2, data:{}})

  return next()
}

validator.city = (req, res, next)=>{
  if(!req.body.hasOwnProperty('city'))
    return res.json({msg:RCODE.CITY_REQUIRED, data:{}})

  if(!req.body.city || !regex.city.test(req.body.city))
    return res.json({msg:RCODE.INVALID_CITY, data:{}})

  return next()
}

validator.if_city = (req, res, next)=>{
  if(!req.body.hasOwnProperty('city'))
    return next()

  if(!regex.city.test(req.body.city))
    return res.json({msg:RCODE.INVALID_CITY, data:{}})

  return next()
}

validator.state = (req, res, next)=>{
  if(!req.body.hasOwnProperty('state'))
    return res.json({msg:RCODE.STATE_REQUIRED, data:{}})

  if(!req.body.state || !regex.state.test(req.body.state))
    return res.json({msg:RCODE.INVALID_STATE, data:{}})

  return next()
}

validator.if_state = (req, res, next)=>{
  if(!req.body.hasOwnProperty('state'))
    return next()

  if(!regex.state.test(req.body.state))
    return res.json({msg:RCODE.INVALID_STATE, data:{}})

  return next()
}

validator.zipCode = (req, res, next)=>{
  if(!req.body.hasOwnProperty('zipCode'))
    return res.json({msg:RCODE.ZIPCODE_REQUIRED, data:{}})

  if(!req.body.zipCode || !regex.zipCode.test(req.body.zipCode))
    return res.json({msg:RCODE.INVALID_ZIPCODE, data:{}})

  return next()
}

validator.if_zipCode = (req, res, next)=>{
  if(!req.body.hasOwnProperty('zipCode'))
    return next()

  if(!regex.zipCode.test(req.body.zipCode))
    return res.json({msg:RCODE.INVALID_ZIPCODE, data:{}})

  return next()
}

validator.isDefault = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isDefault'))
    return res.json({msg:RCODE.IS_DEFAULT_REQUIRED, data:{}})

  if(req.body.isDefault === null)
    return res.json({msg:RCODE.INVALID_IS_DEFAULT, data:{}})

  return next()
}

validator.if_isDefault = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isDefault'))
    return next()

  return next()
}

validator.if_isSignedOut = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isSignedOut'))
    return next()

  let isSignedOut = JSON.parse(req.body.isSignedOut)
  if(typeof(isSignedOut) !== "boolean")
    return res.json({msg:RCODE.INVALID_IS_SIGNED_OUT, data:{}})

  return next()
}

validator.if_signedOutAt = (req, res, next)=>{
  if(!req.body.hasOwnProperty('signedOutAt'))
    return next()

  let signedOutAt = new Date(req.body.signedOutAt)
  if( !signedOutAt instanceof Date )
    return res.json({msg:RCODE.INVALID_SIGNED_OUT_AT, data:{}})

  return next()
}

validator.param_isNewCardNo = async (req, res, next)=>{
  try{
    if(!req.params.hasOwnProperty('_id'))
      return res.json({msg:RCODE.ID_REQUIRED, data:{}})

    if(!req.params._id || !regex._id.test(req.params._id))
      return res.json({msg:RCODE.INVALID_ID, data:{}})

    if(!req.body.hasOwnProperty('cardNo'))
      return res.json({msg:RCODE.CARD_NUM_REQUIRED, data:{}})

    if(!req.body.cardNo || !regex.cardNo.test(req.body.cardNo))
      return res.json({msg:RCODE.INVALID_CARD_NUM, data:{}})

    // check user _id exists
    let _id = mongoose.Types.ObjectId(req.params._id)
    let cardNo = req.body.cardNo
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})
    if(!user)
      return res.json({msg:RCODE.USER_NOT_FOUND, data:{}})

    // check card No exists
    for(let card of user.creditCards){
      if(card.cardNo.replace(/-/g, '') === cardNo.replace(/-/g, ''))
        return res.json({msg:RCODE.CARD_NUM_DUPLICATED, data:{}})
    }

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.param_isUserIdExist = async (req, res, next)=>{
  try{
    if(!req.params.hasOwnProperty('_id'))
      return res.json({msg:RCODE.ID_REQUIRED, data:{}})

    if(!req.params._id || !regex._id.test(req.params._id))
      return res.json({msg:RCODE.INVALID_ID, data:{}})

    // check user _id exists
    let _id = mongoose.Types.ObjectId(req.params._id)
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})
    if(!user)
      return res.json({msg:RCODE.USER_NOT_FOUND, data:{}})

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.param_is_cardNoExist = async (req, res, next)=>{
  try{
    if(!req.params.hasOwnProperty('_id'))
      return res.json({msg:RCODE.ID_REQUIRED, data:{}})

    if(!req.params._id || !regex._id.test(req.params._id))
      return res.json({msg:RCODE.INVALID_ID, data:{}})

    if(!req.params.hasOwnProperty('cardNo'))
      return res.json({msg:RCODE.CARD_NUM_REQUIRED, data:{}})

    if(!req.params.cardNo)
      return res.json({msg:RCODE.INVALID_CARD_NUM, data:{}})

    // check user _id exists
    let _id = mongoose.Types.ObjectId(req.params._id)
    let cardNo = req.params.cardNo
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})
    if(!user)
      return res.json({msg:RCODE.USER_NOT_FOUND, data:{}})

    // check card No exists
    for(let card of user.creditCards){
      if(card.cardNo.replace(/-/g, '') === cardNo.replace(/-/g, ''))
        return next()
    }

    return res.json({msg:RCODE.CARD_NUM_NOT_FOUND, data:{}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}


//--------------------------------------------------
// bank account
//--------------------------------------------------
validator.param_isNewAccountNo = async (req, res, next)=>{
  try{
    if(!req.params.hasOwnProperty('_id'))
      return res.json({msg:RCODE.ID_REQUIRED, data:{}})

    if(!req.params._id || !regex._id.test(req.params._id))
      return res.json({msg:RCODE.INVALID_ID, data:{}})

    if(!req.body.hasOwnProperty('accountNo'))
      return res.json({msg:RCODE.ACCOUNT_NUM_REQUIRED, data:{}})

    if(!req.body.accountNo || !regex.accountNo.test(req.body.accountNo))
      return res.json({msg:RCODE.INVALID_ACCOUNT_NUM, data:{}})

    // check user _id exists
    let _id = mongoose.Types.ObjectId(req.params._id)
    let accountNo = req.body.accountNo
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})
    if(!user)
      return res.json({msg:RCODE.USER_NOT_FOUND, data:{}})

    // check account No exists
    for(let account of user.bankAccounts){
      if(account.accountNo.replace(/-/g, '') === accountNo.replace(/-/g, ''))
        return res.json({msg:RCODE.ACCOUNT_NUM_DUPLICATED, data:{}})
    }

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.param_is_accountNoExist = async (req, res, next)=>{
  try{
    if(!req.params.hasOwnProperty('_id'))
      return res.json({msg:RCODE.ID_REQUIRED, data:{}})

    if(!req.params._id || !regex._id.test(req.params._id))
      return res.json({msg:RCODE.INVALID_ID, data:{}})

    if(!req.params.hasOwnProperty('accountNo'))
      return res.json({msg:RCODE.ACCOUNT_NUM_REQUIRED, data:{}})

    // check user _id exists
    let _id = mongoose.Types.ObjectId(req.params._id)
    let accountNo = req.params.accountNo
    let user = await Users.findOne({_id: _id}, {password:0, __v:0})
    if(!user)
      return res.json({msg:RCODE.USER_NOT_FOUND, data:{}})

    // check account No exists
    for(let account of user.bankAccounts){
      if(account.accountNo.replace(/-/g, '') === accountNo.replace(/-/g, ''))
        return next()
    }

    return res.json({msg:RCODE.ACCOUNT_NUM_NOT_FOUND, data:{}})
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.bankName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('bankName'))
    return res.json({msg:RCODE.BANK_NAME_REQUIRED, data:{}})

  if(!req.body.bankName || !regex.bankName.test(req.body.bankName))
    return res.json({msg:RCODE.INVALID_BANK_NAME, data:{}})

  return next()
}

validator.if_bankName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('bankName'))
    return next()

  if(!regex.bankName.test(req.body.bankName))
    return res.json({msg:RCODE.INVALID_BANK_NAME, data:{}})

  return next()
}

validator.accountType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('accountType'))
    return res.json({msg:RCODE.ACCOUNT_TYPE_REQUIRED, data:{}})

  if(!req.body.accountType)
    return res.json({msg:RCODE.INVALID_ACCOUNT_TYPE, data:{}})

  if(!_.find(ACCOUNT_TYPE, {code: req.body.accountType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_ACCOUNT_TYPE, data:{}})

  return next()
}

validator.if_accountType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('accountType'))
    return next()

  if(!_.find(ACCOUNT_TYPE, {code: req.body.accountType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_ACCOUNT_TYPE, data:{}})

  return next()
}

validator.routingNo = (req, res, next)=>{
  if(!req.body.hasOwnProperty('routingNo'))
    return res.json({msg:RCODE.ROUTING_NUM_REQUIRED, data:{}})

  if(!req.body.routingNo || !regex.routingNo.test(req.body.routingNo))
    return res.json({msg:RCODE.INVALID_ROUTING_NUM, data:{}})

  return next()
}

validator.if_routingNo = (req, res, next)=>{
  if(!req.body.hasOwnProperty('routingNo'))
    return next()

  if(!regex.routingNo.test(req.body.routingNo))
      return res.json({msg:RCODE.INVALID_ROUTING_NUM, data:{}})

  return next()
}


//--------------------------------------------------
// voices products
//--------------------------------------------------
validator.param_isProductIdExist = async (req, res, next)=>{
  try{
    if(!req.params.hasOwnProperty('_id'))
      return res.json({msg:RCODE.PRODUCT_ID_REQUIRED, data:{}})

    if(!req.params._id || !regex._id.test(req.params._id))
      return res.json({msg:RCODE.INVALID_PRODUCT_ID, data:{}})

    // check voice product _id exists
    let _id = mongoose.Types.ObjectId(req.params._id)
    let vp = await VoicesProducts.findOne({_id: _id}, {__v:0})
    if(!vp)
      return res.json({msg:RCODE.PRODUCT_NOT_FOUND, data:{}})

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.if_isProductIdExist = async (req, res, next)=>{
  try{
    if(!req.body.hasOwnProperty('productId'))
      return res.json({msg:RCODE.PRODUCT_ID_REQUIRED, data:{}})

    if(!regex._id.test(req.body.productId))
      return res.json({msg:RCODE.INVALID_PRODUCT_ID, data:{}})

    // check voice product _id exists
    let productId = mongoose.Types.ObjectId(req.body.productId)
    let product = await VoicesProducts.findOne({_id: productId}, {__v:0})
    if(!product)
      return res.json({msg:RCODE.PRODUCT_ID_NOT_FOUND, data:{}})

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.description = (req, res, next)=>{
  if(!req.body.hasOwnProperty('description'))
    return res.json({msg:RCODE.DESCRIPTION_REQUIRED, data:{}})

  if(!req.body.description || !regex.description.test(req.body.description))
    return res.json({msg:RCODE.INVALID_DESCRIPTION, data:{}})

  return next()
}

validator.if_description = (req, res, next)=>{
  if(!req.body.hasOwnProperty('description'))
    return next()

  if(!regex.description.test(req.body.description))
    return res.json({msg:RCODE.INVALID_DESCRIPTION, data:{}})

  return next()
}

validator.price = (req, res, next)=>{
  if(!req.body.hasOwnProperty('price'))
    return res.json({msg:RCODE.PRICE_REQUIRED, data:{}})

  if(!req.body.price || !regex.price.test(req.body.price))
    return res.json({msg:RCODE.INVALID_PRICE, data:{}})

  return next()
}

validator.if_price = (req, res, next)=>{
  if(!req.body.hasOwnProperty('price'))
    return next()

  if(!regex.price.test(req.body.price))
    return res.json({msg:RCODE.INVALID_PRICE, data:{}})

  return next()
}

validator.currency = (req, res, next)=>{
  if(!req.body.hasOwnProperty('currency'))
    return res.json({msg:RCODE.CURRENCY_REQUIRED, data:{}})

  if(!_.find(CURRENCY, {code:req.body.currency.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_CURRENCY, data:{}})

  return next()
}

validator.if_currency = (req, res, next)=>{
  if(!req.body.hasOwnProperty('currency'))
    return res.json({msg:RCODE.CURRENCY_REQUIRED, data:{}})

  if(!req.body.currency)
    return res.json({msg:RCODE.INVALID_CURRENCY, data:{}})

  if(!_.find(CURRENCY, {code:req.body.currency.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_CURRENCY, data:{}})

  return next()
}

validator.text = (req, res, next)=>{
  if(!req.body.hasOwnProperty('text'))
    return res.json({msg:RCODE.TEXT_REQUIRED, data:{}})

  if(!req.body.text)
    return res.json({msg:RCODE.INVALID_TEXT, data:{}})

  return next()
}

validator.voiceParameters = (req, res, next)=>{
  if(!req.body.hasOwnProperty('voiceParameters'))
    return res.json({msg:RCODE.VOICEPARAMETERS_REQUIRED, data:{}})

  if(!req.body.voiceParameters)
    return res.json({msg:RCODE.INVALID_VOICE_PARAMETERS, data:{}})

  return next()
}

validator.if_voiceParameters = (req, res, next)=>{
  if(!req.body.hasOwnProperty('voiceParameters'))
    return next()

  return next()
}

validator.createdBy = (req, res, next)=>{
  if(!req.body.hasOwnProperty('createdBy'))
    return res.json({msg:RCODE.CREATED_BY_REQUIRED, data:{}})

  if(!req.body.createdBy || !regex.email.test(req.body.createdBy))
    return res.json({msg:RCODE.INVALID_CREATED_BY, data:{}})

  return next()
}

validator.if_createdBy = (req, res, next)=>{
  if(!req.body.hasOwnProperty('createdBy'))
    return next()

  if(!regex.email.test(req.body.createdBy))
    return res.json({msg:RCODE.INVALID_CREATED_BY, data:{}})

  return next()
}

validator.lastModifiedBy = (req, res, next)=>{
  if(!req.body.hasOwnProperty('lastModifiedBy'))
    return res.json({msg:RCODE.MODIFIED_BY_REQUIRED, data:{}})

  if(!req.body.lastModifiedBy || !regex.email.test(req.body.lastModifiedBy))
    return res.json({msg:RCODE.INVALID_MODIFIED_BY, data:{}})

  return next()
}

validator.if_lastModifiedBy = (req, res, next)=>{
  if(!req.body.hasOwnProperty('lastModifiedBy'))
    return next()

  if(!regex.email.test(req.body.lastModifiedBy))
    return res.json({msg:RCODE.INVALID_MODIFIED_BY, data:{}})

  return next()
}

validator.vvsId = (req, res, next)=>{
  if(!req.body.hasOwnProperty('vvsId'))
    return res.json({msg:RCODE.VVS_ID_REQUIRED, data:{}})

  if(!req.body.vvsId || !regex.vvsId.test(req.body.vvsId))
    return res.json({msg:RCODE.INVALID_VVS_ID, data:{}})

  return next()
}

validator.if_vvsId = (req, res, next)=>{
  if(!req.body.hasOwnProperty('vvsId'))
    return next()

  if(!regex.vvsId.test(req.body.vvsId))
    return res.json({msg:RCODE.INVALID_VVS_ID, data:{}})

  return next()
}

validator.if_isVoiceIdExist = async (req, res, next)=>{
  try{
    if(!req.body.hasOwnProperty('voiceId'))
      return next()

    if(!regex._id.test(req.body.voiceId))
      return res.json({msg:RCODE.INVALID_VOICE_ID, data:{}})

    // check user _id exists
    let voiceId = mongoose.Types.ObjectId(req.body.voiceId)
    let voice = await Voices.findOne({_id: voiceId})
    if(!voice)
      return res.json({msg:RCODE.VOICE_ID_NOT_FOUND, data:{}})

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.isVoiceIdExist = async (req, res, next)=>{
  try{
    if(!req.body.hasOwnProperty('voiceId'))
      return res.json({msg:RCODE.VOICE_ID_REQUIRED, data:{}})

    if(!req.body.voiceId || !regex._id.test(req.body.voiceId))
      return res.json({msg:RCODE.INVALID_VOICE_ID, data:{}})

    // check user _id exists
    let voiceId = mongoose.Types.ObjectId(req.body.voiceId)
    let voice = await Voices.findOne({_id: voiceId})
    if(!voice)
      return res.json({msg:RCODE.VOICE_ID_NOT_FOUND, data:{}})

    return next()
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
}

validator.voiceId = (req, res, next)=>{
  if(!req.body.hasOwnProperty('voiceId'))
    return res.json({msg:RCODE.VOICE_ID_REQUIRED, data:{}})

  if(!req.body.voiceId || !regex._id.test(req.body.voiceId))
    return res.json({msg:RCODE.INVALID_VOICE_ID, data:{}})

  return next()
}

validator.if_voiceId = (req, res, next)=>{
  if(!req.body.hasOwnProperty('voiceId'))
    return next()

  if(!regex._id.test(req.body.voiceId))
    return res.json({msg:RCODE.INVALID_VOICE_ID, data:{}})

  return next()
}

validator.category = (req, res, next)=>{
  if(!req.body.hasOwnProperty('category'))
    return res.json({msg:RCODE.CATEGORY_REQUIRED, data:{}})

  if(!req.body.category)
    return res.json({msg:RCODE.INVALID_CATEGORY, data:{}})

  // TODO: CATEGORY VALIDATION

  return next()
}

validator.if_category = (req, res, next)=>{
  if(!req.body.hasOwnProperty('category'))
    return next()

  // TODO: CATEGORY VALIDATION

  return next()
}

validator.age = (req, res, next)=>{
  if(!req.body.hasOwnProperty('age'))
    return res.json({msg:RCODE.AGE_REQUIRED, data:{}})

  if(!req.body.age || !regex.age.test(req.body.age))
    return res.json({msg:RCODE.INVALID_AGE, data:{}})

  return next()
}

validator.if_age = (req, res, next)=>{
  if(!req.body.hasOwnProperty('age'))
    return next()

  if(!regex.age.test(req.body.age))
    return res.json({msg:RCODE.INVALID_AGE, data:{}})

  return next()
}

validator.colorCode = (req, res, next)=>{
  if(!req.body.hasOwnProperty('colorCode'))
    return res.json({msg:RCODE.COLOR_CODE_REQUIRED, data:{}})

  if(!req.body.colorCode || !regex.colorCode.test(req.body.colorCode))
    return res.json({msg:RCODE.INVALID_COLOR_CODE, data:{}})

  return next()
}

validator.if_colorCode = (req, res, next)=>{
  if(!req.body.hasOwnProperty('colorCode'))
    return next()
  if(!regex.colorCode.test(req.body.colorCode))
    return res.json({msg:RCODE.INVALID_COLOR_CODE, data:{}})

  return next()
}

validator.colorPos = (req, res, next)=>{
  if(!req.body.hasOwnProperty('colorPos'))
    return res.json({msg:RCODE.COLOR_POS_REQUIRED, data:{}})

  if(req.body.colorPos === null)
    return res.json({msg:RCODE.INVALID_COLOR_POS, data:{}})

  // TODO: color position validation or test
  // if(!regex.colorPos.test(req.body.colorPos))
  //   return res.json({msg:RCODE.INVALID_COLOR_POS, data:{}})

  return next()
}

validator.if_colorPos = (req, res, next)=>{
  if(!req.body.hasOwnProperty('colorPos'))
    return next()

  // TODO: color position validation or test
  // if(!regex.colorPos.test(req.body.colorPos))
  //   return res.json({msg:RCODE.INVALID_COLOR_POS, data:{}})

  return next()
}

validator.keywords = (req, res, next)=>{
  if(!req.body.hasOwnProperty('keywords'))
    return res.json({msg:RCODE.KEYWORDS_REQUIRED, data:{}})

  if(!req.body.keywords || !regex.keywords.test(req.body.keywords))
    return res.json({msg:RCODE.INVALID_KEYWORDS, data:{}})

  return next()
}

validator.if_keywords = (req, res, next)=>{
  if(!req.body.hasOwnProperty('keywords'))
    return next()

  if(!regex.keywords.test(req.body.keywords))
    return res.json({msg:RCODE.INVALID_KEYWORDS, data:{}})

  return next()
}

validator.gender = (req, res, next)=>{
  if(!req.body.hasOwnProperty('gender'))
    return res.json({msg:RCODE.GENDER_REQUIRED, data:{}})

  if(!req.body.gender || !regex.gender.test(req.body.gender))
    return res.json({msg:RCODE.INVALID_GENDER, data:{}})

  return next()
}

validator.if_gender = (req, res, next)=>{
  if(!req.body.hasOwnProperty('gender'))
    return next()

  if(!regex.gender.test(req.body.gender))
    return res.json({msg:RCODE.INVALID_GENDER, data:{}})

  return next()
}

validator.isVirtualVoice = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isVirtualVoice'))
    return res.json({msg:RCODE.IS_VIRTUALVOICE_REQUIRED, data:{}})

  if(req.body.isVirtualVoice === null)
    return res.json({msg:RCODE.INVALID_IS_VIRTUALVOICE, data:{}})

  let isVirtualVoice = JSON.parse(req.body.isVirtualVoice)
  if(typeof(isVirtualVoice) !== "boolean")
    return res.json({msg:RCODE.INVALID_IS_VIRTUALVOICE, data:{}})

  return next()
}

validator.if_isVirtualVoice = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isVirtualVoice'))
    return next()

  let isVirtualVoice = JSON.parse(req.body.isVirtualVoice)
  if(typeof(isVirtualVoice) !== "boolean")
    return res.json({msg:RCODE.INVALID_IS_VIRTUALVOICE, data:{}})

  return next()
}

validator.language = (req, res, next)=>{
  if(!req.body.hasOwnProperty('language'))
    return res.json({msg:RCODE.LANGUAGE_REQUIRED, data:{}})

  if(!req.body.language || !regex.language.test(req.body.language))
    return res.json({msg:RCODE.INVALID_LANGUAGE, data:{}})

  return next()
}

validator.if_language = (req, res, next)=>{
  if(!req.body.hasOwnProperty('language'))
    return next()

  if(!regex.language.test(req.body.language))
    return res.json({msg:RCODE.INVALID_LANGUAGE, data:{}})

  return next()
}

validator.isSales = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isSales'))
    return res.json({msg:RCODE.IS_SALES_REQUIRED, data:{}})

  if(req.body.isSales === null)
    return res.json({msg:RCODE.INVALID_IS_SALES, data:{}})

  let isSales = JSON.parse(req.body.isSales)
  if(typeof(isSales) !== "boolean")
    return res.json({msg:RCODE.INVALID_IS_SALES, data:{}})

  return next()
}

validator.isReady = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isReady'))
    return res.json({msg:RCODE.IS_READY_REQUIRED, data:{}})

  if(req.body.isReady === null)
    return res.json({msg:RCODE.INVALID_IS_READY, data:{}})

  let isReady = JSON.parse(req.body.isReady)
  if(typeof(isReady) !== "boolean")
    return res.json({msg:RCODE.INVALID_IS_READY, data:{}})

  return next()
}

validator.if_isReady = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isReady'))
    return next()

  let isReady = JSON.parse(req.body.isReady)
  if(typeof(isReady) !== "boolean")
    return res.json({msg:RCODE.INVALID_IS_READY, data:{}})

  return next()
}

validator.previewMediaUrl = (req, res, next)=>{
  if(!req.body.hasOwnProperty('previewMediaUrl'))
    return res.json({msg:RCODE.MEDIA_URL_REQUIRED, data:{}})

  if(!req.body.previewMediaUrl)
    return res.json({msg:RCODE.INVALID_MEDIA_URL, data:{}})

  return next()
}

validator.if_previewMediaUrl = (req, res, next)=>{
  if(!req.body.hasOwnProperty('previewMediaUrl'))
    return next()

  return next()
}

validator.previewScript = (req, res, next)=>{
  if(!req.body.hasOwnProperty('previewScript'))
    return res.json({msg:RCODE.PREVIEW_SCRIPT_REQUIRED, data:{}})

  if(!req.body.previewScript || !regex.description.test(req.body.previewScript))
    return res.json({msg:RCODE.INVALID_PREVIEW_SCRIPT, data:{}})

  return next()
}

validator.if_previewScript = (req, res, next)=>{
  if(!req.body.hasOwnProperty('previewScript'))
    return next()

  if(!regex.description.test(req.body.previewScript))
    return res.json({msg:RCODE.INVALID_PREVIEW_SCRIPT, data:{}})

  return next()
}

validator.if_isDeleted = (req, res, next)=>{
  if(!req.body.hasOwnProperty('isDeleted'))
    return next()

  let isDeleted = JSON.parse(req.body.isDeleted)
  if(typeof(isDeleted) !== "boolean")
    return res.json({msg:RCODE.INVALID_IS_DELETED, data:{}})

  return next()
}

validator.if_deletedAt = (req, res, next)=>{
  if(!req.body.hasOwnProperty('deletedAt'))
    return next()

  let deletedAt = new Date(req.body.deletedAt)
  if( !deletedAt instanceof Date )
    return res.json({msg:RCODE.INVALID_DELETED_AT, data:{}})

  return next()
}

//--------------------------------------------------
// purchases
//--------------------------------------------------
validator.isBuyerIdExist = async (req, res, next)=>{
  if(!req.body.hasOwnProperty('buyerId'))
    return res.json({msg:RCODE.BUYER_ID_REQUIRED, data:{}})

  if(!req.body.buyerId || !regex._id.test(req.body.buyerId))
    return res.json({msg:RCODE.INVALID_BUYER_ID, data:{}})

  let userId = mongoose.Types.ObjectId(req.body.buyerId)
  let user = await Users.findOne({_id: userId})

  if(!user)
    return res.json({msg:RCODE.BUYER_ID_NOT_FOUND, data:{}})

  return next()
}

validator.isProductIdExist = async (req, res, next)=>{
  if(!req.body.hasOwnProperty('productId'))
    return res.json({msg:RCODE.PRODUCT_ID_REQUIRED, data:{}})

  if(!req.body.productId || !regex._id.test(req.body.productId))
    return res.json({msg:RCODE.INVALID_PRODUCT_ID, data:{}})

  // find voice product id
  let productId = mongoose.Types.ObjectId(req.body.productId)
  let product = await VoicesProducts.findOne({_id: productId})

  if(!product)
    return res.json({msg:RCODE.PRODUCT_ID_NOT_FOUND, data:{}})

  return next()
}

validator.param_isPurchaseIdExist = async (req, res, next)=>{
  if(!req.params.hasOwnProperty('_id'))
    return res.json({msg:RCODE.PURCHASE_ID_REQUIRED, data:{}})

  if(!req.params._id || !regex._id.test(req.params._id))
    return res.json({msg:RCODE.INVALID_PURCHASE_ID, data:{}})

  // find voice product id
  let _id = mongoose.Types.ObjectId(req.params._id)
  let purchase = await Purchases.findOne({_id: _id})

  if(!purchase)
    return res.json({msg:RCODE.PURCHASE_ID_NOT_FOUND, data:{}})

  return next()
}

validator.productId = (req, res, next)=>{
  if(!req.body.hasOwnProperty('productId'))
    return res.json({msg:RCODE.PRODUCT_ID_REQUIRED, data:{}})

  if(!req.body.productId || !regex._id.test(req.body.productId))
    return res.json({msg:RCODE.INVALID_PRODUCT_ID, data:{}})

  return next()
}

validator.if_productId = (req, res, next)=>{
  if(!req.body.hasOwnProperty('productId'))
    return next()

  if(!regex._id.test(req.body.productId))
    return res.json({msg:RCODE.INVALID_PRODUCT_ID, data:{}})

  return next()
}

validator.productName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('productName'))
    return res.json({msg:RCODE.PRODUCT_NAME_REQUIRED, data:{}})

  if(!req.body.productName || !regex.name.test(req.body.productName))
    return res.json({msg:RCODE.INVALID_PRODUCT_NAME, data:{}})

  return next()
}

validator.if_productName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('productName'))
    return next()

  if(!regex.name.test(req.body.productName))
    return res.json({msg:RCODE.INVALID_PRODUCT_NAME, data:{}})

  return next()
}

validator.payName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('payName'))
    return res.json({msg:RCODE.PAY_NAME_REQUIRED, data:{}})

  if(!req.body.payName || !regex.name.test(req.body.payName))
    return res.json({msg:RCODE.INVALID_PAY_NAME, data:{}})

  return next()
}

validator.if_payName = (req, res, next)=>{
  if(!req.body.hasOwnProperty('payName'))
    return next()

  if(!regex.name.test(req.body.payName))
    return res.json({msg:RCODE.INVALID_PAY_NAME, data:{}})

  return next()
}

validator.payState = (req, res, next)=>{
  if(!req.body.hasOwnProperty('payState'))
    return res.json({msg:RCODE.PAY_STATE_REQUIRED, data:{}})

  if(!regex.name.test(req.body.payState))
    return res.json({msg:RCODE.INVALID_PAY_STATE, data:{}})

  if(!_.find(PAY_STATE, {code: req.body.payState.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_PAY_STATE, data:{}})

  return next()
}

validator.if_payState = (req, res, next)=>{
  if(!req.body.hasOwnProperty('payState'))
    return next()

  if(!regex.name.test(req.body.payState))
    return res.json({msg:RCODE.INVALID_PAY_STATE, data:{}})

  if(!_.find(PAY_STATE, {code: req.body.payState.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_PAY_STATE, data:{}})

  return next()
}

validator.taskState = (req, res, next)=>{
  if(!req.body.hasOwnProperty('taskState'))
    return res.json({msg:RCODE.TASK_STATE_REQUIRED, data:{}})

  if(!req.body.taskState || !regex.name.test(req.body.taskState))
    return res.json({msg:RCODE.INVALID_TASK_STATE, data:{}})

  if(!_.find(TASK_STATE, {code: req.body.taskState.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_TASK_STATE, data:{}})

  return next()
}

validator.if_taskState = (req, res, next)=>{
  if(!req.body.hasOwnProperty('taskState'))
    return next()

  if(!regex.name.test(req.body.taskState))
    return res.json({msg:RCODE.INVALID_TASK_STATE, data:{}})

  if(!_.find(TASK_STATE, {code: req.body.taskState.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_TASK_STATE, data:{}})

  return next()
}

validator.payType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('payType'))
    return res.json({msg:RCODE.PAY_TYPE_REQUIRED, data:{}})

  if(!req.body.payType)
    return res.json({msg:RCODE.INVALID_PAY_TYPE, data:{}})

  if(!_.find(PAY_TYPE, {code:req.body.payType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_PAY_TYPE, data:{}})

  return next()
}

validator.if_payType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('payType'))
    return next()

  if(!_.find(PAY_TYPE, {code:req.body.payType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_PAY_TYPE, data:{}})

  return next()
}

validator.useType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('useType'))
    return res.json({msg:RCODE.USE_TYPE_REQUIRED, data:{}})

  if(!req.body.useType)
    return res.json({msg:RCODE.INVALID_USE_TYPE, data:{}})

  if(!_.find(USE_TYPE, {code:req.body.useType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_USE_TYPE, data:{}})

  return next()
}

validator.if_useType = (req, res, next)=>{
  if(!req.body.hasOwnProperty('useType'))
    return next()

  if(!_.find(USE_TYPE, {code:req.body.useType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_USE_TYPE, data:{}})

  return next()
}

validator.popular = (req, res, next)=>{
  if(!req.body.hasOwnProperty('popular'))
    return res.json({msg:RCODE.POPULAR_REQUIRED, data:{}})

  if(!req.body.popular || !Array.isArray(req.body.popular))
    return res.json({msg:RCODE.INVALID_POPULAR, data:{}})

  return next()
}

validator.if_popular = (req, res, next)=>{
  if(!req.body.hasOwnProperty('popular'))
    return next()

  if(!req.body.popular || !Array.isArray(req.body.popular))
    return res.json({msg:RCODE.INVALID_POPULAR, data:{}})

  return next()
}

validator.recommended = (req, res, next)=>{
  if(!req.body.hasOwnProperty('recommended'))
    return res.json({msg:RCODE.RECOMMENDED_REQUIRED, data:{}})

  if(!req.body.recommended || !Array.isArray(req.body.recommended))
    return res.json({msg:RCODE.INVALID_RECOMMENDED, data:{}})

  return next()
}

validator.if_recommended = (req, res, next)=>{
  if(!req.body.hasOwnProperty('recommended'))
    return next()

  if(!req.body.recommended || !Array.isArray(req.body.recommended))
    return res.json({msg:RCODE.INVALID_RECOMMENDED, data:{}})

  return next()
}

//--------------------------------------------------
// etc & query params
//--------------------------------------------------
validator.email_to = (req, res, next)=>{
  if(!req.body.hasOwnProperty('to'))
    return res.json({msg:RCODE.EMAIL_TO_REQUIRED, data:{}})

  if(!req.body.to || !regex.email.test(req.body.to))
    return res.json({msg:RCODE.INVALID_EMAIL_TO, data:{}})

  req.body.to = req.body.to.toLowerCase()

  return next()
}

validator.email_subject = (req, res, next)=>{
  if(!req.body.hasOwnProperty('subject'))
    return res.json({msg:RCODE.EMAIL_SUBJECT_REQUIRED, data:{}})

  if(!req.body.subject || !regex.name.test(req.body.subject))
    return res.json({msg:RCODE.INVALID_EMAIL_SUBJECT, data:{}})

  return next()
}

validator.email_html = (req, res, next)=>{
  if(!req.body.hasOwnProperty('html'))
    return res.json({msg:RCODE.EMAIL_HTML_REQUIRED, data:{}})

  if(!req.body.html)
    return res.json({msg:RCODE.INVALID_EMAIL_HTML, data:{}})

  return next()
}

validator.loginProvider = (req, res, next)=>{
  if(!req.body.hasOwnProperty('loginProvider'))
    return res.json({msg:RCODE.LOGIN_PROVIDER_REQUIRED, data:{}})

  if(!req.body.loginProvider || !regex.loginProvider.test(req.body.loginProvider))
    return res.json({msg:RCODE.INVALID_LOGIN_PROVIDER, data:{}})

  let provider = req.body.loginProvider.toUpperCase()
  if(!_.find(LOGIN_PROVIDER, {code: provider}))
    return res.json({msg:RCODE.INVALID_LOGIN_PROVIDER, data:{}})

  return next()
}

validator.providerInfo = (req, res, next)=>{
  if(!req.body.hasOwnProperty('providerInfo'))
    return res.json({msg:RCODE.PROVIDER_INFO_REQUIRED, data:{}})

  if(!req.body.providerInfo)
    return res.json({msg:RCODE.INVALID_PROVIDER_INFO, data:{}})

  return next()
}

validator.param_id = (req, res, next)=>{
  if(!req.params.hasOwnProperty('_id'))
    return res.json({msg:RCODE.ID_REQUIRED, data:{}})

  if(!req.params._id || !regex._id.test(req.params._id))
    return res.json({msg:RCODE.INVALID_ID, data:{}})

  return next()
}

validator.param_if_id = (req, res, next)=>{
  if(!req.params.hasOwnProperty('_id'))
    return next()

  if(!regex._id.test(req.params._id))
    return res.json({msg:RCODE.INVALID_ID, data:{}})

  return next()
}

validator.qry_limit = (req, res, next)=>{
  if(!req.query.hasOwnProperty('limit'))
    return res.json({msg:RCODE.LIMIT_REQUIRED, data:{}})

  if(!req.query.limit || !regex.limit.test(req.query.limit))
    return res.json({msg:RCODE.INVALID_LIMIT, data:{}})

  if(req.query.limit < 1)
    return res.json({msg:RCODE.INVALID_LIMIT, data:{}})

  return next()
}

validator.qry_page = (req, res, next)=>{
  if(!req.query.hasOwnProperty('page'))
    return res.json({msg:RCODE.PAGE_REQUIRED, data:{}})

  if(!req.query.page || !regex.page.test(req.query.page))
    return res.json({msg:RCODE.INVALID_PAGE, data:{}})

  if(req.query.page < 1)
    return res.json({msg:RCODE.INVALID_PAGE, data:{}})

  return next()
}


validator.qry_colorCode = (req, res, next)=>{
  if(!req.query.hasOwnProperty('colorCode'))
    return res.json({msg:RCODE.COLOR_CODE_REQUIRED, data:{}})

  if(!req.query.colorCode || !regex.colorCode.test(req.query.colorCode))
    return res.json({msg:RCODE.INVALID_COLOR_CODE, data:{}})

  return next()
}

validator.qry_if_colorCode = (req, res, next)=>{
  if(!req.query.hasOwnProperty('colorCode'))
    return next()

  if(!regex.colorCode.test(req.query.colorCode))
    return res.json({msg:RCODE.INVALID_COLOR_CODE, data:{}})

  return next()
}

validator.qry_categoryCode = (req, res, next)=>{
  if(!req.query.hasOwnProperty('categoryCode'))
    return res.json({msg:RCODE.CATEGORY_CODE_REQUIRED, data:{}})

  if(!req.query.categoryCode || !regex.categoryCode.test(req.query.categoryCode))
    return res.json({msg:RCODE.INVALID_CATEGORY_CODE, data:{}})

  return next()
}

validator.qry_if_categoryCode = (req, res, next)=>{
  if(!req.query.hasOwnProperty('categoryCode'))
    return next()

  if(!regex.categoryCode.test(req.query.categoryCode))
    return res.json({msg:RCODE.INVALID_CATEGORY_CODE, data:{}})

  return next()
}

validator.qry_if_keyword = (req, res, next)=>{
  if(!req.query.hasOwnProperty('keyword'))
    return next()

  if(!regex.keywords.test(req.query.keyword))
    return res.json({msg:RCODE.INVALID_KEYWORD, data:{}})

  return next()
}

validator.qry_if_language = (req, res, next)=>{
  if(!req.query.hasOwnProperty('language'))
    return next()

  if(!_.find(LANGUAGE, {code: req.query.language}))
    return res.json({msg:RCODE.INVALID_LANGUAGE, data:{}})

  return next()
}

validator.qry_if_productName = (req, res, next)=>{
  if(!req.query.hasOwnProperty('productName'))
    return next()

  if(!regex.name.test(req.query.productName))
    return res.json({msg:RCODE.INVALID_PRODUCT_NAME, data:{}})

  return next()
}

validator.qry_if_payName = (req, res, next)=>{
  if(!req.query.hasOwnProperty('payName'))
    return next()

  if(!regex.name.test(req.query.payName))
    return res.json({msg:RCODE.INVALID_PAY_NAME, data:{}})

  return next()
}

validator.qry_if_payType = (req, res, next)=>{
  if(!req.query.hasOwnProperty('payType'))
    return next()

  if(!_.find(PAY_TYPE, {code:req.body.payType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_PAY_TYPE, data:{}})

  return next()
}

validator.qry_if_useType = (req, res, next)=>{
  if(!req.query.hasOwnProperty('useType'))
    return next()

  if(!_.find(USE_TYPE, {code:req.body.useType.toUpperCase()}))
    return res.json({msg:RCODE.INVALID_USE_TYPE, data:{}})

  return next()
}


validator.deleteItems = (req, res, next)=>{
  if(!req.body.hasOwnProperty('deleteItems'))
    return res.json({msg:RCODE.DELETE_ITEMS_REQUIRED, data:{}})

  if(!req.body.deleteItems || !Array.isArray(req.body.deleteItems))
    return res.json({msg:RCODE.INVALID_DELETE_ITEMS, data:{}})

  if(req.body.deleteItems.length < 1)
    return res.json({msg:RCODE.INVALID_DELETE_ITEMS, data:{}})

  return next()
}

//--------------------------------------------------
// test
//--------------------------------------------------
// validator.otpType = (req, res, next)=>{
//   if(!req.body.hasOwnProperty('otpType'))
//     return res.json({msg:RCODE.INVALID_OTP_TYPE, data:{}})
//
//   switch(req.body.otpType.toUpperCase()){
//     case OTP_TYPE.FIND_MY_ID: return next()
//     case OTP_TYPE.FIND_MY_PW: return next()
//     default: return res.json({msg:RCODE.INVALID_OTP_TYPE, data:{}})
//   }
// }
//
// validator.if_otpType = (req, res, next)=>{
//   if(!req.body.hasOwnProperty('otpType'))
//     return next()
//
//   switch(req.body.otpType.toUpperCase()){
//     case OTP_TYPE.FIND_MY_ID: return next()
//     case OTP_TYPE.FIND_MY_PW: return next()
//     default: return res.json({msg:RCODE.INVALID_OTP_TYPE, data:{}})
//   }
// }
//
// validator.otp = (req, res, next)=>{
//   if(!req.body.hasOwnProperty('otp'))
//     return res.json({msg:RCODE.INVALID_OTP_CODE, data:{}})
//   if(!regex.otp.test(req.body.otp))
//     return res.json({msg:RCODE.INVALID_OTP_CODE, data:{}})
//
//   return next()
// }
//
// validator.if_otp = (req, res, next)=>{
//   if(!req.body.hasOwnProperty('otp'))
//     return next()
//   if(!regex.otp.test(req.body.otp))
//     return res.json({msg:RCODE.INVALID_OTP_CODE, data:{}})
//
//   return next()
// }
//
// validator.authLevel = (req, res, next)=>{
//   if(!req.body.hasOwnProperty('authLevel'))
//     return res.json({msg:RCODE.INVALID_AUTH_LEVEL})
//   if(!AUTH_LEVEL[req.body.auth_level])
//     return res.json({msg:RCODE.INVALID_AUTH_LEVEL})
//
//   return next()
// }
//
// validator.if_authLevel = (req, res, next)=>{
//   if(!req.body.hasOwnProperty('authLevel'))
//     return next()
//   if(!AUTH_LEVEL[req.body.auth_level])
//     return res.json({msg:RCODE.INVALID_AUTH_LEVEL})
//
//   return next()
// }

module.exports = validator
