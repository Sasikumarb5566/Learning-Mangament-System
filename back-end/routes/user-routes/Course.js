const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrolledCourses, myCourse } = require("../../controllers/Courses");

router.post('/enroll', enrollCourse);
router.get("/enrolled-courses", getEnrolledCourses);
router.get("/my-course", myCourse);

module.exports = router;
