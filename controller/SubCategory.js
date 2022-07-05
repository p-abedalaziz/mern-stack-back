const SubCategory = require("../modules/SubCategory")
const Product = require('../modules/product')
const slugify = require('slugify')
const { find } = require("../modules/Category")
///for creating category >>
exports.create = async (req, res) => {
    try {
        const { name, parent } = req.body

        // res.json(await new Catogery({ name, slug: slugify(name) }).save())
        res.json(await new SubCategory({ name, parent, slug: slugify(name) }).save())
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Creating SubCategory faild")
    }
}
exports.list = async (req, res) => {
    // this way to find all category and sort it by latest created 

    res.json(await SubCategory.find({}).sort({ updatedAt: -1 }).exec())

}



exports.read = async (req, res) => {
    //to find single category

    res.json(await SubCategory.findOne({ slug: req.params.slug }).exec())
}
exports.readsubcategory = async (req, res) => {
    //to find single category
    let subcategory = await SubCategory.findOne({ slug: req.params.slug }).exec()
    let products = await Product.find({ subcategory })
        .populate("subcategory")
        .exec()
    res.json({
        subcategory, products
    })

}
exports.update = async (req, res) => {
    const { name, parent } = req.body
    try {
        //new true is for show the response of the updated cartegory onely
        const updated = await SubCategory.findOneAndUpdate({ slug: req.params.slug }, { name, parent, slug: slugify(name) }, { new: true })
        res.json(updated)
    } catch (err) {
        res.status(400).send("update SubCategory faild")
    }
}

exports.remove = async (req, res) => {
    try {
        const deleted = await SubCategory.findOneAndDelete({ slug: req.params.slug })
        res.json(deleted)

    } catch (err) {
        res.status(400).send(" delete faild")
    }
}
exports.SubCount = async (req, res) => {

    let total = await SubCategory.find({}).estimatedDocumentCount().exec()
    res.json(total)

}