import crypto from "crypto";

/**
 * DPK Service Shop
 * Security Utilities
 *
 * Important:
 * - Real secrets GitHub par store nahi karne hain.
 * - Production secrets environment variables se aayenge.
 */

/**
 * Generate a cryptographically secure random token.
 */
export const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

/**
 * Create a SHA-256 hash.
 *
 * Note:
 * This is for non-password data such as request fingerprints
 * or internal identifiers.
 * Passwords ke liye dedicated password hashing library use karenge.
 */
export const createHash = (value) => {
  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex");
};

/**
 * Constant-time comparison.
 *
 * Sensitive values compare karte waqt timing-based
 * comparison issues ko reduce karta hai.
 */
export const safeCompare = (a, b) => {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));

  if (first.length !== second.length) {
    return false;
  }

  return crypto.timingSafeEqual(first, second);
};

/**
 * Check whether the application is running in production.
 */
export const isProduction = () => {
  return process.env.NODE_ENV === "production";
};
