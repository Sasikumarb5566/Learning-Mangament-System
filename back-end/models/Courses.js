const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: { data: Buffer, contentType: String },
  description: Object,
  videos: [
    {
      id: { type: String, required: true }, 
      title: { type: String, required: true }, 
    },
  ],
  assessment: [
    {
      question: {type: String, required: true},
      options: [],
      answer: {type: String, required: true}
    }
  ]

}, { timestamps: true });

const Course = mongoose.model('courses_availables', courseSchema);

module.exports = Course;
