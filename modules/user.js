const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema=mongoose.Schema({
    picture: {
        type: Array,
    },
    name:{
       type: String
    },
    email:{
        type:String,
        required:true,
        index:true
    },
    role:{
        type:String,
        default:"subscriber"
    },
    cart:{
        type:Array,
        default:[]
    },
  
    address: [
        {
            latitude: Number,
            longitude:Number
        }
    ]  
   
    , wishlist:[{type: Object,ref:"Product"}]
},{timestamps:true})

module.exports=mongoose.model('User',UserSchema)