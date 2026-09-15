"use client";
import { Network, ShieldCheck, Lock, Truck, Container as ContainerIcon, LayoutGrid, Anchor, ExternalLink, FileCode } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";

const services = [
  { id: "eureka", name: "eureka-server", port: 8761, role: "Service discovery registry", icon: Network, docs: false },
  { id: "gateway", name: "api-gateway", port: 8080, role: "Routing + JWT validation", icon: ShieldCheck, docs: false },
  { id: "auth", name: "auth-service", port: 8081, role: "JWT issue + bcrypt", icon: Lock, docs: true },
  { id: "carrier", name: "carrier-service", port: 8082, role: "Carriers CRUD · schema [carrier]", icon: Truck, docs: true },
  { id: "container", name: "container-service", port: 8083, role: "Containers CRUD · schema [container]", icon: ContainerIcon, docs: true },
  { id: "yard", name: "yard-service", port: 8084, role: "Slot allocation · schema [yard]", icon: LayoutGrid, docs: true },
  { id: "gate", name: "gate-service", port: 8085, role: "Truck gate log · schema [gate]", icon: Anchor, docs: true },
];

export default function ServicesPage() {
  return (
    <div className="p-6 space-y-4">
      <div><h1 className="text-xl font-semibold tracking-tight">Services</h1><p className="text-sm text-muted-foreground">Microservices registered with Eureka · routed through API Gateway on port 8080.</p></div>
      <Card>
        <table className="w-full text-sm tabular">
          <thead className="bg-secondary/40 border-b border-border">
            <tr>
              <th className="h-9 px-5 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="h-9 px-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Role</th>
              <th className="h-9 px-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Port</th>
              <th className="h-9 px-3 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="h-9 px-5 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">API docs</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5"><div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-mono text-sm">{s.name}</span></div></td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{s.role}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">:{s.port}</td>
                  <td className="px-3 py-2.5"><Badge variant="success">UP</Badge></td>
                  <td className="px-5 py-2.5 text-right">
                    {s.docs ? (
                      <div className="inline-flex items-center gap-1">
                        <a href={`http://localhost:${s.port}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">Swagger <ExternalLink className="h-3 w-3" /></a>
                        <span className="text-muted-foreground/40 mx-1">·</span>
                        <a href={`http://localhost:${s.port}/v3/api-docs`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">OAS <FileCode className="h-3 w-3" /></a>
                      </div>
                    ) : <span className="font-mono text-xs text-muted-foreground/40">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
