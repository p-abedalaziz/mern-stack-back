const User = require('../modules/user')
const Product = require('../modules/product')
const Cart=require('../modules/cart')
const Coupon=require('../modules/coupon')
const Order = require('../modules/order')
const uniqueid=require('uniqueid')
const moment = require('moment');
// ar minuteFromNow = function(){
var jordanTime = function () {



    let time = moment().add(3, 'hour')
    time.format('dddd/MMMM/YYYY h:mm:ss A')
    return time
};
exports.userCart = async (req, res) => {
  const {cart}=req.body
  let products=[]
    const user=await User.findOne({email:req.user.email}).exec()

    //check if cart with the logged in user id already exist
    let cartExistByThisUser=await Cart.findOne({orderdBy:user._id}).exec()
    if (cartExistByThisUser){
        cartExistByThisUser.remove()
        console.log("removed old cart")
    }

    for (let i = 0; i < cart.length; i++) {
        let object = {}; 

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.colors = cart[i].colors;
        // get price for creating total
       productFromDb = await Product.findById(cart[i]._id).select("price").exec();
        object.price = productFromDb.price; 

        products.push(object);
    }
    // console.log("products", products)
    let cartTotal=0
    for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count
        
    }
    // console.log("cartTotal", cartTotal)

    let newCart=await new Cart({
        products,
        cartTotal, 
        orderdBy:user._id
    }).save()
         console.log("newCart--> ", newCart)
         res.json({ok:true})
}
 
exports.getUserCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOne({ orderdBy: user._id })
        .populate("products.product", "_id title price totalAfterDiscount").exec()
       

    const {  cartTotal, totalAfterDiscount } = cart; 
    let products = cart.products
    res.json({ products, cartTotal, totalAfterDiscount });
};
exports.emptyCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();
    let cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec()
    res.json(cart)
};

exports.saveAddress = async (req, res) => {
   const {address}=req.body
//    console.log("address",req.body.address.latitude)
   const [{latitude}]=address
    const [{ longitude }] = address
    // console.log("[{latitude}]", { latitude })
    // console.log("[{longitude}]", { longitude })
    // const userAddress = await User.findOneAndUpdate(
        
    //     {email:req.user.email} ,
    //     { 
    //         $push: { address: { latitude,longitude } },
    //     }
    //     ,{new:true}
 
    // ).exec()
    const userAddress = await User.findOneAndUpdate(

        { email: req.user.email },
        {
           address
        }
        , { new: true }

    ).exec()
    // console.log("req.body-->",req.body)
    // console.log("address.lat-->", address.latitude)
    // console.log("req.body.address-->",req.body.address)
    res.json({ ok: true });
};

exports.cartNotes=async(req,res)=>{
        console.log(req.body)
    const user = await User.findOne({ email: req.user.email }).exec()

    let userCart = await Cart.findOneAndUpdate({ orderdBy:user._id},{notes:req.body.notes},{new:true}).exec()
    res.json({ok:true})
}
exports.cartPhone = async (req, res) => {
    console.log(req.body)
    const user = await User.findOne({ email: req.user.email }).exec()

    let userPhone = await Cart.findOneAndUpdate({ orderdBy: user._id }, { phone: req.body.phone }, { new: true }).exec()
    res.json({ ok: true })
}

exports.applyCouponUserCart=async(req,res)=>{
    const { coupon } = req.body;
    console.log("COUPON", coupon);

    const validCoupon = await Coupon.findOne({ name: coupon }).exec();
    if (validCoupon === null) {
        return res.json({
            err: "Invalid coupon",
        });
    }
    console.log("VALID COUPON", validCoupon);

    const user = await User.findOne({ email: req.user.email }).exec();

    let { products, cartTotal } = await Cart.findOne({ orderdBy: user._id })
        .populate("products.product", "_id title price")
        .exec();

    console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

    // calculate the total after discount
    let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2); // 99.99

    console.log("----------> ", totalAfterDiscount);

    Cart.findOneAndUpdate(
        { orderdBy: user._id },
        { totalAfterDiscount },
        { new: true }
    ).exec();

    res.json(totalAfterDiscount);                                  
}

