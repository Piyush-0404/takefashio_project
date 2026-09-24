import { db } from "@/lib/db";
import { getUserOrResponse } from "@/lib/guard";
import { errorResponse, ok } from "@/lib/http";
import { z } from "zod";

const addressSchema = z.object({ fullName: z.string().min(2), phone: z.string().min(7), addressLine1: z.string().min(3), addressLine2: z.string().optional(), city: z.string().min(2), state: z.string().min(2), postalCode: z.string().min(3), country: z.string().default("India"), isDefault: z.boolean().optional() });

export async function GET() { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { return ok({ addresses: await db.address.findMany({ where: { userId: user.id }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] }) }); } catch (error) { return errorResponse(error); } }

export async function POST(request: Request) { const user = await getUserOrResponse(); if (user instanceof Response) return user; try { const input = addressSchema.parse(await request.json()); const address = await db.$transaction(async (tx) => { if (input.isDefault) await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }); return tx.address.create({ data: { ...input, userId: user.id } }); }); return ok({ address }, 201); } catch (error) { return errorResponse(error); } }