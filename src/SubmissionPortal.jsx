import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Input, Text, Box, Heading } from "@chakra-ui/react";

const SubmissionPortal = () => {
  const { assignmentId, courseId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");
  const [studentGrade, setStudentGrade] = useState(null);
  const [averageGrade, setAverageGrade] = useState(null);
  const [userSubmission, setUserSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/assignments/portal/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { assignment, course, role, submissions } = response.data;
        setAssignment(assignment);
        setCourse(course);
        setUserRole(role);
        setSubmissions(submissions);

        console.log("Fetched submissions: ", submissions);

        // Check if the user is a student and find their submission
        if (role === "student") {
          const userId = localStorage.getItem("userId");
          const submission = submissions.find((s) => s.studentId.toString() === userId);
          setUserSubmission(submission || null);
          console.log("User's submission:", submission); // Log user's submission
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load assignment details.");
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId]);

  useEffect(() => {
    setFilteredSubmissions(submissions); // Show all submissions initially
  }, [submissions]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const response = await axios.get(
          `http://localhost:5000/api/submissions/grades/${assignmentId}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { studentGrade, averageGrade } = response.data;
        setStudentGrade(studentGrade);
        setAverageGrade(averageGrade);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to fetch grades.");
      }
    };

    if (userRole === "student") fetchGrades();
  }, [assignmentId, userRole]);

  const handleSubmit = async (e) => {
    const studentId = localStorage.getItem("userId");
    const studentName = localStorage.getItem("name");

    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId);
    formData.append("studentName", studentName);
    formData.append("submittedDate", new Date().toISOString()); 

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/submissions/submitAssignment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Submission successful!");
      setUserSubmission(response.data.submission); // Update the submission in state
    } catch (error) {
      setMessage(error.response?.data?.message || "Submission failed.");
    }
  };

  const handleGradeSubmit = async (submissionId, grade) => {
    try {
      const token = localStorage.getItem("token");
  
      // Validate grade before sending it
      if (grade < 0 || grade > 100) {
        setMessage("Grade must be between 0 and 100.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/submissions/grade",
        { submissionId, grade },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setMessage("Grade updated successfully!");
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((sub) =>
          sub._id === submissionId ? { ...sub, grade: response.data.submission.grade } : sub
        )
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update grade.");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  
    if (query.trim() === "") {
      setFilteredSubmissions(submissions); // Show all submissions if the search is cleared
    } else {
      const filtered = submissions.filter((submission) =>
        submission.studentName.toLowerCase().includes(query.toLowerCase()) ||
        submission.studentId.toString().includes(query)
      );
      setFilteredSubmissions(filtered);
    }
  };  
  
  return (
    <Box p={6}>
      <Heading mb={4}>Submission Portal</Heading>
      {message && <Text color="red.500">{message}</Text>}

      {assignment && course ? (
        <Box>
          <Text fontSize="lg">
            <strong>{course.name}</strong> (Course ID: {course._id})
          </Text>
          <Text>
            <strong>Instructor:</strong> {course.instructor.name}
          </Text>

          <Heading size="md" mt={4}>{assignment.title}</Heading>
          <Text>{assignment.description}</Text>
          <Text>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</Text>

          {averageGrade !== null && (
            <Text mt={2}>
              <strong>Average Grade:</strong> {averageGrade}
            </Text>
          )}

          {/* Student View: Their Submission and Grade */}
          {userRole === "student" && (
            <Box mt={4}>
              {userSubmission ? (
                <>
                  <Text><strong>Your Submission:</strong></Text>
                  <Text>
                    <strong>Submitted File:</strong> <a href={userSubmission.fileLink}>Download</a>
                  </Text>
                  <Text>
                    <strong>Submitted on:</strong> {new Date(userSubmission.submittedDate).toLocaleDateString()}
                  </Text>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label>
                    Submit your work:
                    <input type="file" name="submission" onChange={(e) => setFile(e.target.files[0])}/>
                  </label>
                  <Button type="submit" mt={2}>
                    Submit
                  </Button>
                </form>
              )}
              <Text mt={2}>
                <strong>Your Grade:</strong> {studentGrade !== null ? studentGrade : "Not graded yet."}
              </Text>
            </Box>
          )}

          {/* Teacher View: All Submissions */}
          {userRole === "teacher" && (
            <Box mt={6}>
              <Heading size="md">Submissions</Heading>
              <Input
                placeholder="Search by student name or ID"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                mt={4}
                mb={4}
              />
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <Box key={submission._id} border="1px" p={4} my={2} borderRadius="md">
                    <Text><strong>Student:</strong> {submission.studentName}</Text>
                    <Text><strong>Student ID:</strong> {submission.studentId}</Text>
                    <Text><strong>Submission:</strong> <a href={submission.fileLink}>Download</a></Text>
                    <Text><strong>Submitted on:</strong> {new Date(submission.submittedDate).toLocaleDateString()}</Text>
                    
                    {submission.grade !== null ? (
                      <Text><strong>Current Grade:</strong> {submission.grade}</Text>
                    ) : (
                      <Text><strong>Current Grade:</strong> Not graded yet.</Text>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const grade = e.target.grade.value;
                        handleGradeSubmit(submission._id, grade);
                      }}
                    >
                      <label>
                        Enter grade / Update grade:
                        <Input size="sm" type="number" name="grade" placeholder="Enter grade" required />
                      </label>
                      <Button type="submit" mt={2} size="sm" colorScheme="blue">
                        Set Grade
                      </Button>
                    </form>
                  </Box>
                ))
              ) : (
                <Text>No submissions yet.</Text>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Text>Loading...</Text>
      )}

      <Button onClick={() => navigate(`/assignments/${courseId}`)} mb={4}>
        Back to Course Page
      </Button>
    </Box>
  );
};

export default SubmissionPortal;
