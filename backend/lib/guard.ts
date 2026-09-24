import { currentUser } from "./auth";
import { badRequest } from "./http";

export async function getUserOrResponse() {
  const user = await currentUser();
  return user ?? badRequest("Authentication required", 401);
}