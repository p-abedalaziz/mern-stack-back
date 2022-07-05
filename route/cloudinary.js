const express = require('express')
const router = express.Router()
const authCheck = require('../midlleware/auth')
const controller = require('../controller/cloudinary')

router.post('/uploadimages', authCheck.authCheck, authCheck.adminCheck, controller.upload)
router.post('/uploaduserimage', authCheck.authCheck, controller.upload)
router.post('/deleteduserimage', authCheck.authCheck, controller.remove)
router.post('/removeimage', authCheck.authCheck, authCheck.adminCheck, controller.remove)
module.exports = router