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

// Course services
export const CourseService = {
  // Get all courses
  getAll: () => API.get('/PeerBridge/course'),
  
  // Get course by ID
  getById: (id) => API.get(`/PeerBridge/course/${id}`),
  
  // Create new course
  create: (courseData) => API.post('/PeerBridge/course', courseData),
  
  // Update course
  update: (id, courseData) => API.put(`/PeerBridge/course/${id}`, courseData),
  
  // Delete course
  delete: (id) => API.delete(`/PeerBridge/course/${id}`),

  // Get course reviews
  getReviews: (courseId) => API.get(`/PeerBridge/course/${courseId}/reviews`),
  
  // Add review to course
  addReview: (courseId, reviewData) => API.post(`/PeerBridge/course/${courseId}/reviews`, reviewData)
};

// Experience services
export const ExperienceService = {
  // Get all experiences
  getAll: () => API.get('/PeerBridge/experience'),
  
  // Get experience by ID
  getById: (id) => API.get(`/PeerBridge/experience/${id}`),
  
  // Create new experience
  create: (experienceData) => API.post('/PeerBridge/experience', experienceData),
  
  // Update experience
  update: (id, experienceData) => API.put(`/PeerBridge/experience/${id}`, experienceData),
  
  // Delete experience
  delete: (id) => API.delete(`/PeerBridge/experience/${id}`),

  // Get user's experiences
  getUserExperiences: (userId) => API.get(`/PeerBridge/experience/user/${userId}`)
};

// Skills services
export const SkillService = {
  // Get all skills
  getAll: () => API.get('/PeerBridge/skills'),
  
  // Get skill by ID
  getById: (id) => API.get(`/PeerBridge/skills/${id}`),
  
  // Create new skill
  create: (skillData) => API.post('/PeerBridge/skills', skillData),
  
  // Update skill
  update: (id, skillData) => API.put(`/PeerBridge/skills/${id}`, skillData),
  
  // Delete skill
  delete: (id) => API.delete(`/PeerBridge/skills/${id}`),

  // Get skills by category
  getByCategory: (category) => API.get(`/PeerBridge/skills/category/${category}`)
};

// Chat services
export const ChatService = {
  // Get all messages
  getMessages: () => API.get('/PeerBridge/chat'),
  
  // Get conversation by ID
  getConversation: (conversationId) => API.get(`/PeerBridge/chat/${conversationId}`),
  
  // Send a message
  sendMessage: (messageData) => API.post('/PeerBridge/chat', messageData),
  
  // Get user's conversations
  getUserConversations: (userId) => API.get(`/PeerBridge/chat/user/${userId}`)
};

// GraphQL client for more complex data requirements
export const graphqlRequest = async (query, variables = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/graphql`,
      {
        query,
        variables
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      }
    );
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

export default API;