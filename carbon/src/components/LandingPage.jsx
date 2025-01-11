// src/components/LandingPage.jsx
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import axios from 'axios';

const LandingPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('user');
  const [balances, setBalances] = useState({ carbonBalance: 0, cashBalance: 0 });
  const [requests, setRequests] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };


  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await axios.get('/api/user/balances');
        setBalances(response.data);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchBalances();
    fetchRequests();
  }, []);


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
          <div className="balance">{balances.carbonBalance}</div>
          <p>Available Balance</p>
        </div>

        <div className="dashboard-card">
          <h2>Cash Balance</h2>
          <div className="balance">${balances.cashBalance}</div>
          <p>Available Funds</p>
        </div>

        <div className="requests-section">
          <h2>Outstanding Requests</h2>
          <div className="requests-table">
            {requests.length === 0 ? (
              <p>No outstanding requests.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.requestDate}</td>
                      <td>{req.companyName}</td>
                      <td>{req.requestType}</td>
                      <td>{req.carbonQuantity} Credits</td>
                      <td>{req.requestReason}</td>
                      <td>{req.requestStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;