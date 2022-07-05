const mongoose=require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
        text:true, //search for title by text 
    },
    slug: {
        type: String,
        unique:true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
        text: true, //search for title by text 
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32,
    },
    category:{
        type:ObjectId, ///to save the id only
        ref:"Category"
    },
    subcategory: [
        {
        type: ObjectId,
        ref: "SubCategory"
    }
                ],
    quantity:Number,
    sold:{
        type:Number,
        default:0
    },
    images:{
        type:Array,
    },
    shipping:{
        type:String,
        enum:["Yes","No"]
    },
    colors:{
        type:Array,
        // enum: ["Red", "Blue", "Green", "Orange", "White", "Black", "Yellow", "Purple", "Silver", "Brown"
        // , "Gray", "Pink", "Olive", "Maroon", "Violet", "Charcoal", "Magenta", "Bronze", "Cream", "Gold"
        // , "Tan", "Teal", "Mustard", "Navy Blue", "Coral", "Burgundy", "Lavender", "Mauve", "Peach", "Rust",
        //     "Indigo", "Ruby", "Clay", "Cyan", "Azure", "Beige", "Off White	", "Turquoise", "Amber","Mint"]
    },
    brand:{
        type:String,
    },
    ratings:[
        {
            star:Number,
            postedBy:{type:ObjectId,ref:"User"}
        }
    ]  
},
{timestamps:true})

module.exports = mongoose.model("Product", productSchema)