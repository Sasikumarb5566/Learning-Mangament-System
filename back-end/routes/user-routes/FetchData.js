const express = require('express');
const router = express.Router();
const { fetchCurrentUser } = require('../../controllers/FetchUser');
const { availableCourse } = require('../../controllers/Courses');

router.get('/user', fetchCurrentUser);
router.get('/available', availableCourse)

module.exports = router;
