import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { sendVerificationEmail } from "@/lib/email";
import { createOtp, OTP_COOLDOWN_SECONDS, OTP_EXPIRY_MINUTES } from "@/lib/otp";
import { z } from "zod";

const schema = z.object({ email: z.email() });

export async function POST(request: Request) {
  try {
    const { email } = schema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || user.emailVerified) return ok({ sent: true });
    const current = await db.emailVerification.findUnique({ where: { userId: user.id } });
    if (current && Date.now() - current.lastSentAt.getTime() < OTP_COOLDOWN_SECONDS * 1000) return badRequest("Please wait before requesting another code", 429);
    const otp = createOtp();
    await db.emailVerification.upsert({ where: { userId: user.id }, update: { otpHash: otp.hash, expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000), attempts: 0, lastSentAt: new Date() }, create: { userId: user.id, otpHash: otp.hash, expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000), lastSentAt: new Date() } });
    try { await sendVerificationEmail(user.email, user.name, otp.value); } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_PROVIDER_NOT_CONFIGURED") return badRequest("Email verification is not configured", 503);
      return badRequest("We could not send the verification email", 503);
    }
    return ok({ sent: true });
  } catch (error) { return errorResponse(error); }
}