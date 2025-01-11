// src/components/Layout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const username = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <nav className="main-nav">
        <div className="nav-left">
          <div className="nav-brand">Carbon Credit Trading</div>
          <div className="nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }>
              Dashboard
            </NavLink>
            <NavLink to="/requests" className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }>
              Requests
            </NavLink>
          </div>
        </div>
        <div className="nav-right">
          <span className="welcome-text">Welcome, {username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;