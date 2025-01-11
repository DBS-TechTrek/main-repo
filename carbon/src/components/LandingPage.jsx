// src/components/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("user");
  const [balances, setBalances] = useState({
    carbonBalance: 0,
    cashBalance: 0,
  });
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
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const api = axios.create({
    baseURL: "http://localhost:3000/", // Replace with your backend's base URL
  });
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        console.log("Username is ", username);

        const response = await api.get(`companyBalance/${username}`);
        console.log("Response is ", response.data[0]);
        setBalances(response.data[0]);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await api.get(
          `/companyOutstandingRequests/${username}`
        );
        console.log(response.data)
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
        await api.put(`/editRequest/${editingRequestId}`, formData);
      } else {
        console.log(formData)
        const companyName = username
        await api.post("/createRequest", formData, companyName);
      }
      setFormData({
        requestorCompanyName: "",
        carbonUnitPrice: "",
        carbonQuantity: "",
        requestReason: "",
        requestType: "Buy",
      });
      
      setEditingRequestId(null);
      const response = await api.get(`/companyOutstandingRequests/${username}`);
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
    setEditingRequestId(request.companyName);
  };

  const handleDelete = async (id) => {
    try {
      console.log(id)
      await api.delete(`/deleteRequest/${id}`);
      setRequests(requests.filter((req) => req.companyName !== id));
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
            <label className="block font-medium">
              Carbon Price (SGD/Tonnes)
            </label>
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
                <th className="border border-gray-300 p-2">
                  Carbon Price (SGD/Tonnes)
                </th>
                <th className="border border-gray-300 p-2">Carbon Quantity</th>
                <th className="border border-gray-300 p-2">Request Reason</th>
                <th className="border border-gray-300 p-2">Request Type</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="text-center">
                  <td className="border border-gray-300 p-2">
                    {req.requestDate}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {req.companyName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {req.carbonUnitPrice}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {req.carbonQuantity}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {req.requestReason}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {req.requestType}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                      onClick={() => handleEdit(req.companyName)}
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
