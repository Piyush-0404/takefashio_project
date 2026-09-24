import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://takefashion-frontend.vercel.app",
]);

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const response = request.method === "OPTIONS"
    ? new NextResponse(null, { status: 204 })
    : NextResponse.next();

  if (origin && allowedOrigins.has(origin)) {
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
