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

export async function deleteRequest(id) {
  const [result] = await db.promise().query(
    `DELETE FROM outstandingrequest 
          WHERE id = ?`,
    [id]
  );
  if (result.affectedRows === 0) {
    throw new Error(`Request with id ${id} not found`);
  }
  return { message: `Request with id ${id} successfully deleted` };
}
