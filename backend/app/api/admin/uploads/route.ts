import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminOrResponse } from "@/lib/admin";
import { badRequest, errorResponse, ok } from "@/lib/http";

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export async function POST(request: Request) {
  const admin = await getAdminOrResponse();
  if (admin instanceof Response) return admin;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return badRequest("An image file is required", 400);

    const extension = allowedTypes.get(file.type);
    if (!extension) return badRequest("Only JPG, PNG, and WEBP images are supported", 415);
    if (file.size > 5 * 1024 * 1024) return badRequest("Image must be 5MB or smaller", 413);

    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDirectory, { recursive: true });
    const filename = `${randomUUID()}${extension}`;
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));

    return ok({ url: `/uploads/${filename}` }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
