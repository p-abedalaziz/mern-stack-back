const Trader=require('../modules/trader')
const User=require('../modules/user')
const slugify = require('slugify')
exports.createTraderInfo=async(req,res)=>{
    const { name, facebook, instagram, twitter,phone,about}=req.body
    const createName = new Trader({
        facebook, instagram, twitter, name, phone, about, slug: slugify(name)
}).save()
        res.json(createName) 
}
exports.updateTraderInfo=async(req,res)=>{
    console.log(req.body)
   
    const { phone, name, about,facebook, instagram, twitter, }=req.body
    
    // const {name} = req.body
    // const { phone } = req.body
    // const { about } = req.body 
    try {
            udpateName = await Trader.findOneAndUpdate({ slug: req.params.slug },
                { facebook, instagram,twitter, phone, name, about, slug: slugify(name) }, { new: true }).exec()
            res.json({ ok: true })
        } catch (err) {
            res.status(400).send("  Update faild")
        }

    // if(name){
    //     try {  
    //         udpateName = await Trader.findOneAndUpdate({ slug: req.params.slug },
    //             { name, slug: slugify(name) }, { new: true }).exec()
    //         res.json({ ok: true })
    //     } catch (err) {
    //         res.status(400).send(" name Update faild")
    //     }
   
    // }       
    // if (phone) {
    //     try{
    //         udpatePhone = await Trader.findOneAndUpdate({ slug: req.params.slug },
    //             { phone}, { new: true }).exec()
    //         res.json({ ok: true })
    //     }catch (err) {
    //         res.status(400).send(" PHone update  faild")
    //     }
      
    // }
    // if (about) {
    //     try{
           
    //         udpateAbout = await Trader.findOneAndUpdate({ slug: req.params.slug  },
    //             { about }, { new: true }).exec()
    //         res.json({ ok: true })
    //     }catch(err){
    //         res.status(400).send(" about update  faild")
    //     }
      
    // }
    // if(name &&about &&phone){
    //     try {

    //         udpateAbout = await Trader.findOneAndUpdate({ slug: req.params.slug },
    //             { about, name, phone, slug: slugify(name) }, { new: true }).exec()
    //         res.json({ ok: true })
    //     } catch (err) {
    //         res.status(400).send("  update  faild")
    //     }
    // }

}
exports.deleteTraderInfo = async (req, res) => {
    const { TraderInfo } = req.body
    const { name } = TraderInfo
    const {phone} = TraderInfo
    const {about} = TraderInfo
    if (name) {
        try {
            deleteName = await Trader.findOneAndDelete({ slug: req.params.slug },
                { name }).exec()
            res.json({ ok: true })
        } catch (err) {
            res.status(400).send(" name delete faild")
        }

    }
    if (phone) {
        try {
            deletePhone = await Trader.findOneAndDelete({ slug: req.params.slug },
                { phone }).exec()
            res.json({ ok: true })
        } catch (err) {
            res.status(400).send(" PHone Delete  faild")
        }

    }
    if (about) {
        try {
            deleteAbout = await Trader.findOneAndDelete({ slug: req.params.slug },
                { about }).exec()
            res.json({ ok: true })
        } catch (err) {
            res.status(400).send(" about update  faild")
        }

    }

}
exports.list = async (req, res) => {
    // this way to find all category and sort it by latest created 

    res.json(await Trader.find({}).exec())

}
