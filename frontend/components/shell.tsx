"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Truck, Container as ContainerIcon, LayoutGrid, ShieldCheck, Network, LogOut, Search } from "lucide-react";
import { Badge, Button } from "@/components/ui";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, shortcut: "G O" },
  { href: "/dashboard/carriers", label: "Carriers", icon: Truck, shortcut: "G C" },
  { href: "/dashboard/containers", label: "Containers", icon: ContainerIcon, shortcut: "G N" },
  { href: "/dashboard/yard", label: "Yard", icon: LayoutGrid, shortcut: "G Y" },
  { href: "/dashboard/gate", label: "Gate", icon: ShieldCheck, shortcut: "G G" },
  { href: "/dashboard/services", label: "Services", icon: Network, shortcut: "G S" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  useEffect(() => {
    if (!localStorage.getItem("hf_token")) { router.push("/login"); return; }
    try { setUser(JSON.parse(localStorage.getItem("hf_user") || "null")); } catch {}
  }, [router]);
  function logout() {
    localStorage.removeItem("hf_token");
    localStorage.removeItem("hf_user");
    router.push("/login");
  }
  const current = nav.find((n) => n.href === pathname);
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/30">
        <div className="h-14 flex items-center px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded bg-foreground text-background font-mono text-xs font-bold">H</div>
            <span className="font-mono text-sm font-semibold tracking-tight">harborflow</span>
          </Link>
        </div>
        <div className="p-2">
          <div className="flex h-8 items-center gap-2 px-2 rounded-md border border-border bg-secondary/40 text-xs text-muted-foreground">
            <Search className="h-3 w-3" /><span className="font-mono">Quick search</span>
            <span className="ml-auto font-mono text-[10px]">⌘K</span>
          </div>
        </div>
        <nav className="flex-1 px-2 py-1 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
                <Icon className="h-3.5 w-3.5" /><span className="flex-1">{item.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{item.shortcut}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border">
          {user && (
            <div className="px-2 py-2 mb-1">
              <div className="font-mono text-xs truncate">{user.email}</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{user.role}</div>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Operations</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{current?.label ?? "Overview"}</span>
          </div>
          <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Online</Badge>
        </header>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
