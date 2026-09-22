import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { quantitySchema } from "@/lib/validation";

export async function PATCH(request: Request, context: { params: Promise<{ itemId: string }> }) {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try { const { itemId } = await context.params; const input = quantitySchema.parse(await request.json()); const item = await db.cartItem.findFirst({ where: { id: itemId, cart: { userId: user.id } }, include: { product: true } }); if (!item) return badRequest("Cart item not found", 404); if (input.quantity > item.product.stock) return badRequest("Insufficient stock", 409); return ok({ item: await db.cartItem.update({ where: { id: item.id }, data: { quantity: input.quantity }, include: { product: true } }) }); } catch (error) { return errorResponse(error); }
}

export async function DELETE(_request: Request, context: { params: Promise<{ itemId: string }> }) {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try { const { itemId } = await context.params; const item = await db.cartItem.findFirst({ where: { id: itemId, cart: { userId: user.id } } }); if (!item) return badRequest("Cart item not found", 404); await db.cartItem.delete({ where: { id: item.id } }); return ok({ message: "Item removed" }); } catch (error) { return errorResponse(error); }
}