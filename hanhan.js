const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const verifytoken = require('./verifytoken') //校验是否有token
const verifyadmin = require('./verifyadmin.js') //校验是否为管理员
const cors= require('cors')
const multer = require('multer')
const morgan = require('morgan')
const TestDBController = require('./testdb/TestDBController.js')
const FilePathModel = require('./Model/FilePathModel')
const nodepath = require('path')

const users = [
  { name: 'cai.yusen', password: 'xiaosa'},
  { name: 'fushuaisb', password: 'fushuaisb'},
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

app.use('/testdb', TestDBController)

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

app.post('/upload', verifytoken, uploadSingle, async (req, res, next) => {
  //接收到文件先判断是不是已经有同名的了，没有就添加，有了直接返回
  const path = req.file.destination + req.file.filename
  const filename = req.file.originalname
  const size = req.file.size / 1024 //kb大小
  //非浏览器上传前校验大小
  if(size > 102400) {
    res.status(403).send({message:'禁止上传大于100mb的文件', success: false})
    return false
  }
  //校验文件总数
  let count = await FilePathModel.find().count()
  if(count >= 50) {
    res.status(403).send({messae:'已达到服务器存储容量', success:false})
    return false
  }

  try {
    const FilePathQuery = await FilePathModel.findOne({filename})
    //查不到即为null 查到不为null
    if (FilePathQuery == null) {
      const FilePathEntity = new FilePathModel({path, filename})
      await FilePathEntity.save()
      res.status(200).send({message: '上传成功', success: true})
    } else {
      res.status(200).send({messae:'已存在同名文件', success: true})
    }
  } catch (e) {
    res.status(500).send({messae:'服务端出错', success: false})
  }
})

app.post('/filelist', verifytoken, async (req, res, next) => {
  try {
    let { page, size } = req.body
    page = parseInt(page) || 0
    size = parseInt(size) || 0
    skipNum = (page===0? 0 : page - 1) * size
    const total = await FilePathModel.count()
    const FileListEntity = await FilePathModel.find({hidden: false},{_id:1, filename:1, path:1},{limit:size,skip:skipNum,sort: '-createdAt'})
    res.status(200).send({
      success: true,
      messae: '获取文件列表成功',
      list: FileListEntity,
      total,
      page,
      pageSize: size
    })
  } catch(e) {
    console.log(e)
    res.status(500).send({message:'服务端出错', success: false})
  }
})

app.get('/download/:id', verifytoken, async (req, res, next) => {
  try {
    const fileid = req.params.id
    if(!fileid) {
      res.status(404).send({success:false,message:'无效下载'})
    } else {
      const FilePathEntity = await FilePathModel.findOne({_id: fileid})
      const {path, filename} = FilePathEntity
      console.log(nodepath.resolve(__dirname, path))
      res.setHeader('Access-Control-Expose-Headers','Content-Disposition')
      res.status(200).download(nodepath.resolve(__dirname, path), filename)
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({message:'服务端出错', success: false})
  }
})

app.delete('/deletefile/:id', verifytoken, async (req, res, next) => {
  try {
    const fileid = req.params.id
    if (!fileid) {
      res.status(404).send({success:false,message:'无效删除'})
    } else {
      await FilePathModel.findByIdAndUpdate(fileid,{hidden: true})
      res.status(200).send({success:true,message:'删除成功'})
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({messae:'服务端出错', success: false})
  }
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


app.get('/testaxios', verifytoken, verifyadmin, (req, res) => {
  const query = req.query
  res.status(200).send({
    success: true,
    message: 'axios test pass',
    query: { ...query }
  })
})
