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
    const user = await User.findOne({ email });
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

module.exports.myCourse = async (req, res) => {
  const { email } = req.query;

  try {
    const fetchId = await User.findOne({ email });

    if (!fetchId) {
      return res.json({ success: false, msg: "User not found" });
    }

    const courseIds = fetchId.enrolledCourses.map((course) => course.courseId);

    // Fetch course details from courseAvailable collection
    const courses = await Course.find({ _id: { $in: courseIds } });
    //console.log(courses)
    return res.json({ success: true, courses });
  } catch (err) {
    console.error("Error fetching course details:", err);
    return res.json({
      success: false,
      msg: "Error in Backend part of myCourse",
    });
  }
};

module.exports.getPlaylist = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }
    const playlist = await Course.findById(courseId);
    if (!playlist) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json({
      success: true,
      playlists: playlist.videos,
      courseName: playlist.name,
    });
  } catch (err) {
    return res.json({
      success: false,
      msg: "Error in backend of get Playlist",
    });
  }
};

module.exports.saveVideoProgress = async (req, res) => {
  const { email, courseId, videoId, lastWatched, completed, progress } =
    req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    const course = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    if (!course) {
      return res
        .status(404)
        .json({ success: false, msg: "Course not enrolled" });
    }

    // Ensure videoProgress is initialized
    if (!course.videoProgress) {
      course.videoProgress = [];
    }

    const existingProgress = course.videoProgress.find(
      (v) => v.videoId === videoId
    );

    if (existingProgress) {
      existingProgress.lastWatched = lastWatched;
      existingProgress.completed = completed;
    } else {
      course.videoProgress.push({ videoId, lastWatched, completed });
    }
    if (typeof progress === "number" && progress >= 0 && progress <= 100) {
      course.progress = progress;
      if (progress === 100) {
        course.status = "Completed";
      }
    }

    await user.save();
    //console.log(course.progress);
    return res.status(200).json({
      success: true,
      msg: "Progress saved",
      progress: course.progress,
    });
  } catch (err) {
    console.error("Error saving video progress:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports.getAllVideoProgress = async (req, res) => {
  const { email, courseId } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const course = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    if (!course)
      return res.json({ success: false, msg: "Course not enrolled" });
    const enrolled = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    return res.json({ success: true, progressList: course.videoProgress, assessmentSubmitted: enrolled?.assessmentSubmitted });
  } catch (err) {
    console.error("Error fetching video progress:", err);
    return res.json({ success: false, msg: "Server error" });
  }
};

module.exports.getAssessmentQuestions = async (req, res) => {
  const courseId  = req.params.courseId;
  try {
    const course = await Course.findById(courseId); 
    if (!course || !course.assessment) {
      return res.json({ success: false, message: "No assessment found" });
    }
    console.log("success")
    return res.json({ success: true, questions: course.assessment });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.json({ success: false, message: "Server error" });
  }
};

module.exports.submitAssessment = async (req, res) => {
  const { email, courseId, score } = req.body;

  try {
    const result = await User.updateOne(
      { email, "enrolledCourses.courseId": courseId },
      {
        $set: {
          "enrolledCourses.$.score": score,
          "enrolledCourses.$.status": "Completed",
          "enrolledCourses.$.completed": true,
          "enrolledCourses.$.assessmentSubmitted": true,
          "enrolledCourses.$.assessmentSubmittedData": new Date()
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "User or course not found" });
    }

    res.status(200).json({ success: true, message: "Score updated successfully" });
  } catch (err) {
    console.error("Error storing score:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.getCompletedCourses = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    // Filter completed and assessment submitted courses
    const completedCourseEntries = user.enrolledCourses.filter(
      (course) => course.assessmentSubmitted && course.status === "Completed"
    );

    const completedCourseIds = completedCourseEntries.map((course) => course.courseId);

    // Fetch course details
    const courseDetails = await Course.find({ _id: { $in: completedCourseIds } });

    // Combine each completed course info with user course progress
    const completedCourses = completedCourseEntries.map((course) => {
      const courseInfo = courseDetails.find(
        (c) => c._id.toString() === course.courseId.toString()
      );
      return {
        userName: course.username,
        courseId: course.courseId,
        courseName: courseInfo?.name || "Course Name Not Found",
        description: courseInfo?.description || "",
        thumbnail: courseInfo?.thumbnail || "",
        score: course.score,
        progress: course.progress,
        enrolledDate: course.enrolledDate,
        assessmentSubmittedDate: course.assessmentSubmittedData,
        status: course.status,
      };
    });

    // Combine user and course data in one response
    return res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
      },
      completedCourses,
    });

  } catch (err) {
    console.error("Error fetching completed courses:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
