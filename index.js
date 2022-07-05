const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const { readdirSync } = require("fs");
require('dotenv').config()


const app = express()

mongoose.connect(process.env.MONGO_URI, () => console.log('connected'))

app.use(morgan("dev"))
app.use(bodyParser.json({ limit: '2mb' }))
app.use(cors())

const router = require('./route/Category')
readdirSync("./route").map((r) => app.use("/api", require("./route/" + r)));





app.listen()

