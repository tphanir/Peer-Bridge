// src/pages/Auth.jsx
import React, { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import EmailField from "../components/auth/EmailField";
import PasswordField from "../components/auth/PasswordField";
import AuthButton from "../components/auth/AuthButton";
import CreateAccountLink from "../components/auth/CreateAccountLink";
import axios from "axios"; // You'll need to install axios: npm install axios

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false
  });

  const API_BASE_URL = "http://localhost:4000"; // Replace with your actual backend URL

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(""); // Clear any previous errors when switching modes
    setFieldErrors({ email: false, password: false }); // Clear field errors
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleAuth = async () => {
    // Reset previous errors
    setFieldErrors({ email: false, password: false });
    setError("");
    
    // Check each field individually and mark as error if empty
    const newFieldErrors = {
      email: !email,
      password: !password
    };
    
    setFieldErrors(newFieldErrors);
    
    // If any field has an error, don't proceed
    if (newFieldErrors.email || newFieldErrors.password) {
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (isLogin) {
        // Login request
        response = await axios.post(`${API_BASE_URL}/login`, {
          email,
          password
        });
        
        // Store the JWT token from the response
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        alert("Logged in successfully!");
      } else {
        // Register request
        response = await axios.post(`${API_BASE_URL}/signup`, {
          email,
          password
        });
        
        // Store the JWT token if your backend returns one on registration
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        alert("Registered successfully!");
      }
      
      // Redirect to home or dashboard after successful authentication
      window.location.href = '/dashboard';
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Authentication failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {error && <div className="error-message">{error}</div>}
      <EmailField 
        email={email} 
        setEmail={setEmail} 
        hasError={fieldErrors.email} 
      />
      <PasswordField 
        password={password} 
        setPassword={setPassword} 
        showPassword={showPassword} 
        togglePasswordVisibility={togglePasswordVisibility} 
        hasError={fieldErrors.password}
      />
      <AuthButton 
        isLogin={isLogin} 
        handleAuth={handleAuth} 
        loading={loading}
      />
      <CreateAccountLink isLogin={isLogin} toggleMode={toggleMode} />
    </AuthLayout>
  );
};

export default Auth;