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

const app = express()
//middleware
app.use(express.json())
app.use(cookieParser())

//jwt
app.get('*', checkUser)
app.use('/jwtid', requireAuth, (req, resp) => {
  resp.status(500).send(resp.locals.user)
})

//routes
app.use('/api/user', userRoutes)

//server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
