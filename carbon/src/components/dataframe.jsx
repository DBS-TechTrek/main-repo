// src/components/DataFrame.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import './dataframe.css';

const DataFrame = () => {
  const [data, setData] = useState([]);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/companyaccount");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Company Account Data</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Company ID</th>
            <th>Company Name</th>
            <th>Active Account</th>
            <th>Carbon Balance</th>
            <th>Cash Balance</th>
            <th>Created Datetime</th>
            <th>Updated Datetime</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.companyId}>
              <td>{row.companyId}</td>
              <td>{row.companyName}</td>
              <td>{row.activeAccount ? "Yes" : "No"}</td>
              <td>{row.carbonBalance}</td>
              <td>{row.cashBalance}</td>
              <td>{new Date(row.createdDatetime).toLocaleString()}</td>
              <td>{new Date(row.updatedDatetime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataFrame;
