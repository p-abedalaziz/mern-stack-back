const Coupon=require('../modules/coupon')

exports.create=async(req,res)=>{
try{
const {name,expiry,discount}=req.body.coupon
const newCoupon=await new Coupon({
    name, expiry, discount
}).save()
    res.json(newCoupon)
}catch(err){
console.log(err)
}
}
exports.remove = async (req, res) => {
    try {   
        const removeCoupon=await Coupon.findOneAndDelete(req.params.couponId).exec()
       
        res.json(removeCoupon)
    } catch (err) {
        console.log(err)
    }

}
exports.list = async (req, res) => {
    try {
       const listCoupons=await Coupon.find({}).sort({createdAt:-1}).exec()
        res.json(listCoupons)
    } catch (err) {
        console.log(err)
    } 
}
exports.couponsCount = async (req, res) => {

    let total = await Coupon.find({}).estimatedDocumentCount().exec()
    res.json(total)

}