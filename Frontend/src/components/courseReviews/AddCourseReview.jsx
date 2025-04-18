// src/components/courseReviews/AddCourseReview.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  CircularProgress,
  Rating,
  FormControl,
  FormHelperText,
  Chip,
  Stack,
} from "@mui/material";
import { Close as CloseIcon, Star as StarIcon, Add as AddIcon } from "@mui/icons-material";
import { CourseReviewService, AuthService } from "../../utils/api";

const AddCourseReview = ({ open, handleClose, onReviewAdded }) => {
  const [courseInfo, setCourseInfo] = useState({ name: "", code: "" });
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [instructorInput, setInstructorInput] = useState("");
  const [semester, setSemester] = useState("");
  const [tips, setTips] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errors, setErrors] = useState({
    course: false,
    review: false,
    rating: false,
    semester: false,
    instructors: false,
  });

  // Fetch courses for autocomplete
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        // In a production app, you would fetch from API
        // For now, we'll use sample data
        setTimeout(() => {
          const sampleCourses = [
            { name: "Data Structures and Algorithms", code: "CS2001" },
            { name: "Computer Networks", code: "CS3003" },
            { name: "Database Management Systems", code: "CS3004" },
            { name: "Machine Learning", code: "CS4001" },
            { name: "Artificial Intelligence", code: "CS4002" },
            { name: "Operating Systems", code: "CS3001" },
            { name: "Web Development", code: "CS3008" },
            { name: "Software Engineering", code: "CS3009" },
            { name: "Python Programming", code: "CS2002" },
            { name: "Discrete Mathematics", code: "MA2001" },
          ];
          setCourseOptions(sampleCourses);
          setLoadingCourses(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoadingCourses(false);
      }
    };
    
    if (open) {
      fetchCourses();
    }
  }, [open]);
  
  // Add instructor to the list
  const handleAddInstructor = () => {
    if (instructorInput.trim()) {
      setInstructors([...instructors, instructorInput.trim()]);
      setInstructorInput("");
      setErrors({ ...errors, instructors: false });
    }
  };
  
  // Remove instructor from the list
  const handleDeleteInstructor = (instructorToDelete) => {
    setInstructors(instructors.filter(instructor => instructor !== instructorToDelete));
  };
  
  const handleSubmit = async () => {
    // Validate form
    const newErrors = {
      course: !courseInfo.name || !courseInfo.code,
      review: !reviewContent.trim(),
      rating: rating === 0,
      semester: !semester.trim(),
      instructors: instructors.length === 0,
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }
    
    setLoading(true);
    
    try {
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser || !currentUser.studentid) {
        throw new Error("User not authenticated");
      }
      
      const response = await CourseReviewService.add({
        courseName: courseInfo.name,
        courseCode: courseInfo.code,
        instructorNames: instructors,
        institution: "Delhi Technical University", // You might want to get this from user context
        semester: semester,
        studentid: currentUser.studentid,
        rating: rating,
        reviewContent: reviewContent,
        tips: tips
      });
      
      if (response.data && response.data.data) {
        // Call the callback with the new review data
        onReviewAdded(response.data.data);
        
        // Reset form and close dialog
        setCourseInfo({ name: "", code: "" });
        setReviewContent("");
        setRating(0);
        setInstructors([]);
        setInstructorInput("");
        setSemester("");
        setTips("");
        handleClose();
      }
    } catch (error) {
      console.error("Error adding review:", error);
      // Error handling would happen here - for this example, we'll just log it
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ position: "relative", p: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            color: "#2c3e50",
          }}
        >
          Add Course Review
        </Typography>
        
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#95a5a6",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Autocomplete
          id="course-select"
          options={courseOptions}
          loading={loadingCourses}
          getOptionLabel={(option) => `${option.name} (${option.code})`}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          onChange={(event, newValue) => {
            setCourseInfo(newValue || { name: "", code: "" });
            if (newValue) {
              setErrors({ ...errors, course: false });
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Course"
              variant="outlined"
              error={errors.course}
              helperText={errors.course ? "Please select a course" : ""}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCourses ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: errors.course ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: errors.course ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.course ? "#e74c3c" : "#2c3e50",
                  },
                },
                "& .MuiInputBase-input": {
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "16px",
                  color: "#2d3436",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: "15px",
                  color: errors.course ? "#e74c3c" : "#95a5a6",
                },
                "& .MuiFormHelperText-root": {
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: "12px",
                  marginLeft: '12px',
                },
              }}
            />
          )}
        />
        
        {/* Semester Field */}
        <TextField
          label="Semester"
          variant="outlined"
          fullWidth
          value={semester}
          onChange={(e) => {
            setSemester(e.target.value);
            if (e.target.value.trim()) {
              setErrors({ ...errors, semester: false });
            }
          }}
          error={errors.semester}
          helperText={errors.semester ? "Please enter the semester (e.g., Fall 2024)" : ""}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: errors.semester ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
              },
              "&:hover fieldset": {
                borderColor: errors.semester ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
              },
              "&.Mui-focused fieldset": {
                borderColor: errors.semester ? "#e74c3c" : "#2c3e50",
              },
            },
            "& .MuiInputBase-input": {
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "16px",
              color: "#2d3436",
            },
            "& .MuiInputLabel-root": {
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.semester ? "#e74c3c" : "#95a5a6",
            },
            "& .MuiFormHelperText-root": {
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "12px",
              marginLeft: '12px',
            },
          }}
        />
        
        {/* Instructors Field */}
        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.instructors ? "#e74c3c" : "#95a5a6",
              mb: 1,
              display: 'block'
            }}
          >
            Instructors *
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              placeholder="Add instructor name"
              variant="outlined"
              fullWidth
              value={instructorInput}
              onChange={(e) => setInstructorInput(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: errors.instructors ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: errors.instructors ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.instructors ? "#e74c3c" : "#2c3e50",
                  },
                },
                "& .MuiInputBase-input": {
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "16px",
                  color: "#2d3436",
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && instructorInput.trim()) {
                  e.preventDefault();
                  handleAddInstructor();
                }
              }}
            />
            <Button
              onClick={handleAddInstructor}
              variant="contained"
              disabled={!instructorInput.trim()}
              sx={{
                bgcolor: "#2c3e50",
                ml: 1,
                height: '56px',  // Match the height of TextField
                minWidth: '56px',
                "&:hover": {
                  bgcolor: "#1a2530",
                },
              }}
            >
              <AddIcon />
            </Button>
          </Box>
          
          {instructors.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {instructors.map((instructor, index) => (
                <Chip
                  key={index}
                  label={instructor}
                  onDelete={() => handleDeleteInstructor(instructor)}
                  sx={{
                    fontFamily: "'Libre Franklin', sans-serif",
                    fontSize: "14px",
                    mb: 0.5
                  }}
                />
              ))}
            </Stack>
          )}
          
          {errors.instructors && (
            <FormHelperText 
              error 
              sx={{ 
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "12px",
                marginLeft: '12px',
              }}
            >
              Please add at least one instructor
            </FormHelperText>
          )}
        </Box>
        
        <FormControl error={errors.rating} fullWidth sx={{ mb: 3 }}>
          <Typography
            component="legend"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.rating ? "#e74c3c" : "#95a5a6",
              mb: 1,
            }}
          >
            Course Rating *
          </Typography>
          <Rating
            name="course-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
              if (newValue > 0) {
                setErrors({ ...errors, rating: false });
              }
            }}
            precision={0.5}
            size="large"
            sx={{ color: errors.rating ? "#e74c3c" : "#f39c12" }}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {errors.rating && (
            <FormHelperText sx={{ 
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "12px",
              marginLeft: '12px',
            }}>
              Please rate the course
            </FormHelperText>
          )}
        </FormControl>
        
        <TextField
          label="Your Review"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={reviewContent}
          onChange={(e) => {
            setReviewContent(e.target.value);
            if (e.target.value.trim()) {
              setErrors({ ...errors, review: false });
            }
          }}
          error={errors.review}
          helperText={errors.review ? "Please enter your review" : ""}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: errors.review ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
              },
              "&:hover fieldset": {
                borderColor: errors.review ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
              },
              "&.Mui-focused fieldset": {
                borderColor: errors.review ? "#e74c3c" : "#2c3e50",
              },
            },
            "& .MuiInputBase-input": {
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: "#2d3436",
              lineHeight: 1.5,
            },
            "& .MuiInputLabel-root": {
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.review ? "#e74c3c" : "#95a5a6",
            },
            "& .MuiFormHelperText-root": {
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "12px",
              marginLeft: '12px',
            },
          }}
        />
        
        {/* Tips Field (Optional) */}
        <TextField
          label="Tips for Future Students (Optional)"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={tips}
          onChange={(e) => setTips(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
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
              color: "#2d3436",
              lineHeight: 1.5,
            },
            "& .MuiInputLabel-root": {
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: "#95a5a6",
            },
          }}
        />
        
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "14px",
            color: "#7f8c8d",
            fontStyle: "italic",
          }}
        >
          Your review will be shared with the PeerBridge community to help other students.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            color: "#7f8c8d",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          sx={{
            textTransform: "none",
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            bgcolor: "#2c3e50",
            color: "white",
            "&:hover": {
              bgcolor: "#1a2530",
            },
            ml: 2,
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Submit Review"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseReview;