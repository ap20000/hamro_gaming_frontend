// src/app/page.tsx
import { getUserFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const user = await getUserFromCookie();

  if (user?.role === "admin") redirect("/admin/admin-dashboard");

  if (user?.role === "user") redirect("/home");

  redirect("/home");
}
