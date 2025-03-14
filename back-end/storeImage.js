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
    const imagePath = path.join(__dirname, "assets", "Course-images", "django.png");
    const imageData = fs.readFileSync(imagePath);

    const newCourse = new Course({
      name: "Django Web Development",
      price: "₹199",
      image: {
        data: imageData,
        contentType: "image/jpg",
      },
      description: {
        title: "Django Web Development",
        duration: "8 Days",
        author: "Sasikumar B",
        content: [
          "Introduction to Web development",
          "HTML Course | From Beginner to Advanced Level",
          "Understand CSS",
          "What is responsive design?",
          "How JavaScript works?",
          "What is DOM?",
          "Creating CRUD App",
          "How to host website?"
        ],
        assessmentDate: "09/10/2025",
      },
      // ✅ Add YouTube Playlist Videos
      videos: [
        { id: "l1EssrLxt7E", title: "Introduction to Web Development" },
        { id: "Rek0NWPCNOc", title: "HTML Course | From Beginner to Advanced Level" },
        { id: "wKPlQkOdpFQ", title: "Understand CSS" },
        { id: "p870o46o1bM", title: "What is responsive design?" },
        { id: "2lRQTdpwhFk", title: "How JavaScript works?" },
        { id: "hRaDYCHqFQQ", title: "What is DOM?" },
        { id: "XuGaq24wixg", title: "Creating CRUD App" },
        { id: "Dm0K3x9yCkg", title: "How to host website?" },
      ],
    });

    await newCourse.save();
    console.log("✅ Course with image and videos saved successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.disconnect();
  }
};

saveCourseWithImage();
