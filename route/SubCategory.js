const express = require('express')
const router = express.Router()
const controller = require('../controller/SubCategory')
const authCheck = require('../midlleware/auth')
router.post('/SubCategory', authCheck.authCheck, authCheck.adminCheck, controller.create)
router.get('/Subcategory', controller.list) 
router.get('/SubCategory/:slug', controller.read)
router.get('/subcategoryproducts/:slug', controller.readsubcategory) 
router.put('/SubCategory/:slug', authCheck.authCheck, authCheck.adminCheck, controller.update)
router.delete('/SubCategory/:slug', authCheck.authCheck, authCheck.adminCheck, controller.remove)
// sub count 
router.get('/sub/total', controller.SubCount)
module.exports = router 