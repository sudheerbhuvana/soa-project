"use client";
import { useEffect, useState } from "react";
import { Plus, Loader2, CheckCircle2, XCircle, Truck } from "lucide-react";
import { toast } from "sonner";
import { Card, Button, Input, Label, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { carrierApi, containerApi, jobApi, type Carrier, type Container, type Job } from "@/lib/api";

const STATUS_VARIANT: Record<string, "success" | "info" | "warning" | "outline"> = {
  ASSIGNED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "outline",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ carrierId: "", containerId: "", truckLicense: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [j, c, ct] = await Promise.all([jobApi.list(), carrierApi.list(), containerApi.list()]);
      setJobs(j); setCarriers(c); setContainers(ct);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm({ carrierId: carriers[0]?.carrierId?.toString() || "", containerId: "", truckLicense: "" });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await jobApi.create({
        carrierId: Number(form.carrierId),
        containerId: Number(form.containerId),
        truckLicense: form.truckLicense,
      });
      toast.success("Job assigned");
      setOpen(false);
      load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  async function setStatus(id: number, status: string) {
    try { await jobApi.setStatus(id, status); toast.success(`Marked ${status}`); load(); }
    catch (err: any) { toast.error(err.message); }
  }

  async function remove(id: number) {
    if (!confirm("Delete this job?")) return;
    try { await jobApi.remove(id); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  }

  const counts = {
    ASSIGNED: jobs.filter(j => j.status === "ASSIGNED").length,
    IN_PROGRESS: jobs.filter(j => j.status === "IN_PROGRESS").length,
    COMPLETED: jobs.filter(j => j.status === "COMPLETED").length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">Carrier-to-container work orders managed by carrier-service.</p>
        </div>
        <Button onClick={openCreate} disabled={carriers.length === 0 || containers.length === 0}>
          <Plus className="h-3.5 w-3.5" /> Assign job
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><Card className="border-0 shadow-none"><div className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Assigned</div><div className="text-3xl font-semibold tabular tracking-tight mt-2 text-sky-400">{counts.ASSIGNED}</div></div></Card></Card>
        <Card><Card className="border-0 shadow-none"><div className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">In progress</div><div className="text-3xl font-semibold tabular tracking-tight mt-2 text-amber-400">{counts.IN_PROGRESS}</div></div></Card></Card>
        <Card><Card className="border-0 shadow-none"><div className="p-5"><div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Completed</div><div className="text-3xl font-semibold tabular tracking-tight mt-2 text-emerald-400">{counts.COMPLETED}</div></div></Card></Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign job</DialogTitle></DialogHeader>
          <form onSubmit={submit} className="p-6 space-y-3">
            <div className="space-y-1.5">
              <Label>Carrier</Label>
              <Select value={form.carrierId} onValueChange={(v) => setForm({ ...form, carrierId: v })}>
                <SelectTrigger><SelectValue placeholder="Select carrier" /></SelectTrigger>
                <SelectContent>{carriers.map((c) => <SelectItem key={c.carrierId} value={c.carrierId.toString()}>{c.companyName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Container</Label>
              <Select value={form.containerId} onValueChange={(v) => setForm({ ...form, containerId: v })}>
                <SelectTrigger><SelectValue placeholder="Select container" /></SelectTrigger>
                <SelectContent>{containers.map((c) => <SelectItem key={c.containerId} value={c.containerId.toString()}>#{c.containerId} · {c.cargoType}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Truck license</Label><Input required value={form.truckLicense} onChange={(e) => setForm({ ...form, truckLicense: e.target.value })} placeholder="TN-39-AB-1234" /></div>
          </form>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Container</TableHead>
              <TableHead>Truck</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="w-32"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-xs text-muted-foreground">Loading…</TableCell></TableRow>
            ) : jobs.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-xs text-muted-foreground">No jobs yet. Assign one to get started.</TableCell></TableRow>
            ) : jobs.map((j) => (
              <TableRow key={j.jobId}>
                <TableCell className="font-mono text-xs text-muted-foreground">#{j.jobId}</TableCell>
                <TableCell className="text-sm">{carriers.find(c => c.carrierId === j.carrierId)?.companyName ?? `Carrier ${j.carrierId}`}</TableCell>
                <TableCell className="font-mono text-xs">#{j.containerId}</TableCell>
                <TableCell className="font-mono text-xs">{j.truckLicense}</TableCell>
                <TableCell><Badge variant={STATUS_VARIANT[j.status] ?? "secondary"}>{j.status}</Badge></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{j.assignedAt ? new Date(j.assignedAt).toLocaleString() : "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {j.status === "ASSIGNED" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(j.jobId, "IN_PROGRESS")}><Truck className="h-3 w-3" /></Button>
                    )}
                    {j.status !== "COMPLETED" && j.status !== "CANCELLED" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(j.jobId, "COMPLETED")}><CheckCircle2 className="h-3 w-3 text-emerald-400" /></Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => remove(j.jobId)}><XCircle className="h-3 w-3 text-red-400" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}