// src/components/RequestsPage.jsx
import React, { useState, useEffect } from 'react';
import './RequestsPage.css';

const RequestsPage = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      requestDate: '2025-01-11',
      companyName: 'Company A',
      carbonPrice: 500.25,
      carbonQuantity: 3.5,
      requestReason: 'Projected excess carbon credits for 2025',
      requestType: 'Sell',
      isSelected: false
    },
    {
      id: 2,
      requestDate: '2025-01-10',
      companyName: 'Company B',
      carbonPrice: 450.75,
      carbonQuantity: 5.0,
      requestReason: 'Immediate carbon credit needs',
      requestType: 'Buy',
      isSelected: false
    },
    {
      id: 3,
      requestDate: '2025-01-09',
      companyName: 'Company C',
      carbonPrice: 475.50,
      carbonQuantity: 2.8,
      requestReason: 'Strategic carbon reserve',
      requestType: 'Buy',
      isSelected: false
    }
  ]);

  const [selectedAll, setSelectedAll] = useState(false);

  const handleSelectAll = () => {
    setSelectedAll(!selectedAll);
    setRequests(requests.map(req => ({
      ...req,
      isSelected: !selectedAll
    })));
  };

  const handleSelect = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, isSelected: !req.isSelected } : req
    ));
  };

  const handleAccept = (ids) => {
    console.log('Accepting requests:', ids);
    // 在这里添加接受请求的逻辑
    alert('Selected requests have been accepted');
  };

  const handleReject = (ids) => {
    console.log('Rejecting requests:', ids);
    // 在这里添加拒绝请求的逻辑
    alert('Selected requests have been rejected');
  };

  useEffect(() => {
    const checkOverdueRequests = () => {
      const today = new Date();
      const overdueRequests = requests.filter(req => {
        const requestDate = new Date(req.requestDate);
        const diffTime = Math.abs(today - requestDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 7;
      });

      if (overdueRequests.length > 0) {
        alert(`You have ${overdueRequests.length} overdue requests!`);
      }
    };

    checkOverdueRequests();
  }, [requests]);

  const selectedRequests = requests.filter(req => req.isSelected);

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h2>Received Requests</h2>
        <div className="bulk-actions">
          <button
            className="bulk-action-button accept"
            disabled={selectedRequests.length === 0}
            onClick={() => handleAccept(selectedRequests.map(req => req.id))}
          >
            Accept Selected
          </button>
          <button
            className="bulk-action-button reject"
            disabled={selectedRequests.length === 0}
            onClick={() => handleReject(selectedRequests.map(req => req.id))}
          >
            Reject Selected
          </button>
        </div>
      </div>

      <div className="requests-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Date</th>
              <th>Company</th>
              <th>Type</th>
              <th>Price (SGD/Tonnes)</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={request.isSelected}
                    onChange={() => handleSelect(request.id)}
                  />
                </td>
                <td>{request.requestDate}</td>
                <td>{request.companyName}</td>
                <td>{request.requestType}</td>
                <td>{request.carbonPrice.toFixed(2)}</td>
                <td>{request.carbonQuantity}</td>
                <td>{request.requestReason}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button accept"
                      onClick={() => handleAccept([request.id])}
                    >
                      Accept
                    </button>
                    <button
                      className="action-button reject"
                      onClick={() => handleReject([request.id])}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsPage;