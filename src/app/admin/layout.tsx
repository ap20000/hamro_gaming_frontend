import { Header } from "@/components/layout/admin-header";
import AdminNav from "@/components/layout/admin-nav";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--gaming-gray)]/10">
      <AdminNav />
      <div className="lg:pl-72">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
