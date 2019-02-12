const express = require('express')
const bodyParser = require('body-parser')
const AuthController = require('./auth/AuthController.js')
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/auth', AuthController)

app.listen(3000,()=>{
  console.log('server run on port 3000')
})