// src/components/auth/NameField.jsx
import React from "react";
import { TextField, InputAdornment, FormHelperText } from "@mui/material";
import { Person } from "@mui/icons-material";

const NameField = ({ name, setName, hasError }) => {
  return (
    <>
      <TextField
        placeholder="Full Name"
        variant="standard"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={hasError}
        onFocus={() => hasError && setName("")}
        sx={{
          mb: hasError ? 0.5 : 3.5,
          "& .MuiInput-underline:before": {
            borderBottomColor: hasError ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
          },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottomColor: hasError ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: hasError ? "#e74c3c" : "#2c3e50",
          },
          "& .MuiInputBase-input": {
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "16px",
            padding: "12px 0",
            letterSpacing: "0.4px",
            fontWeight: 400,
            color: "#2d3436",
            backgroundColor: hasError ? "rgba(231, 76, 60, 0.05)" : "transparent",
          },
          "& .MuiInputBase-input::placeholder": {
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "15px",
            letterSpacing: "0.5px",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#95a5a6",
            opacity: 0.8,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person sx={{ 
                color: hasError ? "#e74c3c" : "#95a5a6", 
                fontSize: "20px" 
              }} />
            </InputAdornment>
          ),
        }}
      />
      {hasError && (
        <FormHelperText 
          error 
          sx={{ 
            marginLeft: '14px',
            marginTop: 0,
            marginBottom: 3,
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "12px",
            fontWeight: 400
          }}
        >
          Please enter your full name
        </FormHelperText>
      )}
    </>
  );
};

export default NameField;