const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = new express()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
    //默认同名覆盖
  }
})
const upload = multer({storage: storage})

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/upfile',upload.single('anyfile'), (req, res, next) => {
  const { file } = req
  console.log(file)
  res.end()
})

app.post('/login', (req, res) => {
  //接收json数据  
  console.log(req.body)
  const {account, password} = req.body
  if(account === 'admin' && password === 'adm67xsm'){
    res.json({success: true, msg: '登录成功'})
  }
  res.status(404).json({success: false, msg: '登录失败'})
})

app.listen(3000)