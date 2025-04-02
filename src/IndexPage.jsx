import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const IndexPage = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Retrieve userId from storage

        if (!userId) {
          setMessage("User ID not found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/courses/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the request
            }
          }
        );

        if (response.data.length === 0) {
          setMessage("No courses found. Please check with your instructor.");
        } else {
          setCourses(response.data);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load courses.");
      }
    };

    fetchCourses();
  }, []);

  // Logout function to clear session and redirect
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/"); // Redirect to the login page
  };

  return (
    <div>
      <h1>Your Courses:</h1>
      {message && <p>{message}</p>}
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <Link to={`/assignments/${course._id}`}>{course.name}</Link>
          </li>
        ))}
      </ul>
      <Button onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default IndexPage;
