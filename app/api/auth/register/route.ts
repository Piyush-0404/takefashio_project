import { hashPassword, publicUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { badRequest, errorResponse, ok } from "@/lib/http";
import { sendVerificationEmail } from "@/lib/email";
import { createOtp, OTP_EXPIRY_MINUTES } from "@/lib/otp";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const email = input.email.toLowerCase();
    const user = await db.user.create({ data: { name: input.name, email, passwordHash: await hashPassword(input.password), emailVerified: false } });
    const otp = createOtp();
    await db.emailVerification.create({ data: { userId: user.id, otpHash: otp.hash, expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000), lastSentAt: new Date() } });
    try {
      await sendVerificationEmail(user.email, user.name, otp.value);
    } catch (error) {
      await db.user.delete({ where: { id: user.id } });
      if (error instanceof Error && error.message === "EMAIL_PROVIDER_NOT_CONFIGURED") return badRequest("Email verification is not configured. Add SMTP credentials before signing up.", 503);
      return badRequest("We could not send the verification email. Please try again.", 503);
    }
    return ok({ verificationRequired: true, email: user.email, user: publicUser(user) }, 201);
  } catch (error) { return errorResponse(error); }
}