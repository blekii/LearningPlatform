import axios from "axios";

export const getAllUser = async () => {
    try {
      const response = await axios.get("http://localhost:2048/api/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network error" };
    }
};

export const registerUser = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/users/register");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

export const loginUser = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/users/login");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};