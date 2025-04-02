const mongoose = require('mongoose');

// Submission Schema
const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: String,
      required: true,
    },
    studentId: {
      type: Number,
      required: true,
    },
    studentName: {
        type: String,
        require: true,
    },
    submittedDate: {
      type: Date,
      required: true,
    },
    fileLink: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema, 'submissions');

module.exports = Submission;
