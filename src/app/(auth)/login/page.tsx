import AuthForm from "@/components/ui/auth_form";
import { getUserFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getUserFromCookie();

  if (user?.role === "admin") redirect("/admin/admin-dashboard");
  if (user?.role === "user") redirect("/home");
  return <AuthForm type="login" />;
}
