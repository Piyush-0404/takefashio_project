import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";

export async function GET() {
  try {
    return ok({ categories: await db.category.findMany({ where: { isActive: true, parentId: null }, include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } }) });
  } catch (error) { return errorResponse(error); }
}