import { db } from "@/lib/db";
import { getAdminOrResponse } from "@/lib/admin";
import { badRequest, errorResponse } from "@/lib/http";
import { createInvoicePdf } from "@/lib/invoice";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrResponse();
  if (admin instanceof Response) return admin;
  try {
    const { id } = await context.params;
    const order = await db.order.findUnique({ where: { id }, include: { user: { select: { name: true, email: true } }, items: true, payments: true } });
    if (!order) return badRequest("Order not found", 404);
    if (order.paymentStatus !== "CAPTURED" && order.paymentStatus !== "SUCCESS") return badRequest("Invoice is available after payment is confirmed", 409);
    const pdf = await createInvoicePdf(order);
    return new Response(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="takefashion-${order.orderNumber}.pdf"`, "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}