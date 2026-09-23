import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { addressSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { deductOrderInventory } from "@/lib/inventory";

const directItemsSchema = z.array(z.object({ productId: z.string().min(1), productVariantId: z.string().min(1).optional(), quantity: z.number().int().min(1).max(99) })).min(1).max(20);

export async function GET() { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { return ok({ orders: await db.order.findMany({ where: { userId: user.id }, include: { items: true, payments: true }, orderBy: { createdAt: "desc" } }) }); } catch (error) { return errorResponse(error); } }

export async function POST(request: Request) {
  const user = await getUserOrResponse();
  if (user instanceof Response) return user;

  try {
    const body = await request.json() as { shippingAddress?: unknown; items?: unknown; couponCode?: unknown; paymentMethod?: unknown; checkoutId?: unknown };
    const address = addressSchema.parse(body.shippingAddress);
    const directItems = body.items === undefined ? null : directItemsSchema.parse(body.items);
    const couponCode = typeof body.couponCode === "string" ? body.couponCode.trim().toUpperCase() : null;
    const paymentMethod = body.paymentMethod === "COD" ? "COD" : "RAZORPAY";
    const checkoutId = typeof body.checkoutId === "string" && body.checkoutId.trim() ? body.checkoutId.trim() : null;
    if (checkoutId) {
      const existing = await db.order.findFirst({ where: { checkoutId, userId: user.id }, include: { items: true, payments: true } });
      if (existing) return ok({ order: existing, idempotent: true });
    }
    const order = await db.$transaction(async (tx) => {
      const cart = directItems
        ? null
        : await tx.cart.findUnique({
            where: { userId: user.id },
            include: { items: { include: { product: true, productVariant: true } } },
          });
      const directProducts = directItems
        ? await tx.product.findMany({
            where: { id: { in: directItems.map((item) => item.productId) }, isActive: true },
            include: { variants: true },
          })
        : [];
      const directProductMap = new Map(directProducts.map((product) => [product.id, product]));
      const purchaseItems = directItems
        ? directItems.map((item) => { const product = directProductMap.get(item.productId); return { productId: item.productId, productVariantId: item.productVariantId, quantity: item.quantity, product, productVariant: product?.variants.find((candidate) => candidate.id === item.productVariantId) }; })
        : cart?.items || [];
      if (!purchaseItems.length) throw new Error("EMPTY_CART");

      let subtotal = new Prisma.Decimal(0);
      for (const item of purchaseItems) {
        const variant = item.productVariant;
        if (!item.product || !item.product.isActive || (item.productVariantId && !variant) || (variant ? variant.stockQuantity : item.product.stock) < item.quantity) throw new Error("INSUFFICIENT_STOCK");
        subtotal = subtotal.plus((variant?.price ?? item.product.price).mul(item.quantity));
      }

      const shippingFee = subtotal.gte(999) ? new Prisma.Decimal(0) : new Prisma.Decimal(49);
      let discount = new Prisma.Decimal(0);
      if (couponCode) {
        const now = new Date();
        const coupon = await tx.coupon.findFirst({ where: { code: couponCode, isActive: true, startsAt: { lte: now }, endsAt: { gte: now } } });
        if (!coupon) throw new Error("INVALID_COUPON");
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) throw new Error("COUPON_USAGE_LIMIT");
        if (coupon.minimumAmount !== null && subtotal.lt(coupon.minimumAmount)) throw new Error("COUPON_MINIMUM_NOT_MET");
        discount = coupon.type === "PERCENTAGE" ? subtotal.mul(coupon.value).div(100) : coupon.value;
        if (coupon.maximumDiscount !== null && discount.gt(coupon.maximumDiscount)) discount = coupon.maximumDiscount;
        if (discount.gt(subtotal)) discount = subtotal;
        if (paymentMethod === "COD") await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
      const total = subtotal.minus(discount).plus(shippingFee);
      const created = await tx.order.create({
        data: {
          userId: user.id,
          subtotal,
          discount,
          couponCode,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "CREATED",
          checkoutId,
          shippingFee,
          total,
          totalAmount: total,
          shippingAddress: address,
          items: {
            create: purchaseItems.map((item) => {
              const variant = item.productVariant;
              const unitPrice = variant?.price ?? item.product!.price;
              return { productId: item.productId, productVariantId: item.productVariantId, quantity: item.quantity, unitPrice, totalPrice: unitPrice.mul(item.quantity), productName: item.product!.name, productImage: item.product!.imageUrl, sku: variant?.sku, size: variant?.size, color: variant?.color };
            }),
          },
        },
        include: { items: true },
      });
      if (paymentMethod === "COD") {
        await deductOrderInventory(tx, created.id);
        if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        await tx.notification.create({ data: { userId: user.id, type: "ORDER_CREATED", title: "Order received", message: `Your cash-on-delivery order ${created.orderNumber} was received.`, link: "/account" } });
      }
      return created;
    });
    return ok({ order }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "EMPTY_CART") return badRequest("Cart is empty", 400);
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") return badRequest("One or more products are out of stock", 409);
    if (error instanceof Error && error.message === "INVALID_COUPON") return badRequest("Coupon is invalid or expired", 400);
    if (error instanceof Error && error.message === "COUPON_USAGE_LIMIT") return badRequest("Coupon usage limit reached", 400);
    if (error instanceof Error && error.message === "COUPON_MINIMUM_NOT_MET") return badRequest("Minimum order amount is not met", 400);
    return errorResponse(error);
  }
}