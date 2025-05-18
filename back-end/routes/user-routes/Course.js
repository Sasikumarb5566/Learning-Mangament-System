const express = require('express');
const router = express.Router();
const { enrollCourse, getEnrolledCourses, myCourse, getPlaylist, saveVideoProgress, getAllVideoProgress, getAssessmentQuestions, submitAssessment, getCompletedCourses } = require("../../controllers/Courses");

router.post('/enroll', enrollCourse);
router.get("/enrolled-courses", getEnrolledCourses);
router.get("/my-course", myCourse);
router.get('/courses/:courseId/videos', getPlaylist); 
router.post('/progress', saveVideoProgress);
router.get('/video', getAllVideoProgress);
router.get('/:courseId', getAssessmentQuestions)
router.post('/submit', submitAssessment)
router.get('/certificates/:email', getCompletedCourses)

module.exports = router;
