// src/components/courseReviews/CourseReviewCard.jsx
import React, { useState } from "react";
import { 
  Paper, 
  Box, 
  Typography, 
  Chip, 
  Divider, 
  IconButton, 
  Rating,
  Tooltip
} from "@mui/material";
import { 
  CalendarToday as CalendarIcon, 
  Person as PersonIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  School as SchoolIcon
} from "@mui/icons-material";

const CourseReviewCard = ({ review, onLikeToggle }) => {
  const [liked, setLiked] = useState(review.liked || false);
  const [likeCount, setLikeCount] = useState(review.likeCount || 0);
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleLikeClick = () => {
    // Call the parent handler to update the like in the database
    if (onLikeToggle) {
      onLikeToggle();
    }
    
    // Update local state for immediate UI feedback
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 2.5,
        borderRadius: "8px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: 1.5, justifyContent: "space-between" }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Libre Baskerville', serif",
              fontWeight: 400,
              fontSize: "1.1rem",
              color: "#2c3e50",
              mb: 0.5,
            }}
          >
            {review.courseName}
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Chip
              label={review.courseCode}
              size="small"
              sx={{
                fontFamily: "'Libre Franklin', sans-serif",
                bgcolor: "rgba(44, 62, 80, 0.08)",
                color: "#2c3e50",
                fontWeight: 500,
                fontSize: "0.75rem",
                height: "24px",
                mr: 1.5,
              }}
            />
            
            {/* Course rating display */}
            <Rating 
              value={typeof review.rating === 'number' ? review.rating : 0} 
              precision={0.5} 
              readOnly 
              size="small"
              sx={{ color: "#f39c12" }}
            />
          </Box>
          
          {/* Display instructors */}
          {review.instructorNames && Array.isArray(review.instructorNames) && review.instructorNames.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <SchoolIcon sx={{ fontSize: 16, color: "#95a5a6", mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: "0.875rem",
                  color: "#7f8c8d",
                }}
              >
                {review.instructorNames.join(', ')}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 1, sm: 0 } }}>
          <PersonIcon sx={{ fontSize: 16, color: "#95a5a6", mr: 0.5 }} />
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "0.875rem",
              color: "#7f8c8d",
              mr: 2,
            }}
          >
            {review.studentName}
          </Typography>
          
          <CalendarIcon sx={{ fontSize: 16, color: "#95a5a6", mr: 0.5 }} />
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "0.875rem",
              color: "#7f8c8d",
            }}
          >
            {formatDate(review.updatedAt)}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1.5 }} />
      
      <Typography
        variant="body1"
        sx={{
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "15px",
          color: "#34495e",
          lineHeight: 1.6,
          mb: 2,
        }}
      >
        {review.reviewContent}
      </Typography>
      
      {/* Display tips if available */}
      {review.tips && (
        <Box 
          sx={{ 
            bgcolor: "rgba(52, 152, 219, 0.05)", 
            p: 2, 
            borderRadius: "4px",
            mb: 2,
            border: "1px solid rgba(52, 152, 219, 0.2)"
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#3498db",
              mb: 0.5,
            }}
          >
            Tips for Future Students:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "14px",
              color: "#34495e",
              fontStyle: "italic",
            }}
          >
            {review.tips}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Tooltip title={liked ? "Unlike" : "Like"}>
          <IconButton 
            onClick={handleLikeClick} 
            size="small" 
            sx={{ color: liked ? "#3498db" : "#95a5a6" }}
          >
            {liked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "0.75rem",
            color: "#7f8c8d",
            ml: 0.5,
          }}
        >
          {likeCount}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CourseReviewCard;