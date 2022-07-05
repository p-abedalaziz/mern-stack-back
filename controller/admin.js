const User = require('../modules/user')
const Product = require('../modules/product')
const Cart = require('../modules/cart')
const Coupon = require('../modules/coupon')
const Order = require('../modules/order')

exports.orders = async (req, res) => {
    let allOrders = await Order.find({})
        .sort("-created_at").populate("products.product").populate('orderdBy')
    res.json(allOrders)
}
exports.ordersStatus = async (req, res) => {
const {orderId,orderStatus}=req.body
let updated=await Order.findByIdAndUpdate(orderId,{orderStatus},{new:true}).exec()
res.json(updated)
}