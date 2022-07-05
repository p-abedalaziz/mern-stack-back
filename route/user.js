const express = require('express')
const router = express.Router()
const controller = require('../controller/user')
const authCheck = require('../midlleware/auth')
router.post('/user/cart', authCheck.authCheck,controller.userCart)
router.get('/user/cart',authCheck.authCheck,controller.getUserCart)
router.delete('/user/cart',authCheck.authCheck,controller.emptyCart)
router.post('/user/address', authCheck.authCheck, controller.saveAddress)
router.post('/user/cart/notes',authCheck.authCheck,controller.cartNotes)
router.post('/user/cart/phone', authCheck.authCheck, controller.cartPhone)
router.post('/user/cart/coupon', authCheck.authCheck, controller.applyCouponUserCart)
router.post('/user/order',authCheck.authCheck,controller.createOrder)
router.get('/user/orders', authCheck.authCheck, controller.orders)
//wishList
router.post('/user/wishlist', authCheck.authCheck, controller.addToWishlist)
router.get('/user/wishlist', authCheck.authCheck, controller.wishlist)
router.put('/user/wishlist/:productId', authCheck.authCheck, controller.removeFromWishlist)
//COD
router.post('/user/cod', authCheck.authCheck, controller.createCOD)
router.put('/user/profile', authCheck.authCheck, controller.updateUserImage)
router.put('/username/profile', authCheck.authCheck, controller.updateUserName)

// users count 
router.get('/user/total', controller.usersCount)
router.get('/orders/total', controller.ordersCount)
module.exports = router 