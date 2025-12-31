import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ResourceBrowser from './pages/ResourceBrowser/ResourceBrowser';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Resource Routes - All using the same component */}
        <Route path="/homework" element={<ResourceBrowser />} />
        <Route path="/proposal" element={<ResourceBrowser />} />
        <Route path="/midterm" element={<ResourceBrowser />} />
        <Route path="/thesis" element={<ResourceBrowser />} />
        <Route path="/message-board" element={<ResourceBrowser />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
