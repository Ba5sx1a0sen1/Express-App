const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const verifytoken = require('./verifytoken') //校验是否有token
const cors= require('cors')
const multer = require('multer')
const morgan = require('morgan')
const users = [
  { name: 'cai.yusen', password: 'xiaosa'},
  { name: 'xxxx', password: 'xxxx'},
  { name: 'yyyy', password: 'yyyy'}
]
const secretkey = 'akjshfiuagiusdoiajfoia'
const app = express()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage})
const uploadSingle = upload.single('anyfile')

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.post('/login', (req,res) => {
  let message,token
  for(let usera in users) {
    let user = users[usera]
    if (user.name != req.body.name) {
      message = 'Wrong name'
    } else {
      if (user.password != req.body.password) {
        message = 'Wrong Password'
        break
      } else {
        token = jwt.sign({
          user,
          exp: Math.floor(Date.now() / 1000) + 86400//有效期30秒
        }, secretkey)
        message = 'Login Success'
        break
      }
    }
  }
  if (token) {
    res.status(200).send({
      message,token,success: true
    })
  }else {
    res.status(403).send({message, success: false})
  }
})

app.get('/getusers', verifytoken, (req, res) => {
  let user_list = []
  users.forEach((user) => {
    user_list.push({"name": user.name})
  })
  res.status(200).send({users:user_list})
})

app.post('/upload', verifytoken, uploadSingle, (req, res, next) => {
  res.status(200).send({message: '上传成功', success: true})
})

app.post('/verifytoken', verifytoken, (req, res) => {
  res.status(200).send({
    success: true,
    msg: '校验token有效'
  })
})

app.get('/dashboard', verifytoken, (req, res) => {
  res.status(200).send({
    success: true,
    msg: '获取仪表板数据'
  })
})

app.get('/testroute', verifytoken, (req, res) => {
  res.status(200).send({
    success: true,
    message: '具备访问权限'
  })
})

app.listen(3000, () => {
  console.log('app listen on port 3000')
})