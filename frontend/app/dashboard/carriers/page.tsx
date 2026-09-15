"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, Button, Input, Label, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";
import { carrierApi, type Carrier } from "@/lib/api";

export default function CarriersPage() {
  const [items, setItems] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Carrier | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ companyName: "", email: "", password: "pass123", vesselIdentifier: "" });
  const [saving, setSaving] = useState(false);
  async function load() { setLoading(true); try { setItems(await carrierApi.list()); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  function openCreate() { setEditing(null); setForm({ companyName: "", email: "", password: "pass123", vesselIdentifier: "" }); setOpen(true); }
  function openEdit(c: Carrier) { setEditing(c); setForm({ companyName: c.companyName, email: c.email, password: "", vesselIdentifier: c.vesselIdentifier }); setOpen(true); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await carrierApi.update(editing.carrierId, form); else await carrierApi.create(form);
      toast.success(editing ? "Updated" : "Created"); setOpen(false); load();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  }
  async function remove(id: number) { if (!confirm("Delete?")) return; try { await carrierApi.remove(id); toast.success("Deleted"); load(); } catch (err: any) { toast.error(err.message); } }
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <div><h1 className="text-xl font-semibold tracking-tight">Carriers</h1><p className="text-sm text-muted-foreground">Shipping lines registered with HarborFlow.</p></div>
        <Button onClick={openCreate}><Plus className="h-3.5 w-3.5" /> New carrier</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit carrier" : "New carrier"}</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="p-6 space-y-3">
            <div className="space-y-1.5"><Label>Company name</Label><Input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Password</Label><Input type="text" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Vessel identifier</Label><Input required value={form.vesselIdentifier} onChange={(e) => setForm({ ...form, vesselIdentifier: e.target.value })} /></div>
          </form>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{editing ? "Save changes" : "Create carrier"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead className="w-16">ID</TableHead><TableHead>Company</TableHead><TableHead>Email</TableHead><TableHead>Vessel</TableHead><TableHead className="w-24"></TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-xs text-muted-foreground">Loading…</TableCell></TableRow>
              : items.length === 0 ? <TableRow><TableCell colSpan={5} className="text-xs text-muted-foreground">No carriers yet.</TableCell></TableRow>
              : items.map((c) => (
                <TableRow key={c.carrierId}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{c.carrierId}</TableCell>
                  <TableCell className="font-medium text-sm">{c.companyName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="font-mono text-xs">{c.vesselIdentifier}</TableCell>
                  <TableCell><div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(c.carrierId)}><Trash2 className="h-3.5 w-3.5 text-red-400" /></Button>
                  </div></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
