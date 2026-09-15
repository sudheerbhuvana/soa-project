"use client";
import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Box, ArrowRightFromLine } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { containerApi, yardApi, type Container, type YardSlot } from "@/lib/api";

export default function YardPage() {
  const [slots, setSlots] = useState<YardSlot[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  async function load() { setLoading(true); try { const [s, c] = await Promise.all([yardApi.list(), containerApi.list()]); setSlots(s); setContainers(c); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  const grouped = useMemo(() => { const g: Record<string, YardSlot[]> = {}; slots.forEach((s) => { (g[s.zoneCode] ||= []).push(s); }); Object.values(g).forEach((arr) => arr.sort((a, b) => a.rowNumber - b.rowNumber)); return g; }, [slots]);
  const zones = Object.keys(grouped).sort();
  const occupied = slots.filter((s) => s.isOccupied).length;
  const total = slots.length;
  const occupancyPct = total ? Math.round((occupied / total) * 100) : 0;
  const availableContainers = containers.filter((c) => (c.currentStatus === "REGISTERED" || c.currentStatus === "IN_YARD") && !slots.some((s) => s.isOccupied && s.containerId === c.containerId));
  async function place() { if (!selectedContainer) { toast.error("Pick a container first"); return; } setPlacing(true); try { await yardApi.place(Number(selectedContainer), selectedZone || undefined); toast.success("Container placed"); setSelectedContainer(""); setSelectedZone(""); load(); } catch (err: any) { toast.error(err.message); } finally { setPlacing(false); } }
  async function release(containerId: number) { try { await yardApi.release(containerId); toast.success("Released"); load(); } catch (err: any) { toast.error(err.message); } }
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-baseline justify-between">
        <div><h1 className="text-xl font-semibold tracking-tight">Yard</h1><p className="text-sm text-muted-foreground">Slot allocation managed by yard-service.</p></div>
        <Button variant="outline" onClick={load}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Occupancy</div><div className="text-3xl font-semibold tabular tracking-tight mt-2">{occupancyPct}%</div><div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${occupancyPct}%` }} /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Slots</div><div className="text-3xl font-semibold tabular tracking-tight mt-2">{total}</div><div className="mt-1 text-xs text-muted-foreground font-mono tabular">{occupied} occ · {total - occupied} free</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Zones</div><div className="text-3xl font-semibold tabular tracking-tight mt-2">{zones.length}</div><div className="mt-1 text-xs text-muted-foreground font-mono">{zones.join(" · ")}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Available</div><div className="text-3xl font-semibold tabular tracking-tight mt-2">{availableContainers.length}</div><div className="mt-1 text-xs text-muted-foreground">containers ready</div></CardContent></Card>
      </div>
      <Card>
        <div className="border-b border-border px-5 py-3"><h2 className="text-sm font-semibold">Place container → yard</h2><p className="text-xs text-muted-foreground mt-0.5">POST /api/yard/place — assigns first available slot</p></div>
        <CardContent className="p-5 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px] space-y-1.5"><Label>Container</Label>
            <Select value={selectedContainer} onValueChange={setSelectedContainer}><SelectTrigger><SelectValue placeholder="Pick a container" /></SelectTrigger>
              <SelectContent>{availableContainers.map((c) => <SelectItem key={c.containerId} value={c.containerId.toString()}>#{c.containerId} · {c.cargoType} · {c.weight}t</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="min-w-[150px] space-y-1.5"><Label>Zone</Label>
            <Select value={selectedZone} onValueChange={setSelectedZone}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent>{zones.map((z) => <SelectItem key={z} value={z}>Zone {z}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={place} disabled={placing || !selectedContainer}>{placing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Box className="h-3.5 w-3.5" />}Place</Button>
        </CardContent>
      </Card>
      {loading ? <div className="text-xs text-muted-foreground">Loading…</div> : (
        <div className="space-y-3">
          {zones.map((zone) => (
            <Card key={zone}>
              <div className="border-b border-border px-5 py-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Zone {zone}</h2><span className="font-mono text-xs text-muted-foreground tabular">{grouped[zone].filter((s) => s.isOccupied).length} / {grouped[zone].length}</span></div>
              <CardContent className="p-5">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {grouped[zone].map((slot) => (
                    <div key={slot.slotId} className={`relative p-2.5 rounded-md border font-mono text-xs tabular transition-colors ${slot.isOccupied ? "border-foreground/20 bg-secondary/50" : "border-dashed border-border bg-transparent"}`}>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Row {String(slot.rowNumber).padStart(2, "0")}</div>
                      <div className="mt-1 text-foreground">{slot.isOccupied ? `#${slot.containerId}` : "—"}</div>
                      {slot.isOccupied && (
                        <button onClick={() => release(slot.containerId!)} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground" title="Release">
                          <ArrowRightFromLine className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
