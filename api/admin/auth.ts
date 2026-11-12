import { getFirebaseUser } from "../firebase-auth";

const ADMIN_EMAIL = "pevidalj@gmail.com";

export async function requireAdmin(request: Request) {
  const user = await getFirebaseUser(request);
  return user?.email?.toLowerCase() === ADMIN_EMAIL;
}
