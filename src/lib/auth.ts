import { cookies } from "next/headers";


export async function getUserFromCookie() {
  const cookieStore = await cookies();

  const token = cookieStore.get("jwt")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token || !role) return null;

  return { token, role };
}