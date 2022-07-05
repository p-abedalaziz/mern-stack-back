const express = require('express')
const { auth } = require('firebase-admin')
const router = express.Router()


const controller = require('../controller/product')
 const authCheck = require('../midlleware/auth')

// in post method its easy to send data with the req.body 
router.post('/product', authCheck.authCheck, authCheck.adminCheck, controller.create)
router.get('/products/total', controller.productsCount) 
//colors
router.post('/colors', authCheck.authCheck, authCheck.adminCheck, controller.colorsCreate)
router.delete('/colors/:slug', authCheck.authCheck, authCheck.adminCheck, controller.removeColors)
router.get('/colors', controller.listColors)
router.get('/colors/total', controller.colorsCount)

//brand
router.post('/brand', authCheck.authCheck, authCheck.adminCheck, controller.brandCreate)
router.delete('/brand/:slug', authCheck.authCheck, authCheck.adminCheck, controller.removebrand)
router.get('/brand', controller.listbrand)



router.get('/products/:count', controller.listAll)
router.get('/product/:slug', controller.read)
router.delete('/product/:slug',authCheck.authCheck,authCheck.adminCheck,controller.remove)
router.put('/product/:slug', authCheck.authCheck, authCheck.adminCheck, controller.update)
router.post('/products',controller.list)
router.post('/products/list', controller.listwithpagintaion)
//rating
router.put('/product/star/:productId',authCheck.authCheck,controller.productStar)
router.get("/product/related/:productId", controller.listRelated);
//search >> with post req you can send additional parameters اي عدد من المعطيات سوف يستجيب
router.post('/search/filters', controller.searchFilters)
router.get('/brands/total', controller.brandsCount)
module.exports = router 