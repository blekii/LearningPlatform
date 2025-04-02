const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadSubmission } = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/controllers/submissionController.js');
const Submission = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/submissionModel.jsx');
const authMiddleware = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/middleware/authMiddleware.js');
const Assignment = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/assignmentModel.jsx');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Resolve relative to server directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/submitAssignment", authMiddleware, upload.single("file"), uploadSubmission);

router.post('/grade', async (req, res) => {
  try {
    const { submissionId, grade } = req.body;

    // Ensure grade is within the allowed range
    if (grade < 0 || grade > 100) {
      return res.status(400).json({ message: "Grade must be between 0 and 100." });
    }

    // Find the submission by ID and update the grade
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { grade },
      { new: true } // Return the updated document
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.status(200).json({
      message: "Grade updated successfully.",
      submission: updatedSubmission,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get grades for the current user and average grade for the assignment
router.get('/grades/:assignmentId/:userId', async (req, res) => {
  try {
    const { assignmentId, userId } = req.params;

    // Find the student's submission for the assignment
    const studentSubmission = await Submission.findOne({ assignmentId, studentId: userId });

    // Calculate the average grade for the assignment, excluding null grades
    const submissions = await Submission.find({ assignmentId, grade: { $ne: null } });
    const totalGrades = submissions.reduce((acc, submission) => acc + submission.grade, 0);
    const averageGrade = submissions.length ? totalGrades / submissions.length : null;

    res.status(200).json({
      studentGrade: studentSubmission?.grade || null,
      averageGrade: averageGrade !== null ? averageGrade.toFixed(2) : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch grades.", error: error.message });
  }
});

module.exports = router;
