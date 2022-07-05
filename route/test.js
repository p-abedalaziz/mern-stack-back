const express = require('express')
const router = express.Router()
const test=require('../controller/test')

router.post('/test', test.testCreate)

module.exports = router