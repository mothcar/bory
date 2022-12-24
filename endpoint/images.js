'use strict'

// const moment    = require('moment')
// const acl       = require('../helper/acl')
const path        = require('path')
const qs          = require('qs')
const fs          = require('fs-extra')
const validator   = require('../helper/validator')
const tms         = require('../helper/tms')
const multer      = require('multer')
const upload      = multer({dest: 'upload/', limits:{fileSize: 50 * 1024 * 1024}}).single('image')
const minio       = require('minio')
const sharp       = require('sharp')
const express     = require('express')
const images      = express.Router({})
const UPLOAD_PATH = path.join(__dirname, '..', 'upload')

let minioClient = new minio.Client({
  endPoint:   MINIO.ENDPOINT,
  port:       MINIO.PORT,
  useSSL:     MINIO.USE_SSL,
  accessKey:  MINIO.ACCESS_KEY,
  secretKey:  MINIO.SECRET_KEY
})

images.post('/', tms.verifyToken)
images.post('/', async (req, res)=>{
  try{
    upload(req, res, async (err)=>{
      if(err instanceof multer.MulterError){
        if(err.message.toUpperCase() === 'UNEXPECTED FIELD')
          return res.json({msg:RCODE.IMAGE_FIELD_REQUIRED, data:{}})
        return res.status(500).json({msg:RCODE.FILE_UPLOAD_ERROR, data:{}})
      }
      else if(err){
        log('err=', err)
        return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
      }

      if(!req.file){
        log('err=', 'req.file NOT FOUND')
        return res.json({msg:RCODE.INVALID_IMAGE_FIELD, data:{}})
      }

      // resize image with jpg
      await sharp( path.join(UPLOAD_PATH, req.file.filename) )
        .resize(RESIZE.THUMB_W, RESIZE.THUMB_H)
        .resize({fit: "inside" })
        .jpeg()
        .toFile( path.join(UPLOAD_PATH, req.file.filename + RESIZE.THUMB_EXT) )

      // convert jpg
      await sharp( path.join(UPLOAD_PATH, req.file.filename) )
        .jpeg()
        .toFile( path.join(UPLOAD_PATH, req.file.filename + RESIZE.EXT))

      // check bucket exists
      if(await minioClient.bucketExists(MINIO.BUCKET)){
        // do something ?
      }
      else{
        await minioClient.makeBucket(MINIO.BUCKET, MINIO.REGION)
        console.log('bucket created successfully')
      }

      // set bucket policy
      await minioClient.setBucketPolicy(MINIO.BUCKET, JSON.stringify(MINIO.POLICY_PUBLIC_READ))

      // upload thumbnail
      let objectName = req.file.filename + RESIZE.THUMB_EXT
      let filePath   = path.join(UPLOAD_PATH, objectName)
      await minioClient.fPutObject(MINIO.BUCKET, MINIO.DIR_IMAGES +'/'+ objectName, filePath, MINIO.METADATA_JPEG)

      if(MINIO.USE_SSL)
        req.file.url = `https://${MINIO.ENDPOINT}/${MINIO.BUCKET}/${MINIO.DIR_IMAGES}/${objectName}`
      else
        req.file.url = `http://${MINIO.ENDPOINT}:${MINIO.PORT}/${MINIO.BUCKET}/${MINIO.DIR_IMAGES}/${objectName}`

      // upload origin
      objectName = req.file.filename + RESIZE.EXT
      filePath   = path.join(UPLOAD_PATH, objectName)
      await minioClient.fPutObject(MINIO.BUCKET, MINIO.DIR_IMAGES +'/'+ objectName, filePath, MINIO.METADATA_JPEG)

      if(MINIO.USE_SSL)
        req.file.urlOrigin = `https://${MINIO.ENDPOINT}/${MINIO.BUCKET}/${MINIO.DIR_IMAGES}/${objectName}`
      else
        req.file.urlOrigin += `http://${MINIO.ENDPOINT}:${MINIO.PORT}/${MINIO.BUCKET}/${MINIO.DIR_IMAGES}/${objectName}`

      // clean up upload files
      await fs.remove( path.join(UPLOAD_PATH, req.file.filename) )
      await fs.remove( path.join(UPLOAD_PATH, req.file.filename + RESIZE.EXT) )
      await fs.remove( path.join(UPLOAD_PATH, req.file.filename + RESIZE.THUMB_EXT) )

      res.json({msg:RCODE.OPERATION_SUCCEED, data:req.file})
    })
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})

images.get('/:filename', async (req, res)=>{
  try{
    if(APP.IMAGE_PROXY){
      res.type('jpeg')
      let filePath = '/' + MINIO.DIR_IMAGES +'/'+ req.params.filename
      let file = await minioClient.fGetObject(MINIO.BUCKET, req.params.filename, filePath)
      log('file=', file)
      // file.createReadStream().pipe(res)
    }
    else {
      let url = ''
      if(MINIO.USE_SSL)
        url = `https://${MINIO.ENDPOINT}/${MINIO.BUCKET}/${MINIO.DIR_IMAGES}/${req.params.filename}`
      else
        url = `http://${MINIO.ENDPOINT}:${MINIO.PORT}/${MINIO.BUCKET}/${MINIO.DIR_IMAGES}/${req.params.filename}`
      return res.redirect(url)
    }
  }
  catch(err){
    log('err=', err)
    return res.status(500).json({msg:RCODE.SERVER_ERROR, data:{}})
  }
})


module.exports = images
