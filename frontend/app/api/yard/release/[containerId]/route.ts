import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function POST(_req: Request, { params }: { params: { containerId: string } }) {
  const containerId = Number(params.containerId);
  const store = getStore();
  const slot = store.slots.find((s: any) => s.containerId === containerId);
  if (!slot) return NextResponse.json({ message: "No slot holds this container" }, { status: 404 });
  store.slots = store.slots.map((s: any) => s.slotId === slot.slotId ? { ...s, isOccupied: false, containerId: null } : s);
  store.containers = store.containers.map((c: any) => c.containerId === containerId ? { ...c, currentStatus: "LOADED" } : c);
  return NextResponse.json({ ...slot, isOccupied: false, containerId: null });
}
