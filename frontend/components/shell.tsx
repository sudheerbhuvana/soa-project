"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Truck, Container as ContainerIcon, LayoutGrid,
  ShieldCheck, Network, LogOut, Search,
} from "lucide-react";
import { Badge, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { carrierApi, containerApi, yardApi, gateApi } from "@/lib/api";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  keywords?: string[];
};

const nav: NavItem[] = [
  { href: "/dashboard",             label: "Overview",   icon: LayoutDashboard, shortcut: "G O", keywords: ["home", "metrics", "stats"] },
  { href: "/dashboard/carriers",    label: "Carriers",   icon: Truck,            shortcut: "G C", keywords: ["shipping", "lines", "maersk", "msc"] },
  { href: "/dashboard/containers",  label: "Containers", icon: ContainerIcon,   shortcut: "G N", keywords: ["boxes", "cargo"] },
  { href: "/dashboard/yard",        label: "Yard",       icon: LayoutGrid,      shortcut: "G Y", keywords: ["slots", "zone"] },
  { href: "/dashboard/gate",        label: "Gate",       icon: ShieldCheck,     shortcut: "G G", keywords: ["truck", "transactions"] },
  { href: "/dashboard/services",    label: "Services",   icon: Network,         shortcut: "G S", keywords: ["eureka", "microservices"] },
];

type SearchResult = {
  kind: "nav" | "carrier" | "container" | "slot" | "txn";
  id: string | number;
  title: string;
  sub?: string;
  href: string;
};

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  // --- search ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(0);

  // --- keyboard nav (G then X) ---
  const gPress = useRef<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("hf_token")) { router.push("/login"); return; }
    try { setUser(JSON.parse(localStorage.getItem("hf_user") || "null")); } catch {}
  }, [router]);

  // Global keyboard handlers
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      // ⌘K / Ctrl+K -> open search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        return;
      }
      // "g" then "X" navigation
      if (!isTyping) {
        if (gPress.current && Date.now() - gPress.current < 1500) {
          const key = e.key.toLowerCase();
          const map: Record<string, string> = { o: "/dashboard", c: "/dashboard/carriers", n: "/dashboard/containers", y: "/dashboard/yard", g: "/dashboard/gate", s: "/dashboard/services" };
          if (map[key]) {
            e.preventDefault();
            router.push(map[key]);
            gPress.current = null;
            return;
          }
        }
        if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
          gPress.current = Date.now();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setActive(0);
    }
  }, [searchOpen]);

  // Live search across nav + API data
  useEffect(() => {
    if (!searchOpen) return;
    const q = query.trim().toLowerCase();
    const out: SearchResult[] = [];

    // nav matches
    if (q.length === 0 || q.length >= 1) {
      nav.forEach((n) => {
        const hay = [n.label, n.href, ...(n.keywords ?? [])].join(" ").toLowerCase();
        if (!q || hay.includes(q)) {
          out.push({ kind: "nav", id: n.href, title: n.label, sub: n.href, href: n.href });
        }
      });
    }

    if (q.length === 0) {
      setResults(out);
      return;
    }

    // API data (don't block UI)
    (async () => {
      const local: SearchResult[] = [...out];
      try {
        const cs = await carrierApi.list();
        cs.filter((c) => c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
          .slice(0, 5).forEach((c) => local.push({
            kind: "carrier", id: c.carrierId, title: c.companyName, sub: c.email, href: "/dashboard/carriers",
          }));
      } catch {}
      try {
        const cs = await containerApi.list();
        cs.filter((c) => String(c.containerId).includes(q) || (c.cargoType || "").toLowerCase().includes(q) || (c.currentStatus || "").toLowerCase().includes(q))
          .slice(0, 5).forEach((c) => local.push({
            kind: "container", id: c.containerId, title: `Container #${c.containerId}`, sub: `${c.cargoType} • ${c.currentStatus}`, href: "/dashboard/containers",
          }));
      } catch {}
      try {
        const ss = await yardApi.list();
        ss.filter((s) => (s.zoneCode || "").toLowerCase().includes(q) || String(s.rowNumber).includes(q) || String(s.slotId).includes(q))
          .slice(0, 5).forEach((s) => local.push({
            kind: "slot", id: s.slotId, title: `Slot ${s.zoneCode}-${s.rowNumber}`, sub: s.isOccupied ? "Occupied" : "Free", href: "/dashboard/yard",
          }));
      } catch {}
      try {
        const ts = await gateApi.list();
        ts.filter((t) => String(t.gateTransactionId).includes(q) || (t.transactionType || "").toLowerCase().includes(q) || (t.truckLicense || "").toLowerCase().includes(q))
          .slice(0, 5).forEach((t) => local.push({
            kind: "txn", id: t.gateTransactionId, title: `Gate ${t.transactionType} • ${t.truckLicense}`, sub: `Container #${t.containerId}`, href: "/dashboard/gate",
          }));
      } catch {}
      setResults(local);
    })();
  }, [query, searchOpen]);

  function onSearchKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") {
      const r = results[active];
      if (r) { setSearchOpen(false); router.push(r.href); }
    }
  }

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
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex h-8 items-center gap-2 px-2 rounded-md border border-border bg-secondary/40 text-xs text-muted-foreground hover:bg-secondary/70 transition-colors"
          >
            <Search className="h-3 w-3" />
            <span className="font-mono">Quick search</span>
            <span className="ml-auto font-mono text-[10px] border border-border rounded px-1">⌘K</span>
          </button>
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden flex h-8 items-center gap-2 px-3 rounded-md border border-border bg-secondary/40 text-xs text-muted-foreground"
            >
              <Search className="h-3 w-3" /> Search
            </button>
            <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Online</Badge>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>

      {/* Command palette search */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="px-4 py-3 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKey}
                placeholder="Search pages, carriers, containers, slots, transactions…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <span className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</span>
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto py-1">
            {results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {query ? "No matches found" : "Start typing to search across HarborFlow"}
              </div>
            )}
            {results.map((r, i) => (
              <button
                key={`${r.kind}-${r.id}-${i}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => { setSearchOpen(false); router.push(r.href); }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm ${active === i ? "bg-secondary" : "hover:bg-secondary/50"}`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground w-16 shrink-0">
                  {r.kind === "nav" ? "PAGE" : r.kind === "carrier" ? "CARRIER" : r.kind === "container" ? "CONT." : r.kind === "slot" ? "SLOT" : "GATE"}
                </span>
                <span className="flex-1 truncate">{r.title}</span>
                {r.sub && <span className="text-xs text-muted-foreground truncate max-w-[40%]">{r.sub}</span>}
              </button>
            ))}
          </div>
          <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
            <span>⌘K</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
