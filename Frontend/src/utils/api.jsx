// src/utils/api.js - Updated with ResourceService
import axios from 'axios';

// Base URL from your Express server
const BASE_URL = 'http://localhost:4000';

// Create base API instance
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if user is logged in
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Course Review services
export const CourseReviewService = {
  // Get all reviews with optional filtering and sorting
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    return API.get(`/PeerBridge/course/reviews?${queryParams.toString()}`);
  },
  
  // Get reviews for a specific course
  getByCourse: (courseCode) => API.get(`/PeerBridge/course/reviews/course?course_code=${courseCode}`),
  
  // Add a new review
  add: (reviewData) => API.post('/PeerBridge/course/course', reviewData),
  
  // Toggle like on a review
  toggleLike: (reviewId) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return API.post(`/PeerBridge/course/reviews/${reviewId}/toggle-like`, {
      studentid: userData.studentid
    });
  },
  
  // Check if the current user has liked a review
  checkLiked: (reviewId) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return API.get(`/PeerBridge/course/reviews/${reviewId}/like-status?studentid=${userData.studentid}`);
  }
};

// Resource services
export const ResourceService = {
  // Get all resources with optional filtering
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Using either REST API or GraphQL based on what's implemented in the backend
    return API.get(`/PeerBridge/skills?${queryParams.toString()}`);
  },
  
  // Get resources by skill name
  getBySkill: (skillName) => API.get(`/PeerBridge/skills/${encodeURIComponent(skillName)}`),
  
  // Add a new resource
  add: (resourceData) => {
    // Using either REST API
    return API.post('/PeerBridge/skills/add', resourceData);
    
    // Alternatively, this could use GraphQL if that's how the backend is implemented
    // GraphQL implementation would be:
    /*
    return API.post('/graphql', {
      query: `
        mutation AddResource($input: ResourceInput!) {
          addSkill(
            skill_name: $input.skill_name, 
            description: $input.description, 
            category: $input.category, 
            resources: $input.resources, 
            tags: $input.tags
          ) {
            resource_id
            skill_name
            description
            category
            resources
            tags
            created_at
            updated_at
          }
        }
      `,
      variables: {
        input: resourceData
      }
    });
    */
  },
  
  // Update an existing resource (add resources or tags)
  update: (skillName, additionalData) => 
    API.put('/PeerBridge/skills/update', {
      skill_name: skillName,
      additional_resources: additionalData.resources,
      additional_tags: additionalData.tags
    }),
    
  // Bookmark a resource (assuming this functionality will be added later)
  toggleBookmark: (resourceId) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    return API.post(`/PeerBridge/skills/${resourceId}/bookmark`, {
      studentid: userData.studentid
    });
  }
};

// Authentication services
export const AuthService = {
  // Register a new user
  register: (userData) => {
    return API.post('/PeerBridge/users/signup', {
      studentid: userData.studentId,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      year: userData.year
    });
  },
  
  // Login existing user
  login: (credentials) => {
    return API.post('/PeerBridge/users/login', credentials);
  },
  
  // Logout user (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
};

export default API;