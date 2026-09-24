import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";
export async function GET() { try { return ok({ categories: await db.category.findMany({ orderBy: { name: "asc" } }) }); } catch (error) { return errorResponse(error); } }