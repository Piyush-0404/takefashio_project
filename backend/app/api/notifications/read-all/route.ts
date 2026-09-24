import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { errorResponse, ok } from "@/lib/http";

export async function POST() {
  const user = await getUserOrResponse();
  if (user instanceof Response) return user;
  try {
    const result = await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
    return ok({ read: result.count });
  } catch (error) { return errorResponse(error); }
}