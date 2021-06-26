// import UserModel from '../models/user.model.js'

const { UserModel } = require('../models/user.model')

// export const signUp = async (req, resp) => {
module.exports.signUp = async (req, resp) => {
  const { pseudo, email, password } = req.body

  try {
    const user = await UserModel.create({ pseudo, email, password })
    resp.status(201).json({ user: user._id })
  } catch (error) {
    resp.status(200).send({ error })
  }
}

// module.exports = signUp
