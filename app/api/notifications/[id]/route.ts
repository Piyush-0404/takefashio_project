import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";

export async function PATCH(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getUserOrResponse();
  if (user instanceof Response) return user;
  try {
    const { id } = await context.params;
    const notification = await db.notification.updateMany({ where: { id, userId: user.id }, data: { readAt: new Date() } });
    if (!notification.count) return badRequest("Notification not found", 404);
    return ok({ read: true });
  } catch (error) { return errorResponse(error); }
}