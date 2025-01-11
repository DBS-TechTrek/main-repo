import "dotenv/config";
import mysql from "mysql2";

// Create a database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost", // Use environment variables or defaults
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || " ",
  database: process.env.DB_NAME || "techtrek2025",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    process.exit(1); // Exit the process if the connection fails
  }
  console.log("Connected to the MySQL database.");
});

// Export the connection (optional, if needed elsewhere)
export default db;
