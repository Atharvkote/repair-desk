import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKeyPath = path.join(__dirname, "../keys/admin_private.key");
const publicKeyPath = path.join(__dirname, "../keys/admin_public.key");

let privateKey = null;
let publicKey = null;

try {
  privateKey = fs.readFileSync(privateKeyPath, "utf8");
  publicKey = fs.readFileSync(publicKeyPath, "utf8");
} catch (error) {
  throw new Error(`Failed to load RSA keys: ${error.message}`);
}

export { privateKey, publicKey };

