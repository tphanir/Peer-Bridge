// src/components/home/SectionCard.jsx
import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import {
  MenuBook as CourseReviewsIcon,
  EmojiEvents as ExperiencesIcon,
  Folder as ResourcesIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";

const iconComponents = {
  MenuBook: CourseReviewsIcon,
  EmojiEvents: ExperiencesIcon,
  Folder: ResourcesIcon,
  Chat: ChatIcon,
};

const SectionCard = ({ section, isActive, onClick }) => {
  const IconComponent = iconComponents[section.icon];

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        transition: "all 0.2s ease",
        borderLeft: isActive ? "3px solid #2c3e50" : "none",
        bgcolor: isActive ? "rgba(255, 255, 255, 0.9)" : "#ffffff",
        boxShadow: isActive 
          ? "0 4px 12px rgba(0,0,0,0.1)" 
          : "0 2px 8px rgba(0,0,0,0.05)",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ color: isActive ? "#2c3e50" : "#95a5a6", mr: 2, minWidth: "40px", display: "flex", justifyContent: "center" }}>
        <IconComponent />
      </Box>
      
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Libre Baskerville', serif",
            fontWeight: 400,
            fontSize: "1.1rem",
            color: isActive ? "#2c3e50" : "#34495e",
            mb: 0.5,
          }}
        >
          {section.title}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "14px",
            color: "#7f8c8d",
            lineHeight: 1.5,
          }}
        >
          {section.content}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SectionCard;