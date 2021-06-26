const express = require('express')
// import express from 'express'
require('dotenv').config({ path: './config/.env' })
// import dotenv from 'dotenv'
// dotenv.config({ path: './config/.env' })
require('./config/db')
// import './config/db.js'
const userRoutes = require('./routes/user.routes')
// import userRoutes from './routes/user.routes.js'

const app = express()
//middleware
app.use(express.json())
//routes
app.use('/api/user', userRoutes)

//server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
