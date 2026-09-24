import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse } from "@/lib/http";
import { createInvoicePdf } from "@/lib/invoice";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const user = await getUserOrResponse();
  if (user instanceof Response) return user;
  try {
    const { orderId } = await context.params;
    const order = await db.order.findFirst({ where: { id: orderId, userId: user.id }, include: { user: { select: { name: true, email: true } }, items: true, payments: true } });
    if (!order) return badRequest("Order not found", 404);
    if (order.paymentStatus !== "CAPTURED" && order.paymentStatus !== "SUCCESS") return badRequest("Invoice is available after payment is confirmed", 409);
    const pdf = await createInvoicePdf(order);
    return new Response(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="takefashion-${order.orderNumber}.pdf"`, "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}