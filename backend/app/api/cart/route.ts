import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { errorResponse, ok } from "@/lib/http";

export async function GET() {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try { const cart = await db.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { product: true, productVariant: true }, orderBy: { id: "asc" } } } }); return ok({ cart: cart ?? { items: [] } }); } catch (error) { return errorResponse(error); }
}

export async function DELETE() {
  const user = await getUserOrResponse(); if (user instanceof Response) return user;
  try { await db.cartItem.deleteMany({ where: { cart: { userId: user.id } } }); return ok({ message: "Cart cleared" }); } catch (error) { return errorResponse(error); }
}