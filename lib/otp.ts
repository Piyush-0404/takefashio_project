import { createHash, randomInt } from "node:crypto";

export const OTP_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
export const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
export const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

export function createOtp() {
  const value = String(randomInt(0, 1_000_000)).padStart(6, "0");
  return { value, hash: hashOtp(value) };
}

export function hashOtp(value: string) {
  return createHash("sha256").update(`${value}:${process.env.JWT_SECRET || "takefashion"}`).digest("hex");
}