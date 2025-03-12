const User = require('../models/User');
const bcrypt = require("bcryptjs");

// User's email and password verification from login page
module.exports.loginVerify = async(req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser && await bcrypt.compare(password, existingUser.password)) {
            return res.json({success: true, message: "Login successfully"});
        }
        else {
            return res.json({success: false, message: "Invalid email or password"});
        }
    }
    catch(error) {
        console.log("Error in verifying login: ",error);
        return res.json({success: false, message: `Error: ${error.message}`})
    }
}