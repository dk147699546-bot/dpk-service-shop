import jwt from "jsonwebtoken";

/**
 * DPK Service Shop
 * Admin Authentication Middleware
 *
 * यह middleware protected admin APIs को secure करेगा।
 * Login के बाद मिलने वाला JWT token यहाँ verify होगा।
 */

export const requireAdmin = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // Authorization header check
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Extract token
    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing"
      });
    }

    // JWT secret must come from environment
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, secret);

    // Only admin tokens can access admin routes
    if (decoded.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    // Attach authenticated admin information
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token"
    });
  }
};
