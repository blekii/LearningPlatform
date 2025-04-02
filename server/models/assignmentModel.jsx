const mongoose = require('mongoose');

// Define the Assignment schema
const assignmentSchema = new mongoose.Schema({
  _id: {
    type: String, // Custom ID, e.g., "Math101_Assign1"
    required: true,
  },
  title: {
    type: String, // Assignment title
    required: true,
  },
  course: {
    type: String, // References the course's _id from the Course model
    required: true,
  },
  description: {
    type: String, // Details about the assignment
    required: true,
  },
  dueDate: {
    type: Date, // Due date for the assignment
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  submissions: [{
    type: String,
    ref: "Submission",
  }],
});

const Assignment = mongoose.model('Assignment', assignmentSchema, 'assignments');
module.exports = Assignment;
