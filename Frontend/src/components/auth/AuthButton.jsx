// src/components/auth/AuthButton.jsx
import React from "react";
import { Button } from "@mui/material";

const AuthButton = ({ isLogin, handleAuth }) => {
  return (
    <Button
      variant="contained"
      fullWidth
      disableElevation
      onClick={handleAuth}
      sx={{
        bgcolor: "#2c3e50",
        color: "white",
        textTransform: "none",
        fontFamily: "'Libre Franklin', sans-serif",
        fontSize: "16px",
        fontWeight: 500,
        padding: "13px 0",
        borderRadius: "4px",
        letterSpacing: "0.8px",
        mb: 3.5,
        "&:hover": {
          bgcolor: "#1a2530",
        },
      }}
    >
      {isLogin ? "Sign in" : "Create account"}
    </Button>
  );
};

export default AuthButton;