"use client";

import { BellIcon } from "lucide-react";
import { AdminDropdown } from "./admin-dropdown";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    if (pathname === "/admin/admin-dashboard") return "Dashboard";
    if (pathname === "/admin/game") return "Games";
    if (pathname === "/admin/user") return "Users";
    if (pathname === "/admin/order") return "Orders";
    if (pathname === "/admin/admin-chat") return "Chat";

    return "Admin Panel";
  }, [pathname]);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-[var(--gaming-white)] px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <div
        className="h-6 w-px bg-[var(--gaming-gray)]/40 lg:hidden"
        aria-hidden="true"
      />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <h2 className="font-sans text-lg font-semibold text-[var(--gaming-black)]">
            {pageTitle}
          </h2>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-[var(--gaming-black)] hover:text-[var(--gaming-gray)]/40"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            className="hidden lg:block lg:h-6 lg:w-px bg-[var(--gaming-gray)]/40"
            aria-hidden="true"
          />

          <AdminDropdown />
        </div>
      </div>
    </div>
  );
}
