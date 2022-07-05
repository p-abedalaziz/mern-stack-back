const mongoose=require('mongoose')

const TraderSchema=mongoose.Schema({
    name:{
        type:String,
        default:'Trader'
    }, 
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    about: {
        type: String,
        maxlength:[150,"Too long"],
        default: 'About Trader'
    },
    phone: {
        type: Number,
        minlength: [10, "Too short"],
        trim: true,
        default: 962
    },
    facebook:{
        type: String,
    },
    instagram: {
        type: String,
    },
    twitter: {
        type: String,
    }
})
module.exports=mongoose.model('Trader',TraderSchema)