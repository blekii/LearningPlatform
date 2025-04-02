const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/middleware/authMiddleware.js');
const Course = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/courseModel.jsx');
const User = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/userModel.jsx');
const Assignment = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/assignmentModel.jsx');
const Submission = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/submissionModel.jsx');

// Create a new assignment
router.post('/create', async (req, res) => {
  try {
    const { _id, title, course, description, dueDate } = req.body;
    const assignment = new Assignment({ _id, title, course, description, dueDate });
    await assignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all assignments for a specific course
router.get('/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Fetch instructor details using instructor ID
    const instructor = await User.findById(course.instructor);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Find all assignments associated with the course
    const assignments = await Assignment.find({ _id: { $in: course.assignments } });

    res.status(200).json({
      // role: user.role,
      course: {
        _id: course._id,
        name: course.name,
        instructor: {
          name: instructor.name, // Assuming User model has a 'name' field
        },
      },
      assignments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get assignment details by assignment ID
router.get('/portal/:assignmentId', authMiddleware, async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Find the assignment by its ID
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Fetch the course details associated with the assignment
    const course = await Course.findOne({ assignments: assignmentId });

    if (!course) {
      return res.status(404).json({ message: "Course not found for this assignment" });
    }

    // Fetch instructor details
    const instructor = await User.findById(course.instructor);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found for this course" });
    }

    const isTeacher = req.user._id.toString() === instructor._id.toString();
    const role = isTeacher ? "teacher" : "student";

    // Fetch submissions if the user is a teacher
    // const submissions = isTeacher
    //   ? await Submission.find({ assignmentId })
    //   : [];
    
    // Fetch submissions based on role
    let submissions = [];
    if (isTeacher) {
      submissions = await Submission.find({ assignmentId });
    } else {
      // Fetch only the current student's submission
      const studentId = req.user._id;
      const studentSubmission = await Submission.findOne({
        assignmentId,
        studentId,
      });
      if (studentSubmission) {
        submissions = [studentSubmission];
      }
    }


    // Respond with assignment details, course info, and instructor
    res.status(200).json({
      assignment: {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
      },
      course: {
        _id: course._id,
        name: course.name,
        instructor: {
          _id: instructor._id,
          name: instructor.name,
        },
      },
      role,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
