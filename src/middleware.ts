import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("======= COOKIES RECEIVED =======");

  // Log raw cookie header (shows all cookies sent in the HTTP request)
  console.log("Raw cookie header:", request.headers.get("cookie"));

  request.cookies.getAll().forEach((cookie) => {
    console.log(`🍪 ${cookie.name}: ${cookie.value}`);
  });

  const isAuthenticated = request.cookies.get("jwt")?.value;
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  console.log("======= PARSED VALUES =======");
  console.log("🔐 JWT:", isAuthenticated ?? "Not Found");
  console.log("👤 Role:", role ?? "Not Found");
  console.log("📄 Path:", pathname);

  // Routes that need any logged-in user
  const protectedRoutes = ["/order", "claim-products"];

  // Routes that need admin user
  const adminRoutes = ["/admin/admin-dashboard", "/admin/admin-chat", "/admin/game", "/admin/order", "/admin/user"]; 

  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    // Not logged in, redirect to login for protected routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // For admin routes, check both token and role
    if (!isAuthenticated || role !== "admin") {
      // Not admin or not logged in, redirect to unauthorized or login
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/order","/claim-products", "/admin/:path*"], // protect /order and all /admin subroutes
};
