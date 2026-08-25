import express from "express";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  updateServiceStatus,
  deleteService
} from "../controllers/serviceController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Service Management Routes
 *
 * सभी routes authentication के पीछे हैं।
 */

// Get all services
router.get("/", auth, getServices);

// Get single service
router.get("/:id", auth, getServiceById);

// Create service
router.post("/", auth, createService);

// Update service
router.put("/:id", auth, updateService);

// Change service status
router.patch("/:id/status", auth, updateServiceStatus);

// Delete service
router.delete("/:id", auth, deleteService);

export default router;
