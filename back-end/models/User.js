const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  otp: String,
  otpExpiry: Date,
  enrolledCourses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      progress: { type: Number, default: 0 },
      status: { type: String, enum: ["In Progress", "Completed"], default: "In Progress" },
      enrolledDate: { type: Date, default: Date.now },
      completed: Boolean,
      lastWatched: Number,
      score: Number,
      assessmentSubmittedData: {type: Date}, 
      assessmentSubmitted: { type: Boolean, default: false },
      videoProgress: [
        {
          videoId: String,
          lastWatched: Number,
          completed: Boolean,
        }
      ]
    }
  ],
}, { timestamps: true });

const User = mongoose.model('login_details', userSchema);
module.exports = User;
