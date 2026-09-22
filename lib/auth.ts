import argon2 from "argon2";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const cookieName = "takefashion_token";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "development-only-change-this-secret");

export async function hashPassword(password: string) { return argon2.hash(password); }
export async function verifyPassword(hash: string, password: string) { return argon2.verify(hash, password); }

export async function createToken(user: { id: string; role: string }) {
  return new SignJWT({ role: user.role }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime(process.env.JWT_EXPIRES_IN ?? "7d").sign(secret);
}

export async function setAuthCookie(token: string) {
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", path: "/", maxAge: 7 * 24 * 60 * 60 });
}

export async function clearAuthCookie() { (await cookies()).delete(cookieName); }

export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    return db.user.findFirst({ where: { id: payload.sub, isActive: true } });
  } catch { return null; }
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function publicUser(user: { id: string; name: string; email: string; role: string; createdAt: Date }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}