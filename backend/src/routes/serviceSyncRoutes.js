import express from "express";

import {
  syncServices,
  previewServices
} from "../controllers/serviceSyncController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Provider Service Synchronization Routes
 *
 * POST /sync
 * Provider से services sync करेगा।
 *
 * POST /preview
 * Provider की services preview करेगा,
 * database में save नहीं करेगा।
 */

router.post("/sync", auth, syncServices);

router.post("/preview", auth, previewServices);

export default router;
