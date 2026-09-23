import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { errorResponse, ok, badRequest } from "@/lib/http";
import { cartItemSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try {
    const input = cartItemSchema.parse(await request.json());
    const product = await db.product.findFirst({ where: { id: input.productId, isActive: true }, include: { variants: true } });
    if (!product) return badRequest("Product not found", 404);
    const variant = input.productVariantId ? product.variants.find((item) => item.id === input.productVariantId && item.isActive) : null;
    if (input.productVariantId && !variant) return badRequest("Product variant not found", 404);
    if (input.quantity > (variant?.stockQuantity ?? product.stock)) return badRequest("Insufficient stock", 409);
    const cart = await db.cart.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
    const existing = await db.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, select: { quantity: true } });
    const nextQuantity = (existing?.quantity || 0) + input.quantity;
    if (nextQuantity > (variant?.stockQuantity ?? product.stock)) return badRequest("Insufficient stock", 409);
    const item = await db.cartItem.upsert({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, create: { cartId: cart.id, productId: product.id, productVariantId: input.productVariantId, quantity: input.quantity }, update: { productVariantId: input.productVariantId, quantity: nextQuantity }, include: { product: true, productVariant: true } });
    return ok({ item }, 201);
  } catch (error) { return errorResponse(error); }
}