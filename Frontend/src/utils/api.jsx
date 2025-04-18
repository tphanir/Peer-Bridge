// src/utils/api.js
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