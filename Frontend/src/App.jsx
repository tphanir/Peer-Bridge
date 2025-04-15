// src/App.jsx with Protected Routes
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      {/* Redirect any unknown routes to Home if authenticated, or Login if not */}
      <Route 
        path="*" 
        element={
          localStorage.getItem('token') ? 
            <Navigate to="/home" /> : 
            <Navigate to="/" />
        } 
      />
    </Routes>
  );
}

export default App;