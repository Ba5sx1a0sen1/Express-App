const secretkey = 'akjshfiuagiusdoiajfoia'

function verifytoken(req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, secretkey, (err, decoded) => {
      if (err) {
        res.status(403).json({
          message: 'Wrong Token'
        })
      }
      else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(403).json({
      message: 'no token'
    })
  }
}

module.exports = verifytoken