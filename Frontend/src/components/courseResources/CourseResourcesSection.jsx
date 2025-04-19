// src/components/courseResources/CourseResourcesSection.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  Alert,
  Grid
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Folder as FolderIcon
} from "@mui/icons-material";
import ResourceCard from "./ResourceCard";
import AddResourceModal from "./AddResourceModal";
import EmptyState from "../common/EmptyState";
import { ResourceService, AuthService } from "../../utils/api";

const CourseResourcesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openAddResource, setOpenAddResource] = useState(false);
  const [category, setCategory] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Fetch resources based on current filters
  const fetchResources = useCallback(async (reset = false) => {
    const currentPage = reset ? 1 : page;
    if (reset) {
      setPage(1);
    }
    
    setLoading(true);
    try {
      const response = await ResourceService.getAll({
        search: searchQuery,
        category: category !== 'all' ? category : '',
        page: currentPage,
        limit: 12
      });
      
      if (response.data && response.data.data) {
        if (reset || currentPage === 1) {
          setResources(response.data.data);
        } else {
          setResources(prev => [...prev, ...response.data.data]);
        }
        
        setHasMore(currentPage < response.data.pagination?.pages);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setSnackbar({
        open: true,
        message: 'Failed to load resources. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [page, category, searchQuery]);

  // Initial data fetch
  useEffect(() => {
    fetchResources(true);
  }, [category]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources(true);
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  
  // Handlers for add resource dialog
  const handleOpenAddResource = () => {
    if (!AuthService.isAuthenticated()) {
      setSnackbar({
        open: true,
        message: 'Please log in to add a resource',
        severity: 'warning'
      });
      return;
    }
    setOpenAddResource(true);
  };
  
  const handleCloseAddResource = () => {
    setOpenAddResource(false);
  };
  
  const handleResourceAdded = (newResource) => {
    // Add the new resource to the list
    setResources(prev => [newResource, ...prev]);
    setSnackbar({
      open: true,
      message: 'Your resource has been added successfully!',
      severity: 'success'
    });
  };
  
  // Load more resources
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  useEffect(() => {
    if (page > 1) {
      fetchResources();
    }
  }, [page, fetchResources]);
  
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
          placeholder="Search by skill or topic..."
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
              id="category-label"
              sx={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "14px",
              }}
            >
              Category
            </InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
              sx={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "14px",
              }}
            >
              <MenuItem value="all" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>All Categories</MenuItem>
              <MenuItem value="programming" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Programming</MenuItem>
              <MenuItem value="design" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Design</MenuItem>
              <MenuItem value="theory" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Theory</MenuItem>
              <MenuItem value="math" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Mathematics</MenuItem>
              <MenuItem value="other" sx={{ fontFamily: "'Libre Franklin', sans-serif" }}>Other</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddResource}
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
            Add Resource
          </Button>
        </Box>
      </Box>
      
      {loading && resources.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={40} sx={{ color: "#2c3e50" }} />
        </Box>
      ) : resources.length === 0 ? (
        searchQuery.trim() || category !== 'all' ? (
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: "center", 
              fontFamily: "'Libre Franklin', sans-serif",
              color: "#7f8c8d",
              my: 4 
            }}
          >
            No resources found with the current filters. Try different search terms or categories.
          </Typography>
        ) : (
          <EmptyState 
            title="No Course Resources Yet"
            message="Be the first to share a resource for your courses."
            actionText="Add Resource"
            icon={FolderIcon}
            onActionClick={handleOpenAddResource}
          />
        )
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {resources.map((resource) => (
              <ResourceCard key={resource.resource_id} resource={resource} />
            ))}
          </Box>
          
          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={handleLoadMore}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#2c3e50",
                  borderColor: "#2c3e50",
                  "&:hover": {
                    borderColor: "#1a2530",
                    backgroundColor: "rgba(44, 62, 80, 0.04)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#2c3e50" }} /> : "Load More"}
              </Button>
            </Box>
          )}
        </>
      )}
      
      {/* Add Resource Dialog */}
      <AddResourceModal 
        open={openAddResource} 
        handleClose={handleCloseAddResource}
        onResourceAdded={handleResourceAdded}
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

export default CourseResourcesSection;