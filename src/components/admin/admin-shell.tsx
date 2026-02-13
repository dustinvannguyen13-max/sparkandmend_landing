"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/utils";
import { Calendar, LayoutGrid, LineChart, LogOut, Menu, Tag } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Metrics", href: "/dashboard/metrics", icon: LineChart },
  { label: "Offers", href: "/dashboard/offers", icon: Tag },
];

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 border-r border-border/60 bg-card/80 px-4 py-6">
          <div className="flex w-full flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Admin
              </p>
              <h2 className="text-lg font-semibold text-foreground">Spark &amp; Mend</h2>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col gap-6 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                      Admin
                    </p>
                    <h2 className="text-lg font-semibold text-foreground">
                      Spark &amp; Mend
                    </h2>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="justify-start gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="text-sm font-semibold text-foreground">Admin dashboard</div>
            <div className="h-9 w-9" />
          </div>
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
