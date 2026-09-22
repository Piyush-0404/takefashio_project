import { createToken, hashPassword, publicUser, setAuthCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const email = input.email.toLowerCase();
    const user = await db.user.create({ data: { name: input.name, email, passwordHash: await hashPassword(input.password) } });
    await setAuthCookie(await createToken(user));
    return ok({ user: publicUser(user) }, 201);
  } catch (error) { return errorResponse(error); }
}