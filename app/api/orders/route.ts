import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { addressSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export async function GET() { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { return ok({ orders: await db.order.findMany({ where: { userId: user.id }, include: { items: true, payments: true }, orderBy: { createdAt: "desc" } }) }); } catch (error) { return errorResponse(error); } }

export async function POST(request: Request) {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try {
    const body = await request.json() as { shippingAddress?: unknown };
    const address = addressSchema.parse(body.shippingAddress);
    const order = await db.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { product: true } } } });
      if (!cart?.items.length) throw new Error("EMPTY_CART");
      let subtotal = new Prisma.Decimal(0);
      for (const item of cart.items) { if (!item.product.isActive || item.product.stock < item.quantity) throw new Error("INSUFFICIENT_STOCK"); subtotal = subtotal.plus(item.product.price.mul(item.quantity)); }
      const shippingFee = subtotal.gte(999) ? new Prisma.Decimal(0) : new Prisma.Decimal(49);
      const created = await tx.order.create({ data: { userId: user.id, subtotal, shippingFee, total: subtotal.plus(shippingFee), shippingAddress: address, items: { create: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.product.price, productName: item.product.name, productImage: item.product.imageUrl })) } }, include: { items: true } });
      for (const item of cart.items) { await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }); }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });
    return ok({ order }, 201);
  } catch (error) { if (error instanceof Error && error.message === "EMPTY_CART") return badRequest("Cart is empty", 400); if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") return badRequest("One or more products are out of stock", 409); return errorResponse(error); }
}