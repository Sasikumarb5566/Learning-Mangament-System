const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrolledCourses, myCourse, getPlaylist } = require("../../controllers/Courses");

router.post('/enroll', enrollCourse);
router.get("/enrolled-courses", getEnrolledCourses);
router.get("/my-course", myCourse);
router.get('/courses/:courseId/videos', getPlaylist); 

module.exports = router;
