import db from "../database.js";

// Asynchronous functions for interacting with the database

export async function getBalance(companyId) {
  // Query the database for companyName, carbonBalance, and cashBalance
  const [rows] = await db.promise().query(
    "SELECT companyName, carbonBalance, cashBalance FROM companyaccount WHERE companyId = ?",
    [companyId] // Pass the companyId as a parameter
  );

  return rows; // Return the result of the query
}

export async function getAllOutstandingRequests(companyId) {
  // Query the database for companyName, carbonBalance, and cashBalance
  const [rows] = await db.promise().query(
    "SELECT ca.companyName, orq.createdDatetime AS requestDate, orq.carbonUnitPrice, orq.carbonQuantity, orq.requestReason, orq.requestType FROM outstandingRequest orq JOIN companyAccount ca ON orq.companyId = ca.companyID WHERE orq.companyId != ?",
    [companyId] // Pass the companyId as a parameter
  );

  return rows; // Return the result of the query
}

export async function editRequest({
  requestId,
  companyId,
  requestorCompanyId,
  carbonUnitPrice,
  carbonQuantity,
  requestReason,
  requestStatus,
  requestType,
}) {
  try {
    // SQL query to update the record in the table
    const query = `
        UPDATE outstandingrequest
        SET 
          companyId = ?, 
          requestorCompanyId = ?, 
          carbonUnitPrice = ?, 
          carbonQuantity = ?, 
          requestReason = ?, 
          requestStatus = ?, 
          requestType = ?
        WHERE id = ?;
      `;

    // Execute the query with the provided parameters
    const [result] = await db.promise().query(query, [
      companyId,
      requestorCompanyId,
      carbonUnitPrice,
      carbonQuantity,
      requestReason,
      requestStatus,
      requestType,
      requestId, // The `WHERE` condition (requestId)
    ]);

    // Return the result of the query
    return result;
  } catch (error) {
    console.error("Error updating request in outstandingrequest:", error);
    throw error;
  }
}


export async function createRequest(data) {
  const { companyId, requestReason, carbonUnitPrice, requestorCompanyId, requestStatus, requestType, createdDatetime, carbonQuantity } = data;

  // SQL query to insert new user into the "users" table
  const query = 'INSERT INTO outstandingrequest (companyId, requestReason, carbonUnitPrice, requestorCompanyId, requestStatus, requestType, createdDatetime, carbonQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  try {
    // Use the promise-based query method to execute the query
    const [result] = await db.promise().query(query, [companyId, requestReason, carbonUnitPrice, requestorCompanyId, requestStatus, requestType, createdDatetime, carbonQuantity]);

    // Return the created user with the generated id (from the result)
    return { id: result.insertId, companyId, requestReason, carbonUnitPrice, requestorCompanyId, requestStatus, requestType, createdDatetime, carbonQuantity };
  } catch (error) {
    console.error('Error creating data:', error);
    throw new Error('Error saving request to the database');
  }
}