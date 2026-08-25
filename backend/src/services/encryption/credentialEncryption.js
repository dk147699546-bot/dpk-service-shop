import crypto from "crypto";

/**
 * DPK Service Shop
 * Provider Credential Encryption
 *
 * Provider API keys को database में encrypted form में रखा जाएगा.
 *
 * Required environment variables:
 * ENCRYPTION_KEY
 *
 * ENCRYPTION_KEY को production server पर secret के रूप में रखना है.
 * GitHub में असली key कभी नहीं डालनी है.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error("ENCRYPTION_KEY is not configured");
  }

  const buffer = Buffer.from(key, "hex");

  if (buffer.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hexadecimal value"
    );
  }

  return buffer;
};

export const encryptCredential = (value) => {
  if (!value) {
    throw new Error("Credential value is required");
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(String(value), "utf8"),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex")
  ].join(":");
};

export const decryptCredential = (encryptedValue) => {
  if (!encryptedValue) {
    throw new Error("Encrypted credential is required");
  }

  const parts = encryptedValue.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted credential format");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  const key = getEncryptionKey();

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Invalid encrypted credential data");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
};
