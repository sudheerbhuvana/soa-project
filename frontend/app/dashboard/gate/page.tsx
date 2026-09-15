"use client";
import { useEffect, useState } from "react";
import { Plus, Loader2, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, Button, Input, Label, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { containerApi, gateApi, type Container, type GateTransaction } from "@/lib/api";

export default function GatePage() {
  const [items, setItems] = useState<GateTransaction[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ containerId: "", transactionType: "CHECK_IN", truckLicense: "" });
  const [saving, setSaving] = useState(false);
  async function load() { setLoading(true); try { const [t, c] = await Promise.all([gateApi.list(), containerApi.list()]); setItems([...t].sort((a: any, b: any) => b.gateTransactionId - a.gateTransactionId)); setContainers(c); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  function openCreate() { setForm({ containerId: containers[0]?.containerId?.toString() || "", transactionType: "CHECK_IN", truckLicense: "" }); setOpen(true); }
  async function submit(e: React.FormEvent) { e.preventDefault(); setSaving(true); try { await gateApi.create({ containerId: Number(form.containerId), transactionType: form.transactionType, truckLicense: form.truckLicense }); toast.success("Logged"); setOpen(false); load(); } catch (err: any) { toast.error(err.message); } finally { setSaving(false); } }
  const checkIns = items.filter((t) => t.transactionType === "CHECK_IN").length;
  const checkOuts = items.filter((t) => t.transactionType === "CHECK_OUT").length;
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <div><h1 className="text-xl font-semibold tracking-tight">Gate</h1><p className="text-sm text-muted-foreground">Truck check-in / check-out log via gate-service.</p></div>
        <Button onClick={openCreate} disabled={containers.length === 0}><Plus className="h-3.5 w-3.5" /> Log transaction</Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card><CardContent className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Total</div><div className="text-3xl font-semibold tabular tracking-tight mt-2">{items.length}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Check-ins</div><div className="text-3xl font-semibold tabular tracking-tight mt-2 text-emerald-400">{checkIns}</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Check-outs</div><div className="text-3xl font-semibold tabular tracking-tight mt-2 text-amber-400">{checkOuts}</div></CardContent></Card>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New gate transaction</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="p-6 space-y-3">
            <div className="space-y-1.5"><Label>Container</Label>
              <Select value={form.containerId} onValueChange={(v) => setForm({ ...form, containerId: v })}><SelectTrigger><SelectValue placeholder="Select container" /></SelectTrigger>
                <SelectContent>{containers.map((c) => <SelectItem key={c.containerId} value={c.containerId.toString()}>#{c.containerId} · {c.cargoType}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Type</Label>
              <Select value={form.transactionType} onValueChange={(v) => setForm({ ...form, transactionType: v })}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="CHECK_IN">Check-in</SelectItem><SelectItem value="CHECK_OUT">Check-out</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Truck license</Label><Input required value={form.truckLicense} onChange={(e) => setForm({ ...form, truckLicense: e.target.value })} placeholder="TN-39-AB-1234" /></div>
          </form>
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Log transaction</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead className="w-16">ID</TableHead><TableHead className="w-20">Container</TableHead><TableHead className="w-28">Type</TableHead><TableHead>Truck</TableHead><TableHead>Timestamp</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-xs text-muted-foreground">Loading…</TableCell></TableRow>
              : items.length === 0 ? <TableRow><TableCell colSpan={5} className="text-xs text-muted-foreground">No transactions yet.</TableCell></TableRow>
              : items.map((t) => (
                <TableRow key={t.gateTransactionId}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{t.gateTransactionId}</TableCell>
                  <TableCell className="font-mono text-xs">#{t.containerId}</TableCell>
                  <TableCell><Badge variant={t.transactionType === "CHECK_IN" ? "success" : "warning"}>{t.transactionType === "CHECK_IN" ? <ArrowDownToLine className="h-3 w-3" /> : <ArrowUpFromLine className="h-3 w-3" />}{t.transactionType === "CHECK_IN" ? "In" : "Out"}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{t.truckLicense}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{new Date(t.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
