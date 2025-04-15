// src/components/layout/AuthLayout.jsx
import React from "react";
import { Box, Paper } from "@mui/material";
import Logo from "../common/Logo";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f8f8f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Logo />
      
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          bgcolor: "#ffffff",
          border: "1px solid #f0f0f0",
        }}
      >
        <Box sx={{ p: 4.5 }}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthLayout;