const mongoose=require('mongoose')
const Schema=mongoose.Schema
const {ObjectId}=mongoose.Schema
const moment = require('moment');
// ar minuteFromNow = function(){
var jordanTime = function () {



    let time = moment().add(3, 'hour')
    time.format('dddd/MMMM/YYYY h:mm:ss A')
    return time
};

const orederSchema=new mongoose.Schema({
    products: [
        {
            product: {
                type: Object,
                ref: 'Product'
            },
            count: Number,
            colors: Array,

        },
       
    ],
    paymentIntent: {},
    orderStatus:{
        type:String,
        default:'Not Processed',
        enum:[
            "Not Processed",
            "Cash On Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Completed"
        ]
    },
    orderdBy:{
        type:ObjectId,ref:"User"
    },
    notes: {
       
        type: String,
        default: "no notes"
    }, address: [
        
        {
           
            latitude: Number,
            longitude: Number
        }
    ],
    phone:Number,
    created_at: { type: Date, default: jordanTime },
    updated_at: { type: Date, default: jordanTime },
})
module.exports = mongoose.model("Order", orederSchema)