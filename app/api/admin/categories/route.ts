import { db } from "@/lib/db";
import { getAdminOrResponse } from "@/lib/admin";
import { errorResponse, ok } from "@/lib/http";
import { z } from "zod";

const categorySchema = z.object({ name: z.string().min(2), slug: z.string().regex(/^[a-z0-9-]+$/), parentId: z.string().nullable().optional(), description: z.string().optional(), imageUrl: z.string().url().nullable().optional(), sortOrder: z.number().int().optional(), isActive: z.boolean().optional() });
export async function GET() { const admin = await getAdminOrResponse(); if (admin instanceof Response) return admin; try { return ok({ categories: await db.category.findMany({ include: { parent: true, children: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }) }); } catch (error) { return errorResponse(error); } }
export async function POST(request: Request) { const admin = await getAdminOrResponse(); if (admin instanceof Response) return admin; try { const category = await db.category.create({ data: categorySchema.parse(await request.json()) }); return ok({ category }, 201); } catch (error) { return errorResponse(error); } }