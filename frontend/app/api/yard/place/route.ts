import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function POST(req: Request) {
  const { containerId, zoneCode } = await req.json();
  const store = getStore();
  let slot = store.slots.find((s: any) => !s.isOccupied && (!zoneCode || s.zoneCode === zoneCode));
  if (!slot) return NextResponse.json({ message: "No empty yard slots available" }, { status: 400 });
  store.slots = store.slots.map((s: any) => s.containerId === containerId ? { ...s, isOccupied: false, containerId: null } : s);
  slot = { ...slot, isOccupied: true, containerId };
  store.slots = store.slots.map((s: any) => s.slotId === slot.slotId ? slot : s);
  store.containers = store.containers.map((c: any) => c.containerId === containerId ? { ...c, currentStatus: "IN_YARD" } : c);
  return NextResponse.json(slot);
}
