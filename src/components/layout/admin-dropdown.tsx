"use client";

import { useState } from "react";
import { ChevronDownIcon, UserCircle2 } from "lucide-react";
import Link from "next/link";
import LogoutButton from "../ui/logout_button";

const userNavigation = [
  { name: "Your profile", href: "/admin/profile" },
  { name: "Settings", href: "/admin/settings" },
];

export function AdminDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      tabIndex={0}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="flex items-center gap-x-2 rounded-full bg-[var(--ganing-gray)]/40 p-1.5 text-sm font-semibold text-[var(--gaming-black)] shadow-sm ring-1 ring-inset ring-[var(--gaming-gray)]/80 hover:bg-[var(--gaming-gray)]/10"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="hidden lg:flex lg:items-center lg:justify-evenly">
          <UserCircle2 size={20} />
          <span className="ml-2 text-sm font-semibold font-sans">Admin</span>
          <ChevronDownIcon
            className="ml-2 h-5 w-4 text-[var(--gaming-gray)]/60"
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[var(--gaming-white)] py-1 shadow-lg ring-1 ring-[var(--gaming-black)] ring-opacity-5">
          {/* Render links */}
          {userNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 text-sm text-[var(--gaming-gray)] hover:bg-[var(--gaming-gray)]/10"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div onClick={() => setIsOpen(false)} className="px-2 py-1">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
