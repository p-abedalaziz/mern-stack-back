const test=require('../modules/test')
exports.testCreate=async(req,res)=>{
    try{
    const {name}=req.body
        res.json(await new test({ name }).save())   
    }
    catch(err){
        console.log(err)
        res.status(400).send("Creating faild")
    }
}