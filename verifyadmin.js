function verifyadmin(req, res, next) {
  console.log(req.decoded)
  // if (!req.decoded.admin) {
  //   res.status(403).send({
  //     success: false,
  //     message: '您不具备权限'
  //   })
  // }
  next()
}

module.exports = verifyadmin