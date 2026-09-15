"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, Button, Input, Label, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { carrierApi, containerApi, type Carrier, type Container } from "@/lib/api";

const STATUSES = ["REGISTERED", "IN_YARD", "LOADED", "DEPARTED"];

export default function ContainersPage() {
  const [items, setItems] = useState<Container[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Container | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ carrierId: "", weight: "", cargoType: "Electronics", currentStatus: "REGISTERED" });
  const [saving, setSaving] = useState(false);
  async function load() { setLoading(true); try { const [c, ct] = await Promise.all([carrierApi.list(), containerApi.list()]); setCarriers(c); setItems(ct); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  function openCreate() { setEditing(null); setForm({ carrierId: carriers[0]?.carrierId?.toString() || "", weight: "", cargoType: "Electronics", currentStatus: "REGISTERED" }); setOpen(true); }
  function openEdit(c: Container) { setEditing(c); setForm({ carrierId: c.carrierId.toString(), weight: c.weight.toString(), cargoType: c.cargoType, currentStatus: c.currentStatus }); setOpen(true); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { carrierId: Number(form.carrierId), weight: Number(form.weight), cargoType: form.cargoType, currentStatus: form.currentStatus };
      if (editing) await containerApi.update(editing.containerId, payload); else await containerApi.create(payload);
      toast.success(editing ? "Updated" : "Registered"); setOpen(false); load();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  }
  async function remove(id: number) { if (!confirm("Delete?")) return; try { await containerApi.remove(id); toast.success("Deleted"); load(); } catch (err: any) { toast.error(err.message); } }
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <div><h1 className="text-xl font-semibold tracking-tight">Containers</h1><p className="text-sm text-muted-foreground">Registry managed by container-service.</p></div>
        <Button onClick={openCreate} disabled={carriers.length === 0}><Plus className="h-3.5 w-3.5" /> New container</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit container" : "Register container"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="p-6 space-y-3">
            <div className="space-y-1.5">
              <Label>Carrier</Label>
              <Select value={form.carrierId} onValueChange={(v) => setForm({ ...form, carrierId: v })}>
                <SelectTrigger><SelectValue placeholder="Select carrier" /></SelectTrigger>
                <SelectContent>{carriers.map((c) => <SelectItem key={c.carrierId} value={c.carrierId.toString()}>{c.companyName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Weight (t)</Label><Input type="number" step="0.1" required value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Cargo type</Label><Input required value={form.cargoType} onChange={(e) => setForm({ ...form, cargoType: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.currentStatus} onValueChange={(v) => setForm({ ...form, currentStatus: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </form>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{editing ? "Save" : "Register"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead className="w-16">ID</TableHead><TableHead>Carrier</TableHead><TableHead>Weight</TableHead><TableHead>Cargo</TableHead><TableHead>Status</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6} className="text-xs text-muted-foreground">Loading…</TableCell></TableRow>
              : items.length === 0 ? <TableRow><TableCell colSpan={6} className="text-xs text-muted-foreground">No containers yet.</TableCell></TableRow>
              : items.map((c) => (
                <TableRow key={c.containerId}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{c.containerId}</TableCell>
                  <TableCell className="text-sm">{carriers.find((cc) => cc.carrierId === c.carrierId)?.companyName ?? `Carrier ${c.carrierId}`}</TableCell>
                  <TableCell className="font-mono text-xs">{c.weight.toFixed(1)}</TableCell>
                  <TableCell className="text-sm">{c.cargoType}</TableCell>
                  <TableCell><Badge variant={c.currentStatus === "IN_YARD" ? "success" : c.currentStatus === "LOADED" ? "info" : c.currentStatus === "DEPARTED" ? "outline" : "secondary"}>{c.currentStatus}</Badge></TableCell>
                  <TableCell><div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(c.containerId)}><Trash2 className="h-3.5 w-3.5 text-red-400" /></Button>
                  </div></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
