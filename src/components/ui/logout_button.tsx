"use client";

import { logout } from "@/api/auth_api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-center px-4 py-2 text-sm font-sans border border-red-500 rounded-lg text-red-700 hover:border-red-400 hover:text-red-500"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
