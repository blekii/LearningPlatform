import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Strong } from "@chakra-ui/react";
import "./CoursePage.css";

const CourseData = () => {
  const { courseId } = useParams(); // Retrieve courseId from the route
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Navigate for redirection

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/assignments/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the request
            },
          }
        );

        setCourse(response.data.course);
        setAssignments(response.data.assignments); // Store assignments array

        // Fetch user role
        const roleResponse = await axios.get(
          `http://localhost:5000/api/users/role`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserRole(roleResponse.data.role); // Set user role from response

      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load course details.");
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <div>
      <h1>Course Details</h1>
      {message && <p>{message}</p>}
      {course ? (
        <div>
          <h2>
            <Strong>
              {course._id}: {course.name}
            </Strong>
          </h2>
          <p>Instructor: {course.instructor.name}</p>

          <h3>Assignments</h3>
          {assignments.length > 0 ? (
            <ul>
              {assignments.map((assignment) => (
                <li key={assignment._id}>
                  <Link to={`/assignments/${course._id}/${assignment._id}`}>{assignment.title}</Link>
                  <p>{assignment.description}</p>
                  <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments found for this course.</p>
          )}

          {/* Button for Course Grades */}
          {userRole === "student" && (
            <Button
              colorScheme="blue"
              mt={4}
              onClick={() => navigate(`/courses/${courseId}/grades`)}
              >
              View Course Grades
            </Button>
          )}
          
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <Button onClick={() => navigate("/home")} colorScheme="teal" mb={4}>
        Back to Home
      </Button>
    </div>
  );
};

export default CourseData;
