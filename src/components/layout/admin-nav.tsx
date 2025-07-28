"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Package,
  Gamepad2Icon,
  MessageCircle,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin/admin-dashboard", Icon: Home },
  { label: "Game", href: "/admin/game", Icon: Gamepad2Icon },
  { label: "Users", href: "/admin/user", Icon: Users },
  { label: "Orders", href: "/admin/order", Icon: Package },
  { label: "Chat", href: "/admin/admin-chat", Icon: MessageCircle },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[var(--gaming-black)] px-6 pb-4 shadow-sm border-r border-[var(--gaming-gray)]/20">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="font-orbitron  font-bold text-2xl text-[var(--gaming-white)]">
            Admin Panel
          </h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="mx-2 space-y-1">
                {links.map((link) => {
                  const isActive = pathname === link.href;

                  const linkClass = `
                    group flex gap-x-3 rounded-md p-3 text-sm font-medium font-sans transition-colors duration-200
                    ${
                      isActive
                        ? "bg-[var(--gaming-white)] text-[var(--gaming-black)]"
                        : "text-[var(--gaming-white)]/40 hover:text-[var(--gaming-black)] hover:bg-[var(--gaming-white)]"
                    }
                  `;

                  const iconClass = `
                    h-5 w-5 shrink-0 transition-colors duration-200
                    ${
                      isActive
                        ? "text-[var(--gaming-black)]"
                        : "text-[var(--gaming-white)]/40 group-hover:text-[var(--gaming-black)]"
                    }
                  `;
                  return (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass.trim()}>
                        <link.Icon className={iconClass.trim()} />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
