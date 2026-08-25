import crypto from "crypto";
import jwt from "jsonwebtoken";

/**
 * DPK Service Shop
 * Authentication Service
 *
 * Password hashing के लिए Node.js का built-in scrypt
 * इस्तेमाल किया गया है, इसलिए अभी कोई नई dependency
 * जोड़ने की जरूरत नहीं है।
 */

/**
 * Hash a password securely using scrypt.
 */
export const hashPassword = async (password) => {
  if (!password || password.length < 8) {
    throw new Error("Password must contain at least 8 characters");
  }

  const salt = crypto.randomBytes(16).toString("hex");

  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });

  return `${salt}:${derivedKey.toString("hex")}`;
};

/**
 * Verify a password against its stored hash.
 */
export const verifyPassword = async (password, storedHash) => {
  if (!password || !storedHash) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });

  const originalBuffer = Buffer.from(originalHash, "hex");

  if (originalBuffer.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuffer, derivedKey);
};

/**
 * Generate an admin JWT.
 */
export const generateAdminToken = (admin) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role || "admin",
      type: "admin"
    },
    secret,
    {
      expiresIn: "12h",
      issuer: "dpk-service-shop"
    }
  );
};
