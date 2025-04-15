// src/components/home/SectionCards.jsx
import React from "react";
import { Box } from "@mui/material";
import SectionCard from "./SectionCard";

const SectionCards = ({ sections, activeSection, handleSectionChange }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          isActive={activeSection === section.id}
          onClick={() => handleSectionChange(section.id)}
        />
      ))}
    </Box>
  );
};

export default SectionCards;