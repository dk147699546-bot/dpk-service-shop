import express from "express";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * Provider API Routes
 *
 * सभी provider management routes admin protected रहेंगे।
 */

// Get all providers
router.get("/", requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provider list endpoint is ready",
    data: []
  });
});

// Get provider by ID
router.get("/:id", requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provider details endpoint is ready",
    providerId: req.params.id
  });
});

// Add provider
router.post("/", requireAdmin, (req, res) => {
  res.status(201).json({
    success: true,
    message: "Provider creation endpoint is ready"
  });
});

// Update provider
router.put("/:id", requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provider update endpoint is ready",
    providerId: req.params.id
  });
});

// Enable / Disable provider
router.patch("/:id/status", requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provider status endpoint is ready",
    providerId: req.params.id
  });
});

// Delete provider
router.delete("/:id", requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provider deletion endpoint is ready",
    providerId: req.params.id
  });
});

export default router;
