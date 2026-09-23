import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { hashOtp, OTP_MAX_ATTEMPTS } from "@/lib/otp";
import { z } from "zod";

const schema = z.object({ email: z.email(), otp: z.string().regex(/^\d{6}$/) });

export async function POST(request: Request) {
  try {
    const { email, otp } = schema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return badRequest("Invalid verification request", 400);
    if (user.emailVerified) return ok({ verified: true, alreadyVerified: true });
    const verification = await db.emailVerification.findUnique({ where: { userId: user.id } });
    if (!verification || verification.expiresAt < new Date()) return badRequest("Verification code expired. Request a new code.", 400);
    if (verification.attempts >= OTP_MAX_ATTEMPTS) return badRequest("Too many verification attempts. Request a new code.", 429);
    if (verification.otpHash !== hashOtp(otp)) {
      await db.emailVerification.update({ where: { userId: user.id }, data: { attempts: { increment: 1 } } });
      return badRequest("Incorrect verification code", 400);
    }
    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { emailVerified: true } }),
      db.emailVerification.delete({ where: { userId: user.id } }),
    ]);
    return ok({ verified: true, email: user.email });
  } catch (error) { return errorResponse(error); }
}