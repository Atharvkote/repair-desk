/**
 * @file jwt.config.js
 * @description JWT configuration using RS256 (RSA public/private keys)
 *
 * IMPORTANT: Keys are stored as environment variables with escaped newlines.
 * The keys are loaded from:
 * - JWT_PRIVATE_KEY: Private key (with \n instead of actual newlines)
 * - JWT_PUBLIC_KEY: Public key (with \n instead of actual newlines)
 *
 * This approach works for:
 * - Local development (.env file)
 * - GitHub Actions (secrets)
 * - Railway deployment (service variables)
 *
 * @example
 * // In .env or service variables:
 * JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
 * JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQE...\n-----END PUBLIC KEY-----"
 */

import "dotenv/config";

// Function to convert escaped newlines to actual newlines
const convertEscapedNewlines = (keyString) => {
  if (!keyString) {
    return null;
  }
  return keyString.replace(/\\n/g, "\n");
};

/**
 * Load JWT keys from environment variables
 * Keys must be provided as single-line strings with \n instead of actual newlines
 */
const loadKeys = () => {
  const privateKeyEnv = process.env.JWT_PRIVATE_KEY;
  const publicKeyEnv = process.env.JWT_PUBLIC_KEY;

  if (!privateKeyEnv) {
    throw new Error(
      "JWT_PRIVATE_KEY environment variable is not set. " +
      "Please set it in .env file or service variables with escaped newlines (\\n)"
    );
  }

  if (!publicKeyEnv) {
    throw new Error(
      "JWT_PUBLIC_KEY environment variable is not set. " +
      "Please set it in .env file or service variables with escaped newlines (\\n)"
    );
  }

  // Convert escaped newlines to actual newlines
  const privateKey = convertEscapedNewlines(privateKeyEnv);
  const publicKey = convertEscapedNewlines(publicKeyEnv);

  // Basic validation
  if (!privateKey.includes("BEGIN RSA PRIVATE KEY") && !privateKey.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "JWT_PRIVATE_KEY does not appear to be a valid RSA private key"
    );
  }

  if (!publicKey.includes("BEGIN PUBLIC KEY")) {
    throw new Error(
      "JWT_PUBLIC_KEY does not appear to be a valid RSA public key"
    );
  }

  return { privateKey, publicKey };
};

let cachedKeys = null;

/**
 * Get JWT keys (cached after first load)
 * @returns {Object} { privateKey, publicKey }
 */
const getKeys = () => {
  if (!cachedKeys) {
    cachedKeys = loadKeys();
  }
  return cachedKeys;
};

const { privateKey, publicKey } = getKeys();

export { privateKey, publicKey };

