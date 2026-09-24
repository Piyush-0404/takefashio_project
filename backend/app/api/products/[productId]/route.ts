import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";

export async function GET(_request: Request, context: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await context.params;
    const product = await db.product.findFirst({ where: { id: productId, isActive: true }, include: { category: true } });
    return product ? ok({ product }) : badRequest("Product not found", 404);
  } catch (error) { return errorResponse(error); }
}