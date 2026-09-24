import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try { const { slug } = await context.params; const product = await db.product.findFirst({ where: { slug, isActive: true }, include: { category: true, productImages: { orderBy: { sortOrder: "asc" } }, variants: { where: { isActive: true }, include: { inventory: true } } } }); return product ? ok({ product }) : badRequest("Product not found", 404); } catch (error) { return errorResponse(error); }
}