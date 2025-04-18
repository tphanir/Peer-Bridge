// src/components/courseReviews/CourseReviewsSection.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  CircularProgress, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  MenuBook as MenuBookIcon,
  Sort as SortIcon
} from "@mui/icons-material";
import CourseReviewCard from "./CourseReviewCard";
import AddCourseReview from "./AddCourseReview";
import EmptyState from "../common/EmptyState";
import { CourseReviewService, AuthService } from "../../utils/api";

const CourseReviewsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openAddReview, setOpenAddReview] = useState(false);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalReviews, setTotalReviews] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const observer = useRef();
  
  // Map frontend sort fields to backend field names
  const mapSortField = (frontendField) => {
    const fieldMap = {
      'date': 'updated_at',
      'rating': 'experience_rating',
      'likes': 'likes_count'
    };
    return fieldMap[frontendField] || 'updated_at';
  };

  // Fetch reviews based on current filters
  const fetchReviews = useCallback(async (reset = false) => {
    const currentPage = reset ? 1 : page;
    if (reset) {
      setPage(1);
    }
    
    setLoading(true);
    try {
      const response = await CourseReviewService.getAll({
        search: searchQuery,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: currentPage,
        limit: 10
      });
      
      if (response.data && response.data.data) {
        if (reset || currentPage === 1) {
          setReviews(response.data.data);
        } else {
          setReviews(prev => [...prev, ...response.data.data]);
        }
        
        setTotalReviews(response.data.pagination.total);
        setHasMore(currentPage < response.data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching course reviews:", error);
      setSnackbar({
        open: true,
        message: 'Failed to load reviews. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, searchQuery]);

  // Initial data fetch
  useEffect(() => {
    fetchReviews(true);
  }, [sortBy, sortOrder]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchReviews(true);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
  
  // Handle sort order change
  const handleSortOrderChange = () => {
    setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc');
  };
  
  // Handlers for add review dialog
  const handleOpenAddReview = () => {
    if (!AuthService.isAuthenticated()) {
      setSnackbar({
        open: true,
        message: 'Please log in to add a review',
        severity: 'warning'
      });
      return;
    }
    setOpenAddReview(true);
  };
  
  const handleCloseAddReview = () => {
    setOpenAddReview(false);
  };
  
  const handleReviewAdded = (newReview) => {
    // Add the new review to the top of the list
    setReviews(prev => [newReview, ...prev]);
    setSnackbar({
      open: true,
      message: 'Your review has been added successfully!',
      severity: 'success'
    });
  };

  // Handle like functionality
  const handleLikeToggle = async (reviewId) => {
    if (!AuthService.isAuthenticated()) {
      setSnackbar({
        open: true,
        message: 'Please log in to like reviews',
        severity: 'warning'
      });
      return;
    }
    
    try {
      const response = await CourseReviewService.toggleLike(reviewId);
      if (response.data) {
        // Update the review in the list
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === reviewId 
              ? { 
                  ...review, 
                  liked: response.data.liked,
                  likeCount: response.data.likeCount
                }
              : review
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setSnackbar({
        open: true,
        message: 'Failed to process your like. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Intersection observer for infinite scrolling
  const lastReviewElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // Load more reviews when page changes
  useEffect(() => {
    if (page > 1) {
      fetchReviews();
    }
  }, [page, fetchReviews]);
  
  // Check if reviews are liked by current user
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!AuthService.isAuthenticated() || reviews.length === 0) return;
      
      try {
        const user = AuthService.getCurrentUser();
        if (!user || !user.studentid) return;
        
        // Create an array to hold reviews with updated like status
        const updatedReviews = [...reviews];
        
        // For each review, check if the current user has liked it
        for (let i = 0; i < updatedReviews.length; i++) {
          try {
            const response = await CourseReviewService.checkLiked(updatedReviews[i].id);
            if (response.data && response.data.liked !== undefined) {
              updatedReviews[i] = {
                ...updatedReviews[i],
                liked: response.data.liked
              };
            }
          } catch (err) {
            console.error(`Failed to check like status for review ${updatedReviews[i].id}:`, err);
          }
        }
        
        // Update the reviews state with the new like status information
        setReviews(updatedReviews);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    
    checkLikeStatus();
  }, [reviews.length]); // Only run when the number of reviews changes
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Box>
      <Box 
        component="form" 
        onInput={handleSearch}
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexDirection: { xs: "column", sm: "row" }
        }}
      >
        <TextField
          placeholder="Search by course name or code..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              "& fieldset": {
                borderColor: "rgba(0, 0, 0, 0.12)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0, 0, 0, 0.25)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2c3e50",
              },
            },
            "& .MuiInputBase-input": {
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              padding: "12px 14px",
              color: "#2d3436",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#95a5a6" }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 120,
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              }
            }}
          >
            <InputLabel 
              id="sort-by-label"
              sx={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "14px",
              }}
            >
              Sort By
            </InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              sx={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "14px",
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon sx={{ fontSize: 18, color: "#95a5a6" }} />
                </InputAdornment>
              }
            >
              <MenuItem value="updated_at" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Date</MenuItem>
              <MenuItem value="experience_rating" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Rating</MenuItem>
              <MenuItem value="likes_count" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Likes</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddReview}
            sx={{
              bgcolor: "#2c3e50",
              textTransform: "none",
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              padding: "8px 16px",
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "#1a2530",
              },
            }}
          >
            Add Review
          </Button>
        </Box>
      </Box>
      
      {loading && reviews.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={40} sx={{ color: "#2c3e50" }} />
        </Box>
      ) : reviews.length === 0 ? (
        searchQuery.trim() ? (
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: "center", 
              fontFamily: "'Libre Franklin', sans-serif",
              color: "#7f8c8d",
              my: 4 
            }}
          >
            No reviews found for "{searchQuery}". Try a different search term.
          </Typography>
        ) : (
          <EmptyState 
            title="No Course Reviews Yet"
            message="Be the first to add a review for a course you've taken."
            actionText="Add Course Review"
            icon={MenuBookIcon}
            onActionClick={handleOpenAddReview}
          />
        )
      ) : (
        <Box sx={{ maxHeight: "600px", overflow: "auto", pr: 1 }}>
          {reviews.map((review, index) => {
            if (index === reviews.length - 1) {
              return (
                <Box ref={lastReviewElementRef} key={review.id}>
                  <CourseReviewCard 
                    review={review}
                    onLikeToggle={() => handleLikeToggle(review.id)}
                  />
                </Box>
              );
            } else {
              return (
                <CourseReviewCard 
                  key={review.id} 
                  review={review}
                  onLikeToggle={() => handleLikeToggle(review.id)}
                />
              );
            }
          })}
          
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={30} sx={{ color: "#2c3e50" }} />
            </Box>
          )}
        </Box>
      )}
      
      {/* Add Review Dialog */}
      <AddCourseReview 
        open={openAddReview} 
        handleClose={handleCloseAddReview}
        onReviewAdded={handleReviewAdded}
      />
      
      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseReviewsSection;