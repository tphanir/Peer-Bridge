// src/components/layout/MobileDrawer.jsx
import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import {
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

const MobileDrawer = ({ 
  sections, 
  activeSection, 
  mobileOpen, 
  handleDrawerToggle, 
  handleSectionChange 
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    
  };

  const drawerContent = (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h5"
        sx={{
          my: 2,
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          color: "#2c3e50",
        }}
      >
        Peer Bridge
      </Typography>
      <Divider />
      <List>
        {sections.map((section) => {
          const IconComponent = iconComponents[section.icon];
          
          return (
            <ListItem 
              button 
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              sx={{
                bgcolor: activeSection === section.id ? "rgba(44, 62, 80, 0.08)" : "transparent",
                "&:hover": {
                  bgcolor: "rgba(44, 62, 80, 0.12)",
                },
              }}
            >
              <Box sx={{ mr: 2, color: "#2c3e50" }}>
                <IconComponent />
              </Box>
              <ListItemText 
                primary={section.title} 
                primaryTypographyProps={{
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#2c3e50",
                }}
              />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Button
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          my: 2,
          color: "#2c3e50",
          textTransform: "none",
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "15px",
          fontWeight: 400,
        }}
      >
        Sign Out
      </Button>
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default MobileDrawer;