import Link from "next/link";
import { ArrowRight, Network, ShieldCheck, Lock, Truck, Container as ContainerIcon, LayoutGrid, Anchor, Activity } from "lucide-react";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";

const services = [
  { name: "eureka-server", port: 8761, role: "discovery", icon: Network },
  { name: "api-gateway", port: 8080, role: "edge / jwt / lb", icon: ShieldCheck },
  { name: "auth-service", port: 8081, role: "jwt issuer", icon: Lock },
  { name: "carrier-service", port: 8082, role: "carriers CRUD", icon: Truck },
  { name: "container-service", port: 8083, role: "containers CRUD", icon: ContainerIcon },
  { name: "yard-service", port: 8084, role: "slot allocation", icon: LayoutGrid },
  { name: "gate-service", port: 8085, role: "truck gate log", icon: Anchor },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded bg-foreground text-background font-mono text-xs font-bold">H</div>
            <span className="font-mono text-sm font-semibold tracking-tight">harborflow</span>
            <Badge variant="outline" className="ml-2">v1.0.0</Badge>
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild><Link href="/docs">Docs</Link></Button>
            <Button variant="ghost" size="sm" asChild><Link href="/login">Sign in <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
          </nav>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="container py-20 md:py-28">
          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">All services operational</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
            Service-Oriented Architecture for port logistics, from carrier to gate.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            HarborFlow unifies carrier onboarding, container registry, yard slot allocation, and gate operations behind a JWT-secured API gateway with Eureka-based service discovery.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild><Link href="/login">Sign in to dashboard <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
            <Button variant="outline" asChild><Link href="/docs">Read the docs</Link></Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container py-12">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold">Service registry</h2>
              <p className="text-xs text-muted-foreground mt-1">Registered with Eureka on startup. Resolved by API Gateway via <code className="font-mono">lb://</code>.</p>
            </div>
            <Badge variant="success"><Activity className="h-3 w-3" /> 7 healthy</Badge>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm tabular">
              <thead className="bg-secondary/40 border-b border-border">
                <tr>
                  <th className="h-8 px-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="h-8 px-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Role</th>
                  <th className="h-8 px-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Port</th>
                  <th className="h-8 px-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <tr key={s.name} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5"><div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-mono">{s.name}</span></div></td>
                      <td className="px-3 py-2.5 text-muted-foreground">{s.role}</td>
                      <td className="px-3 py-2.5 font-mono text-muted-foreground">:{s.port}</td>
                      <td className="px-3 py-2.5"><Badge variant="success">UP</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">soa.capstone / harborflow</span>
          <Link href="/docs" className="hover:text-foreground">API docs →</Link>
        </div>
      </footer>
    </main>
  );
}
