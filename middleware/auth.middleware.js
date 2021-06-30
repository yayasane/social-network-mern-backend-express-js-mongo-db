const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')

module.exports.checkUser = (req, resp, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        resp.locals.user = null
        resp.cookie('jwt', '', { maxAge: 1 })
        next()
      } else {
        console.log('decoded token: ' + decodedToken.id)
        let user = await UserModel.findById(decodedToken.id)
        resp.locals.user = user
        console.log(user)
        next()
      }
    })
  } else {
    resp.locals.user = null
    next()
  }
}

module.exports.requireAuth = (req, resp, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err)
      } else {
        console.log(decodedToken.id)
        next()
      }
    })
  } else {
    console.log('No token')
  }
}
