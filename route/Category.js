const express = require('express')
const router = express.Router()
const controller = require('../controller/Category')
const authCheck = require('../midlleware/auth')
router.post('/category',authCheck.authCheck,authCheck.adminCheck,controller.create)
router.get('/categories', controller.list) 
router.get('/category/:slug',  controller.read)
router.get('/categoryproducts/:slug', controller.readcategory)
router.put('/category/:slug', authCheck.authCheck, authCheck.adminCheck, controller.update)
router.delete('/category/:slug', authCheck.authCheck, authCheck.adminCheck, controller.remove)
router.get('/category/subcategory/:_id', controller.getsubcategories)
// category count 
router.get('/categorycount/total', controller.categoryCount)
module.exports = router