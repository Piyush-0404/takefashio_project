import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";
export async function GET() { try { return ok({ products: await db.product.findMany({ where: { isActive: true, isTrending: true }, include: { category: true }, orderBy: { createdAt: "desc" } }) }); } catch (error) { return errorResponse(error); } }