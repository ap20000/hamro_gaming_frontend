import { ReactNode } from "react";
import NavBarWrapper from "@/components/layout/navbar-wrapper";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex flex-col  min-h-screen bg-gaming-black">
      <NavBarWrapper />
      <main className="flex-1">{children}</main>
    </div>
  );
}
