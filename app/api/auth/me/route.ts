import { currentUser, publicUser } from "@/lib/auth";
import { badRequest, ok } from "@/lib/http";

export async function GET() {
  const user = await currentUser();
  return user ? ok({ user: publicUser(user) }) : badRequest("Authentication required", 401);
}