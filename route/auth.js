const express = require('express')
const router = express.Router()
const md=require('../controller/auth')
const ac=require('../midlleware/auth')

router.post('/CRUDUSER',ac.authCheck,md.CRUDUSER)
router.post('/CURRENTUSER', ac.authCheck, md.CURRENTUSER)
router.post('/CURRENTAdmin', ac.authCheck,ac.adminCheck, md.CURRENTUSER)


module.exports=router