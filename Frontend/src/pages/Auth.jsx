// src/pages/Auth.jsx - Fixed Version
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
import axios from "axios";

// Updated API URL to match backend expectations
const API_URL = "http://localhost:4000/PeerBridge/users";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Additional fields for registration
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
    studentId: false,
    name: false,
    year: false
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFieldErrors({
      email: false,
      password: false,
      studentId: false,
      name: false,
      year: false
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleAuth = async () => {
    // Reset previous errors
    const newFieldErrors = {
      email: false,
      password: false,
      studentId: false,
      name: false,
      year: false
    };
    setError("");

    // Check email and password for both login and register
    newFieldErrors.email = !email;
    newFieldErrors.password = !password;

    // For registration, check additional fields
    if (!isLogin) {
      newFieldErrors.studentId = !studentId;
      newFieldErrors.name = !name;
      newFieldErrors.year = !year;
    }

    setFieldErrors(newFieldErrors);

    // If any required field has an error, don't proceed
    if (Object.values(newFieldErrors).some(error => error)) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login request
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password
        });

        console.log("Login response:", response.data);

        // Store the JWT token from the response
        if (response.data.data && response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          navigate('/home');
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        // Register request - fixed parameter names to match backend
        const response = await axios.post(`${API_URL}/signup`, {
          studentid: studentId, // Changed from studentId to studentid
          name,
          email,
          password,
          year
        });

        console.log("Signup response:", response.data);

        if (response.data.jwt) {
          // If backend returns a token on signup
          localStorage.setItem("token", response.data.jwt);
          const userData = {
            studentid: studentId,
            name: name,
            email: email,
            year: year
          };
          localStorage.setItem("user", JSON.stringify(userData));
          navigate('/home');
        } else {
          // If registration successful but login required
          setIsLogin(true);
          alert("Registration successful! Please log in.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Authentication failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthForm
        isLogin={isLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        studentId={studentId}
        setStudentId={setStudentId}
        name={name}
        setName={setName}
        year={year}
        setYear={setYear}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        fieldErrors={fieldErrors}
        handleAuth={handleAuth}
        toggleMode={toggleMode}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
};

export default Auth;