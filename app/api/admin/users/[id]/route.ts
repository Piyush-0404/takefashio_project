import { db } from "@/lib/db";
import { getAdminOrResponse } from "@/lib/admin";
import { errorResponse, ok } from "@/lib/http";
import { z } from "zod";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { const admin = await getAdminOrResponse(); if (admin instanceof Response) return admin; try { const { id } = await context.params; const input = z.object({ role: z.enum(["CUSTOMER", "ADMIN"]).optional(), isActive: z.boolean().optional(), name: z.string().min(2).optional() }).parse(await request.json()); return ok({ user: await db.user.update({ where: { id }, data: input, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } }) }); } catch (error) { return errorResponse(error); } }