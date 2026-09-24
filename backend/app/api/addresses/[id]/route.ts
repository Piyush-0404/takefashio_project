import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { z } from "zod";

const updateSchema = z.object({ fullName: z.string().min(2).optional(), phone: z.string().min(7).optional(), addressLine1: z.string().min(3).optional(), addressLine2: z.string().optional(), city: z.string().min(2).optional(), state: z.string().min(2).optional(), postalCode: z.string().min(3).optional(), country: z.string().optional(), isDefault: z.boolean().optional() });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { const { id } = await context.params; const input = updateSchema.parse(await request.json()); const existing = await db.address.findFirst({ where: { id, userId: user.id } }); if (!existing) return badRequest("Address not found", 404); const address = await db.$transaction(async (tx) => { if (input.isDefault) await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }); return tx.address.update({ where: { id }, data: input }); }); return ok({ address }); } catch (error) { return errorResponse(error); } }

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { const { id } = await context.params; const address = await db.address.findFirst({ where: { id, userId: user.id } }); if (!address) return badRequest("Address not found", 404); await db.address.delete({ where: { id } }); return ok({ message: "Address deleted" }); } catch (error) { return errorResponse(error); } }