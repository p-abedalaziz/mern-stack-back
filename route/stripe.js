const express = require('express')
const router = express.Router()
const controller = require('../controller/stripe')
const authCheck = require('../midlleware/auth')

router.post ('/create-payment-intent',authCheck.authCheck,controller.createPaymentIntent)

module.exports=router