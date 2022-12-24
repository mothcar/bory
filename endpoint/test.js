'use strict'

const faker   = require('faker')
const express = require('express')
const xlsx    = require('xlsx')
const test    = express.Router({})
const dateFormat = require('dateformat');

//--------------------------------------------------
// crawling  functions
//--------------------------------------------------
test.get('/getYoutube', async (req, res)=>{
  try{
    var client = require('cheerio-httpcli');
    // Googleで「node.js」について検索する。
    var word = '생활코딩';

    client.fetch('http://www.google.com/search', { q: word }, function (err, $, result, body) {
      // レスポンスヘッダを参照
      // console.log(result.headers);
      // HTMLタイトルを表示
      console.log($('title').text());
      // リンク一覧を表示
      // var arr = []
      // $('a').each(function (idx) {
      //   arr.push($(this).attr('href'))
      // });
      // let alist = $('div.rc').find('.r').
      let alist = $('.LC20lb')
      res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:$(alist).text()}})
    });


  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})



//--------------------------------------------------
// test functions
//--------------------------------------------------
test.post('/', async (req, res)=>{
  try{
    log('test req.body= :', req.body)
    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:'Good Server~~~@@'}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

test.get('/', async (req, res)=>{
  try{
    log('test req.body=', req.body)
    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:'Good Server~~~'}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})








test.get('/newestUser', async (req, res)=>{
  try{
    let user = await Users.find().sort({$natural:-1}).limit(1)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user[0]}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})











test.get('/oldestUser', async (req, res)=>{
  try{
    let user = await Users.find().limit(1)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:user[0]}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

test.get('/randomUser', async (req, res)=>{
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

test.get('/newestPurchase', async (req, res)=>{
  try{
    let purchase = await Purchases.find().sort({$natural:-1}).limit(1)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:purchase[0]}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})

test.get('/oldestPurchase', async (req, res)=>{
  try{
    let purchase = await Purchases.find().limit(1)

    res.json({msg:RCODE.OPERATION_SUCCEED, data:{item:purchase[0]}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


test.get('/excelTest', async (req, res)=>{
  try{
      var request = require('request');
      var url = 'http://221.140.81.171/tmp/exceltest.xlsx'
      request(url, {encoding: null}, function(err, res, data) {
      	if(err || res.statusCode !== 200) return;

      	/* data is a node Buffer that can be passed to XLSX.read */
      	var workbook = xlsx.read(data, {type:'buffer' });

        //var workbook = XLSX.readFile('Master.xlsx');
        var sheet_name_list = workbook.SheetNames;
        var tmp = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])

        log('tmp = ', tmp)
        //log('excelSheet =', workbook.Sheets["Sheet1"]['A1'].v)
      	/* DO SOMETHING WITH workbook HERE */




      });
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


// TODO: ACL (ADMIN, OPERATOR, USER)
// timestamp.get('/helper/confirmedVoices', tms.verifyToken)
test.get('/timestamp', async (req, res)=>{
  try{
    let qry = {}
    let voices = []
    let total = 0
    qry = {}


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

    let newDateTime=new Date(voices[0].updatedAt)
    log('dateFormat(newDateTime, "dddd, mmmm dS, yyyy, h:MM:ss TT")=', dateFormat(newDateTime, "dddd, mmmm dS, yyyy, h:MM:ss TT"))
    voices[0].updatedAt = dateFormat(newDateTime, "dddd, mmmm dS, yyyy, h:MM:ss TT")

    //voices[0].updatedAt = new Date(voices[0].updatedAt) - new Date(voices[0].updatedAt)
    return res.json({msg:RCODE.OPERATION_SUCCEED, data:{pageInfo:pageInfo, items:voices}})
  }
  catch(err){
    log('err=',err)
    res.status(500).json({msg: RCODE.SERVER_ERROR, data:{}})
  }
})


module.exports = test
