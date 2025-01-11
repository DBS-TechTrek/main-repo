import React, { useState, useEffect } from "react";
import axios from "axios";

const RequestsReceived = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);

  useEffect(() => {
    // Fetch the requests from the backend API
    const fetchRequests = async () => {
      try {
        const response = await axios.get("/api/requests/received");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleSelectRequest = (id) => {
    setSelectedRequests((prev) =>
      prev.includes(id) ? prev.filter((reqId) => reqId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    try {
      await axios.post(`/api/requests/${action}`, { ids: selectedRequests });
      setRequests((prev) => prev.filter((req) => !selectedRequests.includes(req.id)));
      setSelectedRequests([]);
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
    } catch (error) {
      console.error(`Error during bulk ${action}:`, error);
    }
  };

  const handleOverdueAlert = (requestDate) => {
    const requestAge = (new Date() - new Date(requestDate)) / (1000 * 60 * 60 * 24);
    return requestAge > 7 ? "Overdue Request" : null;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Requests Received</h1>

      {requests.length === 0 ? (
        <p>No requests received.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Select</th>
              <th className="border border-gray-300 p-2">Requestor</th>
              <th className="border border-gray-300 p-2">Carbon Price (SGD/Tonnes)</th>
              <th className="border border-gray-300 p-2">Carbon Quantity</th>
              <th className="border border-gray-300 p-2">Request Type</th>
              <th className="border border-gray-300 p-2">Reason</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Alert</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(req.id)}
                    onChange={() => handleSelectRequest(req.id)}
                  />
                </td>
                <td className="border border-gray-300 p-2">{req.requestorCompanyName}</td>
                <td className="border border-gray-300 p-2">{req.carbonUnitPrice}</td>
                <td className="border border-gray-300 p-2">{req.carbonQuantity}</td>
                <td className="border border-gray-300 p-2">{req.requestType}</td>
                <td className="border border-gray-300 p-2">{req.requestReason}</td>
                <td className="border border-gray-300 p-2">{req.requestDate}</td>
                <td className="border border-gray-300 p-2">
                  {handleOverdueAlert(req.requestDate) && (
                    <span className="text-red-500 font-bold">
                      {handleOverdueAlert(req.requestDate)}
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                    onClick={() => handleBulkAction("accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleBulkAction("reject")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedRequests.length > 0 && (
        <div className="mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 mr-4 rounded"
            onClick={() => handleBulkAction("accept")}
          >
            Bulk Accept
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => handleBulkAction("reject")}
          >
            Bulk Reject
          </button>
        </div>
      )}
    </div>
  );
};  

export default RequestsReceived;
