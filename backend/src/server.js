import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());

// CORS
app.use(cors());

// Request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use(morgan("combined"));

// Basic health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "DPK Service Shop",
    message: "Provider API Backend is running",
    status: "online",
    timestamp: new Date().toISOString()
  });
});

// Root API
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: "DPK Service Shop",
    version: "1.0.0",
    message: "DPK Service Shop Provider API is ready"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log("=================================");
  console.log(" DPK SERVICE SHOP");
  console.log(" Provider API Backend");
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
});
