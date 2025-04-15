// src/components/auth/CreateAccountLink.jsx
import React from "react";
import { Box, Button } from "@mui/material";

const CreateAccountLink = ({ isLogin, toggleMode }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 3,
      }}
    >
      <Button
        variant="text"
        onClick={toggleMode}
        sx={{
          color: "#2c3e50",
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "15px",
          fontWeight: 400,
          textTransform: "none",
          letterSpacing: "0.5px",
          "&:hover": {
            background: "transparent",
            textDecoration: "underline",
          },
        }}
      >
        {isLogin ? "Create an account" : "Sign in to your account"}
      </Button>
    </Box>
  );
};

export default CreateAccountLink;