// src/components/layout/MainLayout.jsx
import React from "react";
import { Box, Container, Grid } from "@mui/material";
import Navbar from "./Navbar";
import MobileDrawer from "./MobileDrawer";
import { useMediaQuery, useTheme } from "@mui/material";

const MainLayout = ({ children, activeSection, setActiveSection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const sections = [
    {
      id: "courseReviews",
      title: "Course Reviews",
      icon: "MenuBook",
      content: "Browse and contribute to reviews of courses you've taken.",
    },
    {
      id: "experiences",
      title: "Experiences",
      icon: "EmojiEvents",
      content: "Share your internship, job, and research experiences with peers.",
    },
    {
      id: "courseResources",
      title: "Course Resources",
      icon: "Folder",
      content: "Access and share helpful resources for your courses.",
    },
    {
      id: "chat",
      title: "Chat",
      icon: "Chat",
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
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {/* First child: Section selection */}
              {React.Children.toArray(children)[0]}
            </Grid>
            <Grid item xs={12} md={8}>
              {/* Second child: Section content */}
              {React.Children.toArray(children)[1]}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;