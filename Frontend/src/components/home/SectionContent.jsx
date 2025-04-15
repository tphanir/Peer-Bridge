// src/components/home/SectionContent.jsx
import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const SectionContent = ({ activeSection, sections }) => {
  const currentSection = sections.find(s => s.id === activeSection);
  
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          color: "#2c3e50",
          mb: 2,
          pb: 1,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {currentSection?.title}
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "15px",
          color: "#34495e",
          lineHeight: 1.6,
        }}
      >
        This is the {currentSection?.title.toLowerCase()} section. 
        Content for this section will be loaded here based on user interaction.
      </Typography>
    </Paper>
  );
};

export default SectionContent;