import { db } from "@/lib/db";
import { getAdminOrResponse } from "@/lib/admin";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { hasRazorpayCredentials, razorpayClient } from "@/lib/payments";
import { createNotification } from "@/lib/notifications";
import { z } from "zod";

const schema = z.object({ amount: z.number().positive().optional() });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrResponse();
  if (admin instanceof Response) return admin;
  try {
    const { id } = await context.params;
    const input = schema.parse(await request.json().catch(() => ({})));
    const order = await db.order.findUnique({ where: { id }, include: { payments: true } });
    if (!order) return badRequest("Order not found", 404);
    const payment = order.payments.find((entry) => entry.status === "CAPTURED" || entry.status === "SUCCESS");
    if (!payment?.providerPaymentId) return badRequest("A captured Razorpay payment is required before refunding", 400);
    if (!hasRazorpayCredentials()) return badRequest("Payment provider is not configured", 503);
    if (payment.refundStatus === "REFUNDED" || payment.status === "REFUNDED") return ok({ refunded: true, idempotent: true, order });
    if (payment.refundStatus === "PENDING" || payment.status === "REFUND_PENDING") return badRequest("A refund is already in progress", 409);
    const amount = input.amount ?? Number(order.total);
    if (amount <= 0 || amount > Number(order.total)) return badRequest("Refund amount is invalid", 400);
    const claim = await db.payment.updateMany({ where: { id: payment.id, status: { in: ["CAPTURED", "SUCCESS"] }, refundStatus: null }, data: { refundStatus: "PENDING", refundAmount: amount, refundRequestedAt: new Date(), status: "REFUND_PENDING" } });
    if (!claim.count) {
      const latest = await db.payment.findUnique({ where: { id: payment.id } });
      if (latest?.refundStatus === "REFUNDED" || latest?.status === "REFUNDED") return ok({ refunded: true, idempotent: true, order });
      return badRequest("A refund is already in progress", 409);
    }
    try {
      const refund = await razorpayClient().payments.refund(payment.providerPaymentId, { amount: Math.round(amount * 100) });
      const updated = await db.$transaction(async (tx) => {
        const savedPayment = await tx.payment.update({ where: { id: payment.id }, data: { refundId: refund.id, refundStatus: "REFUNDED", status: "REFUNDED" } });
        const savedOrder = await tx.order.update({ where: { id }, data: { status: "CANCELLED", paymentStatus: "REFUNDED" } });
        await tx.notification.create({ data: { userId: order.userId, type: "REFUND_COMPLETED", title: "Refund completed", message: `Your refund of INR ${amount.toFixed(2)} for order ${order.orderNumber} was completed.`, link: "/account" } });
        return { savedPayment, savedOrder };
      });
      return ok({ refunded: true, refundId: refund.id, order: updated.savedOrder });
    } catch (error) {
      await db.payment.update({ where: { id: payment.id }, data: { refundStatus: "FAILED", status: "REFUND_FAILED" } });
      await createNotification(order.userId, { type: "REFUND_FAILED", title: "Refund needs attention", message: `We could not complete the refund for order ${order.orderNumber}.`, link: "/account" });
      if (error instanceof Error && error.message === "PAYMENTS_NOT_CONFIGURED") return badRequest("Payments are not configured", 503);
      return badRequest("Razorpay refund failed", 502);
    }
  } catch (error) { return errorResponse(error); }
}