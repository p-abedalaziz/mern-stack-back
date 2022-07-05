const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema
const moment = require('moment');
// ar minuteFromNow = function(){
var jordanTime = function () {

    
    
  let time=  moment().add(3, 'hour')
    time.format('dddd/MMMM/YYYY h:mm:ss A')
    return time
};

const cartSchema=new mongoose.Schema({
    products:[ 
        {
            product:{
                type:Object,
                ref:'Product'
            },
            count:Number,
            colors:Array,
            price:Number,

        }
    ],
    cartTotal:Number,
    notes:{
        type:String,
        default:"no notes"
    },
    phone:Number,
    totalAfterDiscount:Number,
    orderdBy: { type: Object, ref: "User" }, 
    created_at: { type: Date, default: jordanTime },
    updated_at: { type: Date, default: jordanTime },
    
}, )

module.exports=mongoose.model("Cart",cartSchema)