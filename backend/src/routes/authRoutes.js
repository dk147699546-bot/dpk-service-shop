import express from "express";
import { loginAdmin } from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * POST /api/auth/login
 *
 * Admin login endpoint.
 * Authentication requests पर strict rate limiting लागू है।
 */
router.post("/login", authRateLimiter, loginAdmin);

export default router;
