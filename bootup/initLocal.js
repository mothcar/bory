'use strict'

const initLocal = async ()=>{
  console.log('init local config')

  global.WWW_ROOT_URL     = 'http://r1.voicemall.net:8086'
  global.CMS_ROOT_URL     = 'http://r1.voicemall.net:8087'
  global.API_ROOT_URL     = 'http://r3.voicemall.net:9090'

  global.SIGNUP_COMPLETED = WWW_ROOT_URL + '/signup4'
  global.PAY_COMPLETED    = WWW_ROOT_URL + '/purchased'
  global.PAY_ERROR        = WWW_ROOT_URL + '/error'
  global.FATAL_ERROR      = WWW_ROOT_URL + '/error'

  global.EMAIL_CONFIRM_URL  = API_ROOT_URL + '/auth/signup/confirm'

  global.PAYPAL_RETURN_URL  = API_ROOT_URL + '/purchases/callback/paypal'
  global.PAYPAL_HOST        = 'www.sandbox.paypal.com'
  global.PAYPAL_POST_URL    = 'https://www.sandbox.paypal.com/cgi-bin/webscr'
  global.PAYPAL_CMD         = '_notify-synch'
  global.PAYPAL_AT          = 'mEjsFyyL2VW61_8-Q9VYXdEBPQ02NViW37HCBafchsYdMqpkiU3d677vuY0'

  global.SSL = {
    KEY:  './client-key.pem',
    CERT: './client-cert.pem'
  }

  global.APP = {
    HOST:        '127.0.0.1',
    // HOST:        '115.68.222.182',
    PORT:        9090,
    USE_SSL:    true,
  }

  global.APP.URL = 'http://' + APP.HOST  + ':' + APP.PORT

  global.REDIS = {
    HOST:     'localhost',
    PORT:     6379
  }

  // global.MONGODB = {
  //     HOST:     'localhost',
  //     PORT:     27017,
  //     DATABASE: 'address_db'
  //   }

  global.TOKEN = {
    TYPE:       'BEARER',
    SECRET:     'vvmall-secret',
    EXPIRE_SEC: 60 * 60 * 24
  }

  global.BCRYPT = {
    ROUND:     10,
    SEED:      10,
    SALT:      'voice-mall-bcrypt-salt',
    SALT_SIZE: 10
  }

  global.AXIOS = {
    BASE_URL: 'http://' + APP.HOST,
    TIMEOUT:  1000 * 1
  }

  global.NOREPLY_EMAIL  = 'noreply@sruniverse.kr'
  global.UUID_NAMESPACE = 'http://sruniverse.kr/voice-mall'

  global.NODEMAILER_NOREPLY = {
    host: 'smtp.mailplug.co.kr',
    port: 465,
    secure: true,
    auth: {
      user:'noreply@sruniverse.kr',
      pass:'Sru!q2w3e4r'
    }
  }

  global.MINIO = {
    ENDPOINT:     's3.voicemall.net',
    PORT:         443,
    USE_SSL:      true,
    ACCESS_KEY:   'VOICEMALL',
    SECRET_KEY:   'VOICEMALL!SECRET!KEY',
    BUCKET:       'voice-mall',
    DIR_IMAGES:   'images',
    DIR_AUDIOS:   'audios',
    REGION:       'us-east-1',
    METADATA_OCTET: {
      'Content-Type': 'application/octet-stream',
      'X-Amz-Meta-Testing': 1234,
      'example': 5678
    },
    METADATA_JPEG: {
      'Content-Type': 'image/jpeg',
      'X-Amz-Meta-Testing': 1234,
      'example': 5678
    },
    METADATA_WAV: {
      'Content-Type': 'audio/wav',
      'X-Amz-Meta-Testing': 1234,
      'example': 5678
    }
  }

  global.MINIO.POLICY_PUBLIC_READ = {
    Version:    "2012-10-17",
    Statement:  [
      {
        Sid:      "AddPerm",
        Effect:   "Allow",
        Principal: "*",
        Action:   ["s3:GetObject"],
        Resource: ["arn:aws:s3:::" + MINIO.BUCKET + '/' + MINIO.DIR_IMAGES + "/*", "arn:aws:s3:::" + MINIO.BUCKET + '/' + MINIO.DIR_AUDIOS + "/*"]
      }
    ]
  }

  global.MINIO_RECORDS = {
    ENDPOINT:   's3.voicemall.net',
    PORT:       443,
    USE_SSL:    true,
    ACCESS_KEY: 'VOICEMALL',
    SECRET_KEY: 'VOICEMALL!SECRET!KEY',
    BUCKET:     'records',
    REGION:     'us-east-1',
    METADATA_WAV: {
      'Content-Type': 'audio/wav',
      'X-Amz-Meta-Testing': 1234,
      'example': 5678
    }
  }

  global.MINIO_RECORDS_POLICY = {
    Version: "2012-10-17",
    Statement: [{
      Sid:      "AddPerm",
      Effect:   "Allow",
      Principal: "*",
      Action:   ["s3:GetObject"],
      Resource: ["arn:aws:s3:::" + MINIO_RECORDS.BUCKET + "/*"]
    }]
  }


  console.log('init minio endpoint: ' + MINIO.ENDPOINT +':'+ MINIO.PORT)
  console.log('init signup return url: ' + SIGNUP_COMPLETED)
  console.log('init email confirm url: ' + EMAIL_CONFIRM_URL)
  console.log('init paypal callback: ' + PAYPAL_RETURN_URL)
}


module.exports = initLocal()
