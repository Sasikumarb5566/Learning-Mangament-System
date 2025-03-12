const mongoose = require("mongoose");
const Course = require("./models/Courses");
const fs = require("fs");
const path = require("path");

mongoose.connect("mongodb://127.0.0.1:27017/lms-users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const saveCourseWithImage = async () => {
  try {
    const imagePath = path.join(
      __dirname,
      "assets",
      "Course-images",
      "ml.jpg"
    );
    const imageData = fs.readFileSync(imagePath);
    const newCourse = new Course({
      name: "Machine Learning Fundamentals",
      price: "Free",
      image: {
        data: imageData,
        contentType: "image/jpg",
      },
      description: {
        title: "Machine Learning Fundamentals",
        duration: "8 weeks",
        author: "Sasikumar B",
        content: [
          "Introduction",
          "Installation Guide of React.js",
          "Basic Program",
          "Advanced Concept",
          "Project",
          "Conclusion",
        ],
        assessmentDate: "09/10/2025",
      },
    });

    await newCourse.save();
    console.log("✅ Course with image saved successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.disconnect();
  }
};

saveCourseWithImage();
