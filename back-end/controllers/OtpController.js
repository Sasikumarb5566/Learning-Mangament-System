const User = require("../models/User");
const { sendEmail } = require("../helpers/Email");
const bcrypt = require("bcryptjs");

module.exports.generateOtp = async (req, res) => {
  const { username, email, password } = req.body;
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({    
      username,
      email,
      password: hashedPassword,
      otp: generatedOtp,
      otpExpiry: expiry,
    });

    await newUser.save();
    await sendEmail(email, "Your OTP Code", `Your OTP code is ${generatedOtp}`); // Call sendMail function to send OTP
    return res.json({
      success: true,
      message: "OTP sent to your email address!",
    });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ success: false, message: `Error: ${error.message}` });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp, inviter } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      await User.deleteOne({ email });      // If OTP is timed out, then automatically delete the user from the database
      return res.json({ success: false, message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save()
    res.json({ success: true, message: "OTP verified successfully" });
    
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ success: false, message: `Error: ${error.message}` });
  }
};
