import React, { useState } from "react";
import axios from "axios";
import { Button, Fieldset, Input, NativeSelectField, NativeSelectRoot, Stack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Field } from "./components/ui/field";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [_id, setID] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", {
        name,
        _id,
        email,
        password,
        role
      });
      setMessage(response.data.message || "Signup successful!");

      // Save details to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("name", response.data.name);
      
      // Redirect to the user page after sign up
      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred during signup.");
    }
  };

  return (
    <Fieldset.Root size="lg" maxW="md">
        <Stack>
            <Fieldset.Legend>Sign up</Fieldset.Legend>
            <Fieldset.HelperText>
            Please enter your credentials below.
            </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
            <Field label="Name">
                <Input name="name" type="string" value={name} onChange={(e) => setName(e.target.value)} required/>
            </Field>

            <Field label="Student/Teacher ID">
                <Input name="id" type="number" value={_id} onChange={(e) => setID(e.target.value)} required/>
            </Field>

            <Field label="Email">
                <Input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </Field>

            <Field label="Password">
                <Input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </Field>

            <Field label="Role">
                <NativeSelectRoot>
                    <NativeSelectField name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </NativeSelectField>    
                </NativeSelectRoot>
            </Field>
        </Fieldset.Content>

        <Button onClick={handleSignup} type="submit" alignSelf="flex-start">
            Register
        </Button>
    </Fieldset.Root>
  );
};

export default Signup;
