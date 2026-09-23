import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { hasRazorpayCredentials, verifyPaymentSignature } from "@/lib/payments";
import { deductOrderInventory } from "@/lib/inventory";
export async function POST(request: Request) {
	const user = await getUserOrResponse(); if (user instanceof Response) return user;
	try {
		const input = await request.json() as { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };
		if (!input.razorpay_order_id || !input.razorpay_payment_id || !input.razorpay_signature) return badRequest("Payment verification fields are required");
		const payment = await db.payment.findFirst({ where: { providerOrderId: input.razorpay_order_id, userId: user.id }, include: { order: true } });
		if (!payment) return badRequest("Payment order not found", 404);
		if (!hasRazorpayCredentials()) return badRequest("Payment provider is not configured", 503);
		if (payment.status === "CAPTURED" || payment.status === "SUCCESS") return ok({ order: payment.order, verified: true, idempotent: true });
		if (payment.providerPaymentId && payment.providerPaymentId !== input.razorpay_payment_id) return badRequest("Payment has already been verified with another reference", 409);
		if (!verifyPaymentSignature(input.razorpay_order_id, input.razorpay_payment_id, input.razorpay_signature)) return badRequest("Invalid payment signature", 400);
		const updated = await db.$transaction(async (tx) => {
			await tx.payment.update({ where: { id: payment.id }, data: { providerPaymentId: input.razorpay_payment_id, providerSignature: input.razorpay_signature, status: "CAPTURED", verifiedAt: new Date(), rawResponse: input } });
			const order = await tx.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "CAPTURED", status: "CONFIRMED" } });
			if (order.couponCode) {
				const coupon = await tx.coupon.findUnique({ where: { code: order.couponCode } });
				if (coupon && (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)) await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
			}
			await deductOrderInventory(tx, order.id);
			await tx.cartItem.deleteMany({ where: { cart: { userId: user.id } } });
			await tx.notification.create({ data: { userId: user.id, type: "PAYMENT_SUCCESS", title: "Payment confirmed", message: `Payment for order ${order.orderNumber} was confirmed.`, link: "/account" } });
			return order;
		});
		return ok({ order: updated, verified: true });
	} catch (error) {
		if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") return badRequest("Payment succeeded but inventory is unavailable. Contact support.", 409);
		return errorResponse(error);
	}
}