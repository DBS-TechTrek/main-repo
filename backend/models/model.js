import db from "../database.js";

// Asynchronous functions for interacting with the database

export async function getBalance(companyName) {
  // Query the database for companyName, carbonBalance, and cashBalance
  const [rows] = await db.promise().query(
    "SELECT companyName, carbonBalance, cashBalance FROM companyaccount WHERE companyName = ?",
    [companyName] // Pass the companyINameas a parameter
  );

  return rows; // Return the result of the query
}

export async function getCompanyId(companyName) {
  const [companyId] = await db
    .promise()
    .query("SELECT companyId FROM companyaccount WHERE companyName = ?", [
      companyName,
    ]);
  return companyId;
}
export async function getAllOutstandingRequests(companyName) {
  const companyId = await getCompanyId(companyName);
  console.log(companyId);
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

export async function createRequest(data) {
  const {
    companyId,
    requestReason,
    carbonUnitPrice,
    requestorCompanyId,
    requestStatus,
    requestType,
    createdDatetime,
    carbonQuantity,
  } = data;

  // SQL query to insert new user into the "users" table
  const query =
    "INSERT INTO outstandingrequest (companyId, requestReason, carbonUnitPrice, requestorCompanyId, requestStatus, requestType, createdDatetime, carbonQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    // Use the promise-based query method to execute the query
    const [result] = await db
      .promise()
      .query(query, [
        companyId,
        requestReason,
        carbonUnitPrice,
        requestorCompanyId,
        requestStatus,
        requestType,
        createdDatetime,
        carbonQuantity,
      ]);

    // Return the created user with the generated id (from the result)
    return {
      id: result.insertId,
      companyId,
      requestReason,
      carbonUnitPrice,
      requestorCompanyId,
      requestStatus,
      requestType,
      createdDatetime,
      carbonQuantity,
    };
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Error saving request to the database");
  }
}

export async function getCompanyName(companyName) {
  // Query the database for companyName, carbonBalance, and cashBalance
  const [rows] = await db.promise().query(
    `SELECT * 
    FROM companyaccount
    WHERE companyName = ?`,
    [companyName] // Pass the companyINameas a parameter
  );
  console.log(rows[0]);
  return rows[0]; // Return the result of the query
}
