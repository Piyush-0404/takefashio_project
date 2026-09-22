import { currentUser } from "./auth";
import { badRequest } from "./http";

export async function getAdminOrResponse() {
  const user = await currentUser();
  if (!user) return badRequest("Authentication required", 401);
  if (user.role !== "ADMIN") return badRequest("Admin access required", 403);
  return user;
}