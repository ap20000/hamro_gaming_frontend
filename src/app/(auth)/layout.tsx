// AuthLayout.tsx
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--gaming-black)] overflow-hidden py-8 px-4">
      {/* Decorative Background Element */}
      <div className="absolute left-1/4 w-150 h-150 border-2 border-[var(--gaming-electric-blue)] opacity-30 rotate-45 animate-pulse pointer-events-none z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">{children}</div>
    </div>
  );
}
