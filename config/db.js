// import mongoose from 'mongoose'
const mongoose = require('mongoose')

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@cluster0.xb2mo.mongodb.net/mern-project`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) =>
    console.log(
      'Failed to connect to MongoDB: ' + err,
      process.env.DB_USER_PASS,
    ),
  )
