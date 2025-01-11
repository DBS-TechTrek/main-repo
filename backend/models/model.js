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
