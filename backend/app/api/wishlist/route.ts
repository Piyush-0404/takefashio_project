import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { errorResponse, ok } from "@/lib/http";
export async function GET() { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { return ok({ items: await db.wishlistItem.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { createdAt: "desc" } }) }); } catch (error) { return errorResponse(error); } }
export async function DELETE() { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { await db.wishlistItem.deleteMany({ where: { userId: user.id } }); return ok({ message: "Wishlist cleared" }); } catch (error) { return errorResponse(error); } }