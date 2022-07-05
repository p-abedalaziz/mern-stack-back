const Product = require("../modules/product")
const User=require('../modules/user')
const slugify = require('slugify')
const Colors=require('../modules/colors')
const Brand = require("../modules/brand")

exports.create = async (req, res) => {
    try { 
        req.body.slug=slugify(req.body.title) 
        const newProduct= await new Product(req.body).save()
        res.json(newProduct)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({err:err.message})
    }
}
/////////////////////colors
exports.colorsCreate=async(req,res)=>{
  
    try {
        const { name } = req.body

        // res.json(await new Catogery({ name, slug: slugify(name) }).save())
        res.json(await new Colors({ name, slug: slugify(name) }).save())
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Creating faild (Exist)")
    }
}
exports.removeColors = async (req, res) => {
    try {
        const deleted = await Colors.findOneAndDelete({ slug: req.params.slug })
        res.json(deleted)

    } catch (err) {
        res.status(400).send(" delete faild")
    }
}

exports.listColors = async (req, res) => {
    // this way to find all category and sort it by latest created 

    res.json(await Colors.find({}).sort({ createdAt: -1 }).exec())

}
/////////////////////brands
exports.brandCreate = async (req, res) => {

    try {
        const { name } = req.body

        // res.json(await new Catogery({ name, slug: slugify(name) }).save())
        res.json(await new Brand({ name, slug: slugify(name) }).save())
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Creating faild (Exist)")
    }
}
exports.removebrand = async (req, res) => {
    try {
        const deleted = await Brand.findOneAndDelete({ slug: req.params.slug })
        res.json(deleted)

    } catch (err) {
        res.status(400).send(" delete faild")
    }
}

exports.listbrand = async (req, res) => {
    // this way to find all category and sort it by latest created 

    res.json(await Brand.find({}).sort({ createdAt: -1 }).exec())

}
// exports.read = async (req, res) => {
//     // this way to find all category and sort it by latest created 

//     res.json(await Product.find({}).sort({ createdAt: -1 }).exec())

// }

//// this way we can view the limtied products as we want in req for example we want to show 10 products we asked /10
exports.listAll = async (req, res) => {
    // this way to find all category and sort it by latest created 
    let products = await Product.find({})
        .limit(parseInt(req.params.count)) //parse change the req to integer
        .populate('category') //need to have an refrence in module
        .populate('subcategory') //for subcategory
        .sort([["createdAt","desc"]])
        .exec()
    res.json(products)

} 




exports.remove=async(req,res)=>{
    try{
        const deletedProduct=await Product.findOneAndDelete({slug:req.params.slug}).exec()
        res.json(deletedProduct)
    }catch(err){
        console.log(err)
        res.status(400).send('product delete faild')
    }
}

exports.read=async(req,res)=>{
    const product=await Product.findOne({slug:req.params.slug})
    .populate('category')
    .populate('subcategory')
    .exec()
    res.json(product)
}
exports.update=async(req,res)=>{

    try{

       if(req.body.title){
           req.body.slug=slugify(req.body.title)
       }
        // let productupdated = await Product.findOneAndUpdate({ update based on }, what you want to update,{new:true used for send the new updated data})
        let productupdated = await Product.findOneAndUpdate({ slug: req.params.slug },req.body,{new:true}).exec()
        res.json(productupdated)
    }catch(err){
        console.log(err)
    //   return  res.status(400).send("update faild")
    res.status(400).json({
        err:err.message
    })
    }

    
}

exports.list=async(req,res)=>{
        try{

            //sort pased on created at---order pased on desc or asc---limit number of products
            const {sort,order,limit}=req.body
            const products=await Product.find({})
            .populate('category')
            .populate('subcategory')
            .sort([[sort,order]]) //if we have more than one item we use double array
            .limit(limit)
            .exec()
            res.json(products)
        }catch(err){    
            console.log(err)
        }
}
//estimatedDocumentCount used to find totla of th elements on the database 
exports.productsCount=async(req,res)=>{
    
        let total=await Product.find({}).estimatedDocumentCount().exec()
        res.json(total)
   
}

