const User = require('../modules/user')



exports.CRUDUSER = async (req, res) => {
    const { email } = req.user
    const { picture, name } = req.body
    //used to find user in database by email and update name and picture
    const user = await User.findOneAndUpdate({ email }, { name, picture }, { new: true })
    if (user) {
        console.log("user updated", user)
        res.json(user)
    } else {
        const newUser = await new User({
            email,
            name,
            picture
        }).save()
        res.json(newUser)
        console.log("user created", newUser)
    }
}

exports.CURRENTUSER = async (req, res) => {
    User.findOne({ email: req.user.email }).exec((err, user) => {
        if (err) throw new Error(err) 
        res.json(user)
    })
}

