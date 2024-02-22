import crypto from "crypto";
import "dotenv/config";

const key = Buffer.from(process.env.CRYPTO_KEY as string, "hex");

export function encrypt(text: string): { encryptedData: string; iv: string } {
  if (key.length !== 32) {
    throw new Error("Key must be 32 bytes (256 bits).");
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
  };
}

export function decrypt(encryptedData: string, ivHex: string): string {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
