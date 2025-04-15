// src/pages/Home.jsx - Horizontal Layout
import React, { useState } from "react";
import { Box, Container, Paper, Typography, Divider, Grid } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import MobileDrawer from "../components/layout/MobileDrawer";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  MenuBook as CourseReviewsIcon,
  EmojiEvents as ExperiencesIcon,
  Folder as ResourcesIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
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
    
    // Scroll to the section horizontally if needed
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const sections = [
    {
      id: "courseReviews",
      title: "Course Reviews",
      icon: "MenuBook",
      component: CourseReviewsIcon,
      content: "Browse and contribute to reviews of courses you've taken.",
    },
    {
      id: "experiences",
      title: "Experiences",
      icon: "EmojiEvents",
      component: ExperiencesIcon,
      content: "Share your internship, job, and research experiences with peers.",
    },
    {
      id: "courseResources",
      title: "Course Resources",
      icon: "Folder",
      component: ResourcesIcon,
      content: "Access and share helpful resources for your courses.",
    },
    {
      id: "chat",
      title: "Chat",
      icon: "Chat",
      component: ChatIcon,
      content: "Connect with peers through our real-time messaging system.",
    },
  ];

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
          pt: { xs: 8, sm: 9 },
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          overflowX: { xs: 'auto', lg: 'hidden' }
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1, md: 2 } }}>
          {/* Horizontal Layout using Grid */}
          <Grid container spacing={3} sx={{ 
            flexWrap: isSmall ? 'nowrap' : 'wrap',
            overflowX: isSmall ? 'auto' : 'visible',
            pb: isSmall ? 2 : 0 // Add padding bottom for scrollbar space on mobile
          }}>
            {sections.map((section) => {
              const IconComponent = section.component;
              
              return (
                <Grid item xs={12} sm={6} md={3} key={section.id} sx={{ 
                  minWidth: isSmall ? 280 : 'auto' // Set minimum width for scrollable items on mobile
                }}>
                  <Paper
                    id={section.id}
                    elevation={1}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: "4px",
                      borderTop: activeSection === section.id ? "3px solid #2c3e50" : "none",
                      boxShadow: activeSection === section.id 
                        ? "0 4px 12px rgba(0,0,0,0.1)" 
                        : "0 2px 8px rgba(0,0,0,0.05)",
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: "#2c3e50", mr: 2 }}>
                        <IconComponent fontSize="large" />
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
                      }}
                    >
                      {section.content}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Libre Franklin', sans-serif",
                        fontSize: "14px",
                        color: "#34495e",
                        lineHeight: 1.5,
                        mt: 'auto', // Push to bottom
                      }}
                    >
                      Tap to view {section.title.toLowerCase()}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;