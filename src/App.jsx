import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ResourceBrowser from './pages/ResourceBrowser/ResourceBrowser';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Resource Routes - All using the same component */}
        <Route path="/homework" element={
          <ProtectedRoute>
            <ResourceBrowser />
          </ProtectedRoute>
        } />
        <Route path="/proposal" element={
          <ProtectedRoute>
            <ResourceBrowser />
          </ProtectedRoute>
        } />
        <Route path="/midterm" element={
          <ProtectedRoute>
            <ResourceBrowser />
          </ProtectedRoute>
        } />
        <Route path="/thesis" element={
          <ProtectedRoute>
            <ResourceBrowser />
          </ProtectedRoute>
        } />
        <Route path="/message-board" element={
          <ProtectedRoute>
            <ResourceBrowser />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
