import { describe, expect, it, afterEach } from "vitest";
import crypto from "node:crypto";
import { hasRazorpayCredentials, hasWebhookSecret, verifyPaymentSignature, verifyWebhookSignature } from "./payments";

describe("payment signature verification", () => {
  afterEach(() => { delete process.env.RAZORPAY_KEY_ID; delete process.env.RAZORPAY_KEY_SECRET; delete process.env.RAZORPAY_WEBHOOK_SECRET; });

  it("accepts a valid Razorpay signature", () => {
    process.env.RAZORPAY_KEY_SECRET = "test-secret";
    const signature = crypto.createHmac("sha256", "test-secret").update("order|payment").digest("hex");
    expect(verifyPaymentSignature("order", "payment", signature)).toBe(true);
  });

  it("rejects malformed signatures without throwing", () => {
    process.env.RAZORPAY_KEY_SECRET = "test-secret";
    expect(verifyPaymentSignature("order", "payment", "bad")).toBe(false);
  });

  it("fails closed when Razorpay secrets are missing", () => {
    expect(hasRazorpayCredentials()).toBe(false);
    expect(hasWebhookSecret()).toBe(false);
    expect(verifyPaymentSignature("order", "payment", "anything")).toBe(false);
    expect(verifyWebhookSignature("body", "anything")).toBe(false);
  });
});