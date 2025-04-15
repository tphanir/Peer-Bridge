// src/components/auth/AuthForm.jsx
import React from "react";
import { Typography } from "@mui/material";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import AuthButton from "./AuthButton";
import CreateAccountLink from "./CreateAccountLink";
import StudentIdField from "./StudentIdField";
import NameField from "./NameField";
import YearSelectField from "./YearSelectField";

const AuthForm = ({
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  studentId,
  setStudentId,
  name,
  setName,
  year,
  setYear,
  showPassword,
  togglePasswordVisibility,
  fieldErrors,
  handleAuth,
  toggleMode,
  loading,
  error
}) => {
  return (
    <>
      {error && (
        <Typography 
          color="error" 
          sx={{ 
            mb: 2, 
            fontSize: "14px", 
            textAlign: "center",
            fontFamily: "'Libre Franklin', sans-serif",
            padding: "8px",
            backgroundColor: "rgba(231, 76, 60, 0.1)",
            borderRadius: "4px"
          }}
        >
          {error}
        </Typography>
      )}
      
      {!isLogin && (
        <>
          <StudentIdField 
            studentId={studentId}
            setStudentId={setStudentId}
            hasError={fieldErrors.studentId}
          />
          
          <NameField 
            name={name}
            setName={setName}
            hasError={fieldErrors.name}
          />
        </>
      )}
      
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
      
      {!isLogin && (
        <YearSelectField 
          year={year}
          setYear={setYear}
          hasError={fieldErrors.year}
        />
      )}
      
      <AuthButton 
        isLogin={isLogin} 
        handleAuth={handleAuth} 
        loading={loading}
      />
      
      <CreateAccountLink isLogin={isLogin} toggleMode={toggleMode} />
    </>
  );
};

export default AuthForm;