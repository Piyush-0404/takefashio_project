import { db } from "@/lib/db";
import { getAdminOrResponse } from "@/lib/admin";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { createNotificationsForUsers } from "@/lib/notifications";
import { z } from "zod";

const schema = z.object({ audience: z.enum(["ALL", "CUSTOMERS"]), type: z.string().min(2), title: z.string().min(2), message: z.string().min(2), link: z.string().max(500).nullable().optional() });

export async function POST(request: Request) {
  const admin = await getAdminOrResponse();
  if (admin instanceof Response) return admin;
  try {
    const input = schema.parse(await request.json());
    const users = await db.user.findMany({ where: { role: "CUSTOMER", isActive: true }, select: { id: true } });
    const result = await createNotificationsForUsers(users.map((user) => user.id), { type: input.type, title: input.title, message: input.message, link: input.link });
    return ok({ sent: result.count }, 201);
  } catch (error) { return errorResponse(error); }
}