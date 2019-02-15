const secretkey = 'akjshfiuagiusdoiajfoia'
const jwt = require('jsonwebtoken')

function verifytoken(req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, secretkey, (err, decoded) => {
      if (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError'){
          res.status(401).json({
            success: false,
            message:'Token Expired',
            err
          })
        }
        res.status(403).json({
          success: false,
          message: 'Wrong Token',
          err
        })
      }
      else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'no token'
    })
  }
}

module.exports = verifytoken