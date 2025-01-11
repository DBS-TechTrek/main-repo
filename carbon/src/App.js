// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import RequestsPage from './components/RequestsPage';
import Dataframe from './components/dataframe';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';


  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/landing" /> : <Login />} />
        <Route path="/dataframe" element={<Dataframe />} /> {/* Public Route for Data Page */}

        {/* Protected Routes (Requires Authentication) */}
        <Route element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/landing" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;