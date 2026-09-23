import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASSWORD;
  if (!host || !user || !password || !process.env.EMAIL_FROM) {
    throw new Error("EMAIL_PROVIDER_NOT_CONFIGURED");
  }
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass: password } });
}

export async function sendVerificationEmail(email: string, name: string, otp: string) {
  const transport = getTransport();
  await transport.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your TakeFashion account",
    text: `Hello ${name}, your TakeFashion verification code is ${otp}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
    html: `<p>Hello ${name},</p><p>Your TakeFashion verification code is <strong>${otp}</strong>.</p><p>This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>`,
  });
}

export function isEmailProviderConfigured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_FROM);
}