// src/components/common/EmptyState.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const EmptyState = ({ 
  title = "No Data Found", 
  message = "There are no items to display at this time.", 
  actionText = "Add New",
  icon: Icon,
  showAction = true,
  onActionClick 
}) => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
        minHeight: '200px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: '8px',
        border: '1px dashed rgba(0, 0, 0, 0.1)',
      }}
    >
      {Icon && (
        <Icon 
          sx={{
            fontSize: 60,
            color: '#95a5a6',
            mb: 2,
            opacity: 0.7
          }}
        />
      )}
      
      <Typography
        variant="h6"
        sx={{
          fontFamily: "'Libre Baskerville', serif",
          fontWeight: 400,
          fontSize: "1.1rem",
          color: "#2c3e50",
          mb: 1,
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "15px",
          color: "#7f8c8d",
          maxWidth: '400px',
          mb: 3,
        }}
      >
        {message}
      </Typography>
      
      {showAction && onActionClick && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onActionClick}
          sx={{
            bgcolor: "#2c3e50",
            textTransform: "none",
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#1a2530",
            },
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;