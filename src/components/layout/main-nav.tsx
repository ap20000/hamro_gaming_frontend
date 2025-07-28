"use client";

import Link from "next/link";
import LogoutButton from "../ui/logout_button";
import { Gamepad2, Menu, Search, User, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MainNavbar({
  user,
}: {
  user: { token: string; role: string } | null;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const encoded = encodeURIComponent(trimmed);
    router.push(`${pathname}?search=${encoded}`);
    setSearchTerm("");
  };

  const links = [
    { href: "/products/accounts", label: "Accounts" },
    { href: "/products/giftcard", label: "Gift Card" },
    { href: "/products/top-up", label: "Direct top-up" },
  ];

  return (
    <nav className="bg-gaming-black border-b border-gaming-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center gap-3">
              {/* Added flex and gap here */}
              <div className="w-10 h-10 bg-gradient-to-br from-gaming-blue to-gaming-black rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-gaming-white" />
              </div>
              <span className="font-orbitron text-base md:text-xl font-bold text-gaming-white uppercase">
                Hamro Gaming Store
              </span>
            </Link>
          </div>
          {/* Naviagtion Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gaming-white/80 hover:text-gaming-electric-blue px-3 py-2 text-sm font-medium font-sans transition-colors duration-300 tracking-wide uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gaming-white/80" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2 bg-gaming-gray border border-gaming-gray rounded-lg text-gaming-white 
        placeholder-gaming-white/60 focus:outline-none focus:border-gaming-blue font-sans"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/cart" aria-label="My Cart">
                  <ShoppingCart
                    xlinkTitle="My Cart"
                    className="p-2 text-gaming-white/80 hover:text-gaming-electric-blue transition-colors w-10 h-10"
                  />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 text-gaming-white/80 hover:text-gaming-electric-blue transition-colors"
                  >
                    <User className="w-6 h-6" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gaming-gray border border-gaming-white/20 rounded-lg shadow-lg">
                      <Link
                        href="/order"
                        className="block px-4 py-2 text-gaming-white/80 hover:text-gaming-electric-blue hover:bg-gaming-white/10 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        href="/claim-products"
                        className="block px-4 py-2 text-gaming-white/80 hover:text-gaming-electric-blue hover:bg-gaming-white/10 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Claim Products
                      </Link>
                      <div className="ml-2">
                        <LogoutButton />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-gaming-white/70 text-base font-medium font-sans hover:text-gaming-electric-blue transition-colors"
                >
                  Sign in
                </Link>
                <p className="text-gaming-white/70 text-base font-medium font-sans">
                  /
                </p>
                <Link
                  href="/register"
                  className="text-gaming-white/70 text-base font-medium font-sans hover:text-gaming-electric-blue transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gaming-white/80 hover:text-gaming-electric-blue transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-3 py-2">
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gaming-white/80" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search games, gift cards..."
                  className="w-full pl-10 pr-4 py-2 bg-gaming-gray border border-gaming-gray rounded-lg text-gaming-white placeholder-gaming-white/60 focus:outline-none focus:border-gaming-blue font-sans"
                />
              </div>
            </form>
          </div>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gaming-white/80 hover:text-gaming-electric-blue block px-3 py-2 text-base font-medium font-sans transition-colors duration-300 uppercase tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
