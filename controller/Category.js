const Category=require("../modules/Category")
const Product =require('../modules/product')
const SubCategory = require("../modules/SubCategory") 
const slugify=require('slugify')
const { find } = require("../modules/Category")
///for creating category >>
exports.create=async( req,res)=>{
try{
    const{name}=req.body
   
    // res.json(await new Catogery({ name, slug: slugify(name) }).save())
    res.json(await new Category({ name, slug: slugify(name) }).save())
}
catch(err){
    console.log(err)
res.status(400).send("Creating faild")
}
}
exports.list = async(req, res) => {
// this way to find all category and sort it by latest created 
    
    res.json(await Category.find({}).sort({ createdAt: -1 }).exec())

}
exports.read = async (req, res) => {
    //to find single category

    res.json(await Category.findOne({ slug: req.params.slug }).exec())
}
exports.readcategory = async (req, res) => {
    //to find single category
    let category = await Category.findOne({ slug: req.params.slug }).exec()
    let products=await Product.find({category})
    .populate("category")
    .exec()
    res.json({
        category,products
    })
}


exports.update = async(req, res) => {
const {name}=req.body
try{
    //new true is for show the response of the updated cartegory onely
    const updated = await Category.findOneAndUpdate({slug:req.params.slug},{name,slug:slugify(name)},{new:true})
    res.json(updated)
}catch(err){
    res.status(400).send("update faild")
}
}

exports.remove = async(req, res) => {
try{
    const deleted = await Category.findOneAndDelete({slug:req.params.slug})
    res.json(deleted)
  
}catch(err){
    res.status(400).send(" delete faild")
}
}
exports.getsubcategories =  (req, res) => {
   
    SubCategory.find({ parent: req.params._id }).exec((err, SubCategory)=>{
                if(err) console.log(err)
        res.json(SubCategory)
        })
 
}
exports.categoryCount = async (req, res) => {

    let total = await Category.find({}).estimatedDocumentCount().exec()
    res.json(total)

}