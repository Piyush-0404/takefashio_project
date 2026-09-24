import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { errorResponse, ok } from "@/lib/http";

export async function GET() {
  const user = await getUserOrResponse();
  if (user instanceof Response) return user;
  try {
    const [notifications, unread] = await Promise.all([
      db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 }),
      db.notification.count({ where: { userId: user.id, readAt: null } }),
    ]);
    return ok({ notifications, unread });
  } catch (error) { return errorResponse(error); }
}