import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react"

const App = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");
  const goToSignup = () => navigate("/signup");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Education Platform</h1>
      <p>Please login or signup to continue.</p>
      <Button id="loginBtn" onClick={goToLogin}>Log in</Button>
      <Button id="signupBtn" onClick={goToSignup}>Sign up</Button>
    </div>
  );
};

export default App;