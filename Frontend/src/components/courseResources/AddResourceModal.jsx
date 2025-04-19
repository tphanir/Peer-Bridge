// src/components/courseResources/AddResourceModal.jsx
import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
  FormHelperText,
  InputAdornment
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Link as LinkIcon,
  LocalOffer as TagIcon
} from "@mui/icons-material";
import { ResourceService, AuthService } from "../../utils/api";

const AddResourceModal = ({ open, handleClose, onResourceAdded }) => {
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [resources, setResources] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentResource, setCurrentResource] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    skillName: false,
    description: false,
    category: false,
    resources: false
  });

  const handleAddResource = () => {
    if (currentResource.trim()) {
      // Basic URL validation
      let url = currentResource.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      
      setResources([...resources, url]);
      setCurrentResource("");
      setErrors({ ...errors, resources: false });
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleDeleteResource = (resourceToDelete) => {
    setResources(resources.filter(resource => resource !== resourceToDelete));
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const resetForm = () => {
    setSkillName("");
    setDescription("");
    setCategory("");
    setResources([]);
    setTags([]);
    setCurrentResource("");
    setCurrentTag("");
    setErrors({
      skillName: false,
      description: false,
      category: false,
      resources: false
    });
  };

  const handleSubmit = async () => {
    // Validate form
    const newErrors = {
      skillName: !skillName.trim(),
      description: !description.trim(),
      category: !category,
      resources: resources.length === 0
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

      const response = await ResourceService.add({
        skill_name: skillName,
        description,
        category,
        resources,
        tags
      });

      if (response.data) {
        // Call the callback with the new resource data
        onResourceAdded(response.data);
        
        // Reset form and close dialog
        resetForm();
        handleClose();
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      // Set appropriate error message based on the error
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
          Add Course Resource
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
        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.skillName ? "#e74c3c" : "#2c3e50",
              mb: 1,
              display: 'block',
              fontWeight: 500
            }}
          >
            Skill or Topic Name *
          </Typography>
          <TextField
            placeholder="Enter skill or topic name"
            variant="outlined"
            fullWidth
            value={skillName}
            onChange={(e) => {
              setSkillName(e.target.value);
              if (e.target.value.trim()) {
                setErrors({ ...errors, skillName: false });
              }
            }}
            error={errors.skillName}
            helperText={errors.skillName ? "Please enter a skill or topic name" : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: errors.skillName ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
                },
                "&:hover fieldset": {
                  borderColor: errors.skillName ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.skillName ? "#e74c3c" : "#2c3e50",
                },
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "16px",
                color: "#2d3436",
                padding: "14px",
              },
              "& .MuiFormHelperText-root": {
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "12px",
                marginLeft: '12px',
              },
            }}
          />
        </Box>
        
        <FormControl 
          fullWidth 
          error={errors.category}
          sx={{ mb: 3 }}
        >
          <Typography
            component="label"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.category ? "#e74c3c" : "#2c3e50",
              mb: 1,
              display: 'block',
              fontWeight: 500
            }}
          >
            Category *
          </Typography>
          <Select
            displayEmpty
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrors({ ...errors, category: false });
            }}
            sx={{
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.category ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.category ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: errors.category ? "#e74c3c" : "#2c3e50",
              },
              "& .MuiSelect-select": {
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "16px",
                color: "#2d3436",
                padding: "14px",
              },
            }}
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: '#95a5a6', fontStyle: 'italic' }}>Select a category</span>;
              }
              return selected;
            }}
          >
            <MenuItem value="programming" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Programming</MenuItem>
            <MenuItem value="design" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Design</MenuItem>
            <MenuItem value="theory" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Theory</MenuItem>
            <MenuItem value="math" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Mathematics</MenuItem>
            <MenuItem value="other" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Other</MenuItem>
          </Select>
          {errors.category && (
            <FormHelperText sx={{ 
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "12px",
              marginLeft: '12px',
            }}>
              Please select a category
            </FormHelperText>
          )}
        </FormControl>
        
        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.description ? "#e74c3c" : "#2c3e50",
              mb: 1,
              display: 'block',
              fontWeight: 500
            }}
          >
            Description *
          </Typography>
          <TextField
            placeholder="Enter a description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.trim()) {
                setErrors({ ...errors, description: false });
              }
            }}
            error={errors.description}
            helperText={errors.description ? "Please provide a description" : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: errors.description ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
                },
                "&:hover fieldset": {
                  borderColor: errors.description ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.description ? "#e74c3c" : "#2c3e50",
                },
              },
              "& .MuiInputBase-input": {
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "15px",
                color: "#2d3436",
                lineHeight: 1.5,
                padding: "14px",
              },
              "& .MuiFormHelperText-root": {
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "12px",
                marginLeft: '12px',
              },
            }}
          />
        </Box>
   
        
        {/* Resource Links Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: errors.resources ? "#e74c3c" : "#95a5a6",
              mb: 1,
              display: 'block'
            }}
          >
            Resource Links *
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              placeholder="Add resource URL"
              variant="outlined"
              fullWidth
              value={currentResource}
              onChange={(e) => setCurrentResource(e.target.value)}
              error={errors.resources && resources.length === 0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && currentResource.trim()) {
                  e.preventDefault();
                  handleAddResource();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: errors.resources && resources.length === 0 ? "#e74c3c" : "rgba(0, 0, 0, 0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: errors.resources && resources.length === 0 ? "#e74c3c" : "rgba(0, 0, 0, 0.25)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.resources && resources.length === 0 ? "#e74c3c" : "#2c3e50",
                  },
                },
                "& .MuiInputBase-input": {
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "16px",
                  color: "#2d3436",
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon sx={{ 
                      color: errors.resources && resources.length === 0 ? "#e74c3c" : "#95a5a6", 
                      fontSize: "20px" 
                    }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={handleAddResource}
              variant="contained"
              disabled={!currentResource.trim()}
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
          
          {resources.length > 0 && (
            <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
              {resources.map((resource, index) => (
                <Chip
                  key={index}
                  icon={<LinkIcon />}
                  label={resource}
                  onDelete={() => handleDeleteResource(resource)}
                  sx={{
                    fontFamily: "'Libre Franklin', sans-serif",
                    fontSize: "14px",
                    maxWidth: '100%',
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }
                  }}
                />
              ))}
            </Stack>
          )}
          
          {errors.resources && resources.length === 0 && (
            <FormHelperText 
              error 
              sx={{ 
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "12px",
                marginLeft: '12px',
              }}
            >
              Please add at least one resource link
            </FormHelperText>
          )}
        </Box>
        
        {/* Tags Section (Optional) */}
        <Box sx={{ mb: 3 }}>
          <Typography
            component="label"
            sx={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              color: "#95a5a6",
              mb: 1,
              display: 'block'
            }}
          >
            Tags (Optional)
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              placeholder="Add tags"
              variant="outlined"
              fullWidth
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && currentTag.trim()) {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              sx={{
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
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: "16px",
                  color: "#2d3436",
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TagIcon sx={{ 
                      color: "#95a5a6", 
                      fontSize: "20px" 
                    }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={handleAddTag}
              variant="contained"
              disabled={!currentTag.trim()}
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
          
          {tags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  sx={{
                    fontFamily: "'Libre Franklin', sans-serif",
                    fontSize: "14px",
                    mb: 0.5
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>
        
        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "14px",
            color: "#7f8c8d",
            fontStyle: "italic",
          }}
        >
          Your shared resources will help other students succeed in their courses.
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
            "Submit Resource"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddResourceModal;