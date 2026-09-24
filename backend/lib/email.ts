import nodemailer from "nodemailer";

const BRAND_COLOR = "#c2410c";

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

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] as string);
}

export async function sendVerificationEmail(email: string, name: string, otp: string) {
  const transport = getTransport();
  const safeName = escapeHtml(name);
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || "10";

  await transport.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${otp} is your TakeFashion verification code`,
    text: `Hello ${name},\n\nYour TakeFashion verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes. If you did not create a TakeFashion account, you can safely ignore this email.\n\nTakeFashion`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your TakeFashion account</title>
  </head>
  <body style="margin:0;background:#f5f5f4;color:#292524;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e4;border-radius:16px;overflow:hidden;">
          <tr><td style="background:${BRAND_COLOR};padding:28px 36px;">
            <div style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:.3px;">TakeFashion</div>
            <div style="color:#ffedd5;font-size:13px;margin-top:6px;">Style made personal</div>
          </td></tr>
          <tr><td style="padding:38px 36px 28px;">
            <p style="margin:0 0 10px;color:#78716c;font-size:14px;">Welcome, ${safeName}</p>
            <h1 style="margin:0;color:#1c1917;font-size:28px;line-height:1.2;">Verify your email</h1>
            <p style="margin:18px 0 26px;color:#57534e;font-size:16px;line-height:1.6;">Use the verification code below to finish creating your TakeFashion account.</p>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:22px;text-align:center;">
              <div style="color:#9a3412;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Your one-time code</div>
              <div style="margin-top:10px;color:${BRAND_COLOR};font-size:36px;font-weight:700;letter-spacing:8px;">${otp}</div>
            </div>
            <p style="margin:22px 0 0;color:#78716c;font-size:13px;line-height:1.6;">This code expires in <strong style="color:#44403c;">${expiryMinutes} minutes</strong>. For your security, never share this code with anyone.</p>
          </td></tr>
          <tr><td style="border-top:1px solid #e7e5e4;padding:22px 36px 28px;">
            <p style="margin:0;color:#a8a29e;font-size:12px;line-height:1.6;">If you did not request this email, you can safely ignore it. This is an automated message from TakeFashion.</p>
            <p style="margin:14px 0 0;color:#a8a29e;font-size:12px;">&copy; ${new Date().getFullYear()} TakeFashion</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
  });
}

export function isEmailProviderConfigured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_FROM);
}