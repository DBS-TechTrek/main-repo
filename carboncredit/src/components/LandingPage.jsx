import React, { useState, useEffect } from "react";
import axios from "axios";

const LandingPage = () => {
  const [balances, setBalances] = useState({ carbonBalance: 0, cashBalance: 0 });
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    requestDate: "",
    companyName: "",
    carbonUnitPrice: "",
    carbonQuantity: "",
    requestReason: "",
    requestType: "Buy",
  });
  const [editingRequestId, setEditingRequestId] = useState(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await axios.get("/api/user/balances");
        setBalances(response.data);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get("/api/requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchBalances();
    fetchRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRequestId) {
        await axios.put(`/api/requests/${editingRequestId}`, formData);
      } else {
        await axios.post("/api/requests", formData);
      }
      setFormData({
        requestDate: "",
        companyName: "",
        carbonUnitPrice: "",
        carbonQuantity: "",
        requestReason: "",
        requestType: "Buy",
      });
      setEditingRequestId(null);
      const response = await axios.get("/api/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleEdit = (request) => {
    setFormData({
      requestDate: request.requestDate,
      companyName: request.companyName,
      carbonUnitPrice: request.carbonUnitPrice,
      carbonQuantity: request.carbonQuantity,
      requestReason: request.requestReason,
      requestType: request.requestType,
    });
    setEditingRequestId(request.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/requests/${id}`);
      setRequests(requests.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Landing Page</h1>

      {/* Display Balances */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Balances</h2>
        <p>Carbon Credits: {balances.carbonBalance} tonnes</p>
        <p>Cash Balance: ${balances.cashBalance}</p>
      </div>

      {/* Insert/Edit Request Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create or Edit Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Request Date</label>
            <input
              type="date"
              name="requestDate"
              value={formData.requestDate}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Carbon Price (SGD/Tonnes)</label>
            <input
              type="number"
              name="carbonUnitPrice"
              value={formData.carbonUnitPrice}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Carbon Quantity</label>
            <input
              type="number"
              name="carbonQuantity"
              value={formData.carbonQuantity}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Request Reason</label>
            <textarea
              name="requestReason"
              value={formData.requestReason}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            ></textarea>
          </div>
          <div>
            <label className="block font-medium">Request Type</label>
            <select
              name="requestType"
              value={formData.requestType}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            >
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingRequestId ? "Update Request" : "Create Request"}
          </button>
        </form>
      </div>

      {/* Display Requests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Requests</h2>
        {requests.length === 0 ? (
          <p>No requests available.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Request Date</th>
                <th className="border border-gray-300 p-2">Company Name</th>
                <th className="border border-gray-300 p-2">Carbon Price (SGD/Tonnes)</th>
                <th className="border border-gray-300 p-2">Carbon Quantity</th>
                <th className="border border-gray-300 p-2">Request Reason</th>
                <th className="border border-gray-300 p-2">Request Type</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="text-center">
                  <td className="border border-gray-300 p-2">{req.requestDate}</td>
                  <td className="border border-gray-300 p-2">{req.companyName}</td>
                  <td className="border border-gray-300 p-2">{req.carbonUnitPrice}</td>
                  <td className="border border-gray-300 p-2">{req.carbonQuantity}</td>
                  <td className="border border-gray-300 p-2">{req.requestReason}</td>
                  <td className="border border-gray-300 p-2">{req.requestType}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                      onClick={() => handleEdit(req)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(req.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
