// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import RequestsPage from './components/RequestsPage';
import DataPage from './components/DataPage';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/DataPage" element={<DataPage />} />
        
      DataPage
        <Route path="/login" element={isLoggedIn ? <Navigate to="/landing" /> : <Login />} />
        
        <Route element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Route>

        <Route path="/" element={<Navigate to={isLoggedIn ? "/landing" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;