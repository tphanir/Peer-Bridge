// src/pages/Home.jsx - Enhanced with CourseReviewsSection
import React, { useState } from "react";
import { Box, Container, Paper, Typography, Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import MobileDrawer from "../components/layout/MobileDrawer";
import { SECTIONS } from "../utils/constants";
import CourseReviewsSection from "../components/courseReviews/CourseReviewsSection";
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

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("courseReviews");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Map the sections with their icon components
  const sections = SECTIONS.map(section => ({
    ...section,
    IconComponent: iconComponents[section.icon]
  }));

  // Render the content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case "courseReviews":
        return <CourseReviewsSection />;
      case "experiences":
        return (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "16px",
              color: "#34495e",
              lineHeight: 1.6,
            }}
          >
            This is the content area for the experiences section.
            In a real application, this would display relevant experience sharing features.
          </Typography>
        );
      case "courseResources":
        return (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "16px",
              color: "#34495e",
              lineHeight: 1.6,
            }}
          >
            This is the content area for the course resources section.
            In a real application, this would display available course materials and resources.
          </Typography>
        );
      case "chat":
        return (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "16px",
              color: "#34495e",
              lineHeight: 1.6,
            }}
          >
            This is the content area for the chat section.
            In a real application, this would display a real-time messaging interface.
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8f8f8" }}>
      <Navbar 
        activeSection={activeSection}
        sections={sections}
        handleSectionChange={handleSectionChange}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />
      
      {isMobile && (
        <MobileDrawer
          sections={sections}
          activeSection={activeSection}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          handleSectionChange={handleSectionChange}
        />
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 10, sm: 12 },
          pb: 6,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              color: "#2c3e50",
              mb: 4,
              textAlign: { xs: "center", md: "left" }
            }}
          >
            Welcome to Peer Bridge
          </Typography>
          
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 6,
              overflow: { xs: "visible", md: "auto" },
              pb: { xs: 2, md: 1 }, // Add padding for scrollbar space
            }}
          >
            {sections.map((section) => (
              <Paper
                key={section.id}
                elevation={1}
                onClick={() => handleSectionChange(section.id)}
                sx={{
                  p: 3,
                  flexGrow: 1,
                  flexBasis: 0,
                  minWidth: { xs: "100%", md: "200px" },
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "8px",
                  borderTop: activeSection === section.id ? "3px solid #2c3e50" : "none",
                  boxShadow: activeSection === section.id 
                    ? "0 4px 12px rgba(0,0,0,0.1)" 
                    : "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                    cursor: "pointer",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: "#2c3e50", mr: 2 }}>
                    <section.IconComponent fontSize="large" />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 600,
                      color: "#2c3e50",
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "'Libre Franklin', sans-serif",
                    fontSize: "14px",
                    color: "#34495e",
                    lineHeight: 1.5,
                    mb: 2,
                    flexGrow: 1,
                  }}
                >
                  {section.content}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Libre Franklin', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#2c3e50",
                    textAlign: "right",
                  }}
                >
                  {activeSection === section.id ? "Active" : "Click to view"}
                </Typography>
              </Paper>
            ))}
          </Box>
          
          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                color: "#2c3e50",
                mb: 2,
              }}
            >
              {sections.find(s => s.id === activeSection)?.title}
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            {renderSectionContent()}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;