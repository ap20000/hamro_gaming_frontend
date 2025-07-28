import { getUserFromCookie } from "@/lib/auth";
import MainNavbar from "./main-nav";

export default async function NavBarWrapper() {
  const user = await getUserFromCookie();

  return <MainNavbar user={user} />;
}
