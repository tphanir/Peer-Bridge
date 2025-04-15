// src/components/common/Logo.jsx
import React from "react";
import { Typography } from "@mui/material";

const Logo = () => {
  return (
    <Typography
      variant="h2"
      component="h1"
      sx={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600,
        color: "#2c3e50",
        textAlign: "center",
        mb: 3.5,
        letterSpacing: "1px",
        fontSize: "3.5rem",
        position: "relative",
        "::after": {
          content: '""',
          position: "absolute",
          bottom: "-16px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "1px",
          backgroundColor: "#2c3e50",
        }
      }}
    >
      Peer Bridge
    </Typography>
  );
};

export default Logo;