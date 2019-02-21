const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const verifytoken = require('../verifytoken.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const BlogModel = require('../Model/BlogModel')


mongoose.connect('mongodb://127.0.0.1/Express-app')
const db = mongoose.connection
db.on('error', ()=>{console.log('数据库链接失败')})
db.once('open', ()=>{console.log('数据库链接成功')})

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.get('/', verifytoken, (req, res, next) => {
  
})

router.get('/blog', verifytoken, (req, res, next) => {
  let { page, size } = req.body
  page = parseInt(page) || 0
  size = parseInt(size) || 0
  skipNum = (page===0? 0 : page - 1) * size
  BlogModel.find({hidden: false},{title:1,content:1,_id:0},{limit: size, skip: skipNum},(err, docs) => {
    res.status(200).send({
      success: true,
      list: docs
    })
  })
  // BlogModel.find({},{title:1,content:1,hidden:1,_id:0},(err, docs) => {
  //   res.status(200).send({
  //     success:  true,
  //     list: docs
  //   })
  // })
})

router.post('/blog', verifytoken, (req, res, next) => {
  const { title, content } = req.body
  const blogEntity = new BlogModel({title, content})
  blogEntity.save((err, doc) => {
    if(err) {
      res.status(500).send({
        err
      })
    } else {
      res.status(200).send({
        doc,
        success: true,
        message: '添加博文成功'
      })
    }
  })
}) 

module.exports = router