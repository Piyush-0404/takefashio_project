import { db } from "@/lib/db";
import { getAdminOrResponse } from "@/lib/admin";
import { errorResponse, ok } from "@/lib/http";
export async function GET() { const admin = await getAdminOrResponse(); if (admin instanceof Response) return admin; try { return ok({ orders: await db.order.findMany({ include: { user: { select: { id: true, name: true, email: true } }, items: true, payments: true }, orderBy: { createdAt: "desc" } }) }); } catch (error) { return errorResponse(error); } }