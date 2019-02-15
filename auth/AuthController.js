const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()
const secret = 'cjgaihgymjaujgsllna'

router.use(bodyParser.urlencoded({extended:false}))
router.use(bodyParser.json())

router.post('/login', (req, res) => {
  const { name, password } = req.body
  if(name === 'cai.yusen' && password === '123321'){
    let token = jwt.sign(
      {
        admin: true,
        exp: Math.floor(Date.now()/1000) + 30 //三十秒后过期
      }, secret)
    res.status(200).send({
      auth: true,
      token
    })
  }
})

router.post('/me', (req, res) => {
  let token = req.body.token
  if(!token) {
    return res.status(401).send({
      auth: false,
      message: '未登录'
    })
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: '服务器boom了'
      })
    }
    res.status(200).send(decoded)
  })
})

module.exports = router