import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function ok(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) return Response.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return Response.json({ error: "A record with that value already exists" }, { status: 409 });
  console.error(error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}

export function badRequest(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}