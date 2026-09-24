import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try { const { slug } = await context.params; const category = await db.category.findFirst({ where: { slug, isActive: true }, include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } }, products: { where: { isActive: true }, take: 20, orderBy: { createdAt: "desc" } } } }); return category ? ok({ category }) : badRequest("Category not found", 404); } catch (error) { return errorResponse(error); }
}