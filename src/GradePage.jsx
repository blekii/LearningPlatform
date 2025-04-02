import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

const GradePage = () => {
    const { courseId } = useParams();
    const [grades, setGrades] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchGrades = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/api/courses/${courseId}/grades`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setGrades(response.data);
        } catch (error) {
          setMessage(error.response?.data?.message || "Failed to fetch grades.");
        }
      };
  
      fetchGrades();
    }, [courseId]);
  
    return (
      <Box p={6}>
        <Heading mb={4}>Course Grades</Heading>
        {message && <Text color="red.500">{message}</Text>}
  
        {grades ? (
          <Box>
            <Text fontSize="lg">
              <strong>Current grade:</strong> {grades.finalGrade}
            </Text>
            <Heading size="md" mt={4}>Assignment Grades</Heading>
            <br></br>
            <ul>
              {grades.gradeDetails.map((grade, index) => (
                <li key={index}>
                  <Text>
                    <strong>{grade.assignmentTitle}</strong>: {grade.grade} (Weight: {grade.weight}%)
                  </Text>
                </li>
              ))}
            </ul>
          </Box>
        ) : (
          <Text>Loading grades...</Text>
        )}

        <Button mt={6} onClick={() => navigate(`/assignments/${courseId}`)}>
        Back to Course Page
        </Button>
      </Box>
    );
  };

export default GradePage;
