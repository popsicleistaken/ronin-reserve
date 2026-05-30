"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, LogOut, Menu, X } from "lucide-react";
import { logout } from "./actions";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, exact: false },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const Sidebar = () => (
    <nav className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-border px-5 py-5">
        <div>
          <p className="font-heading text-base font-bold text-primary">Ronin Admin</p>
          <p className="text-xs text-muted-foreground">Management Portal</p>
        </div>
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Nav links */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition",
              isActive(href, exact)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 border-r border-border bg-card transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-secondary/60"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-heading text-base font-bold text-primary">Ronin Admin</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
