// import UserModel from '../models/user.model.js'
const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')
const { signUpErrors, signInErrors } = require('../utils/error.utils')

const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  })
}

// export const signUp = async (req, resp) => {
module.exports.signUp = async (req, resp) => {
  const { pseudo, email, password } = req.body

  try {
    const user = await UserModel.create({ pseudo, email, password })
    resp.status(201).json({ user: user._id })
  } catch (error) {
    const errors = signUpErrors(error)
    resp.status(200).send({ errors })
  }
}

module.exports.signIn = async (req, resp) => {
  const { email, password } = req.body

  try {
    const user = await UserModel.login(email, password)
    const token = createToken(user.id)
    console.log(user)
    resp.cookie('jwt', token, { httpOnly: true, maxAge })
    resp.status(200).json({ user: user._id })
  } catch (err) {
    const errors = signInErrors(err)
    resp.status(200).send({ errors })
  }
}

module.exports.logout = (req, resp) => {
  resp.cookie('jwt', '', { maxAge: 1 })
  //On fait une redirecton pour que ça marche avec postman
  resp.redirect('/')
}

// module.exports = signUp
