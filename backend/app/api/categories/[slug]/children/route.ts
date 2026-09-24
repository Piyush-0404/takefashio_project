import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try { const { slug } = await context.params; const category = await db.category.findUnique({ where: { slug } }); if (!category) return badRequest("Category not found", 404); return ok({ categories: await db.category.findMany({ where: { parentId: category.id, isActive: true }, orderBy: { sortOrder: "asc" } }) }); } catch (error) { return errorResponse(error); }
}