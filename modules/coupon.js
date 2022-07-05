const mongoose=require('mongoose')
const { ObjectId }=mongoose.Schema
const moment = require('moment');
// ar minuteFromNow = function(){
var jordanTime = function () {



    let time = moment().add(3, 'hour')
    time.format('dddd/MMMM/YYYY h:mm:ss A')
    return time
};
const couponSchema=new mongoose.Schema({

  name:{
      type:String,
      trim:true,
      unique:true,
      uppercase:true,
      required:"Name is required",
      minlength:[4,"Too short"],
      maxlength:[12,"Too long"],
  },
  expiry:{
      type:Date,
      required:true,

  },
  discount:{
      type:Number,
      required:true
  }
,
    created_at: { type: Date, default: jordanTime },
    updated_at: { type: Date, default: jordanTime }, 

})
module.exports=mongoose.model("Coupon",couponSchema)