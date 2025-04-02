import React, { useState } from "react";
import axios from "axios";
import { Button, Fieldset, Input, Stack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Field } from "./components/ui/field";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      setMessage(response.data.message || "Login successful!");
      
      // Save details to localStorage
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      
      // Redirect to the user page after login
      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <Fieldset.Root size="lg" maxW="md">
        <Stack>
            <Fieldset.Legend>Log in</Fieldset.Legend>
            <Fieldset.HelperText>
            Please enter your credentials below.
            </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
            <Field label="Email">
                <Input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </Field>

            <Field label="Password">
                <Input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </Field>
        </Fieldset.Content>

        <Button onClick={handleLogin} type="submit" alignSelf="flex-start">
            Log in
        </Button>
    </Fieldset.Root>
  );
};

export default Login;
