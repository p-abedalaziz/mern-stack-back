const express = require('express')
const router = express.Router()
const controller = require('../controller/coupon')
const authCheck = require('../midlleware/auth')

router.post('/coupon', authCheck.authCheck, authCheck.adminCheck, controller.create)

router.get('/coupons', controller.list)

router.delete('/coupon/:couponId', authCheck.authCheck, authCheck.adminCheck, controller.remove)
router.get('/coupons/total', controller.couponsCount)
module.exports = router