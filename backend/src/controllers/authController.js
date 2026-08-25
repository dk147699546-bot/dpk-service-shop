import { query } from "../config/database.js";
import {
  verifyPassword,
  generateAdminToken
} from "../services/authService.js";

/**
 * DPK Service Shop
 * Admin Authentication Controller
 *
 * यह controller admin login request handle करेगा।
 */

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Find admin
    const result = await query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        status
      FROM admins
      WHERE email = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const admin = result.rows[0];

    // Check account status
    if (admin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Admin account is not active"
      });
    }

    // Verify password
    const passwordValid = await verifyPassword(
      password,
      admin.password_hash
    );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT
    const token = generateAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
