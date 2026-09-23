import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { z } from "zod";
export async function POST(request: Request) {
	const user = await getUserOrResponse();
	if (user instanceof Response) return user;
	try {
		const { code, subtotal } = z.object({ code: z.string().trim().min(1), subtotal: z.number().nonnegative() }).parse(await request.json());
		const now = new Date();
		const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
		if (!coupon) return badRequest("Invalid coupon code", 400);
		if (!coupon.isActive) return badRequest("This coupon is inactive", 400);
		if (now < coupon.startsAt) return badRequest("This coupon is not active yet", 400);
		if (now > coupon.endsAt) return badRequest("This coupon has expired", 400);
		if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return badRequest("Coupon usage limit reached", 400);
		if (coupon.minimumAmount !== null && subtotal < Number(coupon.minimumAmount)) return badRequest(`Minimum order amount is ${coupon.minimumAmount}`, 400);
		let discount = coupon.type === "PERCENTAGE" ? subtotal * Number(coupon.value) / 100 : Number(coupon.value);
		if (coupon.maximumDiscount && discount > Number(coupon.maximumDiscount)) discount = Number(coupon.maximumDiscount);
		discount = Math.min(subtotal, Math.max(0, discount));
		return ok({ valid: true, code: coupon.code, discount: Number(discount.toFixed(2)) });
	} catch (error) { return errorResponse(error); }
}