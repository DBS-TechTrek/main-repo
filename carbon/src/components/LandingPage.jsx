// src/components/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-brand">Carbon Credit Trading</div>
        <div className="nav-right">
          <span className="welcome-text">Welcome, {username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Carbon Credits</h2>
          <div className="balance">200</div>
          <p>Available Balance</p>
        </div>

        <div className="dashboard-card">
          <h2>Cash Balance</h2>
          <div className="balance">$150,000</div>
          <p>Available Funds</p>
        </div>

        <div className="requests-section">
          <h2>Outstanding Requests</h2>
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2025-01-11</td>
                  <td>Company A</td>
                  <td>Buy</td>
                  <td>50 Credits</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;