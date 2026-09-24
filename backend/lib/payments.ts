import crypto from "node:crypto";
import Razorpay from "razorpay";

let cachedClient: Razorpay | null = null;
let cachedClientKey = "";

export function hasRazorpayCredentials() {
  return Boolean(process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim());
}

export function hasWebhookSecret() {
  return Boolean(process.env.RAZORPAY_WEBHOOK_SECRET?.trim());
}

export function razorpayClient() {
  if (!hasRazorpayCredentials()) throw new Error("PAYMENTS_NOT_CONFIGURED");
  const clientKey = `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`;
  if (!cachedClient || cachedClientKey !== clientKey) {
    cachedClient = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    cachedClientKey = clientKey;
  }
  return cachedClient;
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  if (!process.env.RAZORPAY_KEY_SECRET?.trim()) return false;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "").update(`${orderId}|${paymentId}`).digest("hex");
  const actual = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(expectedBuffer, actual);
}

export function verifyWebhookSignature(body: string, signature: string) {
  if (!hasWebhookSecret()) return false;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET ?? "").update(body).digest("hex");
  const actual = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(expectedBuffer, actual);
}