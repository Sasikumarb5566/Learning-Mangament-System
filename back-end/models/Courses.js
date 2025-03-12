const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: { data: Buffer, contentType: String },
  description: Object

}, { timestamps: true });

const Course = mongoose.model('courses_availables', courseSchema);

module.exports = Course;
