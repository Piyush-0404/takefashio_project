import { db } from "@/lib/db";
import { getAdminOrResponse } from "@/lib/admin";
import { errorResponse, ok } from "@/lib/http";
export async function GET() { const admin = await getAdminOrResponse(); if (admin instanceof Response) return admin; try { return ok({ users: await db.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { orders: true } } }, orderBy: { createdAt: "desc" } }) }); } catch (error) { return errorResponse(error); } }