// with pagenation
exports.listwithpagintaion = async (req, res) => {
    try {
     
        //sort pased on created at---order pased on desc or asc---limit number of products
        const { sort, order, page } = req.body
        const currentpage = page || 1
        perPage = 12
        const products = await Product.find({})
            .skip((currentpage -1)*perPage)
            .populate('category')
            .populate('subcategory')
            .sort([[sort, order]]) //if we have more than one item we use double array
            .limit(perPage)
            .exec()
        res.json(products)
    } catch (err) {
        console.log(err)
    }
}
exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id } },
            },
            { new: true }
        ).exec();
        console.log("ratingAdded", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec();
        console.log("ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
};
exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(4)
        .populate("category")
        .populate("subcategory")
        .exec();

    res.json(related);
};

const handleQuery=async(req,res,query)=>{
const products=await Product.find({$text:{$search:query}})
.populate("category",'_id name') //to get the id and the name onely from category
.populate("subcategory",'id name')
.exec()
res.json(products)
}

 const handlePrice=async(req,res,price)=>{
     try{
        let products=await Product.find({

            price:{
                $gte:price[0],///get mean grater than >
                $lte:price[1]
            }
        }).populate("category", '_id name') //to get the id and the name onely from category
             .populate("subcategory", 'id name')
             .exec()
         res.json(products)
     }catch(err){
        console.log(err)
     }
 }

const handleCategory=async(req,res,category)=>{
    try{
        const products=await Product.find({category})
        .populate("category", '_id name') //to get the id and the name onely from category
            .populate("subcategory", 'id name')
            .exec()
        res.json(products)

    }catch(err){
        console.log(err)

    }
}

const handleStars=(req,res,stars)=>{
    Product.aggregate([{
        $project:{
            document:"$$ROOT",
            floorAverage:{
                $floor:{$avg:"$ratings.star"}
            }
        }
    },
    {$match:{floorAverage:stars}}
])
.limit(12)
.exec((err,aggregate)=>{
    if (err)  console.log("aggregate err",err)
    Product.find({_id:aggregate})
        .populate("category", '_id name') //to get the id and the name onely from category
        .populate("subcategory", 'id name')
        .exec((err,products)=>{
            if(err)console.log("product aggregate err",err)
            res.json(products)
        })
})
}
const handleSub=async(req,res,subcategory)=>{
    const products=await Product.find({subcategory})
        .populate("category", '_id name') //to get the id and the name onely from category
        .populate("subcategory", 'id name')
        .exec( ) 
        res.json(products)
         
}
const handleSipping=async(req,res,shipping)=>{
    const products= await Product.find({shipping})
        .populate("category", '_id name') //to get the id and the name onely from category
        .populate("subcategory", 'id name')
        .exec()
    res.json(products)
}

const handleColor = async(req, res, color)=> {
    const products= await Product.find({ colors:color })
        .populate("category", '_id name') //to get the id and the name onely from category
        .populate("subcategory", 'id name')
        .exec()
    res.json(products)
}
const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
        .populate("category", '_id name') //to get the id and the name onely from category
        .populate("subcategory", 'id name')
        .exec()
    res.json(products)
}
exports.searchFilters=async(req,res)=>{
    const { query, price, category, stars, subcategory, shipping
,brand,color}=req.body

    if(query){
        console.log(query)

        await handleQuery(req,res,query)
    }
    //price[0,200] should be between to vaues
    if(price!==undefined){
        console.log(price)
        await handlePrice(req,res,price)
    }
    if(category){
        console.log(category)
        await handleCategory(req, res, category)
    }
    if(stars){
        console.log(stars)
        await handleStars(req,res,stars)
    }
    if (subcategory){
        console.log("subcategory-->", subcategory)
        await handleSub(req, res, subcategory)
    }
    if (shipping) {
        console.log("shipping-->", shipping)
        await handleSipping(req, res, shipping)
    }
     if (color) {
         console.log("color-->", color)
         await handleColor(req, res, color)
    }
    if (brand) {
        console.log("brand-->", brand)
        await handleBrand(req, res, brand)
    }
    
}
exports.brandsCount = async (req, res) => {

    let total = await Brand.find({}).estimatedDocumentCount().exec()
    res.json(total)

}
exports.colorsCount = async (req, res) => {

    let total = await Brand.find({}).estimatedDocumentCount().exec()
    res.json(total)

}