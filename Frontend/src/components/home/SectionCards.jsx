// src/components/home/SectionCards.jsx
import React from "react";
import { Grid } from "@mui/material";
import SectionCard from "./SectionCard";

const SectionCards = ({ sections, activeSection, handleSectionChange }) => {
  return (
    <Grid container spacing={3}>
      {sections.map((section) => (
        <Grid item xs={12} sm={6} md={3} key={section.id}>
          <SectionCard
            section={section}
            isActive={activeSection === section.id}
            onClick={() => handleSectionChange(section.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default SectionCards;