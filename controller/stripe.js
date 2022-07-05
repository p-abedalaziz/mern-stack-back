const User = require('../modules/user')
const Cart = require('../modules/cart')
const Product = require('../modules/product')
const Coupon = require('../modules/coupon')
const { findOne } = require('../modules/user')
const stripe=require('stripe')(process.env.STRIPE_SECRET)
exports.createPaymentIntent = async (req, res) => {
   //later apply coupon and calculate the price
  // later apply coupon 
       //later calc price
       //1 find  user  and get user cart  total 
       //2 create payment intent with  order amount  and currency
// console.log(req.body)
    const user = await User.findOne({ email: req.user.email }).exec()
    const {cartTotal,totalAfterDiscount}= await Cart.findOne({orderdBy:user._id}).exec()
    const {couponApplied}=req.body
    let finalAmount=0
    if (couponApplied &&totalAfterDiscount){
        finalAmount=totalAfterDiscount*100
    }else{
        finalAmount=cartTotal*100
    }
    console.log("Cart total charged",cartTotal,"--->",totalAfterDiscount)
   const paymentIntent= await stripe.paymentIntents.create({
     
       amount:finalAmount,
       currency:"usd"
   })

   res.send({
       clientSecret: paymentIntent.client_secret,cartTotal,totalAfterDiscount
       ,payable:finalAmount
   })
}