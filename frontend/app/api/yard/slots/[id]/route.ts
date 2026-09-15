import { NextResponse } from "next/server";
import { getStore } from "@/lib/mock-db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const s = getStore().slots.find((x: any) => x.slotId === id);
  if (!s) return NextResponse.json({ message: "not found" }, { status: 404 });
  return NextResponse.json(s);
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const store = getStore();
  const idx = store.slots.findIndex((x: any) => x.slotId === id);
  if (idx < 0) return NextResponse.json({ message: "not found" }, { status: 404 });
  store.slots[idx] = { ...store.slots[idx], zoneCode: body.zoneCode, rowNumber: Number(body.rowNumber), isOccupied: !!body.isOccupied, containerId: body.containerId ?? null };
  return NextResponse.json(store.slots[idx]);
}
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const store = getStore();
  store.slots = store.slots.filter((x: any) => x.slotId !== id);
  return new NextResponse(null, { status: 204 });
}
