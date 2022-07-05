const express = require('express')
const { auth } = require('firebase-admin')
const router = express.Router()
const controller = require('../controller/trader')
const authCheck = require('../midlleware/auth')
router.post('/trader',authCheck.authCheck,authCheck.adminCheck,controller.createTraderInfo)
router.put('/trader/:slug', authCheck.authCheck, authCheck.adminCheck,controller.updateTraderInfo)
router.delete('/trader', authCheck.authCheck, authCheck.adminCheck,controller.deleteTraderInfo)
router.get('/trader', authCheck.authCheck, authCheck.adminCheck,controller.list)

module.exports = router