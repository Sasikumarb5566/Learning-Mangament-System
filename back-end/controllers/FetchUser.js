const User = require('../models/User')

module.exports.fetchCurrentUser = async(req, res) => {
    const  { email }  = req.query;
    try {
        const user = await User.findOne({email});
        res.json({success: true, data: user});
    } catch(err) {
        console.log("Error in fetching users in server: ", err);
        res.json({ success: false, message: "Failed to fetch users" });
    }
}