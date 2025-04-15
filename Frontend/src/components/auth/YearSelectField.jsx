// src/components/auth/YearSelectField.jsx
import React from "react";
import { FormControl, InputLabel, Select, MenuItem, InputAdornment, FormHelperText, Box } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

const YearSelectField = ({ year, setYear, hasError }) => {
  return (
    <Box sx={{ mb: hasError ? 0.5 : 3.5 }}>
      <FormControl 
        variant="standard" 
        fullWidth 
        error={hasError}
      >
        <InputLabel 
          id="year-select-label"
          sx={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "15px",
            letterSpacing: "0.5px",
            fontWeight: 300,
            fontStyle: "italic",
            color: hasError ? "#e74c3c" : "#95a5a6",
            opacity: 0.8,
          }}
        >
          Year
        </InputLabel>
        <Select
          labelId="year-select-label"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <CalendarToday sx={{ 
                color: hasError ? "#e74c3c" : "#95a5a6", 
                fontSize: "20px" 
              }} />
            </InputAdornment>
          }
          sx={{
            "& .MuiInput-underline:before": {
              borderBottomColor: hasError ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: hasError ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: hasError ? "#e74c3c" : "#2c3e50",
            },
            "& .MuiSelect-select": {
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "16px",
              padding: "12px 0 12px 32px", // Add padding for the icon
              letterSpacing: "0.4px",
              fontWeight: 400,
              color: "#2d3436",
              backgroundColor: hasError ? "rgba(231, 76, 60, 0.05)" : "transparent",
            }
          }}
        >
          <MenuItem value="">
            <em>Select your year</em>
          </MenuItem>
          <MenuItem value="1">B.Tech 1st Year</MenuItem>
          <MenuItem value="2">B.Tech 2nd Year</MenuItem>
          <MenuItem value="3">B.Tech 3rd Year</MenuItem>
          <MenuItem value="4">B.Tech 4th Year</MenuItem>
        </Select>
        {hasError && (
          <FormHelperText sx={{ 
            marginLeft: '14px',
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "12px",
            fontWeight: 400
          }}>
            Please select your year
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default YearSelectField;