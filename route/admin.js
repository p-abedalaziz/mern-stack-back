const express = require('express')
const router = express.Router()
const controller = require('../controller/admin')
const authCheck = require('../midlleware/auth')
router.get('/admin/orders', authCheck.authCheck, authCheck.adminCheck,controller.orders)
router.put('/admin/orders-status', authCheck.authCheck, authCheck.adminCheck, controller.ordersStatus)




module.exports = router 