import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { errorResponse, ok, badRequest } from "@/lib/http";
import { cartItemSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try {
    const input = cartItemSchema.parse(await request.json());
    const product = await db.product.findFirst({ where: { id: input.productId, isActive: true } });
    if (!product) return badRequest("Product not found", 404);
    if (input.quantity > product.stock) return badRequest("Insufficient stock", 409);
    const cart = await db.cart.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
    const item = await db.cartItem.upsert({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, create: { cartId: cart.id, productId: product.id, quantity: input.quantity }, update: { quantity: { increment: input.quantity } }, include: { product: true } });
    if (item.quantity > product.stock) return badRequest("Insufficient stock", 409);
    return ok({ item }, 201);
  } catch (error) { return errorResponse(error); }
}