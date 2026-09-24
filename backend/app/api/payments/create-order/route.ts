import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { hasRazorpayCredentials, razorpayClient } from "@/lib/payments";

export async function POST(request: Request) {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try {
    const { orderId } = await request.json() as { orderId?: string };
    if (!orderId) return badRequest("orderId is required");
    const order = await db.order.findFirst({ where: { id: orderId, userId: user.id }, include: { payments: true } });
    if (!order) return badRequest("Order not found", 404);
    if (order.paymentStatus === "CAPTURED" || order.paymentStatus === "SUCCESS") return badRequest("Order is already paid", 409);
    if (!hasRazorpayCredentials()) return badRequest("Payment provider is not configured", 503);
    const existing = order.payments.find((payment) => payment.providerOrderId && payment.status !== "FAILED");
    if (existing?.providerOrderId) return ok({ paymentOrder: { id: existing.providerOrderId, amount: Math.round(Number(order.total) * 100), currency: existing.currency, keyId: process.env.RAZORPAY_KEY_ID } });
    const razorpayOrder = await razorpayClient().orders.create({ amount: Math.round(Number(order.total) * 100), currency: "INR", receipt: order.id });
    await db.payment.create({ data: { orderId: order.id, userId: user.id, providerOrderId: razorpayOrder.id, amount: order.total, status: "CREATED" } });
    return ok({ paymentOrder: { id: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, keyId: process.env.RAZORPAY_KEY_ID } }, 201);
  } catch (error) { if (error instanceof Error && error.message === "PAYMENTS_NOT_CONFIGURED") return badRequest("Payments are not configured", 503); return errorResponse(error); }
}