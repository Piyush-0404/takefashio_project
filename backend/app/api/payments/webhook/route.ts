import { db } from "@/lib/db";
import { hasWebhookSecret, verifyWebhookSignature } from "@/lib/payments";
import { deductOrderInventory } from "@/lib/inventory";
import { badRequest, ok } from "@/lib/http";
export async function POST(request: Request) {
	const body = await request.text();
	const signature = request.headers.get("x-razorpay-signature");
	if (!hasWebhookSecret()) return badRequest("Payment webhook is not configured", 503);
	if (!signature || !verifyWebhookSignature(body, signature)) return badRequest("Invalid webhook signature", 400);
	try {
		const event = JSON.parse(body) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } };
		const entity = event.payload?.payment?.entity;
		if (!entity?.order_id || !entity.id) return ok({ received: true, ignored: true });
		if (event.event === "payment.captured") {
			const payment = await db.payment.findFirst({ where: { providerOrderId: entity.order_id }, include: { order: true } });
			if (!payment || payment.status === "CAPTURED" || payment.status === "SUCCESS") return ok({ received: true, idempotent: true });
			await db.$transaction(async (tx) => {
				await tx.payment.update({ where: { id: payment.id }, data: { providerPaymentId: entity.id, status: "CAPTURED", verifiedAt: new Date(), rawResponse: JSON.parse(body) } });
				const order = await tx.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "CAPTURED", status: "CONFIRMED" } });
				if (order.couponCode) {
					const coupon = await tx.coupon.findUnique({ where: { code: order.couponCode } });
					if (coupon && (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)) await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
				}
				await deductOrderInventory(tx, order.id);
				await tx.cartItem.deleteMany({ where: { cart: { userId: order.userId } } });
				await tx.notification.create({ data: { userId: order.userId, type: "PAYMENT_SUCCESS", title: "Payment confirmed", message: `Payment for order ${order.orderNumber} was confirmed.`, link: "/account" } });
			});
		}
		if (event.event === "payment.failed") {
			await db.$transaction(async (tx) => {
				const payment = await tx.payment.findFirst({ where: { providerOrderId: entity.order_id }, include: { order: true } });
				if (!payment || payment.status === "CAPTURED" || payment.status === "FAILED") return;
				await tx.payment.update({ where: { id: payment.id }, data: { providerPaymentId: entity.id, status: "FAILED", rawResponse: JSON.parse(body) } });
				const order = await tx.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "FAILED", status: "PAYMENT_FAILED" } });
				await tx.notification.create({ data: { userId: order.userId, type: "PAYMENT_FAILED", title: "Payment failed", message: `Payment for order ${order.orderNumber} failed.`, link: "/account" } });
			});
		}
		return ok({ received: true });
	} catch { return badRequest("Invalid webhook payload", 400); }
}