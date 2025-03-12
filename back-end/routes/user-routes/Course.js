const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrolledCourses } = require("../../controllers/Courses");

router.post('/enroll', enrollCourse);
router.get("/enrolled-courses", getEnrolledCourses);

module.exports = router;
