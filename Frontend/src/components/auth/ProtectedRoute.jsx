// src/components/auth/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * A wrapper component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated by looking for token in localStorage
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  // Redirect to login if not authenticated, otherwise render the children
  if (!isAuthenticated()) {
    // Pass the current location to redirect back after login (optional enhancement)
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;