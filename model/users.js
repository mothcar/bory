'use strict'

const _ = require('lodash')

const initSchema = async ()=>{
  const response = new mongoose.Schema({
    subject:          {type:String},      // Python
    category:         {type:String},      // 자료형
    number:           {type:String},      // 19번
    response:         {type:String},      // (a)
    answer:           {type:String},      // (a)
  }, {timestamps: true})

  const users = new mongoose.Schema({
    email:            {type:String, unique:true},       // 이메일
    name:             {type:String},                    // 사용자 이름
    password:         {type:String},                    // 로그인 암호
    role:             {type:String, default:'USER'},    // 'ADMIN, OPERATOR, USER'
    enabled:          {type:Boolean},                   // 사용여부
    isVerifiedEmail:  {type:Boolean, default:true},    // 이메일 확인 여부

    // for voice mall
    uuid:             {type:String},                    // 임시 UUID
    signedOutAt:      {type:Date, default: Date.now},   // 회원 탈퇴 일시.

    // Responses 시험결과
    exam:             {type:Array, default:[]},    // 츨제시험 exam
    responses:        {type:Array, default:[]},         // exam result
    // study:            {type:Array, default:[]},         // study result

    // social login info
    socialLogins:     {type:[], default:[]},            // 소셜 로그인 정보
    loginType:        {type:String}                     // 로그인 타입 (FACEBOOK, GOOGLE, EMAIL 등)
  }, {timestamps: true, minimize: false})

  try{
    const list = await mongoose.connection.db.listCollections().toArray()
    let index = _.findIndex(list, {name:'users'})
    if(index < 0)
      users.index({
        email:1,
        enabled:1,
        isVerifiedEmail:1,
        role:1,
        userType:1,
        uuid:1
      })
    else
      log('init schema (users): collection found. creation skipped')

    global.Users = mongoose.model('users', users)
    return new Promise((resolve, reject)=>{resolve('done')})
  }
  catch(err){
    log('err:', err)
  }
}

module.exports = initSchema()
