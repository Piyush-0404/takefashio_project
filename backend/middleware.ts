import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://takefashionproject-yhvw.vercel.app",
]);

function isAllowedOrigin(origin: string) {
  if (allowedOrigins.has(origin)) return true;
  return /^https:\/\/takefashionproject-yhvw(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = isAllowedOrigin(origin);

  if (request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    if (allowed) {
      preflight.headers.set("Access-Control-Allow-Origin", origin);
      preflight.headers.set("Access-Control-Allow-Credentials", "true");
      preflight.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
      preflight.headers.set("Access-Control-Allow-Headers", "Content-Type, Accept");
      preflight.headers.set("Access-Control-Max-Age", "86400");
    }
    return preflight;
  }

  const response = NextResponse.next();
  if (allowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Accept");
  }
  return response;
}

export default middleware;

export const config = {
  matcher: "/api/:path*",
};