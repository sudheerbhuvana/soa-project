"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, Container as ContainerIcon, LayoutGrid, ShieldCheck, ArrowUpRight, Activity } from "lucide-react";
import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from "@/components/ui";
import { carrierApi, containerApi, yardApi, gateApi, type Carrier, type Container as ContainerType, type YardSlot, type GateTransaction } from "@/lib/api";

function Metric({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: "ok" | "warn" | "danger" | "neutral" }) {
  const dot = accent === "ok" ? "bg-emerald-500" : accent === "warn" ? "bg-amber-500" : accent === "danger" ? "bg-red-500" : "bg-muted-foreground";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        </div>
        <div className="mt-3 text-3xl font-semibold tabular tracking-tight">{value}</div>
        {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [containers, setContainers] = useState<ContainerType[]>([]);
  const [slots, setSlots] = useState<YardSlot[]>([]);
  const [transactions, setTransactions] = useState<GateTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([carrierApi.list(), containerApi.list(), yardApi.list(), gateApi.list()])
      .then(([c, ct, y, g]) => {
        if (c.status === "fulfilled") setCarriers(c.value);
        if (ct.status === "fulfilled") setContainers(ct.value);
        if (y.status === "fulfilled") setSlots(y.value);
        if (g.status === "fulfilled") setTransactions(g.value);
      }).finally(() => setLoading(false));
  }, []);

  const occupiedSlots = slots.filter((s) => s.isOccupied).length;
  const totalSlots = slots.length;
  const occupancyPct = totalSlots ? Math.round((occupiedSlots / totalSlots) * 100) : 0;
  const inbound = transactions.filter((t) => t.transactionType === "CHECK_IN").length;
  const outbound = transactions.filter((t) => t.transactionType === "CHECK_OUT").length;
  const occupancyAccent = occupancyPct > 85 ? "danger" : occupancyPct > 60 ? "warn" : "ok";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live snapshot aggregated across carriers, containers, yard, and gate services.</p>
        </div>
        <div className="font-mono text-xs text-muted-foreground">refresh 30s</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric label="Carriers" value={loading ? "—" : String(carriers.length)} sub="registered" accent="ok" />
        <Metric label="Containers" value={loading ? "—" : String(containers.length)} sub="in registry" accent="ok" />
        <Metric label="Yard occupancy" value={loading ? "—" : `${occupancyPct}%`} sub={`${occupiedSlots} / ${totalSlots} slots`} accent={occupancyAccent} />
        <Metric label="Gate TX" value={loading ? "—" : String(transactions.length)} sub={`${inbound} in · ${outbound} out`} accent="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold">Recent containers</h2>
              <p className="text-xs text-muted-foreground">Latest 5 entries from container-service</p>
            </div>
            <Link href="/dashboard/containers" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              All containers <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Carrier</TableHead><TableHead>Weight</TableHead><TableHead>Cargo</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-muted-foreground text-xs">Loading…</TableCell></TableRow>
              ) : containers.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-muted-foreground text-xs">No containers yet.</TableCell></TableRow>
              ) : containers.slice(0, 5).map((c) => (
                <TableRow key={c.containerId}>
                  <TableCell className="font-mono text-xs">#{c.containerId}</TableCell>
                  <TableCell className="text-xs">Carrier {c.carrierId}</TableCell>
                  <TableCell className="font-mono text-xs">{c.weight.toFixed(1)}t</TableCell>
                  <TableCell className="text-xs">{c.cargoType}</TableCell>
                  <TableCell><Badge variant={c.currentStatus === "IN_YARD" ? "success" : c.currentStatus === "LOADED" ? "info" : c.currentStatus === "DEPARTED" ? "outline" : "secondary"}>{c.currentStatus}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Gate activity</h2>
            <p className="text-xs text-muted-foreground">In vs out today</p>
          </div>
          <CardContent className="p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Inbound</span>
                <span className="font-mono text-sm">{inbound}</span>
              </div>
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${transactions.length ? (inbound / transactions.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Outbound</span>
                <span className="font-mono text-sm">{outbound}</span>
              </div>
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${transactions.length ? (outbound / transactions.length) * 100 : 0}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pt-2">
        <Activity className="h-3 w-3" /> Aggregated from /api/* via Spring Cloud Gateway
      </div>
    </div>
  );
}
