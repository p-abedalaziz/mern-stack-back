const mongoose=require('mongoose')
const testSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:Number
    }
})
module.exports = mongoose.model("test", testSchema)