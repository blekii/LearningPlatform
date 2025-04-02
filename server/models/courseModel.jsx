const mongoose = require('mongoose');

// Define the Course schema
const courseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String, // Full course name
    required: true,
  },
  instructor: {
    type: Number, // References the teacher's _id from the User model
    required: true,
  },
  students: {
    type: [Number], // Array of student _ids from the User model
    default: [],
  },
  assignments: {
    type: [String], // Array of assignment _ids (referencing Assignment model)
    default: [],
  },
});

const Course = mongoose.model('Course', courseSchema, 'courses');
module.exports = Course;
