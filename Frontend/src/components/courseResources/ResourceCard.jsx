// src/components/courseResources/ResourceCard.jsx
import React, { useState } from "react";
import { 
  Paper, 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip,
  Collapse,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Link as LinkIcon,
  LocalOffer as TagIcon,
  Category as CategoryIcon
} from "@mui/icons-material";

const ResourceCard = ({ resource }) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  // Make sure resource has all the fields we expect
  const {
    skill_name = '',
    description = '',
    category = '',
    resources = [],
    tags = []
  } = resource || {};
  
  // Parse resources and tags if they're stored as strings
  const parsedResources = Array.isArray(resources) 
    ? resources 
    : (typeof resources === 'string' ? JSON.parse(resources || '[]') : []);
    
  const parsedTags = Array.isArray(tags) 
    ? tags 
    : (typeof tags === 'string' ? JSON.parse(tags || '[]') : []);
  
  // Get category color
  const getCategoryColor = (category) => {
    const categoryColors = {
      programming: "#3498db",
      design: "#9b59b6",
      theory: "#2ecc71",
      math: "#e74c3c",
      other: "#f39c12"
    };
    
    return categoryColors[category?.toLowerCase()] || "#95a5a6";
  };
  
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "8px",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-3px)",
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Tooltip title={category} placement="top">
          <Chip
            icon={<CategoryIcon sx={{ fontSize: 16 }} />}
            label={category}
            size="small"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              bgcolor: `${getCategoryColor(category)}20`,
              color: getCategoryColor(category),
              fontWeight: 500,
              fontSize: "0.75rem",
              height: "24px",
              mb: 1,
            }}
          />
        </Tooltip>
      </Box>
      
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'Libre Baskerville', serif",
          fontWeight: 400,
          fontSize: "1.1rem",
          color: "#2c3e50",
          mb: 1,
          flexGrow: 0,
        }}
      >
        {skill_name}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "0.875rem",
          color: "#34495e",
          mb: 2,
          flexGrow: 1,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {description}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
        {parsedTags && parsedTags.slice(0, 3).map((tag, index) => (
          <Chip
            key={index}
            icon={<TagIcon sx={{ fontSize: 14 }} />}
            label={tag}
            size="small"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "0.75rem",
              bgcolor: "rgba(44, 62, 80, 0.08)",
              color: "#7f8c8d",
              height: "22px",
            }}
          />
        ))}
        {parsedTags && parsedTags.length > 3 && (
          <Chip
            label={`+${parsedTags.length - 3} more`}
            size="small"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "0.75rem",
              bgcolor: "rgba(44, 62, 80, 0.04)",
              color: "#95a5a6",
              height: "22px",
            }}
          />
        )}
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          borderTop: '1px solid rgba(0,0,0,0.08)',
          pt: 1 
        }}
      >
        <Button
          onClick={handleExpandClick}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "0.75rem",
            textTransform: 'none',
            color: '#2c3e50',
          }}
        >
          {expanded ? 'Show Less' : `View Resources (${parsedResources?.length || 0})`}
        </Button>
      </Box>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List dense>
          {parsedResources && parsedResources.map((resource, index) => (
            <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LinkIcon sx={{ fontSize: 18, color: '#3498db' }} />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Link 
                    href={resource} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{
                      fontFamily: "'Libre Franklin', sans-serif",
                      fontSize: "0.875rem",
                      color: '#3498db',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {getResourceName(resource)}
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

// Helper function to extract a readable name from a URL
const getResourceName = (url) => {
  try {
    // Try to extract something readable from the URL
    const urlObj = new URL(url);
    
    // Remove common prefixes
    let path = urlObj.pathname
      .replace(/\.(html|pdf|doc|docx|ppt|pptx)$/, '')
      .replace(/^\//, '')
      .replace(/\/$/, '');
    
    // If it's a YouTube link, try to get the video title
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      return 'YouTube Video';
    }
    
    // For GitHub links, extract repo name
    if (urlObj.hostname.includes('github.com')) {
      path = path.split('/').filter(Boolean).slice(1).join('/');
      return `GitHub: ${path}`;
    }
    
    // If the path is empty or just '/', use the hostname
    if (!path) {
      return urlObj.hostname.replace(/^www\./, '');
    }
    
    // Replace dashes and underscores with spaces and capitalize
    const formattedPath = path
      .split('/')
      .pop()
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    return formattedPath || 'Resource Link';
  } catch (e) {
    // If it's not a valid URL, just return the string
    return url.slice(0, 30) + (url.length > 30 ? '...' : '');
  }
};

// Add a Button component at the top since it's used in the component
import { Button } from "@mui/material";

export default ResourceCard;