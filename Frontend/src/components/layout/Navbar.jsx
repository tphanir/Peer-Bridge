// src/components/layout/Navbar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  MenuBook as CourseReviewsIcon,
  EmojiEvents as ExperiencesIcon,
  Folder as ResourcesIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const iconComponents = {
  MenuBook: CourseReviewsIcon,
  EmojiEvents: ExperiencesIcon,
  Folder: ResourcesIcon,
  Chat: ChatIcon,
};

const Navbar = ({ 
  activeSection, 
  sections, 
  handleSectionChange, 
  handleDrawerToggle,
  isMobile 
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  }

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        bgcolor: "#ffffff", 
        borderBottom: "1px solid rgba(0,0,0,0.08)", 
        color: "#2c3e50",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          Peer Bridge
        </Typography>
        
        {!isMobile && (
          <Box sx={{ display: "flex" }}>
            {sections.map((section) => {
              const IconComponent = iconComponents[section.icon];
              
              return (
                <Button
                  key={section.id}
                  startIcon={<IconComponent />}
                  onClick={() => handleSectionChange(section.id)}
                  sx={{
                    mx: 1,
                    textTransform: "none",
                    color: activeSection === section.id ? "#2c3e50" : "#7f8c8d",
                    borderBottom: activeSection === section.id ? "2px solid #2c3e50" : "none",
                    borderRadius: 0,
                    fontFamily: "'Libre Franklin', sans-serif",
                    fontSize: "15px",
                    fontWeight: activeSection === section.id ? 500 : 400,
                    padding: "6px 12px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#2c3e50",
                    },
                  }}
                >
                  {section.title}
                </Button>
              );
            })}
            
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{ ml: 2 }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;