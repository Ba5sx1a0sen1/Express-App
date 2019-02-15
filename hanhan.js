const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const verifytoken = require('./verifytoken')
const users = [
  { name: 'xxxx', password: 'xxxx'},
  { name: 'yyyy', password: 'yyyy'}
]
const secretkey = 'akjshfiuagiusdoiajfoia'
const app = express()
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
          exp: Math.floor(Date.now() / 1000) + 30//有效期30秒
        }, secretkey)
        message = 'Login Success'
        break
      }
    }
  }
  if (token) {
    res.status(200).send({
      message,token
    })
  }else {
    res.status(403).send({message})
  }
})

app.post('/getusers', verifytoken, (req, res) => {
  let user_list = []
  users.forEach((user) => {
    user_list.push({"name": user.name})
  })
  res.status(200).send({users:user_list})
})

app.listen(3000, () => {
  console.log('app listen on port 3000')
})