exports.createOrder=async(req,res)=>{
    // console.log(req.body)
    // return;
    const {paymentIntent}=req.body.stripeResponse
    const user=await User.findOne({email:req.user.email}).exec()
    let {address}=await User.findOne({email:req.user.email}).exec()
    let {products}=await Cart.findOne({orderdBy:user._id}).exec()
    let { notes } = await Cart.findOne({ orderdBy: user._id }).exec()
    let { phone } = await Cart.findOne({ orderdBy: user._id }).exec()
        console.log(phone)
    
    let newOrder=await new Order({
        phone,
        products,
        paymentIntent,
        notes,
        address,
        orderdBy:user._id,
       
    }).save()
    let bulkOption = products.map((item) => {
        // console.log("item ", item)
        // console.log("item.product", item.product)

        // console.log("item.product._id",item.product._id)
        return {
            updateOne: {
                filter: { _id:item.product}, // IMPORTANT item.product
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    // console.log("PRODUCT QUANTITY- AND SOLD++", updated);

    // console.log("NEW ORDER SAVED", newOrder);
res.json({ok:true})

} 

exports.orders=async(req,res)=>{
let user=await User.findOne({email:req.user.email}).exec()
    let userOrders = await Order.find({ orderdBy: user._id }).sort("-created_at")
.populate('products.product')
    .populate('notes')
    .populate('address.latitude')
    .populate('address.longitude') .populate('phone')
    .populate('orderdBy').exec()
    console.log(userOrders)
    res.json(userOrders)
}
 //$addToSet is mongoose method that send an data that arent exist in database (no doulblicate)
exports.addToWishlist=async(req,res)=>{
        const {productId}=req.body
        const user=await User.findOneAndUpdate({email:req.user.email},
            {$addToSet:{
            wishlist:productId
        }}).exec()
        res.json({ok:true})
}
exports.wishlist = async (req, res) => {
    //select to just send back onely one thing
const list =await User.find({email:req.user.email})
    .select('wishlist').populate('wishlist').exec()
res.json(list)
}
exports.removeFromWishlist = async (req, res) => {
    //Pull update one field onely
    const {productId}=req.params
    const user=await User.findOneAndUpdate(
        {email:req.user.email},{$pull:{wishlist:productId}}).exec()
        res.json({ok:true})
}
exports.createCOD = async (req, res) => { 
    // console.log(req.body)
    // return;

    // if cod is true create order with status of cash on delivery
    const { COD, couponApplied } = req.body

    if(!COD) return res.status(400).send("create cash order faild")
    const user = await User.findOne({ email: req.user.email }).exec()
    let { address } = await User.findOne({ email: req.user.email }).exec()
    let userCart= await Cart.findOne({ orderdBy: user._id }).exec()
  
    let finalAmount = 0
    if (couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100
    } else {
        finalAmount = userCart.cartTotal * 100
    }
    // console.log(phone)

    let newOrder = await new Order({
        phone:userCart.phone,
        products: userCart.products,
        paymentIntent:{
            id: uniqueid(),
            amount: finalAmount,
            currency:"JD",
            status:"Cash On Delivery",
            created: jordanTime,
            payment_method_types:['cash']
        },
        notes: userCart.notes,
        address,
        orderdBy: user._id,
        orderStatus:"Cash On Delivery"
    }).save()
    let bulkOption = userCart.products.map((item) => {
        // console.log("item ", item)
        // console.log("item.product", item.product)

        // console.log("item.product._id",item.product._id)
        return {
            updateOne: {
                filter: { _id: item.product }, // IMPORTANT item.product
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    // console.log("PRODUCT QUANTITY- AND SOLD++", updated);

    // console.log("NEW ORDER SAVED", newOrder);
    res.json({ ok: true })

} 
exports.updateUserImage=async(req,res)=>{
    const {images}=req.body
   
    let user=await User.findOneAndUpdate({email:req.user.email},{picture:images},{new:true})
   
    res.json({ok:true})
}
exports.updateUserName = async (req, res) => {
   const {name}=req.body
    let user = await User.findOneAndUpdate({ email: req.user.email }, { name }, { new: true })

    res.json({ ok: true })
} 
exports.usersCount = async (req, res) => {

    let total = await User.find({}).estimatedDocumentCount().exec()
    res.json(total)

}
exports.ordersCount = async (req, res) => {

    let total = await Order.find({}).estimatedDocumentCount().exec()
    res.json(total)

}