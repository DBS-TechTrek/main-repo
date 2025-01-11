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
  console.log("Get Company ID");
  const [companyId] = await db
    .promise()
    .query("SELECT companyId FROM companyaccount WHERE companyName = ?", [
      companyName,
    ]);
  console.log(companyId);
  console.log("Get Company ID");
  return companyId;
}

export async function getAllOutstandingRequests(companyName) {
  const companyId = await getCompanyId(companyName);
  console.log(companyId);
  // Query the database for companyName, carbonBalance, and cashBalance
  const [rows] = await db.promise().query(
    `SELECT ca.companyName, 
    orq.createdDatetime AS requestDate, 
    orq.carbonUnitPrice, 
    orq.carbonQuantity, 
    orq.requestReason, 
    orq.requestType FROM 
    outstandingRequest orq 
    JOIN companyAccount ca 
    ON orq.companyId = ca.companyId 
    WHERE orq.companyId != ?`,
    [companyId[0].companyId] // Pass the companyId as a parameter
  );

  return rows; // Return the result of the query
}
export async function getOtherOutstandingRequests(companyName) {
  const companyId = await getCompanyId(companyName);
  console.log(companyId);
  // Query the database for companyName, carbonBalance, and cashBalance
  const [rows] = await db.promise().query(
    `SELECT ca.companyName, 
    orq.createdDatetime AS requestDate, 
    orq.carbonUnitPrice, 
    orq.carbonQuantity, 
    orq.requestReason, 
    orq.requestType FROM 
    outstandingRequest orq 
    JOIN companyAccount ca 
    ON orq.companyId = ca.companyId 
    WHERE orq.companyId != ?`,
    [companyId[0].companyId] // Pass the companyId as a parameter
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

export async function deleteRequest(companyName) {
  const companyIdObject = await getCompanyId(companyName);
  const companyId = companyIdObject[0].companyId;
  console.log("deleteRequest");
  console.log(companyId);
  console.log("deleteRequest");
  const [result] = await db.promise().query(
    `DELETE FROM outstandingrequest 
          WHERE id = ?`,
    [companyId]
  );
  if (result.affectedRows === 0) {
    throw new Error(`Request with id ${companyId} not found`);
  }
  return { message: `Request with id ${companyId} successfully deleted` };
}

export async function createRequest(data) {
  const {
    companyName,
    requestReason,
    carbonUnitPrice,
    requestorCompanyName,
    requestStatus,
    requestType,
    carbonQuantity,
  } = data;

  const companyIdObject = await getCompanyId(companyName);
  const companyId = companyIdObject[0].companyId;
  const requestorCompanyIdObject = await getCompanyId(requestorCompanyName);
  const requestorCompanyId = requestorCompanyIdObject[0].companyId;
  const currentDate = new Date();
  const createdDatetime = new Date(currentDate.getTime());


  // SQL query to insert new user into the "outstandingrequest" table
  const queryForOutstandingRequest =
    "INSERT INTO outstandingrequest (companyId, requestReason, carbonUnitPrice, requestorCompanyId, requestStatus, requestType, createdDatetime, carbonQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    // Use the promise-based query method to execute the query
    const [result] = await db
      .promise()
      .query(queryForOutstandingRequest, [
        companyId,
        requestReason,
        carbonUnitPrice,
        requestorCompanyId,
        requestStatus,
        requestType,
        createdDatetime,
        carbonQuantity,
      ]);

    const requestId = result.insertId;
    console.log(requestId);
    //Not sure if this logic is right?
    const currentDate = new Date();
    const alertDateTime = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    console.log(alertDateTime);
    const alertStatus = "Scheduled";
    const alertText = "";
    const queryForRequestReceived =
      "INSERT INTO requestreceived (requestId, alertDateTime, alertStatus, alertText) VALUES (?, ?, ?, ?)";

    const [resultForReceivedRequest] = await db
      .promise()
      .query(queryForRequestReceived, [
        requestId,
        alertDateTime,
        alertStatus,
        alertText,
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

export async function updateStatus({
  requestId,
  companyId,
  requestorCompanyId,
  carbonUnitPrice,
  carbonQuantity,
  requestReason,
  requestStatus,
  requestType,
}) {
  const query = `
  UPDATE outstandingrequest
  SET requestStatus=?
  WHERE id=?`;

  const query2 = `
  UPDATE companyaccount
  SET carbonBalance = carbonBalance + ?,
  cashBalance = cashBalance - ?
  WHERE companyId= ?`;

  const query3 = `
  UPDATE companyaccount
  SET carbonBalance = carbonBalance - ?,
  cashBalance = cashBalance + ?
  WHERE companyId= ?`;

  try {
    const [result] = await db
      .promise()
      .query(query, [requestStatus, requestId]);

    if (requestStatus === "Approved") {
      if (requestType === "Buy") {
        const [result1] = await db
          .promise()
          .query(query2, [
            carbonQuantity,
            carbonQuantity * carbonUnitPrice,
            requestorCompanyId,
          ]);

        const [result2] = await db
          .promise()
          .query(query3, [
            carbonQuantity,
            carbonQuantity * carbonUnitPrice,
            companyId,
          ]);
      } else {
        const [result1] = await db
          .promise()
          .query(query2, [
            carbonQuantity,
            carbonQuantity * carbonUnitPrice,
            companyId,
          ]);

        const [result2] = await db
          .promise()
          .query(query3, [
            carbonQuantity,
            carbonQuantity * carbonUnitPrice,
            requestorCompanyId,
          ]);
      }
    }

    return { message: "done" };
  } catch (err) {
    console.error("Error updating data:", err);
    throw new Error("Error saving status to database");
  }
}
