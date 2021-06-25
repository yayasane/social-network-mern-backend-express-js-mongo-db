const express = require('express')
// import express from 'express'
require('dotenv').config({ path: './config/.env' })
// import dotenv from 'dotenv'
// dotenv.config({ path: './config/.env' })
require('./config/db')
// import './config/db.js'

const app = express()

//server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
