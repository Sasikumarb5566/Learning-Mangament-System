const Course = require("../models/Courses");
const User = require("../models/User");

module.exports.availableCourse = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, courses });
  } catch (err) {
    res.json({ success: false, msg: "Problem in Backend" });
  }
};

module.exports.enrollCourse = async (req, res) => {
  const { email, courseId } = req.body;
  try {
    if (!email || !courseId) {
      return res
        .status(400)
        .json({ success: false, msg: "Email and Course ID are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, msg: "Course not found" });
    }

    const isAlreadyEnrolled = user.enrolledCourses.some(
      (c) => c.courseId.toString() === courseId
    );
    if (isAlreadyEnrolled) {
      return res
        .status(400)
        .json({ success: false, msg: "Already enrolled in this course" });
    }

    user.enrolledCourses.push({
        courseId,
        progress: 0,
        status: "In Progress",
        enrolledDate: new Date(),
      });
      await user.save();
      return res.status(200).json({
        success: true,
        msg: "Successfully enrolled",
        enrolledCourses: user.enrolledCourses,
      });
  
  } catch (err) {
    console.error("Enrollment Error:", err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: err.message,
    });

  }
};

module.exports.getEnrolledCourses = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Email is required" });
  }

  try {
    const user = await User.findOne({ email }).populate(
      "enrolledCourses.courseId"
    );

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Failed to fetch enrolled courses",
      error: err,
    });
  }
};
