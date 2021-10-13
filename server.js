const express = require('express')
const cookieParser = require('cookie-parser')
// import express from 'express'
require('dotenv').config({ path: './config/.env' })
// import dotenv from 'dotenv'
// dotenv.config({ path: './config/.env' })
require('./config/db')
// import './config/db.js'
const userRoutes = require('./routes/user.routes')
// import userRoutes from './routes/user.routes.js'
const { checkUser, requireAuth } = require('./middleware/auth.middleware')
const postRoutes = require('./routes/post.routes')
const cors = require('cors')

const app = express()
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ['sessionId', 'Content-Type'],
  exposedHeaders: ['sessionId'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
}
app.use(cors(corsOptions))

//middleware
app.use(express.json())
app.use(cookieParser())

//jwt
app.get('*', checkUser)
app.use('/jwtid', requireAuth, (req, resp) => {
  resp.status(200).send(resp.locals.user._id)
})

//routes
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)

//server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
