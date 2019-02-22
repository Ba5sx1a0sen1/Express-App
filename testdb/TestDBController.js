const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const verifytoken = require('../verifytoken.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const BlogModel = require('../Model/BlogModel')
const CommentModel = require('../Model/CommentModel')

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

router.get('/blogdetail', verifytoken, async (req, res, next) => {
  const blogId = req.body.id
  try {
    const BlogEntity = await BlogModel.findById({_id: blogId},{title:1, content:1, comments:1, _id:0})
    const CommentEntitys = await CommentModel.find({_id:{$in:BlogEntity.comments}},{content:1, _id:0})
    // console.log(CommentEntitys)
    // console.log(Array.isArray(CommentEntitys)) //true
    res.status(200).send({
      success: true,
      message: '获取博客详情成功',
      data: {
        title: BlogEntity.title,
        content: BlogEntity.content,
        comments: CommentEntitys
      }
    })
  } catch(e) {
    console.log(e)
    res.status(500).send({
      success: false,
      message: '服务端出错'
    })
  }
})

router.post('/blogcomment', verifytoken, async (req,res,next) => {
  try {
    const { id, content } = req.body
    const queryBlog = await BlogModel.findById({_id: id})
    const CommentEntity = new CommentModel({content})
    const CommentEntityQuery = await CommentEntity.save() //保存评论
    const CommentEntityId = CommentEntityQuery._id //获取新保存的评论id，用于存入blog的comment字段
    queryBlog.comments.push(CommentEntityId)
    await queryBlog.save()
    res.status(200).send({
      success: true,
      message: '发送评论成功'
    })
  } catch(e) {
    console.log(e)
    res.status(500).send({
      success: false,
      message: '服务端出错'
    })
  }
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