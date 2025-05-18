// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Yonetim from './pages/Yonetim';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/privateRoute'; // Yeni dosyayı dahil et

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="user">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/yonetim"
          element={
            <PrivateRoute>
              <Yonetim />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
