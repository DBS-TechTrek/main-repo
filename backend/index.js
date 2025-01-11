import express from "express";
import db from "./database.js"; // Import the database connection
import cors from "cors";

const app = express();
// Define a port
const PORT = 3000;

// Test database connection (optional)
app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      console.error("Database query failed:", err);
      return res.status(500).send("Database error");
    }
    res.send(`Database connected! Result: ${results[0].result}`);
  });
});

app.use(cors()); // Enable CORS

app.use(express.json());

//Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Create a basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
