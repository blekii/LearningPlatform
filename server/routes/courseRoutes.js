const express = require('express');
const router = express.Router();
const Course = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/courseModel.jsx');
const User = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/userModel.jsx');
const Assignment = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/assignmentModel.jsx');
const Submission = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/submissionModel.jsx');
const authMiddleware = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/middleware/authMiddleware.js');

// Create a new course
router.post('/create', async (req, res) => {
  try {
    const { _id, name, instructor } = req.body;
    const course = new Course({ _id, name, instructor });
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses for a specific user (by user ID)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID to determine their role and enrolled courses
    const user = await User.findById(Number(userId));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Query courses based on the user's role
    let courses;
    if (user.role === 'teacher') {
      // Teacher: Find courses where they are the instructor
      courses = await Course.find({ instructor: Number(userId) });
    } else {
      // Student: Find courses where they are enrolled
      courses = await Course.find({ students: Number(userId) });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get grades calculator
router.get('/:courseId/grades', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming auth middleware adds user to req
    const { courseId } = req.params;

    // Fetch all assignments for the course
    const assignments = await Assignment.find({ course: courseId });
    console.log("Assignments:", assignments);

    // Fetch all submissions by the user for this course
    const assignmentIds = assignments.map(a => a._id);
    const submissions = await Submission.find({
      studentId: userId,
      assignmentId: { $in: assignmentIds }
    });
    console.log("Submissions:", submissions);

    let totalGrade = 0;
    let totalWeight = 0;
    const gradeDetails = [];

    assignments.forEach((assignment) => {
      const submission = submissions.find(
        (sub) => sub.assignmentId.toString() === assignment._id.toString()
      );

      // Skip if the submission has no grade (null or undefined)
      if (!submission || submission.grade === null) return;

      const grade = submission.grade;
      const weight = assignment.weight;

      console.log(`Assignment: ${assignment.title}, Grade: ${grade}, Weight: ${weight}`);

      totalGrade += grade * weight;
      totalWeight += weight;

      gradeDetails.push({
        assignmentTitle: assignment.title,
        grade,
        weight,
      });
    });

    const finalGrade = totalWeight ? (totalGrade / totalWeight).toFixed(2) : 0;

    res.json({
      finalGrade,
      gradeDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
