// import mongoose from 'mongoose'
const mongoose = require('mongoose')
// import isEmail from 'validator'
const { isEmail } = require('validator')
// import bcrypt from 'bcrypt'
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minLength: 6,
    },
    picture: {
      type: String,
      default: './uploads/profil/random-user.png',
    },
    bio: {
      type: String,
      max: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
)

//play function before save into display: 'block'

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const UserModel = mongoose.model('user', userSchema)

module.exports = { UserModel }
// export default UserModel
