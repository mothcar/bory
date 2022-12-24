'use strict'

// init modules
const path        = require('path')
const https       = require('https')
const http        = require('http')
const fs          = require('fs')
global._          = require('lodash')
global.bluebird   = require('bluebird')
const helmet      = require('helmet')
const express     = require('express')
const bodyParser  = require('body-parser')
const cors        = require('cors')
const app         = express()

// init bootup
console.log('========================================')
console.log('node version: ' + process.version)
require('./bootup/initLocal')
require('./bootup/initGlobal')
// require('./bootup/initRedis')
require('./bootup/initMongo')
require('./bootup/initAxios')

// init express
app.use(helmet())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

// init router
app.use('/auth',          require('./endpoint/auth'))
app.use('/users',         require('./endpoint/users'))
app.use('/bjcode',        require('./endpoint/bjcode'))
app.use('/test',          require('./endpoint/test'))
app.use('/helper',        require('./endpoint/helper'))
app.use('/dbtools',       require('./endpoint/dbtools'))
// app.use('/images',        require('./endpoint/images'))

// start app
log('APP.USE_SSL', APP.USE_SSL)
if(APP.USE_SSL){
  // init SSL
  let ssl = {
    key:  fs.readFileSync(path.join(__dirname, 'cert', SSL.KEY)),
    cert: fs.readFileSync(path.join(__dirname, 'cert', SSL.CERT))
    // key:  fs.readFileSync(path.join(__dirname, 'cert', './client-key.pem')),
    // cert: fs.readFileSync(path.join(__dirname, 'cert', './client-cert.pem'))
    
  }

  https.createServer(ssl, app).listen(APP.PORT, ()=>{
    log(`init https REST: https://${APP.HOST}:${APP.PORT}`)
  })
}
else{
  http.createServer(app).listen(APP.PORT, ()=>{
    log(`init http REST: http://${APP.HOST}:${APP.PORT}`)
  })
}
