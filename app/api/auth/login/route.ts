import { createToken, publicUser, setAuthCookie, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !user.isActive || !(await verifyPassword(user.passwordHash, input.password))) return badRequest("Invalid email or password", 401);
    if (!user.emailVerified) return badRequest("Please verify your email before signing in", 403);
    await setAuthCookie(await createToken(user));
    return ok({ user: publicUser(user) });
  } catch (error) { return errorResponse(error); }
}